# FYP Poster Combined Hero Diagram & Architecture Overview

> **Purpose:** A single, unified architecture flowchart designed as the central diagram for your project poster, accompanied by a comprehensive description suitable for the FYP report or poster text.

---

## The Combined Architecture Flowchart

```mermaid
flowchart LR
    %% External Triggers
    CRON["⏰ Cron Jobs<br/>(Daily / Hourly)"]
    HOOK["🔗 DB Webhooks<br/>(Schedule Conflicts)"]

    subgraph CLIENTS ["🖥️ Client Tier"]
        direction TB
        WEB["<b>Web Frontend</b><br/>(Next.js)"]
        MOBILE["<b>Mobile Frontend</b><br/>(Expo)"]
    end

    subgraph BAAS ["☁️ Secure BaaS"]
        direction TB
        EDGE["⚡ <b>Edge Functions</b><br/>(AI Gateway)"]
        
        subgraph DB ["🗄️ PostgreSQL Database"]
            direction TB
            DB1["Learning Chunks &<br/>Knowledge Graphs"]
            DB2["Tasks, Routines &<br/>Calendar Events"]
            DB3["Quizzes, FSRS &<br/>Mastery Logs"]
        end
    end

    subgraph AI ["🧠 AI Service Tier"]
        direction TB
        ORCH["<b>FastAPI Server</b><br/>(Agent Orchestrator)"]
        A1["Agent 1:<br/>LMS Ingestion"]
        A2["Agent 2:<br/>Task Parser"]
        A3["Agent 3:<br/>RAG Query"]
        A4["Agent 4:<br/>CP-SAT Scheduler"]
        A5["Agent 5:<br/>Daily Planner"]
        A6["Agent 6:<br/>Data Analytics"]
    end
    
    subgraph EXT ["🌐 External Triggers & APIs"]
        direction TB
        LLM["Google Gemini API<br/>(Pro & Flash)"]
        LMS["University LMS<br/>(Mock API)"]
    end

    %% Client flows
    WEB & MOBILE == "Direct CRUD via RLS" ==> DB
    WEB & MOBILE == "User Invoke" ==> EDGE
    EDGE == "Bearer Token Auth" ==> ORCH

    %% Invocation
    ORCH --> A1 & A2 & A3 & A4 & A5 & A6
    
    %% Autonomous Triggers
    CRON -.->|Background Async Tasks| ORCH
    HOOK -.->|Conflict Detection| ORCH
    
    %% Internal AI workflows
    A5 -.->|1. Generates FSRS Quizzes| A3
    A5 -.->|2. Finds Calendar Slots| A4
    
    %% Agent to Database output mapping
    A1 -->|Extract Chunks & JSON Graphs| DB1
    A2 -->|Classify NLP Input| DB2
    A4 -->|Constraint Optimize| DB2
    A3 -->|3-Phase CoT Query| DB3
    A6 -->|Spaced Repetition update| DB3
    
    %% External APIs
    A1 -->|Web Scrape| LMS
    A1 & A2 & A3 & A4 & A6 -->|LLM Inference| LLM
    
    %% Styling
    classDef clientBox fill:#3b82f6,stroke:#1e40af,color:#fff,font-weight:bold
    classDef baasBox fill:#22c55e,stroke:#166534,color:#fff,font-weight:bold
    classDef aiBox fill:#a855f7,stroke:#6b21a8,color:#fff,font-weight:bold
    classDef dbBox fill:#dcfce7,stroke:#16a34a,color:#14532d,font-weight:bold
    classDef extBox fill:#f97316,stroke:#c2410c,color:#fff,font-weight:bold
    classDef triggerStyle fill:#fef3c7,stroke:#d97706,color:#92400e,font-weight:bold
    
    class WEB,MOBILE clientBox
    class EDGE baasBox
    class DB1,DB2,DB3 dbBox
    class A1,A2,A3,A4,A5,A6,ORCH aiBox
    class LLM,LMS extBox
    class CRON,HOOK triggerStyle
```

