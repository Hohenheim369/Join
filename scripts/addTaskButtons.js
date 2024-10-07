/**
 * This function activates all prio functions to handle them
 *
 * @param {string} priority - text of the selected prio button
 */
function selectPrio(priority) {
  let prios = ["low", "medium", "urgent"];
  prios.forEach((prio) => resetPrio(prio));
  setPrio(priority);
  selectedButton = priority;
  handleSelectedPriority(selectedButton);
}

/**
 * This function resets the selection of a prio button
 *
 * @param {string} prio - text of the selected prio button
 */
function resetPrio(prio) {
  let prioButton = document.getElementById(`${prio}_span`);
  let prioColoredRef = document.getElementById(`prio_${prio}_colored`);
  let prioWhiteRef = document.getElementById(`prio_${prio}_white`);
  prioButton.classList.remove(`clicked-${prio}`);
  prioButton.classList.add(`${prio}-button`);
  prioColoredRef.classList.remove("d-none");
  prioWhiteRef.classList.add("d-none");
}

/**
 * This function sets the selection of a prio button
 *
 * @param {string} priority - text of the selected prio button
 */
function setPrio(priority) {
  let prioButton = document.getElementById(`${priority}_span`);
  let prioColoredRef = document.getElementById(`prio_${priority}_colored`);
  let prioWhiteRef = document.getElementById(`prio_${priority}_white`);
  prioButton.classList.remove(`${priority}-button`);
  prioButton.classList.add(`clicked-${priority}`);
  prioColoredRef.classList.add("d-none");
  prioWhiteRef.classList.remove("d-none");
}

/** This function opens a select window */
function openSelect() {
  if ((onclick = true)) {
    document.getElementById("assigned_inactiv").classList.add("d-none");
    document.getElementById("assigned_activ").classList.remove("d-none");
  }
}

/** This function closes a select window */
function closeSelect() {
  if ((onclick = true)) {
    document.getElementById("assigned_activ").classList.add("d-none");
    document.getElementById("assigned_inactiv").classList.remove("d-none");
  }
}

/** This function opens a select window */
function openSelectCategory() {
  if ((onclick = true)) {
    document.getElementById("category_inactiv").classList.add("d-none");
    document.getElementById("category_activ").classList.remove("d-none");
    document.getElementById("category_task_contant").innerHTML = showCategory();
  }
}

/** This function closes a select window */
function closeSelectCategory() {
  if ((onclick = true)) {
    document.getElementById("category_activ").classList.add("d-none");
    document.getElementById("category_inactiv").classList.remove("d-none");
  }
}

/** This function changes the subtasks images */
function openSubtasks() {
  if ((onclick = true)) {
    document.getElementById("subtasks_inactiv_img").classList.add("d-none");
    document.getElementById("subtasks_activ_img").classList.remove("d-none");
  }
}

/** This function resets all Fields and selections to default */
function clearButton() {
  document.getElementById("title_input").value = "";
  document.getElementById("description_textarea").value = "";
  document.getElementById("due_date").value = "";
  let existingUserIndex = userId.map(Number);
  removeUserAssigned(existingUserIndex);
  selectedContacts.length = 0;
  updateSelectedContactsDisplay();
  getContacts();
  selectPrio("medium");
  document.getElementById("category").innerText = "Select task category";
  subTasks.length = 0;
  document.getElementById("subtasks_list").innerHTML = "";
}

/** This function handles the actions after adding a subtask */
function addSubtasksHandle() {
  toggleSubtaskIcons();
  let subtasksInput = document.getElementById("subtasks_input").value;

  if (subtasksInput.trim() !== "") {
    addSubtaskToList(subtasksInput);
    document.getElementById("subtasks_input").value = "";
  }
}

/** This function toggles the subtask images */
function toggleSubtaskIcons() {
  document.getElementById("subtasks_inactiv_img").classList.remove("d-none");
  document.getElementById("subtasks_activ_img").classList.add("d-none");
}

/**
 * This function add a subtask to the list below
 *
 * @param {string} subtasksInput - is the text input
 */
