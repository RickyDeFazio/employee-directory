/*******************************
 * Global Variables
 ******************************/

const gallery = document.querySelector('#gallery');
const $gallery = $('#gallery');
const arrayOfData = [];
const searchBar = document.querySelector('.search-container');
const form = createElement('form', 'action', '#');
const input = createElement('input', 'className', 'search-input');
const inputBtn = createElement('input', 'className', 'search-submit');



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
 * returns boolean value.
 */
function isValidCell(number) {
  return /^\D*\d{3}\D*\d{3}\D*\d{4}\D*$/.test(number);
}



/**
 * Reformats number to: (555) 555-5555
 * @param {string} number 
 * Returns reformatted number as string.
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


/**
 * Fetches data from API using given URL
 * Returns result and adds results to a global array
 * Creates cards using createCards function.
 */
fetchData('https://randomuser.me/api/?nat=us&results=12')
  .then(data => data.results.forEach(result => {
    arrayOfData.push(result);
  }))
  .then(resolve => createCards(arrayOfData));  


/**
 * Simplifies the creating element process.
 * @param {string} elementName 
 * @param {string} property 
 * @param {string} value 
 * Returns HTML element.
 */
function createElement(elementName, property, value) {
  const element = document.createElement(elementName);
  element[property] = value;
  return element;
}


/**
 * Uses array of data to populate employee cards.
 * @param {Array} data 
 */
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


/*******************************
 * Modal Feature
 ******************************/



/**
 * Used JQUERY to implement modal 
 */
$gallery.on('click', 'div.card', (e) => {
  currentIndex = [$(e.currentTarget).index()];
  selectedEmployee = arrayOfData[currentIndex];  
  $modalContainerDiv = $('<div></div>');
  $modalContainerDiv.addClass('modal-container');
  $gallery.after($modalContainerDiv);

  $modalDiv = $('<div></div>');
  $modalDiv.addClass('modal');
  $modalContainerDiv.append($modalDiv);

  $buttonModalClose = $('<button></button>');
  $buttonModalClose.attr('type', 'button');
  $buttonModalClose.attr('id', 'modal-close-btn');
  $buttonModalClose.addClass('modal-close-btn');
  $modalDiv.append($buttonModalClose);

  $strongTag = $('<strong></strong>');
  $strongTag.text('X');
  $buttonModalClose.append($strongTag);

  $modalInfoDiv = $('<div></div>');
  $modalInfoDiv.addClass('modal-info-container');
  $modalDiv.append($modalInfoDiv);

  $modalImg = $('<img>');
  $modalImg.addClass('modal-img');
  $modalImg.attr('src', selectedEmployee.picture.large);
  $modalImg.attr('alt', 'profile picture');
  $modalInfoDiv.append($modalImg);

  $h3_modalName = $('<h3></h3>');
  $h3_modalName.attr('id', 'name');
  $h3_modalName.addClass('modal-name cap');
  $h3_modalName.text(selectedEmployee.name.first + ' ' + selectedEmployee.name.last);
  $modalInfoDiv.append($h3_modalName);

  $p_email = $('<p></p>');
  $p_email.addClass('modal-text');
  $p_email.text(selectedEmployee.email);
  $modalInfoDiv.append($p_email);

  $p_city = $('<p></p>');
  $p_city.addClass('modal-text cap');
  $p_city.text(selectedEmployee.location.city);
  $modalInfoDiv.append($p_city);

  $hr = $('<hr>');
  $modalInfoDiv.append($hr);

  $p_phone = $('<p></p>');
  $p_phone.addClass('modal-text');
  if (isValidCell(selectedEmployee.cell)){
    $p_phone.text(formatCell(selectedEmployee.cell));
  } else {
    $p_phone.text("No Valid Number Given");
  }
  $modalInfoDiv.append($p_phone);

  $p_address = $('<p></p>');
  $p_address.addClass('modal-text cap');
  $p_address.html(selectedEmployee.location.street + '.,<br>' + selectedEmployee.location.city + ', ' + selectedEmployee.location.state + ' ' + selectedEmployee.location.postcode);
  $modalInfoDiv.append($p_address);

  $p_birthday = $('<p></p>');
  $p_birthday.addClass('modal-text');
  if (isValidDOB(selectedEmployee.dob.date)) {
    $p_birthday.text("Birthday: " + formatDOB(selectedEmployee.dob.date));
  } else {
    $p_birthday.text("No Valid Birthday Given");
  }
  
  $modalInfoDiv.append($p_birthday);

  $modalBtnContainer = $('<div></div>');
  $modalBtnContainer.addClass('modal-btn-container');
  $modalContainerDiv.append($modalBtnContainer);

  $modalPrev = $('<button></button>');
  $modalPrev.attr('type', 'button');
  $modalPrev.attr('id', 'modal-prev');
  $modalPrev.addClass('modal-prev btn');
  $modalPrev.text('Prev');
  $modalBtnContainer.append($modalPrev);

  $modalNext = $('<button></button>');
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


function cyclePrev() {
  $modalImg.attr('src', arrayOfData[currentIndex-1].picture.large);
}


function cycleNext() {
  nextEmployee = arrayOfData[currentIndex+1];
  $modalImg.attr('src', nextEmployee.picture.large);
}


function closeModal(){
  $modalContainerDiv.remove();
}



/*******************************
 * Search Functionality
 ******************************/



/**
 * Add searchbar to DOM
 */
searchBar.appendChild(form);
input.type = 'search';
input.id = 'search-input';
input.placeholder = 'Search...';
form.appendChild(input);
inputBtn.type = 'submit';
inputBtn.value = 'Search';
inputBtn.id = 'search-submit';
form.appendChild(inputBtn);



/**
 * Searches directory for employees matching search
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



/**
 * Event Handlers for Search
 */
inputBtn.addEventListener('click', () => {
  searchDirectory(arrayOfData);
});
input.addEventListener('keyup', () => {
  searchDirectory(arrayOfData);
});