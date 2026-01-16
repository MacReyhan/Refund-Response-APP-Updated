export enum RefundMode {
  CreditCard = "Credit Card",
  UPI = "UPI",
  DebitCard = "Debit Card",
  NetBanking = "NetBanking",
  NEFT = "NEFT",
  IMPS = "IMPS",
  FlipkartUPI = "Flipkart UPI",
  GiftCardWallet = "Gift Card Wallet",
  GiftCardQC = "Gift Card QC",
  SuperCoins = "SuperCoins"
}

export enum RefundStatus {
  Processing = "Processing",
  CompletedWithin = "Completed (within SLA)",
  CompletedPost = "Completed (post SLA)"
}

export interface FormData {
  amount: string;
  rrn: string;
  initDate: string;
  mode: RefundMode;
  status: RefundStatus;
  superCoinsBalance?: string;
  sla?: string;
}
