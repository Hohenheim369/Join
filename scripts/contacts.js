/**
 * Event-Listener, der ausgelöst wird, sobald das HTML-Dokument vollständig geladen und analysiert ist.
 * Dieser Listener ruft die Funktion `renderContent()` auf, um die Kontaktliste anzuzeigen.
 */
document.addEventListener("DOMContentLoaded", () => {
  renderContent();
});

/**
 * Lädt und rendert den Inhalt der Kontaktliste.
 * Diese Funktion gruppiert die Kontakte nach ihren Initialen und zeigt sie anschließend in der Benutzeroberfläche an.
 */
async function renderContent() {
  const groupedContacts = await groupContacts();
  renderContactsList(groupedContacts);
}

/**
 * Gruppiert die Kontakte nach ihren Initialen.
 * Diese Funktion filtert die Kontakte des aktiven Benutzers und gruppiert sie basierend auf dem ersten Buchstaben
 * ihrer Initialen.
 * @returns {Object} Ein Objekt, das die Kontakte nach Initialen gruppiert enthält.
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
 * Filtert die Kontakte des aktuell aktiven Benutzers.
 * Diese Funktion lädt die Kontakte aus der Datenbank und filtert nur die, die zum aktiven Benutzer gehören.
 * @returns {Array} Eine Liste der gefilterten Kontakte des aktiven Benutzers.
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
 * Rendert die gruppierten Kontakte in der Kontaktliste.
 * Diese Funktion sortiert die Initialen, rendert für jede Initiale eine Buchstabenbox und zeigt die
 * dazugehörigen Kontakte an.
 * @param {Object} groupedContacts - Ein Objekt, das die Kontakte nach Initialen gruppiert enthält.
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
 * Initialisiert und zeigt die Informationen des aktiven Benutzers in der Kontaktliste an.
 * @param {HTMLElement} contactList - Das HTML-Element der Kontaktliste.
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
 * Sortiert die Initialen alphabetisch.
 * @param {Array} initials - Ein Array von Initialen.
 * @returns {Array} Das alphabetisch sortierte Array von Initialen.
 */
function sortInitials(initials) {
  return initials.sort();
}

/**
 * Rendert alle Kontakte, die zu einer bestimmten Initiale gehören.
 * @param {Array} contacts - Die Kontakte, die unter einer bestimmten Initiale gruppiert sind.
 * @param {HTMLElement} contactList - Das HTML-Element der Kontaktliste.
 */
function renderContactsByInitial(contacts, contactList) {
  contacts.forEach(({ contact }) => {
    const contactHtml = generateContact(contact);
    contactList.innerHTML += contactHtml;
  });
}

/**
 * Initialisiert eine Buchstabenbox in der Kontaktliste.
 * @param {string} initial - Der Anfangsbuchstabe der Initialen.
 * @param {HTMLElement} contactList - Das HTML-Element der Kontaktliste.
 */
function initLetterBox(initial, contactList) {
  const letterBoxHtml = generateLetterBox(initial);
  contactList.innerHTML += letterBoxHtml;
}

/**
 * Fügt einen neuen Kontakt hinzu und aktualisiert die Benutzeroberfläche.
 * Diese Funktion erstellt einen neuen Kontakt, fügt ihn dem aktiven Benutzer hinzu und rendert die
 * aktualisierte Kontaktliste.
 */
async function addContact() {
  const contactId = await postNewContact();
  addContactToUser(contactId, activeUser);
  addContactToUserLocal(contactId, activeUser);
  closeDialog();
  await openDialogSuccessfully();
  clearForm();
  renderContent();
}

/**
 * Postet einen neuen Kontakt in die Datenbank und gibt die Kontakt-ID zurück.
 * @returns {number} Die ID des neu erstellten Kontakts.
 */
async function postNewContact() {
  const name = getInputValue("name");
  const email = getInputValue("email");
  const phone = getInputValue("phone");
  if (!name || !email) return;
  const contactId = await getNewId("contacts");
  const contactData = createContact(name, email, phone, contactId);
  await postData(`contacts/${contactId - 1}/`, contactData);
  return contactId;
}

