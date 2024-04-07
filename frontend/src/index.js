import { el, setChildren } from 'redom'
import { createLogin, router } from './assets/module/login.js'
import { createCheck } from './assets/module/check/createCheck.js'
import { createHeaderWitnButtons } from './assets/module/header.js';
import { createAccount } from './assets/module/account/account.js';
import { createHistory } from './assets/module/account/history.js';
import { createExchange } from './assets/module/exchange/exchange.js';
import { createAtm } from './assets/module/atm.js';
import './index.scss'

const container = el('div')
container.classList.add('container')
const header = el('div')
header.classList.add('header')
const content = el('div')
content.id = 'content'

function createHeader() {
    const headerContent = el('div')
    headerContent.classList.add('header-content', 'container')
    const h1 = el('h1')
    h1.innerHTML = 'Coin.'
    h1.classList.add('header-title')
    setChildren(headerContent, h1)
    return headerContent
}

router.on('/', () => {
    setChildren(header, createHeader())
    setChildren(content, createLogin())
})

router.on('/check', () => {
    setChildren(header, createHeaderWitnButtons('/check'))
    setChildren(content, createCheck());
})
router.on('/atm', () => {
    setChildren(header, createHeaderWitnButtons('/atm'))
    setChildren(content, createAtm());
})
router.on('/exchange', () => {
    setChildren(header, createHeaderWitnButtons('/exchange'))
    setChildren(content, createExchange());
})

router.on('/check/:id', ({ data: { id } }) => {
    setChildren(header, createHeaderWitnButtons())
    setChildren(content, createAccount(id));
})

router.on('/history/:id', ({ data: { id } }) => {
    setChildren(header, createHeaderWitnButtons())
    setChildren(content, createHistory(id));
})
router.resolve()

setChildren(container, content)

document.body.append(header)
document.body.append(container)