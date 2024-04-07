import { el, setChildren } from 'redom';
import arrow from '../../images/arrow-back.svg';
import { router } from '../login.js';
import { createChart, createChart2, updateChart, updateChart2 } from './create-chart.js';
import { displayLastTenTransactions } from './transactions.js';
import changeImg from '../../images/change.png'

export function createHistory(accountId) {
    const account = el('div', { className: 'account-body' });
    const accountHeader = el('div', { className: 'account-header' });
    const accountTitle = el('h2.account-title', { textContent: 'Просмотр счёта' });
    const backBtn = el('button.back-btn');
    const bloackBtn = el('button.change-blocks')
    const arrowBtn = el('img');
    arrowBtn.src = arrow;
    arrowBtn.alt = 'arrow';
    const changeImgBtn = el('img');
    changeImgBtn.src = changeImg;
    changeImgBtn.alt = 'change';
    const accountInfo = el('div.account-info');
    const accountAmount = el('p.account-amount');
    const accountGroupText = el('div.account-group__text');
    const accountText = el('p.account-text', { textContent: 'Баланс' });
    const accountBalance = el('p.account-balance');
    const transfer = el('div.transfer.history-transfer');
    const token = sessionStorage.getItem('authToken');
    const canvasContainer = el('div.canvas-content');
    const canvasText = el('p.canvas-text', { textContent: 'Динамика баланса' })
    const canvas = el('canvas');
    const ctx = canvas.getContext('2d');
    const historyContent = el('div.history-content')
    const historyTitle = el('h2.history-title', { textContent: 'История переводов' })
    const historyTable = el('table.history-table');
    const tableHeaderRow = el('tr.table-content');
    const tableHeaderFrom = el('th', { textContent: 'Счёт отправителя' });
    const tableHeaderTo = el('th', { textContent: 'Счёт получателя' });
    const tableHeaderAmount = el('th', { textContent: 'Сумма' });
    const tableHeaderDate = el('th', { textContent: 'Дата' });
    const changeContent = el('div.change-block__content')
    setChildren(tableHeaderRow, [tableHeaderFrom, tableHeaderTo, tableHeaderAmount, tableHeaderDate]);

    backBtn.addEventListener('click', () => {
        router.navigate(`/check/${accountId}`);
    });

    canvas.id = 'myChart';

    setChildren(canvasContainer, [canvasText, canvas]);

    createChart(ctx);

    const canvasContainerDetail = el('div.canvas-content');
    const canvasTextDetail = el('p.canvas-text', { textContent: 'Соотношение входящих исходящих транзакций' })
    const canvasDetail = el('canvas');
    const ctxDetail = canvasDetail.getContext('2d');
    canvasDetail.id = 'myChart';
    setChildren(canvasContainerDetail, [canvasTextDetail, canvasDetail]);

    createChart2(ctxDetail)

    function getData(data) {
        accountAmount.textContent = data.payload.account;
        accountBalance.textContent = data.payload.balance;
        const transactions = data.payload.transactions;

        displayLastTenTransactions(transactions, accountId, historyTable, 25)
        setChildren(historyContent, [historyTitle, tableHeaderRow, historyTable]);
        const balanceHistory = {};
        const today = new Date();
        const monthNames = [
            "Январь", "Февраль", "Март",
            "Апрель", "Май", "Июнь", "Июль",
            "Август", "Сентябрь", "Октябрь",
            "Ноябрь", "Декабрь"
        ];

        for (let i = -1; i >= -12; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const key = `${monthNames[date.getMonth()]}`;
            balanceHistory[key] = 0;
        }

        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const month = `${monthNames[date.getMonth()]}`;
            if (balanceHistory[month]) {
                balanceHistory[month] += transaction.amount;
            }
        });

        const labels = Object.keys(balanceHistory);
        const balanceValues = Object.values(balanceHistory);

        updateChart(labels, balanceValues);
        updateChart2(labels, balanceValues, transactions, accountId);
    }

    function updateAccountBalance(accountId, token) {
        fetch(`http://localhost:3000/account/${accountId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${token}`
            },
        }).then(async(res) => {
            const data = await res.json();
                         
             getData(data)
        }).catch(error => {
            console.error('Ошибка при получении данных:', error);
        });
    }
    bloackBtn.addEventListener('click', () => {
        changeContent.classList.toggle('change-block__reverse')
    })
    updateAccountBalance(accountId, token);
    setChildren(bloackBtn, [changeImgBtn, el('span', 'Изменить вид')])
    setChildren(backBtn, [arrowBtn, el('span', 'Вернуться назад')]);
    setChildren(accountHeader, [accountTitle, backBtn]);
    setChildren(accountGroupText, [accountText, accountBalance]);
    setChildren(accountInfo, [accountAmount, accountGroupText]);
    setChildren(transfer, [canvasContainer, canvasContainerDetail]);
    setChildren(changeContent, [transfer, historyContent])
    setChildren(account, [bloackBtn, accountHeader, accountInfo, changeContent]);
    return account;
}