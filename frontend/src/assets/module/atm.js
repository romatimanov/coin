import { el, setChildren } from 'redom';
import { Loader } from "@googlemaps/js-api-loader"
import spinnerImg from '../images/spinner.png'

function spinner() {
    const spinner = el('div.spinner')
    const spinnerImage = el('img')
    spinnerImage.src = spinnerImg
    spinnerImage.alyt = 'spinner'
    setChildren(spinner, spinnerImage)

    return spinner
}

const loader = new Loader({
    apiKey: "AIzaSyDxb8IK3QiN6kfwElSj7D2yr-ibUXSb68g",
    version: "weekly",
});

export function createAtm() {
    const atmBody = el('div.atm-body');
    const atmTitle = el('h2.atm-title', { textContent: 'Карта банкоматов' })
    const mapContent = el('div.map-content', { id: 'map' });

    const token = sessionStorage.getItem('authToken');

    mapContent.append(spinner());

    fetch('http://localhost:3000/banks', {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${token}`
        },
    }).then(async(res) => {
        mapContent.innerHTML = ''
        const data = await res.json();

        loader.load().then(async() => {
            const { Map } = await google.maps.importLibrary("maps");
            const map = new Map(document.getElementById("map"), {
                center: { lat: 59.851047, lng: 30.255081 },
                zoom: 10,
            });

            data.payload.forEach(position => {
                new google.maps.Marker({
                    map: map,
                    position: { lat: position.lat, lng: position.lon },
                    title: "ATM",
                    content: true,
                });

            });
        });
    }).catch(error => {
        console.error('Error:', error);
    });
    setChildren(atmBody, [atmTitle, mapContent]);
    return atmBody;
}