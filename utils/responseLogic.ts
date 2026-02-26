import { FormData, RefundMode, RefundStatus } from '../types';

export const parseCustomDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const date = new Date(dateStr);

  if (!isNaN(date.getTime())) {
    // If it's a date-only string (no colon and no am/pm), assume end of day limit
    if (!dateStr.includes(':') && !dateStr.toLowerCase().includes('am') && !dateStr.toLowerCase().includes('pm')) {
      date.setHours(23, 59, 59, 999);
    }
    return date;
  }

  return null;
};

export const getTodaysFormattedDate = (): string => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export const formatInputDate = (inputStr: string): string => {
  if (!inputStr) return "[Refund Initiated Date and Time]";

  const date = new Date(inputStr);
  if (!isNaN(date.getTime())) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    const datePart = date.toLocaleDateString('en-US', options);
    const timePart = date.toLocaleTimeString('en-US', timeOptions).toLowerCase();
    return `${datePart} ${timePart}`;
  }

  return inputStr;
};

export const formatSLADate = (inputStr: string): string => {
  if (!inputStr) return "";

  const date = new Date(inputStr);
  if (!isNaN(date.getTime())) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  }

  // Fallback to existing formatter if format doesn't match
  return formatInputDate(inputStr);
};

// Main Template Logic
export const generateRefundResponse = (data: FormData): string => {
  const { amount, rrn, initDate, mode, status, superCoinsBalance, sla } = data;
  const formattedDate = formatInputDate(initDate);
  const today = getTodaysFormattedDate();
  const safeRrn = rrn.trim();


  let formattedSLA = '';
  if (sla) {
    // Always include time if the original input has time (contains comma)
    if (sla.includes(',')) {
      formattedSLA = formatInputDate(sla);
    } else {
      formattedSLA = formatSLADate(sla);
    }
  }

  let response = "";

  // --- NEW SUPERCOINS LOGIC ---
  if (mode === RefundMode.SuperCoins) {
    const balance = superCoinsBalance || 'XX';
    const displaySLA = formattedSLA || '2-4 hours';

    if (status === RefundStatus.CompletedPost) {
      response = `${amount} SuperCoins have been credited for your Minutes order, and the balance of SuperCoins is ${balance}.\n`;
    } else {
      response = `${amount} SuperCoins will be credited by ${displaySLA} for your Minutes order, and the balance of SuperCoins is ${balance}.\n`;
    }
    response += `You can see the balance here: 1. Log in to the app and tap 'Accounts,' and the balance is available on the top right corner of the page. 2. SuperCoins balance is also available on the 'Orders' page.`;
    return response;
  }

  // --- PROCESSING ---
  if (status === RefundStatus.Processing) {
    response = `The refund of Rs ${amount} for the order, although it was initiated to ${mode} on ${formattedDate}, is still pending.\n`;
    response += `Usually refund should be completed or update will be shared within 2-4 hours.\n`;
    response += `Once the refund process is completed, you'll receive an SMS. Meanwhile, you can also track it here: https://www.flipkart.com/account/orders.`;
    return response;
  }

  // --- COMPLETED (WITHIN SLA) ---
  if (status === RefundStatus.CompletedWithin) {
    const isNetBankingGroup = [RefundMode.NetBanking, RefundMode.NEFT, RefundMode.IMPS, RefundMode.DebitCard].includes(mode);
    const isUpiGroup = [RefundMode.FlipkartUPI, RefundMode.UPI].includes(mode);
    const isCreditCard = [RefundMode.CreditCard, RefundMode.CreditCardEMI].includes(mode);
    const displaySLA = formattedSLA || '2-4 hours';

    if (safeRrn && isNetBankingGroup) {
      response = `Rs ${amount} for your Minutes order will be refunded to your ${mode} by ${displaySLA} with your bank reference number ${safeRrn}.\n`;
      response += `Check the bank account statement from ${today} date to the present date (use the bank's app/website/ or contact customer care/bank statement or passbook).\n`;
      response += `Search for a refund with the keyword 'Flipkart'.`;
    }
    else if (!safeRrn && isNetBankingGroup) {
      response = `Rs ${amount} for your Minutes order will be refunded to your ${mode} by ${displaySLA}.\n`;
      response += `Check the bank account statement from ${today} date to the present date (use the bank's app/website/ or contact customer care/bank statement or passbook).\n`;
      response += `Search for a refund with the keyword 'Flipkart'.`;
    }
    else if (!safeRrn && isUpiGroup) {
      response = `Rs ${amount} for your Minutes order will be refunded to your ${mode} by ${displaySLA}.\n`;
      response += `Check the bank account statement from ${today} date to the present date (use the bank's app/website/ or contact customer care/bank statement or passbook).\n`;
      response += `For any UPI transaction, I request you to check the bank account statement for a refund. Search for a refund with the keyword 'Flipkart'.`;
    }
    else if (safeRrn && isUpiGroup) {
      response = `Rs ${amount} for your Minutes order will be refunded to your ${mode} by ${displaySLA}, with your bank reference number ${safeRrn}.\n`;
      response += `Check the bank account statement from ${today} date to the present date (use the bank's app/website/ or contact customer care/bank statement or passbook).\n`;
      response += `For any UPI transaction, I request you to check the bank account statement for a refund. Search for a refund with the keyword 'Flipkart'.`;
    }
    else if (!safeRrn && isCreditCard) {
      response = `Rs ${amount} for your Minutes order will be refunded to your ${mode} by ${displaySLA}.\n`;
      response += `Check the credit card statement from ${today} date to the present date (use the bank's app/website/ or contact customer care/bank statement or passbook).\n`;
      response += `For the credit card transaction, verify both the billed and unbilled sections of the bank statement to view the refund amount. Search for a refund with the keyword 'Flipkart'.`;
    }
    else if (safeRrn && isCreditCard) {
      response = `Rs ${amount} for your Minutes order will be refunded to your ${mode} by ${displaySLA}, with your bank reference number ${safeRrn}.\n`;
      response += `Check the credit card statement from ${today} date to the present date (use the bank's app/website/ or contact customer care/bank statement or passbook).\n`;
      response += `For the credit card transaction, verify both the billed and unbilled sections of the bank statement to view the refund amount. Search for a refund with the keyword 'Flipkart'.`;
    }
    else if (mode === RefundMode.GiftCardWallet) {
      response = `The Gift Card refund of Rs ${amount} will be credited by ${displaySLA}.\n`;
      response += `To view Gift Card balance: - {For App} Go to 'Saved credit/Debit & gift cards' under 'Account'. - {For Website} Go to 'My Profile' >> Select 'Gift Cards' under Payments.\n`;
      response += `Gift Card is valid for one year from the date of purchase.\n`;
      response += `SMS will be sent every time a customer uses a Gift Card or a refund of the Gift Card is initiated (easy transaction tracking).`;
    }
    else if (mode === RefundMode.GiftCardQC) {
      response = `I can see that the refund of Rs ${amount} for your order was added to the Gift Card on ${today}, and the details have been sent to the registered email address used to buy the Gift Card.\n`;
      response += `Steps to check Gift Card balance [Website Only]: Go to 'Gift Card' section >>> 'Check Gift Card Balance' >>> Enter the Gift Card number and PIN\n`;
      response += `You can add the Card to the 'Wallet' section for ease of usage.\n`;
      response += `If you are unable to find it, please follow these steps: - Click here: https://www.flipkart.com/account/orders - Select the particular order. - Tap 'Resend Gift Card' option.`;
    }
    return response;
  }

  // --- COMPLETED (POST SLA) ---
  if (status === RefundStatus.CompletedPost) {
    const displaySLA = formattedSLA || '2-4 hours';
    response = `Rs ${amount} for the item was refunded to ${mode} and should reflect in your account latest by ${displaySLA}. Refund reference number: ${safeRrn}.\n`;

    if ([RefundMode.CreditCard, RefundMode.CreditCardEMI].includes(mode)) {
      response += `Check the credit card statement from ${today} date to the present date (use the bank's app/website/ or contact customer care/bank statement or passbook).\n`;
      response += `For the credit card transaction, verify both the billed and unbilled sections of the bank statement to view the refund amount. Search for a refund with the keyword 'Flipkart'.\n`;
    } else {
      response += `Check the bank account statement from ${today} date to the present date (use the bank's app/website/ or contact customer care/bank statement or passbook).\n`;
      if (mode.toString().includes("UPI")) {
        response += `For any UPI transaction, I request you to check the bank account statement for a refund. Search for a refund with the keyword 'Flipkart'.\n`;
      } else {
        response += `Search for a refund with the keyword 'Flipkart'.\n`;
      }
    }

    if (safeRrn) {
      response += `We've sent SMS with the refund reference number that confirms that the refund has been received by their bank.\n`;
    } else {
      response += `We've sent an SMS with the refund details.\n`;
    }

    response += `If the refund amount is not visible then, I request you to contact the bank using the phone number on the back of your card and provide the refund reference number.\n`;
    response += `If the bank does not assist you, escalate the issue to the bank's grievance cell.`;
    return response;
  }

  return response;
};
