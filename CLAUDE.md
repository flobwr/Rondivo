@AGENTS.md

# Git Rules (MANDATORY)

- Always work on the branch explicitly requested by the user.
- Before starting any task, verify the current branch using `git branch --show-current`.
- If the current branch is not the requested branch, stop and ask for confirmation or switch to the requested branch before making any changes.
- Never create a new Git branch unless the user explicitly requests it.
- Never create temporary branches (`claude/*` or similar) unless the user explicitly asks for them.
- Never modify another branch than the one requested.
- Never merge branches unless the user explicitly asks for it.
- Never delete branches unless the user explicitly asks for it.
- Never push to a different branch than the one requested.
- Before every commit and every push, verify again that you are still on the correct branch.

---

# Dependencies

- Never use a package that is not installed.
- Whenever a new dependency is required:
  - install it correctly;
  - update package.json;
  - update the lockfile;
  - verify that the project still builds correctly.
- Never leave the project in a state where another developer cannot clone and run it.

---

# Code Quality

- Reuse existing components whenever possible.
- Avoid code duplication.
- Keep the architecture clean and modular.
- Remove dead code.
- Remove unused imports.
- Follow existing coding conventions.
- Prefer maintainable solutions over quick fixes.

---

# UI / UX

Always prioritize:

- simplicity;
- clarity;
- consistency;
- accessibility;
- performance.

Avoid visual clutter.

Every screen should be understandable within a few seconds.

Remove unnecessary information whenever possible.

---

# Product Mindset

Do not implement requests mechanically.

If you identify a significantly better solution:

- explain why;
- compare it with the requested solution;
- if it objectively improves the product without changing the user's intent, implement the improved version.

Think like a senior product designer and software engineer.

---

# Performance

- Avoid unnecessary re-renders.
- Avoid unnecessary API calls.
- Prefer efficient algorithms.
- Keep animations smooth.
- Optimize perceived performance.

---

# Safety

Never execute destructive Git commands (reset --hard, force push, branch deletion, history rewriting, etc.) without explicit user confirmation.

---

# Before Completing Any Task

Always verify:

- TypeScript
- ESLint
- imports
- dependencies
- compilation
- runtime errors

Fix any issue before considering the task finished.

---

# End of Every Task

Always provide:

1. Files created.
2. Files modified.
3. Files deleted.
4. Packages added.
5. Packages removed.
6. Dependencies updated.
7. Commands the user must execute.
8. Summary of completed work.
9. Remaining limitations or TODOs.
