document.addEventListener('DOMContentLoaded', () => {
    let includesLoadedHandled = false;
  
    document.addEventListener('includesLoaded', handleIncludesLoaded);
    
    function handleIncludesLoaded() {
      if (!includesLoadedHandled) {
        includesLoadedHandled = true;
        handleUserProfile();
      }
    }
  
    function handleUserProfile() {
      let loggedInUserName = localStorage.getItem('loggedInUserName');
      if (loggedInUserName) {
        console.log('Logged-in user name:', loggedInUserName);
        let initials = getInitials(loggedInUserName);
        updateInitialsElement(initials);
      } else {
        console.log('No logged-in user name found');
      }
    }
  
    function getInitials(userName) {
      let nameParts = userName.split(' ');
      return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    }
  
    function updateInitialsElement(initials) {
      let initialsElement = document.getElementById('user_profile_initials');
      if (initialsElement) {
        initialsElement.innerHTML = `${initials}`;
        initialsElement.addEventListener('click', toggleLogOutVisibility);
      }
      console.log(initials);
    }
  
    function toggleLogOutVisibility() {
      let logOutElement = document.getElementById('log_out');
      if (logOutElement) {
        logOutElement.classList.toggle('d-none');
      }
    }
  
    document.addEventListener('click', handleDocumentClick);
  
    function handleDocumentClick(event) {
      let logOutElement = document.getElementById('log_out');
      let initialsElement = document.getElementById('user_profile_initials');
  
      if (logOutElement && !logOutElement.contains(event.target) &&
          !initialsElement.contains(event.target) &&
          !event.target.closest('#log_out')) {
        logOutElement.classList.add('d-none');
      }
    }
  });
  
  function logout() {
    // Wert aus dem lokalen Speicher löschen
    localStorage.removeItem('loggedInUserName');
    
  }
  
  