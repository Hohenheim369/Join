let contacts = [];
let initials = [];

const BASE_TASKS_URL =
  "https://join-b72fb-default-rtdb.europe-west1.firebasedatabase.app/contacts/";

// Funktion zum Rendern der gesamten Kontaktliste
function renderContacts() {
  const contactList = document.getElementById("contact_list");
  contactList.innerHTML = ""; // Clear previous contents

  // Load contacts from Firebase
  fetch(BASE_TASKS_URL + ".json")
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        // Convert contacts to an array
        contacts = Object.values(data);

        // Update initials array
        initials = contacts.map((contact) => {
          let nameParts = contact.name.split(" ");
          return nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
        });

        // Group contacts by initials
        const groupedContacts = contacts.reduce((acc, contact, index) => {
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

        // Alphabetical order of initials
        const sortedInitials = Object.keys(groupedContacts).sort();

        // Generate HTML for each group of initials
        sortedInitials.forEach((initial) => {
          // Add letter-box for initials
          contactList.innerHTML += generateLetterBox(initial);

          // Add contacts for these initials
          groupedContacts[initial].forEach(({ contact, initials, index }) => {
            contactList.innerHTML += generateContact(contact, initials, index);
          });
        });
      } else {
        console.log("No contacts found.");
      }
    })
    .catch((error) => {
      console.error("Error loading data:", error);
    });
}

// Funktion zum Berechnen und Speichern der Initialen
function updateInitials() {
  initials = contacts.map(contact => {
      let nameParts = contact.name.split(' ');
      return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  });

  // Initialen im localStorage speichern
  localStorage.setItem('initials', JSON.stringify(initials));
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
}

async function openDialogEdit(index) {
  const contact = contacts[index];
  let nameParts = contact.name.split(" ");
  let initials = nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
  currentContactIndex = index;
  const dialogContainer = document.getElementById("dialog_edit");
  dialogContainer.open = true;
  dialogContainer.classList.add("d-flex");
  document.getElementById("grey_background").classList.remove("hidden");
  document.getElementById("inputEditName").value = contact.name;
  document.getElementById("inputEditEmail").value = contact.email;
  document.getElementById("inputEditPhone").value = contact.phone;
  document.getElementById("inputEditName").dataset.index = index;
  document.getElementById("inputEditEmail").dataset.index = index;
  document.getElementById("inputEditPhone").dataset.index = index;
  await sleep(10);
  dialogContainer.classList.add("dialog-open");
  
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
}

async function openDialogSuccesfully() {
  const dialogContainer = document.getElementById("succesfully_created");

  // Verzögerung von 1 Sekunde, bevor der Dialog angezeigt wird
  setTimeout(async () => {
    // Dialog anzeigen
    dialogContainer.open = true;
    await sleep(300);
    dialogContainer.classList.add("dialog-open");
    dialogContainer.classList.add("d-flex");

    // Verzögerung von 2 Sekunden, bevor der Dialog ausgeblendet wird
    await sleep(1000); // 2000 Millisekunden = 2 Sekunden

    // Dialog wieder ausblenden
    dialogContainer.classList.remove("dialog-open");
    await sleep(300); // Kleine Verzögerung für die Animation
    dialogContainer.classList.remove("d-flex");
    dialogContainer.open = false;
  }, 300); // 1000 Millisekunden = 1 Sekunde
}

// Funktion zum Hinzufügen eines Kontakts
// function addContact() {
//   let name = document.getElementById("name").value;
//   let email = document.getElementById("email").value;
//   let phone = document.getElementById("phone").value;

//   if (name && email && phone) {
//     let newId = Date.now(); // Zeitstempel als eindeutige ID

//     let newContact = {
//       id: newId,
//       name: name,
//       email: email,
//       phone: phone,
//       color: getRandomColor(), // Zufällige Farbe zuweisen
//       initials: name
//         .split(" ")
//         .map((part) => part.charAt(0).toUpperCase())
//         .join(""), // Initialen berechnen
//     };

//     contacts.push(newContact);
//     saveData(); // Kontakte speichern
//     storeFirstAndLastNames();

//     // Formular zurücksetzen
//     document.getElementById("name").value = "";
//     document.getElementById("email").value = "";
//     document.getElementById("phone").value = "";
//     renderContacts();
//     // Kontaktliste neu rendern
//   } else {
//     alert("Bitte füllen Sie alle Felder aus.");
//   }
// }

