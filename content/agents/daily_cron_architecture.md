---

**Cron Agent**
Coordinates all recurring backend work — push notification delivery, LMS syncing, stale-data cleanup, and daily per-user quiz planning — through three asyncio loops embedded directly in the FastAPI process.

**Key Engineering Decisions**

**Embedded asyncio over external scheduler**
Celery or Cloud Scheduler would require a separate service, a message broker, and network coordination for what is a single-service concern. Embedding asyncio loops inside FastAPI's lifespan means zero infra overhead, no broker to maintain, and guaranteed co-location with the service that owns the DB writes. The tradeoff is that loops die with the process, which is acceptable for a single-instance service where a restart is a natural recovery mechanism.

**Three-tier frequency loops**
Putting all jobs in a single 60-second loop would run expensive LMS ingestion and analytics jobs far too often, burning DB resources on work that produces no new results. Separating into 60s (notification dispatch), 1h (ingestion and cleanup), and daily-at-06:00 (per-user analytics and quiz planning) matches each job's run frequency to its cost and user-facing urgency. The daily loop checks every 60s but fires only once per user per UTC date, using timezone-aware local time so the morning refresh lands at 6 AM in the user's own timezone.

**Idempotent notification insertion**
The notification populator runs hourly and could produce duplicate push notifications if a reminder window overlaps two consecutive runs. Using DB UNIQUE constraints on the notification row means duplicate inserts are silently ignored rather than triggering redundant Firebase calls or requiring the application to track what it has already queued. This keeps the populator logic simple — it always inserts, and the DB enforces uniqueness.

---
