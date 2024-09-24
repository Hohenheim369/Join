function loginAsGuest() {
  activeUser = {
    name: "Guest",
    initials: "G",
    id: 0,
    color: "#ffffff",
    tasks: [1, 2, 3],
    contacts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  };
  localStorage.removeItem("rememberMeData");
  localStorage.setItem("activeUser", JSON.stringify(activeUser));
  window.location.href = "./html/summary.html";
}

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

async function loadRememberMeData(user) {
  return {
    email: user.email,
    password: user.password,
  };
}

function resetLoginAlert() {
  const noticeField = document.getElementById("login_notice_field");
  noticeField.innerHTML = "";

  document.getElementById("login_email").classList.remove("border-alert");
  document.getElementById("login_password").classList.remove("border-alert");
}

function resetLoginFormInputs() {
  document.getElementById("login_email").value = "";
  document.getElementById("login_password").value = "";

  let legalButton = document.getElementById("login_check_off");
  legalButton.src = `./assets/img/png/check-button-false.png`;
}

function isRememberMeChecked() {
  const checkButton = document.getElementById("login_check_off");
  const isChecked = checkButton.src.includes("true");
  return isChecked;
}

async function handleSuccessfulLogin(user) {
  if(isRememberMeChecked()){
    const saveDAta = await loadRememberMeData(user);
    localStorage.setItem('rememberMeData', JSON.stringify(saveDAta));
  }

  if(!isRememberMeChecked()){
    localStorage.removeItem("rememberMeData");
  }

  const userData = await loadUserData(user);
  
  localStorage.setItem('activeUser', JSON.stringify(userData));
  resetLoginFormInputs();
  window.location.href = "./html/summary.html";
}

function handleLoginError() {
  const noticeField = document.getElementById("login_notice_field");
  noticeField.innerHTML += `<div>Check your email and password. Please try again.</div>`
  document.getElementById("login_email").classList.add("border-alert");
  document.getElementById("login_password").classList.add("border-alert");
  console.error(errorMessage);
}

async function loginAsUser() {
  const loginEmail = document.getElementById("login_email").value.trim();
  const loginPassword = document.getElementById("login_password").value;

  const users = await fetchData('users');
  const activUsers = users.filter((usersId) => usersId !== null);
  const user = activUsers.find(user => user.email.toLowerCase() === loginEmail.toLowerCase());

  resetLoginAlert();

  if (user && user.password === loginPassword) {
    await handleSuccessfulLogin(user);    
  } else {
    handleLoginError();
  }
}