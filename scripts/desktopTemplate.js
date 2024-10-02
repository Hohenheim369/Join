document.addEventListener("DOMContentLoaded", async () => {
  await loadTemplate();
  initializeUserInterface();
  window.addEventListener("resize", handleResize);
});

document.addEventListener("click", handleClickUserMenu);

async function loadTemplate() {
  const response = await fetch("../assets/templates/desktopTemplate.html");
  document.getElementById("desktop_template").innerHTML = await response.text();
}

function initializeUserInterface() {
  updateInitials();
  document.body.style.visibility = "visible";
  updateSidebarIcons();
  initializeLinks();
  handleResize(); // Initial aufrufen
}

function updateSidebarIcons() {
  const currentPage = window.location.pathname.split("/").pop();
  const pages = ["summary", "board", "contacts", "addTask"];
  pages.forEach((page) => updateIconState(page, currentPage));
  updatePageState("privacyPolicy.html", ".privacy-policy-link", currentPage);
  updatePageState("legalNotice.html", ".legal-notice-link", currentPage);
}

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

function updatePageState(page, selector, currentPage) {
  const link = document.querySelector(selector);
  if (link) {
    const isActive = currentPage === page;
    link.classList.toggle("active", isActive);
    link.classList.toggle("disabled", isActive);
  }
}

function handleResize() {
  hideSidebarAtMobile();
  addHelpToMenu();
}

function hideSidebarAtMobile() {
  if (!localStorage.getItem("activeUser") && window.innerWidth < 770) {
    document.getElementById("sidebar")?.style.setProperty("display", "none", "important");
    document.getElementById("arrow_back")?.classList.add("d-none");
    document.querySelector(".content")?.style.setProperty("height", "100%");
  }
}

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

function initializeLinks() {
  setupLink("policy_link", "privacyPolicy.html", handleLinkClick);
  setupLink("legal_link", "legalNotice.html", handleLinkClick);
}

function setupLink(id, page, clickHandler) {
  const link = document.getElementById(id);
  if (link && !window.location.pathname.includes(page)) {
    link.addEventListener("click", clickHandler);
  } else {
    link.classList.add("disabled");
  }
}

function handleLinkClick(event) {
  event.preventDefault();
  const link = event.currentTarget;
  link.classList.add("disabled");
  localStorage.setItem(`${link.id}_disabled`, "true");
  setTimeout(() => {
    window.location.href = link.href;
  }, 100);
}

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

function toggleVisibility(logOut, initials) {
  logOut.classList.toggle("d-none");
  initials.classList.toggle("bg-color");
}

function updateInitials() {
  const initials = JSON.parse(localStorage.getItem("activeUser"))?.initials;
  document.getElementById("user_profile_initials").textContent = initials || "";
}