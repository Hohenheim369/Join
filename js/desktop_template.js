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

  function logOut() {
    // Wert aus dem lokalen Speicher löschen
    localStorage.removeItem('loggedInUserName');
    
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    function setActiveLink() {
      const currentPath = window.location.pathname;
      const links = document.querySelectorAll('.link-sidebar');
  
      links.forEach(link => {
        const href = link.getAttribute('href');
        const img = link.querySelector('img');
  
        if (currentPath === href) {
          link.classList.add('active');
          // Bild für den aktiven Link ändern
          img.src = img.src.replace('-grey', '-white'); // Aktive Farbe
        } else {
          link.classList.remove('active');
          // Bild für inaktive Links zurücksetzen
          img.src = img.src.replace('-white', '-grey'); // Inaktive Farbe
        }
      });
    }
  
    // Initialer Aufruf zum Setzen der aktiven Klasse
    setActiveLink();
  
    // Event-Listener für Klicks auf Links
    document.querySelectorAll('.link-sidebar').forEach(link => {
      link.addEventListener('click', () => {
        // Speichern des aktuellen Pfads in localStorage
        localStorage.setItem('activePage', window.location.pathname);
      });
    });
  
    // Setze das Bild basierend auf dem gespeicherten Pfad in localStorage
    window.addEventListener('load', () => {
      const savedPath = localStorage.getItem('activePage');
      if (savedPath === window.location.pathname) {
        setActiveLink();
      }
    });
  });