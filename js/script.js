let transactions = [];

let editMode = false;

const form = document.querySelector('#form');
const transactionNameInput = document.getElementById('transaction_text');
const transactionAmountInput = document.getElementById('amount');
const btnSubmit = document.getElementById('btn-submit');
const errorContainer = document.getElementById('error');
const mainBalance = document.getElementById('main-balance');
const totalAmount = document.querySelector('.income-amount');
const totalExpensesTxt = document.querySelector('.expense-amount');
const totalIncomesTxt = document.querySelector('.income-amount');

form.addEventListener('submit', validateForm);

function validateForm(e) {
    e.preventDefault();
    
    if(transactionAmountInput.value === '' || transactionNameInput === '') {
        let errorMsg = document.createElement('P');
        errorMsg.textContent = 'Transaction and Amount fields are required.';
        errorMsg.classList.add('error');
        errorContainer.appendChild(errorMsg);
        setTimeout(() => {
            errorContainer.removeChild(errorMsg);
        }, 3000);
    } else {
        const transactionObj = {
            id: Math.floor(Math.random() * 10000000),
            transactionName: transactionNameInput.value,
            transactionAmount: +transactionAmountInput.value
        }
        addTransaction(transactionObj);
    }

}


function addTransaction(transaction) {
    transactions.push(transaction);
    showTransactions();
    form.reset();
}

function showTransactions() {
    cleanHtml();

    const transactionList = document.querySelector('.transaction-list');

    transactions.map(transaction => {
        const { id, transactionName, transactionAmount } = transaction;

       const liItem = document.createElement('LI');
       if(transactionAmount < 0) {
            liItem.classList.add('minus');
       } else {
            liItem.classList.add('plus');
       }
       const btnDelete = document.createElement('SPAN');
       btnDelete.textContent = 'X';
       btnDelete.classList.add('delete-btn');
       btnDelete.onclick = () => removeTransaction(id);
       liItem.appendChild(btnDelete);

       const transactionContainer = document.createElement('DIV');
       transactionContainer.classList.add('transaction');
       liItem.appendChild(transactionContainer);

       const transactionNameField = document.createElement('P');
       transactionNameField.textContent = transactionName;
       transactionContainer.appendChild(transactionNameField);

       const transactionAmountField = document.createElement('SPAN');
       transactionAmountField.textContent = transactionAmount;
       transactionContainer.appendChild(transactionAmountField);

       transactionList.appendChild(liItem);

       let totalBalance = calculateMainBalance();
       mainBalance.textContent = '$' + totalBalance;

       let totalExpenses = calculateTotalExpenses();
       totalExpensesTxt.textContent = '$' + totalExpenses;

       let totalIncomes = calculateTotalIncomes();
       totalIncomesTxt.textContent = '$' + totalIncomes;

    })
}

function calculateMainBalance() {
    const amounts = transactions.map(transaction => transaction.transactionAmount);
    let totalBalance = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    return totalBalance;
}

function calculateTotalIncomes() {
    const amounts = transactions.map(transaction => transaction.transactionAmount);
    let incomes = amounts.filter(amount=> amount > 0);
    let totalIncomes = incomes.reduce((acc, item) => acc + item, 0);
    return totalIncomes;
}

function calculateTotalExpenses() {
    const amounts = transactions.map(transaction => transaction.transactionAmount);
    let expenses = amounts.filter(amount => amount < 0);
    let totalExpenses = expenses.reduce((acc, item) => acc + item, 0);
    return totalExpenses;
}

function cleanHtml() {
    const transactionList = document.querySelector('.transaction-list');
    while(transactionList.firstChild) {
        transactionList.removeChild(transactionList.firstChild);
    }
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    cleanHtml();
    showTransactions();
}