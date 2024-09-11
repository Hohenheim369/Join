let contacts = [];
let initials = [];
let contactsCanBeAssigned = {
  firstname: [],
  lastname: [],
};
let currentContactIndex;

const BASE_TASKS_URL =
  "https://join-b72fb-default-rtdb.europe-west1.firebasedatabase.app/contacts";

document.addEventListener("DOMContentLoaded", () => {
  loadData(); // Stellen sicher, dass Daten geladen sind
});

function renderContacts() {
  const contactList = document.getElementById("contact_list");
  contactList.innerHTML = ""; // Clear previous contents

  // Load contacts from Firebase
  fetch(BASE_TASKS_URL + ".json")
    .then((response) => response.json())
    .then((data) => handleData(data, contactList))
    .catch((error) => {
      console.error("Error loading data:", error);
    });
}

function handleData(data, contactList) {
  if (data) {
    contacts = filterContacts(data);
    initials = generateInitials(contacts);
    const groupedContacts = groupContacts(contacts);

    const sortedInitials = Object.keys(groupedContacts).sort();
    sortedInitials.forEach((initial) => {
      const letterBoxHtml = generateLetterBox(initial);
      contactList.innerHTML += letterBoxHtml;
      addContactsToList(groupedContacts[initial], contactList);
    });
  } else {
    console.log("No contacts found.");
  }
}

function filterContacts(data) {
  return Object.values(data).filter((contact) => contact !== null);
}

function generateInitials(contacts) {
  return contacts.map((contact) => {
    let nameParts = contact.name.split(" ");
    return nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
  });
}

function groupContacts(contacts) {
  return contacts.reduce((acc, contact, index) => {
    let nameParts = contact.name.split(" ");
    let initials = nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
    let firstInitial = initials.charAt(0);

    if (!acc[firstInitial]) {
      acc[firstInitial] = [];
    }
    acc[firstInitial].push({ contact, initials, index });
    return acc;
  }, {});
}

function addContactsToList(contactGroup, contactList) {
  contactGroup.forEach(({ contact, initials, index }) => {
    const contactHtml = generateContact(contact, initials, index);
    contactList.innerHTML += contactHtml;
  });
}

// Funktion zum Berechnen und Speichern der Initialen
function updateInitials() {
  initials = contacts.map((contact) => {
    let nameParts = contact.name.split(" ");
    return nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

async function openDialogEdit(index) {
  const contact = contacts[index];
  const initials = getInitials(contact);

  updateCurrentContactIndex(index);
  showEditDialog();
  populateFormFields(contact, index);
  await sleep(10);
  finalizeDialog();

  updateBigLetterCircle(contact, initials);
}

function getInitials(contact) {
  const nameParts = contact.name.split(" ");
  return nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
}

function updateCurrentContactIndex(index) {
  currentContactIndex = index;
}

function showEditDialog() {
  const dialogContainer = document.getElementById("dialog_edit");
  dialogContainer.open = true;
  dialogContainer.classList.add("d-flex");
  document.getElementById("grey_background").classList.remove("hidden");
}

function populateFormFields(contact, index) {
  document.getElementById("inputEditName").value = contact.name;
  document.getElementById("inputEditEmail").value = contact.email;
  document.getElementById("inputEditPhone").value = contact.phone;
  document.getElementById("inputEditName").dataset.index = index;
  document.getElementById("inputEditEmail").dataset.index = index;
  document.getElementById("inputEditPhone").dataset.index = index;
}

function finalizeDialog() {
  const dialogContainer = document.getElementById("dialog_edit");
  dialogContainer.classList.add("dialog-open");
}

function updateBigLetterCircle(contact, initials) {
  document.getElementById("big_letter_circle").innerHTML =
    generateBigLetterCircle(contact, initials);
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

async function addContact() {
  const name = getInputValue("name");
  const email = getInputValue("email");
  const phone = getInputValue("phone");

  if (name && email && phone) {
    const newContact = createContact(name, email, phone);
    await saveContactToFirebase(newContact);
    updateLocalStorage(newContact);
    resetForm();
    renderContacts();
  } else {
    alert("Bitte füllen Sie alle Felder aus.");
  }
}

function getInputValue(id) {
  return document.getElementById(id).value;
}

function createContact(name, email, phone) {
  return {
    id: Date.now(),
    name: name,
    email: email,
    phone: phone,
    color: getRandomColor(),
    initials: name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .join(""),
  };
}

async function saveContactToFirebase(contact) {
  try {
    const response = await fetch(
      "https://join-b72fb-default-rtdb.europe-west1.firebasedatabase.app/contacts.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      }
    );

    if (response.ok) {
      console.log("Neuer Kontakt erfolgreich gespeichert.");
    } else {
      console.error("Fehler beim Speichern des Kontakts:", response.status);
    }
  } catch (error) {
    console.error("Fehler beim Speichern in Firebase:", error);
  }
}

function updateLocalStorage(contact) {
  contacts.push(contact);
  saveData(); // Falls du das auch lokal speichern möchtest
  storeFirstAndLastNames(); // Eventuell zusätzliche Verarbeitung
}

function resetForm() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function displayContactInfo(index) {
  const contact = contacts[index];
  let nameParts = contact.name.split(" ");
  let initials = nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
  const contactInfoDiv = document.querySelector(".contacts-info-box");
  contactInfoDiv.innerHTML = "";
  contactInfoDiv.innerHTML = generateContactInfo(contact, initials, index);
  document.getElementById("button_edit_dialog").innerHTML =
    generateDeleteButtonDialog(index);
  highlightContact(index);
}

// Funktion zum Löschen eines Kontakts
function deleteContact(index) {
  let contactToDelete = contacts[index];
  if (!contactToDelete) return; // Ensure the contact exists
  let contactId = index; // ID des zu löschenden Kontakts
  fetch(
    `https://join-b72fb-default-rtdb.europe-west1.firebasedatabase.app/contacts/${contactId}.json`,
    {
      method: "DELETE",
    }
  ).then((response) => {
    if (response.ok) {
      contacts.splice(index, 1); // Entferne den Kontakt aus dem Array
      saveData();
      storeFirstAndLastNames(); // Aktualisiere notwendige Daten
      renderContacts(); // Aktualisiere die Anzeige
      document.querySelector(".contacts-info-box").innerHTML = "";
    }
  });
}

function saveData() {
  fetch(BASE_TASKS_URL + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contacts),
  }).then((response) => response.json());
}

// Funktion zum Laden von Kontakten und Initialen aus dem localStorage
function loadData() {
  fetch(BASE_TASKS_URL + ".json")
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        contacts = Object.values(data).filter(
          (contact) => contact !== null && contact !== undefined
        );
        initials = contacts.map((contact) => contact.initials);
        storeFirstAndLastNames();
        renderContacts(); // Kontakte nach dem Laden rendern
      }
    });
}

