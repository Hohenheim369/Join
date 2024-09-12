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

async function addUser() {
  const email = document.getElementById("signup_email").value.trim();
  const name = document.getElementById("signup_name").value.trim();
  const password = document.getElementById("signup_password").value;
  const cPassword = document.getElementById("signup_c_password").value;
  const userId = await getNewUserId();
  let acceptedLegal = isLegalAccepted();
  //Initialen ermitteln und übergeben

  if (!validateInputs(email, name, password, cPassword, acceptedLegal)) {
    return;
  }

  await performRegistrationWithErrorHandling(name, email, password, userId);
}
//global outsourced if finished 
async function getNewUserId() {
  let response = await fetch(`${BASE_URL_S}users/.json`);
  let responseToJson = await response.json();
  let newUserId;
  if (responseToJson == null) {
    newUserId = 1;
  } else {
    newUserId = countId(responseToJson);
  }
  return newUserId;
}

function isLegalAccepted() {
  const checkButton = document.getElementById("signup_check_off");
  const isChecked = checkButton.src.includes("true");
  return isChecked;
}

function validateInputs(email, name, password, cPassword, acceptedLegal) {
  if (!email || !name || !password || !cPassword) {
    console.log("Please fill in all fields.");
    return false;
  }
  if (password !== cPassword) {
    console.log("Passwords do not match.");
    //Hinweistext und change bordercolor
    return false;
  }
  if (!acceptedLegal) {
    console.log("Please accept the Legal notice.");
    return false;
  }
  return true;
}

async function performRegistrationWithErrorHandling(
  name,
  email,
  password,
  userId
) {
  try {
    const result = await postData(`${BASE_URL_S}users/${userId - 1}/`, {
      name: name,
      email: email,
      password: password,
      id: userId,
      color: "#ffffff",
    });
    handleRegistrationResult(result);
  } catch (error) {
    console.error("Error during registration:", error);
    console.log("An error occurred. Please try again later.");
  }
}

function handleRegistrationResult(result) {
  if (result) {
    console.log("Registration successful!");
    resetForm();
    // ToDos an dieser Stelle: Felder zurück setzen, Seite neu laden
  } else {
    console.log("There was a problem with the registration. Please try again.");
  }
}

function resetForm() {
  document.getElementById("signup_email").value = "";
  document.getElementById("signup_name").value = "";
  document.getElementById("signup_password").value = "";
  document.getElementById("signup_c_password").value = "";
  toggleCheckButton(`signup_check_off`);
}
