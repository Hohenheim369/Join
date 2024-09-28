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

function openSelect() {
  if ((onclick = true)) {
    document.getElementById("assigned_inactiv").classList.add("d-none");
    document.getElementById("assigned_activ").classList.remove("d-none");
  }
  activateClickListener()
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
  activateClickListener()
}

function closeSelectCategory() {
  if ((onclick = true)) {
    document.getElementById("category_activ").classList.add("d-none");
    document.getElementById("category_inactiv").classList.remove("d-none");
  }
}

// function activateClickListener(){
//   document.body.addEventListener("click", handleBodyClick);
//   document.getElementById('edit_task_overlay').addEventListener("click", handleBodyClick);
//   document.getElementById('board_addtask_overlay').addEventListener("click", handleBodyClick);
// }

function activateClickListener() {
  document.getElementById('add_task_template').addEventListener("click", handleBodyClick);
  const editTaskOverlay = document.getElementById('edit_task_board');
  const boardAddTaskOverlay = document.getElementById('add_task_board');
  
  if (editTaskOverlay) {
    removeBodyClickListener();
      editTaskOverlay.addEventListener("click", handleBodyClick);
  } else if (boardAddTaskOverlay) {
    removeBodyClickListener();
      boardAddTaskOverlay.addEventListener("click", handleBodyClick);
  }
}

function removeBodyClickListener() {
  document.body.removeEventListener("click", handleBodyClick);
}

function handleBodyClick(event) {
  const contactInput = document.getElementById("assigned_inactiv");
  const contactList = document.getElementById("contact_contant");
  const categoryInput = document.getElementById("category_inactiv");
  const categoryList = document.getElementById("category_task_contant");

  if (
    isClickOutside(
      event,
      contactInput,
      contactList,
      categoryInput,
      categoryList
    )
  ) {
    handleCloseActions();
  }
}

function isClickOutside(
  event,
  contactInput,
  contactList,
  categoryInput,
  categoryList
) {
  return !(
    contactInput.contains(event.target) ||
    contactList.contains(event.target) ||
    categoryInput.contains(event.target) ||
    categoryList.contains(event.target)
  );
}

function handleCloseActions() {
  closeSelect();
  closeSelectCategory();
  removeBodyClickListener();
}

function openSubtasks() {
  if ((onclick = true)) {
    document.getElementById("subtasks_inactiv_img").classList.add("d-none");
    document.getElementById("subtasks_activ_img").classList.remove("d-none");
  }
}

function clearButton() {
  document.getElementById("title_input").value = "";
  document.getElementById("description_textarea").value = "";
  document.getElementById("due_date").value = "";
  const existingUserIndex = userId.map(Number);
  removeUserAssigned(existingUserIndex);
  selectedContacts.length = 0;
  updateSelectedContactsDisplay();
  getContacts();
  selectPrio("medium");
  document.getElementById("category").innerText = "Select task category";
  subTasks.length = 0;
  document.getElementById("subtasks_list").innerHTML = "";
}

function addSubtasks() {
  toggleSubtaskIcons();
  const subtasksInput = getSubtaskInputValue();

  if (isSubtaskInputValid(subtasksInput)) {
    addSubtaskToList(subtasksInput);
    clearSubtaskInput();
  }
}

function toggleSubtaskIcons() {
  document.getElementById("subtasks_inactiv_img").classList.remove("d-none");
  document.getElementById("subtasks_activ_img").classList.add("d-none");
}

function getSubtaskInputValue() {
  return document.getElementById("subtasks_input").value;
}

function isSubtaskInputValid(subtasksInput) {
  return subtasksInput.trim() !== "";
}

function addSubtaskToList(subtasksInput) {
  subTasks.push(subtasksInput);
  const ids = subTasks.length;
  document.getElementById("subtasks_list").innerHTML += addSubtasksToList(
    subtasksInput,
    ids - 1
  );
}

function clearSubtaskInput() {
  document.getElementById("subtasks_input").value = "";
}

function enterValue() {
  openSubtasks();
  let subtasksInput = document.getElementById("subtasks_input");
  subtasksInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addSubtasks();
      subtasksInput.blur();
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
  const input = getInputValues();
  const category = getCategoryValue();
  if (isFormComplete(input, category)) {
    processValidForm();
  } else {
    processInvalidForm();
  }
}

function getInputValues() {
  return {
    input: document.getElementById("title_input").value.trim(),
    date: document.getElementById("due_date").value.trim(),
  };
}

function getCategoryValue() {
  return document.getElementById("category").innerText;
}

function isFormComplete(input, category) {
  return (
    input.input !== "" &&
    input.date !== "" &&
    (category === "Technical Task" || category === "User Story")
  );
}

function processValidForm() {
  resetrequiredFields();
  createTask();
}

function processInvalidForm() {
  requiredFields();
}
