function loginAsGuest() {
  activeUser = {
    name: "Gast",
    initials: "G",
    id: 0,
    color: "#ffffff",
    tasks: [1, 2, 3],
    contacts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  };

  localStorage.setItem("activeUser", JSON.stringify(activeUser));
  window.location.href = "./html/board.html";
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

async function handleSuccessfulLogin(user) {
  const userData = await loadUserData(user);
  console.log(userData);
  
  localStorage.setItem('activeUser', JSON.stringify(userData));
  resetLoginAlert();
  // window.location.href = "./html/board.html";
}

function handleLoginError() {
  const noticeField = document.getElementById("login_notice_field");
  noticeField.innerHTML += `<div>Check your email and password. Please try again.</div>`
  document.getElementById("login_email").classList.add("border-alert");
  document.getElementById("login_password").classList.add("border-alert");
  console.error(errorMessage);
}

function resetLoginFormInputs() {
  document.getElementById("login_email").value = "";
  document.getElementById("login_password").value = "";

  document.getElementById(
    "login_check_off"
  ).src = `/assets/img/png/check-button-false.png`;
}

function resetLoginAlert() {
  const noticeField = document.getElementById("login_notice_field");
  noticeField.innerHTML = "";

  document.getElementById("login_email").classList.remove("border-alert");
  document.getElementById("login_password").classList.remove("border-alert");
}

async function loginAsUser() {
  const email = document.getElementById("login_email").value.trim();
  const password = document.getElementById("login_password").value;

  const users = await fetchUsers();
  const user = users.find(user => user.email === email);
  // console.log(user.password);
   
  if (user && user.password === password) {
    await handleSuccessfulLogin(user);
  } else {
    handleLoginError();
  }
}