function addSubtaskToList(subtasksInput) {
  subTasks.push(subtasksInput);
  let ids = subTasks.length;
  document.getElementById("subtasks_list").innerHTML += addSubtasksToList(
    subtasksInput,
    ids - 1
  );
}

/** This function allows the user to enter the value with the enter key */
function enterValue() {
  openSubtasks();
  let subtasksInput = document.getElementById("subtasks_input");
  subtasksInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addSubtasksHandle();
      document.getElementById("subtasks_inactiv_img").classList.add("d-none");
      document.getElementById("subtasks_activ_img").classList.remove("d-none");
    }
  });
}

/**
 * This function adds and removes d-none
 *
 * @param {Object} event - PointerEvent
 */
function changeSubtasksImagesClick(event) {
  if (
    event.target.id === "add_task_board" ||
    "edit_task_board" ||
    "add_task_content"
  ) {
    document.getElementById("subtasks_inactiv_img").classList.remove("d-none");
    document.getElementById("subtasks_activ_img").classList.add("d-none");
  }
}

/**
 * This function prevents from executing on the Parend element
 *
 * @param {Object} event - PointerEvent
 */
function changeSubtasksImagesClickPrevention(event) {
  event.stopPropagation();
}

/** This function cancels the subtask and changes the element back to default */
function cancelSubtasks() {
  document.getElementById("subtasks_inactiv_img").classList.remove("d-none");
  document.getElementById("subtasks_activ_img").classList.add("d-none");
  document.getElementById("subtasks_input").value = "";
}

/**
 * This function allows the user to delet a subtask
 *
 * @param {number} id - Id of the subtask list element
 */
function deleteSubtask(id) {
  document.getElementById(`listItem_${id}`).remove();
  document.getElementById(`listItem_input_${id}`).remove();
  subTasks.splice(id, 1);
  editSubTaskIndex = null;
}

/**
 * This function toggles the images of the list elements
 *
 * @param {number} id - Id of the subtask list element
 */
function toggleSubtasksImgs(id) {
  document.getElementById(`list_imgs_activ_${id}`).classList.toggle("d-none");
  document.getElementById(`list_imgs_inactiv_${id}`).classList.toggle("d-none");
  document.getElementById(`listItem_${id}`).classList.toggle("d-none");
  document.getElementById(`listItem_${id}`).classList.toggle("list-item");
  document.getElementById(`input_subtask_${id}`).classList.toggle("d-none");
}

/** This function enables the create task button */
function enableButton() {
  let input = getInputValues();
  let category = getCategoryValue();
  if (isFormComplete(input, category)) {
    processValidForm();
  } else {
    processInvalidForm();
  }
}

/**
 * This function gets the Input values
 *
 * @returns - the values as key
 */
function getInputValues() {
  return {
    input: document.getElementById("title_input").value.trim(),
    date: document.getElementById("due_date").value.trim(),
  };
}

/**
 * This function gets the Category value
 *
 * @returns - the inner text of the element
 */
function getCategoryValue() {
  return document.getElementById("category").innerText;
}

/**
 * This function checks if the elements are filled and valid
 *
 * @param {string} input - key for the title and date value
 * @param {string} category - key for the category text
 * @returns - true or false of completion
 */
function isFormComplete(input, category) {
  return (
    input.input !== "" &&
    input.date !== "" &&
    (category === "Technical Task" || category === "User Story")
  );
}

/** This function precesses through the valid form */
function processValidForm() {
  resetrequiredFields();
  createTask();
}

/** This function precesses through the invalid form */
function processInvalidForm() {
  requiredFields();
}

/** This function disables days past by in the calendar */
function setDate(){
let today = new Date();
let dd = String(today.getDate()).padStart(2, "0");
let mm = String(today.getMonth() + 1).padStart(2, "0");
let yyyy = today.getFullYear();
let formattedDate = `${yyyy}-${mm}-${dd}`;
document.getElementById("due_date").setAttribute("min", formattedDate);
}