document.addEventListener("click", (event) => {
  const logOutElement = document.getElementById("log_out");
  const initialsElement = document.getElementById("user_profile_initials");

  // Öffnen/Schließen des log_out-Menüs bei Klick auf user_profile_initials
  if (initialsElement.contains(event.target)) {
    event.stopPropagation(); // Verhindert, dass das Klick-Ereignis sich ausbreitet
    logOutElement.classList.toggle("d-none"); // Ein-/Ausblenden des log_out-Elements
    initialsElement.classList.toggle("bg-color"); // Hinzufügen/Entfernen der Hintergrundfarbe
  }

  // Schließen des log_out-Menüs bei Klick außerhalb des Menüs
  document.addEventListener("click", (event) => {
    // Schließen nur, wenn log_out sichtbar ist und Klick nicht auf log_out oder user_profile_initials war
    if (
      !logOutElement.classList.contains("d-none") &&
      !logOutElement.contains(event.target) &&
      !initialsElement.contains(event.target)
    ) {
      logOutElement.classList.add("d-none"); // Versteckt log_out-Element
      initialsElement.classList.remove("bg-color"); // Entfernt Hintergrundfarbe
    }
  });
});

// document.addEventListener("DOMContentLoaded", () => {
// Event-Listener für die Includes-Loaded-Verarbeitung
// document.addEventListener("includesLoaded", handleIncludesLoaded);

// Event-Listener für das Klick-Ereignis auf das Dokument
// document.addEventListener("click",toggleLogOutVisibility);

// function handleIncludesLoaded() {
//   handleUserProfile();
// }

// function handleUserProfile() {
//   let loggedInUserName = localStorage.getItem("loggedInUserName");
//   if (loggedInUserName) {
//     console.log("Logged-in user name:", loggedInUserName);
//     let initials = getInitials(loggedInUserName);
//     updateInitialsElement(initials);
//   } else {
//     console.log("No logged-in user name found");
//   }
// }

// function getInitials(userName) {
//   let nameParts = userName.split(" ");
//   return nameParts.map(part => part.charAt(0).toUpperCase()).join("");
// }

// function updateInitialsElement(initials) {
//   let initialsElement = document.getElementById("user_profile_initials");
//   if (initialsElement) {
//     initialsElement.innerHTML = `${initials}`;
//     initialsElement.addEventListener("click", toggleLogOutVisibility);
//   }
//   console.log(initials);
// }

// function handleDocumentClick(event) {
//   let logOutElement = document.getElementById("log_out");
//   let initialsElement = document.getElementById("user_profile_initials");

//   if (
//     logOutElement &&
//     !logOutElement.contains(event.target) &&
//     !initialsElement.contains(event.target) &&
//     !event.target.closest("#log_out")
//   ) {
//     logOutElement.classList.add("d-none");
//   }
// }

// function toggle() {
//   toggleLogOutVisibility();
//   toggleColor();

// }

//   function toggleLogOutVisibility() {
//     let logOutElement = document.getElementById("log_out");
//     if (logOutElement) {
//       logOutElement.classList.toggle("d-none");
//     }
//     let initialsElement = document.getElementById("user_profile_initials");
//     if (initialsElement) {
//       initialsElement.classList.toggle("bg-color");
//     }

//   }

// });

// function logOut() {
//   localStorage.removeItem("loggedInUserName");
// }

function updateSidebarIcons() {
  const currentPage = window.location.pathname.split('/').pop(); // Extrahiere den Dateinamen

  // Pfade zu den grauen und weißen Icons
  const iconPaths = {
    summary: {
      grey: "../assets/img/png/summary-grey.png",
      white: "../assets/img/png/summary-white.png",
    },
    addTask: {
      grey: "../assets/img/png/add-task-grey.png",
      white: "../assets/img/png/add-task-white.png",
    },
    board: {
      grey: "../assets/img/png/board-grey.png",
      white: "../assets/img/png/board-white.png",
    },
    contacts: {
      grey: "../assets/img/png/contacts-grey.png",
      white: "../assets/img/png/contacts-white.png",
    },
  };

  // Links zu den relevanten Seiten
  const links = {
    summary: document.querySelector(".summary-link"),
    addTask: document.querySelector(".add-task-link"),
    board: document.querySelector(".board-link"),
    contacts: document.querySelector(".contacts-link"),
    privacyPolicy: document.querySelector(".privacy-policy-link"),
    legalNotice: document.querySelector(".legal-notice-link"),
  };

  // Für die Seiten, die Icons ändern müssen
  const pagesWithIcons = ["summary", "addTask", "board", "contacts"];

  for (const page of pagesWithIcons) {
    const linkElement = links[page];
    if (currentPage === `${page.replace(/([A-Z])/g, '_$1').toLowerCase()}.html`) { // Korrigiere die Dateinamen
      changeIcon(page, iconPaths[page].white); // Stelle sicher, dass changeIcon definiert ist
      if (linkElement) {
        linkElement.classList.add("active", "disabled");
      }
    } else {
      if (linkElement) {
        linkElement.classList.remove("active", "disabled");
        // Setze das graue Icon, wenn die Seite nicht aktiv ist
        changeIcon(page, iconPaths[page].grey);
      }
    }
  }
}