function editContact() {
  const index = document.getElementById("inputEditName").dataset.index;
  const updatedName = document.getElementById("inputEditName").value;
  const updatedEmail = document.getElementById("inputEditEmail").value;
  const updatedPhone = document.getElementById("inputEditPhone").value;
  const updatedContact = {
    ...contacts[index],
    name: updatedName,
    email: updatedEmail,
    phone: updatedPhone,
  };
  contacts[index] = updatedContact;
  saveData();
  loadData();
  storeFirstAndLastNames();
  closeDialogEdit();
  displayContactInfo(index);
}

// der contact der getarget wurde der die bg c ändern soll //
function highlightContact(index) {
  const contacts = document.getElementsByClassName("contacts");
  for (let i = 0; i < contacts.length; i++) {
    contacts[i].style.backgroundColor = "";
    contacts[i].style.color = "black";
  }
  document.getElementById(`contact${index}`).style.backgroundColor = "#27364a";
  document.getElementById(`contact${index}`).style.color = "white";
}

// Setzt die Fehlermeldung in das entsprechende Div anstatt in das Input-Feld
function setError(inputElement, message, alertElementId) {
  const alertElement = document.getElementById(alertElementId);
  alertElement.innerText = message;
  alertElement.style.display = "block"; // Fehlermeldung sichtbar machen
  inputElement.classList.add("error");
}

// Entfernt die Fehlermeldung und versteckt das Div
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

async function validateForm() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const nameValid = validateInput(nameInput, /^[A-Za-zÄäÖöÜüß]+(\s+[A-Za-zÄäÖöÜüß]+){1,}$/, 
    "Ungültiger Name oder zu lang (mindestens zwei Wörter, max. 23 Zeichen)", 
    "field_alert_name", 23);
  const emailValid = validateInput(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
    "Ungültige E-Mail (test@test.de)", "field_alert_email");
  const phoneValid = validateInput(phoneInput, /^\d+$/, 
    "Ungültige Telefonnummer 0176 123 123", "field_alert_phone");
  if (nameValid && emailValid && phoneValid) {
    await addContact();
    closeDialog();
    await openDialogSuccessfully();
  }
}

function validateEditForm() {
  const nameInput = document.getElementById("inputEditName");
  const emailInput = document.getElementById("inputEditEmail");
  const phoneInput = document.getElementById("inputEditPhone");
  const nameValid = validateInput(nameInput, /^[A-Za-zÄäÖöÜüß]+(\s+[A-Za-zÄäÖöÜüß]+){1,}$/, 
    "Ungültiger Name oder zu lang (mindestens zwei Wörter, max. 23 Zeichen)", 
    "edit_field_alert_name", 23);
  const emailValid = validateInput(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
    "Ungültige E-Mail (test@test.de)", "edit_field_alert_email");
  const phoneValid = validateInput(phoneInput, /^\d+$/, 
    "Ungültige Telefonnummer 0176 123 123", "edit_field_alert_phone");
  if (nameValid && emailValid && phoneValid) {
    editContact();
  }
}


function storeFirstAndLastNames() {
  // Reset the storage arrays
  contactsCanBeAssigned.firstname = [];
  contactsCanBeAssigned.lastname = [];
  // Process each contact
  contacts.forEach((contact) => {
    let nameParts = contact.name.split(" ");
    if (nameParts.length > 1) {
      contactsCanBeAssigned.firstname.push(nameParts[0]);
      contactsCanBeAssigned.lastname.push(nameParts.slice(1).join(" "));
    } else {
      contactsCanBeAssigned.firstname.push(nameParts[0]);
      contactsCanBeAssigned.lastname.push("");
    }
  });
}

function truncate(text, maxLength = 20) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}
