// Funktion zum Laden des Templates
function loadTemplate() {
  fetch("/assets/templates/desktop_template.xml")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Netzwerkantwort war nicht okay");
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById("desktop_template").innerHTML = data;
      
      // Custom Event "loadTemplated" auslösen, nachdem das Template geladen wurde
      const event = new Event("loadTemplated");
      document.dispatchEvent(event);
    })
    .catch((error) => {
      console.error("Fehler beim Laden des Templates:", error);
    });
}

// Template beim Laden der Seite einbinden und dann die Sichtbarkeit setzen
window.addEventListener("DOMContentLoaded", loadTemplate);

// Sobald das Template geladen ist, die Sichtbarkeit des Bodys auf sichtbar setzen
document.addEventListener("loadTemplated", () => {
  document.body.style.visibility = "visible";
});