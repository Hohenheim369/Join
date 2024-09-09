let BASE_URL =
  "https://join-b72fb-default-rtdb.europe-west1.firebasedatabase.app/";

function toggleCheckButton(CheckButtonId) {
  const checkButton = document.getElementById(CheckButtonId);
  const isChecked = checkButton.src.includes("true");
  checkButton.src = `/assets/img/png/check-button-${
    isChecked ? "false" : "true"
  }.png`;
}

function openLegal(LinkToSide){
  // Öffne den Link in einem neuen Tab
  window.open(LinkToSide, '_blank');
  
  // Stelle sicher, dass die Seite geladen ist und die Elemente vorhanden sind
  document.addEventListener("DOMContentLoaded", function() {
      // Füge die "d-none" Klasse zu den gewünschten Elementen hinzu
      const headerIcons = document.getElementById('header_icons');
      const iconBar = document.getElementById('icon_bar');

      if (headerIcons && iconBar) {
          headerIcons.classList.add("d-none");
          iconBar.classList.add("d-none");
      } else {
          console.error('Die Elemente wurden nicht gefunden.');
      }
  });
}