async function addContact() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;

  if (name && email && phone) {
    let newId = Date.now(); // Zeitstempel als eindeutige ID

    let newContact = {
      id: newId,
      name: name,
      email: email,
      phone: phone,
      color: getRandomColor(), // Zufällige Farbe zuweisen
      initials: name
        .split(" ")
        .map((part) => part.charAt(0).toUpperCase())
        .join(""), // Initialen berechnen
    };

    // Kontakt zur Firebase-Datenbank hinzufügen
    try {
      const response = await fetch(
        'https://join-b72fb-default-rtdb.europe-west1.firebasedatabase.app/contacts.json',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newContact),
        }
      );

      if (response.ok) {
        console.log('Neuer Kontakt erfolgreich gespeichert.');
      } else {
        console.error('Fehler beim Speichern des Kontakts:', response.status);
      }
    } catch (error) {
      console.error('Fehler beim Speichern in Firebase:', error);
    }

    // Kontakt lokal in einem Array speichern (optional, falls du das Array auch lokal brauchst)
    contacts.push(newContact);
    saveData(); // Falls du das auch lokal speichern möchtest
    storeFirstAndLastNames(); // Eventuell zusätzliche Verarbeitung

    // Formular zurücksetzen
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    renderContacts(); // Kontaktliste neu rendern
  } else {
    alert("Bitte füllen Sie alle Felder aus.");
  }
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

  let contactId = contactToDelete.id; // ID of the contact to delete

  console.log(`Attempting to delete contact with ID ${contactId}`);

  fetch(`${BASE_TASKS_URL}/${contactId}.json`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        contacts.splice(index, 1); // Remove the contact from the array
        storeFirstAndLastNames(); // Update any necessary data
        renderContacts(); // Update the display
        document.querySelector(".contacts-info-box").innerHTML = "";
        console.log("Contact successfully deleted");
      } else {
        console.error("Error deleting contact:", response.statusText);
      }
    })
    .catch((error) => {
      console.error("Error deleting contact:", error);
    });
}

function saveData() {
  fetch(BASE_TASKS_URL + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contacts),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Daten erfolgreich gespeichert:", data);
    })
    .catch((error) => {
      console.error("Fehler beim Speichern der Daten:", error);
    });
}

// Funktion zum Laden von Kontakten und Initialen aus dem localStorage
function loadData() {
  fetch(BASE_TASKS_URL + ".json")
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        contacts = Object.values(data);
        initials = contacts.map((contact) => contact.initials);
        storeFirstAndLastNames();
        renderContacts(); // Kontakte nach dem Laden rendern
      } else {
        console.log("Keine Kontakte gefunden.");
      }
    })
    .catch((error) => {
      console.error("Fehler beim Laden der Daten:", error);
    });
}

function editContact() {
  // Hole den Index aus dem data-Attribut des Eingabefeldes
  const index = document.getElementById("inputEditName").dataset.index;

  // Hol die aktualisierten Werte aus den Eingabefeldern
  const updatedName = document.getElementById("inputEditName").value;
  const updatedEmail = document.getElementById("inputEditEmail").value;
  const updatedPhone = document.getElementById("inputEditPhone").value;

  // Erstelle ein neues Kontaktobjekt mit den aktualisierten Werten
  const updatedContact = {
    ...contacts[index],
    name: updatedName,
    email: updatedEmail,
    phone: updatedPhone,
  };

  // Ersetze das alte Kontaktobjekt in der Array durch das aktualisierte
  contacts[index] = updatedContact;

  // Speichere die aktualisierten Daten in localStorage
  localStorage.setItem("contacts", JSON.stringify(contacts));
  storeFirstAndLastNames();
  renderContacts();
  closeDialogEdit();
  displayContactInfo(index);
}

document.addEventListener("DOMContentLoaded", () => {
  loadData(); // Stellen sicher, dass Daten geladen sind
});

function highlightContact(index) {
  const contacts = document.getElementsByClassName("contacts");
  for (let i = 0; i < contacts.length; i++) {
    contacts[i].style.backgroundColor = "";
    contacts[i].style.color = "black";
  }
  document.getElementById(`contact${index}`).style.backgroundColor =
    "var(--gray)";
  document.getElementById(`contact${index}`).style.color = "white";
}

function setError(inputElement, message) {
  inputElement.dataset.originalPlaceholder = inputElement.placeholder;
  inputElement.placeholder = message;
  inputElement.classList.add("error");
}

function clearError(inputElement) {
  if (inputElement.dataset.originalPlaceholder) {
    inputElement.placeholder = inputElement.dataset.originalPlaceholder;
  }
  inputElement.classList.remove("error");
}

