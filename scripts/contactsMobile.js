/**
 * Zeigt die Kontaktinformationen auf mobilen Geräten an.
 * Diese Funktion lädt die Kontaktinformationen und zeigt sie in der mobilen Ansicht an.
 * @param {number} contactId - Die ID des Kontakts, dessen Informationen angezeigt werden sollen.
 */
async function displayContactInfoMobile(contactId) {
  let infoDiv = document.getElementById("mobile_contact_info");
  infoDiv.classList.remove("d-none");
  infoDiv.classList.add("pos-abs");
  const contact = await getContact(contactId);
  const contactInfoDiv = document.querySelector(".mobile-contacts-info-box");
  const contactInfoButtons = document.getElementById("button_edit_dialog");
  contactInfoDiv.innerHTML = generateContactInfo(contact);
  if (contact.id === 0) {
    document
      .getElementById("for_active_user")
      .classList.add("letter-circel-user");
  }
  contactInfoButtons.innerHTML = generateButtonsInContactInfo(contact);
  mobileEditContact();
  const menu = document.getElementById("mobile_menu");
  menu.innerHTML = generateMobileMenu(contact);
}

/**
 * Blendet den Bearbeiten-Button in der mobilen Ansicht aus.
 * Diese Funktion deaktiviert den Bearbeiten-Button in der mobilen Kontaktansicht.
 */
function mobileEditContact() {
  const contactMobileButton = document.querySelector(
    ".contact-box-edit-delete"
  );
  contactMobileButton.classList.add("d-none");
}

/**
 * Blendet die mobile Kontaktinformation aus und setzt die Anzeige zurück.
 * Diese Funktion entfernt die mobile Kontaktansicht und leert die Inhalte.
 */
function goBackMobile() {
  document.getElementById("mobile_contact_info").classList.add("d-none");
  document.getElementById("mobile_contact_info").classList.remove("pos-abs");
  const contactInfoDiv = document.querySelector(".mobile-contacts-info-box");
  contactInfoDiv.innerHTML = "";
}

/**
 * Öffnet das mobile Menü für einen Kontakt.
 * Diese Funktion zeigt das Menü an und ermöglicht das Schließen des Menüs durch Klicken außerhalb des Menüs.
 * @param {number} contactId - Die ID des Kontakts, für den das Menü geöffnet wird.
 */
function openMobileMenu(contactId) {
  const menu = document.getElementById("mobile_menu");
  menu.classList.add("d-flex");
  const handleClickOutside = (event) => {
    if (!menu.contains(event.target)) {
      menu.classList.remove("d-flex");
      document.removeEventListener("click", handleClickOutside);
    }
  };
  setTimeout(() => {
    document.addEventListener("click", handleClickOutside);
  }, 0);
}
