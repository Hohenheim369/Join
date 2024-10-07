let selectedContacts = [];
let userId = [];
let selectedPrio = "medium";
let subTasks = [];
let editSubTaskIndex = null;
let taskStatus = "todo";
let selectedButton = "medium";

/**This function opens a Dialog after creating a Task */
async function openAddTaskDialogFeedback() {
  let overlayFeedback = document.getElementById("task_added_overlay");
  overlayFeedback.innerHTML ="";
  overlayFeedback.innerHTML = taskAddedToBoard();
  await sleep(10);
  let slidingDiv = document.getElementById("task_added_overlay");
  slidingDiv.classList.toggle("visible");
}

/**
 * This function sets a delays between functions
 * 
 * @param {number} ms - This variable is the time of the delay in miliseconds
 * @returns - the Timeout
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * This function is getting id´s from elements
 * 
 * @returns - all variables set
 */
function getTaskFormData() {
  let title = document.getElementById("title_input").value;
  let description = document.getElementById("description_textarea").value;
  let dueDate = document.getElementById("due_date").value;
  let categorySeleced = document.getElementById("category").innerText;
  let assignedTo = selectedContacts.map(Number);

  return { title, description, dueDate, categorySeleced, assignedTo };
}

/** This function opens the Dialog function sets a delay and direct the User to Board.html */
async function handleTaskCreationCompletion() {
  openAddTaskDialogFeedback();
  await sleep(1500);
  window.location.href = "../html/board.html";
}

/**
 * This function is mapping through the Array subTasks
 * 
 * @returns - an Object 
 */
function getSubtasks() {  
  return subTasks.map((subName, index) => ({
    subTaskName: subName,
    subId: index + 1,
    done: false,
  }));
}

/**
 * This function renders the active User and all contacts 
 * 
 * @param {string} contacts - is a variable with all informations about the Contacts from the Database
 */
function displayContacts(contacts) {
  document.getElementById("contact_contant").innerHTML = "";
  let userHtml = showAssignedUser(activeUser);
  document.getElementById("contact_contant").innerHTML = userHtml;
  contacts.sort((a, b) => a.name.localeCompare(b.name));
  for (let contact of contacts) {
    let contactHtml = showAssignedContactList(contact);
    document.getElementById("contact_contant").innerHTML += contactHtml;
  }
}

/**
 * This function toggles Color and Icon if you select a Contact from Assigned to
 * 
 * @param {StringId} CheckButtonId - The Id for Checkmark 
 * @param {String} CheckTaskButton - The String to locate if its true
 * @param {StringId} bgChange - The Id for Background Color switch
 * @param {NumberId} contactId - The Contact Id 
 */
function addContactToTask(CheckButtonId, CheckTaskButton, bgChange, contactId) {  
  toggleCheckButton(CheckButtonId, CheckTaskButton);
  let colorChange = document.getElementById(bgChange);
  colorChange.classList.toggle("assigned-color-change");
  colorChange.classList.toggle("contact-list");
  let existingContactIndex = selectedContacts.indexOf(contactId);
  if (existingContactIndex === -1) {
    addContactAssigned(contactId);
  } else {
    removeContactAssigned(existingContactIndex);
  }
}

/**
 * This function toggles Color and Icon if you select the User from Assigned to
 * 
 * @param {StringId} CheckButtonId - The Id for Checkmark 
 * @param {String} CheckTaskButton - The String to locate if its true
 * @param {StringId} bgChange - The Id for Background Color switch
 * @param {NumberId} activUserId - The active User Id 
 */
function addUserToTask(CheckButtonId, CheckTaskButton, bgChange, activUserId) {
  toggleCheckButton(CheckButtonId, CheckTaskButton);
  let colorChange = document.getElementById(bgChange);
  colorChange.classList.toggle("assigned-color-change");
  colorChange.classList.toggle("contact-list");
  let existingUserIndex = userId.indexOf(activUserId);
  if (existingUserIndex === -1) {
    addUserAssigned(activUserId);
  } else {
    removeUserAssigned(existingUserIndex);
  }
}

