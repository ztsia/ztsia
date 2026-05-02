# Daily Cron runner (`daily_cron`) Architecture

This document explains the architecture and detailed execution flow of the `daily_cron` module (frequently referred to as Agent 5), which operates as an asynchronous background task runner integrated directly into the FastAPI lifespan context. 

## Overview

`daily_cron` manages long-running, scheduled backend activities. Instead of relying on external scheduling engines (like Celery or Cloud Scheduler), it spins up independent `asyncio` loops when the FastAPI application starts. 

The architecture consists of three infinite loops defined in `runner.py`:
1. **Dispatcher Loop (`_dispatcher_loop`)** - Runs every **60 seconds**.
2. **Hourly Loop (`_hourly_loop`)** - Runs every **3600 seconds (1 hour)**.
3. **Daily Loop (`_daily_loop`)** - Checks every **60 seconds**, triggers jobs exactly *once per user per day* at **06:00 AM local time**.

---

## Detailed Execution Flows

### 1. Dispatcher Loop (Every 60 Seconds)
**Purpose**: Execute immediate delivery of push notifications via Firebase Cloud Messaging (FCM).
**Component**: `dispatcher.py` -> `dispatch_pending_notifications()`

**Flow:**
1. **Query**: Selects all rows from the `notifications` table where `status = 'pending'` and `send_time <= currentTime`.
2. **Batching**: Iterate through the fetched notifications.
3. **Token Lookup**: For each notification, looks up the target user's `device_tokens` (FCM tokens).
4. **Dispatch**: Formats a MulticastMessage and sends it via Firebase Admin SDK.
5. **Outcome Handling**:
   - **Success**: If successful (`success_count > 0`), the notification row is deleted.
   - **Failure**: If all tokens fail, the notification's `retry_count` is incremented. If the count reaches `MAX_RETRIES` (3), the `status` is marked as `'failed'`.
   
### 2. Hourly Loop (Every 1 Hour)
**Purpose**: Run system-wide discovery, cleanup, and populate time-based reminders.

**Sequence of Jobs:**
1. **Job I - LMS Ingestion (`ingestion_job.py` -> `run_ingestion_all()`)**
   - Discovers new LMS courses.
   - Syncs enrollments.
   - Triggers the full `run_ingestion` graph (Agent 1) to fetch and process learning materials from the LMS.

2. **Job A - Cleanup (`cleanup.py` -> `run_cleanup()`)**
   - System maintenance routine to prune stale, redundant, or expired records.

3. **Job B - Notification Populator (`populator.py` -> `populate_notifications()`)**
   - **User Constraints**: Fetches all `user_preferences` settings regarding task and event reminders.
   - **Look Ahead**: Calculates a timezone-aware look-ahead window encompassing up to 3 days + 1 hour (`MAX_OFFSET_MIN = 4320`).
   - **Calendar Events**: Fetches upcoming events (excluding quizzes) and queues push notifications in the database based on the user's explicit offset preferences.
   - **Tasks**: Scans upcoming tasks that are due within the look-ahead window.
   - **Storage**: Inserts the notification parameters as rows into the `notifications` table (with `status = 'pending'`). It uses DB `UNIQUE` constraints to deduplicate and silently ignores duplicates.

### 3. Daily Loop (06:00 AM Local User Time)
**Purpose**: Manage daily planner logistics, analytics, and overdue rescheduling on a per-user schedule.
**Trigger**: Checked every 60s. Fires only when the user's timezone crosses exactly 06:00 AM (local time) and hasn't run yet for that UTC date.

**Sequence of Jobs per User:**
1. **Job E - Analytics Refresh** *(Placeholder)*
   - Dedicated slot for daily analytics generation and statistics aggregation.

2. **Job D - Overdue Reschedule (`reschedule.py` -> `run_overdue_reschedule(user)`)**
   - **Scan**: Finds user `calendar_events` where `event_type = 'work_session'`, `status = 'scheduled'`, but `end_time` has passed (Missed Sessions).
   - **Execution**: Invokes Agent 4 (Scheduler Graph) directly with `trigger_type="missed_event"`.
   - **Outcome**: 
     - If feasible, Agent 4 reschedules it and the old event is marked `'cancelled'`.
     - If it hits a hard deadline, or fails `MAX_RESCHEDULE` (3) times, it is abandoned.
     - Queues an immediate failure notification to alert the user that a session dropped off the calendar.

3. **Job C - Daily Quiz Planner (`quiz_planner.py` -> `run_daily_quiz_planner(user)`)**
   - Generates up to 3 quizzes per day via Agent 3 (`run_quiz()`) for spaced repetition and consolidation.
   - **Generation Priorities**:
     1. *Consolidation*: Synthesizes quizzes based on today's classes and topics learned this week.
     2. *FSRS Overdue*: Concepts where `next_review_date < today`.
     3. *FSRS Due Today*: Concepts exactly matching `next_review_date = today`.
   - **Deduplication**: Checks `daily_planner_log` to prevent duplicate quizzes from triggering twice.
   - **Scheduling**: Passes the created quiz asynchronously into Agent 4 (`fast_schedule`) with **Human-in-the-Loop Auto Approve** (`auto_approve=True`). Agent 4 determines the optimal time block today, executes validation, and commits the session to the database.
   - **Reminders**: Queues an immediate database entry for a `15-minute` precursor push notification prior to the scheduled quiz time.
   
---

## Initialization
The entire system is bootstrap initialized via `start_background_tasks()` within `fyp-ai-service/app/main.py`. This function:
1. Calls `init_firebase()` using service account credentials.
2. Registers the three independent instances of `asyncio.create_task()`.
3. Ensures tasks continue securely alongside live API requests, relying on database concurrency rules to handle atomicity in multi-worker environments.