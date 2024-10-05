const BASE_URL =
  "https://join-b72fb-default-rtdb.europe-west1.firebasedatabase.app/";
let activeUser = getActiveUser();

/**
 * Downloads the data from the database depending on the deposit and ID.
 * 
 * @param {string} path - The path in the database from where to load the data.
 * @returns {Array} - Downloaded data.
 */
async function fetchData(path = "") {
  const response = await fetch(`${BASE_URL}/${path}/.json`);
  const datas = await response.json();
  if(datas === null){
    return null;
  };
  const dataArray = Array.isArray(datas) ? datas : Object.values(datas);
  return dataArray.filter(data => data !== null);
}

/**
 * Uploads the data from the database depending on the deposit and ID.
 * 
 * @param {string} path - The path in the database for which a new ID should be generated.
 * @param {*} data - Data to be uploaded
 */
async function postData(path = "", data = {}) {
  const response = await fetch(`${BASE_URL}/${path}/.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

/**
 * Deletes the data from the database depending on the deposit and the ID.
 * 
 * @param {string} path - The path in the database for which a new ID should be generated.
 * @param {*} id - Id of the element to be deleted
 */
async function deleteData(path = "", id) {
  const url = `${BASE_URL}/${path}/${id - 1}.json`;
  const response = await fetch(url, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

/**
 * Checks whether data exists in the database and returns the new ID.
 * 
 * @param {string} path - The path in the database for which a new ID should be generated.
 * @returns {Number} - New ID
 */
async function getNewId(path = "") {
  let response = await fetch(`${BASE_URL}/${path}/.json`);
  let responseToJson = await response.json();
  let newUserId;
  if (responseToJson == null) {
    newUserId = 1;
  } else {
    newUserId = countId(responseToJson);
  }
  return newUserId;
}

/**
 * Returns the new ID depending on the existing data in the database.
 * 
 * @param {number} responseToJson 
 * @returns {Number} - New ID
 */
function countId(responseToJson) {
  let keys = Object.keys(responseToJson);
  let lastKey = keys[keys.length - 1];
  let countId = responseToJson[lastKey].id;
  countId++;
  return countId;
}

/**
 * Loads the user's data for the activeUser into the LocalStorage
 * @returns {Objekt} - ActiveUser data 
 */
function getActiveUser() {
  try {
    const storedUser = localStorage.getItem("activeUser");
    if (storedUser) {
      return JSON.parse(storedUser);
    } else {
      return {};
    }
  } catch (error) {
    console.error("Fehler beim Abrufen des activeUser:", error);
    return {};
  }
}

/**
 * Resets the default tasks and contacts in the database.
 */
async function resetTheDatabase() {
  for (let index = 0; index < dbBackupTask.length; index++) {
      await postData(`tasks/${index}/`, dbBackupTask[index]);
      await postData(`contacts/${index}/`, dbBackupContacts[index]);
  }  
}

/**
 * Changes the image of the check button.
 * 
 * @param {number} CheckButtonId Id of the check-button
 * @param {HTMLElement} CheckTaskButton The HTML element where the button is displayed
 */
function toggleCheckButton(CheckButtonId, CheckTaskButton) {
  const checkButton = document.getElementById(CheckButtonId);
  const isChecked = checkButton.src.includes("true");
  checkButton.src = `../assets/img/png/check-${CheckTaskButton}-${
    isChecked ? "false" : "true"
  }.png`;
}

/**
 * Opens a specified URL in a new browser tab.
 * 
 * @param {string} LinkToSide - The URL to be opened in a new tab.
 */
function openLegal(LinkToSide) {
  let targetUrl = LinkToSide;
  window.open(targetUrl, "_blank");
}

/**
 * Navigates the browser to the previous page in history.
 */
function goBack() {
  window.history.back();
}

/**
 * Prevents the function from executing on the Parend element.
 */
function bubblingPrevention(event) {
  event.stopPropagation();
}

/**
 * Deletes the activeUser data and redirects to the log in page
 */
function logOut() {
  localStorage.removeItem("activeUser");
  window.location.href = "../index.html";  
}