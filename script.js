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
 * Request data from API 12 times to obtain 12 users.
 */

for (let i = 0; i < 12; i++){
  let test = fetchData('https://randomuser.me/api/');
  arrayOfData.push(test);
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
 * 
 */

Promise.all(arrayOfData)
  .then(data => data.forEach(index => {
    $cardDiv = $('<div></div>');
    $cardDiv.addClass('card');
    $gallery.append($cardDiv);

    $cardImgContainer = $('<div></div>');
    $cardImgContainer.addClass('card-img-container');
    $cardDiv.append($cardImgContainer);

    $img = $('<img>');
    $img.addClass('card-img');
    $img.attr('src', index.results[0].picture.medium);
    $img.attr('alt', 'profile picture');
    $cardImgContainer.append($img);

    $cardInfoContainer = $('<div></div>');
    $cardInfoContainer.addClass('card-info-container');
    $cardDiv.append($cardInfoContainer);

    $h3_cardname = $('<h3></h3>');
    $h3_cardname.attr('id', 'name');
    $h3_cardname.addClass('card-name cap');
    $h3_cardname.text(index.results[0].name.first + ' ' + index.results[0].name.last);
    $cardInfoContainer.append($h3_cardname);

    $p_email = $('<p></p>');
    $p_email.addClass('card-text');
    $p_email.text(index.results[0].email);
    $cardInfoContainer.append($p_email);

    $p_location = $('<p></p>');
    $p_location.addClass('card-text cap');
    $p_location.text(index.results[0].location.city + ', ' + index.results[0].location.state);
    $cardInfoContainer.append($p_location);
  }));