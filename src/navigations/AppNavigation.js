import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AccountView from '../screens/appScreens/balance/account/AccountView';
import Balance from '../screens/appScreens/balance/Balance';
import BillingClaim from '../screens/appScreens/billing/BillingClaim';
import BillingView from '../screens/appScreens/billing/BillingView';
import BudgetProgress from '../screens/appScreens/budget/BudgetProgress';
import Budget from '../screens/appScreens/budget/Budget';
import BudgetView from '../screens/appScreens/budget/BudgetView';
import Community from '../screens/appScreens/community/Community';
import CreateAccount from '../screens/appScreens/balance/account/CreateAccount';
import CreateBilling from '../screens/appScreens/billing/CreateBilling';
import CreateBudget from '../screens/appScreens/budget/CreateBudget';
import CreateCreditCard from '../screens/appScreens/balance/creditCard/CreateCreditCard';
import CreditCardList from '../screens/appScreens/balance/creditCard/CreditCardList';
import CreditCardTransaction from '../screens/appScreens/balance/creditCard/CreditCardTransaction';
import CreditCardView from '../screens/appScreens/balance/creditCard/CreditCardView';
import CreatePoints from '../screens/appScreens/balance/creditCard/rewards/points/CreatePoints';
import Dashboard from '../screens/appScreens/dashboard/Dashboard';
import Earning from '../screens/appScreens/balance/creditCard/rewards/points/Earning';
import EarningView from '../screens/appScreens/balance/creditCard/rewards/points/EarningView';
import Expense from '../screens/appScreens/receiptScanning/addManually/Expense';
import ExpenseView from '../screens/appScreens/receiptScanning/addManually/ExpenseView';
import FollowRequests from '../screens/appScreens/community/FollowRequests';
import Income from '../screens/appScreens/receiptScanning/addManually/Income';
import IncomeView from '../screens/appScreens/receiptScanning/addManually/IncomeView';
import Menu from '../screens/appScreens/Menu';
import Notification from '../screens/appScreens/Notification';
import ReceiptScanning from '../screens/appScreens/receiptScanning/ReceiptScanning';
import Rewards from '../screens/appScreens/balance/creditCard/rewards/Rewards';
import SavingsRecommender from '../screens/appScreens/savingsRecommender/SavingsRecommender';
import SavingsRecommenderMapView from '../screens/appScreens/savingsRecommender/SavingsRecommenderMapView';
import SavingsRecommenderPreviewBills from '../screens/appScreens/savingsRecommender/SavingsRecommenderPreviewBills';
import SavingsRecommenderSearch from '../screens/appScreens/savingsRecommender/SavingsRecommenderSearch';
import SavingsRecommenderView from '../screens/appScreens/savingsRecommender/SavingsRecommenderView';
import SettleBillings from '../screens/appScreens/billing/SettleBillings';
import SettleClaims from '../screens/appScreens/billing/SettleClaims';
import Spending from '../screens/appScreens/balance/creditCard/rewards/points/Spending';
import SpendingView from '../screens/appScreens/balance/creditCard/rewards/points/SpendingView';
import UserProfile from '../screens/appScreens/community/UserProfile';
import UserSearch from '../screens/appScreens/community/UserSearch';

const AppNavigation = () => {
  // AppNavigation Variables
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Group>
      <Stack.Screen name="AccountView" component={AccountView} />
      <Stack.Screen
        name="Balance"
        component={Balance}
        options={{headerBackVisible: false}}
      />
      <Stack.Screen
        name="BillingClaim"
        component={BillingClaim}
        options={{headerBackVisible: false}}
      />
      <Stack.Screen name="BillingView" component={BillingView} />
      <Stack.Screen
        name="BudgetProgress"
        component={BudgetProgress}
        options={{headerBackVisible: false}}
      />
      <Stack.Screen name="Budget" component={Budget} />
      <Stack.Screen name="BudgetView" component={BudgetView} />
      <Stack.Screen name="Community" component={Community} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
      <Stack.Screen name="CreateBilling" component={CreateBilling} />
      <Stack.Screen name="CreateBudget" component={CreateBudget} />
      <Stack.Screen name="CreateCreditCard" component={CreateCreditCard} />
      <Stack.Screen name="CreditCardList" component={CreditCardList} />
      <Stack.Screen
        name="CreditCardTransaction"
        component={CreditCardTransaction}
      />
      <Stack.Screen name="CreditCardView" component={CreditCardView} />
      <Stack.Screen name="CreatePoints" component={CreatePoints} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Earning" component={Earning} />
      <Stack.Screen name="EarningView" component={EarningView} />
      <Stack.Screen name="Expense" component={Expense} />
      <Stack.Screen name="ExpenseView" component={ExpenseView} />
      <Stack.Screen name="FollowRequests" component={FollowRequests} />
      <Stack.Screen name="Income" component={Income} />
      <Stack.Screen name="IncomeView" component={IncomeView} />
      <Stack.Screen
        name="Menu"
        component={Menu}
        options={{
          gestureEnabled: false,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="ReceiptScanning" component={ReceiptScanning} />
      <Stack.Screen name="Rewards" component={Rewards} />
      <Stack.Screen name="SavingsRecommender" component={SavingsRecommender} />
      <Stack.Screen
        name="SavingsRecommenderSearch"
        component={SavingsRecommenderSearch}
        options={{headerBackVisible: false}}
      />
      <Stack.Screen
        name="SavingsRecommenderMapView"
        component={SavingsRecommenderMapView}
      />
      <Stack.Screen
        name="SavingsRecommenderPreviewBills"
        component={SavingsRecommenderPreviewBills}
      />
      <Stack.Screen
        name="SavingsRecommenderView"
        component={SavingsRecommenderView}
      />
      <Stack.Screen name="SettleBillings" component={SettleBillings} />
      <Stack.Screen name="SettleClaims" component={SettleClaims} />
      <Stack.Screen name="Spending" component={Spending} />
      <Stack.Screen name="SpendingView" component={SpendingView} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="UserSearch" component={UserSearch} />
    </Stack.Group>
  );
};

export default AppNavigation;
