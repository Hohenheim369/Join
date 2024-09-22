let urgentButton = document.getElementById("urgent_span");
let urgentColoredRef = document.getElementById("prio_urgent_colored");
let urgentWhiteRef = document.getElementById("prio_urgent_white");
let mediumButton = document.getElementById("medium_span");
let mediumColoredRef = document.getElementById("prio_medium_colored");
let mediumWhiteRef = document.getElementById("prio_medium_white");
let lowButton = document.getElementById("low_span");
let lowColoredRef = document.getElementById("prio_low_colored");
let lowWhiteRef = document.getElementById("prio_low_white");
let selectedButton = "medium";

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
  urgentColoredRef.classList.add("d-none");
  urgentWhiteRef.classList.remove("d-none");
}

function setMediumSelected() {
  mediumButton.classList.remove("medium-button");
  mediumButton.classList.add("clicked-medium");
  mediumColoredRef.classList.add("d-none");
  mediumWhiteRef.classList.remove("d-none");
}

function setLowSelected() {
  lowButton.classList.remove("low-button");
  lowButton.classList.add("clicked-low");
  lowColoredRef.classList.add("d-none");
  lowWhiteRef.classList.remove("d-none");
}

function resetUrgent() {
  urgentButton.classList.remove("clicked-urgent");
  urgentButton.classList.add("urgent-button");
  urgentColoredRef.classList.remove("d-none");
  urgentWhiteRef.classList.add("d-none");
}

function resetMedium() {
  mediumButton.classList.remove("clicked-medium");
  mediumButton.classList.add("medium-button");
  mediumColoredRef.classList.remove("d-none");
  mediumWhiteRef.classList.add("d-none");
}

function resetLow() {
  lowButton.classList.remove("clicked-low");
  lowButton.classList.add("low-button");
  lowColoredRef.classList.remove("d-none");
  lowWhiteRef.classList.add("d-none");
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
    document.getElementById("subtasks_inactiv_img").classList.add("d-none");
    document.getElementById("subtasks_activ_img").classList.remove("d-none");
  }
}

function addSubtasks() {
  document.getElementById("subtasks_inactiv_img").classList.remove("d-none");
  document.getElementById("subtasks_activ_img").classList.add("d-none");
  let subtasksInput = document.getElementById("subtasks_input").value;
  if (subtasksInput.trim() !== "") {
    subTasks.push({ subTaskName: subtasksInput, done: false });
    let ids = subTasks.length;
    document.getElementById("subtasks_list").innerHTML += addSubtasksToList(
      subtasksInput,
      ids - 1
    );
    document.getElementById("subtasks_input").value = "";
  }
}

document
  .getElementById("subtasks_input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addSubtasks();
      this.blur();
    }
  });

function cancelSubtasks() {
  document.getElementById("subtasks_inactiv_img").classList.remove("d-none");
  document.getElementById("subtasks_activ_img").classList.add("d-none");
  document.getElementById("subtasks_input").value = "";
}

function deleteSubtask(id) {
  document.getElementById(`listItem_${id}`).remove();
  subTasks.splice(id, 1);
}

function toggleSubtasksImgs(id) {
  document.getElementById(`list_imgs_activ_${id}`).classList.toggle("d-none");
  document.getElementById(`list_imgs_inactiv_${id}`).classList.toggle("d-none");
  document.getElementById(`list_subtask_${id}`).classList.toggle("d-none");
  document.getElementById(`input_subtask_${id}`).classList.toggle("d-none");
}

function enableButton() {
  let input = document.getElementById('title_input');
  let date = document.getElementById('due_date');
  let category = document.getElementById('category').innerText;
  let createButton = document.getElementById('create_button');
  if (input.value.trim() !== '' && date.value.trim() !== '' && 
      (category === "Technical Task" || category === "User Story")) {
      createButton.disabled = false;
      resetrequiredFields();
  } else {
      createButton.disabled = true;
      requiredFields();
  }
}

document.getElementById('title_input').addEventListener('input', enableButton);
document.getElementById('due_date').addEventListener('input', enableButton);
document.getElementById('category_task_contant').addEventListener("click",enableButton)
document.getElementById('create_button').addEventListener('click', function() {
  let createButton = document.getElementById('create_button');
  if (!createButton.disabled) {
    createTask();
  }
});