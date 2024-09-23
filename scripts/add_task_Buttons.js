let selectedButton = "medium";

function selectPrio(priority) {
  const prios = ["low", "medium", "urgent"];
  prios.forEach((prio) => resetPrio(prio));
  setPrio(priority);
  selectedButton = priority;
  handleSelectedPriority(selectedButton);
}

function resetPrio(prio) {
  let prioButton = document.getElementById(`${prio}_span`);
  let prioColoredRef = document.getElementById(`prio_${prio}_colored`);
  let prioWhiteRef = document.getElementById(`prio_${prio}_white`);
  prioButton.classList.remove(`clicked-${prio}`);
  prioButton.classList.add(`${prio}-button`);
  prioColoredRef.classList.remove("d-none");
  prioWhiteRef.classList.add("d-none");
}

function setPrio(priority) {
  let prioButton = document.getElementById(`${priority}_span`);
  let prioColoredRef = document.getElementById(`prio_${priority}_colored`);
  let prioWhiteRef = document.getElementById(`prio_${priority}_white`);
  prioButton.classList.remove(`${priority}-button`);
  prioButton.classList.add(`clicked-${priority}`);
  prioColoredRef.classList.add("d-none");
  prioWhiteRef.classList.remove("d-none");
}

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

function enterValue() {
  openSubtasks();
  let subtasksInput = document.getElementById("subtasks_input");
  subtasksInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addSubtasks();
      subtasksInput.blur();
      saveInput(index);
    }
  });
}

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
  let input = document.getElementById("title_input");
  let date = document.getElementById("due_date");
  let category = document.getElementById("category").innerText;
  let createButton = document.getElementById("create_button");
  if (
    input.value.trim() !== "" &&
    date.value.trim() !== "" &&
    (category === "Technical Task" || category === "User Story")
  ) {
    createButton.disabled = false;
    resetrequiredFields();
    createTask();
  } else {
    createButton.disabled = true;
    requiredFields();
    createButton.disabled = false;
  }
}