
var debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {fetchCountries} from './fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info'),
}

refs.input.addEventListener('input', debounce(getInputValue, DEBOUNCE_DELAY))

function getInputValue(name) {
    name = refs.input.value.trim();
    if (name) {
        fetchCountries(name).then(renderCard).catch(alert);
    } else if (!name) {
        clearFild();
    }
}

function renderCard(countrys) {
    clearFild()
    if (countrys.length === 1) {
        refs.list.insertAdjacentHTML('beforeend', createCountryList(countrys));
        refs.info.insertAdjacentHTML('beforeend', createCountryInfo(countrys));
    } else if (countrys.length >= 2 && countrys.length <= 10) {
        refs.list.insertAdjacentHTML('beforeend', createCountryList(countrys));
    } else if (countrys.length > 10) {
        warningWrongName();
    } else {
        notCountryFound();
    }
}

function createCountryList(countrys) {
    return countrys.map(({ name, flags}) => {
       return `<li class='country__item'>
        <img class='image__flag' src='${flags.svg}' height='30px' width='30px'>
        <h2 class='title'>${name.official}</h2>
        </li>`;
    }).join('');
}

function createCountryInfo(countrys) {
    return countrys.map(({ capital, population, languages }) => {
    return `<ul class='info__list'>
    <li class='list__item'><p class='item__text'><span class='item__title'>Capital: </span>${capital}</p></li>
    <li class='list__item'><p class='item__text'><span class='item__title'>Population: </span>${population}</p></li>
    <li class='list__item'><p class='item__text'><span class='item__title'>Languages: </span>${Object.values(languages).join(',')}</p></li>
    </ul>`;
    }).join('');
}

function warningWrongName() {
    Notify.info('Too many matches found. Please enter a more specific name.');
}

function  notCountryFound() {
    Notify.failure('Oops, there is no country with that name');
}

function clearFild() {
    refs.list.innerHTML = '';
    refs.info.innerHTML = '';
}