/**
 * Erstellt ein Kontaktobjekt mit den übergebenen Daten.
 * @param {string} name - Der Name des Kontakts.
 * @param {string} email - Die E-Mail-Adresse des Kontakts.
 * @param {string} phone - Die Telefonnummer des Kontakts.
 * @param {number} contactId - Die ID des Kontakts.
 * @returns {Object} Das erstellte Kontaktobjekt.
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
 * Fügt einen Kontakt dem Benutzer hinzu und speichert ihn in der Datenbank.
 * Diese Funktion überprüft, ob der Benutzer den Kontakt bereits hat, und fügt ihn hinzu, wenn er nicht existiert.
 * @param {number} contactId - Die ID des hinzuzufügenden Kontakts.
 * @param {Object} activeUser - Der aktuell angemeldete Benutzer.
 */
async function addContactToUser(contactId, activeUser) {
  const user = await searchForUser(activeUser.id); 
  if (user && !user.contacts.includes(contactId)) {
    user.contacts.push(contactId); 
    await postData(`users/${user.id - 1}/`, { ...user }); 
  }
}

/**
 * Fügt einen Kontakt zum lokalen Speicher des aktiven Benutzers hinzu.
 * Diese Funktion aktualisiert die Liste der Kontakte des Benutzers im Local Storage.
 * @param {number} contactId - Die ID des hinzuzufügenden Kontakts.
 */
function addContactToUserLocal(contactId) {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  activeUser.contacts.push(contactId);
  localStorage.setItem("activeUser", JSON.stringify(activeUser));
}

/**
 * Generiert eine zufällige Farbe in einem dunklen Farbton.
 * @returns {string} Ein Hexadezimal-Farbcode.
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
 * Zeigt die Informationen eines Kontakts auf dem Desktop an.
 * Diese Funktion lädt die Kontaktdaten und zeigt sie im Kontakt-Info-Bereich an.
 * Wenn der Bildschirm schmaler als 777px ist, wird stattdessen die mobile Ansicht angezeigt.
 * @param {number} contactId - Die ID des Kontakts, dessen Informationen angezeigt werden sollen.
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
    document
      .getElementById("for_active_user")
      .classList.add("letter-circel-user");
  }
  highlightContact(contact);
}

/**
 * Ruft die Kontaktdaten anhand der Kontakt-ID ab.
 * Diese Funktion unterscheidet zwischen dem aktiven Benutzer und einem regulären Kontakt.
 * @param {number} contactId - Die ID des Kontakts, der abgerufen werden soll.
 * @returns {Object} Die Daten des Kontakts.
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
 * Hebt den aktuell ausgewählten Kontakt in der Kontaktliste hervor.
 * Diese Funktion setzt die Hintergrundfarbe des ausgewählten Kontakts und hebt ihn optisch hervor.
 * @param {Object} contact - Der Kontakt, der hervorgehoben werden soll.
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
 * Löscht einen Kontakt, wenn die Kontakt-ID nicht 0 ist.
 * Diese Funktion überprüft, ob die Kontakt-ID 0 ist (was bedeutet, dass der aktive Benutzer nicht gelöscht werden kann).
 * Sie löscht den Kontakt und aktualisiert die Anzeige der Kontakte.
 * @param {number} contactId - Die ID des zu löschenden Kontakts.
 */
async function deleteContact(contactId) {
  if (contactId === 0) {
    alert("user can't be deletet by this way");
    return;
  }
  await deleteContactInData(contactId);
  await renderContent();
  document.querySelector(".contacts-info-box").innerHTML = "";
  if (window.innerWidth < 777) {
    document.getElementById("mobile_menu").classList.remove("d-flex");
    goBackMobile();
  }
}

/**
 * Löscht einen Kontakt aus den Benutzerdaten.
 * Diese Funktion bestimmt, ob der Kontakt nur für den Benutzer oder für alle Benutzer gelöscht werden soll,
 * und führt die entsprechenden Löschvorgänge durch.
 * @param {number} contactId - Die ID des zu löschenden Kontakts.
 */
async function deleteContactInData(contactId) {
  let users = await fetchData("users");
  if (contactId >= 1 && contactId <= 10) {
    await deleteContactOnlyforUser(contactId, users);
  } else {
    await deleteContactforAllUsers(contactId, users);
  }
  await deleteContactFromTasks(contactId);
  deleteContactInLocalStorage(contactId);
}

/**
 * Löscht einen Kontakt nur für den aktiven Benutzer.
 * Diese Funktion entfernt den Kontakt aus der Kontaktliste des aktiven Benutzers.
 * @param {number} contactId - Die ID des zu löschenden Kontakts.
 * @param {Array} users - Die Liste aller Benutzer.
 */
