---
name: feedback-code-style
description: User's strong preferences for code organization and architecture
metadata:
  type: feedback
---

Always split features into focused layers: custom hook for logic, separate components for each UI concern, constants file for static data, colocated CSS per feature folder.

**Why:** User explicitly stated this is non-negotiable — "הפרדת לוגיקה, שמירה על מבנה מסודר וקומפוננטות נקיות ופונקציות קטנות וממוקדות" (logic separation, clean structure, small focused components/functions).

**How to apply:**
- Never put API calls directly in components — always go through a custom hook or service
- Never duplicate CSS — move to colocated CSS file, remove from global
- Never duplicate logic — one function in one place
- Constants (like dropdown options) go in `src/constants/`, not inline in components
- Each component file does ONE thing
