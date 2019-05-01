const gallery = document.querySelector('#gallery');
const $gallery = $('#gallery');
const arrayOfData = [];


/**
 * Universal Fetch & Parse Function for Data
 * @param {string} url 
 * Returns a promise.
 */
function fetchData(url) {
  return fetch(url)
    .then(checkStatus)
    .then(response => response.json())
    .catch(error => console.log(error));
}


/**
 * Evaluates response to determine if there are any errors
 * @param {promise} response 
 * Returns a promise.
 */
function checkStatus(response){
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}


/**
 * Checks number to see if it is valid.
 * @param {string} number 
 */
function isValidCell(number) {
  return /^\D*\d{3}\D*\d{3}\D*\d{4}\D*$/.test(number);
}


/**
 * Reformats number to: (555) 555-5555
 * @param {string} number 
 */
function formatCell(number) {
  const expression = /^\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*$/;
  return number.replace(expression, "($1) $2-$3");
}


/**
 * Checks date to see if it is valid.
 * @param {string} date 
 */
function isValidDOB(date){
  return /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(date);
}


/**
 * Reformats date to: month/day/year
 * @param {string} date 
 */
function formatDOB(date){
  const expression = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])).*/;
  const cleanDate = date.replace(expression, '$1');
  const expression2 = /(\d{4})-(\d{2})-(\d{2})/;
  const finalDate = cleanDate.replace(expression2, '$2/$3/$1');
  return finalDate;
}



fetchData('https://randomuser.me/api/?nat=us&results=12')
  .then(data => data.results.forEach(result => {
    arrayOfData.push(result);
  }))
  .then(resolve => createCards(arrayOfData));  



function createElement(elementName, property, value) {
  const element = document.createElement(elementName);
  element[property] = value;
  return element;
}



function createCards(data){
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
    h3_cardname.textContent = person.name.first + ' ' + person.name.last;
    cardInfoContainer.appendChild(h3_cardname);

    const p_email = createElement('p', 'className', 'card-text');
    p_email.textContent = person.email;
    cardInfoContainer.appendChild(p_email);

    const p_location = createElement('p', 'className', 'card-text cap');
    p_location.textContent = person.location.city + ', ' + person.location.state;
    cardInfoContainer.appendChild(p_location);
  })
}




/**
 * Used JQUERY to implement modal 
 */
$gallery.on('click', 'div.card', (e) => {
  const currentIndex = arrayOfData[$(e.currentTarget).index()];
  
  $modalContainerDiv = $('<div></div>');
  $modalContainerDiv.addClass('modal-container');
  $gallery.after($modalContainerDiv);

  const $modalDiv = $('<div></div>');
  $modalDiv.addClass('modal');
  $modalContainerDiv.append($modalDiv);

  const $buttonModalClose = $('<button></button>');
  $buttonModalClose.attr('type', 'button');
  $buttonModalClose.attr('id', 'modal-close-btn');
  $buttonModalClose.addClass('modal-close-btn');
  $modalDiv.append($buttonModalClose);

  const $strongTag = $('<strong></strong>');
  $strongTag.text('X');
  $buttonModalClose.append($strongTag);

  const $modalInfoDiv = $('<div></div>');
  $modalInfoDiv.addClass('modal-info-container');
  $modalDiv.append($modalInfoDiv);

  const $modalImg = $('<img>');
  $modalImg.addClass('modal-img');
  $modalImg.attr('src', currentIndex.picture.large);
  $modalImg.attr('alt', 'profile picture');
  $modalInfoDiv.append($modalImg);

  const $h3_modalName = $('<h3></h3>');
  $h3_modalName.attr('id', 'name');
  $h3_modalName.addClass('modal-name cap');
  $h3_modalName.text(currentIndex.name.first + ' ' + currentIndex.name.last);
  $modalInfoDiv.append($h3_modalName);

  const $p_email = $('<p></p>');
  $p_email.addClass('modal-text');
  $p_email.text(currentIndex.email);
  $modalInfoDiv.append($p_email);

  const $p_city = $('<p></p>');
  $p_city.addClass('modal-text cap');
  $p_city.text(currentIndex.location.city);
  $modalInfoDiv.append($p_city);

  const $hr = $('<hr>');
  $modalInfoDiv.append($hr);

  const $p_phone = $('<p></p>');
  $p_phone.addClass('modal-text');
  if (isValidCell(currentIndex.cell)){
    $p_phone.text(formatCell(currentIndex.cell));
  } else {
    $p_phone.text("No Valid Number Given");
  }
  $modalInfoDiv.append($p_phone);

  const $p_address = $('<p></p>');
  $p_address.addClass('modal-text cap');
  $p_address.html(currentIndex.location.street + '.,<br>' + currentIndex.location.city + ', ' + currentIndex.location.state + ' ' + currentIndex.location.postcode);
  $modalInfoDiv.append($p_address);

  const $p_birthday = $('<p></p>');
  $p_birthday.addClass('modal-text');
  if (isValidDOB(currentIndex.dob.date)) {
    $p_birthday.text("Birthday: " + formatDOB(currentIndex.dob.date));
  } else {
    $p_birthday.text("No Valid Birthday Given");
  }
  
  $modalInfoDiv.append($p_birthday);

  const $modalBtnContainer = $('<div></div>');
  $modalBtnContainer.addClass('modal-btn-container');
  $modalContainerDiv.append($modalBtnContainer);

  const $modalPrev = $('<button></button>');
  $modalPrev.attr('type', 'button');
  $modalPrev.attr('id', 'modal-prev');
  $modalPrev.addClass('modal-prev btn');
  $modalPrev.text('Prev');
  $modalBtnContainer.append($modalPrev);

  const $modalNext = $('<button></button>');
  $modalNext.attr('type', 'button');
  $modalNext.attr('id', 'modal-next');
  $modalNext.addClass('modal-next btn');
  $modalNext.text('Next');
  $modalBtnContainer.append($modalNext);

  // Modal Button Handlers
  $modalPrev.on('click', cyclePrev);
  $modalNext.on('click', cycleNext);
  $buttonModalClose.on('click', closeModal);

}); // End Event Listener


function cycleNext() {
  
}

function cyclePrev() {
  
}


/**
 * Closes modal.
 */
function closeModal(){
  $modalContainerDiv.remove();
}

/**
 * Search Functionality
 */
const searchBar = document.querySelector('.search-container');
const form = createElement('form', 'action', '#');
searchBar.appendChild(form);
const input = createElement('input', 'className', 'search-input');
input.type = 'search';
input.id = 'search-input';
input.placeholder = 'Search...';
form.appendChild(input);
const inputBtn = createElement('input', 'className', 'search-submit');
inputBtn.type = 'submit';
inputBtn.value = 'Search';
inputBtn.id = 'search-submit';
form.appendChild(inputBtn);



/**
 * 
 * @param {Array} employees 
 */

function searchDirectory(employees) {
  const employeesFound = [];
  const gallery = document.querySelector('#gallery');
  const cards = gallery.children;
  for (let i = 0; i < employees.length; i++) {
    const cardInfo = cards[i].lastChild;
    const h3 = cardInfo.firstChild;
    if (h3.textContent.toLowerCase().includes(input.value.toLowerCase()) ) {
      employeesFound.push(employees[i]);
      cards[i].style.display = 'flex';
    } else {
      cards[i].style.display = 'none';
    }
  }
}

inputBtn.addEventListener('click', () => {
  searchDirectory(arrayOfData);
});
input.addEventListener('keyup', () => {
  searchDirectory(arrayOfData);
});