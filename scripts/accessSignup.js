/**
 * Initiates the sign-up process by collecting user input from the form.
 */
function signUp() {
  let email = document.getElementById("signup_email").value.trim();
  let name = document.getElementById("signup_name").value.trim();
  let password = document.getElementById("signup_password").value;
  let cPassword = document.getElementById("signup_c_password").value;

  signUpProcess(email, name, password, cPassword);
}

/**
 * Processes the sign-up request, including input validation, user creation, and UI updates.
 *
 * @param {string} email - User's email address
 * @param {string} name - User's full name
 * @param {string} password - User's chosen password
 * @param {string} cPassword - Confirmation of the user's password
 */
async function signUpProcess(email, name, password, cPassword) {
  resetSignupAlert();
  await validateInputs(email, name, password, cPassword);
  let initials = getUserInitials(name);
  await addUser(email, name, password, initials);
  resetSignupFormInputs();
  await showSuccessfullySignedUp();
  localStorage.removeItem("rememberMeData");
  toggleAccessWindow();
}

/**
 * Resets the signup form's alert states and styling.
 */
function resetSignupAlert() {
  let noticeField = document.getElementById("signup_notice_field");
  noticeField.innerHTML = "";

  document.getElementById("signup_email").classList.remove("border-alert");
  document.getElementById("signup_name").classList.remove("border-alert");
  document.getElementById("signup_password").classList.remove("border-alert");
  document.getElementById("signup_c_password").classList.remove("border-alert");
}

/**
 * Adds a new user to the database.
 * 
 * @param {string} email - The user's email
 * @param {string} name - The user's full name
 * @param {string} password - The user's password
 * @param {string} initials - The user's initials
 */
async function addUser(email, name, password, initials) {
  let userId = await getNewId("users");
  let userData = createUserData(name, initials, email, password, userId);

  try {
    let result = await postData(`users/${userId - 1}/`, userData);
  } catch (error) {
    console.error("Error during registration:", error);
  }
}

/**
 * Creates a user data object with default values.
 * 
 * @param {string} name - The user's full name
 * @param {string} initials - The user's initials
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @param {number} userId - The unique identifier for the user
 * @returns {Object} An object containing the user's data
 */
function createUserData(name, initials, email, password, userId) {
  return {
    name,
    initials,
    email,
    password,
    id: userId,
    color: "#ffffff",
    tasks: [6, 7, 8, 9, 10],
    contacts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  };
}

/**
 * Resets all input fields and the legal acceptance checkbox in the signup form.
 */
function resetSignupFormInputs() {
  document.getElementById("signup_email").value = "";
  document.getElementById("signup_name").value = "";
  document.getElementById("signup_password").value = "";
  document.getElementById("signup_c_password").value = "";

  let legalButton = document.getElementById("signup_check_off");
  legalButton.src = `./assets/img/png/check-button-false.png`;
  legalButton.classList.remove("bg-alert");
}

/**
 * Displays and then hides a success message overlay after signup.
 */
function showSuccessfullySignedUp() {
  return new Promise((resolve) => {
    let overlay = document.getElementById("successfully_signed_up");
    overlay.classList.remove("d-none");
    overlay.classList.add("active");

    setTimeout(() => {
      overlay.classList.add("visible");
      setTimeout(() => {
        overlay.classList.remove("active", "visible");
        overlay.classList.add("d-none");
        resolve();
      }, 1500);
    }, 50);
  });
}

/**
 * Removes the alert background from the legal notice acceptance checkbox.
 */
function removeNoticeButtonBg() {
  let checkButton = document.getElementById("signup_check_off");
  checkButton.classList.remove("bg-alert");
}