/**
 * This function proves if the Contact is selected or not
 * 
 * @param {NumberId} contactId - is the contact Id 
 */
function addContactAssigned(contactId) {
  if (!selectedContacts.some((contact) => contact.contactId === contactId)) {
    selectedContacts.push(contactId);
    updateSelectedContactsDisplay(contactId);
  }
}

/**
 * This function proves if the active User is selected or not
 * 
 * @param {NumberId} activUserId - is the active User Id 
 */
function addUserAssigned(activUserId) {
  if (!userId.some((user) => user.activUserId === activUserId)) {
    userId.push(activUserId);
    updateSelectedUserDisplay();
  }
}

/**
 * This function removes the selected Contact if you onclick it agian
 * 
 * @param {number} index - is the length of the Array
 */
function removeContactAssigned(index) {
  if (index > -1) {
    selectedContacts.splice(index, 1);
    updateSelectedContactsDisplay(index);
  }
}

/**
 * This function removes the selected User if you onclick it agian
 * 
 * @param {number} index - is the length of the Array
 */
function removeUserAssigned(index) {
  if (index > -1) {
    userId = [];
    let selectedList = document.getElementById("activ_user");
    selectedList.innerHTML = "";
  }
}

/**This function updates the User Icon shown after select or remove from assigned to */
function updateSelectedUserDisplay() {
  let selectedList = document.getElementById("activ_user");
  selectedList.innerHTML = "";
  let userInitials = activeUser.initials;
  let activUserID = activeUser.id;
  let userColor = activeUser.color;
  selectedList.innerHTML += assignedUser(userInitials, activUserID, userColor);
}

/**
 * This function updates the Contact Icon shown after select or remove from assigned to
 * 
 * @param {number} newContacts - Those are the Id Numbers of all Contacts
 * @param {number} selectedList - Those are the Id Numbers of all selected Contacts
 */
function displaySelectedContacts(newContacts, selectedList) {
  for (let i = 0; i < Math.min(selectedContacts.length); i++) {
    let contactId = Number(selectedContacts[i]);
    let activeContacts = newContacts.find(
      (contact) => contact.id === contactId
    );
    selectedList.innerHTML += assignedContacts(activeContacts);
  }
}

/** This function searches through all contacts oninput */
function searchContact() {
  let searContact = document.getElementById("assigned_to").value.toLowerCase();
  let filteredContacts = window.allContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searContact)
  );
  displayContacts(filteredContacts);
}

/**
 * This function handles the selected Priority
 * 
 * @param {string} priority - is the Priority the User has selected
 */
function handleSelectedPriority(priority) {
  selectedPrio = `${priority}`;
}

/**
 * This function sets the selected Category after onclick
 * 
 * @param {string} category - is the Text the User has selected in Category
 */
function selectCategory(category) {
  document.getElementById("category").innerText = category;
  closeSelectCategory();
  resetrequiredCategory();
}

/**
 * This function saves the Input the User has made at Subtasks
 *  
 * @param {number} index - is the Index Number of the Array
 */
function saveInput(index) {
  let subInput = document.getElementById(`input_subtask_${index}`).value;
  document.getElementById(`list_subtask_${index}`).innerText = subInput;
  toggleSubtasksImgs(index);
  handleInputBlur(subInput, index);
  editSubTaskIndex = null;
  // if (subInput == "") {
  //   deleteSubtask(index);
  // }
}

/**
 * This function opens the edit Field to edit the Subtasks
 * 
 * @param {string} li - is the current list Element
 * @param {number} index - is the Id of the selected Subtask to edit
 */
function editSubtask(li, index) {
  let currentText = li.innerText;
  let subInput = document.getElementById(`input_subtask_${index}`);
  handlePreviousEdit(index);
  editSubTaskIndex = index;
  handlePreviousEdit(index);
  subInput.value = currentText;
  toggleSubtasksImgs(index);
  subInput.focus();
}

/**
 * This function proves if there are allready changes in the Array or not
 * 
 * @param {number} index - is the Id of the selected Subtask to edit
 */
