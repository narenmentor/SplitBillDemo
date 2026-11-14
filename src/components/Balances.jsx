// Helper that turns paise into "₹183.33" for display
import { formatRupees } from '../utils/split.js'

// Section 4: show each friend's net balance
function Balances({ friends, net }) {
  // The UI for this section
  return (
    // A white card for the section
    <section className="card balances-section">
      {/* Section heading */}
      <h2 className="section-title">4. Balances</h2>
      {/* If there are no friends, show a hint; otherwise show the balances */}
      {friends.length === 0 ? (
        // Hint for an empty group
        <p className="muted">Add friends to see balances.</p>
      ) : (
        // The list of balances
        <ul className="balance-list">
          {/* Make one row per friend */}
          {friends.map((friend) => {
            // This friend's balance in paise (0 if they have none yet)
            const balance = net[friend.id] || 0
            // Positive balance: this friend should receive money (green)
            if (balance > 0) {
              // Green row
              return (
                // Each row needs a unique key
                <li key={friend.id} className="balance-item balance-owed">
                  {/* Name and amount owed to them */}
                  <strong>{friend.name}</strong> is owed {formatRupees(balance)}
                </li>
              ) // End of green row
            } // End of positive check
            // Negative balance: this friend needs to pay (red)
            if (balance < 0) {
              // Red row
              return (
                // Each row needs a unique key
                <li key={friend.id} className="balance-item balance-owes">
                  {/* Name and amount they owe (shown without the minus sign) */}
                  <strong>{friend.name}</strong> owes {formatRupees(-balance)}
                </li>
              ) // End of red row
            } // End of negative check
            // Zero balance: settled up (grey)
            return (
              // Each row needs a unique key
              <li key={friend.id} className="balance-item balance-settled">
                {/* Name and "settled up" */}
                <strong>{friend.name}</strong> settled up
              </li>
            ) // End of grey row
          })}
        </ul>
      )}
    </section>
  ) // End of the returned UI
} // End of Balances component

// Export so App.jsx can use it
export default Balances
