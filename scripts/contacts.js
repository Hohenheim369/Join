const BASE_TASKS_URL =
  "https://join-b72fb-default-rtdb.europe-west1.firebasedatabase.app/contacts";

async function fetchContactsFromFirebase() {
  const response = await fetch(BASE_TASKS_URL + ".json");
  const data = await response.json();
  return data;
}

document.addEventListener("DOMContentLoaded", () => {
  renderContent(); // Stellen sicher, dass Daten geladen sind
});

async function renderContent() {
  const contactList = document.getElementById("contact_list");
  contactList.innerHTML = ""; // Vorherigen Inhalt löschen
  const data = await fetchContactsFromFirebase(); // Daten von Firebase abrufen
  const contacts = Object.values(data);
  const groupedContacts = groupContacts(contacts); // Kontakte nach Initialen gruppieren
  renderContactsList(groupedContacts, contactList); // Kontaktliste rendern
}

function renderContactsList(groupedContacts, contactList) {
  const sortedInitials = Object.keys(groupedContacts).sort(); // Initialen alphabetisch sortieren
  sortedInitials.forEach((initial) => {
    renderLetterBox(initial, contactList); // Buchstaben-Box für Initiale rendern
    groupedContacts[initial].forEach(({ contact, index }) => {
      const contactHtml = generateContact(contact); // Kontakt-HTML generieren
      contactList.innerHTML += contactHtml; // Kontakt zum DOM hinzufügen
    });
  });
}

function renderLetterBox(initial, contactList) {
  const letterBoxHtml = generateLetterBox(initial);
  contactList.innerHTML += letterBoxHtml;
}

function groupContacts(contacts) {
  return contacts.reduce((acc, contact, index) => {
    let firstInitial = contact.initials.charAt(0).toUpperCase(); // Verwende die gespeicherten Initialen
    if (!acc[firstInitial]) {
      acc[firstInitial] = [];
    }
    acc[firstInitial].push({ contact, initials: contact.initials, index });
    return acc;
  }, {});
}

function addContactsToList(contactGroup, contactList) {
  contactGroup.forEach(({ contact, initials, index }) => {
    const contactHtml = generateContact(contact);
    contactList.innerHTML += contactHtml;
  });
}

async function validateForm() {
  const nameValid = validateInput(
    document.getElementById("name"),
    /^[A-Za-zÄäÖöÜüß]+(\s+[A-Za-zÄäÖöÜüß]+){1,}$/,
    "(min. two words, max. 23 chars)",
    "field_alert_name",
    23
  );
  const emailValid = validateInput(
    document.getElementById("email"),
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    "Invalid email (test@test.de)",
    "field_alert_email"
  );
  if (nameValid && emailValid) {
    await addContact();
    closeDialog();
    await openDialogSuccessfully();
  }
}

async function validateEditForm(contactId) {
  const inputs = [
    {
      id: "inputEditName",
      regex: /^[A-Za-zÄäÖöÜüß]+(\s+[A-Za-zÄäÖöÜüß]+){1,}$/,
      alert: "edit_field_alert_name",
      message: "(min. two words, max. 23 chars)",
      maxLength: 23,
    },
    {
      id: "inputEditEmail",
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      alert: "edit_field_alert_email",
      message: "Invalid email (test@test.de)",
    },
  ];
  const valid = inputs.every(({ id, regex, alert, message, maxLength }) =>
    validateInput(document.getElementById(id), regex, message, alert, maxLength)
  );
  if (valid) editContact(contactId);
}

async function addContact() {
  const name = getInputValue("name");
  const email = getInputValue("email");
  const phone = getInputValue("phone");

  if (name && email && phone) {
    const newContact = createContact(name, email, phone);
    await addContactToFirebase(newContact);
    resetForm();
    renderContent();
  } else {
    alert("Bitte füllen Sie alle Felder aus.");
  }
}

function createContact(name, email, phone) {
  return {
    id: Date.now(),
    name: name,
    email: email,
    phone: phone,
    color: getRandomColor(),
    initials: calculateInitials(name),
  };
}

function getRandomColor() {
  const darkLetters = "0123456789ABC"; // Beschränke auf dunklere Farbtöne
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += darkLetters[Math.floor(Math.random() * darkLetters.length)];
  }
  return color;
}

async function addContactToFirebase(contact) {
  const response = await fetch(`${BASE_TASKS_URL}/${contact.id}.json`, {
    method: "PUT", // Verwende PUT, um ein bestimmtes Objekt zu aktualisieren oder hinzuzufügen
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  });
  const data = await response.json();
}

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

async function displayContactInfo(contactId) {
  // Daten von Firebase abrufen
  const data = await fetchContactsFromFirebase();
  // Finde den Kontakt mit der übergebenen ID
  const contacts = Object.values(data);
  const contact = contacts.find((c) => c.id === contactId);
  const contactInfoDiv = document.querySelector(".contacts-info-box");
  contactInfoDiv.innerHTML = ""; // Vorherigen Inhalt leeren
  contactInfoDiv.innerHTML = generateContactInfo(contact); // Kontaktdetails anzeigen
  document.getElementById("button_edit_dialog").innerHTML =
    generateDeleteButtonDialog(contact); // Löschen-Button anzeigen
  highlightContact(contact); // Kontakt hervorheben
}

async function deleteContact(contactId) {
  // Lösche den Kontakt von Firebase
  const response = await fetch(`${BASE_TASKS_URL}/${contactId}.json`, {
    method: "DELETE",
  });
  // Aktualisiere die Kontaktliste nach dem Löschen
  await renderContent(); // Render die aktualisierte Kontaktliste
  document.querySelector(".contacts-info-box").innerHTML = ""; // Leere die Detailansicht
}

