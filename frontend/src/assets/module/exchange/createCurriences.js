import Choices from '@formio/choices.js';
import { el, setChildren } from 'redom';

function createCurrencies(data) {
    const currenciesItem = el('li.currencies-item exchange-item');
    const currenciesCode = el('p.currencies-code exchange-code', { textContent: data.code });
    const currenciesAmount = el('p.currencies-amount exchange-amount', { textContent: data.amount });
    const border = el('span.currencies-border exchange-border', { textContent: '.'.repeat(150) });
    setChildren(currenciesItem, [currenciesCode, border, currenciesAmount]);

    return currenciesItem
}

function sceletionCurrencies(currenciesList) {
    for (let i = 0; i < 20; i++) {
        const currenciesAmount = el('p.sceleton.sceleton-text__amount');
        currenciesList.append(currenciesAmount)
    }
    return currenciesList
}

export function curriencesBuy(token, selectedValue, selectedValueTo, sum, exchangeInput, currenciesList) {
    fetch(`http://localhost:3000/currency-buy`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Basic ${token}`
        },
        body: JSON.stringify({
            from: selectedValue,
            to: selectedValueTo,
            amount: sum
        })
    }).then(async() => {
        exchangeInput.value = '';
        const currencyResponse = await fetch(`http://localhost:3000/currencies`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${token}`
            },
        });

        const currencyData = await currencyResponse.json();
        currenciesList.innerHTML = '';
        for (let currency in currencyData.payload) {
            const currencyItem = createCurrencies(currencyData.payload[currency]);
            currenciesList.append(currencyItem);
        }
    }).catch(error => {
        console.error('Ошибка данных:', error);
    });
}

export function getCurrience(token, currenciesList, selectFrom, selectTo) {
    sceletionCurrencies(currenciesList) 
    fetch(`http://localhost:3000/currencies`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${token}`
        },
    }).then(async(res) => {
        currenciesList.innerHTML = ''
        const data = await res.json();
        for (let curriences in data.payload) {
            const curriencesItem = createCurrencies(data.payload[curriences]);
            currenciesList.append(curriencesItem);
        }
        let optionsFrom = [];
        let optionsTo = [];
        for (let curriences in data.payload) {
            let obj = { value: curriences, text: curriences }
            optionsFrom.push(obj)
            optionsTo.push(obj)
        }
        const choicesFrom = new Choices(selectFrom, {
            searchEnabled: false,
            itemSelectText: '',
            allowHTML: true,
            classNames: {
                containerOuter: 'choices choices-exchange',
            }
        });
        const choicesTo = new Choices(selectTo, {
            searchEnabled: false,
            itemSelectText: '',
            allowHTML: true,
            classNames: {
                containerOuter: 'choices choices-exchange',
            }
        });

        choicesFrom.setChoices(optionsFrom, 'value', 'text', true);
        choicesTo.setChoices(optionsTo, 'value', 'text', true);

    }).catch(error => {
        console.error('Ошибка при получении данных:', error);
    });
}