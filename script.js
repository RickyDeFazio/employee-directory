import {
  fetchData,
  isValidCell,
  formatCell,
  isValidDOB,
  formatDOB,
  createElement
} from './utils.js';

// Global Variables
const gallery = document.querySelector('#gallery');
const arrayOfData = [];
const searchBar = document.querySelector('.search-container');
const form = createElement('form', 'action', '#');
const input = createElement('input', 'className', 'search-input');

function main() {
  fetchData('https://randomuser.me/api/?nat=us&results=12')
    .then(data => data.results.forEach(result => {
      arrayOfData.push(result);
    }))
    .then(() => createCards(arrayOfData))
    .catch(error => console.error(error));

  searchBar.appendChild(form);
  input.type = 'search';
  input.id = 'search-input';
  input.placeholder = 'Search...';
  form.appendChild(input);
}

/**
 * Uses array of data to populate employee cards.
 * @param {Array} data
 */
function createCards(data) {
  data.forEach(person => {
    const cardDiv = createElement('div', 'className', 'card');
    gallery.appendChild(cardDiv);

    const cardImgContainer = createElement('div', 'className', 'card-img-container');
    cardDiv.appendChild(cardImgContainer);

    const img = createElement('img', 'className', 'card-img');
    img.src = person.picture.medium;
    img.alt = 'profile picture';
    cardImgContainer.appendChild(img);

    const cardInfoContainer = createElement('div', 'className', 'card-info-container');
    cardDiv.appendChild(cardInfoContainer);

    const h3_cardname = createElement('h3', 'className', 'card-name cap');
    h3_cardname.id = 'name';
    h3_cardname.textContent = `${ person.name.first } ${ person.name.last }`;
    cardInfoContainer.appendChild(h3_cardname);

    const p_email = createElement('p', 'className', 'card-text');
    p_email.textContent = person.email;
    cardInfoContainer.appendChild(p_email);

    const p_location = createElement('p', 'className', 'card-text cap');
    p_location.textContent = `${ person.location.city }, ${ person.location.state }`;
    cardInfoContainer.appendChild(p_location);
  })
}

/**
 * Searches directory for employees matching search
 * @param {Array} employees
 */
function searchDirectory(employees) {
  const gallery = document.querySelector('#gallery');
  const cards = gallery.children;

  employees.forEach((employee, i) => {
    const cardInfo = cards[i].lastChild;
    const h3 = cardInfo.firstChild;

    if (h3.textContent.toLowerCase().includes(input.value.toLowerCase())) {
      cards[i].style.display = 'flex';
    } else {
      cards[i].style.display = 'none';
    }
  })
}

// Event Handlers
input.addEventListener('keyup', () => {
  searchDirectory(arrayOfData);
});

input.addEventListener('change', () => {
  searchDirectory(arrayOfData);
});

window.onload = main;
