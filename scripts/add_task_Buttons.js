let urgentButton = document.getElementById("urgent_span");
let urgentSvg1Ref = document.getElementById("urgent_svg1");
let urgentSvg2Ref = document.getElementById("urgent_svg2");
let mediumButton = document.getElementById("medium_span");
let mediumSVG1Ref = document.getElementById("medium_svg1");
let mediumSVG2Ref = document.getElementById("medium_svg2");
let lowButton = document.getElementById("low_span");
let lowSVG1Ref = document.getElementById("low_svg1");
let lowSVG2Ref = document.getElementById("low_svg2");
let selectedButton = null;

function selectUrgent() {
  resetSelection();
  setUrgentSelected();
  selectedButton = "urgent";
  handleSelectedPriority(selectedButton);
}

function selectMedium() {
  resetSelection();
  setMediumSelected();
  selectedButton = "medium";
  handleSelectedPriority(selectedButton);
}

function selectLow() {
  resetSelection();
  setLowSelected();
  selectedButton = "low";
  handleSelectedPriority(selectedButton);
}

function resetSelection() {
  if (selectedButton === "urgent") {
    resetUrgent();
  } else if (selectedButton === "medium") {
    resetMedium();
  } else if (selectedButton === "low") {
    resetLow();
  }
}

function setUrgentSelected() {
  urgentButton.classList.remove("urgent-button");
  urgentButton.classList.add("clicked-urgent");
  urgentSvg1Ref.setAttribute("fill", "#ffffff");
  urgentSvg2Ref.setAttribute("fill", "#ffffff");
}

function setMediumSelected() {
  mediumButton.classList.remove("medium-button");
  mediumButton.classList.add("clicked-medium");
  mediumSVG1Ref.setAttribute("fill", "#ffffff");
  mediumSVG2Ref.setAttribute("fill", "#ffffff");
}

function setLowSelected() {
  lowButton.classList.remove("low-button");
  lowButton.classList.add("clicked-low");
  lowSVG1Ref.setAttribute("fill", "#ffffff");
  lowSVG2Ref.setAttribute("fill", "#ffffff");
}

function resetUrgent() {
  urgentButton.classList.remove("clicked-urgent");
  urgentButton.classList.add("urgent-button");
  urgentSvg1Ref.setAttribute("fill", "#FF3D00");
  urgentSvg2Ref.setAttribute("fill", "#FF3D00");
}

function resetMedium() {
  mediumButton.classList.remove("clicked-medium");
  mediumButton.classList.add("medium-button");
  mediumSVG1Ref.setAttribute("fill", "#FFA800");
  mediumSVG2Ref.setAttribute("fill", "#FFA800");
}

function resetLow() {
  lowButton.classList.remove("clicked-low");
  lowButton.classList.add("low-button");
  lowSVG1Ref.setAttribute("fill", "#7AE229");
  lowSVG2Ref.setAttribute("fill", "#7AE229");
}

urgentButton.addEventListener("click", selectUrgent);
mediumButton.addEventListener("click", selectMedium);
lowButton.addEventListener("click", selectLow);

function clearButton() {
  location.reload();
}

function openSelect() {
  if ((onclick = true)) {
    document.getElementById("assigned_inactiv").classList.add("d-none");
    document.getElementById("assigned_activ").classList.remove("d-none");
  }
}

function closeSelect() {
  if ((onclick = true)) {
    document.getElementById("assigned_activ").classList.add("d-none");
    document.getElementById("assigned_inactiv").classList.remove("d-none");
  }
}

function openSelectCategory() {
  if ((onclick = true)) {
    document.getElementById("category_inactiv").classList.add("d-none");
    document.getElementById("category_activ").classList.remove("d-none");
    document.getElementById("category_task_contant").innerHTML = showCategory();
  }
}

function closeSelectCategory() {
  if ((onclick = true)) {
    document.getElementById("category_activ").classList.add("d-none");
    document.getElementById("category_inactiv").classList.remove("d-none");
  }
}

function openSubtasks() {
  if ((onclick = true)) {
    document.getElementById("subtasks_inactiv").classList.add("d-none");
    document.getElementById("subtasks_activ").classList.remove("d-none");
    document.getElementById("category_task_contant").innerHTML = showCategory();
  }
}

function addSubtasks() {
  let subtasksInput = document.getElementById("subtasks_input").value;
  if (subtasksInput.trim() !== "") {
    subTasks.push(subtasksInput);
    let ids = subTasks.length;
    document.getElementById("subtasks_list").innerHTML += addSubtasksToList(
      subtasksInput,
      ids - 1
    );
    document.getElementById("subtasks_input").value = "";
  }
}

function cancelSubtasks() {
  document.getElementById("subtasks_input").value = "";
}

function deleteSubtask(id) {
  document.getElementById(`listItem_${id}`).remove();
  subTasks.splice(id, 1);
}

function changeSubtasksImgs(id) {
  document.getElementById(`list_imgs_activ_${id}`).classList.add("d-none");
  document.getElementById(`list_imgs_inactiv_${id}`).classList.remove("d-none");
}

function changeSubtasksImgsBack(id) {
  document.getElementById(`list_imgs_activ_${id}`).classList.remove("d-none");
  document.getElementById(`list_imgs_inactiv_${id}`).classList.add("d-none");
}
