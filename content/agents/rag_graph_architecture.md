---

**RAG Agent**
Generates topic-adaptive quizzes and concept summaries from course materials, using each student's current mastery scores to target weak areas and calibrate question difficulty.

```mermaid
graph TD
    START((START))

    START --> ROUTE{_route_by_type}
    ROUTE -->|quiz| mastery_check[mastery_check_node]
    ROUTE -->|summary| summary_group[summary_group_node]

    subgraph quiz_path ["Quiz Path — Phase 1"]
        mastery_check --> chunk_retrieval[chunk_retrieval_node]
        chunk_retrieval --> quiz_generation[quiz_generation_node]
        quiz_generation -->|"violations → auto-correct + retry"| quiz_generation
        quiz_generation --> quiz_persist[quiz_persist_node]
    end

    quiz_persist --> END((END))

    subgraph summary_path ["Summary Path — Phase 3"]
        summary_group --> CACHE{_route_after_summary_group}
        CACHE -->|cache hit| END
        CACHE -->|no cache| summary_generate[summary_generate_node]
        summary_generate --> summary_assemble[summary_assemble_node]
    end

    summary_assemble --> END

    subgraph mastery_path ["Mastery Update — Phase 2 (API-Driven, out-of-band)"]
        RESULTS(["/quiz/results endpoint"]) --> mastery_update[mastery_update_node]
        mastery_update --> weighted_ema["Weighted EMA → mastery_score"]
        mastery_update --> fsrs_update["FSRS Scheduler → next_review_date"]
        weighted_ema --> cp[(concept_progress upsert)]
        fsrs_update --> cp
    end
```

**Key Engineering Decisions**

**Mastery-weighted question allocation**
A single-shot quiz prompt ignoring mastery produces uniform questions that waste time on concepts the student already knows. The 3-phase Chain-of-Thought approach first analyzes mastery scores to allocate question slots per concept, then outlines questions, then generates final JSON — so harder questions go to weaker concepts. The built-in self-correcting loop handles strict structural constraints (exactly 4 options, exactly 1 correct) without requiring a separate validation model.

**Out-of-band mastery update**
Running FSRS scheduling and EMA mastery recalculation inside the LangGraph quiz path would block the graph until the user submits answers — which could be hours later. The mastery update instead runs as a separate FastAPI endpoint triggered only when the frontend posts quiz results, keeping the graph's responsibility limited to generation. This means quiz creation completes synchronously while the slower mastery recalculation runs asynchronously at answer submission time.

**Cache-first summary routing**
Regenerating a summary on every request wastes LLM calls for content that does not change between ingestion cycles. The summary path checks the `course_topics.summary` cache first and routes directly to END on a hit, only proceeding to generation on a miss. When a cache miss does occur, concurrent `asyncio.gather` per concept group keeps generation fast by running prose and visual code calls in parallel.

---
