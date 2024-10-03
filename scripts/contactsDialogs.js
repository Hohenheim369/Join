/**
 * Validiert die Felder basierend auf einer Liste von Kriterien.
 * @param {Array} fields - Eine Liste von Objekten, die die Validierungsdetails für jedes Feld enthalten.
 * @param {string} fields[].id - Die ID des zu validierenden Eingabefelds.
 * @param {RegExp} fields[].regex - Das reguläre Ausdrucksmuster zur Validierung des Feldwerts.
 * @param {string} fields[].alert - Die ID des Elements, das den Fehler anzeigt.
 * @param {string} fields[].message - Die Fehlermeldung, die bei ungültigem Wert angezeigt wird.
 * @param {number} [fields[].maxLength] - Die maximale Zeichenlänge, die für das Feld erlaubt ist (optional).
 * @returns {boolean} - Gibt `true` zurück, wenn alle Felder gültig sind, andernfalls `false`.
 */
function validateFields(fields) {
  return fields.every(({ id, regex, alert, message, maxLength }) =>
    validateInput(document.getElementById(id), regex, message, alert, maxLength)
  );
}

/**
 * Validiert das Formular für das Hinzufügen eines neuen Kontakts.
 * @returns {Promise<void>} - Führt die Kontakt-Hinzufügungslogik aus, wenn die Validierung erfolgreich ist.
 */
async function validateForm() {
  const fields = [
    {
      id: "name",
      regex: /^[A-Za-zÄäÖöÜüß]+(\s+[A-Za-zÄäÖöÜüß]+){1,}$/,
      alert: "field_alert_name",
      message: "(min. two words, max. 23 chars)",
      maxLength: 23,
    },
    {
      id: "email",
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      alert: "field_alert_email",
      message: "Invalid email (test@test.de)",
    },
  ];
  const valid = validateFields(fields);
  if (valid) {
    await addContact();
  }
}

/**
 * Validiert das Formular für die Bearbeitung eines Kontakts.
 * @param {number} contactId - Die ID des zu bearbeitenden Kontakts.
 * @returns {Promise<void>} - Führt die Kontakt-Bearbeitungslogik aus, wenn die Validierung erfolgreich ist.
 */
