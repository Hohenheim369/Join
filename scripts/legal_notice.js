// window.addEventListener('load', function() {
//     var legalLink = document.getElementById('legal_link');
    
//     if (legalLink) {
//         // Überprüfe, ob der Link bereits deaktiviert ist
//         if (localStorage.getItem('legal_link_disabled') === 'true') {
//             disableLink(legalLink);
//         } else {
//             // Füge einen Klick-Event-Listener hinzu
//             legalLink.addEventListener('click', handleClick);
//         }
//     } else {
//         console.error('Element mit ID "legal_link" nicht gefunden.');
//     }
// });

// function handleClick(event) {
//     event.preventDefault(); // Verhindert die Standardaktion des Links
//     var legalLink = document.getElementById('legal_link');
//     if (legalLink) {
//         disableLink(legalLink);
//     }
// }

// function disableLink(link) {
//     link.classList.add('disabled'); // Füge die 'disabled'-Klasse hinzu
//     localStorage.setItem('legal_link_disabled', 'true'); // Speichere den Status im Local Storage
//     link.removeEventListener('click', handleClick); // Entferne den Event-Listener, um weitere Klicks zu verhindern
// }