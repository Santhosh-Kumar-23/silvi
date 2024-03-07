import Labels from './Strings';
import * as Helpers from './Helpers';

export const billShareContent = billingData => {
  const date =
    Boolean(billingData) &&
    billingData.hasOwnProperty('datedOn') &&
    Boolean(billingData.datedOn)
      ? Helpers.formatDateTime(billingData.datedOn, null, Labels.formatDMY)
      : null;

  const category =
    Boolean(billingData) &&
    billingData.hasOwnProperty('category') &&
    billingData.category.hasOwnProperty('name') &&
    Boolean(billingData.category.name)
      ? billingData.category.name
      : null;

  const subCategory =
    Boolean(billingData) &&
    billingData.hasOwnProperty('subcategory') &&
    billingData.subcategory.hasOwnProperty('name') &&
    Boolean(billingData.subcategory.name)
      ? billingData.subcategory.name
      : null;

  const group =
    Boolean(billingData) &&
    billingData.hasOwnProperty('group') &&
    billingData.group.hasOwnProperty('name') &&
    Boolean(billingData.group.name)
      ? billingData.group.name
      : null;

  const shopPayee =
    Boolean(billingData) &&
    billingData.hasOwnProperty('payee') &&
    Boolean(billingData.payee)
      ? billingData.payee
      : null;

  const currency =
    Boolean(billingData) &&
    billingData.hasOwnProperty('currency') &&
    Boolean(billingData.currency)
      ? billingData.currency
      : null;

  const totalAmount =
    Boolean(billingData) &&
    billingData.hasOwnProperty('amount') &&
    Boolean(billingData.amount)
      ? parseFloat(billingData.amount).toFixed(2)
      : null;

  const recurrence =
    Boolean(billingData) &&
    billingData.hasOwnProperty('isReccurening') &&
    Boolean(billingData.isReccurening)
      ? Labels.yes
      : Labels.no;

  const recurrenceFrequency =
    Boolean(billingData) &&
    billingData.hasOwnProperty('reccurenceFrequency') &&
    Boolean(billingData.reccurenceFrequency)
      ? billingData.reccurenceFrequency
      : null;

  return `
    <!DOCTYPE html>
    <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${Labels.billing}</title>
        </head>

        <body>
            <div>
                <table style="width:85%; margin: auto;">
                    <tr>
                        <td colspan="4" style="text-align:center">
                        <img src="https://www.silvi.asia/static/media/logo.a503fe1c02410b5ced7e.webp" style="height: 60px; width:60px; object-fit: contain; text-align: center; "
                            alt="">
                        </td>
                    </tr>
                    <th colspan="4" style=" padding: 8px 3px; font-size: 20px; padding-top: 15px;">${
                      Labels.billing
                    }</th>
                    <tr>
                        <td colspan="4" style="text-align: right ; padding: 8px 3px">${
                          Labels.date
                        }} : ${date || '-'}</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">${Labels.category}</td>
                        <td style=" padding: 8px 3px; font-weight: bold;">${
                          category || 'N/A'
                        }</td>
                        <td style="width: 100px;  padding: 8px 3px;">${
                          Labels.subCategory
                        }</td>
                        <td style="text-align:right;  padding: 8px 3px;font-weight: bold">${
                          Boolean(subCategory) &&
                          subCategory.toLowerCase() ==
                            Labels.others.toLowerCase()
                            ? `${subCategory} (${billingData.subcategoryOther})`
                            : subCategory || 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">${Labels.group}</td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          group || 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">${Labels.payee}</td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          shopPayee || 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">${Labels.currency}</td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          currency || 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">
                        ${Labels.totalAmount}
                        </td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          Boolean(currency) ? `${currency} ` : null
                        }${totalAmount || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">
                        ${Labels.recurrence}
                        </td>
                        <td style=" padding: 8px 3px;font-weight: bold">
                        ${recurrence || 'N/A'}
                        </td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">
                        ${Labels.recurrenceFrequency}
                        </td>
                        <td style=" padding: 8px 3px;font-weight: bold">
                        ${
                          Boolean(recurrenceFrequency) &&
                          recurrenceFrequency.toLowerCase() ==
                            Labels.others.toLowerCase()
                            ? `${recurrenceFrequency} (${billingData.reccurenceTime} ${billingData.reccurenceTimeFrequency})`
                            : recurrenceFrequency || 'N/A'
                        }
                        </td>
                    </tr>
                </table>
            </div>
        </body>

    </html>
  `;
};

