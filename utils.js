/**
 * Universal Fetch & Parse Function for Data
 * @param {string} url
 * Returns a promise.
 */
export function fetchData(url) {
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
function checkStatus(response) {
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
export function isValidCell(number) {
  return /^\D*\d{3}\D*\d{3}\D*\d{4}\D*$/.test(number);
}

/**
 * Reformats number to: (555) 555-5555
 * @param {string} number
 * Returns reformatted number as string.
 */
export function formatCell(number) {
  const expression = /^\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*$/;
  return number.replace(expression, "($1) $2-$3");
}

/**
 * Checks date to see if it is valid.
 * @param {string} date
 */
export function isValidDOB(date) {
  return /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(date);
}

/**
 * Reformats date to: month/day/year
 * @param {string} date
 */
export function formatDOB(date) {
  const expression = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])).*/;
  const cleanDate = date.replace(expression, '$1');
  const expression2 = /(\d{4})-(\d{2})-(\d{2})/;
  const finalDate = cleanDate.replace(expression2, '$2/$3/$1');
  return finalDate;
}

/**
 * Simplifies the creating element process.
 * @param {string} elementName
 * @param {string} property
 * @param {string} value
 * Returns HTML element.
 */
export function createElement(elementName, property, value) {
  const element = document.createElement(elementName);
  element[property] = value;
  return element;
}