async function validateEditForm(contactId) {
  const fields = [
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
  const valid = validateFields(fields);
  if (valid) {
    await editContact(contactId);
  }
}

/**
 * Öffnet den Dialog zum Hinzufügen eines Kontakts.
 * @returns {Promise<void>} - Zeigt den Dialog an.
 */
async function openDialog() {
  const dialogContainer = document.getElementById("dialog_contacts");
  dialogContainer.open = true;
  dialogContainer.classList.add("d-flex");
  await sleep(10);
  dialogContainer.classList.add("dialog-open");
  document.getElementById("grey_background").classList.remove("hidden");
}

/**
 * Öffnet den Bearbeitungsdialog für einen Kontakt.
 * @param {number} contactId - Die ID des zu bearbeitenden Kontakts.
 * @returns {Promise<void>} - Zeigt den Bearbeitungsdialog an und füllt die Formularfelder mit den bestehenden Kontaktinformationen.
 */
async function openDialogEdit(contactId) {
  const contact = await getContact(contactId);
  const menu = document.getElementById("mobile_menu");
  if (menu.classList.contains("d-flex")) {
    menu.classList.remove("d-flex");
  }
  const dialogContainer = document.getElementById("dialog_edit");
  dialogContainer.open = true;
  dialogContainer.classList.add("d-flex");
  document.getElementById("grey_background").classList.remove("hidden");
  populateFormFields(contact);
  await sleep(10);
  dialogContainer.classList.add("dialog-open");
  dialogBigLetterCircle(contact);
}

/**
 * Schließt den Dialog zum Hinzufügen eines Kontakts.
 * @returns {Promise<void>} - Versteckt den Dialog und leert das Formular.
 */
async function closeDialog() {
  const dialogContainer = document.getElementById("dialog_contacts");
  dialogContainer.classList.remove("dialog-open");
  document.getElementById("grey_background").classList.add("hidden");
  await sleep(300);
  dialogContainer.classList.remove("d-flex");
  dialogContainer.open = false;
  clearForm();
}

/**
 * Schließt den Bearbeitungsdialog.
 * @returns {Promise<void>} - Versteckt den Dialog und leert das Bearbeitungsformular.
 */
async function closeDialogEdit() {
  const dialogContainer = document.getElementById("dialog_edit");
  dialogContainer.classList.remove("dialog-open");
  document.getElementById("grey_background").classList.add("hidden");
  await sleep(300);
  dialogContainer.classList.remove("d-flex");
  dialogContainer.open = false;
  clearEditForm();
}

/**
 * Füllt die Bearbeitungsformularfelder mit den Informationen des Kontakts.
 * @param {Object} contact - Das Kontaktobjekt mit den Eigenschaften name, email und phone.
 */
function populateFormFields(contact) {
  document.getElementById("inputEditName").value = contact.name;
  document.getElementById("inputEditEmail").value = contact.email;
  if (contact.phone === undefined) {
    contact.phone = "";
  }
  document.getElementById("inputEditPhone").value = contact.phone;
}

/**
 * Generiert und zeigt den großen Buchstaben-Kreis für das Dialogfeld an.
 * @param {Object} contact - Das Kontaktobjekt mit den Eigenschaften color und initials.
 */
function dialogBigLetterCircle(contact) {
  document.getElementById("big_letter_circle").innerHTML =
    generateBigLetterCircle(contact);
  if (contact.color === "#ffffff") {
    document
      .getElementById("for_active_use_dialog_circel")
      .classList.add("letter-circel-user");
  }
}

/**
 * Öffnet das Dialogfenster, das anzeigt, dass ein Kontakt erfolgreich erstellt wurde.
 */
async function openDialogSuccessfully() {
  const dialogContainer = document.getElementById("succesfully_created");
  setTimeout(async () => {
    dialogContainer.open = true;
    await sleep(300);
    dialogContainer.classList.add("dialog-open");
    dialogContainer.classList.add("d-flex");
    await sleep(1000);
    dialogContainer.classList.remove("dialog-open");
    await sleep(300);
    dialogContainer.classList.remove("d-flex");
    dialogContainer.open = false;
  }, 300);
}

/**
 * Holt den Wert eines Eingabefeldes anhand seiner ID.
 * 
 * @param {string} id - Die ID des Eingabefeldes.
 * @returns {string} - Der Wert des Eingabefeldes.
 */
function getInputValue(id) {
  return document.getElementById(id).value;
}

/**
 * Zeigt eine Fehlermeldung an und markiert das Eingabefeld als fehlerhaft.
 * @param {HTMLElement} inputElement - Das Eingabefeld, das überprüft wird.
 * @param {string} message - Die anzuzeigende Fehlermeldung.
 * @param {string} alertElementId - Die ID des Elements, das die Fehlermeldung anzeigt.
 */
function setError(inputElement, message, alertElementId) {
  const alertElement = document.getElementById(alertElementId);
  alertElement.innerText = message;
  alertElement.style.display = "block";
  inputElement.classList.add("error");
}

/**
 * Entfernt die Fehlermeldung und das Fehlerstyling vom Eingabefeld.
 * @param {HTMLElement} inputElement - Das Eingabefeld, dessen Fehler zurückgesetzt werden.
 * @param {string} alertElementId - Die ID des Elements, das die Fehlermeldung anzeigt.
 */
function clearError(inputElement, alertElementId) {
  const alertElement = document.getElementById(alertElementId);
  alertElement.innerText = "";
  alertElement.style.display = "none";
  inputElement.classList.remove("error");
}

/**
 * Löscht alle Eingaben im Formular und entfernt mögliche Fehleranzeigen.
 */
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

/**
 * Löscht alle Eingaben im Bearbeitungsformular und entfernt mögliche Fehleranzeigen.
 */
function clearEditForm() {
  const nameEditInput = document.getElementById("inputEditName");
  const emailEditInput = document.getElementById("inputEditEmail");
  const phoneEditInput = document.getElementById("inputEditPhone");
  clearError(nameEditInput, "edit_field_alert_name");
  clearError(emailEditInput, "edit_field_alert_email");
  clearError(phoneEditInput, "edit_field_alert_phone");
}

/**
 * Überprüft die Eingabe eines Formularfeldes anhand eines regulären Ausdrucks und optionaler Maximallänge.
 * @param {HTMLElement} input - Das Eingabefeld, das überprüft wird.
 * @param {RegExp} regex - Der reguläre Ausdruck zur Überprüfung.
 * @param {string} errorMsg - Die Fehlermeldung, die angezeigt wird, wenn die Eingabe ungültig ist.
 * @param {string} errorId - Die ID des Elements, das die Fehlermeldung anzeigt.
 * @param {number} [maxLength] - Optional, die maximale Länge der Eingabe.
 * @returns {boolean} - True, wenn die Eingabe gültig ist, andernfalls false.
 */
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

/**
 * Aktualisiert die Bildquelle des Schließen-Symbols je nach Bildschirmbreite.
 */
function updateCrossImage() {
  const imgElements = document.querySelectorAll(".cross");
  imgElements.forEach((imgElement) => {
    if (window.innerWidth < 1024) {
      imgElement.src = "../assets/img/png/close-white.png"; 
    } else {
      imgElement.src = "../assets/img/png/close.png"; 
    }
  });
}

/**
 * Bearbeitet die Informationen eines Kontakts und aktualisiert sie in der Datenbank.
 * @param {number} contactId - Die ID des Kontakts, der bearbeitet wird.
 */
async function editContact(contactId) {
  const existingContact = await getContact(contactId);
  const updatedContact = createUpdatedContact(existingContact);
  const endpoint =
    existingContact.color === "#ffffff"
      ? `users/${contactId - 1}/`
      : `contacts/${contactId - 1}/`;
  await postData(endpoint, updatedContact);
  closeDialogEdit();
  await renderContent();
  if (window.innerWidth <= 777) {
    const infoDiv = document.getElementById("mobile_contact_info");
    infoDiv.classList.add("d-none");
    infoDiv.classList.remove("pos-abs");
  } else {
    displayContactInfo(contactId);
  }
}

/**
 * Erstellt ein aktualisiertes Kontaktobjekt basierend auf den bearbeiteten Eingaben.
 * @param {Object} existingContact - Das bestehende Kontaktobjekt, das bearbeitet wird.
 * @returns {Object} - Das aktualisierte Kontaktobjekt.
 */
function createUpdatedContact(existingContact) {
    const updatedName = document.getElementById("inputEditName").value;
    const updatedEmail = document.getElementById("inputEditEmail").value;
    const updatedPhone = document.getElementById("inputEditPhone").value;
    const updatedInitials = getInitials(updatedName);
    return {
      ...existingContact,
      name: updatedName,
      email: updatedEmail,
      phone: updatedPhone,
      initials: updatedInitials,
    };
  }

/**
 * Event-Listener, der beim Laden der Seite die Funktion updateCrossImage aufruft.
 * Dieser Listener sorgt dafür, dass das Schließen-Symbol (Cross) je nach Bildschirmgröße angepasst wird,
 * sobald die Seite vollständig geladen wurde.
 */
window.addEventListener("load", updateCrossImage);

/**
 * Event-Listener, der die Funktion updateCrossImage beim Ändern der Bildschirmgröße aufruft.
 * Dieser Listener passt das Schließen-Symbol dynamisch an, wenn sich die Bildschirmgröße ändert
 * (z. B. bei der Größenänderung des Browserfensters).
 */
window.addEventListener("resize", updateCrossImage);
