// Vitest tools: describe groups tests, it is one test, expect checks a value
import { describe, it, expect } from 'vitest'
// The money functions we want to test
import { toPaise, formatRupees, computeNet } from './split.js'

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
