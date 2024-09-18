document.addEventListener("DOMContentLoaded", () => {
  // Lade das Template und warte, bis es fertig ist
  loadTemplate().then(() => {
    // Setze die Sichtbarkeit des Bodys auf sichtbar
    document.body.style.visibility = "visible";
    // Aktualisiere die Sidebar-Icons nach dem Laden des Templates
    updateSidebarIcons();
    // Füge die Event-Listener für die Links hinzu
    initializeLinks();
    // Überprüfe den Parameter hideIcons, aber erst nach dem Laden des Templates
    const hideIcons = getQueryParam("hideIcons");
    if (hideIcons === "true") {
      hideElement("header_icons");
      hideElement("icon_bar");
    }
  });
});

document.addEventListener("click", (event) => {
  const logOutElement = document.getElementById("log_out");
  const initialsElement = document.getElementById("user_profile_initials");

  if (initialsElement.contains(event.target)) {
    event.stopPropagation(); // Klick auf Initialen
    logOutElement.classList.toggle("d-none");
    initialsElement.classList.toggle("bg-color");
  } else if (
    !logOutElement.classList.contains("d-none") &&
    !logOutElement.contains(event.target)
  ) {
    logOutElement.classList.add("d-none"); // Klick außerhalb
    initialsElement.classList.remove("bg-color");
  }
});

async function loadTemplate() {
    const response = await fetch("../assets/templates/desktop_template.html");
    const data = await response.text();
    document.getElementById("desktop_template").innerHTML = data;

    // Custom Event "loadTemplated" auslösen, nachdem das Template geladen wurde
    const event = new Event("loadTemplated");
    document.dispatchEvent(event);
}

function updateSidebarIcons() {
  const currentPage = window.location.pathname.split("/").pop();
  const iconPages = ["summary", "board", "contacts", "add_task"];

  iconPages.forEach(page => updateIcon(page, currentPage));
  updatePageState("privacy-policy.html", ".privacy-policy-link", currentPage);
  updatePageState("legal-notice.html", ".legal-notice-link", currentPage);
}

function updateIcon(page, currentPage) {
  const linkElement = document.querySelector(`.${page}-link`);
  const iconElement = linkElement?.querySelector('img'); // Annahme: Es gibt ein <img>-Element im Link
  const isCurrentPage = currentPage === `${page}.html` || currentPage === `${page.replace('_', '-')}.html`; // Abdeckung von add_task

  if (linkElement && iconElement) {
    const iconColor = isCurrentPage ? "white" : "grey";
    iconElement.src = `../assets/img/png/${page}-${iconColor}.png`; // Aktualisiere das Icon
    linkElement.classList.toggle("active", isCurrentPage);
    linkElement.classList.toggle("disabled", isCurrentPage);
  }
}

function updatePageState(page, selector, currentPage) {
  const linkElement = document.querySelector(selector);
  if (linkElement) {
    linkElement.classList.toggle("active", currentPage === page);
    linkElement.classList.toggle("disabled", currentPage === page);
  }
}

function initializeLinks() {
  handleLink("policy_link", "privacy-policy.html", handleClick);
  handleLink("legal_link", "legal_notice.html", handleClickLegal);
}

function handleLink(id, page, clickHandler) {
  const link = document.getElementById(id);
  if (!link) {
    console.error(`Element mit ID "${id}" nicht gefunden.`);
    return;
  }

  if (window.location.pathname.includes(page)) {
    disableLink(link);
  } else {
    setupLink(link, clickHandler);
  }
}

function setupLink(link, clickHandler) {
  if (localStorage.getItem(link.id + "_disabled") === "true") {
    localStorage.removeItem(link.id + "_disabled");
    link.classList.remove("disabled");
  }
  link.addEventListener("click", clickHandler);
}

function disableLink(link) {
  link.classList.add("disabled");
  link.removeEventListener("click", handleClick);
  link.removeEventListener("click", handleClickLegal);
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

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function hideElement(id) {
  const element = document.getElementById(id);
  if (element) {
    console.log(`${id} gefunden, füge d-none hinzu`);
    element.classList.add("d-none");
    hideArrowBack();
  }
}

function hideArrowBack() {
  const arrowBack = document.getElementById("arrow_back");
  if (arrowBack) {
    arrowBack.classList.add("d-none");
  }
}

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

function logOut() {
  localStorage.removeItem("activeUser");
}
