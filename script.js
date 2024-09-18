const BASE_URL =
  "https://join-b72fb-default-rtdb.europe-west1.firebasedatabase.app/";

async function fetchData(path = "") {
  const response = await fetch(`${BASE_URL}/${path}/.json`);
  return await response.json();
}

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

function countId(responseToJson) {
  let keys = Object.keys(responseToJson);
  let lastKey = keys[keys.length - 1];
  let countId = responseToJson[lastKey].id;
  countId++;
  return countId;
}

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

let activeUser = getActiveUser();

function toggleCheckButton(CheckButtonId, CheckTaskButton) {
  const checkButton = document.getElementById(CheckButtonId);
  const isChecked = checkButton.src.includes("true");
  checkButton.src = `/assets/img/png/check-${CheckTaskButton}-${
    isChecked ? "false" : "true"
  }.png`;
}

function openLegal(LinkToSide) {
  let targetUrl = LinkToSide;
  window.open(targetUrl, "_blank");
}



function goBack() {
  window.history.back();
}

document.addEventListener("DOMContentLoaded", () => {
  // Überprüfen, ob jemand eingeloggt ist
  const loggedInUserName = localStorage.getItem("loggedInUserName");

  // Wenn kein Benutzername vorhanden ist, füge eine CSS-Klasse hinzu
  if (!loggedInUserName) {
    const body = document.querySelector("body");
    if (body) {
      body.classList.add("not-logged-in");
    }
  }
});
