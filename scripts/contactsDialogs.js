/**
 * Validates the fields based on a list of criteria.
 * @param {Array} fields - A list of objects containing validation details for each field.
 * @param {string} fields[].id - The ID of the input field to be validated.
 * @param {RegExp} fields[].regex - The regular expression pattern for validating the field value.
 * @param {string} fields[].alert - The ID of the element that displays the error.
 * @param {string} fields[].message - The error message shown for an invalid value.
 * @param {number} [fields[].maxLength] - The maximum character length allowed for the field (optional).
 * @returns {boolean} - Returns `true` if all fields are valid, otherwise `false`.
 */
function validateFields(fields) {
  return fields.every(({ id, regex, alert, message, maxLength }) =>
    validateInput(document.getElementById(id), regex, message, alert, maxLength)
  );
}

/**
 * Validates the form for adding a new contact.
 * @returns {Promise<void>} - Executes the contact addition logic if validation is successful.
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
 * Validates the form for editing a contact.
 * @param {number} contactId - The ID of the contact to be edited.
 * @returns {Promise<void>} - Executes the contact editing logic if validation is successful.
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
 * Opens the dialog for adding a contact.
 * @returns {Promise<void>} - Displays the dialog.
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
 * Opens the edit dialog for a contact.
 * @param {number} contactId - The ID of the contact to be edited.
 * @returns {Promise<void>} - Displays the edit dialog and fills the form fields with existing contact information.
 */
async function openDialogEdit(contactId) {
  const contact = await getContact(contactId);
  const menu = document.getElementById("mobile_menu");
  if (menu.classList.contains("d-flex")) {
    menu.classList.remove("d-flex");
  }
  if (contact.id === 0) {
    document.getElementById("user_display_info").classList.add("d-none")
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
 * Closes the dialog for adding a contact.
 * @returns {Promise<void>} - Hides the dialog and clears the form.
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
 * Closes the edit dialog.
 * @returns {Promise<void>} - Hides the dialog and clears the edit form.
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
 * Fills the edit form fields with the contact's information.
 * @param {Object} contact - The contact object with properties name, email, and phone.
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
 * Generates and displays the big letter circle for the dialog.
 * @param {Object} contact - The contact object with properties color and initials.
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
 * Opens the dialog window indicating that a contact operation has been successfully completed.
 *
 * @param {string} operation - The type of operation that was performed on the contact.
 *                             It can be one of the following values:
 *                             - "created" for a newly added contact,
 *                             - "edited" for an updated contact,
 *                             - "deleted" for a removed contact.
 * @returns {Promise<void>} A promise that resolves when the dialog has been fully displayed and closed.
 */
async function openDialogSuccessfully(operation) {
  const dialogContainer = document.getElementById("succesfully_created");
  dialogContainer.innerHTML = generateSuccesssfullyHtml(operation);
  setTimeout(async () => {
    dialogContainer.open = true;
    await sleep(300);
    dialogContainer.classList.add("dialog-open");
    dialogContainer.classList.add("d-flex");
    await sleep(1500);
    dialogContainer.classList.remove("dialog-open");
    await sleep(300);
    dialogContainer.classList.remove("d-flex");
    dialogContainer.open = false;
  }, 300);
}

/**
 * Retrieves the value of an input field based on its ID.
 * 
 * @param {string} id - The ID of the input field.
 * @returns {string} - The value of the input field.
 */
function getInputValue(id) {
  return document.getElementById(id).value;
}

/**
 * Displays an error message and marks the input field as erroneous.
 * @param {HTMLElement} inputElement - The input field being checked.
 * @param {string} message - The error message to display.
 * @param {string} alertElementId - The ID of the element displaying the error message.
 */
function setError(inputElement, message, alertElementId) {
  const alertElement = document.getElementById(alertElementId);
  alertElement.innerText = message;
  alertElement.style.display = "block";
  inputElement.classList.add("error");
}

/**
 * Removes the error message and error styling from the input field.
 * @param {HTMLElement} inputElement - The input field for which to reset the error.
 * @param {string} alertElementId - The ID of the element displaying the error message.
 */
function clearError(inputElement, alertElementId) {
  const alertElement = document.getElementById(alertElementId);
  alertElement.innerText = "";
  alertElement.style.display = "none";
  inputElement.classList.remove("error");
}

/**
 * Clears all inputs in the form and removes any error displays.
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
 * Clears all inputs in the edit form and removes any error displays.
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
 * Checks the input of a form field against a regular expression and optional maximum length.
 * @param {HTMLElement} input - The input field being checked.
 * @param {RegExp} regex - The regular expression for validation.
 * @param {string} errorMsg - The error message displayed if the input is invalid.
 * @param {string} errorId - The ID of the element displaying the error message.
 * @param {number} [maxLength] - The optional maximum length for the input (default is undefined).
 * @returns {boolean} - Returns `true` if the input is valid, otherwise `false`.
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
 * Updates the source of the close icon based on screen width.
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
 * Edits a contact's information and updates it in the database.
 * @param {number} contactId - The ID of the contact being edited.
 */
async function editContact(contactId) {
  const existingContact = await getContact(contactId);
  if(contactId === 0) {
    const activeUser = JSON.parse(localStorage.getItem("activeUser"));
    existingContact.id = activeUser.id;
  }
  const updatedContact = createUpdatedContact(existingContact);
  const endpoint =
    existingContact.color === "#ffffff"
      ? `users/${existingContact.id - 1}/`
      : `contacts/${existingContact.id - 1}/`;
  await postData(endpoint, updatedContact);
  closeDialogEdit();
  openDialogSuccessfully('edited');
  await renderContent();
  checkDisplayForInfo(existingContact)
}

/**
 * Überprüft die Displaygröße und passt das Layout sowie die Kontaktinformationen an.
 * 
 * - Wenn die Fensterbreite kleiner oder gleich 777px ist, wird die Informationsanzeige
 *   für mobile Geräte versteckt und positionelle Klassen entfernt.
 * - Andernfalls wird bei großen Bildschirmen der Kontakt basierend auf seiner ID angezeigt.
 *   Wenn die Farbe des Kontakts weiß ist, wird die Kontakt-ID auf 0 gesetzt.
 * 
 * @param {Object} existingContact - Das bestehende Kontaktobjekt, das Informationen über den Kontakt enthält.
 * @param {number} existingContact.id - Die eindeutige ID des Kontakts.
 * @param {string} existingContact.color - Die Farbe des Kontakts (im Hex-Format).
 */
function checkDisplayForInfo(existingContact){
  if (window.innerWidth <= 777) {
    const infoDiv = document.getElementById("mobile_contact_info");
    infoDiv.classList.add("d-none");
    infoDiv.classList.remove("pos-abs");
  } else {
    if ( existingContact.color === "#ffffff") {
      existingContact.id = 0;
    }
    displayContactInfo(existingContact.id);
  }
}

/**
 * Creates an updated contact object based on the edited inputs.
 * @param {Object} existingContact - The existing contact object being edited.
 * @returns {Object} - The updated contact object.
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
 * Event listener that calls the updateCrossImage function when the page loads.
 * This listener ensures that the close icon is adjusted based on screen size
 * as soon as the page is fully loaded.
 */
window.addEventListener("load", updateCrossImage);

/**
 * Event listener that calls the updateCrossImage function when the screen size changes.
 * This listener dynamically adjusts the close icon when the screen size changes
 * (e.g., when resizing the browser window).
 */
window.addEventListener("resize", updateCrossImage);