export const budgetShareContent = budgetData => {
  const category =
    Boolean(budgetData) &&
    budgetData.hasOwnProperty('category') &&
    budgetData.category.hasOwnProperty('name') &&
    Boolean(budgetData.category.name)
      ? budgetData.category.name
      : null;

  const subCategory =
    Boolean(budgetData) &&
    budgetData.hasOwnProperty('subcategory') &&
    budgetData.subcategory.hasOwnProperty('name') &&
    Boolean(budgetData.subcategory.name)
      ? budgetData.subcategory.name
      : null;

  const group =
    Boolean(budgetData) &&
    budgetData.hasOwnProperty('group') &&
    budgetData.group.hasOwnProperty('name') &&
    Boolean(budgetData.group.name)
      ? budgetData.group.name
      : null;

  const currency =
    Boolean(budgetData) &&
    budgetData.hasOwnProperty('currency') &&
    Boolean(budgetData.currency)
      ? budgetData.currency
      : null;

  const totalAmount =
    Boolean(budgetData) &&
    budgetData.hasOwnProperty('amount') &&
    Boolean(budgetData.amount)
      ? parseFloat(budgetData.amount).toFixed(2)
      : null;

  return `
    <!DOCTYPE html>
    <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${Labels.budget}</title>
        </head>

        <body>
            <div>
                <table style="width:85%; margin: auto;">
                    <tr>
                        <td colspan="4" style="text-align:center">
                        <img src="https://www.silvi.asia/static/media/logo.a503fe1c02410b5ced7e.webp" style="height: 60px; width:60px; object-fit: contain; text-align: center; "
                            alt="" />
                        </td>
                    </tr>
                    <th colspan="4" style=" padding: 8px 3px; font-size: 20px;padding-top: 15px;">${
                      Labels.budget
                    }</th>
                    <tr>
                        <td style=" padding: 8px 3px;">${Labels.category}</td>
                        <td style=" padding: 8px 3px; font-weight: bold;">${
                          category || 'N/A'
                        }</td>
                        <td style="width: 100px;  padding: 8px 3px;">${
                          Labels.subCategory
                        }</td>
                        <td style="text-align:right;  padding: 8px 3px;font-weight: bold">${
                          Boolean(subCategory) &&
                          subCategory.toLowerCase() ==
                            Labels.others.toLowerCase()
                            ? `${subCategory} (${budgetData.subcategoryOther})`
                            : subCategory || 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">${Labels.group}</td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          group || 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">${Labels.currency}</td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          currency || 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">
                        ${Labels.totalAmount}
                        </td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          Boolean(currency) ? `${currency} ` : null
                        }${totalAmount || 'N/A'}</td>
                    </tr>
                </table>
            </div>
        </body>

    </html>
    `;
};

export const creditCardShareContent = creditCardData => {
  const bank =
    Boolean(creditCardData) &&
    creditCardData.hasOwnProperty('bank') &&
    creditCardData.bank.hasOwnProperty('name') &&
    Boolean(creditCardData.bank.name)
      ? creditCardData.bank.name
      : null;

  const creditCardType =
    Boolean(creditCardData) &&
    creditCardData.hasOwnProperty('cardtype') &&
    creditCardData.cardtype.hasOwnProperty('name') &&
    Boolean(creditCardData.cardtype.name)
      ? creditCardData.cardtype.name
      : null;

  const creditCardName =
    Boolean(creditCardData) &&
    creditCardData.hasOwnProperty('name') &&
    Boolean(creditCardData.name)
      ? creditCardData.name
      : null;

  const creditCardExpiryDate =
    Boolean(creditCardData) &&
    creditCardData.hasOwnProperty('expiry') &&
    Boolean(creditCardData.expiry)
      ? creditCardData.expiry
      : null;

  const creditCardLimit =
    Boolean(creditCardData) &&
    creditCardData.hasOwnProperty('amount') &&
    Boolean(creditCardData.amount)
      ? creditCardData.amount
      : null;

  const creditCardPoints =
    Boolean(creditCardData) &&
    creditCardData.hasOwnProperty('points') &&
    Boolean(creditCardData.points)
      ? creditCardData.points
      : null;

  const creditCardStatementDate =
    Boolean(creditCardData) &&
    creditCardData.hasOwnProperty('billCycle') &&
    Boolean(creditCardData.billCycle)
      ? creditCardData.billCycle
      : null;

  const creditCardDueDate =
    Boolean(creditCardData) &&
    creditCardData.hasOwnProperty('billCycle') &&
    Boolean(creditCardData.billCycle)
      ? creditCardData.billCycle
      : '-';

  return `
    <!DOCTYPE html>
    <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${Labels.creditCard}</title>
        </head>

        <body>
            <div>
                <table style="width:85%; margin: auto;">
                    <tr>
                        <td colspan="4" style="text-align:center">
                        <img src="https://www.silvi.asia/static/media/logo.a503fe1c02410b5ced7e.webp" style="height: 60px; width:60px; object-fit: contain; text-align: center; "
                            alt="">
                        </td>
                    </tr>
                    <th colspan="4" style=" padding: 8px 3px; font-size: 20px; padding-top: 15px;">${
                      Labels.creditCard
                    }</th>
                    <tr>
                        <td style=" padding: 8px 3px;">${Labels.bank}</td>
                        <td style=" padding: 8px 3px; font-weight: bold;">${
                          bank || 'N/A'
                        }</td>
                        <td style="width: 160px;  padding: 8px 3px;">${
                          Labels.creditCardType
                        }</td>
                        <td style="text-align:right;  padding: 8px 3px;font-weight: bold">${
                          creditCardType || 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style="width: 160px; padding: 8px 3px;">${
                          Labels.creditCardName
                        }</td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          creditCardName || 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">${Labels.expiryDate}</td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          creditCardExpiryDate || 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style="width: 160px; padding: 8px 3px;">
                        ${Labels.creditCardLimit}
                        </td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          Boolean(creditCardLimit)
                            ? `${Labels.rm} ${creditCardLimit}`
                            : 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">
                        ${Labels.creditCardRewardPoints}
                        </td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          Boolean(creditCardPoints)
                            ? `${creditCardPoints} ${Labels.pts}`
                            : 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">
                        ${Labels.statementDate}
                        </td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          Boolean(creditCardStatementDate)
                            ? `${Helpers.ordinalFormatter(
                                creditCardStatementDate,
                              )} of every month will be your ${Labels.statementDate.toLowerCase()}.`
                            : 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">
                        ${Labels.dueDate}
                        </td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          Boolean(creditCardDueDate)
                            ? `${Helpers.ordinalFormatter(
                                Helpers.dueCalculator(creditCardDueDate),
                              )} of every month will be your ${Labels.dueDate.toLowerCase()}.`
                            : 'N/A'
                        }</td>
                    </tr>
                </table>
            </div>
        </body>

    </html>
  `;
};

