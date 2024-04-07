import { el, setChildren } from "redom";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function sceleton() {
    const cardContainer = el('div.sceleton-container');
    for (let i = 0; i < 9; i++) {
        const checkCard = el('article.check-card.sceleton-card');
        const cardInfo = el('div');
        const cardTitle = el('div.sceleton.sceleton-text');
        const cardAmount = el('div.sceleton.sceleton-text');
        const cardText = el('div.sceleton.sceleton-text', );
        const cardDate = el('div.sceleton.sceleton-text', );
        const cardDate2 = el('div.sceleton.sceleton-text', );
        const cardBtn = el('div.sceleton.sceleton-btn');

        setChildren(cardInfo, [cardTitle, cardAmount, cardText, cardDate, cardDate2]);
        setChildren(checkCard, [cardInfo, cardBtn]);
        cardContainer.append(checkCard)
    }

    return cardContainer;
}

export function createCheckCard(accountData) {
    const checkCard = el('article', { className: 'check-card' });
    const cardInfo = el('div', { className: 'card-info' });
    const cardTitle = el('h2.card-title', { textContent: accountData.account });
    const cardAmount = el('p.card-amount', { textContent: accountData.balance });
    const cardText = el('p.card-text', { textContent: 'Последняя транзакция:' });
    const cardDate = el('p', { className: 'card-date' });
    const cardBtn = el('button.check-btn', {
        textContent: 'Открыть',
        'data-account-id': accountData.account
    });

    if (accountData.transactions && accountData.transactions.length > 0) {
        const latestTransactionDate = new Date(accountData.transactions[0].date);
        cardDate.innerHTML = format(latestTransactionDate, 'dd MMMM yyyy', { locale: ru });
    } else {
        cardDate.innerHTML = 'Нет транзакций';
    }

    setChildren(cardInfo, [cardTitle, cardAmount, cardText, cardDate]);
    setChildren(checkCard, [cardInfo, cardBtn]);

    return checkCard;
}
