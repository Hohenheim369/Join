function goBack() {
    window.history.back();
}

document.addEventListener('DOMContentLoaded', () => {
    // Überprüfen, ob jemand eingeloggt ist
    const loggedInUserName = localStorage.getItem('loggedInUserName');
  
    // Wenn kein Benutzername vorhanden ist, füge eine CSS-Klasse hinzu
    if (!loggedInUserName) {
      const body = document.querySelector('body');
      if (body) {
        body.classList.add('not-logged-in');
      }
    }
  });