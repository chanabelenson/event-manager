---
name: project-budget-system
description: Budget tab refactored into layered components with payment tracker, pie chart, and ceiling management
metadata:
  type: project
---

Budget system rebuilt from scratch (2026-06-09). Full component breakdown:

**New DB table:** `budget_payments` (id, budget_item_id, amount, paid_at, note) — see `DB/budget_payments.sql`

**Data model distinction:**
- `budget_items.estimated_cost` = planned budget per item
- `budget_items.actual_cost` = final agreed vendor price
- `budget_payments` rows = actual money transferred (installments)
- `events.total_budget` = user-defined ceiling (already existed in schema)

**Component tree:**
```
BudgetTab.jsx          ← orchestrator, imports Budget.css
  useBudget.js         ← all state + API logic (custom hook)
  BudgetSummaryCards   ← 4 cards incl. editable ceiling
  BudgetCategoryChart  ← pure SVG pie chart (no lib)
  BudgetItemForm       ← add/edit form with category dropdown
  BudgetItemsTable     ← table with expandable drawer
    PaymentDrawer      ← per-item payment tracker
```

**Constants:** `client/src/constants/budgetCategories.js` — 16 predefined Hebrew categories

**API endpoints added:**
- `PATCH /api/events/:eventId/budget/ceiling` — update total_budget
- `POST  /api/events/:eventId/budget/:itemId/payments`
- `DELETE /api/events/:eventId/budget/payments/:paymentId`
- `GET /api/events/:eventId/budget` now returns `{ total_budget, items: [...with payments[]] }`

**CSS:** All budget styles are in `Budget.css` (colocated), removed from `index.css`.

**Why:** Clean separation requested by user; prior BudgetTab.jsx was a single 98-line monolith with no payment tracking.
