/**
 * Validates all user inputs for the signup process.
 *
 * @param {string} email - User's email address
 * @param {string} name - User's full name
 * @param {string} password - User's chosen password
 * @param {string} cPassword - Confirmation of the user's password
 * @returns {Boolean} True if all inputs are valid, throws an error otherwise
 */
async function validateInputs(email, name, password, cPassword) {
  let noticeField = document.getElementById("signup_notice_field");
  let isEmailValid = await validateEmail(email, noticeField);
  let isNameValid = validateName(name, noticeField);
  let isPasswordValid = validatePassword(password, cPassword, noticeField);
  let isLegalAccepted = validateLegalAcceptance(noticeField);

  let isValid =
    isEmailValid && isNameValid && isPasswordValid && isLegalAccepted;

  if (!isValid) {
    throw new Error("Error in validation");
  }
  return true;
}

/**
 * Validates the email input for uniqueness and correct format.
 *
 * @param {string} email - User's email address
 * @param {HTMLElement} noticeField - Element to display validation notices
 * @returns {Boolean} True if email is valid, false otherwise
 */
async function validateEmail(email, noticeField) {
  let emailField = document.getElementById("signup_email");

  if (!(await checkEmailExists(email, noticeField, emailField))) {
    return false;
  }

  if (!checkEmailFormat(email, noticeField, emailField)) {
    return false;
  }

  return true;
}

/**
 * Checks if the provided email is already registered.
 *
 * @param {string} email - User's email address
 * @param {HTMLElement} noticeField - Element to display validation notices
 * @param {HTMLElement} emailField - Email input field element
 * @returns {Boolean} True if email doesn't exist, false if it does
 */
async function checkEmailExists(email, noticeField, emailField) {
  try {
    let emailExists = await isEmailRegistered(email);
    if (emailExists) {
      emailField.classList.add("border-alert");
      noticeField.innerHTML += `<div>This email address is already registered.</div>`;
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error checking email existence:", error);
    return false;
  }
}

/**
 * Checks if an email is already registered in the user database.
 *
 * @param {string} email - The email address to check
 * @returns {Boolean} True if the email is registered, false otherwise
 */
async function isEmailRegistered(email) {
  let users = await fetchData("users");
  if (!users) {
    return false;
  }
  return Object.values(users).some(
    (user) => user && user.email.toLowerCase() === email.toLowerCase()
  );
}

/**
 * Validates the format of an email address.
 *
 * @param {string} email - The email address to validate
 * @param {HTMLElement} noticeField - Element to display validation notices
 * @param {HTMLElement} emailField - The email input field element
 * @returns {Boolean} True if the email format is valid, false otherwise
 */
function checkEmailFormat(email, noticeField, emailField) {
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error("Invalid email format.");
    emailField.classList.add("border-alert");
    noticeField.innerHTML += `<div>Please enter a valid email address.</div>`;
    return false;
  }
  return true;
}

/**
 * Validates the user's name input.
 *
 * @param {string} name - The name to validate
 * @param {HTMLElement} noticeField - Element to display validation notices
 * @returns {Boolean} True if the name is valid, false otherwise
 */
function validateName(name, noticeField) {
  let isValidName = true;
  let nameField = document.getElementById("signup_name");

  if (!checkNameNotEmpty(name, noticeField, nameField)) {
    isValidName = false;
  }

  if (!checkNameCharacters(name, noticeField, nameField)) {
    isValidName = false;
  }
  
  return isValidName;
}

/**
 * Checks if the name input is not empty and has at least 3 characters.
 *
 * @param {string} name - The name to check
 * @param {HTMLElement} noticeField - Element to display validation notices
 * @param {HTMLElement} nameField - The name input field element
 * @returns {Boolean} True if the name is not empty and has at least 3 characters, false otherwise
 */
function checkNameNotEmpty(name, noticeField, nameField) {
  if (name.trim().length < 3) {
    nameField.classList.add("border-alert");
    noticeField.innerHTML += `<div>Please enter a name with at least 3 letters.</div>`;
    return false;
  }
  return true;
}

