function initAccess() {
  setupRememberMeFieldListeners();
  loginPasswordField();
  signupPasswordField();
  signupConfirmPasswordField();
  resetTheDatabase();
}

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
    logo.classList.add('logo-small');
    logoContainer.classList.add('container-transparent');
  }, 1000);

  setTimeout(() => {
    logoContainer.style.pointerEvents = "none";
    logo.style.zIndex = "1001";
  }, 1500);

  checkRememberMeData();
});

function checkRememberMeData() {
  const rememberMeData = localStorage.getItem("rememberMeData");

  if (rememberMeData) {
    try {
      const { email, password } = JSON.parse(rememberMeData);
      fillLoginForm(email, password);
      toggleCheckButtonAccess('login_check_off', 'button');
    } catch (error) {
      console.error("Fehler beim Parsen der gespeicherten Login-Daten:", error);
    }
  }
}

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

function toggleAccessWindow() {
  let logIn = document.getElementById("Login");
  let signUp = document.getElementById("Signup");
  let changeAccess = document.getElementById("change_access");

  logIn.classList.toggle("d-none");
  signUp.classList.toggle("d-none");
  changeAccess.classList.toggle("d-none");
}

function setupRememberMeFieldListeners() {
  const emailInput = document.getElementById('login_email');
  const passwordInput = document.getElementById('login_password');
  const legalButton = document.getElementById("login_check_off");

  emailInput.addEventListener('input', function() {
    if (this.value === '') {
      legalButton.src = `./assets/img/png/check-button-false.png`;
      passwordInput.value = '';
    }
  });
}

function loginPasswordField() {
  const passwordField = document.getElementById("login_password");
  const lockIcon = document.getElementById("login_lock_icon");
  const togglePassword = document.getElementById("login_toggle_password");

  setupPasswordFieldInteractions(passwordField, lockIcon, togglePassword);

  updateVisibility(passwordField, lockIcon, togglePassword);
}

function signupPasswordField() {
  const passwordField = document.getElementById("signup_password");
  const lockIcon = document.getElementById("signup_lock_icon");
  const togglePassword = document.getElementById("signup_toggle_password");

  setupPasswordFieldInteractions(passwordField, lockIcon, togglePassword);

  updateVisibility(passwordField, lockIcon, togglePassword);
}

function signupConfirmPasswordField() {
  const passwordField = document.getElementById("signup_c_password");
  const lockIcon = document.getElementById("signup_c_lock_icon");
  const togglePassword = document.getElementById("signup_c_toggle_password");

  setupPasswordFieldInteractions(passwordField, lockIcon, togglePassword);

  updateVisibility(passwordField, lockIcon, togglePassword);
}

function setupPasswordFieldInteractions(
  passwordField,
  lockIcon,
  togglePassword
) {
  passwordField.addEventListener("input", () =>
    updateVisibility(passwordField, lockIcon, togglePassword)
  );
  togglePassword.addEventListener("mousedown", () =>
    showPassword(passwordField, togglePassword)
  );
  togglePassword.addEventListener("mouseup", () =>
    hidePassword(passwordField, togglePassword)
  );
  togglePassword.addEventListener("mouseleave", () =>
    hidePassword(passwordField, togglePassword)
  );
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

function updateVisibility(passwordField, lockIcon, togglePassword) {
  const isEmpty = passwordField.value.length === 0;
  lockIcon.classList.toggle("d-none", !isEmpty);
  togglePassword.classList.toggle("d-none", isEmpty);
}

function showPassword(passwordField, togglePassword) {
  passwordField.type = "text";
  togglePassword.src = "./assets/img/png/visibility.png";
}

function hidePassword(passwordField, togglePassword) {
  passwordField.type = "password";
  togglePassword.src = "./assets/img/png/visibility_off.png";
}