function handlePreviousEdit(index) {
  if (editSubTaskIndex !== null && editSubTaskIndex !== index) {
    toggleSubtasksImgs(editSubTaskIndex);
  }
}

/**
 * This function allows the User to submit Input with the Enter key
 * 
 * @param {string} event - location of enter event
 * @param {number} index - Id of the event Element
 * @returns - boolean of true or false
 */
function checkEnterKey(event, index) {
  let subInput = document.getElementById(`input_subtask_${index}`);
  if (event.key === "Enter") {
    subInput.blur();
    saveInput(index);
    return false;
  }
  return true;
}

/**
 * This function handles the Inputfield of focus and proves if the Element is empty
 * 
 * @param {string} li - is the current list Element
 * @param {number} index - is the Id of the selected Subtask to edit
 * @returns - the removeSubtask function
 */
function handleInputBlur(li, index) {
  let input = document.getElementById(`list_subtask_${index}`).innerText;
  if (input.trim() !== "") {
    saveChanges(li, index);
  } else {
    removeSubtask(index);
    return;
  }
}

/**
 *This function saves all changes after editing a subtask
 *  
 * @param {ElementId} subtasksInput - is the Inputfield on focus
 * @param {NumberId} index - is the Id of the Element
 */
function saveChanges(subtasksInput, index) {
  let newValue = subtasksInput;
  subTasks[index] = newValue;
}

/**
 * This function removes Subtasks from the List
 * 
 * @param {number} index - is the Id of the selected Subtask to edit
 */
function removeSubtask(index) {
  deleteSubtask(index) 
  subTasks.splice(index, 1);
}

/** This function proves all required Fields */
function requiredFields() {
  requiredTitle();
  requiredDate();
  requiredCategory();
}

/** This function proves the Title Element Input */
function requiredTitle() {
  let title = document.getElementById("title_input");
  let alertTitle = document.getElementById("title_field_alert");
  if (title.value.trim() == "") {
    title.classList.add("alert-border");
    alertTitle.classList.remove("d-none");
  }
}

/** This function proves the Date Element Input */
function requiredDate() {
  let date = document.getElementById("due_date");
  let alertDate = document.getElementById("date_field_alert");
  if (date.value.trim() == "") {
    date.classList.add("alert-border");
    alertDate.classList.remove("d-none");
  }
}

/** This function proves the Category Element Input */
function requiredCategory() {
  let categoryValue = document.getElementById("category");
  let category = document.getElementById("category_contant");
  let alertCategory = document.getElementById("category_field_alert");
  if (categoryValue.innerText === "Select task category") {
    category.classList.add("alert-border");
    alertCategory.classList.remove("d-none");
    category.classList.remove("category-container");
  }
}

/** This function resets all required Fields to default */
function resetrequiredFields() {
  resetrequiredTitle();
  resetrequiredDate();
  resetrequiredCategory();
}

/** This function resets the Title Element */
function resetrequiredTitle() {
  let title = document.getElementById("title_input");
  let alertTitle = document.getElementById("title_field_alert");
  title.classList.remove("alert-border");
  alertTitle.classList.add("d-none");
}

/** This function resets the Date Element */
function resetrequiredDate() {
  let date = document.getElementById("due_date");
  let alertDate = document.getElementById("date_field_alert");
  date.classList.remove("alert-border");
  alertDate.classList.add("d-none");
}

/** This function resets the Category Element */
function resetrequiredCategory() {
  let categoryValue = document.getElementById("category");
  let category = document.getElementById("category_contant");
  let alertCategory = document.getElementById("category_field_alert");
  if ((categoryValue.innerText === "Technical Task" || "User Story")) {
    category.classList.remove("alert-border");
    alertCategory.classList.add("d-none");
    category.classList.add("category-container");
  }
}

/**
 * This function checks a click event and activates closing functions
 * 
 * @param {string} event - locates the event
 */
function closeTaskIfOutside(event) {
  if (event.target.id === 'add_task_board'||'edit_task_board'||'add_task_content') {
    closeSelect();
    closeSelectCategory();
  }
}