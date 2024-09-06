document.addEventListener("DOMContentLoaded", () => {
  let includesLoadedHandled = false;

  document.addEventListener("includesLoaded", handleIncludesLoaded);

  function handleIncludesLoaded() {
    if (!includesLoadedHandled) {
      includesLoadedHandled = true;
      handleUserProfile();
    }
  }

  function handleUserProfile() {
    let loggedInUserName = localStorage.getItem("loggedInUserName");
    if (loggedInUserName) {
      console.log("Logged-in user name:", loggedInUserName);
      let initials = getInitials(loggedInUserName);
      updateInitialsElement(initials);
    } else {
      console.log("No logged-in user name found");
    }
  }

  function getInitials(userName) {
    let nameParts = userName.split(" ");
    return nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
  }

  function updateInitialsElement(initials) {
    let initialsElement = document.getElementById("user_profile_initials");
    if (initialsElement) {
      initialsElement.innerHTML = `${initials}`;
      initialsElement.addEventListener("click", toggleLogOutVisibility);
    }
    console.log(initials);
  }

  function toggleLogOutVisibility() {
    let logOutElement = document.getElementById("log_out");
    if (logOutElement) {
      logOutElement.classList.toggle("d-none");
    }
  }

  document.addEventListener("click", handleDocumentClick);

  function handleDocumentClick(event) {
    let logOutElement = document.getElementById("log_out");
    let initialsElement = document.getElementById("user_profile_initials");

    if (
      logOutElement &&
      !logOutElement.contains(event.target) &&
      !initialsElement.contains(event.target) &&
      !event.target.closest("#log_out")
    ) {
      logOutElement.classList.add("d-none");
    }
  }
});

function logOut() {
  // Wert aus dem lokalen Speicher löschen
  localStorage.removeItem("loggedInUserName");
}

function updateSidebarIcons() {
  const currentPage = window.location.pathname;

  // Pfade zu den grauen und weißen Icons
  const iconPaths = {
    summary: {
      grey: "../assets/img/png/summary-grey.png",
      white: "../assets/img/png/summary-white.png"
    },
    addTask: {
      grey: "../assets/img/png/add-task-grey.png",
      white: "../assets/img/png/add-task-white.png"
    },
    board: {
      grey: "../assets/img/png/board-grey.png",
      white: "../assets/img/png/board-white.png"
    },
    contacts: {
      grey: "../assets/img/png/contacts-grey.png",
      white: "../assets/img/png/contacts-white.png"
    }
  };

  // Links zu den relevanten Seiten
  const links = {
    summary: document.querySelector('.summary-link'),
    addTask: document.querySelector('.addTask-link'),
    board: document.querySelector('.board-link'),
    contacts: document.querySelector('.contacts-link'),
    privacyPolicy: document.querySelector('.privacy-policy-link'),
    legalNotice: document.querySelector('.legal-notice-link')
  };

  // Für die Seiten, die Icons ändern müssen
  const pagesWithIcons = ['summary', 'addTask', 'board', 'contacts'];

  for (const page of pagesWithIcons) {
    const linkElement = links[page];
    if (currentPage.includes(`${page}.html`)) {
      changeIcon(page, iconPaths[page].white);
      if (linkElement) {
        linkElement.classList.add('active', 'disabled');
      }
    } else if (linkElement) {
      linkElement.classList.remove('active', 'disabled');
    }
  }

  // Für die Seiten, die keine Icons ändern müssen
  if (currentPage.includes('privacy-policy.html')) {
    const privacyLinkElement = links.privacyPolicy;
    if (privacyLinkElement) {
      privacyLinkElement.classList.add('active', 'disabled');
    }
  } else if (links.privacyPolicy) {
    links.privacyPolicy.classList.remove('active', 'disabled');
  }

  if (currentPage.includes('legal-notice.html')) {
    const legalNoticeLinkElement = links.legalNotice;
    if (legalNoticeLinkElement) {
      legalNoticeLinkElement.classList.add('active', 'disabled');
    }
  } else if (links.legalNotice) {
    links.legalNotice.classList.remove('active', 'disabled');
  }
}

// Funktion zum Ändern des Icons
function changeIcon(linkClass, newIconPath) {
  const linkElement = document.querySelector(`.${linkClass}-link img`);
  if (linkElement) {
    linkElement.src = newIconPath;
  }
}

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
  var policyLink = document.getElementById('policy_link');
  var legalLink = document.getElementById('legal_link');

  // Privacy Policy Link
  if (policyLink) {
    if (window.location.pathname.includes('privacy-policy.html')) {
      // Deaktiviere den Link, wenn du auf der Privacy Policy-Seite bist
      disableLink(policyLink);
    } else {
      // Andernfalls setze den Link in den Standardzustand und füge den Klick-Event-Listener hinzu
      if (localStorage.getItem('policy_link_disabled') === 'true') {
        // Falls der Link im Local Storage als deaktiviert gespeichert ist, wiederherstellen
        localStorage.removeItem('policy_link_disabled');
        policyLink.classList.remove('disabled');
        policyLink.addEventListener('click', handleClick);
      } else {
        policyLink.addEventListener('click', handleClick);
      }
    }
  } else {
    console.error('Element mit ID "policy_link" nicht gefunden.');
  }

  // Legal Notice Link
  if (legalLink) {
    if (window.location.pathname.includes('legal_notice.html')) {
      // Deaktiviere den Link, wenn du auf der Legal Notice-Seite bist
      disableLink(legalLink);
    } else {
      // Andernfalls setze den Link in den Standardzustand und füge den Klick-Event-Listener hinzu
      if (localStorage.getItem('legal_link_disabled') === 'true') {
        // Falls der Link im Local Storage als deaktiviert gespeichert ist, wiederherstellen
        localStorage.removeItem('legal_link_disabled');
        legalLink.classList.remove('disabled');
        legalLink.addEventListener('click', handleClickLegal);
      } else {
        legalLink.addEventListener('click', handleClickLegal);
      }
    }
  } else {
    console.error('Element mit ID "legal_link" nicht gefunden.');
  }
}

function handleClick(event) {
  event.preventDefault(); // Verhindert die Standardaktion des Links
  var policyLink = document.getElementById('policy_link');
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
  var legalLink = document.getElementById('legal_link');
  if (legalLink) {
    disableLink(legalLink);
    
    // Verzögere den Seitenwechsel, um sicherzustellen, dass der Status gespeichert wird
    setTimeout(() => {
      window.location.href = legalLink.href;
    }, 100); // 100 ms Verzögerung
  }
}

function disableLink(link) {
  link.classList.add('disabled'); // Füge die 'disabled'-Klasse hinzu
  localStorage.setItem(link.id + '_disabled', 'true'); // Speichere den Status im Local Storage
  link.removeEventListener('click', handleClick); // Entferne den Event-Listener, um weitere Klicks zu verhindern
}