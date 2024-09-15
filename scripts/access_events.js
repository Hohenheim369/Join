function initAccess() {
    loginPasswordField();
    signupPasswordField();
    signupConfirmPasswordField();
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const logoContainer = document.querySelector('.logo-container');
    const logo = document.querySelector('.img-logo');
  
    setTimeout(() => {
        logo.style.width = '100px';
        logo.style.height = '122px';
        logo.style.top = '80px';
        logo.style.left = '77px';
        logo.style.transform = 'none';
        logoContainer.style.backgroundColor = 'transparent';
    }, 500);
  
    setTimeout(() => {
        logoContainer.style.pointerEvents = 'none';
        logo.style.zIndex = '1001';
    }, 2000);
  });
  
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
    togglePassword.addEventListener(
      "touchstart",
      () => showPassword(passwordField, togglePassword),
      { passive: true }
    );
    togglePassword.addEventListener(
      "touchend",
      () => hidePassword(passwordField, togglePassword),
      { passive: true }
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