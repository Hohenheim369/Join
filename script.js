const BASE_URL =
  "https://join-b72fb-default-rtdb.europe-west1.firebasedatabase.app/";

async function fetchUsers() {
  const response = await fetch(`${BASE_URL_S}users.json`);
  return await response.json();
}

async function postData(path = "", data = {}) {
  const response = await fetch(path + ".json", {
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

function countId(responseToJson) {
  let keys = Object.keys(responseToJson);
  let lastKey = keys[keys.length - 1];
  let countId = responseToJson[lastKey].id;
  countId++;
  return countId;
}

function toggleCheckButton(CheckButtonId, CheckTaskButton) {
  const checkButton = document.getElementById(CheckButtonId);
  const isChecked = checkButton.src.includes("true");
  checkButton.src = `/assets/img/png/check-${CheckTaskButton}-${
    isChecked ? "false" : "true"
  }.png`;
}

function openLegal(LinkToSide) {
  // Füge den Parameter ?hideIcons=true zur URL hinzu
  const urlWithParam = LinkToSide + "?hideIcons=true";

  // Öffne den Link mit dem Parameter in einem neuen Tab
  window.open(urlWithParam, "_blank");
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
