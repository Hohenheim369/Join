/**
 * Displays the contact information on mobile devices.
 * This function loads the contact information and displays it in the mobile view.
 * @param {number} contactId - The ID of the contact whose information is to be displayed.
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
    document.getElementById("for_active_user").classList.add("letter-circel-user");
    document.getElementById("user_delete_display_info").classList.add("d-none")
  }
  contactInfoButtons.innerHTML = generateButtonsInContactInfo(contact);
  mobileEditContact();
  const menu = document.getElementById("mobile_menu");
  menu.innerHTML = generateMobileMenu(contact);
  if (contact.id === 0) {
    document.getElementById("user_delete_mobile").classList.add("d-none")
  }
}

/**
 * Hides the edit button in the mobile view.
 * This function disables the edit button in the mobile contact view.
 */
function mobileEditContact() {
  const contactMobileButton = document.querySelector(
    ".contact-box-edit-delete"
  );
  contactMobileButton.classList.add("d-none");
}

/**
 * Hides the mobile contact information and resets the display.
 * This function removes the mobile contact view and clears the contents.
 */
function goBackMobile() {
  document.getElementById("mobile_contact_info").classList.add("d-none");
  document.getElementById("mobile_contact_info").classList.remove("pos-abs");
  const contactInfoDiv = document.querySelector(".mobile-contacts-info-box");
  contactInfoDiv.innerHTML = "";
}

/**
 * Opens the mobile menu for a contact.
 * This function displays the menu and allows closing it by clicking outside the menu.
 */
function openMobileMenu() {
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
