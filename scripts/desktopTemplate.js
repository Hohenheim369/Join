document.addEventListener("DOMContentLoaded", () => {
  // Lade das Template und warte, bis es fertig ist
  loadTemplate().then(() => {
    // initialien im header einfügen
    updateInitialsElement();
    // Setze die Sichtbarkeit des Bodys auf sichtbar
    document.body.style.visibility = "visible";
    // Aktualisiere die Sidebar-Icons nach dem Laden des Templates
    updateSidebarIcons();
    // Füge die Event-Listener für die Links hinzu
    initializeLinks();
    // Überprüfe den Parameter hideIcons, aber erst nach dem Laden des Templates
    hideIcons();
    hideSidebarMobile();
    handleResponsiveHelp();
    window.addEventListener("resize", handleResponsiveHelp, hideSidebarMobile); // Bei jeder Größenänderung prüfen
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
  const response = await fetch("../assets/templates/desktopTemplate.html");
  const data = await response.text();
  document.getElementById("desktop_template").innerHTML = data;
}

function updateSidebarIcons() {
  const currentPage = window.location.pathname.split("/").pop();
  const iconPages = ["summary", "board", "contacts", "addTask"];

  iconPages.forEach((page) => updateIcon(page, currentPage));
  updatePageState("privacyPolicy.html", ".privacy-policy-link", currentPage);
  updatePageState("legalNotice.html", ".legal-notice-link", currentPage);
}

function updateIcon(page, currentPage) {
  const linkElement = document.querySelector(`.${page}-link`);
  const iconElement = linkElement?.querySelector("img"); // Annahme: Es gibt ein <img>-Element im Link
  const isCurrentPage =
    currentPage === `${page}.html` ||
    currentPage === `${page.replace("_", "-")}.html`; // Abdeckung von add_task

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
  handleLink("policy_link", "privacyPolicy.html", handleClick);
  handleLink("legal_link", "legalNotice.html", handleClickLegal);
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

function getInitialsFromLocalStorage() {
  let activeUser = localStorage.getItem("activeUser");
  if (activeUser) {
    // In ein JSON-Objekt umwandeln
    const loggedInUser = JSON.parse(activeUser);
    // Initialen abrufen
    return loggedInUser.initials;
  }
}

function updateInitialsElement() {
  let initialsElement = document.getElementById("user_profile_initials");
  let initials = getInitialsFromLocalStorage();

  if (initialsElement) {
    initialsElement.innerHTML = `${initials}`;
  }
}

function hideIcons() {
  const activeUser = localStorage.getItem("activeUser");
  if (!activeUser) {
    const elementsToHide = ["icon_bar", "header_icons"]; // Füge hier die IDs der Elemente hinzu, die du verstecken möchtest
    elementsToHide.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.setProperty("display", "none", "important"); // Element ausblenden
      }
    });
  }
}

function hideSidebarMobile() {
  const activeUser = localStorage.getItem("activeUser");
  const screenWidth = window.innerWidth;

  // Wenn kein Benutzer eingeloggt ist und die Bildschirmbreite unter 770px liegt
  if (!activeUser && screenWidth < 770) {
    const sidebar = document.getElementById("sidebar"); // Angenommen, die Sidebar hat die ID 'sidebar'
    if (sidebar) {
      sidebar.style.setProperty("display", "none", "important"); // Sidebar ausblenden
      document.getElementById("arrow_back").classList.add("d-none");
    }
    const content = document.querySelector(".content");
    if (content) {
      content.style.height = "100%";
    }
  }
}


function logOut() {
  resetTheDatabase();
  localStorage.removeItem("activeUser");
  window.location.href = "../index.html";  
}

function handleResponsiveHelp() {
  const mediaQuery = window.matchMedia("(max-width: 1000px)"); // Beispiel für eine mobile Ansicht
  const sourceDiv = document.getElementById("help_mobile");
  const targetDiv = document.getElementById("log_out");

  if (mediaQuery.matches) {
    if (targetDiv.firstChild) {
      sourceDiv.classList.remove("d-none");
      targetDiv.insertBefore(sourceDiv, targetDiv.firstChild); // An die erste Position verschieben
    } else {
      targetDiv.appendChild(sourceDiv); // Falls das Ziel-Element leer ist
    }
  } else {
    // Optional: Andernfalls zurücksetzen
    document.getElementById("header_icons").appendChild(sourceDiv); // Falls du es zurückschieben möchtest
    document.getElementById("help_mobile").classList.add("d-none");
  }
}
