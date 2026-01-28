
import { parseRefundText } from '../utils/parser';

const ambiguousText = `Associated Refunds
Total Amount (Rs)
144
All refund modes
Refund ID
CR2601281952077724172507
Completed
Mode
Upi Intent
Amount(Rs)
144
Refund Id - CR2601281952077724172507
Completed
Payments and Refunds
Payment reference no.
PZT26012818541M35G02
Type
Refund
Mode
Credit Card
SLA
28 Jan 26, 08:53 PM
Reason
Courier Return
Comment
Bank reference no
622085790286`;

console.log("--- Testing Ambiguous Mode (Expect Credit Card) ---");
console.log(parseRefundText(ambiguousText));
