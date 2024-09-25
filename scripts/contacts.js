const BASE_CONTACTS_URL =
  "https://join-b72fb-default-rtdb.europe-west1.firebasedatabase.app/contacts";

document.addEventListener("DOMContentLoaded", () => {
  renderContent(); // Stellen sicher, dass Daten geladen sind
});

async function renderContent() {
  const contactList = document.getElementById("contact_list");
  contactList.innerHTML = ""; // Vorherigen Inhalt löschen
  const data = await fetchData("contacts");
  if (data === null) {
  } else {
    const contacts = Object.values(data);
    const groupedContacts = groupContacts(contacts); // Kontakte nach Initialen gruppieren
    renderContactsList(groupedContacts, contactList); // Kontaktliste rendern
  }
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
    if (contact && contact.initials) {
      let firstInitial = contact.initials.charAt(0).toUpperCase(); // Verwende die gespeicherten Initialen
      if (!acc[firstInitial]) {
        acc[firstInitial] = [];
      }
      acc[firstInitial].push({ contact, initials: contact.initials, index });
    }
    return acc;
  }, {});
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
    const contactId = await getNewId("contacts");
    const contactData = createContact(name, email, phone, contactId);
    await postData(`contacts/${contactId - 1}/`, contactData);
    resetForm();
    renderContent();
  } else {
    alert("Bitte füllen Sie alle Felder aus.");
  }
}

function createContact(name, email, phone, contactId) {
  return {
    id: contactId,
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
  // Prüfen, ob die Bildschirmbreite kleiner oder gleich 777px ist
  if (window.innerWidth <= 777) {
    // Wenn ja, die mobile Funktion ausführen
    return displayContactInfoMobile(contactId);
  }
  // Andernfalls die reguläre Logik ausführen
  const data = await fetchData("contacts");
  const contacts = Object.values(data);
  const numericContactId =
    typeof contactId === "string" ? parseInt(contactId) : contactId;
  const contact = contacts.find((c) => c && c.id === numericContactId);
  const contactInfoDiv = document.querySelector(".contacts-info-box");
  contactInfoDiv.innerHTML = ""; // Vorherigen Inhalt leeren
  contactInfoDiv.innerHTML = generateContactInfo(contact); // Kontaktdetails anzeigen
  document.getElementById("button_edit_dialog").innerHTML =
    generateDeleteButtonDialog(contact); // Löschen-Button anzeigen
  highlightContact(contact); // Kontakt hervorheben
}

async function displayContactInfoMobile(contactId) {
  // Daten von Firebase abrufen
  document.getElementById("mobile_contact_info").classList.remove("d-none");
  document.getElementById("mobile_contact_info").classList.add("pos-abs");
  const data = await fetchData("contacts");
  const contacts = Object.values(data);
  const numericContactId =
    typeof contactId === "string" ? parseInt(contactId) : contactId;
  const contact = contacts.find((c) => c && c.id === numericContactId);
  const contactInfoDiv = document.querySelector(".mobile-contacts-info-box");
  contactInfoDiv.innerHTML = ""; // Vorherigen Inhalt leeren
  contactInfoDiv.innerHTML = generateContactInfo(contact); // Kontaktdetails anzeigen
  document.getElementById("button_edit_dialog").innerHTML =
    generateDeleteButtonDialog(contact); // Löschen-Button anzeigen
  highlightContact(contact); // Kontakt hervorheben
  mobileEditContact();
  const menu = document.getElementById("mobile_menu");
  const htmlString = ` <img onclick="openDialogEdit(${contact.id})" class="mobile-edit-img" src="../assets/img/png/edit-default.png" alt="edit">
      <img onclick="deleteContact(${contact.id})" class="mobile-delete-img" src="../assets/img/png/delete-default.png" alt="delete"></img>`;
  menu.innerHTML = htmlString;
}

function mobileEditContact() {
  const contactMobileButton = document.querySelector(
    ".contact-box-edit-delete"
  );
  contactMobileButton.classList.add("d-none");
}

async function deleteContact(contactId) {
  // Lösche den Kontakt von Firebase
  await fetch(`${BASE_URL}/contacts/${contactId - 1}/.json`, {
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
  const menu = document.getElementById("mobile_menu");
   // Überprüfen, ob das mobile Menü geöffnet ist (d.h. die Klasse 'd-flex' hat)
   if (menu.classList.contains("d-flex")) {
    menu.classList.remove("d-flex"); // Mobile Menü schließen
  }
  const dialogContainer = document.getElementById("dialog_edit");
  dialogContainer.open = true;
  dialogContainer.classList.add("d-flex");
  document.getElementById("grey_background").classList.remove("hidden");
  const contact = await fetchData(`contacts/${contactId - 1}/`);
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
  const existingContact = await fetchData(`contacts/${contactId - 1}/`);
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
  await postData(`contacts/${contactId - 1}/`, updatedContact);
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

// Funktion, um das cross im dialog, beim responsiv zu ändern
function updateCrossImage() {
  const imgElements = document.querySelectorAll(".cross");

  // Über alle Bild-Elemente mit der Klasse 'cross' iterieren
  imgElements.forEach((imgElement) => {
    // Überprüfen der Fensterbreite
    if (window.innerWidth < 1024) {
      imgElement.src = "../assets/img/png/close-white.png"; // Kleineres Bild
    } else {
      imgElement.src = "../assets/img/png/close.png"; // Größeres Bild
    }
  });
}

// Initiale Ausführung beim Laden der Seite
window.addEventListener("load", updateCrossImage);

// Bild bei jeder Fenstergrößenänderung aktualisieren
window.addEventListener("resize", updateCrossImage);

function goBackMobile() {
  document.getElementById("mobile_contact_info").classList.add("d-none");
  document.getElementById("mobile_contact_info").classList.remove("pos-abs");
  const contactInfoDiv = document.querySelector(".mobile-contacts-info-box");
  contactInfoDiv.innerHTML = ""; // Vorherigen Inhalt leeren
}

function openMobileMenu(contactId) {
  const menu = document.getElementById("mobile_menu");
  
  // Menü einblenden
  menu.classList.add("d-flex");

  // Event-Listener hinzufügen, um das Menü bei einem Klick außerhalb zu schließen
  const handleClickOutside = (event) => {
    if (!menu.contains(event.target)) { // Prüfen, ob der Klick außerhalb des Menüs war
      menu.classList.remove("d-flex"); // Menü ausblenden
      document.removeEventListener("click", handleClickOutside); // Event-Listener entfernen
    }
  };

  // Event-Listener nur einmal hinzufügen
  setTimeout(() => {
    document.addEventListener("click", handleClickOutside);
  }, 0);
}