export const earningShareContent = earningData => {
  const date =
    Boolean(earningData) &&
    earningData.hasOwnProperty('datedOn') &&
    Boolean(earningData.datedOn)
      ? Helpers.formatDateTime(earningData.datedOn, null, Labels.formatDMY)
      : null;

  const earningForCategory =
    Boolean(earningData) &&
    earningData.hasOwnProperty('category') &&
    earningData.category.hasOwnProperty('name') &&
    Boolean(earningData.category.name)
      ? earningData.category.name
      : null;

  const earningForSubCategory =
    Boolean(earningData) &&
    earningData.hasOwnProperty('subcategory') &&
    earningData.subcategory.hasOwnProperty('name') &&
    Boolean(earningData.subcategory.name)
      ? earningData.subcategory.name
      : null;

  const creditCardBank =
    earningData.hasOwnProperty('creditcard') &&
    Boolean(earningData.creditcard) &&
    earningData.creditcard.hasOwnProperty('bank') &&
    Boolean(earningData.creditcard.bank) &&
    earningData.creditcard.bank.hasOwnProperty('name') &&
    Boolean(earningData.creditcard.bank.name)
      ? earningData.creditcard.bank.name
      : null;

  const creditCardName =
    earningData.hasOwnProperty('creditcard') &&
    Boolean(earningData.creditcard) &&
    earningData.creditcard.hasOwnProperty('name')
      ? earningData.creditcard.name
      : null;

  const creditCardType =
    earningData.hasOwnProperty('creditcard') &&
    Boolean(earningData.creditcard) &&
    earningData.creditcard.hasOwnProperty('cardtype') &&
    earningData.creditcard.cardtype.hasOwnProperty('name')
      ? earningData.creditcard.cardtype.name
      : null;

  const payer =
    Boolean(earningData) &&
    earningData.hasOwnProperty('name') &&
    Boolean(earningData.name)
      ? earningData.name
      : null;

  const points =
    Boolean(earningData) &&
    earningData.hasOwnProperty('points') &&
    Boolean(earningData.points)
      ? earningData.points
      : null;

  return `
    <!DOCTYPE html>
    <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${Labels.earning}</title>
        </head>

        <body>
            <div>
                <table style="width:85%; margin: auto;">
                    <tr>
                        <td colspan="4" style="text-align:center">
                        <img src="https://www.silvi.asia/static/media/logo.a503fe1c02410b5ced7e.webp" style="height: 60px; width:60px; object-fit: contain; text-align: center; "
                            alt="" />
                        </td>
                    </tr>
                    <th colspan="4" style=" padding: 8px 3px; font-size: 20px; padding-top: 15px;">${
                      Labels.earning
                    }</th>
                    <tr>
                        <td colspan="4" style="text-align: right ; padding: 8px 3px">${
                          Labels.date
                        } : ${date || '-'}</td>

                    </tr>
                    <tr>
                        <td colspan="4" style=" padding: 8px 3px;font-size: 17px;">${
                          Labels.earningFor
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">${Labels.category}</td>
                        <td style=" padding: 8px 3px; font-weight: bold;">${
                          earningForCategory || 'N/A'
                        }</td>
                        <td style="width: 100px;  padding: 8px 3px;">${
                          Labels.subCategory
                        }</td>
                        <td style="text-align:right;  padding: 8px 3px;font-weight: bold">${
                          Boolean(earningForSubCategory) &&
                          earningForSubCategory.toLowerCase() ==
                            Labels.others.toLowerCase()
                            ? `${earningForSubCategory} (${earningData.subcategoryOther})`
                            : earningForSubCategory || 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">${Labels.creditCard}</td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          Boolean(creditCardBank)
                            ? `${creditCardBank}${
                                Boolean(creditCardType && creditCardName)
                                  ? ` - ${creditCardType} (${creditCardName})`
                                  : ''
                              }`
                            : 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">${Labels.payer}</td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          payer || 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">
                        ${Labels.points}
                        </td>
                        <td style=" padding: 8px 3px;font-weight: bold">
                        ${Boolean(points) ? `${points} ${Labels.pts}` : 'N/A'}
                        </td>
                    </tr>
                </table>
            </div>
        </body>

    </html>
  `;
};