// Beispielhafte Definition der changeIcon-Funktion
function changeIcon(page, iconPath) {
  const linkElement = document.querySelector(`.${page}-link img`);
  if (linkElement) {
    linkElement.src = iconPath;
  }
}

// Rufe updateSidebarIcons auf, wenn das DOM vollständig geladen ist
document.addEventListener("DOMContentLoaded", updateSidebarIcons);

// Funktion zum Laden des Templates
function loadTemplate() {
  fetch("/assets/templates/desktop_template.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Netzwerkantwort war nicht okay");
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById("desktop_template").innerHTML = data;

      // Custom Event "loadTemplated" auslösen, nachdem das Template geladen wurde
      const event = new Event("loadTemplated");
      document.dispatchEvent(event);
    })
    .catch((error) => {
      console.error("Fehler beim Laden des Templates:", error);
    });
}

// Template beim Laden der Seite einbinden
window.addEventListener("DOMContentLoaded", loadTemplate);

// Sobald das Template geladen ist, die Sichtbarkeit des Bodys auf sichtbar setzen
document.addEventListener("loadTemplated", () => {
  document.body.style.visibility = "visible";

  // Aktualisiere die Sidebar-Icons nach dem Laden des Templates
  updateSidebarIcons();

  // Füge die Event-Listener für die Links hinzu
  initializeLinks();
});

function initializeLinks() {
  var policyLink = document.getElementById("policy_link");
  var legalLink = document.getElementById("legal_link");

  // Privacy Policy Link
  if (policyLink) {
    if (window.location.pathname.includes("privacy-policy.html")) {
      // Deaktiviere den Link, wenn du auf der Privacy Policy-Seite bist
      disableLink(policyLink);
    } else {
      // Andernfalls setze den Link in den Standardzustand und füge den Klick-Event-Listener hinzu
      if (localStorage.getItem("policy_link_disabled") === "true") {
        // Falls der Link im Local Storage als deaktiviert gespeichert ist, wiederherstellen
        localStorage.removeItem("policy_link_disabled");
        policyLink.classList.remove("disabled");
        policyLink.addEventListener("click", handleClick);
      } else {
        policyLink.addEventListener("click", handleClick);
      }
    }
  } else {
    console.error('Element mit ID "policy_link" nicht gefunden.');
  }

  // Legal Notice Link
  if (legalLink) {
    if (window.location.pathname.includes("legal_notice.html")) {
      // Deaktiviere den Link, wenn du auf der Legal Notice-Seite bist
      disableLink(legalLink);
    } else {
      // Andernfalls setze den Link in den Standardzustand und füge den Klick-Event-Listener hinzu
      if (localStorage.getItem("legal_link_disabled") === "true") {
        // Falls der Link im Local Storage als deaktiviert gespeichert ist, wiederherstellen
        localStorage.removeItem("legal_link_disabled");
        legalLink.classList.remove("disabled");
        legalLink.addEventListener("click", handleClickLegal);
      } else {
        legalLink.addEventListener("click", handleClickLegal);
      }
    }
  } else {
    console.error('Element mit ID "legal_link" nicht gefunden.');
  }
}

function handleClick(event) {
  event.preventDefault(); // Verhindert die Standardaktion des Links
  var policyLink = document.getElementById("policy_link");
  if (policyLink) {
    disableLink(policyLink);

    // Verzögere den Seitenwechsel, um sicherzustellen, dass der Status gespeichert wird
    setTimeout(() => {
      window.location.href = policyLink.href;
    }, 100); // 100 ms Verzögerung
  }
}

function handleClickLegal(event) {
  event.preventDefault(); // Verhindert die Standardaktion des Links
  var legalLink = document.getElementById("legal_link");
  if (legalLink) {
    disableLink(legalLink);

    // Verzögere den Seitenwechsel, um sicherzustellen, dass der Status gespeichert wird
    setTimeout(() => {
      window.location.href = legalLink.href;
    }, 100); // 100 ms Verzögerung
  }
}

function disableLink(link) {
  link.classList.add("disabled"); // Füge die 'disabled'-Klasse hinzu
  localStorage.setItem(link.id + "_disabled", "true"); // Speichere den Status im Local Storage
  link.removeEventListener("click", handleClick); // Entferne den Event-Listener, um weitere Klicks zu verhindern
}
