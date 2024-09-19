document.addEventListener("DOMContentLoaded", () => {
  greeting();
});

function greeting() {
    let greeting = document.getElementById("greetings");
    let greetingUser = getNameFromLocalStorage();
    let greetingMassage = getGreetingMessage();
    greeting.innerHTML = "";
    greeting.innerHTML = `${greetingMassage}, <div class="greeting-user">${greetingUser}</div> `;
  }

function getNameFromLocalStorage() {
  let activeUser = localStorage.getItem("activeUser");
  if (activeUser) {
    // In ein JSON-Objekt umwandeln
    const loggedInUser = JSON.parse(activeUser);
    // Initialen abrufen
    return loggedInUser.name;
  }
  return "";
}

function getGreetingMessage() {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return "Good morning";
  } else if (currentHour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}


