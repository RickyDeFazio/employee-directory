const $gallery = $('#gallery');
const globalArray = [];


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
    globalArray.push(result);
  }))
  .then(resolve => createCards(globalArray));  



function createCards(data){
  data.forEach(person => {
    const $cardDiv = $('<div></div>');
    $cardDiv.addClass('card');
    $gallery.append($cardDiv);

    const $cardImgContainer = $('<div></div>');
    $cardImgContainer.addClass('card-img-container');
    $cardDiv.append($cardImgContainer);

    const $img = $('<img>');
    $img.addClass('card-img');
    $img.attr('src', person.picture.medium);
    $img.attr('alt', 'profile picture');
    $cardImgContainer.append($img);

    const $cardInfoContainer = $('<div></div>');
    $cardInfoContainer.addClass('card-info-container');
    $cardDiv.append($cardInfoContainer);

    const $h3_cardname = $('<h3></h3>');
    $h3_cardname.attr('id', 'name');
    $h3_cardname.addClass('card-name cap');
    $h3_cardname.text(person.name.first + ' ' + person.name.last);
    $cardInfoContainer.append($h3_cardname);

    const $p_email = $('<p></p>');
    $p_email.addClass('card-text');
    $p_email.text(person.email);
    $cardInfoContainer.append($p_email);

    const $p_location = $('<p></p>');
    $p_location.addClass('card-text cap');
    $p_location.text(person.location.city + ', ' + person.location.state);
    $cardInfoContainer.append($p_location);
  })
}

/**
 * Closes modal.
 */
function closeModal(){
  $modalContainerDiv.remove();
}

/**
 * 
 */
$gallery.on('click', 'div.card', (e) => {
  const currentIndex = globalArray[$(e.currentTarget).index()];
  
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
  $modalImg.attr('src', currentIndex.picture.large);
  $modalImg.attr('alt', 'profile picture');
  $modalInfoDiv.append($modalImg);

  $h3_modalName = $('<h3></h3>');
  $h3_modalName.attr('id', 'name');
  $h3_modalName.addClass('modal-name cap');
  $h3_modalName.text(currentIndex.name.first + ' ' + currentIndex.name.last);
  $modalInfoDiv.append($h3_modalName);

  $p_email = $('<p></p>');
  $p_email.addClass('modal-text');
  $p_email.text(currentIndex.email);
  $modalInfoDiv.append($p_email);

  $p_city = $('<p></p>');
  $p_city.addClass('modal-text cap');
  $p_city.text(currentIndex.location.city);
  $modalInfoDiv.append($p_city);

  $hr = $('<hr>');
  $modalInfoDiv.append($hr);

  $p_phone = $('<p></p>');
  $p_phone.addClass('modal-text');
  if (isValidCell(currentIndex.cell)){
    $p_phone.text(formatCell(currentIndex.cell));
  } else {
    $p_phone.text("No Valid Number Given");
  }
  $modalInfoDiv.append($p_phone);

  $p_address = $('<p></p>');
  $p_address.addClass('modal-text cap');
  $p_address.html(currentIndex.location.street + '.,<br>' + currentIndex.location.city + ', ' + currentIndex.location.state + ' ' + currentIndex.location.postcode);
  $modalInfoDiv.append($p_address);

  $p_birthday = $('<p></p>');
  $p_birthday.addClass('modal-text');
  if (isValidDOB(currentIndex.dob.date)) {
    $p_birthday.text("Birthday: " + formatDOB(currentIndex.dob.date));
  } else {
    $p_birthday.text("No Valid Birthday Given");
  }
  
  $modalInfoDiv.append($p_birthday);

  $modalCloseBtn = $('#modal-close-btn');
  $modalCloseBtn.on('click', closeModal);
  }); // End Event Listener



/**
 * Search Functionality
 */
const $searchBar = $('.search-container');
const $form = $('<form></form>');
$form.attr('action', '#');
$searchBar.append($form);
const $input = $('<input>');
$input.attr('type', 'search');
$input.attr('id', 'search-input');
$input.addClass('search-input');
$input.attr('placeholder', 'Search...');
$form.append($input);
const $inputBtn = $('<input>');
$inputBtn.attr('type', 'submit');
$inputBtn.val('Search');
$inputBtn.attr('id', 'search-submit');
$inputBtn.addClass('search-submit');
$form.append($inputBtn);


const employeesFound = [];
function searchDirectory(employees){
  for (let i = 0; i < employees.length; i++) {
    if ( employees[i].name.first.toLowerCase().includes($input.val().toLowerCase())|| employees[i].name.last.toLowerCase().includes($input.val().toLowerCase()) ) {
      employeesFound.push(employees[i]);
    } else {
      console.log('Not Found')
    }
  }
  console.log(employeesFound.length)
}


$inputBtn.on('click', () => {
  searchDirectory(cards);
});