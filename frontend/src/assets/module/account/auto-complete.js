import { el } from 'redom';

export function accountAutoComplete(inputCheck) {
    const inputText = inputCheck.value.trim().toLowerCase();
    const savedAccountsString = localStorage.getItem('savedAccount');
    const savedAccounts = JSON.parse(savedAccountsString) || [];
    const suggestions = savedAccounts.filter(account => account.toLowerCase().includes(inputText));

    let autoCompleteContainer = document.querySelector('.auto-complete-container');

    if (!autoCompleteContainer) {
        autoCompleteContainer = el('div.auto-complete-container');
        inputCheck.parentNode.insertBefore(autoCompleteContainer, inputCheck.nextSibling);
    }

    autoCompleteContainer.innerHTML = '';

    if (suggestions.length > 0) {
        suggestions.forEach(account => {
            const suggestion = el('div.suggestion', { textContent: account });
            suggestion.addEventListener('click', () => {
                inputCheck.value = account;
                autoCompleteContainer.remove();
            });
            autoCompleteContainer.appendChild(suggestion);
        });
    }

    document.addEventListener('click', closeAutoComplete);

    function closeAutoComplete(event) {
        if (!autoCompleteContainer.contains(event.target) && event.target !== inputCheck) {
            autoCompleteContainer.remove();
            document.removeEventListener('click', closeAutoComplete);
        }
    }
}