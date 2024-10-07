/**
 * Logs in the user as a guest with predefined settings.
 * Clears remember me data, sets active user, and redirects to summary page.
 */
function loginAsGuest() {
  activeUser = {
    name: "Guest",
    initials: "G",
    id: 0,
    color: "#ffffff",
    tasks: [1, 2, 3, 4, 5],
    contacts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  };
  localStorage.removeItem("rememberMeData");
  localStorage.setItem("activeUser", JSON.stringify(activeUser));
  localStorage.setItem("greetingShown", "false");
  window.location.href = "./html/summary.html";
}

/**
 * Attempts to log in a user with provided email and password.
 * Fetches user data, validates credentials, and handles login outcome.
 */
async function loginAsUser() {
  let loginEmail = document.getElementById("login_email").value.trim();
  let loginPassword = document.getElementById("login_password").value;
  let users = await fetchData("users");
  let user = users.find(
    (user) => user.email.toLowerCase() === loginEmail.toLowerCase()
  );

  resetLoginAlert();

  if (user && user.password === loginPassword) {
    await handleSuccessfulLogin(user);
  } else {
    handleLoginError();
  }
}

/**
 * Resets login form alert states.
 * Clears notice field and removes alert borders from input fields.
 */
function resetLoginAlert() {
  let noticeField = document.getElementById("login_notice_field");
  noticeField.innerHTML = "";

  document.getElementById("login_email").classList.remove("border-alert");
  document.getElementById("login_password").classList.remove("border-alert");
}

/**
 * Handles actions after successful user login.
 * Manages remember me feature, loads user data, and redirects to summary page.
 *
 * @param {Object} user - The user object of the logged-in user
 */
async function handleSuccessfulLogin(user) {
  handleRememberMe(user);

  let userData = await loadUserData(user);

  localStorage.setItem("activeUser", JSON.stringify(userData));
  localStorage.setItem("greetingShown", "false");
  resetLoginFormInputs();
  window.location.href = "./html/summary.html";
}

/**
 * Manages the remember me functionality based on user choice.
 * Saves or removes remember me data in local storage.
 *
 * @param {Object} user - The user object to potentially remember
 */
async function handleRememberMe(user) {
  if (isRememberMeChecked()) {
    let saveData = await loadRememberMeData(user);
    localStorage.setItem("rememberMeData", JSON.stringify(saveData));
  }

  if (!isRememberMeChecked()) {
    localStorage.removeItem("rememberMeData");
  }
}

/**
 * Checks if the remember me option is selected.
 *
 * @returns {boolean} True if remember me is checked, false otherwise
 */
function isRememberMeChecked() {
  let checkButton = document.getElementById("login_check_off");
  let isChecked = checkButton.src.includes("true");
  return isChecked;
}

/**
 * Prepares user data for remember me functionality.
 *
 * @param {Object} user - The user object to remember
 * @returns {Object} Object containing email and password
 */
async function loadRememberMeData(user) {
  return {
    email: user.email,
    password: user.password,
  };
}

/**
 * Extracts relevant user data for active session.
 *
 * @param {Object} user - The full user object
 * @returns {Object} Object containing essential user data
 */
async function loadUserData(user) {
  return {
    name: user.name,
    initials: user.initials,
    id: user.id,
    color: user.color,
    tasks: user.tasks,
    contacts: user.contacts,
  };
}

/**
 * Resets login form inputs and remember me checkbox.
 * Clears email and password fields, unchecks remember me.
 */
function resetLoginFormInputs() {
  document.getElementById("login_email").value = "";
  document.getElementById("login_password").value = "";

  let legalButton = document.getElementById("login_check_off");
  legalButton.src = `./assets/img/png/check-button-false.png`;
}

/**
 * Handles failed login attempt.
 * Displays error message and highlights input fields.
 */
function handleLoginError() {
  let noticeField = document.getElementById("login_notice_field");
  noticeField.innerHTML += `<div>Check your email and password. Please try again.</div>`;
  document.getElementById("login_email").classList.add("border-alert");
  document.getElementById("login_password").classList.add("border-alert");
  console.error(errorMessage);
}
