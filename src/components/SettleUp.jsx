// Helpers: format paise for display, and work out the suggested payments
import { formatRupees, simplifyDebts } from '../utils/split.js'

// Section 5: suggested payments, each with a Settle button
function SettleUp({ friends, net, onSettle }) {
  // Ask simplifyDebts for the shortest list of payments
  const payments = simplifyDebts(net)

  // Find a friend's name from their id (or "Unknown" if not found)
  function getName(friendId) {
    // Look for the friend with this id
    const friend = friends.find((item) => item.id === friendId)
    // Give back their name, or a fallback
    return friend ? friend.name : 'Unknown'
  } // End of getName

  // Runs when a Settle button is clicked
  function handleSettle(payment) {
    // Build the sentence, e.g. "Priya pays Arun ₹183.33"
    const sentence = `${getName(payment.from)} pays ${getName(payment.to)} ${formatRupees(payment.amountPaise)}`
    // Ask the user to confirm (the app only records it; no real money moves)
    const ok = window.confirm(`Mark as paid: ${sentence}?\n\nThis only records the payment. No real money is sent.`)
    // If they clicked Cancel, do nothing
    if (!ok) return
    // Send the payment up to App to save as a settlement
    onSettle(payment)
  } // End of handleSettle

  // The UI for this section
  return (
    // A white card for the section
    <section className="card settle-section">
      {/* Section heading */}
      <h2 className="section-title">5. Settle Up</h2>
      {/* If there are no payments, show a hint; otherwise show the list */}
      {payments.length === 0 ? (
        // Hint when nothing needs paying
        <p className="muted">No payments to suggest right now.</p>
      ) : (
        // The list of suggested payments
        <ul className="payment-list">
          {/* Make one row per payment */}
          {payments.map((payment) => (
            // A key made from who pays whom (unique within this list)
            <li key={`${payment.from}-${payment.to}`} className="payment-item">
              {/* The sentence, e.g. "Priya pays Arun ₹183.33" */}
              <span>
                <strong>{getName(payment.from)}</strong> pays <strong>{getName(payment.to)}</strong> {formatRupees(payment.amountPaise)}
              </span>
              {/* Button to record this payment */}
              <button type="button" className="btn btn-settle btn-small" onClick={() => handleSettle(payment)}>
                Settle
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  ) // End of the returned UI
} // End of SettleUp component

// Export so App.jsx can use it
export default SettleUp
