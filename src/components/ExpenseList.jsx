// Helper that turns paise into "₹1,200.00" for display
import { formatRupees } from '../utils/split.js'

// Section 3: show every expense with a Delete button
function ExpenseList({ expenses, friends, onDeleteExpense }) {
  // Find a friend's name from their id (or "Unknown" if not found)
  function getName(friendId) {
    // Look for the friend with this id
    const friend = friends.find((item) => item.id === friendId)
    // Give back their name, or a fallback
    return friend ? friend.name : 'Unknown'
  } // End of getName

  // The UI for this section
  return (
    // A white card for the section
    <section className="card expense-list-section">
      {/* Section heading */}
      <h2 className="section-title">3. Expense List</h2>
      {/* If there are no expenses, show a hint; otherwise show the list */}
      {expenses.length === 0 ? (
        // Hint for an empty list
        <p className="muted">No expenses yet.</p>
      ) : (
        // The list of expenses
        <ul className="expense-list">
          {/* Make one row per expense */}
          {expenses.map((expense) => (
            // Each row needs a unique key so React can track it
            <li key={expense.id} className="expense-item">
              {/* Left side: description and who paid */}
              <div className="expense-details">
                {/* What the expense was for */}
                <h4>{expense.description}</h4>
                {/* Who paid and how many people shared it */}
                <p>
                  {getName(expense.paidBy)} paid · split {expense.splitType === 'equal' ? 'equally' : 'custom'} between {Object.keys(expense.shares).length}
                </p>
              </div>
              {/* Right side: amount and Delete button */}
              <div className="expense-right">
                {/* The total amount */}
                <span className="expense-amount">{formatRupees(expense.amountPaise)}</span>
                {/* Delete this expense */}
                <button type="button" className="btn btn-ghost btn-small" onClick={() => onDeleteExpense(expense.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  ) // End of the returned UI
} // End of ExpenseList component

// Export so App.jsx can use it
export default ExpenseList
