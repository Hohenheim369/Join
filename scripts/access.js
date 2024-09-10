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

async function getNewUserId() {
  let response = await fetch(
    `https://joinsusanne-default-rtdb.europe-west1.firebasedatabase.app/users/.json`
  );
  let responseToJson = await response.json();
  let newUserId;
  if (responseToJson == null) {
    newUserId = 1;
  } else {
    newUserId = countId(responseToJson);
  }
  return newUserId;
}

function countId(responseToJson) {
  let keys = Object.keys(responseToJson);
  let lastKey = keys[keys.length - 1];
  let countID = responseToJson[lastKey].user_id;
  countID++;
  return countID;
}

async function addUser() {
  const email = document.getElementById("signup_email").value.trim();
  const name = document.getElementById("signup_name").value.trim();
  const password = document.getElementById("signup_password").value;
  const cPassword = document.getElementById("signup_c_password").value;
  const userId = await getNewUserId();

  if (!email || !name || !password || !cPassword) {
    console.log("Please fill in all fields.");
    return;
  }

  if (password !== cPassword) {
    console.log("Passwords do not match.");
    return;
  }

  try {
    const result = await postData(`${BASE_URL_S}users/${userId-1}/`, {
      user_name: name,
      user_email: email,
      user_password: password, // In practice, the password should be hashed
      user_id: userId,
    });

    if (result) {
      // Firebase returns a "name" property when the entry is successfully created
      console.log("Registration successful!");
      // Here you could perform additional actions, e.g., reset the form or redirect the user
    } else {
      console.log(
        "There was a problem with the registration. Please try again."
      );
    }
  } catch (error) {
    console.error("Error during registration:", error);
    console.log("An error occurred. Please try again later.");
  }
}

async function postData(path = "", data = {}) {
  const response = await fetch(path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