export const expenseShareContent = (expenseInfoData, expenseItemsData) => {
  const date =
    Boolean(expenseInfoData) &&
    expenseInfoData.hasOwnProperty('datedOn') &&
    Boolean(expenseInfoData.datedOn)
      ? Helpers.formatDateTime(expenseInfoData.datedOn, null, Labels.formatDMY)
      : null;

  const madePaymentForCategory =
    Boolean(expenseInfoData) &&
    expenseInfoData.hasOwnProperty('category') &&
    expenseInfoData.category.hasOwnProperty('name') &&
    Boolean(expenseInfoData.category.name)
      ? expenseInfoData.category.name
      : null;

  const madePaymentForSubCategory =
    Boolean(expenseInfoData) &&
    expenseInfoData.hasOwnProperty('subcategory') &&
    expenseInfoData.subcategory.hasOwnProperty('name') &&
    Boolean(expenseInfoData.subcategory.name)
      ? expenseInfoData.subcategory.name
      : null;

  const claimable =
    Boolean(expenseInfoData) &&
    expenseInfoData.hasOwnProperty('claimable') &&
    Boolean(expenseInfoData.claimable)
      ? expenseInfoData.claimable
      : false;

  const groupName =
    Boolean(expenseInfoData) &&
    expenseInfoData.hasOwnProperty('group') &&
    Boolean(expenseInfoData.group) &&
    expenseInfoData.group.hasOwnProperty('name') &&
    Boolean(expenseInfoData.group.name)
      ? expenseInfoData.group.name
      : null;

  const checkBalanceKey =
    Boolean(expenseInfoData) &&
    expenseInfoData.hasOwnProperty('balance') &&
    Boolean(expenseInfoData.balance) &&
    expenseInfoData.balance.hasOwnProperty('bank') &&
    Boolean(expenseInfoData.balance.bank) &&
    expenseInfoData.balance.bank.hasOwnProperty('name') &&
    Boolean(expenseInfoData.balance.bank.name)
      ? expenseInfoData.balance.bank.name
      : null;

  const checkCreditCardKey =
    expenseInfoData.hasOwnProperty('creditcard') &&
    Boolean(expenseInfoData.creditcard) &&
    expenseInfoData.creditcard.hasOwnProperty('bank') &&
    Boolean(expenseInfoData.creditcard.bank) &&
    expenseInfoData.creditcard.bank.hasOwnProperty('name') &&
    Boolean(expenseInfoData.creditcard.bank.name)
      ? expenseInfoData.creditcard.bank.name
      : null;

  const madePaymentViaBank = checkBalanceKey || checkCreditCardKey || null;

  const creditCardName =
    expenseInfoData.hasOwnProperty('creditcard') &&
    Boolean(expenseInfoData.creditcard) &&
    expenseInfoData.creditcard.hasOwnProperty('name')
      ? expenseInfoData.creditcard.name
      : null;

  const creditCardType =
    expenseInfoData.hasOwnProperty('creditcard') &&
    Boolean(expenseInfoData.creditcard) &&
    expenseInfoData.creditcard.hasOwnProperty('cardtype') &&
    expenseInfoData.creditcard.cardtype.hasOwnProperty('name')
      ? expenseInfoData.creditcard.cardtype.name
      : null;

  const shopPayee =
    Boolean(expenseInfoData) &&
    expenseInfoData.hasOwnProperty('payee') &&
    Boolean(expenseInfoData.payee)
      ? expenseInfoData.payee
      : null;

  const totalAmount =
    Boolean(expenseInfoData) &&
    expenseInfoData.hasOwnProperty('amount') &&
    Boolean(expenseInfoData.amount)
      ? parseFloat(expenseInfoData.amount).toFixed(2)
      : null;

  const recurrence =
    Boolean(expenseInfoData) &&
    expenseInfoData.hasOwnProperty('isReccurening') &&
    Boolean(expenseInfoData.isReccurening)
      ? Labels.yes
      : Labels.no;

  const recurrenceFrequency =
    Boolean(expenseInfoData) &&
    expenseInfoData.hasOwnProperty('reccurenceFrequency') &&
    Boolean(expenseInfoData.reccurenceFrequency)
      ? expenseInfoData.reccurenceFrequency
      : null;

  const notes =
    Boolean(expenseInfoData) &&
    expenseInfoData.hasOwnProperty('note') &&
    Boolean(expenseInfoData.note)
      ? expenseInfoData.note
      : null;

  const attachment =
    Boolean(expenseInfoData) &&
    expenseInfoData.hasOwnProperty('attachment') &&
    Boolean(expenseInfoData.attachment)
      ? expenseInfoData.attachment
      : null;

  return `
    <!DOCTYPE html>
    <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${Labels.expense}</title>
        </head>

        <body>
            <div>
                <table style="width:85%; margin: auto;">
                    <tr>
                        <td colspan="4" style="text-align:center">
                        <img src="https://www.silvi.asia/static/media/logo.a503fe1c02410b5ced7e.webp" style="height: 60px; width:60px; object-fit: contain; text-align: center; "
                            alt="" />
                        </td>
                    </tr>
                    <th colspan="4" style=" padding: 8px 3px; font-size: 20px; padding-top: 15px;">${
                      Labels.expense
                    }</th>
                    <tr>
                        <td colspan="4" style="text-align: right ; padding: 8px 3px">${
                          Labels.date
                        } : ${date || '-'}</td>

                    </tr>
                    <tr>
                        <td colspan="4" style=" padding: 8px 3px;font-size: 17px;">${
                          Labels.madePaymentFor
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">${Labels.category}</td>
                        <td style=" padding: 8px 3px; font-weight: bold;">${
                          madePaymentForCategory || 'N/A'
                        }</td>
                        <td style="width: 100px;  padding: 8px 3px;">${
                          Labels.subCategory
                        }</td>
                        <td style="text-align:right;  padding: 8px 3px;font-weight: bold">${
                          Boolean(madePaymentForSubCategory) &&
                          madePaymentForSubCategory.toLowerCase() ==
                            Labels.others.toLowerCase()
                            ? `${madePaymentForSubCategory} (${expenseInfoData.subcategoryOther})`
                            : madePaymentForSubCategory || 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">${Labels.claimable}</td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          Boolean(claimable) ? Labels.yes : Labels.no
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">${Labels.groupName}</td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          groupName || 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">${
                          Labels.madePaymentVia
                        }</td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          Boolean(madePaymentViaBank)
                            ? `${madePaymentViaBank}${
                                Boolean(creditCardType && creditCardName)
                                  ? ` - ${creditCardType} (${creditCardName})`
                                  : ''
                              }`
                            : 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">${Labels.payee}</td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          shopPayee || 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">
                        ${Labels.totalAmount}
                        </td>
                        <td style=" padding: 8px 3px;font-weight: bold">
                        ${
                          Boolean(totalAmount)
                            ? `${Labels.rm} ${totalAmount}`
                            : 'N/A'
                        }
                        </td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">
                        ${Labels.recurrence}
                        </td>
                        <td style=" padding: 8px 3px;font-weight: bold">
                        ${recurrence || 'N/A'}
                        </td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">
                        ${Labels.recurrenceFrequency}
                        </td>
                        <td style=" padding: 8px 3px;font-weight: bold">
                        ${
                          Boolean(recurrenceFrequency) &&
                          recurrenceFrequency.toLowerCase() ==
                            Labels.others.toLowerCase()
                            ? `${recurrenceFrequency} (${expenseInfoData.reccurenceTime} ${expenseInfoData.reccurenceTimeFrequency})`
                            : recurrenceFrequency || 'N/A'
                        }
                        </td>
                    </tr>
                    ${renderItemsSubCategory(expenseItemsData)}
                    <tr>
                        <td style=" padding: 8px 3px;">${Labels.notes}</td>
                        <td style=" padding: 8px 3px;font-weight: bold">
                          ${notes || 'N/A'}
                        </td>
                    </tr>
                    <tr>
                        <td ${
                          Boolean(attachment) && `colspan="4"`
                        } style=" padding: 8px 3px;">
                          ${Labels.attachment} :
                        </td>
                        ${
                          !Boolean(attachment) &&
                          `<td style=" padding: 8px 3px;font-weight: bold">
                            N/A
                          </td>`
                        }
                    </tr>
                    ${
                      Boolean(attachment) &&
                      `<tr>
                            <td colspan="4" style=" padding: 8px 3px;">
                              <img
                                style="height: 300px; width:200px; object-fit: contain;"
                                src=${attachment}
                                alt=""
                              />
                            </td>
                          </tr>`
                    }
                </table>
            </div>
        </body>

    </html>
  `;
};

