let BASE_URL =
  "https://join-b72fb-default-rtdb.europe-west1.firebasedatabase.app/";

let activUser = {
  name: "Lars Schumacher",

}

function countId(responseToJson) {
  let keys = Object.keys(responseToJson);
  let lastKey = keys[keys.length - 1];
  let countId = responseToJson[lastKey].id;
  countId++;
  return countId;
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

function toggleCheckButton(CheckButtonId, CheckTaskButton) {
  const checkButton = document.getElementById(CheckButtonId);
  const isChecked = checkButton.src.includes("true");
  checkButton.src = `/assets/img/png/check-${CheckTaskButton}-${
    isChecked ? "false" : "true"
  }.png`;
}

function openLegal(LinkToSide) {
  // Füge den Parameter ?hideIcons=true zur URL hinzu
  const urlWithParam = LinkToSide + '?hideIcons=true';
  
  // Öffne den Link mit dem Parameter in einem neuen Tab
  window.open(urlWithParam, '_blank');
}
