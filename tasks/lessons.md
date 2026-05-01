# Lessons

Patterns and rules learned during development. Read this at session start.

---

## No Co-Authored-By in commits

**Pattern:** Appended `Co-Authored-By: Claude ...` trailer to commit messages by default.
**Rule:** Write the commit subject only — no body, no trailers, no attribution lines ever.
**Why:** This is the user's repo and their commits. Claude attribution is unwanted noise and pollutes the git log.

---

<!-- Add entries as mistakes are corrected. Format:

## <Short title>

**Pattern:** what went wrong
**Rule:** what to do instead
**Why:** reason this matters in this codebase

-->
