import { el, setChildren } from 'redom';
import { updateCurrience } from './updateCurrience';
import { curriencesBuy, getCurrience } from './createCurriences';
import changeImg from '../../images/change.png'

const token = sessionStorage.getItem('authToken');

const ws = new WebSocket('ws://localhost:3000/currency-feed');

ws.addEventListener('open', () => {
    ws.send(JSON.stringify({ Authorization: `Basic ${token}` }));
});

export function createExchange() {
    const exchangeBody = el('div', { className: 'exchange-body' });
    const currencies = el('div', { className: 'exchange-currencies' });
    const exchangeContent = el('div.exchange-content')
    const currenciesTitle = el('h3.currencies-title.exchange-title', { textContent: 'Ваши валюты' });
    const currenciesList = el('ul.currencies-list');
    const bloackBtn = el('button.change-blocks')
    const changeCurrencies = el('div', { className: 'exchange-change' });
    const changeTitle = el('h3.currencies-title.exchange-title', { textContent: 'Обмен валюты' });
    const selectFrom = el('select.select-exhange__container');
    const selectTo = el('select.select-exhange__container');
    const selectExhange = el('div.select-exchange')
    const amountExchange = el('div.change-amount__content')
    const exchangeInput = el('input.exhange-input')
    const exchangeInputText = el('p.select-text__exchange', { textContent: 'Сумма' })
    const selectTextFrom = el('p.select-text__exchange', { textContent: 'Из' })
    const selectTextTo = el('p.select-text__exchange', { textContent: 'в' })
    const changeContent = el('div.change-content')
    const changeBtn = el('button.change-btn', { textContent: 'Обменять' })
    const changeBody = el('div.change-body')
    const changeImgBtn = el('img');
    changeImgBtn.src = changeImg;
    changeImgBtn.alt = 'change';
    setChildren(selectExhange, [selectTextFrom, selectFrom, selectTextTo, selectTo])
    setChildren(amountExchange, [exchangeInputText, exchangeInput])
    setChildren(changeContent, [selectExhange, amountExchange])
    setChildren(changeBody, [changeContent, changeBtn])
    const updateCurrencies = el('div', { className: 'exchange-update' });
    const updateList = el('ul.update-list');
    const updateTitle = el('h3.update-title.exchange-title', { textContent: 'Изменение курсов в реальном времени' });

    ws.addEventListener('message', event => {
        const message = JSON.parse(event.data);
        const updateItem = updateCurrience(message);
        if (updateItem) {
            updateList.appendChild(updateItem);
        }
    });

    getCurrience(token, currenciesList, selectFrom, selectTo)

    changeBtn.addEventListener('click', () => {
        const selectedIndex = selectFrom.selectedIndex;
        const selectedValue = selectedIndex >= 0 ? selectFrom.options[selectedIndex].value : '';
        const selectedIndexTo = selectTo.selectedIndex;
        const selectedValueTo = selectedIndexTo >= 0 ? selectTo.options[selectedIndexTo].value : '';
        const sum = Number(exchangeInput.value);

        if (selectedValue === '' || selectedValueTo === '' || isNaN(sum) || sum <= 0) {
            return;
        }
        curriencesBuy(token, selectedValue, selectedValueTo, sum, exchangeInput, currenciesList)

    })

    let currentStyle = 1;

    function changeStyle() {
        switch (currentStyle) {
            case 1:
                exchangeContent.classList.remove("exchange-content1");
                break;
            case 2:
                exchangeContent.classList.remove("exchange-content2");
                break;
            case 3:
                exchangeContent.classList.remove("exchange-content3");
                break;
        }

        currentStyle = (currentStyle % 3) + 1;
        switch (currentStyle) {
            case 1:
                exchangeContent.classList.add("exchange-content1");
                break;
            case 2:
                exchangeContent.classList.add("exchange-content2");
                break;
            case 3:
                exchangeContent.classList.add("exchange-content3");
                break;
        }
    }
    bloackBtn.addEventListener('click', () => {
        changeStyle()
    })

    setChildren(bloackBtn, [changeImgBtn, el('span', 'Изменить вид')])
    setChildren(changeCurrencies, [changeTitle, changeBody]);
    setChildren(updateCurrencies, [updateTitle, updateList]);
    setChildren(currencies, [currenciesTitle, currenciesList]);
    setChildren(exchangeContent, [currencies, changeCurrencies, updateCurrencies])
    setChildren(exchangeBody, [bloackBtn, exchangeContent]);

    return exchangeBody;
}