# SplitBill: Complete Project Setup Guide

Nov 14, 2026 · @Entri Coding Tamil

## Overview

This guide takes you from an empty Windows laptop to a live SplitBill app on Vercel in 14 steps. SplitBill is a Splitwise-like bill-splitting app: React + Vite on the frontend, data saved in the browser with localStorage, no backend.

**What you need before you start**

- A Windows laptop with internet access (commands below are for PowerShell / the VS Code terminal)
- A paid Claude plan (Pro, Max, Team or Enterprise). Claude Code does not work with a free account.
- A free [GitHub](https://github.com) account and a free [Vercel](https://vercel.com) account
- A ChatGPT account (free is fine) for the design step

**Tech stack**

| Tool | Used for |
| --- | --- |
| Node.js + npm | Running JavaScript and installing libraries |
| Git + GitHub | Saving versions of the code and storing it online |
| VS Code | Code editor |
| Claude Code | AI that writes and reviews code in the terminal |
| React + Vite | The app and its dev server |
| Vitest | Tests for the money logic |
| Vercel | Hosting the live app |

**The one rule that matters:** all money is stored as whole paise, never decimals. Rs 100 = 10000 paise. With decimals, Rs 100 / 3 = 33.33, and 33.33 x 3 = 99.99, so 1 paisa disappears.

## Step 1: Install the required tools

Install these four, in this order. Accept the default options in each installer.

1. **Node.js** (LTS version): [nodejs.org/en/download](https://nodejs.org/en/download). npm comes with it.
2. **Git**: [git-scm.com/install](https://git-scm.com/install/)
3. **VS Code**: [code.visualstudio.com](https://code.visualstudio.com)
4. **Claude Code**: open **PowerShell** and run:

```powershell
irm https://claude.ai/install.ps1 | iex
```

For macOS or Linux, follow the [Claude Code quickstart](https://code.claude.com/docs/en/quickstart).

**If `claude` is "not recognized" after installing:** add `%USERPROFILE%\.local\bin` to your user PATH.

1. Press the Windows key and search **Edit environment variables for your account**.
2. Select **Path** under User variables, click **Edit**, then **New**.
3. Paste `%USERPROFILE%\.local\bin` and click **OK** on every window.
4. Close **all** terminals and VS Code, then open them again.

## Step 2: Check that your tools are installed

Open a new terminal and run each command. Each one should print a version number.

```powershell
node -v
npm -v
git --version
claude --version
```

An error instead of a version means that tool didn't install or isn't on your PATH. Reinstall it, then close and reopen the terminal.

**First-time Git setup** (once per laptop; use your own name and the email on your GitHub account):

```powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## Step 3: Create the project folder

```powershell
mkdir splitbill
cd splitbill
git init
code .
```

- `mkdir splitbill` makes the folder
- `cd splitbill` moves into it
- `git init` starts tracking versions
- `code .` opens this folder in VS Code

If `code .` doesn't work, open VS Code and use **File > Open Folder** to open `splitbill`.

## Step 4: Start Claude Code in VS Code

1. In VS Code, open the terminal: **View > Terminal** (or `Ctrl + backtick`).
2. Check that the terminal path ends in `splitbill`.
3. Run:

```powershell
claude
```

4. **Login screen:** choose **1. Claude account with subscription**. Don't pick option 2 (Anthropic Console), because that bills per API use.
5. A browser tab opens. Sign in to your Claude account and click **Authorize**. If it asks for a code, paste it into the terminal. If you belong to a Team org, pick that org.
6. **Trust the folder:** choose **Yes** for your `splitbill` folder.
7. You should see the model, your plan and the folder path, then a `>` prompt.

**Permission modes** (press `Shift + Tab` to switch):

| Mode | What it does | Use it when |
| --- | --- | --- |
| Auto | Runs low-risk actions without asking, blocks risky ones | Normal building |
| Default / ask | Asks before every edit or command | You want to approve each change |
| Plan | Only reads and plans, changes nothing | Understanding a project first |

Press `Esc` to stop Claude mid-task.

## Step 5: Set up the project (Prompt 1)

Paste this at the `>` prompt:

```text
Set up this folder as a new project. Work in the current folder (it already has git initialized), and run every command non-interactively.

1. Create a Vite + React app using JavaScript (not TypeScript) right here in this folder, e.g. npm create vite@latest . -- --template react
2. Run npm install.
3. Install vitest as a dev dependency and add "test": "vitest run" to the package.json scripts.
4. Remove all the Vite demo content (counter, logos, demo CSS) so App.jsx just shows a heading "SplitBill".
5. Create CLAUDE.md with these project rules:
   - This is SplitBill, a beginner-friendly bill-splitting app (like Splitwise) for a Tamil coding tutorial.
   - Frontend only: React + localStorage. No backend or database.
   - All money is stored as integer paise (Rs 100 = 10000). Never use floats for money. Convert rupees to paise only at input, and paise to rupees only for display.
   - Money logic lives in src/utils/split.js.
   - Write simple, beginner-friendly code and add a comment on every line explaining what it does.
   - Ask before adding any new library.
6. Add a .gitignore if it's missing (node_modules, dist).
7. Run npm run dev to confirm it works, tell me the local URL, then stop the server.

Explain each step briefly as you go.
```

**Check:** run `npm run dev` and open the URL it prints. The page shows only "SplitBill". `npm test` runs and says no test files were found, which is expected.

**Commit** (do this after every step from here on):

```powershell
git add .
git commit -m "Step 5: setup"
```

## Step 6: Design the UI in ChatGPT

Paste this into ChatGPT:

```text
Design a mobile-first UI for "SplitBill", a simple bill-splitting web app for Indian college friends (like Splitwise). Give me:
1. A colour palette with hex codes (primary, background, card, text, green for "owed", red for "owes")
2. One Google Font suggestion
3. A layout description for 4 sections on one page: Add Friends, Add Expense, Expense List, Balances with Settle Up
4. Simple plain CSS (no Tailwind, no libraries) I can give to a developer, with CSS variables for the palette
Keep it clean, friendly, and easy for beginners to read.
```

In VS Code, create a new file called `design.md` in the project folder, paste ChatGPT's whole answer into it, and save. Claude reads this file in the next step.

## Step 7: Build the app (Prompt 2)

This prompt fixes the exact data shapes, so the functions you hand-code in Step 8 plug into Claude's code without changes.

```text
Read CLAUDE.md and design.md, then build SplitBill on a single page.

DATA (save everything to localStorage, load it on startup):
- friends: [{ id, name }]  (id is a string from crypto.randomUUID())
- expenses: [{ id, description, amountPaise, paidBy, splitType: "equal" | "custom", shares: { [friendId]: paise } }]
- settlements: [{ id, from, to, amountPaise }]

FEATURES:
1. Add Friends: name input + Add button, show the list. Need at least 2 friends before adding expenses. Keep friends in the order they were added.
2. Add Expense: description, amount in rupees, "Paid by" dropdown, split type:
   - Equal: checkboxes for who is included (all checked by default). Use splitEqual to build shares.
   - Custom: a rupee input per friend. They must add up exactly to the total, otherwise show an error.
   Convert rupees to paise with a toPaise helper. Save the computed shares on the expense.
3. Expense List: description, amount, who paid, and a Delete button.
4. Balances: each friend's net balance. Green "is owed Rs X" if positive, red "owes Rs X" if negative, grey "settled up" if zero.
5. Settle Up: show suggested payments from simplifyDebts, like "Priya pays Arun Rs 183.33", each with a Settle button that saves a settlement.
6. A "Reset all data" button (with a confirm) that clears localStorage.

MONEY LOGIC in src/utils/split.js (export everything):
- toPaise(rupeesString) -> integer paise. Write fully.
- formatRupees(paise) -> "Rs 83.34" style string (use the rupee symbol). Write fully.
- splitEqual(totalPaise, memberIds) -> { [memberId]: paise }. Leave the body EMPTY with a TODO comment. I will write it.
- computeNet(expenses, settlements) -> { [friendId]: netPaise }, positive = should receive money. The payer gets +amountPaise, each person in shares gets -their share. For a settlement, "from" gets +amountPaise and "to" gets -amountPaise. Write fully.
- simplifyDebts(net) -> [{ from, to, amountPaise }]. Leave the body EMPTY with a TODO comment. I will write it.

Make the app not crash while my two functions are empty (for example, return {} and [] for now).
Use plain CSS with the palette and font from design.md, mobile-first.
Comment every line. Keep components simple and beginner-friendly.
```

**Check:** `npm run dev`. You can add friends and custom-split expenses. Two things are expected at this stage:

- An equal split shows "The shares add up to Rs 0.00, but the total is Rs X", because `splitEqual` is still empty.
- Settle Up says there are no payments to suggest, because `simplifyDebts` is still empty.

**Before Step 8, ask Claude to confirm the names** (so your code matches its code):

```text
Don't change any code. Tell me:
1. The exact property names SettleUp reads from each payment returned by simplifyDebts.
2. Whether ExpenseForm passes member IDs to splitEqual in the order friends were added.
3. Whether net (the input to simplifyDebts) is an object like { [friendId]: netPaise }.
```

You want: `from`, `to`, `amountPaise`; yes, in friend order; yes.

**Commit:** `git add .` then `git commit -m "Step 7: main build"`

## Step 8: Hand-code splitEqual and simplifyDebts

You write these two functions yourself. Turn off any AI autocomplete in VS Code (such as GitHub Copilot) first, and type the code rather than pasting it.

Open `src/utils/split.js`. For each function, delete the `// eslint-disable-next-line no-unused-vars` line above it and everything down to its `} // End of ...` line, then type the version below. Keep the comment lines that describe the function.

**splitEqual:** integer division, then the leftover paise go to the first few people, one paisa each.

```javascript
export function splitEqual(totalPaise, memberIds) {
  // Count how many people share this expense
  const count = memberIds.length
  // Everyone's base share, rounded down so there are no decimals (10000 / 3 = 3333)
  const base = Math.floor(totalPaise / count)
  // Paise left over after giving everyone the base share (10000 - 9999 = 1)
  let leftover = totalPaise - base * count
  // Empty object to store each person's share, like { naren: 3334 }
  const shares = {}
  // Go through each member in the order they were added
  for (const id of memberIds) {
    // Give the base share, plus 1 extra paise if any leftover remains
    shares[id] = base + (leftover > 0 ? 1 : 0)
    // We just gave away 1 leftover paise, so reduce the count
    if (leftover > 0) leftover--
  } // End of members loop
  // Return the shares; they always add up exactly to totalPaise
  return shares
} // End of splitEqual
```

**simplifyDebts:** a greedy method. Match the biggest debtor with the biggest creditor, pay the smaller amount, and repeat.

```javascript
export function simplifyDebts(net) {
  // People who should RECEIVE money (positive balance)
  const creditors = []
  // People who should PAY money (negative balance)
  const debtors = []
  // Look at every friend's balance one by one
  for (const [id, amount] of Object.entries(net)) {
    // Positive balance means this person is owed money
    if (amount > 0) creditors.push({ id, amount })
    // Negative balance means this person owes; store it as a positive number
    else if (amount < 0) debtors.push({ id, amount: -amount })
  } // End of balances loop
  // List of payments we will suggest
  const payments = []
  // Keep going while someone still owes and someone is still owed
  while (creditors.length > 0 && debtors.length > 0) {
    // Put the biggest creditor first
    creditors.sort((a, b) => b.amount - a.amount)
    // Put the biggest debtor first
    debtors.sort((a, b) => b.amount - a.amount)
    // Take the person owed the most
    const creditor = creditors[0]
    // Take the person who owes the most
    const debtor = debtors[0]
    // Pay the smaller of the two amounts so nobody overpays
    const pay = Math.min(creditor.amount, debtor.amount)
    // Record the payment: debtor pays creditor
    payments.push({ from: debtor.id, to: creditor.id, amountPaise: pay })
    // The creditor is now owed less
    creditor.amount -= pay
    // The debtor now owes less
    debtor.amount -= pay
    // If the creditor is fully paid, remove them from the list
    if (creditor.amount === 0) creditors.shift()
    // If the debtor has fully paid, remove them from the list
    if (debtor.amount === 0) debtors.shift()
  } // End of while loop
  // Return all suggested payments
  return payments
} // End of simplifyDebts
```

**Check:** save the file. The equal-split error disappears, and Settle Up now suggests payments. Run `npm test` and `npm run lint`; both should pass.

For the full check with exact expected numbers, use the scenario in Step 11. If anything breaks, compare your property names with Claude's answer from Step 7.

**Commit:** `git add .` then `git commit -m "Step 8: hand-coded functions"`

## Step 9: Ask Claude to review the money code (Prompt 3)

```text
Review src/utils/split.js for bugs and edge cases (empty lists, zero or negative amounts, rounding, totals that don't add up). List the issues first with a short explanation of each. Do NOT change anything until I approve.
```

Claude lists numbered issues. Read each one and decide what's worth fixing. Recommended reply:

```text
Fix only these:
- splitEqual: throw an Error with a clear message when memberIds is empty.
- splitEqual: throw an Error if totalPaise is not a whole number (Number.isInteger).
- splitEqual: throw an Error if memberIds has duplicates.
- Change the simplifyDebts comment from "fewest" to "a short list" of payments.
- Tidy up: remove the unused eslint-disable lines and match the file's style (no semicolons, "// End of" comments, a comment on every line).
Skip everything else. Don't add tests yet. Run npm test and npm run lint when done.
```

Issues that only happen with broken saved data (for example, shares that don't match the total) can be skipped here. The form already blocks bad input, and a real app would also validate on a backend.

**Commit:** `git add .` then `git commit -m "Step 9: review fixes"`

## Step 10: Write the tests (Prompt 4)

```text
Add tests to the existing src/utils/split.test.js (keep the current tests):
1. splitEqual(10000, 3 members) gives 3334, 3333, 3333 and sums to exactly 10000
2. splitEqual(30000, 3 members) gives 10000 each
3. splitEqual with one member gives them the full amount
4. splitEqual throws for an empty list, a non-whole totalPaise, and duplicate members
5. simplifyDebts returns [] when everyone is already settled
6. Scenario: friends Naren, Arun, Priya (in that order). Coffee 10000 paid by Naren, equal split. Dinner 45000 paid by Arun, equal split. computeNet gives Naren -8334, Arun 26667, Priya -18333, and simplifyDebts gives exactly two payments: Priya pays Arun 18333, Naren pays Arun 8334.
7. After applying those two payments as settlements, computeNet gives 0 for everyone.
Comment every line. Then run npm test and show me the results.
```

**Check:** every test passes (16 in the rehearsal build). **Commit:** `git add .` then `git commit -m "Step 10: tests"`

## Step 11: Test the app by hand

Run `npm run dev`, click **Reset all data**, then:

1. Add friends in this exact order: **Naren, Arun, Priya**. The order decides who gets the leftover paisa.
2. Add **Coffee, Rs 100, paid by Naren**, equal split.
3. Add **Dinner, Rs 450, paid by Arun**, equal split.

**Expected balances:**

| Friend | Share of Coffee | Share of Dinner | Paid | Balance |
| --- | --- | --- | --- | --- |
| Naren | Rs 33.34 | Rs 150.00 | Rs 100.00 | owes Rs 83.34 |
| Arun | Rs 33.33 | Rs 150.00 | Rs 450.00 | is owed Rs 266.67 |
| Priya | Rs 33.33 | Rs 150.00 | Rs 0.00 | owes Rs 183.33 |

**Expected Settle Up:** Priya pays Arun Rs 183.33, then Naren pays Arun Rs 83.34.

4. Refresh the page. All the data is still there.
5. Click both **Settle** buttons. Everyone shows "settled up". Refresh again to check it stays that way.
6. Optional: try a **custom split**, for example Dinner Rs 450 paid by Arun with Naren Rs 100, Arun Rs 200, Priya Rs 150. The amounts must add up exactly to the total.

**Commit:** `git add .` then `git commit -m "Step 11: manual test passed"`

## Step 12: Check the production build

Vercel runs the same build command, so catch errors on your laptop first:

```powershell
npm test
npm run lint
npm run build
```

All three should finish with no errors. `npm run build` creates a `dist` folder. You don't edit it, and `.gitignore` keeps it out of GitHub.

## Step 13: Push the code to GitHub

1. On [github.com](https://github.com), click **New repository**.
2. Name it `splitbill`. Leave it **empty**: no README, no .gitignore, no licence.
3. Click **Create repository**.
4. In the VS Code terminal, run (replace `YOUR-USERNAME`):

```powershell
git add .
git commit -m "Ready to deploy"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/splitbill.git
git push -u origin main
```

The first push opens a browser window to sign in to GitHub. Refresh the repo page afterwards; your files should be there.

## Step 14: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and **sign in with GitHub**.
2. Click **Add New > Project**.
3. Find `splitbill` and click **Import**.
4. Vercel detects the framework as **Vite**. Leave every setting at its default.
5. Click **Deploy** and wait about a minute.
6. Open the link Vercel gives you (it ends in `.vercel.app`).

**Verify the live app:**

- [ ] Open the link on your phone and run the Step 11 scenario
- [ ] Refresh: the data is still there
- [ ] Open the link in an incognito tab or on another phone: it's empty

That last check is expected. The data lives only in each browser's localStorage. Sharing data between phones needs a backend and a database (Part 2: Express + MongoDB).

**Auto-deploy:** from now on, every `git push` to `main` redeploys the site automatically.

## Daily workflow

**Closing Claude Code:** press `Esc` if Claude is mid-task, then type `/exit` (or press `Ctrl + C` twice). Stop the dev server with `Ctrl + C`. Commit and push before you stop for the day.

**Coming back:** open the `splitbill` folder in VS Code, then run one of these in the terminal:

| Command | What it does |
| --- | --- |
| `claude` | New conversation; still reads CLAUDE.md for the project rules |
| `claude --continue` | Reopens your last conversation in this folder |
| `claude --resume` | Lists past conversations to pick from |
| `/resume` | Same list, from inside Claude Code |

Chats are saved per folder and deleted after about a month, so keep important prompts in this guide, not just in chat history.

**Useful commands inside Claude Code:** `/help` (all commands), `/clear` (fresh context), `/model` (switch model), `@filename` (point Claude at a file), `Esc` twice (rewind to an earlier message).

**Undo to a checkpoint:** `git log --oneline` lists your commits. `git reset --hard <commit-id>` takes the project back to that commit and discards everything after it.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `claude` is not recognized | Add `%USERPROFILE%\.local\bin` to your user PATH (Step 1), then reopen every terminal |
| Login fails or mentions your plan | Claude Code needs a paid Claude plan; choose option 1 at login |
| `npm create vite` asks questions or stops | Ask Claude to run it non-interactively with `--template react` in the current folder |
| Equal split says "shares add up to Rs 0.00" | Expected before Step 8; `splitEqual` is still empty |
| Settle Up is empty after Step 8 | Property names don't match; check `from`, `to`, `amountPaise` against Claude's answer in Step 7 |
| Naren owes Rs 0.01 in a test | Not a bug: leftover paise go to the first friend, and they add up to zero overall |
| Numbers don't match Step 11 | Friends were added in a different order; reset and add Naren, Arun, Priya |
| `git push` is rejected | The GitHub repo wasn't empty; create it again with no README |
| Vercel build fails | Run `npm run build` on your laptop, fix the error, commit and push again |
| Data disappears on another phone | Expected: data lives in each browser's localStorage only |
