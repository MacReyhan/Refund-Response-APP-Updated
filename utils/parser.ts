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
    const mainSection = text.match(/Payments and Refunds[\s\S]*?(Mode\n.+)/i);
    if (mainSection) {
        modeMatch = mainSection[1].split('\n')[1]; // Get value after Mode\n
    }

    if (!modeMatch) {
        modeMatch = extract(/Mode\n(.+)/i);
    }

    if (modeMatch) {
        // Map string to Enum if possible
        const modeStr = modeMatch.trim();
        // Simple matching logical for now, can be expanded
        if (modeStr.includes("Credit Card")) result.mode = RefundMode.CreditCard;
        else if (modeStr.includes("UPI") || modeStr.toLowerCase().includes("upi intent")) result.mode = RefundMode.UPI;
        else if (modeStr.includes("Debit")) result.mode = RefundMode.DebitCard;
        else if (modeStr.includes("NetBanking")) result.mode = RefundMode.NetBanking;
        else if (modeStr.includes("NEFT")) result.mode = RefundMode.NEFT;
        else if (modeStr.includes("IMPS")) result.mode = RefundMode.IMPS;
        else if (modeStr.includes("Gift Card")) result.mode = RefundMode.GiftCardWallet; // Defaulting
    }

    // 3. SLA
    // Pattern: SLA\n03 Feb 26, 08:47 AM
    const slaFull = extract(/SLA\n(.+)/i);
    if (slaFull) {
        try {
            // Parse the SLA string
            // Expected format: "28 Dec 25, 02:44 am" or similar from example "03 Feb 26, 08:47 AM"
            const cleanedSla = slaFull.replace(/(\d+)(st|nd|rd|th)/, '$1'); // Remove ordinal if any
            const slaDate = new Date(cleanedSla);
            const now = new Date(); // In real usage this will be user's current time

            if (!isNaN(slaDate.getTime())) {
                const diffMs = slaDate.getTime() - now.getTime();
                const diffHours = diffMs / (1000 * 60 * 60);

                if (diffHours <= 3 && diffHours > 0) {
                    // Keep full format if within 3 hours
                    result.sla = slaFull;
                } else {
                    // Strip time: "03 Feb 26"
                    // Regex to take first 3 parts
                    const dateOnly = slaFull.split(',')[0].trim();
                    result.sla = dateOnly;
                }
            } else {
                result.sla = slaFull; // Fallback
            }
        } catch (e) {
            result.sla = slaFull;
        }
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
