// Account Endpoints
export const accountCreate = 'balance';
export const accountDelete = 'balance';
export const accountList = 'balance';
export const accountUpdate = 'balance';
export const accountView = 'transaction/bank';
export const accountBank = 'bank';

// Billing Endpoints
export const billing = 'bill';
export const billingCategory = 'expense-category';
export const billingCreateCategory = 'expense-category';
export const billingSubcategory = 'subcategory';
export const billingCreateSubCategory = 'subcategory';
export const billingGroup = 'group';
export const billingCreateGroup = 'group';
export const billingCreate = 'bill';
export const billingDelete = 'bill';
export const billingView = 'bill';
export const billingUpdate = 'bill';
export const billingList = 'bill/group/list';
export const billingSettle = 'bill/settle';
export const billingStopRecurring = 'bill/stop-recurring';
export const billingBank = 'balance/account/getAll';

// Budget Endpoints
export const budget = 'budget';
export const budgetCategory = 'expense-category';
export const budgetCreateCategory = 'expense-category';
export const budgetSubcategory = 'subcategory';
export const budgetCreateSubCategory = 'subcategory';
export const budgetGroup = 'group';
export const budgetCreateGroup = 'group';
export const budgetCreate = 'budget';
export const budgetList = 'budget';
export const budgetDelete = 'budget';
export const budgetDeleteGetById = 'budget/findby/month';
export const budgetView = 'budget';
export const budgetUpdate = 'budget';
export const budgetSummaryList = 'budget/month/list/';

// Claims Endpoints
export const claimsBank = 'balance/account/getAll';
export const claimSettle = 'expense/settle';
export const claimWriteOff = 'expense/writeoff';
export const claimList = 'expense/claim/list';
export const claimDelete = 'expense';
export const claimView = 'expense';

// Credit Endpoints
export const creditCard = 'creditcard';
export const creditBank = 'bank';
export const creditCardType = 'creditcardtype';
export const creditCardCreate = 'creditcard';
export const creditCardList = 'creditcard';
export const creditCardDelete = 'creditcard';
export const creditCardView = 'creditcard';
export const creditCardUpdate = 'creditcard';
export const creditCardAmountPointsList = 'creditcard/summary/list';
export const creditCardPointsList = 'creditcard';

// Earning Endpoints
export const earning = 'creditcardpoints';
export const creditEarningCategory = 'expense-category';
export const creditEarningSubCategory = 'subcategory';
export const creditEarningCreateSubCategory = 'subcategory';
export const earningCreate = 'creditcardpoints';
export const earningView = 'creditcardpoints';
export const earningUpdate = 'creditcardpoints';
export const earningDelete = 'creditcardpoints';

// Expense Endpoints
export const expense = 'expense';
export const expenseCategory = 'expense-category';
export const expenseSubcategory = 'subcategory';
export const expenseCreateSubCategory = 'subcategory';
export const expenseGroup = 'group';
export const expenseCreateGroup = 'group';
export const expenseCreate = 'expense';
export const expenseDelete = 'expense';
export const expenseView = 'expense';
export const expenseUpdate = 'expense';
export const expenseBank = 'balance/account/getAll';

// File Upload Endpoints
export const fileUpload = 's3/upload';

// Forgot Password Endpoints
export const forgotPassword = 'auth/forgot-password';

// Income Endpoints
export const income = 'income';
export const incomeCategory = 'expense-category';
export const incomeSubcategory = 'subcategory';
export const incomeCreateSubCategory = 'subcategory';
export const incomeBank = 'balance/account/getAll';
export const incomeCreate = 'income';
export const incomeView = 'income';
export const incomeUpdate = 'income';
export const incomeDelete = 'income';

// Menu Endpoints
export const menu = 'menu';
export const logout = 'auth/logout';

// OTP Endpoints
export const otpVerify = 'auth/verify-reset-otp';
export const resendOTP = 'auth/forgot-password';

// Reset Password Endpoints
export const resetPassword = 'auth/reset-password';

// Savings Recommender Endpoints
export const savingsRecommenderCategory = 'expense-category';
export const savingsRecommenderSubCategory = 'subcategory';
export const savingsRecommenderCreateSubCategory = 'subcategory';

// SignIn Endpoints
export const signIn = 'auth/login';

// SignUp Endpoints
export const signUp = 'auth/register';
export const accountVerify = 'auth/verify-account-otp';
export const emailVerify = 'auth/is-email-available';

// Social SignIn Endpoints
export const socialSignIn = 'auth/register';

// Spending Endpoints
export const spending = 'creditcardpoints';
export const creditSpendingCategory = 'expense-category';
export const creditSpendingSubCategory = 'subcategory';
export const creditSpendingCreateSubCategory = 'subcategory';
export const spendingCreate = 'creditcardpoints';
export const spendingView = 'creditcardpoints';
export const spendingUpdate = 'creditcardpoints';
export const spendingDelete = 'creditcardpoints';

// Splash Endpoints
export const fetchUser = 'users';
