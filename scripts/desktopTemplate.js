/**
 * Fügt einen Event-Listener hinzu, der ausgelöst wird, wenn der DOM vollständig geladen ist.
 * Bei Auslösung wird das Template geladen, die Benutzeroberfläche initialisiert 
 * und ein Event-Listener für das Ändern der Fenstergröße hinzugefügt.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await loadTemplate();
  initializeUserInterface();
  window.addEventListener("resize", handleResize);
});

/**
 * Fügt einen Event-Listener hinzu, der bei Klicks im Benutzer-Menü ausgelöst wird.
 */
document.addEventListener("click", handleClickUserMenu);

/**
 * Lädt das Desktop-Template und fügt den Inhalt in das entsprechende HTML-Element ein.
 * @returns {Promise<void>}
 */
async function loadTemplate() {
  const response = await fetch("../assets/templates/desktopTemplate.html");
  document.getElementById("desktop_template").innerHTML = await response.text();
}

/**
 * Initialisiert die Benutzeroberfläche, indem sie die Initialen des Benutzers aktualisiert,
 * die Sichtbarkeit des Körpers auf sichtbar setzt, Sidebar-Icons aktualisiert und Links initialisiert.
 */
function initializeUserInterface() {
  updateInitials();
  document.body.style.visibility = "visible";
  updateSidebarIcons();
  initializeLinks();
  handleResize(); 
}

/**
 * Aktualisiert die Icons in der Sidebar basierend auf der aktuellen Seite.
 */
function updateSidebarIcons() {
  const currentPage = window.location.pathname.split("/").pop();
  const pages = ["summary", "board", "contacts", "addTask"];
  pages.forEach((page) => updateIconState(page, currentPage));
  updatePageState("privacyPolicy.html", ".privacy-policy-link", currentPage);
  updatePageState("legalNotice.html", ".legal-notice-link", currentPage);
}

/**
 * Aktualisiert den Status des Icons basierend auf der aktuellen Seite.
 * @param {string} page - Der Name der Seite.
 * @param {string} currentPage - Der Name der aktuellen Seite.
 */
function updateIconState(page, currentPage) {
  const link = document.querySelector(`.${page}-link`);
  const icon = link?.querySelector("img");
  const isActive = currentPage === `${page}.html`;
  if (link && icon) {
    icon.src = `../assets/img/png/${page}-${isActive ? "white" : "grey"}.png`;
    link.classList.toggle("active", isActive);
    link.classList.toggle("disabled", isActive);
  }
}

/**
 * Aktualisiert den Status eines Links in der Sidebar basierend auf der aktuellen Seite.
 * @param {string} page - Der Name der Seite.
 * @param {string} selector - Der CSS-Selektor des Links.
 * @param {string} currentPage - Der Name der aktuellen Seite.
 */
function updatePageState(page, selector, currentPage) {
  const link = document.querySelector(selector);
  if (link) {
    const isActive = currentPage === page;
    link.classList.toggle("active", isActive);
    link.classList.toggle("disabled", isActive);
  }
}

/**
 * Handhabt das Ändern der Fenstergröße und passt die Anzeige an.
 */
function handleResize() {
  hideSidebarAtMobile();
  addHelpToMenu();
}

/**
 * Blendet die Sidebar auf mobilen Geräten aus und wenn kein aktiver Benutzer vorhanden ist.
 */
function hideSidebarAtMobile() {
  if (!localStorage.getItem("activeUser") && window.innerWidth < 770) {
    document.getElementById("sidebar")?.style.setProperty("display", "none", "important");
    document.getElementById("arrow_back")?.classList.add("d-none");
    document.querySelector(".content")?.style.setProperty("height", "100%");
  }
}

/**
 * Fügt das Hilfe-Element zum Menü hinzu, je nach Bildschirmgröße.
 */
function addHelpToMenu() {
  const isMobile = window.matchMedia("(max-width: 1240px)").matches;
  const helpDiv = document.getElementById("help_mobile");
  const logOutDiv = document.getElementById("log_out");
  if (isMobile) {
    logOutDiv.insertBefore(helpDiv, logOutDiv.firstChild);
    helpDiv.classList.remove("d-none");
  } else {
    document.getElementById("header_icons").appendChild(helpDiv);
    helpDiv.classList.add("d-none");
  }
}

/**
 * Initialisiert Links in der Benutzeroberfläche.
 */
function initializeLinks() {
  setupLink("policy_link", "privacyPolicy.html", handleLinkClick);
  setupLink("legal_link", "legalNotice.html", handleLinkClick);
}

/**
 * Setzt einen Link mit einem Klick-Handler oder deaktiviert den Link.
 * @param {string} id - Die ID des Links.
 * @param {string} page - Der Zielseite des Links.
 * @param {Function} clickHandler - Der Klick-Handler für den Link.
 */
function setupLink(id, page, clickHandler) {
  const link = document.getElementById(id);
  if (link && !window.location.pathname.includes(page)) {
    link.addEventListener("click", clickHandler);
  } else {
    link.classList.add("disabled");
  }
}

/**
 * Handhabt den Klick auf einen Link, indem die Standardaktion verhindert 
 * und der Link deaktiviert wird, bevor die Seite umgeleitet wird.
 * @param {Event} event - Das Klick-Ereignis.
 */
function handleLinkClick(event) {
  event.preventDefault();
  const link = event.currentTarget;
  link.classList.add("disabled");
  localStorage.setItem(`${link.id}_disabled`, "true");
  setTimeout(() => {
    window.location.href = link.href;
  }, 100);
}

/**
 * Handhabt Klicks im Benutzer-Menü und zeigt die Logout-Option an oder aus.
 * @param {Event} event - Das Klick-Ereignis.
 */
function handleClickUserMenu(event) {
  const initials = document.getElementById("user_profile_initials");
  const logOut = document.getElementById("log_out");
  if (initials.contains(event.target)) {
    toggleVisibility(logOut, initials);
  } else if (!logOut.classList.contains("d-none") && !logOut.contains(event.target)) {
    logOut.classList.add("d-none");
    initials.classList.remove("bg-color");
  }
}

/**
 * Wechselt die Sichtbarkeit des Logout-Elements.
 * @param {HTMLElement} logOut - Das Logout-Element.
 * @param {HTMLElement} initials - Das Initialen-Element.
 */
function toggleVisibility(logOut, initials) {
  logOut.classList.toggle("d-none");
  initials.classList.toggle("bg-color");
}

/**
 * Aktualisiert die Initialen des Benutzers in der Benutzeroberfläche.
 */
function updateInitials() {
  const initials = JSON.parse(localStorage.getItem("activeUser"))?.initials;
  document.getElementById("user_profile_initials").textContent = initials || "";
}