---

## High-Level System Architecture Overview

The **AI Academic Assistant** operates on a robust, multi-tier microservices architecture designed for scalability, security, and real-time responsiveness. The system is physically and logically separated into four distinct repositories that work together seamlessly.

### 1. The Client Tier (Cross-Platform Frontends)
The user-facing layer consists of two parallel codebases: the **Web Frontend** (`fyp-web-frontend`) built with Next.js 16, and the **Mobile Frontend** (`fyp-mobile-frontend`) built with React Native (Expo). 
* **Shared Logic:** Both platforms enforce UI consistency through `shadcn` components and share the exact same state management architecture using `Zustand`. 
* **Direct Database Access:** For standard operations (fetching tasks, creating routines, editing profiles), both clients communicate directly with the PostgreSQL database. Security is heavily enforced at the database level via **Row Level Security (RLS)**, ensuring users can only read and mutate their own data.

### 2. The Backend-as-a-Service Tier (Supabase)
The **Supabase Backend** (`fyp-supabase-backend`) acts as the central nervous system of the platform.
* **Authentication:** Managed by Supabase Auth (GoTrue), delivering secure JWT-based user sessions that automatically map to PostgreSQL Row Level Security policies.
* **PostgreSQL:** Stores all relational data (tasks, groups, routines) and implements Structured RAG by filtering metadata within the `learning_chunks` table, eliminating the need for vector embeddings.
* **Storage:** Manages file uploads natively, specifically holding PDF lecture notes and user-uploaded images (for OCR parsing) in secure S3-compatible buckets.
* **Secure AI Gateway:** To protect the AI infrastructure, the frontends *never* communicate directly with the AI Service. Instead, clients invoke **Supabase Edge Functions**. These serverless functions act as a secure gateway, verifying the user's JWT session, injecting a secure Bearer Token, and proxying the request to the internal Python AI server.

### 3. The AI Service Tier (The Brain)
Hosted separately, the **AI Service** (`fyp-ai-service`) is a Python FastAPI microservice that houses the platform's core intelligence. It is orchestrated using **LangGraph**, enabling complex, stateful, multi-agent workflows. The logic is divided among six highly specialized agents:
* **Agent 1 (LMS Ingestion):** Wakes up via hourly cron jobs, scrapes the University Mock LMS, chunks lecture slides via Docling, and extracts semantic knowledge graphs (stored as JSONB) and structured learning chunks.
* **Agent 2 (Task Parser):** Receives unstructured user input (text or images via OCR) and uses Gemini Flash to automatically classify and parse them into structured Tasks, Events, or Routines.
* **Agent 3 (RAG Query):** Employs a rigorous 3-Phase Chain-of-Thought (CoT) technique to generate contextually accurate quizzes, summaries, and mindmaps from the ingested structured learning chunks and JSON knowledge graphs.
* **Agent 4 (Scheduler):** The algorithmic core. It leverages Google OR-Tools (CP-SAT Solver) to dynamically fit user tasks into empty calendar slots while respecting hard constraints (class times) and soft constraints (preferred study hours).
* **Agent 5 (Daily Planner):** An autonomous Python loop running at 06:00 AM local time. It proactively evaluates the student's day, automatically triggering Agent 3 to generate consolidation quizzes for today's lectures, and triggering Agent 4 to schedule them.
* **Agent 6 (Analytics):** Computes spaced-repetition metrics using the FSRS (Free Spaced Repetition Scheduler) algorithm, tracking knowledge decay and optimizing future quiz difficulties.

### 4. External Services
The AI service heavily relies on the **Google Gemini API** for Large Language Model (LLM) inference. By routing requests dynamically between Gemini 1.5 Pro (for complex RAG generation) and Gemini 1.5 Flash (for fast NLP classification), the system balances speed, cost, and high-quality academic reasoning.
