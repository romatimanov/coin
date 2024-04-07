import { format } from 'date-fns';
import { el, setChildren } from 'redom'

const tranferArray = []

export function createTransactionRow(data, accountId, historyTable) {

    const tableRow = el('tr.history-text');
    const fromCell = el('td');
    const toCell = el('td');
    let amountValue = data.amount;
    let amountCell
    const isInternalTransfer = data.from === accountId && data.to === accountId;

    function updateText() {
        const windowWidth = window.innerWidth;
        const mobileWidthThreshold = 1080;
        const isMobile = windowWidth < mobileWidthThreshold;

        if (isMobile) {
            fromCell.textContent = fromCell.textContent = '...' + data.from.slice(-4)
            toCell.textContent = fromCell.textContent = '...' + data.to.slice(-4)
        } else {
            fromCell.textContent = fromCell.textContent = data.from
            toCell.textContent = fromCell.textContent = data.to
        }
    }
    updateText()
    window.addEventListener('load', updateText);
    window.addEventListener('resize', updateText);

    if (isInternalTransfer) {
        const formatDate = new Date(data.date);
        const dateCell = el('td', { textContent: format(formatDate, 'dd MM yyyy') });

        const amountCellNegative = el('td.history-negative', { textContent: '- ' + data.amount + ' ₽' });
        const amountCellPositive = el('td.history-positive', { textContent: '+ ' + data.amount + ' ₽' });

        const existingNegativeRow = document.querySelector('.history-text.negative');
        const existingPositiveRow = document.querySelector('.history-text.positive');

        if (existingNegativeRow) {
            existingNegativeRow.remove();
        }
        if (existingPositiveRow) {
            existingPositiveRow.remove();
        }

        const tableRowNegative = el('tr.history-text.negative');
        const tableRowPositive = el('tr.history-text.positive');
        setChildren(tableRowNegative, [fromCell, toCell, amountCellNegative, dateCell.cloneNode(true)]);
        setChildren(tableRowPositive, [fromCell.cloneNode(true), toCell.cloneNode(true), amountCellPositive, dateCell.cloneNode(true)]);
        tranferArray.push(tableRowNegative)
        tranferArray.push(tableRowPositive)

        return tranferArray;
    } else if (data.from === accountId) {
        amountValue = '- ' + data.amount;
        amountCell = el('td.history-negative' + ' ₽', { textContent: amountValue });
    } else if (data.to === accountId) {
        amountValue = '+' + data.amount + ' ₽';
        amountCell = el('td.history-positive', { textContent: amountValue });
    }
    const formatDate = new Date(data.date);
    const dateCell = el('td', { textContent: format(formatDate, 'dd MM yyyy') });

    setChildren(tableRow, [fromCell, toCell, amountCell, dateCell]);
    historyTable.append(tableRow);
}

export function displayLastTenTransactions(transactions, accountId, historyTable, sum) {
    const combinedArray = [...transactions, ...tranferArray];
    combinedArray.sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastTenTransactions = combinedArray.slice(0, sum);
    historyTable.innerHTML = '';
    lastTenTransactions.forEach(transaction => {
        createTransactionRow(transaction, accountId, historyTable);
    });
}