// window.addEventListener('load', function() {
//     var policyLink = document.getElementById('policy_link');
    
//     if (policyLink) {
//         // Überprüfe, ob der Link bereits deaktiviert ist
//         if (localStorage.getItem('policy_link_disabled') === 'true') {
//             disableLink(policyLink);
//         } else {
//             // Füge einen Klick-Event-Listener hinzu
//             policyLink.addEventListener('click', handleClick);
//         }
//     } else {
//         console.error('Element mit ID "policy_link" nicht gefunden.');
//     }
// });

// function handleClick(event) {
//     event.preventDefault(); // Verhindert die Standardaktion des Links
//     var policyLink = document.getElementById('policy_link');
//     if (policyLink) {
//         disableLink(policyLink);
        
//         // Verzögere den Seitenwechsel, um sicherzustellen, dass der Status gespeichert wird
//         setTimeout(() => {
//             window.location.href = policyLink.href;
//         }, 100); // 100 ms Verzögerung
//     }
// }

// function disableLink(link) {
//     link.classList.add('disabled'); // Füge die 'disabled'-Klasse hinzu
//     localStorage.setItem('policy_link_disabled', 'true'); // Speichere den Status im Local Storage
//     link.removeEventListener('click', handleClick); // Entferne den Event-Listener, um weitere Klicks zu verhindern
// }