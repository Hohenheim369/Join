/**
 * Event listener that is triggered once the HTML document is fully loaded and parsed.
 * This listener calls the `renderContent()` function to display the contact list.
 */
document.addEventListener("DOMContentLoaded", () => {
  renderContent();
});

/**
 * Loads and renders the content of the contact list.
 * This function groups the contacts by their initials and displays them in the UI.
 */
async function renderContent() {
  const groupedContacts = await groupContacts();
  renderContactsList(groupedContacts);
}

/**
 * Groups the contacts by their initials.
 * This function filters the active user's contacts and groups them based on the first letter
 * of their initials.
 * @returns {Object} An object containing the contacts grouped by initials.
 */
async function groupContacts() {
  userContacts = await filterUserContacts();
  return userContacts.reduce((acc, contact, index) => {
    if (contact && contact.initials) {
      let firstInitial = contact.initials.charAt(0).toUpperCase();
      if (!acc[firstInitial]) {
        acc[firstInitial] = [];
      }
      acc[firstInitial].push({ contact, initials: contact.initials, index });
    }
    return acc;
  }, {});
}

/**
 * Filters the contacts of the currently active user.
 * This function loads the contacts from the database and filters only those that belong to the active user.
 * @returns {Array} A list of the filtered contacts of the active user.
 */
async function filterUserContacts() {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  const data = await fetchData("contacts");
  const contacts = Object.values(data);
  const userContacts = contacts.filter((contact) =>
    activeUser.contacts.includes(contact.id)
  );
  return userContacts;
}

/**
 * Renders the grouped contacts in the contact list.
 * This function sorts the initials, renders a letter box for each initial, and displays
 * the corresponding contacts.
 * @param {Object} groupedContacts - An object containing the contacts grouped by initials.
 */
async function renderContactsList(groupedContacts) {
  const contactList = document.getElementById("contact_list");
  contactList.innerHTML = "";
  await initActiveUser(contactList);
  const sortedInitials = sortInitials(Object.keys(groupedContacts));
  sortedInitials.forEach((initial) => {
    initLetterBox(initial, contactList);
    renderContactsByInitial(groupedContacts[initial], contactList);
  });
}

/**
 * Initializes and displays the information of the active user in the contact list.
 * @param {HTMLElement} contactList - The HTML element of the contact list.
 */
async function initActiveUser(contactList) {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  const user = await searchForUser(activeUser.id);
  if (user) {
    user.id = 0;
    contactList.innerHTML = generateActiveUserContact(user);
  }
}

/**
 * Sorts the initials alphabetically.
 * @param {Array} initials - An array of initials.
 * @returns {Array} The alphabetically sorted array of initials.
 */
function sortInitials(initials) {
  return initials.sort();
}

/**
 * Renders all contacts that belong to a specific initial.
 * @param {Array} contacts - The contacts grouped under a specific initial.
 * @param {HTMLElement} contactList - The HTML element of the contact list.
 */
function renderContactsByInitial(contacts, contactList) {
  contacts.forEach(({ contact }) => {
    const contactHtml = generateContact(contact);
    contactList.innerHTML += contactHtml;
  });
}

/**
 * Initializes a letter box in the contact list.
 * @param {string} initial - The starting letter of the initials.
 * @param {HTMLElement} contactList - The HTML element of the contact list.
 */
function initLetterBox(initial, contactList) {
  const letterBoxHtml = generateLetterBox(initial);
  contactList.innerHTML += letterBoxHtml;
}

/**
 * Adds a new contact and updates the user interface.
 * This function creates a new contact, adds it to the active user, and renders the
 * updated contact list.
 */
async function addContact() {
  const contactId = await postNewContact();
  addContactToUser(contactId, activeUser);
  addContactToUserLocal(contactId, activeUser);
  closeDialog();
  await openDialogSuccessfully('created');
  clearForm();
  renderContent();
}

/**
 * Creates a contact object with the provided data.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {number} contactId - The ID of the contact.
 * @returns {Object} The created contact object.
 */
function createContact(name, email, phone, contactId) {
  return {
    id: contactId,
    name: name,
    email: email,
    phone: phone,
    color: generateRandomColor(),
    initials: getInitials(name),
  };
}

/**
 * Generates a random color in a dark shade.
 * @returns {string} A hexadecimal color code.
 */
function generateRandomColor() {
  const darkLetters = "0123456789ABC";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += darkLetters[Math.floor(Math.random() * darkLetters.length)];
  }
  return color;
}

/**
 * Displays the information of a contact on the desktop.
 * This function loads the contact data and shows it in the contact info area.
 * If the screen width is less than 777px, the mobile view will be displayed instead.
 * @param {number} contactId - The ID of the contact whose information should be displayed.
 */
async function displayContactInfo(contactId) {
  const contact = await getContact(contactId);
  if (window.innerWidth <= 777) {
    return displayContactInfoMobile(contactId);
  }
  const contactInfoDiv = document.querySelector(".contacts-info-box");
  const contactInfoButtons = document.getElementById("button_edit_dialog");
  contactInfoDiv.innerHTML = generateContactInfo(contact);
  contactInfoButtons.innerHTML = generateButtonsInContactInfo(contact);
  if (contact.id === 0) {
    document.getElementById("for_active_user").classList.add("letter-circel-user");
    document.getElementById("user_delete_display_info").classList.add("d-none")
  }
  highlightContact(contact);
}

/**
 * Retrieves the contact data based on the contact ID.
 * This function distinguishes between the active user and a regular contact.
 * @param {number} contactId - The ID of the contact to be retrieved.
 * @returns {Object} The data of the contact.
 */
async function getContact(contactId) {
  if (contactId === 0) {
    const activeUser = JSON.parse(localStorage.getItem("activeUser"));
    const contact = await searchForUser(activeUser.id);
    contact.id = 0;
    return contact;
  } else {
    return await searchForContact(contactId);
  }
}

/**
 * Highlights the currently selected contact in the contact list.
 * This function sets the background color of the selected contact and visually highlights it.
 * @param {Object} contact - The contact to be highlighted.
 */
function highlightContact(contact) {
  const contacts = document.getElementsByClassName("contacts");
  for (let i = 0; i < contacts.length; i++) {
    contacts[i].style.backgroundColor = "";
    contacts[i].style.color = "black";
  }
  document.getElementById(`contact${contact.id}`).style.backgroundColor =
    "#27364a";
  document.getElementById(`contact${contact.id}`).style.color = "white";
}

/**
 * Returns the initials of a name.
 * This function extracts the first letters from the name and returns them as initials.
 * @param {string} name - The name from which the initials should be extracted.
 * @returns {string} The initials of the name.
 */
function getInitials(name) {
  const names = name.split(" ");
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  const firstInitial = names[0].charAt(0).toUpperCase();
  const lastInitial = names[names.length - 1].charAt(0).toUpperCase();
  return firstInitial + lastInitial;
}

/**
 * Limits the length of a text to a maximum length.
 * If the text is longer than the specified maximum length, it is truncated and appended with "...".
 * @param {string} text - The text to be limited.
 * @param {number} [maxLength=20] - The maximum length of the text.
 * @returns {string} The processed text.
 */
function limitTextLength(text, maxLength = 15) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

/**
 * Waits for a specified amount of time.
 * This function returns a promise that resolves after the specified time.
 * @param {number} ms - The wait time in milliseconds.
 * @returns {Promise} A promise that resolves after the wait time.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


