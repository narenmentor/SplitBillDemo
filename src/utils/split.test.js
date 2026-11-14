// Vitest tools: describe groups tests, it is one test, expect checks a value
import { describe, it, expect } from 'vitest'
// The money functions we want to test
import { toPaise, formatRupees, splitEqual, computeNet, simplifyDebts } from './split.js'

// Add up all the values in a shares object, e.g. { a: 1, b: 2 } gives 3
function sumShares(shares) {
  // Take every value and add them together, starting from 0
  return Object.values(shares).reduce((sum, share) => sum + share, 0)
} // End of sumShares

// Tests for toPaise
describe('toPaise', () => {
  // Whole rupees become paise
  it('converts whole rupees', () => {
    // ₹100 is 10000 paise
    expect(toPaise('100')).toBe(10000)
  }) // End of test
  // Decimals are handled without float errors
  it('converts rupees with paise', () => {
    // ₹183.33 is 18333 paise
    expect(toPaise('183.33')).toBe(18333)
    // ₹0.1 is 10 paise (0.1 is a classic float trap)
    expect(toPaise('0.1')).toBe(10)
    // "5." is just ₹5
    expect(toPaise('5.')).toBe(500)
  }) // End of test
  // Spaces and commas are ignored
  it('ignores spaces and commas', () => {
    // " 1,200 " is ₹1200
    expect(toPaise(' 1,200 ')).toBe(120000)
  }) // End of test
  // Bad input gives NaN
  it('returns NaN for invalid input', () => {
    // Letters are not money
    expect(toPaise('abc')).toBeNaN()
    // An empty box is not money
    expect(toPaise('')).toBeNaN()
    // Negative amounts are not allowed
    expect(toPaise('-5')).toBeNaN()
    // More than 2 decimal places is not allowed
    expect(toPaise('1.234')).toBeNaN()
  }) // End of test
}) // End of toPaise tests

// Tests for formatRupees
describe('formatRupees', () => {
  // Normal amounts
  it('formats paise as rupees', () => {
    // 8334 paise is ₹83.34
    expect(formatRupees(8334)).toBe('₹83.34')
    // 5 paise needs a leading zero
    expect(formatRupees(5)).toBe('₹0.05')
  }) // End of test
  // Indian-style commas
  it('adds Indian commas', () => {
    // 1,20,000 rupees
    expect(formatRupees(12000000)).toBe('₹1,20,000.00')
  }) // End of test
  // Negative amounts keep the minus sign
  it('keeps the minus sign', () => {
    // -₹2.50
    expect(formatRupees(-250)).toBe('-₹2.50')
  }) // End of test
}) // End of formatRupees tests

// Tests for computeNet
describe('computeNet', () => {
  // One expense: Naren pays ₹1200, shared by 4 people
  it('credits the payer and debits each share', () => {
    // A single expense with 4 equal shares of ₹300
    const expenses = [{ amountPaise: 120000, paidBy: 'n', shares: { n: 30000, a: 30000, r: 30000, s: 30000 } }]
    // Naren gets +900, the others -300 each
    expect(computeNet(expenses, [])).toEqual({ n: 90000, a: -30000, r: -30000, s: -30000 })
  }) // End of test
  // A settlement moves money between two people
  it('applies settlements', () => {
    // Arun owes Naren ₹300
    const expenses = [{ amountPaise: 60000, paidBy: 'n', shares: { n: 30000, a: 30000 } }]
    // Arun pays Naren ₹300
    const settlements = [{ from: 'a', to: 'n', amountPaise: 30000 }]
    // Now both are at zero
    expect(computeNet(expenses, settlements)).toEqual({ n: 0, a: 0 })
  }) // End of test
}) // End of computeNet tests

// Tests for splitEqual
describe('splitEqual', () => {
  // ₹100 between 3 people cannot divide evenly
  it('gives the extra paisa to the first member and keeps the exact total', () => {
    // Split 10000 paise between a, b and c
    const shares = splitEqual(10000, ['a', 'b', 'c'])
    // The first person gets the 1 leftover paisa
    expect(shares).toEqual({ a: 3334, b: 3333, c: 3333 })
    // Nothing is lost or created: the shares add up to exactly 10000
    expect(sumShares(shares)).toBe(10000)
  }) // End of test
  // ₹300 between 3 people divides evenly
  it('splits an even amount equally', () => {
    // Everyone gets exactly ₹100
    expect(splitEqual(30000, ['a', 'b', 'c'])).toEqual({ a: 10000, b: 10000, c: 10000 })
  }) // End of test
  // Only one person in the split
  it('gives one member the full amount', () => {
    // The single member pays all of it
    expect(splitEqual(12345, ['a'])).toEqual({ a: 12345 })
  }) // End of test
  // Bad input should stop with an error
  it('throws for bad input', () => {
    // Nobody to split between
    expect(() => splitEqual(10000, [])).toThrow('memberIds is empty')
    // Half a paisa is not allowed
    expect(() => splitEqual(100.5, ['a', 'b'])).toThrow('whole number')
    // The same person listed twice
    expect(() => splitEqual(10000, ['a', 'a', 'b'])).toThrow('duplicate')
  }) // End of test
}) // End of splitEqual tests

// Tests for simplifyDebts
describe('simplifyDebts', () => {
  // Nobody owes anything
  it('returns no payments when everyone is settled', () => {
    // Everyone is at zero, so there is nothing to pay
    expect(simplifyDebts({ a: 0, b: 0, c: 0 })).toEqual([])
    // No balances at all also means nothing to pay
    expect(simplifyDebts({})).toEqual([])
  }) // End of test
}) // End of simplifyDebts tests

// A full example: Naren, Arun and Priya share coffee and dinner
describe('scenario: coffee and dinner', () => {
  // Friends in the order they were added
  const members = ['naren', 'arun', 'priya']
  // The two expenses, using splitEqual to build the shares just like the app does
  const expenses = [
    // Coffee ₹100 paid by Naren: Naren 3334, Arun 3333, Priya 3333
    { amountPaise: 10000, paidBy: 'naren', shares: splitEqual(10000, members) },
    // Dinner ₹450 paid by Arun: 15000 each
    { amountPaise: 45000, paidBy: 'arun', shares: splitEqual(45000, members) },
  ] // End of expenses list

  // Check the balances and the suggested payments
  it('computes net balances and two payments', () => {
    // Work out everyone's balance with no settlements yet
    const net = computeNet(expenses, [])
    // Naren: +10000 - 3334 - 15000 = -8334, Arun: +45000 - 3333 - 15000 = 26667, Priya: -3333 - 15000 = -18333
    expect(net).toEqual({ naren: -8334, arun: 26667, priya: -18333 })
    // Arun is owed by both; the bigger debtor (Priya) pays first
    expect(simplifyDebts(net)).toEqual([
      // Priya pays Arun ₹183.33
      { from: 'priya', to: 'arun', amountPaise: 18333 },
      // Naren pays Arun ₹83.34
      { from: 'naren', to: 'arun', amountPaise: 8334 },
    ]) // End of expected payments
  }) // End of test

  // Recording the suggested payments should clear everyone
  it('settles everyone to zero after the payments', () => {
    // Get the suggested payments from the balances
    const payments = simplifyDebts(computeNet(expenses, []))
    // Use those payments as settlements and recompute the balances
    const net = computeNet(expenses, payments)
    // Everyone is now at exactly zero
    expect(net).toEqual({ naren: 0, arun: 0, priya: 0 })
  }) // End of test
}) // End of scenario tests
