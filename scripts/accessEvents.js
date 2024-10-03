/**
 * Initializes access-related functionality for the application.
 */
function initAccess() {
  setupRememberMeFieldListeners();
  loginPasswordField();
  signupPasswordField();
  signupConfirmPasswordField();
  resetTheDatabase();
}

/**
 * Toggles the state of a check button image.
 *
 * @param {string} CheckButtonId - The ID of the check button element
 * @param {string} CheckTaskButton - The type of check button
 */
function toggleCheckButtonAccess(CheckButtonId, CheckTaskButton) {
  const checkButton = document.getElementById(CheckButtonId);
  const isChecked = checkButton.src.includes("true");
  checkButton.src = `./assets/img/png/check-${CheckTaskButton}-${
    isChecked ? "false" : "true"
  }.png`;
}

document.addEventListener("DOMContentLoaded", () => {
  const logoContainer = document.querySelector(".logo-container");
  const logo = document.querySelector(".img-logo");

  setTimeout(() => {
    logo.classList.add("logo-small");
    logoContainer.classList.add("container-transparent");
  }, 1000);

  setTimeout(() => {
    logoContainer.style.pointerEvents = "none";
    logo.style.zIndex = "1001";
  }, 1500);

  checkRememberMeData();
});

/**
 * Checks for stored "Remember Me" data and fills the login form if available.
 */
function checkRememberMeData() {
  const rememberMeData = localStorage.getItem("rememberMeData");

  if (rememberMeData) {
    try {
      const { email, password } = JSON.parse(rememberMeData);
      fillLoginForm(email, password);
      toggleCheckButtonAccess("login_check_off", "button");
    } catch (error) {
      console.error("Fehler beim Parsen der gespeicherten Login-Daten:", error);
    }
  }
}

/**
 * Fills the login form with stored email and password.
 *
 * @param {string} email - The stored email address
 * @param {string} password - The stored password
 */
function fillLoginForm(email, password) {
  const emailInput = document.getElementById("login_email");
  const passwordInput = document.getElementById("login_password");

  if (emailInput && passwordInput) {
    emailInput.value = email;
    passwordInput.value = password;
  } else {
    console.error("Login-Formularfelder nicht gefunden");
  }
}

/**
 * Toggles visibility between login and signup windows.
 */
function toggleAccessWindow() {
  let logIn = document.getElementById("Login");
  let signUp = document.getElementById("Signup");
  let changeAccess = document.getElementById("change_access");

  logIn.classList.toggle("d-none");
  signUp.classList.toggle("d-none");
  changeAccess.classList.toggle("d-none");
}

/**
 * Sets up event listeners for the "Remember Me" functionality in the login form.
 */
function setupRememberMeFieldListeners() {
  const emailInput = document.getElementById("login_email");
  const passwordInput = document.getElementById("login_password");
  const legalButton = document.getElementById("login_check_off");

  emailInput.addEventListener("input", function () {
    if (this.value === "") {
      legalButton.src = `./assets/img/png/check-button-false.png`;
      passwordInput.value = "";
    }
  });
}

/**
 * Sets up password field interactions for the login form.
 */
function loginPasswordField() {
  const passwordField = document.getElementById("login_password");
  const lockIcon = document.getElementById("login_lock_icon");
  const togglePassword = document.getElementById("login_toggle_password");

  setupPasswordFieldInteractions(passwordField, lockIcon, togglePassword);

  updateVisibility(passwordField, lockIcon, togglePassword);
}

/**
 * Sets up password field interactions for the signup form.
 */
function signupPasswordField() {
  const passwordField = document.getElementById("signup_password");
  const lockIcon = document.getElementById("signup_lock_icon");
  const togglePassword = document.getElementById("signup_toggle_password");

  setupPasswordFieldInteractions(passwordField, lockIcon, togglePassword);

  updateVisibility(passwordField, lockIcon, togglePassword);
}

/**
 * Sets up password field interactions for the confirm password field in the signup form.
 */
function signupConfirmPasswordField() {
  const passwordField = document.getElementById("signup_c_password");
  const lockIcon = document.getElementById("signup_c_lock_icon");
  const togglePassword = document.getElementById("signup_c_toggle_password");

  setupPasswordFieldInteractions(passwordField, lockIcon, togglePassword);

  updateVisibility(passwordField, lockIcon, togglePassword);
}

/**
 * Sets up all password field interactions.
 *
 * @param {HTMLElement} passwordField - The password input element
 * @param {HTMLElement} lockIcon - The lock icon element
 * @param {HTMLElement} togglePassword - The toggle password visibility element
 */
function setupPasswordFieldInteractions(
  passwordField,
  lockIcon,
  togglePassword
) {
  setupInputListener(passwordField, lockIcon, togglePassword);
  setupMouseListeners(passwordField, togglePassword);
  setupTouchListeners(passwordField, togglePassword);
}

/**
 * Sets up the input event listener for the password field.
 *
 * @param {HTMLElement} passwordField - The password input element
 * @param {HTMLElement} lockIcon - The lock icon element
 * @param {HTMLElement} togglePassword - The toggle password visibility element
 */
function setupInputListener(passwordField, lockIcon, togglePassword) {
  passwordField.addEventListener("input", () =>
    updateVisibility(passwordField, lockIcon, togglePassword)
  );
}

/**
 * Sets up mouse event listeners for password visibility toggle.
 *
 * @param {HTMLElement} passwordField - The password input element
 * @param {HTMLElement} togglePassword - The toggle password visibility element
 */
function setupMouseListeners(passwordField, togglePassword) {
  togglePassword.addEventListener("mousedown", () =>
    showPassword(passwordField, togglePassword)
  );
  togglePassword.addEventListener("mouseup", () =>
    hidePassword(passwordField, togglePassword)
  );
  togglePassword.addEventListener("mouseleave", () =>
    hidePassword(passwordField, togglePassword)
  );
}

/**
 * Sets up touch event listeners for password visibility toggle.
 *
 * @param {HTMLElement} passwordField - The password input element
 * @param {HTMLElement} togglePassword - The toggle password visibility element
 */
function setupTouchListeners(passwordField, togglePassword) {
  togglePassword.addEventListener(
    "touchstart",
    () => showPassword(passwordField, togglePassword),
    { passive: true }
  );
  togglePassword.addEventListener(
    "touchend",
    () => hidePassword(passwordField, togglePassword),
    { passive: true }
  );
}

/**
 * Updates the visibility of password-related elements based on the password field's content.
 *
 * @param {HTMLElement} passwordField - The password input element
 * @param {HTMLElement} lockIcon - The lock icon element
 * @param {HTMLElement} togglePassword - The toggle password visibility element
 */
function updateVisibility(passwordField, lockIcon, togglePassword) {
  const isEmpty = passwordField.value.length === 0;
  lockIcon.classList.toggle("d-none", !isEmpty);
  togglePassword.classList.toggle("d-none", isEmpty);
}

/**
 * Shows the password in clear text.
 *
 * @param {HTMLElement} passwordField - The password input element
 * @param {HTMLElement} togglePassword - The toggle password visibility element
 */
function showPassword(passwordField, togglePassword) {
  passwordField.type = "text";
  togglePassword.src = "./assets/img/png/visibility.png";
}

/**
 * Hides the password by changing it back to password type.
 *
 * @param {HTMLElement} passwordField - The password input element
 * @param {HTMLElement} togglePassword - The toggle password visibility element
 */
function hidePassword(passwordField, togglePassword) {
  passwordField.type = "password";
  togglePassword.src = "./assets/img/png/visibility_off.png";
}
