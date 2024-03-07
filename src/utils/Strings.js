const strings = {
  // Account Strings
  totalCashFlow: 'Total Cash Flow',
  deleteAccount: 'Are you sure that you want to delete this account?',
  defaultAccountDeleteWarning: "Sorry! You can't delete your default account!",

  // AccountCard Strings
  defaultAccountUpdateWarning: "Sorry! You can't update your default account!",

  // AccountView Strings
  transactionHistory: 'Transactions History',
  deleting: 'Deleting',
  income: 'Income',
  bill: 'Bill',
  noTransactionsFound: 'No transactions(s) found!',

  // Balance Strings
  createFirstAccount: 'Create your first account to track expenses',
  createYourAccount: 'Create your account',

  // Billing Strings
  billing: 'Billing',
  createAnBilling: 'Create billing for...',
  billingCategory: 'Select a category',
  billingSubCategory: 'Select a sub category',
  billingAddOrSelectGroup: 'Add or select group',
  billingPayee: 'Payee',
  enabled: 'Enabled',
  disabled: 'Disabled',
  deleteBilling: 'Are you sure that you want to delete this billing?',
  stopRecurringWarning:
    'You cannot undo it once you stop the bill from recurring.',
  billSettleWarning:
    'The bill has been already settled to your corresponding account!',
  billEditWarning: `Sorry! You can't edit this bill once settled!`,
  stopRecurringBill: 'Are you sure that you want to stop recurring this bill?',

  // Budget Strings
  createBudgetContant: 'Start saving money by creating budgets!',
  createBudget: 'Create your first budget',
  fetchingCreatedCategoryData: 'Please wait! Fetching created category data!',
  deleteBudget: 'Are you sure that you want to delete this budget?',

  // BudgetProgress Strings
  spent: 'Spent',
  noBillingsExpensesFound: 'No billing(s) and expense(s) found!',
  overDue: 'Overdue',

  // Button Strings
  signUp: 'Sign Up',
  logIn: 'Log In',
  continue: 'Continue',
  getStarted: 'Get Started',
  confirm: 'Confirm',
  cancel: 'Cancel',
  verifyMyMail: 'Verify My Mail',
  verify: 'Verify',
  submit: 'Submit',
  save: 'Save',
  done: 'Done',

  // Claims Strings
  claim: 'Claim',
  settle: 'Settle',
  writeOff: 'Write Off',
  share: 'Share',
  recurring: 'Stop Recurring',
  view: 'View',
  stopWriteOffWarning:
    'You cannot undo it once you stop the claim from write off.',
  claimSettleWarning:
    'The claim has been already settled to your corresponding account!',
  deleteClaim: 'Are you sure that you want to delete this claim?',
  writeOffClaim: 'Are you sure that you want to writeoff this claim?',
  writingOff: 'Writing off',
  claimEditWarning: `Sorry! You can't edit this claim once settled!`,
  claimWriteOffWarning: `Sorry! You can't write off this claim once settled!`,
  claimWriteOffEditWarning: `Sorry! You can't edit this claim once write offed!`,

  // ColorPalette Strings
  color: 'Color',
  selectCustomColor: 'Select Custom Color',

  // CreateAccount Strings
  createAnAccount: 'Create an account',
  accountType: 'Account Type',
  bank: 'Bank',
  cashInHand: 'Cash In Hand',
  credit: 'Credit',
  eWallet: 'E-Wallet',
  name: 'Name',
  currency: 'Currency',
  amount: 'Amount',
  select: 'Select',
  default: 'Default',

  // CreateBudget Strings
  createAnBudget: 'Create a monthly budget for...',
  budgetCategory: 'Select a category',
  budgetSubCategory: 'Select a sub category',
  customize: 'Customize',
  addOrSelectGroup: 'Add or select group',
  group: 'Group',
  notification: 'Notification',
  addNew: 'Add New',

  // CreateCreditCard Strings
  createAnCreditCard: 'Create a credit card tracker',
  creditCardName: 'Credit Card Name',
  creditCardType: 'Credit Card Type',
  creditLimit: 'Credit Limit',
  expiryMonthYear: 'Expiry Month and Year',
  currentRewardPoints: 'Current Reward Points',
  statementDate: 'Statement Date',
  keyName: 'Backspace',
  dueDate: 'Due Date',

  // CreditCard Strings
  balanceAccount: 'Account',
  balanceCreditCard: 'CreditCard',
  createFirstCreditCard:
    'Create a credit card account to track your reward points',
  createYourCreditCardAccount: 'Create your credit card account',
  deleteCreditCard: 'Are you sure that you want to delete this credit card?',
  noCreditCartsFound: 'No credit card(s) found!',

  // CreditCardTransaction Strings
  creditTransactions: 'Credits / Liabilities',
  totalCreditAmount: 'Total Credit Amount',
  totalCreditPoints: 'Total Reward Points',

  // CreditCardView Strings
  expiryDate: 'Expiry Date',
  creditCardLimit: 'CreditCard Limit',
  creditCardRewardPoints: 'Rewards points',

  // CustomDateTimePicker Strings
  startDate: 'Start Date',
  endDate: 'End Date',
  formatD4M4Y: 'D MMMM YYYY',

  // CustomizeModal Strings
  custom: 'Custom',
  addName: 'Add a name',

  // CustomModal Strings
  defaultModalMessage: 'Please! Enter any message!',
  hint: 'Hint',

  // Dropdown Strings
  dropDown: 'Dropdown',
  noSuggestions: 'No suggestion(s) found!',
  category: 'Category',
  subCategory: 'Sub Category',
  others: 'Others',

  // DropdownCard Strings
  savings: 'Savings',

  // Dropdown Options Strings
  daily: 'Daily',
  monthly: 'Monthly',
  weekly: 'Weekly',
  yearly: 'Yearly',

  // Earning Strings
  earningFor: 'Earned reward points for',

  // EarningView Strings
  deleteEarning: 'Are you sure that you want to delete this earning?',

  // Environment Strings
  development: 'development',
  staging: 'staging',
  production: 'production',

  // Expense Strings
  madePaymentFor: 'Made payment for',
  recordClaimableExpense: 'Record as claimable expense',
  madePaymentVia: 'Made payment via',
  payee: 'Payee',
  totalAmount: 'Total Amount',
  date: 'Date',
  recurrence: 'Recurrence',
  recurrenceFrequency: 'Recurrence Frequency',
  account: 'Account',
  addExpense: 'Add Expense',
  updateExpense: 'Update Expense',
  expenseDetail: 'Expense Detail',
  itemCategory: 'Item & Sub-category',
  keyInItem: 'Key in an item',
  rm: 'RM',
  add: 'Add',
  delete: 'Delete',
  update: 'Update',
  addItem: 'Add an Item',
  total: 'Total',
  addNote: 'Add a note',
  attachment: 'Attachment',
  attachReceiptInvoice: 'Attach Receipt / Invoice',
  groupName: 'Group Name',
  addAccount: 'Add Account',
  fetchingData: 'Please wait! Fetching data!',
  fetchingCreatedBalanceData: 'Please wait! Fetching created balance data!',
  fetchingCreatedGroupData: 'Please wait! Fetching created group data!',
  fetchingCreatedSubCategoryData:
    'Please wait! Fetching created sub category data!',
  uploadingFile: 'Please wait! Uploading file to server!',
  uncategorized: 'Uncategorized',

  // ExpenseView Strings
  shop: 'Shop',
  items: 'Items',
  notes: 'Notes',
  expense: 'Expense',
  shareError: 'Sorry! Unable to share the item(s)',
  deleteExpense: 'Are you sure that you want to delete this expense?',
  claimable: 'Claimable',

  // Fetch Strings
  apiRequest: 'API Request',
  success: 'Success',

  // FloatingTextInput Strings
  title: 'Title',

  // Followers Strings
  followers: 'Followers',

  // Followings Strings
  followings: 'Followings',

  // FollowRequests Strings
  followrequests: 'Follow Requests',

  // ForgotPassword Strings
  forgotPassword: 'Forgot Password',

  // Helpers Strings
  error: 'Error!',
  info: 'Info!',
  invalidAction: 'Invalid Action!',
  unableAction: 'Sorry! Unable to perform action!',
  issueAction: 'Facing issue(s) while performing action!',
  linking: 'Linking',
  formatMDY: 'MM-DD-YYYY',
  formatDMY: 'DD-MM-YYYY',
  formatYMD: 'YYYY-MM-DD',
  formatll: 'll',
  formatMMMM: 'MMMM',
  formatYYYY: 'YYYY',
  formatMM: 'MM',
  formatHMA: 'hh:mm A',
  formatYY: 'YY',
  formatD: 'D',
  formatDD: 'DD',

  // ImagePicker Strings
  attachmentOptions: 'Attachment Options',
  takePhoto: 'Take Photo',
  uploadFromGallery: 'Upload from Gallery',
  imagePicker: 'Image Picker',
  editPhoto: 'Edit Photo',

  // InAppUpdate Strings
  versionUpdate: 'Version Update',
  noUpdates: 'No update(s) availabe in store(s) for the app!',
  errorVersionUpdates: 'Facing issue(s) in checking the app version update(s)!',
  inAppUpdate: 'InAppUpdate',

  // Income Strings
  receivedPaymentFor: 'Received payment for',
  receivedPaymentVia: 'Received payment via',
  payer: 'Payer',
  addIncome: 'Add Income',
  updateIncome: 'Update Income',
  incomeDetail: 'Income Detail',
  deleteIncome: 'Are you sure that you want to delete this income?',

  // Intro Strings
  sliderTitle: 'Lorem ipsum dolor sit amet',
  sliderDescription:
    'Lorem ipsum dolor sit amet, consectetur varius non ut vestibulum massa.',

  // Menu Strings
  menuWelcome: 'Hello! Here’s your menu',
  dashboard: 'Dashboard',
  balance: 'Balance',
  billingClaims: 'Billing & Claims',
  budget: 'Budget',
  receiptScanning: 'Receipt Scanning',
  discountRecommender: 'Discount Recommender',
  comapreRewardItems: 'Compare Reward Items',
  creditCard: 'Credit Card',
  loan: 'Loan',
  balanceTransfer: 'Balance Transfer',
  cashFromCreditCard: 'Cash from Credit Card',
  askSilvi: 'Ask Silvi',
  exitApp: 'Are you sure that you want to exit Silvi App?',
  loggingOut: 'Logging out',

  // MonthToggler Strings
  formatMMM: 'MMM',
  formatM: 'M',

  // Network Strings
  noInternetConnection: 'No Internet Connection!',
  networkContent: 'Please! Check your data/wifi connection.',
  refreshContent: 'App will automatically reload once the internet is back.',

  // NoResponse Strings
  whoops: 'Whoops!',
  notFindAnything: "We couldn't find anything!",

  // Notification Strings
  read: 'Read',
  new: 'New',

  // Onboard Strings
  exitText: 'Press back again to exit Silvi app!',
  signInWithSocial: 'You can sign in with social',
  warning: 'Warning',
  googleSignInProgress: 'Google SignIn is already in progress!',
  googlePlayServiceOutdated:
    'Google Play Service is not available (or) outdated!',
  googleSignIn: 'Google SignIn',
  authenticating: 'Authenticating',
  google: 'Google',
  facebook: 'Facebook',
  facebookSignIn: 'Facebook SignIn',
  facebookSignInError: 'Sorry! Facing issue(s) in Facebook SignIn!',

  // OTP Strings
  otpVerification: 'OTP Verification',
  enterOTPToRegisterMail: 'Enter the OTP sent to registered mail',
  noReceiveOTP: 'Don’t receive the OTP?',
  resendOTP: 'Resend OTP',

  // Points Strings
  pts: 'PTS',
  notExpired: 'Not Expired',
  expired: 'Expired',
  usedPoints: 'Used Points',
  spending: 'Spending',
  earning: 'Earning',

  // RadioButton Strings
  yes: 'Yes',
  no: 'No',

  // ReceiptScanning Strings
  addManually: 'Add Manually',
  scanReceipt: 'Scan Receipt',

  // Recommender Card Strings
  noOfVisits: 'No of Visit(s)',
  receipts: 'Receipt(s)',

  // Reset Password Strings
  resetPassword: 'Reset Password',
  newPassword: 'New Password',

  // Route Name Strings
  claimRouteName: 'Claims',

  // Savings Recommender Strings
  resultsFound: 'Results Found',
  discountOfferedByMerchants: 'Discount offered by each merchant(s)',
  kmsAway: 'Km(s) away',
  viewItems: 'View Item(s)',

  // Savings Recommender Preview Bills Strings
  previewItems: 'Preview Items',

  // Savings Recommender Search Strings
  savingSearch: 'I’m searching discount for...',
  savingsRecommender: 'Savings Recommender',
  areaRange: 'Area Range',
  location: 'Set your location',
  searchForDiscount: 'Search For Discount',

  // Savings Recommender View Strings
  recommenders: 'Recommender(s)',
  noRecommendersFound: 'No recommender(s) found!',
  comments: 'Comment(s)',
  noCommentsFound: 'No comment(s) found!',

  // Search Strings
  search: 'Search',

  // SettleBillings Strings
  settleMultipleBills: 'Settle multiple bills',

  // SettleClaims Strings
  settleMultipleClaims: 'Settle multiple claims',

  // SignIn Strings
  emailAddress: 'Email Address',
  password: 'Password',
  forgotYourPassword: 'Forgot your password',
  noAccount: "Don't have an account?",
  createAccount: 'Create Account',
  createCreditCard: 'Create Credit Card',
  permissionDenied: 'Permission Denied',
  deniedNotificationPermission:
    'Sorry! Access to notification has been denied for Silvi App!',
  verifyYourEmailAdress: 'Verify Your Email Address',
  registeredMailId: 'Registered Mail ID',
  accountActivation: 'Account Activation',
  unableToGetUserDetails: 'Sorry! Unable to get the user details!',
  unableToVerifyRegisteredMail: 'Sorry! Unable to verify the registered mail!',

  // SignUp Strings
  userName: 'Username',
  email: 'Email',
  confirmPassword: 'Confirm Password',
  alreadyAccount: 'Already have an account?',
  unableToGetOTP: 'Sorry! Unable to get the OTP!',

  // Spending Strings
  spendingFor: 'Spent reward points for',
  points: 'Points',

  // SpendingView Strings
  deleteSpending: 'Are you sure that you want to delete this spending?',

  // Summary Strings
  pointsBreakDown: 'Points Breakdown',
  otherBenefit: 'Other Benefits',

  // Switch Strings
  switch: 'Switch',

  // TimePeriod Strings
  time: 'Time',
  frequency: 'Frequency',

  // UserCard Strings
  followsYou: 'Follows you',
  following: 'Following',

  // UserProfile Strings
  follow: 'Follow',
  unFollow: 'Unfollow',

  // Error Strings
  userNameError: 'Username is required!',
  emailError: 'Email is required!',
  emailInvalidError: 'Email is invalid!',
  passwordError: 'Password is required!',
  passwordCountError: 'Password must have atleast 8 characters!',
  passwordInvalidError: 'Password must be alphanumeric!',
  confirmPasswordError: 'Confirm password is required!',
  passwordMismatchError: "Password(s) doesn't match!",
  emailAddressError: 'Email address is required!',
  emailAddressInvalidError: 'Email address is invalid!',
  registeredMailIdError: 'Registered mail id is required!',
  registeredMailIdInvalidError: 'Registered mail id is invalid!',
  otpError: 'OTP is required!',
  otpInvalidError: 'OTP is invalid!',
  newPasswordError: 'New password is required!',
  dateTimeInvalidError: 'Please! Check the selected datetime(s)!',
  itemNameValueError: 'Please! Enter an item name and value for the field(s)!',
  categoryError: 'Category is required!',
  subCategoryError: 'Sub category is required!',
  madePaymentViaError: 'Made payment via is required!',
  creditCardError: 'Credit card is required!',
  payeeError: 'Payee is required!',
  payerError: 'Payer is required!',
  totalAmountError: 'Total amount is required!',
  dateError: 'Date is required!',
  recurrenceError: 'Recurrence is required!',
  recurrenceFrequencyError: 'Recurrence frequency is required!',
  receivedPaymentForError: 'Received payment for is required!',
  receivedPaymentViaError: 'Received payment via is required!',
  accountTypeError: 'Account type is required!',
  colorError: 'Color is required!',
  nameError: 'Name is required!',
  currencyError: 'Currency is required!',
  amountError: 'Amount is required!',
  pointsError: 'Points is required!',
  zeroError: 'Please enter valid amount!',
  othersError: 'Others is required!',
  fieldError: 'Field is required!',
  timeError: 'Time is required!',
  frequencyError: 'Frequency is required!',
  groupError: 'Group is required!',
  groupNameError: 'Group name is required!',
  rewardPointsError: 'Reward points is required!',
  statementDateError: 'Statement date is required!',
  creditCardNameError: 'Credit card name is required!',
  cardTypeError: 'Credit card type is required!',
  expiryDateError: 'Expiry month and year is required!',
  expiryValidDateError: 'Please enter proper expity date!',
  itemSubCategoryError: 'Total amount and item total should be equal!',
  conversionError: 'Sorry! Unable to convert the file to pdf!',
  signOutError: 'Sorry! Unable to sign out!',
  creditLimitError: 'Credit limit is required!',
  areaRangeError: 'Range is required!',
};

export default strings;
