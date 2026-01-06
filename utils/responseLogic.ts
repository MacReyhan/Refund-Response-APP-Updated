import { FormData, RefundMode, RefundStatus } from '../types';

export const getTodaysFormattedDate = (): string => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export const formatInputDate = (inputStr: string): string => {
  if (!inputStr) return "[Refund Initiated Date and Time]";
  // Regex matches format: 28 Dec 25, 02:44 am
  const regex = /^(\d{1,2})\s([A-Za-z]{3})\s(\d{2}),\s(.*)$/;
  const match = inputStr.match(regex);
  if (match) {
    const day = match[1];
    const monthShort = match[2];
    const yearShort = match[3];
    const time = match[4];
    const months: { [key: string]: string } = {
      'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
      'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
      'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
    };
    const monthFull = months[monthShort] || monthShort;
    const yearFull = "20" + yearShort;
    return `${monthFull} ${day}, ${yearFull} ${time}`;
  }
  return inputStr;
};

// Main Template Logic
export const generateRefundResponse = (data: FormData): string => {
  const { amount, rrn, initDate, mode, status, superCoinsBalance } = data;
  const formattedDate = formatInputDate(initDate);
  const today = getTodaysFormattedDate();
  const safeRrn = rrn.trim();

  let response = "";

  // --- NEW SUPERCOINS LOGIC ---
  if (mode === RefundMode.SuperCoins) {
    const balance = superCoinsBalance || 'XX';
    response = `${amount} SuperCoins have been credited for your Minutes order, and the balance of SuperCoins is ${balance}.\n`;
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

  // --- COMPLETED (WITHIN 2-4 HOURS) ---
  if (status === RefundStatus.CompletedWithin) {
    const isNetBankingGroup = [RefundMode.NetBanking, RefundMode.NEFT, RefundMode.IMPS, RefundMode.DebitCard].includes(mode);
    const isUpiGroup = [RefundMode.FlipkartUPI, RefundMode.UPI].includes(mode);
    const isCreditCard = mode === RefundMode.CreditCard;

    if (safeRrn && isNetBankingGroup) {
      response = `Rs ${amount} for your Minutes order will be refunded to your ${mode} in the next 2-4 hours with your bank reference number ${safeRrn}.\n`;
      response += `Check the bank account statement from ${today} date to the present date (use the bank's app/website/ or contact customer care/bank statement or passbook).\n`;
      response += `Search for a refund with the keyword 'Flipkart'.`;
    }
    else if (!safeRrn && isNetBankingGroup) {
      response = `Rs ${amount} for your Minutes order will be refunded to your ${mode} in the next 2-4 hours.\n`;
      response += `Check the bank account statement from ${today} date to the present date (use the bank's app/website/ or contact customer care/bank statement or passbook).\n`;
      response += `Search for a refund with the keyword 'Flipkart'.`;
    }
    else if (!safeRrn && isUpiGroup) {
      response = `Rs ${amount} for your Minutes order will be refunded to your ${mode} in the next 2-4 hours.\n`;
      response += `Check the bank account statement from ${today} date to the present date (use the bank's app/website/ or contact customer care/bank statement or passbook).\n`;
      response += `For any UPI transaction, I request you to check the bank account statement for a refund. Search for a refund with the keyword 'Flipkart'.`;
    }
    else if (safeRrn && isUpiGroup) {
      response = `Rs ${amount} for your Minutes order will be refunded to your ${mode} in the next 2-4 hours with your bank reference number ${safeRrn}.\n`;
      response += `Check the bank account statement from ${today} date to the present date (use the bank's app/website/ or contact customer care/bank statement or passbook).\n`;
      response += `For any UPI transaction, I request you to check the bank account statement for a refund. Search for a refund with the keyword 'Flipkart'.`;
    }
    else if (!safeRrn && isCreditCard) {
      response = `Rs ${amount} for your Minutes order will be refunded to your ${mode} in the next 2-4 hours.\n`;
      response += `Check the credit card statement from ${today} date to the present date (use the bank's app/website/ or contact customer care/bank statement or passbook).\n`;
      response += `For the credit card transaction, verify both the billed and unbilled sections of the bank statement to view the refund amount. Search for a refund with the keyword 'Flipkart'.`;
    }
    else if (safeRrn && isCreditCard) {
      response = `Rs ${amount} for your Minutes order will be refunded to your ${mode} in the next 2-4 hours with your bank reference number ${safeRrn}.\n`;
      response += `Check the credit card statement from ${today} date to the present date (use the bank's app/website/ or contact customer care/bank statement or passbook).\n`;
      response += `For the credit card transaction, verify both the billed and unbilled sections of the bank statement to view the refund amount. Search for a refund with the keyword 'Flipkart'.`;
    }
    else if (mode === RefundMode.GiftCardWallet) {
      response = `I can see that the Gift Card refund of Rs ${amount} has been completed on ${today}, and sent to the registered email address.\n\n`;
      response += `To view Gift Card balance: - {For App} Go to 'Saved credit/Debit & gift cards' under 'Account'. - {For Website} Go to 'My Profile' >> Select 'Gift Cards' under Payments.\n\n`;
      response += `Gift Card is valid for one year from the date of purchase.\n`;
      response += `SMS will be sent every time a customer uses a Gift Card or a refund of the Gift Card is initiated (easy transaction tracking).`;
    }
    else if (mode === RefundMode.GiftCardQC) {
      response = `I can see that the refund of Rs ${amount} for your order was added to the Gift Card on ${today}, and the details have been sent to the registered email address used to buy the Gift Card.\n\n`;
      response += `Steps to check Gift Card balance [Website Only]: Go to 'Gift Card' section >>> 'Check Gift Card Balance' >>> Enter the Gift Card number and PIN\n\n`;
      response += `You can add the Card to the 'Wallet' section for ease of usage.\n\n`;
      response += `If you are unable to find it, please follow these steps: - Click here: https://www.flipkart.com/account/orders - Select the particular order. - Tap 'Resend Gift Card' option.`;
    }
    return response;
  }

  // --- COMPLETED (POST 2-4 HOURS) ---
  if (status === RefundStatus.CompletedPost) {
    response = `Rs ${amount} for the item was refunded to ${mode} and should reflect in your account latest by ${today}.\n`;

    if (mode === RefundMode.CreditCard) {
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
