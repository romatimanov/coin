import { el, setChildren } from 'redom';
import arrowRed from '../../images/arrow-red.png'
import arrowGreen from '../../images/arrow-green.png'
const updateItems = {};

export function updateCurrience(message) {
    if (message.type === "EXCHANGE_RATE_CHANGE") {
        const identifier = message.from;

        if (!updateItems[identifier]) {
            const updateItem = el('li.update-item.exchange-item', { id: identifier });
            const arrowImg = el('img.arrow-image');

            updateItems[identifier] = {
                element: updateItem,
                arrowImg: arrowImg,
                lastArrowImg: null
            };
        }

        const { element: updateItem, arrowImg } = updateItems[identifier];
        const updateCode = el('p.update-code.exchange-code', { textContent: message.from + '/' + message.to });
        const updateAmount = el('p.update-amount.exchange-amount', { textContent: message.rate });
        const border = el('span.update-border.exchange-border', { textContent: '.'.repeat(150) });

        if (message.change === 1) {
            arrowImg.src = arrowGreen;
            updateItems[identifier].lastArrowImg = arrowGreen;
        } else if (message.change === -1) {
            arrowImg.src = arrowRed;
            updateItems[identifier].lastArrowImg = arrowRed;
        } else if (message.change === 0) {
            arrowImg.src = updateItems[identifier].lastArrowImg;
        }

        setChildren(updateItem, [updateCode, border, updateAmount, arrowImg]);
        return updateItem;
    } else {
        return null;
    }
}