export const incomeShareContent = (incomeInfoData, incomeItemsData) => {
  const date =
    Boolean(incomeInfoData) &&
    incomeInfoData.hasOwnProperty('datedOn') &&
    Boolean(incomeInfoData.datedOn)
      ? Helpers.formatDateTime(incomeInfoData.datedOn, null, Labels.formatDMY)
      : null;

  const receivedPaymentForCategory =
    Boolean(incomeInfoData) &&
    incomeInfoData.hasOwnProperty('category') &&
    incomeInfoData.category.hasOwnProperty('name') &&
    Boolean(incomeInfoData.category.name)
      ? incomeInfoData.category.name
      : null;

  const receivedPaymentForSubCategory =
    Boolean(incomeInfoData) &&
    incomeInfoData.hasOwnProperty('subcategory') &&
    incomeInfoData.subcategory.hasOwnProperty('name') &&
    Boolean(incomeInfoData.subcategory.name)
      ? incomeInfoData.subcategory.name
      : null;

  const receivedPaymentViaBank =
    Boolean(incomeInfoData) &&
    incomeInfoData.hasOwnProperty('balance') &&
    Boolean(incomeInfoData.balance) &&
    incomeInfoData.balance.hasOwnProperty('bank') &&
    Boolean(incomeInfoData.balance.bank) &&
    incomeInfoData.balance.bank.hasOwnProperty('name') &&
    Boolean(incomeInfoData.balance.bank.name)
      ? incomeInfoData.balance.bank.name
      : null;

  const payer =
    Boolean(incomeInfoData) &&
    incomeInfoData.hasOwnProperty('payer') &&
    Boolean(incomeInfoData.payer)
      ? incomeInfoData.payer
      : null;

  const totalAmount =
    Boolean(incomeInfoData) &&
    incomeInfoData.hasOwnProperty('amount') &&
    Boolean(incomeInfoData.amount)
      ? parseFloat(incomeInfoData.amount).toFixed(2)
      : null;

  const recurrence =
    Boolean(incomeInfoData) &&
    incomeInfoData.hasOwnProperty('isReccurening') &&
    Boolean(incomeInfoData.isReccurening)
      ? Labels.yes
      : Labels.no;

  const recurrenceFrequency =
    Boolean(incomeInfoData) &&
    incomeInfoData.hasOwnProperty('reccurenceFrequency') &&
    Boolean(incomeInfoData.reccurenceFrequency)
      ? incomeInfoData.reccurenceFrequency
      : null;

  const notes =
    Boolean(incomeInfoData) &&
    incomeInfoData.hasOwnProperty('note') &&
    Boolean(incomeInfoData.note)
      ? incomeInfoData.note
      : null;

  const attachment =
    Boolean(incomeInfoData) &&
    incomeInfoData.hasOwnProperty('attachment') &&
    Boolean(incomeInfoData.attachment)
      ? incomeInfoData.attachment
      : null;

  return `
      <!DOCTYPE html>
      <html lang="en">
  
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${Labels.income}</title>
          </head>
  
          <body>
              <div>
                  <table style="width:85%; margin: auto;">
                      <tr>
                          <td colspan="4" style="text-align:center">
                          <img src="https://www.silvi.asia/static/media/logo.a503fe1c02410b5ced7e.webp" style="height: 60px; width:60px; object-fit: contain; text-align: center; "
                              alt="" />
                          </td>
                      </tr>
                      <th colspan="4" style=" padding: 8px 3px; font-size: 20px; padding-top: 15px;">${
                        Labels.income
                      }</th>
                      <tr>
                          <td colspan="4" style="text-align: right ; padding: 8px 3px">${
                            Labels.date
                          } : ${date || '-'}</td>
  
                      </tr>
                      <tr>
                          <td colspan="4" style=" padding: 8px 3px;font-size: 17px;">${
                            Labels.receivedPaymentFor
                          }</td>
                      </tr>
                      <tr>
                          <td style=" padding: 8px 3px;">${Labels.category}</td>
                          <td style=" padding: 8px 3px; font-weight: bold;">${
                            receivedPaymentForCategory || 'N/A'
                          }</td>
                          <td style="width: 100px;  padding: 8px 3px;">${
                            Labels.subCategory
                          }</td>
                          <td style="text-align:right;  padding: 8px 3px;font-weight: bold">${
                            Boolean(receivedPaymentForSubCategory) &&
                            receivedPaymentForSubCategory.toLowerCase() ==
                              Labels.others.toLowerCase()
                              ? `${receivedPaymentForSubCategory} (${incomeInfoData.subcategoryOther})`
                              : receivedPaymentForSubCategory || 'N/A'
                          }</td>
                      </tr>
                      <tr>
                          <td style=" padding: 8px 3px;">${
                            Labels.receivedPaymentVia
                          }</td>
                          <td style=" padding: 8px 3px;font-weight: bold">${
                            receivedPaymentViaBank || 'N/A'
                          }</td>
                      </tr>
                      <tr>
                          <td style=" padding: 8px 3px;">${Labels.payer}</td>
                          <td style=" padding: 8px 3px;font-weight: bold">${
                            payer || 'N/A'
                          }</td>
                      </tr>
                      <tr>
                          <td style=" padding: 8px 3px;">
                          ${Labels.totalAmount}
                          </td>
                          <td style=" padding: 8px 3px;font-weight: bold">
                          ${
                            Boolean(totalAmount)
                              ? `${Labels.rm} ${totalAmount}`
                              : 'N/A'
                          }
                          </td>
                      </tr>
                      <tr>
                          <td style=" padding: 8px 3px;">
                          ${Labels.recurrence}
                          </td>
                          <td style=" padding: 8px 3px;font-weight: bold">
                          ${recurrence || 'N/A'}
                          </td>
                      </tr>
                      <tr>
                          <td style=" padding: 8px 3px;">
                          ${Labels.recurrenceFrequency}
                          </td>
                          <td style=" padding: 8px 3px;font-weight: bold">
                          ${
                            Boolean(recurrenceFrequency) &&
                            recurrenceFrequency.toLowerCase() ==
                              Labels.others.toLowerCase()
                              ? `${recurrenceFrequency} (${incomeInfoData.reccurenceTime} ${incomeInfoData.reccurenceTimeFrequency})`
                              : recurrenceFrequency || 'N/A'
                          }
                          </td>
                      </tr>
                      ${renderItemsSubCategory(incomeItemsData)}
                      <tr>
                          <td style=" padding: 8px 3px;">${Labels.notes}</td>
                          <td style=" padding: 8px 3px;font-weight: bold">
                            ${notes || 'N/A'}
                          </td>
                      </tr>
                      <tr>
                          <td ${
                            Boolean(attachment) && `colspan="4"`
                          } style=" padding: 8px 3px;">
                            ${Labels.attachment} :
                          </td>
                          ${
                            !Boolean(attachment) &&
                            `<td style=" padding: 8px 3px;font-weight: bold">
                              N/A
                            </td>`
                          }
                      </tr>
                      ${
                        Boolean(attachment) &&
                        `<tr>
                              <td colspan="4" style=" padding: 8px 3px;">
                                <img
                                  style="height: 300px; width:200px; object-fit: contain;"
                                  src=${attachment}
                                  alt=""
                                />
                              </td>
                            </tr>`
                      }
                  </table>
              </div>
          </body>
  
      </html>
    `;
};