async function openDialog() {
  const dialogContainer = document.getElementById("dialog_contacts");
  dialogContainer.open = true;
  dialogContainer.classList.add("d-flex");
  await sleep(10);
  dialogContainer.classList.add("dialog-open");
  document.getElementById("grey_background").classList.remove("hidden");
}

async function closeDialog() {
  const dialogContainer = document.getElementById("dialog_contacts");
  dialogContainer.classList.remove("dialog-open");
  document.getElementById("grey_background").classList.add("hidden");
  await sleep(300);
  dialogContainer.classList.remove("d-flex");
  dialogContainer.open = false;
  clearForm();
}

async function openDialogEdit(contactId) {
  const dialogContainer = document.getElementById("dialog_edit");
  dialogContainer.open = true;
  dialogContainer.classList.add("d-flex");
  document.getElementById("grey_background").classList.remove("hidden");
  const response = await fetch(`${BASE_TASKS_URL}/${contactId}.json`);
  const contact = await response.json();
  populateFormFields(contact);
  await sleep(10);
  dialogContainer.classList.add("dialog-open");
  updateBigLetterCircle(contact);
}

function populateFormFields(contact) {
  document.getElementById("inputEditName").value = contact.name;
  document.getElementById("inputEditEmail").value = contact.email;
  document.getElementById("inputEditPhone").value = contact.phone;
}

function updateBigLetterCircle(contact) {
  document.getElementById("big_letter_circle").innerHTML =
    generateBigLetterCircle(contact);
}

async function editContact(contactId) {
  const response = await fetch(`${BASE_TASKS_URL}/${contactId}.json`);
  const existingContact = await response.json();
  const updatedName = document.getElementById("inputEditName").value;
  const updatedEmail = document.getElementById("inputEditEmail").value;
  const updatedPhone = document.getElementById("inputEditPhone").value;
  const updatedInitials = calculateInitials(updatedName);
  const updatedContact = {
    ...existingContact, // Behalte die bestehenden Werte
    name: updatedName,
    email: updatedEmail,
    phone: updatedPhone,
    initials: updatedInitials,
  };
  await addContactToFirebase(updatedContact);
  closeDialogEdit();
  await renderContent();
  displayContactInfo(contactId);
}

function calculateInitials(name) {
  const names = name.split(" "); // Den Namen in Wörter aufteilen
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase(); // Wenn es nur ein Wort gibt, nimm den ersten Buchstaben
  }
  const firstInitial = names[0].charAt(0).toUpperCase(); // Erster Buchstabe des ersten Wortes
  const lastInitial = names[names.length - 1].charAt(0).toUpperCase(); // Erster Buchstabe des letzten Wortes
  return firstInitial + lastInitial; // Initialen zurückgeben
}

async function closeDialogEdit() {
  const dialogContainer = document.getElementById("dialog_edit");
  dialogContainer.classList.remove("dialog-open");
  document.getElementById("grey_background").classList.add("hidden");
  await sleep(300);
  dialogContainer.classList.remove("d-flex");
  dialogContainer.open = false;
  clearEditForm();
}

async function openDialogSuccessfully() {
  const dialogContainer = document.getElementById("succesfully_created");
  // Verzögerung von 1 Sekunde, bevor der Dialog angezeigt wird
  setTimeout(async () => {
    dialogContainer.open = true;
    await sleep(300);
    dialogContainer.classList.add("dialog-open");
    dialogContainer.classList.add("d-flex");
    await sleep(1000); // 2000 Millisekunden = 2 Sekunden
    dialogContainer.classList.remove("dialog-open");
    await sleep(300); // Kleine Verzögerung für die Animation
    dialogContainer.classList.remove("d-flex");
    dialogContainer.open = false;
  }, 300); // 1000 Millisekunden = 1 Sekunde
}

function getInputValue(id) {
  return document.getElementById(id).value;
}

function resetForm() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
}

function setError(inputElement, message, alertElementId) {
  const alertElement = document.getElementById(alertElementId);
  alertElement.innerText = message;
  alertElement.style.display = "block"; // Fehlermeldung sichtbar machen
  inputElement.classList.add("error");
}

function clearError(inputElement, alertElementId) {
  const alertElement = document.getElementById(alertElementId);
  alertElement.innerText = "";
  alertElement.style.display = "none"; // Fehlermeldung verstecken
  inputElement.classList.remove("error");
}

function clearForm() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  nameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
  clearError(nameInput, "field_alert_name");
  clearError(emailInput, "field_alert_email");
  clearError(phoneInput, "field_alert_phone");
}

function clearEditForm() {
  const nameEditInput = document.getElementById("inputEditName");
  const emailEditInput = document.getElementById("inputEditEmail");
  const phoneEditInput = document.getElementById("inputEditPhone");
  clearError(nameEditInput, "edit_field_alert_name");
  clearError(emailEditInput, "edit_field_alert_email");
  clearError(phoneEditInput, "edit_field_alert_phone");
}

function validateInput(input, regex, errorMsg, errorId, maxLength) {
  const valid = maxLength
    ? input.value.match(regex) && input.value.length <= maxLength
    : input.value.match(regex);
  if (!valid) {
    setError(input, errorMsg, errorId);
    input.value = "";
  } else {
    clearError(input, errorId);
  }
  return valid;
}

function truncate(text, maxLength = 20) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
