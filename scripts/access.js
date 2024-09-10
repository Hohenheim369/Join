function initAccess() {
  loginPasswordField();
  signupPasswordField();
  signupConfirmPasswordField();
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
  window.location.href = "./html/summary.html";
}

const BASE_URL_S =
  "https://joinsusanne-default-rtdb.europe-west1.firebasedatabase.app/";

// async function getNewUserId() {
//   let response = await fetch(
//     `https://joinsusanne-default-rtdb.europe-west1.firebasedatabase.app/users/.json`
//   );
//   let responseToJson = await response.json();
//   let newUserId;
//   if (responseToJson == null) {
//     newUserId = 1;
//   } else {
//     newUserId = countId(responseToJson);
//   }
//   return newUserId;
// }

// function countId(responseToJson) {
//   let keys = Object.keys(responseToJson);
//   let lastKey = keys[keys.length - 1];
//   let countID = responseToJson[lastKey].id;
//   countID++;
//   return countID;
// }

function addUser() {
  let email = document.getElementById("signup_email").value;
  let name = document.getElementById("signup_name").value;
  let password = document.getElementById("signup_password").value;
  let cPassword = document.getElementById("signup_c_password").value;
  let userId = 3;

  if (password == cPassword) {
    putUser(`https://joinsusanne-default-rtdb.europe-west1.firebasedatabase.app/users/`, {
      user_name: name,
      user_email: email,
      user_password: password,
      user_id: userId,
    });
  } else {
    alert("Hier stimmt etwas nicht...");
  }
}

async function putUser(path, user = {}) {
  let response = await fetch(path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return (responseToJson = await response.json());
}