const renderItemsSubCategory = itemData => {
  return Boolean(itemData) && Array.isArray(itemData) && itemData.length != 0
    ? `<tr>
          <td
            colspan="2"
            style=" padding: 8px 3px; border-bottom: 0.2px solid #303030;">
            ${Labels.itemCategory}
          </td>
        </tr>
        ${itemData
          .map(
            (item, index) =>
              `<div key=${index}>
              <tr>
                  <td style=" padding: 8px 3px; font-size: 12px; font-weight: lighter;">
                  ${item.name}
                  </td>
                  <td style=" padding: 8px 3px;  font-size: 12px;font-weight: bold;">
                  ${
                    item.hasOwnProperty('priceUnit') && Boolean(item.priceUnit)
                      ? `${item.priceUnit} `
                      : null
                  }
                  ${
                    item.hasOwnProperty('price') && Boolean(item.price)
                      ? parseFloat(item.price).toFixed(2)
                      : '0.00'
                  }
                  </td>
              </tr>
              <tr>
                  <td
                  colspan="2"
                  style=" border-bottom: 0.2px solid #303030;"></td>
              </tr>
          </div>`,
          )
          .join('')}`
    : `
    <tr>
      <td style=" padding: 8px 3px;">${Labels.itemCategory}</td>
      <td style=" padding: 8px 3px;font-weight: bold">
        N/A
      </td>
    </tr>`;
};

