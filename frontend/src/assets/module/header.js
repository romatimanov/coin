import { el, setChildren } from "redom"
import { router } from './login.js'

export function createHeaderWitnButtons(uri) {
    const headerContent = el('div.header-content.container')
    const h1 = el('h1.header-title', { textContent: 'Coin.' })
    const btnGroup = el('div.header-group')
    const atm = el('button.header-btn', { textContent: 'Банкомат' })
    const check = el('button.header-btn', { textContent: 'Счета.' })
    const currency = el('button.header-btn', { textContent: 'Валюта' })
    const exit = el('button.header-btn', { textContent: 'Выйти' })
    const mobileBtn = el('button.header-btn.mobile-btn', { textContent: 'Меню' })
    const mobileGroup = el('div.mobile-list')

    switch (uri) {
        case '/check':
            check.classList.add('header-btn__active');
            break;
        case '/exchange':
            currency.classList.add('header-btn__active');
            break;
        case '/atm':
            atm.classList.add('header-btn__active');
            break;
        case '/exchange':
            exit.classList.add('header-btn__active');
            break;
        default:
            check.classList.remove('header-btn__active');
            break;
    }

    check.addEventListener('click', () => {
        router.navigate('/check')
    })

    atm.addEventListener('click', () => {
        router.navigate('/atm')
    });

    currency.addEventListener('click', () => {
        router.navigate('/exchange')
    });

    exit.addEventListener('click', () => {
        sessionStorage.removeItem('authToken');
        router.navigate('/')
    });

    function getWindowSize() {
        return window.innerWidth;
    }

    mobileBtn.addEventListener('click', () => {
        mobileGroup.classList.toggle('mobile-list__active')
    })

    document.addEventListener('click', (event) => {
        if (!mobileGroup.contains(event.target) && event.target !== mobileBtn) {
            mobileGroup.classList.remove('mobile-list__active')
        }
    })

    function updateButtonsVisibility() {
        const windowWidth = getWindowSize();
        const mobileWidthThreshold = 768;
        const isMobile = windowWidth < mobileWidthThreshold;

        if (isMobile) {
            setChildren(mobileGroup, [atm, check, currency, exit]);
            setChildren(headerContent, [h1, mobileBtn, mobileGroup]);
        } else {
            setChildren(btnGroup, [atm, check, currency, exit]);
            setChildren(headerContent, [h1, btnGroup]);
        }
    }
    updateButtonsVisibility()
    window.addEventListener('load', updateButtonsVisibility);
    window.addEventListener('resize', updateButtonsVisibility);

    return headerContent
}