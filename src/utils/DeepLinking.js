import React from 'react';
import Indicator from '../components/appComponents/Indicator';
import * as Endpoints from '../api/Endpoints';
import * as ENV from '../../env';

class HandleDeepLinking {
  linking = {
    prefixes: [ENV.deepLinkingScheme, ENV.deepLinkingHost],
    config: {
      initialRouteName: 'Menu',
      screens: {
        CreditCard: {path: Endpoints.creditCardList},
        CreditCardView: {path: `${Endpoints.creditCard}/:creditCardId`},
        Billing: {path: Endpoints.billingList},
        BillingView: {path: `${Endpoints.billing}/:billingId`},
        Budget: {path: Endpoints.budget},
        BudgetView: {path: `${Endpoints.budget}/:budgetId`},
        Earning: {path: Endpoints.earning},
        EarningView: {path: `${Endpoints.earning}/:earningId`},
        Expense: {path: Endpoints.expense},
        ExpenseView: {path: `${Endpoints.expense}/:expenseId`},
        Income: {path: Endpoints.income},
        IncomeView: {path: `${Endpoints.income}/:incomeId`},
        Menu: {path: Endpoints.menu},
        Spending: {path: Endpoints.spending},
        SpendingView: {path: `${Endpoints.spending}/:spendingId`},
      },
    },
  };

  handleFallBack = () => {
    return <Indicator />;
  };
}

const DeepLinking = new HandleDeepLinking();

export default DeepLinking;
