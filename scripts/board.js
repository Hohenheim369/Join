function toggleOverlay() {
  let refOverlay = document.getElementById("board-ticket-overlay");
  refOverlay.classList.toggle("d-none");

  if (!refOverlay.classList.contains("d-none")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}

function bubblingPrevention(event) {
  event.stopPropagation();
}