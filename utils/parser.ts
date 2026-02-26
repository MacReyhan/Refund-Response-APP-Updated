import { FormData, RefundMode, RefundStatus } from '../types';

export const parseRefundText = (text: string): Partial<FormData> => {
    const result: Partial<FormData> = {};

    // Helper to extract by regex
    const extract = (regex: RegExp, groupIndex = 1) => {
        const match = text.match(regex);
        return match ? match[groupIndex].trim() : null;
    };

    // 1. Amount
    // Pattern: Total Amount (Rs)\n953  OR Amount(Rs)\n953
    const amountMatch = extract(/Amount\s*\(Rs\)\s*\n?(\d+)/i) || extract(/Amount\s*\(Rs\)\s+(\d+)/i);
    if (amountMatch) {
        result.amount = amountMatch;
    }

    // 2. Mode
    // Prioritize Mode under "Payments and Refunds" if it exists
    // Pattern: Payments and Refunds ... Mode\nCredit Card

    let modeMatch = null;
    const mainSection = text.match(/Payments and Refunds[\s\S]*?(Mode\r?\n.+)/i);
    if (mainSection) {
        modeMatch = mainSection[1].split(/\r?\n/)[1]; // Get value after Mode\r?\n
    }

    if (!modeMatch) {
        modeMatch = extract(/Mode\r?\n([^\n]+)/i);
    }

    if (modeMatch) {
        // Map string to Enum if possible
        const modeStr = modeMatch.trim().toLowerCase();
        // Simple matching logical for now, can be expanded
        if (modeStr.includes("credit card emi")) result.mode = RefundMode.CreditCardEMI;
        else if (modeStr.includes("credit card")) result.mode = RefundMode.CreditCard;
        else if (modeStr.includes("fk upi") || modeStr.includes("flipkart upi")) result.mode = RefundMode.FlipkartUPI;
        else if (modeStr.includes("upi") || modeStr.includes("upi intent")) result.mode = RefundMode.UPI;
        else if (modeStr.includes("debit")) result.mode = RefundMode.DebitCard;
        else if (modeStr.includes("net") && modeStr.includes("banking")) result.mode = RefundMode.NetBanking; // Matches NetBanking, Net Banking
        else if (modeStr.includes("neft")) result.mode = RefundMode.NEFT;
        else if (modeStr.includes("imps")) result.mode = RefundMode.IMPS;
        else if (modeStr.includes("coin")) result.mode = RefundMode.SuperCoins;
        else if (modeStr.includes("gc")) result.mode = RefundMode.GiftCardWallet; // Defaulting
    }

    // 3. SLA
    // Pattern: SLA\n03 Feb 26, 08:47 AM or SLA: 03 Feb 26, 08:47 AM
    // Always keep the full SLA string (including time) as-is
    const slaFull = extract(/SLA[\s:]*([^\n]+)/i);
    if (slaFull) {
        result.sla = slaFull;
    }

    // 4. Status
    // "Completed" line existence?
    // "Processing" line existence?
    if (text.includes("Processing")) {
        result.status = RefundStatus.Processing;

        // Extract Init Date
        // Pattern: Init28 Jan 26, 08:47 AM
        const initMatch = extract(/Init(.*)/i) || extract(/Processing(\d.*)/i);
        if (initMatch) {
            result.initDate = initMatch;
        }
    } else if (text.includes("Completed")) {
        // Default to CompletedWithin, user can change if needed or we compare dates
        result.status = RefundStatus.CompletedWithin;
    }

    // 5. RRN
    // User example: "Bank reference no\n622085790286"
    // STRICT: Only "Bank reference no"
    const rrnMatch = extract(/Bank reference no\s*\n?(\w+)/i);
    if (rrnMatch) {
        result.rrn = rrnMatch;
    }

    return result;
};
