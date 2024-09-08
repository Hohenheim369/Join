let BASE_URL = "https://join-b72fb-default-rtdb.europe-west1.firebasedatabase.app/"


function toggleCheckButton(CheckButtonId) {
    const checkButton = document.getElementById(CheckButtonId);
    const isChecked = checkButton.src.includes("true");
    checkButton.src = `/assets/img/png/check-button-${isChecked ? 'false' : 'true'}.png`;
  }

function openLegal(LinkToSide){
    window.open(LinkToSide, '_blank');
    // Hier fehlt noch die Funktion, die im desktop_template.html der Id icon_bar ein d-none hinzufügt
}