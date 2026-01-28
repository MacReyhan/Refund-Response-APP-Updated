
import { parseRefundText } from '../utils/parser';

const exampleCompleted = `Associated Refunds
Total Amount (Rs)
953
All refund modes
Refund ID
CR26012808473823383443701
Completed
Mode
Credit Card
Amount(Rs)
953
Refund Id - CR26012808473823383443701
Completed
Payments and Refunds
Payment reference no.
PZT2601280832OYEAD04
Type
Refund
Mode
Credit Card
SLA
03 Feb 26, 08:47 AM
Reason
Courier Return
Comment
Beneficiary Details
Card No.************8288
Card BankFLIPKARTAXISBANK
Card NetworkMASTERCARD`;

const exampleProcessing = `Associated Refunds
Total Amount (Rs)
953
All refund modes
Refund ID
CR26012808473823383443701
Completed
Mode
Credit Card
Amount(Rs)
953
Refund Id - CR26012808473823383443701
Processing
Payments and Refunds
Payment reference no.
PZT2601280832OYEAD04
Type
Refund
Mode
Credit Card
SLA
03 Feb 26, 08:47 AM
Reason
Courier Return
Comment
Beneficiary Details
Card No.************8288
Card BankFLIPKARTAXISBANK
Card NetworkMASTERCARD
Init28 Jan 26, 08:47 AM

Init28 Jan 26, 08:47 AM

Processing28 Jan 26, 08:47 AM`;

console.log("--- Testing Completed ---");
console.log(parseRefundText(exampleCompleted));

console.log("\n--- Testing Processing ---");
console.log(parseRefundText(exampleProcessing));




const exampleCreditCardWithRRN = `Associated Refunds
Total Amount (Rs)
500
Mode
Credit Card
Completed
Payments and Refunds
Type
Refund
Mode
Credit Card
SLA
05 Feb 26, 10:00 AM
Bank reference no
999888777666`;

console.log("\n--- Testing Credit Card With RRN ---");
console.log(parseRefundText(exampleCreditCardWithRRN));


