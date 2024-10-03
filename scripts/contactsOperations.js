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
