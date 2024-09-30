function signUp(){
  const email = document.getElementById("signup_email").value.trim();
  const name = document.getElementById("signup_name").value.trim();
  const password = document.getElementById("signup_password").value;
  const cPassword = document.getElementById("signup_c_password").value;

  signUpProcess(email, name, password, cPassword);
}

async function signUpProcess(email, name, password, cPassword) {
  resetSignupAlert();
  await validateInputs(email, name, password, cPassword);  
  const initials = getUserInitials(name);
  await addUser(email, name, password, initials);  
  resetSignupFormInputs();
  await showSuccessfullySignedUp();
  localStorage.removeItem("rememberMeData");
  toggleAccessWindow();
}

function resetSignupAlert() {
  const noticeField = document.getElementById("signup_notice_field");
  noticeField.innerHTML = "";

  document.getElementById("signup_email").classList.remove("border-alert");
  document.getElementById("signup_name").classList.remove("border-alert");
  document.getElementById("signup_password").classList.remove("border-alert");
  document.getElementById("signup_c_password").classList.remove("border-alert");
}

async function validateInputs(email, name, password, cPassword) {
  const noticeField = document.getElementById("signup_notice_field");
  const isEmailValid = await validateEmail(email, noticeField);
  const isNameValid = validateName(name, noticeField);
  const isPasswordValid = validatePassword(password, cPassword, noticeField);
  const isLegalAccepted = validateLegalAcceptance(noticeField);

  const isValid =
    isEmailValid && isNameValid && isPasswordValid && isLegalAccepted;

  if (!isValid) {
    throw new Error("Error in validation");
  }
  return true;
}

async function validateEmail(email, noticeField) {
  const emailField = document.getElementById("signup_email");

  if (!(await checkEmailExists(email, noticeField, emailField))) {
    return false;
  }

  if (!checkEmailFormat(email, noticeField, emailField)) {
    return false;
  }

  return true;
}

async function checkEmailExists(email, noticeField, emailField) {
  try {
    const emailExists = await isEmailRegistered(email);
    if (emailExists) {
      console.log("Email already exists.");
      emailField.classList.add("border-alert");
      noticeField.innerHTML += `<div>This email address is already registered.</div>`;
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error checking email existence:", error);
    return false;
  }
}

async function isEmailRegistered(email) {
  const users = await fetchData("users");
  if (!users) {
    return false;
  }
  return Object.values(users).some(
    (user) => user && user.email.toLowerCase() === email.toLowerCase()
  );
}

function checkEmailFormat(email, noticeField, emailField) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error("Invalid email format.");
    emailField.classList.add("border-alert");
    noticeField.innerHTML += `<div>Please enter a valid email address.</div>`;
    return false;
  }
  return true;
}

function validateName(name, noticeField) {
  let isValidName = true;
  const nameField = document.getElementById("signup_name");

  if (!checkNameNotEmpty(name, noticeField, nameField)) {
    isValidName = false;
  }

  if (!checkNameCharacters(name, noticeField, nameField)) {
    isValidName = false;
  }

  return isValidName;
}

function checkNameNotEmpty(name, noticeField, nameField) {
  if (name.trim().length < 3) {
    console.log("No name entered.");
    nameField.classList.add("border-alert");
    noticeField.innerHTML += `<div>Please enter a name with at least 3 letters.</div>`;
    return false;
  }
  return true;
}

function checkNameCharacters(name, noticeField, nameField) {
  const nameRegex = /^[A-Za-zÄäÖöÜüß\s]+$/;

  if (!nameRegex.test(name)) {
    console.log("Name contains invalid characters.");
    nameField.classList.add("border-alert");
    noticeField.innerHTML += `<div>Your name should only contain letters and spaces.</div>`;
    return false;
  }
  return true;
}

function validatePassword(password, cPassword, noticeField) {
  let isValidPassword = true;
  const passwordField = document.getElementById("signup_password");
  const cPasswordField = document.getElementById("signup_c_password");

  if (!checkPasswordComplexity(password, noticeField, passwordField)) {
    isValidPassword = false;
  }

  if (
    !checkPasswordMatch(
      password,
      cPassword,
      noticeField,
      passwordField,
      cPasswordField
    )
  ) {
    isValidPassword = false;
  }
  return isValidPassword;
}

function checkPasswordComplexity(password, noticeField, passwordField) {
  const complexityRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;

  if (!complexityRegex.test(password)) {
    console.log("Password does not meet complexity requirements.");
    passwordField.classList.add("border-alert");
    noticeField.innerHTML += `<div>Your password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.</div>`;
    return false;
  }
  return true;
}

function checkPasswordMatch(
  password,
  cPassword,
  noticeField,
  passwordField,
  cPasswordField
) {
  if (password !== cPassword) {
    console.log("Passwords do not match.");
    passwordField.classList.add("border-alert");
    cPasswordField.classList.add("border-alert");
    noticeField.innerHTML += `<div>Your passwords don't match. Please try again.</div>`;
    return false;
  }
  return true;
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

function isLegalAccepted() {
  const checkButton = document.getElementById("signup_check_off");
  const isChecked = checkButton.src.includes("true");
  return isChecked;
}

function getUserInitials(name) {
  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  if (words.length >= 2) {
    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  }
}

async function addUser(email, name, password, initials) {
  const userId = await getNewId("users");
  const userData = createUserData(name, initials, email, password, userId);

  try {
    const result = await postData(`users/${userId - 1}/`, userData);
    handleRegistrationResult(result);
  } catch (error) {
    console.error("Error during registration:", error);
  }
}

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

function handleRegistrationResult(result) {
  if (result) {
    console.log("Registration successful!");
  } else {
    console.log("There was a problem with the registration. Please try again.");
  }
}

function resetSignupFormInputs() {
  document.getElementById("signup_email").value = "";
  document.getElementById("signup_name").value = "";
  document.getElementById("signup_password").value = "";
  document.getElementById("signup_c_password").value = "";

  let legalButton = document.getElementById("signup_check_off");
  legalButton.src = `./assets/img/png/check-button-false.png`;
  legalButton.classList.remove("bg-alert");
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
      }, 1500);
    }, 50);
  });
}

function removeNoticeButtonBg() {
  const checkButton = document.getElementById("signup_check_off");
  checkButton.classList.remove("bg-alert");
}
