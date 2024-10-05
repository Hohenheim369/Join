/**
 * Adds an event listener that triggers when the DOM is fully loaded.
 * Upon triggering, the template is loaded, the user interface is initialized,
 * and an event listener for window resizing is added.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await loadTemplate();
  initializeUserInterface();
  legalNoticeWithoutUser();
  window.addEventListener("resize", handleResize);
});

/**
 * Adds an event listener that is triggered on clicks in the user menu.
 */
document.addEventListener("click", handleClickUserMenu);

/**
 * Loads the desktop template and inserts the content into the corresponding HTML element.
 * @returns {Promise<void>}
 */
async function loadTemplate() {
  const response = await fetch("../assets/templates/desktopTemplate.html");
  document.getElementById("desktop_template").innerHTML = await response.text();
}

/**
 * Initializes the user interface by updating the user's initials,
 * setting the body's visibility to visible, updating sidebar icons, and initializing links.
 */
function initializeUserInterface() {
  updateInitials();
  document.body.style.visibility = "visible";
  updateSidebarIcons();
  initializeLinks();
  handleResize(); 
}

/**
 * Updates the icons in the sidebar based on the current page.
 */
function updateSidebarIcons() {
  const currentPage = window.location.pathname.split("/").pop();
  const pages = ["summary", "board", "contacts", "addTask"];
  pages.forEach((page) => updateIconState(page, currentPage));
  updatePageState("privacyPolicy.html", ".privacy-policy-link", currentPage);
  updatePageState("legalNotice.html", ".legal-notice-link", currentPage);
}

/**
 * Updates the icon status based on the current page.
 * @param {string} page - The name of the page.
 * @param {string} currentPage - The name of the current page.
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
 * Updates the status of a link in the sidebar based on the current page.
 * @param {string} page - The name of the page.
 * @param {string} selector - The CSS selector of the link.
 * @param {string} currentPage - The name of the current page.
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
 * Handles window resizing and adjusts the display accordingly.
 */
function handleResize() {
  hideSidebarAtMobile();
  addHelpToMenu();
}

/**
 * Hides the sidebar on mobile devices and when no active user is present.
 */
function hideSidebarAtMobile() {
  if (!localStorage.getItem("activeUser") && window.innerWidth < 770) {
    document.getElementById("sidebar")?.style.setProperty("display", "none", "important");
    document.getElementById("arrow_back")?.classList.add("d-none");
    document.querySelector(".content")?.style.setProperty("height", "100%");
  }
}

/**
 * Adds the help element to the menu based on screen size.
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
 * Initializes links in the user interface.
 */
function initializeLinks() {
  setupLink("policy_link", "privacyPolicy.html", handleLinkClick);
  setupLink("legal_link", "legalNotice.html", handleLinkClick);
}

/**
 * Sets up a link with a click handler or disables the link.
 * @param {string} id - The ID of the link.
 * @param {string} page - The target page of the link.
 * @param {Function} clickHandler - The click handler for the link.
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
 * Handles a click on a link by preventing the default action,
 * disabling the link, and then redirecting to the page.
 * @param {Event} event - The click event.
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
 * Handles clicks in the user menu and shows or hides the logout option.
 * @param {Event} event - The click event.
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
 * Toggles the visibility of the logout element.
 * @param {HTMLElement} logOut - The logout element.
 * @param {HTMLElement} initials - The initials element.
 */
function toggleVisibility(logOut, initials) {
  logOut.classList.toggle("d-none");
  initials.classList.toggle("bg-color");
}

/**
 * Updates the user's initials in the user interface.
 */
function updateInitials() {
  const initials = JSON.parse(localStorage.getItem("activeUser"))?.initials;
  document.getElementById("user_profile_initials").textContent = initials || "";
}

/**
 * Hides specific HTML elements if no active user is found in the local storage.
 * 
 * This function checks if an "activeUser" exists in local storage. If not, 
 * it hides the elements with the IDs 'header_icons', 'icon_bar', and 'arrow_back' 
 * by adding the 'd-none' class to them.
 */
function legalNoticeWithoutUser() {
  const checkIfUserIsLogged = localStorage.getItem("activeUser");
  if (!checkIfUserIsLogged) {
    document.getElementById('header_icons').classList.add('d-none');
    document.getElementById('icon_bar').classList.add('d-none');
    document.getElementById('arrow_back').classList.add('d-none');
  }
}