async function deleteContactOnlyforUser(contactId, users) {
  if (activeUser.id === 0) {
    return;
  }
  users = users.map((user) => {
    if (user.id === activeUser.id) {
      return {
        ...user,
        contacts: user.contacts.filter((contact) => contact !== contactId),
      };
    }
    return user;
  });
  await postData("users", users);
}

/**
 * Löscht einen Kontakt aus allen Aufgaben.
 * Diese Funktion entfernt die Kontakt-ID aus der Liste der zugewiesenen Benutzer für alle Aufgaben.
 * @param {number} contactId - Die ID des zu löschenden Kontakts.
 */
async function deleteContactFromTasks(contactId) {
  const allTasks = await fetchData("tasks");
  const updatedTasks = allTasks.map((task) => {
    if (task.assigned && Array.isArray(task.assigned)) {
      return {
        ...task,
        assigned: task.assigned.filter((id) => id !== contactId),
      };
    }
    return task;
  });
  await postData("tasks", updatedTasks);
}

/**
 * Löscht einen Kontakt für alle Benutzer.
 * Diese Funktion löscht den Kontakt aus der Datenbank und entfernt ihn aus den Kontaktlisten aller Benutzer.
 * @param {number} contactId - Die ID des zu löschenden Kontakts.
 * @param {Array} users - Die Liste aller Benutzer.
 */
async function deleteContactforAllUsers(contactId, users) {
  await deleteData("contacts", contactId);
  if (activeUser.id === 0) {
    return;
  }
  users = users.map((user) => ({
    ...user,
    contacts: user.contacts.filter((contact) => contact !== contactId),
  }));
  await postData("users", users);
}

/**
 * Löscht einen Kontakt aus dem lokalen Speicher des aktiven Benutzers.
 * Diese Funktion entfernt die Kontakt-ID aus der Liste der Kontakte im Local Storage.
 * @param {number} contactId - Die ID des zu löschenden Kontakts.
 */
function deleteContactInLocalStorage(contactId) {
  let activeUser = JSON.parse(localStorage.getItem("activeUser"));
  activeUser.contacts = activeUser.contacts.filter(
    (contact) => contact !== contactId
  );
  localStorage.setItem("activeUser", JSON.stringify(activeUser));
}

/**
 * Gibt die Initialen eines Namens zurück.
 * Diese Funktion extrahiert die ersten Buchstaben aus dem Namen und gibt sie als Initialen zurück.
 * @param {string} name - Der Name, aus dem die Initialen extrahiert werden sollen.
 * @returns {string} Die Initialen des Namens.
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
 * Beschränkt die Länge eines Textes auf eine maximale Länge.
 * Wenn der Text länger ist als die angegebene maximale Länge, wird er abgeschnitten und mit "..." ergänzt.
 * @param {string} text - Der zu begrenzende Text.
 * @param {number} [maxLength=20] - Die maximale Länge des Textes.
 * @returns {string} Der bearbeitete Text.
 */
function limitTextLength(text, maxLength = 20) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

/**
 * Wartet für eine bestimmte Zeit.
 * Diese Funktion gibt ein Promise zurück, das nach der angegebenen Zeit aufgelöst wird.
 * @param {number} ms - Die Wartezeit in Millisekunden.
 * @returns {Promise} Ein Promise, das nach der Wartezeit aufgelöst wird.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Sucht nach einem Kontakt anhand seiner ID.
 * Diese Funktion gibt die Kontaktdaten zurück, die der angegebenen Kontakt-ID entsprechen.
 * @param {number} contactId - Die ID des gesuchten Kontakts.
 * @returns {Object} Der gefundene Kontakt.
 */
async function searchForContact(contactId) {
  const data = await fetchData("contacts");
  const contacts = Object.values(data);
  const contact = contacts.find((c) => c && c.id === contactId);
  return contact;
}

/**
 * Sucht nach einem Benutzer anhand seiner ID.
 * Diese Funktion gibt die Benutzerdaten zurück, die der angegebenen Benutzer-ID entsprechen.
 * @param {number} contactId - Die ID des gesuchten Benutzers.
 * @returns {Object} Der gefundene Benutzer.
 */
async function searchForUser(contactId) {
  const data = await fetchData("users");
  const contacts = Object.values(data);
  const contact = contacts.find((c) => c && c.id === contactId);
  return contact;
}
