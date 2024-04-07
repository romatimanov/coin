import Choices from '@formio/choices.js';
import { createCheckCard } from './createCheckCard';

export function createSelect(data, selectContainer, checkContent, options) {
    const choices = new Choices(selectContainer, {
        searchEnabled: false,
        itemSelectText: '',
        allowHTML: true,
    });

    choices.setChoices(options, 'value', 'text', true);

    selectContainer.addEventListener('change', () => {
        const sortBy = selectContainer.value;
        if (sortBy === 'number') {
            data.payload.sort((a, b) => a.account.localeCompare(b.account, 'ru'));
        }
        if (sortBy === 'balance') {
            data.payload.sort((a, b) => a.balance - b.balance);
        }
        if (sortBy === 'transaction') {
            data.payload.sort((a, b) => {
                if (!a.transactions.length && !b.transactions.length) {
                    return 0;
                }
                if (!a.transactions.length) {
                    return 1;
                }
                if (!b.transactions.length) {
                    return -1;
                }
                return new Date(b.transactions[0].date) - new Date(a.transactions[0].date);
            });
        }
        checkContent.innerHTML = '';
        data.payload.forEach(accountData => {
            const checkCard = createCheckCard(accountData);
            checkContent.append(checkCard);
        });
    });
}