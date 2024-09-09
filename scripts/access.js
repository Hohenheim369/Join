function initAccess() {
  loginPasswordField();
  signupPasswordField();
  signupConfirmPasswordField();

  loadData();
}

function toggleAccessWindow() {
  let logIn = document.getElementById("Login");
  let signUp = document.getElementById("Signup");
  let changeAccess = document.getElementById("change_access");

  logIn.classList.toggle("d-none");
  signUp.classList.toggle("d-none");
  changeAccess.classList.toggle("d-none");
}

function loginPasswordField() {
  const passwordField = document.getElementById("login_password");
  const lockIcon = document.getElementById("login_lock_icon");
  const togglePassword = document.getElementById("login_toggle_password");

  setupPasswordFieldInteractions(passwordField, lockIcon, togglePassword);

  updateVisibility(passwordField, lockIcon, togglePassword);
}

function signupPasswordField() {
  const passwordField = document.getElementById("signup_password_field");
  const lockIcon = document.getElementById("signup_lock_icon");
  const togglePassword = document.getElementById("signup_toggle_password");

  setupPasswordFieldInteractions(passwordField, lockIcon, togglePassword);

  updateVisibility(passwordField, lockIcon, togglePassword);
}

function signupConfirmPasswordField() {
  const passwordField = document.getElementById(
    "signup_confirm_password_field"
  );
  const lockIcon = document.getElementById("signup_confirm_lock_icon");
  const togglePassword = document.getElementById(
    "signup_confirm_toggle_password"
  );

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

// Muss noch bearbeitet werden
function loginAsGuest() {
  window.location.href = "/html/summary.html";
}

const BASE_URL_S =
  "https://joinsusanne-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadData() {
  console.log("test");
  let response = await fetch(BASE_URL_S + ".json");
  let responseToJson = await response.json();
  console.log(responseToJson);
  let JsonLength = Object.keys(responseToJson).length;
  console.log(JsonLength);
  let newTaskId = responseToJson[JsonLength].id;
  console.log(newTaskId);
}

function addUser() {
  let name = document.getElementById("login_password").value;
  let email = document.getElementById("login_email_field").value;

  postTitle(
    `https://remotestorage-6ae7b-default-rtdb.europe-west1.firebasedatabase.app/users/`,
    {
      firstname: name,
      email: email,
    }
  );
}

async function postTitle(path, title = {}) {
  let response = await fetch(path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(title),
  });
  return (responseToJson = await response.json());
}
