function initAccess(){
  LoginPasswordField();
}

function toggleAccessWindow() {
  let logIn = document.getElementById("Login");
  let signUp = document.getElementById("Signup");
  let changeAccess = document.getElementById("change_access");

  logIn.classList.toggle("d-none");
  signUp.classList.toggle("d-none");
  changeAccess.classList.toggle("d-none");
}

function LoginPasswordField() {
  const passwordField = document.getElementById("login_password_field");
  const lockIcon = document.getElementById("login_lock_icon");
  const togglePassword = document.getElementById("login_toggle_password");

  setupPasswordFieldInteractions(passwordField, lockIcon, togglePassword);

  updateVisibility(passwordField, lockIcon, togglePassword);
};

function setupPasswordFieldInteractions(passwordField,lockIcon,togglePassword) {
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
  togglePassword.addEventListener("touchstart", () =>
    showPassword(passwordField, togglePassword)
  );
  togglePassword.addEventListener("touchend", () =>
    hidePassword(passwordField, togglePassword)
  );
}

function updateVisibility(passwordField, lockIcon, togglePassword) {
  const isEmpty = passwordField.value.length === 0;
  lockIcon.classList.toggle("d-none", !isEmpty);
  togglePassword.classList.toggle("d-none", isEmpty);
}

function showPassword(passwordField, togglePassword) {
  passwordField.type = "text";
  togglePassword.src = "/assets/img/png/visibility.png";
}

function hidePassword(passwordField, togglePassword) {
  passwordField.type = "password";
  togglePassword.src = "/assets/img/png/visibility_off.png";
}

function loginAsGuest() {
  window.location.href = '/html/summary.html';
}
