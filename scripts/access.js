function toggleAccessWindow() {
    let logIn = document.getElementById("Log_in");
    let signUp = document.getElementById("Sign_up");
    let changeAccess = document.getElementById("change_access");

    logIn.classList.toggle("d-none");
    signUp.classList.toggle("d-none");
    changeAccess.classList.toggle("d-none");
  }