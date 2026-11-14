# SplitBill — Project Rules

## About
- This is SplitBill, a beginner-friendly bill-splitting app (like Splitwise) for a Tamil coding tutorial.

## Tech
- Frontend only: React + localStorage. No backend or database.
- Ask before adding any new library.

## Money
- All money is stored as integer paise (Rs 100 = 10000). Never use floats for money.
- Convert rupees to paise only at input, and paise to rupees only for display.
- Money logic lives in `src/utils/split.js`.

## Code style
- Write simple, beginner-friendly code.
- Add a comment on every line explaining what it does.

## Commands
- `npm run dev` — start the dev server
- `npm test` — run tests once with Vitest
- `npm run build` — production build
