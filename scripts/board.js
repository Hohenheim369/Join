document.addEventListener("DOMContentLoaded", function () {
  const searchBox = document.getElementById("search_box");
  const searchInput = document.getElementById("search_task");

  searchInput.addEventListener("focus", () => {
    searchBox.classList.add("active");
  });

  searchInput.addEventListener("blur", () => {
    searchBox.classList.remove("active");
  });
});

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