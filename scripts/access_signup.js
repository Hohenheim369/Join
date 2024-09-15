const BASE_URL_S =
  "https://joinsusanne-default-rtdb.europe-west1.firebasedatabase.app/";

function removeNoticeButtonBg() {
  const checkButton = document.getElementById("signup_check_off");
  checkButton.classList.remove("bg-alert");
}

function isLegalAccepted() {
  const checkButton = document.getElementById("signup_check_off");
  const isChecked = checkButton.src.includes("true");
  return isChecked;
}

function validateLegalAcceptance(noticeField) {
  const acceptedLegal = isLegalAccepted();
  if (!acceptedLegal) {
    const checkButton = document.getElementById("signup_check_off");
    console.log("Please accept the Legal notice.");
    noticeField.innerHTML += `<div>Please accept the Legal notice.</div>`;
    checkButton.classList.add("bg-alert");
    return false;
  }
  return true;
}

async function checkEmailFormat(email, noticeField) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log("Invalid email format.");
    noticeField.innerHTML += `<div>Please enter a valid email address.</div>`;
    return false;
  }
  return true;
}

async function fetchSignInUsers() {
  const response = await fetch(`${BASE_URL_S}users.json`);
  return await response.json();
}

async function isEmailRegistered(email) {
  const users = await fetchSignInUsers();
  if (!users) {
    return false;
  }
  return Object.values(users).some((user) => user && user.email === email);
}

async function checkEmailExists(email, noticeField) {
  try {
    const emailExists = await isEmailRegistered(email);
    if (emailExists) {
      console.log("Email already exists.");
      noticeField.innerHTML += `<div>This email address is already registered.</div>`;
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error checking email existence:", error);
    noticeField.innerHTML += `<div>An error occurred. Please try again later.</div>`;
    return false;
  }
}

async function validateEmail(email, noticeField) {
  const emailField = document.getElementById("signup_email");

  if (!(await checkEmailFormat(email, noticeField))) {
    emailField.classList.add("border-alert");
    return false;
  }

  if (!(await checkEmailExists(email, noticeField))) {
    emailField.classList.add("border-alert");
    return false;
  }

  return true;
}

function checkNameNotEmpty(name, noticeField) {
  if (name.trim() === "") {
    console.log("No name entered.");
    noticeField.innerHTML += `<div>Please enter a name.</div>`;
    return false;
  }
  return true;
}

function checkNameCharacters(name, noticeField) {
  const nameRegex = /^[A-Za-zÄäÖöÜüß\s]+$/;

  if (!nameRegex.test(name)) {
    console.log("Name contains invalid characters.");
    noticeField.innerHTML += `<div>Your name should only contain letters and spaces.</div>`;
    return false;
  }
  return true;
}

function validateName(name, noticeField) {
  let isValidName = true;
  const nameField = document.getElementById("signup_name");

  if (!checkNameNotEmpty(name, noticeField)) {
    nameField.classList.add("border-alert");
    isValidName = false;
  }

  if (!checkNameCharacters(name, noticeField)) {
    nameField.classList.add("border-alert");
    isValidName = false;
  }

  return isValidName;
}

function checkPasswordMatch(password, cPassword, noticeField) {
  if (password !== cPassword) {
    console.log("Passwords do not match.");
    noticeField.innerHTML += `<div>Your passwords don't match. Please try again.</div>`;
    return false;
  }
  return true;
}

function checkPasswordComplexity(password, noticeField) {
  const complexityRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;

  if (!complexityRegex.test(password)) {
    console.log("Password does not meet complexity requirements.");
    noticeField.innerHTML += `<div>Your password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.</div>`;
    return false;
  }
  return true;
}

function validatePassword(password, cPassword, noticeField) {
  let isValidPassword = true;
  const passwordField = document.getElementById("signup_password");
  const cPasswordField = document.getElementById("signup_c_password");

  if (!checkPasswordComplexity(password, noticeField)) {
    passwordField.classList.add("border-alert");
    isValidPassword = false;
  }

  if (!checkPasswordMatch(password, cPassword, noticeField)) {
    passwordField.classList.add("border-alert");
    cPasswordField.classList.add("border-alert");
    isValidPassword = false;
  }
  return isValidPassword;
}

async function validateInputs(email, name, password, cPassword) {
  const noticeField = document.getElementById("notice_field");
  noticeField.innerHTML = "";

  const validations = [
    () => validateEmail(email, noticeField),
    () => validateName(name, noticeField),
    () => validatePassword(password, cPassword, noticeField),
    () => validateLegalAcceptance(noticeField),
  ];

  const results = await Promise.all(
    validations.map((validation) => validation())
  );
  const isValid = results.every((result) => result === true);

  if (!isValid) {
    throw new Error("Error in validation");
  }

  return true;
}

function getUserInitials(name) {
  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  if (words.length === 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

  if (words.length >= 3) {
    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  }
}

async function getNewId() {
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

function handleRegistrationResult(result) {
  if (result) {
    console.log("Registration successful!");
  } else {
    console.log("There was a problem with the registration. Please try again.");
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

function createUserData(name, initials, email, password, userId) {
  return {
    name,
    initials,
    email,
    password,
    id: userId,
    color: "#ffffff",
    tasks: [1, 2, 3],
  };
}

async function addUser(email, name, password, initials) {
  const userId = await getNewId();
  const userData = createUserData(name, initials, email, password, userId);

  try {
    const result = await postData(
      `${BASE_URL_S}users/${userId - 1}/`,
      userData
    );
    handleRegistrationResult(result);
  } catch (error) {
    handleRegistrationError(error);
  }
}

function handleRegistrationError(error) {
  console.error("Error during registration:", error);
  console.log("An error occurred. Please try again later.");
}

function handleRegistrationResult(result) {
  if (result) {
    console.log("Registration successful!");
  } else {
    console.log("There was a problem with the registration. Please try again.");
  }
}

function resetFormInputs() {
  document.getElementById("signup_email").value = "";
  document.getElementById("signup_name").value = "";
  document.getElementById("signup_password").value = "";
  document.getElementById("signup_c_password").value = "";

  document.getElementById(
    "signup_check_off"
  ).src = `/assets/img/png/check-button-false.png`;
}

function resetFormBorders() {
  document.getElementById("signup_email").classList.remove("border-alert");
  document.getElementById("signup_password").classList.remove("border-alert");
  document.getElementById("signup_c_password").classList.remove("border-alert");
}

function showSuccessfullySignedUp() {
  return new Promise((resolve) => {
    const overlay = document.getElementById("successfully_signed_up");
    overlay.classList.remove("d-none");
    overlay.classList.add("active");

    setTimeout(() => {
      overlay.classList.add("visible");
      setTimeout(() => {
        overlay.classList.remove("active", "visible");
        overlay.classList.add("d-none");
        resolve();
      }, 1000);
    }, 50);
  });
}

async function signUpProcess() {
  const email = document.getElementById("signup_email").value.trim();
  const name = document.getElementById("signup_name").value.trim();
  const password = document.getElementById("signup_password").value;
  const cPassword = document.getElementById("signup_c_password").value;

  resetFormBorders();
  await validateInputs(email, name, password, cPassword);

  const initials = getUserInitials(name);

  await addUser(email, name, password, initials);
  resetFormInputs();
  resetFormBorders();
  await showSuccessfullySignedUp();
  toggleAccessWindow();
}