function validateForm() {
  let isValid = true;

  // Vor- und Nachname Validierung (erlaubt Umlaute und Leerzeichen, erfordert mindestens zwei Wörter)
  const nameInput = document.getElementById("name");
  if (
    !nameInput.value.match(/^[A-Za-zÄäÖöÜüß]+\s+[A-Za-zÄäÖöÜüß]+$/) ||
    nameInput.value.length > 23
  ) {
    setError(
      nameInput,
      "Ungültiger Name oder zu lang (Max Mustermann, max. 23 Zeichen)"
    );
    isValid = false;
    nameInput.value = "";
  } else {
    clearError(nameInput);
  }

  // Email Validierung (überprüft auf gültiges E-Mail-Format, keine Einschränkung auf bestimmte Endungen)
  const emailInput = document.getElementById("email");
  if (!emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    setError(emailInput, "Ungültige E-Mail (test@test.de)");
    isValid = false;
    emailInput.value = "";
  } else {
    clearError(emailInput);
  }

  // Telefonnummer Validierung (nur Zahlen erlaubt)
  const phoneInput = document.getElementById("phone");
  if (!phoneInput.value.match(/^\d+$/)) {
    setError(phoneInput, "Ungültige Telefonnummer 0176 123 123");
    isValid = false;
    phoneInput.value = "";
  } else {
    clearError(phoneInput);
  }

  if (isValid) {
    addContact();
    closeDialog();
    openDialogSuccesfully();
  }
}

function validateEditForm() {
  let isValid = true;

  // Vor- und Nachname Validierung (erlaubt Umlaute und Leerzeichen, erfordert mindestens zwei Wörter)
  const nameInput = document.getElementById("inputEditName");
  if (
    !nameInput.value.match(/^[A-Za-zÄäÖöÜüß]+\s+[A-Za-zÄäÖöÜüß]+$/) ||
    nameInput.value.length > 23
  ) {
    setError(
      nameInput,
      "Ungültiger Name oder zu lang (Max Mustermann, max. 23 Zeichen)"
    );
    isValid = false;
    nameInput.value = "";
  } else {
    clearError(nameInput);
  }

  // Email Validierung (überprüft auf gültiges E-Mail-Format, keine Einschränkung auf bestimmte Endungen)
  const emailInput = document.getElementById("inputEditEmail");
  if (!emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    setError(emailInput, "Ungültige E-Mail");
    isValid = false;
    emailInput.value = "";
  } else {
    clearError(emailInput);
  }

  // Telefonnummer Validierung (nur Zahlen erlaubt)
  const phoneInput = document.getElementById("inputEditPhone");
  if (!phoneInput.value.match(/^\d+$/)) {
    setError(phoneInput, "Ungültige Telefonnummer 0176 123 123");
    isValid = false;
    phoneInput.value = "";
  } else {
    clearError(phoneInput);
  }

  if (isValid) {
    editContact();
  }
}

let contactsCanBeAssigned = {
  firstname: [],
  lastname: [],
};

// Function to extract and store first and last names separately
function storeFirstAndLastNames() {
  // Reset the storage arrays
  contactsCanBeAssigned.firstname = [];
  contactsCanBeAssigned.lastname = [];

  // Process each contact
  contacts.forEach(contact => {
    let nameParts = contact.name.split(' ');
    if (nameParts.length > 1) {
      contactsCanBeAssigned.firstname.push(nameParts[0]);
      contactsCanBeAssigned.lastname.push(nameParts.slice(1).join(' '));
    } else {
      contactsCanBeAssigned.firstname.push(nameParts[0]);
      contactsCanBeAssigned.lastname.push('');
    }
  });

  // Save the separated names to local storage
  localStorage.setItem('contactsCanBeAssigned', JSON.stringify(contactsCanBeAssigned));
}

function truncate(text, maxLength = 20) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}


// async function deleteAllContacts() {
//   const firebaseUrl = 'https://join-b72fb-default-rtdb.europe-west1.firebasedatabase.app/contacts.json'; // URL zu deinem Firebase-Pfad

//   try {
//     const response = await fetch(firebaseUrl, {
//       method: 'DELETE', // HTTP DELETE-Methodenanforderung
//     });

//     if (response.ok) {
//       console.log("Alle Kontakte wurden erfolgreich gelöscht.");
//     } else {
//       console.error("Fehler beim Löschen der Kontakte:", response.status);
//     }
//   } catch (error) {
//     console.error("Fehler:", error);
//   }
// }

// deleteAllContacts();