export const spendingShareContent = spendingData => {
  const date =
    Boolean(spendingData) &&
    spendingData.hasOwnProperty('datedOn') &&
    Boolean(spendingData.datedOn)
      ? Helpers.formatDateTime(spendingData.datedOn, null, Labels.formatDMY)
      : null;

  const spendingForCategory =
    Boolean(spendingData) &&
    spendingData.hasOwnProperty('category') &&
    spendingData.category.hasOwnProperty('name') &&
    Boolean(spendingData.category.name)
      ? spendingData.category.name
      : null;

  const spendingForSubCategory =
    Boolean(spendingData) &&
    spendingData.hasOwnProperty('subcategory') &&
    spendingData.subcategory.hasOwnProperty('name') &&
    Boolean(spendingData.subcategory.name)
      ? spendingData.subcategory.name
      : null;

  const creditCardBank =
    spendingData.hasOwnProperty('creditcard') &&
    Boolean(spendingData.creditcard) &&
    spendingData.creditcard.hasOwnProperty('bank') &&
    Boolean(spendingData.creditcard.bank) &&
    spendingData.creditcard.bank.hasOwnProperty('name') &&
    Boolean(spendingData.creditcard.bank.name)
      ? spendingData.creditcard.bank.name
      : null;

  const creditCardName =
    spendingData.hasOwnProperty('creditcard') &&
    Boolean(spendingData.creditcard) &&
    spendingData.creditcard.hasOwnProperty('name')
      ? spendingData.creditcard.name
      : null;

  const creditCardType =
    spendingData.hasOwnProperty('creditcard') &&
    Boolean(spendingData.creditcard) &&
    spendingData.creditcard.hasOwnProperty('cardtype') &&
    spendingData.creditcard.cardtype.hasOwnProperty('name')
      ? spendingData.creditcard.cardtype.name
      : null;

  const shopPayee =
    Boolean(spendingData) &&
    spendingData.hasOwnProperty('name') &&
    Boolean(spendingData.name)
      ? spendingData.name
      : null;

  const points =
    Boolean(spendingData) &&
    spendingData.hasOwnProperty('points') &&
    Boolean(spendingData.points)
      ? spendingData.points
      : null;

  return `
    <!DOCTYPE html>
    <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${Labels.spending}</title>
        </head>

        <body>
            <div>
                <table style="width:85%; margin: auto;">
                    <tr>
                        <td colspan="4" style="text-align:center">
                        <img src="https://www.silvi.asia/static/media/logo.a503fe1c02410b5ced7e.webp" style="height: 60px; width:60px; object-fit: contain; text-align: center; "
                            alt="" />
                        </td>
                    </tr>
                    <th colspan="4" style=" padding: 8px 3px; font-size: 20px; padding-top: 15px;">${
                      Labels.spending
                    }</th>
                    <tr>
                        <td colspan="4" style="text-align: right ; padding: 8px 3px">${
                          Labels.date
                        } : ${date || '-'}</td>

                    </tr>
                    <tr>
                        <td colspan="4" style=" padding: 8px 3px;font-size: 17px;">${
                          Labels.spendingFor
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">${Labels.category}</td>
                        <td style=" padding: 8px 3px; font-weight: bold;">${
                          spendingForCategory || 'N/A'
                        }</td>
                        <td style="width: 100px;  padding: 8px 3px;">${
                          Labels.subCategory
                        }</td>
                        <td style="text-align:right;  padding: 8px 3px;font-weight: bold">${
                          Boolean(spendingForSubCategory) &&
                          spendingForSubCategory.toLowerCase() ==
                            Labels.others.toLowerCase()
                            ? `${spendingForSubCategory} (${spendingData.subcategoryOther})`
                            : spendingForSubCategory || 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">${Labels.creditCard}</td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          Boolean(creditCardBank)
                            ? `${creditCardBank}${
                                Boolean(creditCardType && creditCardName)
                                  ? ` - ${creditCardType} (${creditCardName})`
                                  : ''
                              }`
                            : 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">${Labels.payee}</td>
                        <td style=" padding: 8px 3px;font-weight: bold">${
                          shopPayee || 'N/A'
                        }</td>
                    </tr>
                    <tr>
                        <td style=" padding: 8px 3px;">
                        ${Labels.points}
                        </td>
                        <td style=" padding: 8px 3px;font-weight: bold">
                        ${Boolean(points) ? `${points} ${Labels.pts}` : 'N/A'}
                        </td>
                    </tr>
                </table>
            </div>
        </body>

    </html>
  `;
};
