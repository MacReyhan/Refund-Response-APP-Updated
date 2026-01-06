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
  CompletedWithin = "Completed (within 2-4 hours)",
  CompletedPost = "Completed (post 2-4 hours)"
}

export interface FormData {
  amount: string;
  rrn: string;
  initDate: string;
  mode: RefundMode;
  status: RefundStatus;
  superCoinsBalance?: string;
}