/**
 * Checks if the name contains only valid characters (letters and spaces).
 *
 * @param {string} name - The name to check
 * @param {HTMLElement} noticeField - Element to display validation notices
 * @param {HTMLElement} nameField - The name input field element
 * @returns {Boolean} True if the name contains only valid characters, false otherwise
 */
function checkNameCharacters(name, noticeField, nameField) {
  let nameRegex = /^[A-Za-zÄäÖöÜüß\s]+$/;

  if (!nameRegex.test(name)) {
    nameField.classList.add("border-alert");
    noticeField.innerHTML += `<div>Your name should only contain letters and spaces.</div>`;
    return false;
  }
  return true;
}

/**
 * Validates the password and its confirmation.
 *
 * @param {string} password - The password to validate
 * @param {string} cPassword - The confirmation password
 * @param {HTMLElement} noticeField - Element to display validation notices
 * @returns {Boolean} True if the password is valid and matches the confirmation, false otherwise
 */
function validatePassword(password, cPassword, noticeField) {
  let isValidPassword = true;
  let passwordField = document.getElementById("signup_password");
  let cPasswordField = document.getElementById("signup_c_password");

  if (!checkPasswordComplexity(password, noticeField, passwordField)) {
    isValidPassword = false;
  }

  if (
    !checkPasswordMatch(
      password,
      cPassword,
      noticeField,
      passwordField,
      cPasswordField
    )
  ) {
    isValidPassword = false;
  }
  return isValidPassword;
}

/**
 * Checks if the password meets the required complexity criteria.
 *
 * @param {string} password - The password to check
 * @param {HTMLElement} noticeField - Element to display validation notices
 * @param {HTMLElement} passwordField - The password input field element
 * @returns {Boolean} True if the password meets complexity requirements, false otherwise
 */
function checkPasswordComplexity(password, noticeField, passwordField) {
  let complexityRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;

  if (!complexityRegex.test(password)) {
    passwordField.classList.add("border-alert");
    noticeField.innerHTML += `<div>Your password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.</div>`;
    return false;
  }
  return true;
}

/**
 * Checks if the password and confirmation password match.
 *
 * @param {string} password - The original password
 * @param {string} cPassword - The confirmation password
 * @param {HTMLElement} noticeField - Element to display validation notices
 * @param {HTMLElement} passwordField - The password input field element
 * @param {HTMLElement} cPasswordField - The confirmation password input field element
 * @returns {Boolean} True if passwords match, false otherwise
 */
function checkPasswordMatch(
  password,
  cPassword,
  noticeField,
  passwordField,
  cPasswordField
) {
  if (password !== cPassword) {
    passwordField.classList.add("border-alert");
    cPasswordField.classList.add("border-alert");
    noticeField.innerHTML += `<div>Your passwords don't match. Please try again.</div>`;
    return false;
  }
  return true;
}

/**
 * Validates if the user has accepted the legal notice.
 *
 * @param {HTMLElement} noticeField - Element to display validation notices
 * @returns {Boolean} True if legal notice is accepted, false otherwise
 */
function validateLegalAcceptance(noticeField) {
  let acceptedLegal = isLegalAccepted();
  if (!acceptedLegal) {
    let checkButton = document.getElementById("signup_check_off");
    noticeField.innerHTML += `<div>Please accept the Legal notice.</div>`;
    checkButton.classList.add("bg-alert");
    return false;
  }
  return true;
}

/**
 * Checks if the legal acceptance checkbox is checked.
 *
 * @returns {Boolean} True if the checkbox is checked, false otherwise
 */
function isLegalAccepted() {
  let checkButton = document.getElementById("signup_check_off");
  let isChecked = checkButton.src.includes("true");
  return isChecked;
}

/**
 * Checks if the legal acceptance checkbox is checked.
 *
 * @returns {Boolean} True if the checkbox is checked, false otherwise
 */
function getUserInitials(name) {
  let words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  if (words.length >= 2) {
    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  }
}
