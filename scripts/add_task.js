let selectedContacts = [];
let userId = [];
let selectedPrio = "medium";
let subTasks = [];

document.addEventListener("DOMContentLoaded", () => {
  loadTaskTemplate().then(() => {
    getContacts();
  });
});

async function loadTaskTemplate() {
  const response = await fetch("../assets/templates/task_form.html");
  const data = await response.text();
  document.getElementById("add_task_template").innerHTML = data;
}

async function openAddTaskDialog() {
  document.getElementById("task_added_overlay").innerHTML = taskAddedToBoard();
  await sleep(10);
  const slidingDiv = document.getElementById("task_added_overlay");
  slidingDiv.classList.toggle("visible");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createTask() {
  let title = document.getElementById("title_input").value;
  let description = document.getElementById("description_textarea").value;
  let dueDate = document.getElementById("due_date").value;
  let categorySeleced = document.getElementById("category").innerText;
  let taskId = await getNewId("tasks");
  let assignedTo = selectedContacts.map(Number);
  putTasksContent(
    title,
    description,
    dueDate,
    taskId,
    assignedTo,
    categorySeleced
  );
  putTaskToUser(taskId);
  openAddTaskDialog();
  await sleep(1500);
  window.location.href = "../html/board.html";
}

function getSubtasks() {
  return subTasks.map((subName, index) => ({
    subTaskName: subName,
    subId: index + 1,
    done: false
  }));
}

function putTasksContent(
  title,
  description,
  dueDate,
  taskId,
  assignedTo,
  categorySeleced
) {
  postData(`tasks/${taskId - 1}/`, {
    title: title,
    description: description,
    date: dueDate,
    priority: selectedPrio,
    category: categorySeleced,
    id: taskId,
    subtasks: getSubtasks(),
    assigned: assignedTo,
    status: "todo",
    user: activeUser.id,
  });
}

async function putTaskToUser(taskId) {
  if (!activeUser.tasks.includes(taskId)) {
    activeUser.tasks.push(taskId);
    localStorage.setItem('activeUser', JSON.stringify(activeUser));
    try {
      await updateUserTaskInDatabase(activeUser.id, taskId);
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Tasks:', error);
      activeUser.tasks.pop();
      localStorage.setItem('activeUser', JSON.stringify(activeUser));
    }
  }
}

async function updateUserTaskInDatabase(userId, taskId) {
  const path = `users/${userId - 1}/tasks/${activeUser.tasks.length - 1}`;
  return postData(path, taskId);
}

async function getContacts() {
  document.getElementById("contact_contant").innerHTML = "";
  let response = await fetch(
    `https://join-b72fb-default-rtdb.europe-west1.firebasedatabase.app/contacts/.json`
  );
  let contacts = await response.json();
  window.allContacts = contacts;
  displayContacts(contacts);
}

function displayContacts(contacts) {
  document.getElementById("contact_contant").innerHTML = "";
  const userHtml = showAssignedUser(activeUser);
  document.getElementById("contact_contant").innerHTML = userHtml;
  let renderContacts = contacts.filter((contactId) => contactId !== null);
  renderContacts.sort((a, b) => a.name.localeCompare(b.name));
  for (let contact of renderContacts) {
    const contactHtml = showAssignedContactList(contact);
    document.getElementById("contact_contant").innerHTML += contactHtml;
  }
}

function addContactToTask(CheckButtonId, CheckTaskButton, bgChange, contactId) {
  toggleCheckButton(CheckButtonId, CheckTaskButton);
  let colorChange = document.getElementById(bgChange);
  colorChange.classList.toggle("assigned-color-change");
  colorChange.classList.toggle("contact-list");
  const existingContactIndex = selectedContacts.indexOf(contactId);
  if (existingContactIndex === -1) {
    addContactAssigned(contactId);
  } else {
    removeContactAssigned(existingContactIndex);
  }
}

function addUserToTask(CheckButtonId, CheckTaskButton, bgChange, activUserId) {
  toggleCheckButton(CheckButtonId, CheckTaskButton);
  let colorChange = document.getElementById(bgChange);
  colorChange.classList.toggle("assigned-color-change");
  colorChange.classList.toggle("contact-list");
  const existingUserIndex = userId.indexOf(activUserId);
  if (existingUserIndex === -1) {
    addUserAssigned(activUserId);
  } else {
    removeUserAssigned(existingUserIndex);
  }
}

function addContactAssigned(contactId) {
  if (!selectedContacts.some((contact) => contact.contactId === contactId)) {
    selectedContacts.push(contactId);
    updateSelectedContactsDisplay(contactId);
  }
}

function addUserAssigned(activUserId) {
  if (!userId.some((user) => user.activUserId === activUserId)) {
    userId.push(activUserId);
    updateSelectedUserDisplay();
  }
}

function removeContactAssigned(index) {
  if (index > -1) {
    selectedContacts.splice(index, 1);
    updateSelectedContactsDisplay(index);
  }
}

function removeUserAssigned(index) {
  if (index > -1) {
    userId = [];
    let selectedList = document.getElementById("activ_user");
    selectedList.innerHTML = "";
  }
}

function updateSelectedUserDisplay() {
  let selectedList = document.getElementById("activ_user");
  selectedList.innerHTML = "";
  const userInitials = activeUser.initials;
  const activUserID = activeUser.id;
  const userColor = activeUser.color;
  selectedList.innerHTML += assignedUser(userInitials, activUserID, userColor);
}

async function updateSelectedContactsDisplay(contactId) {
  const contacts = await fetchData("contacts");
  const selectedList = document.getElementById("selected_contacts");
  selectedList.innerHTML = "";

  const maxVisibleContacts = 3;
  displaySelectedContacts(contacts, selectedList, maxVisibleContacts);
  displayAdditionalCount(selectedList, maxVisibleContacts);
}

function displaySelectedContacts(contacts, selectedList, maxVisibleContacts) {
  for (
    let i = 0;
    i < Math.min(selectedContacts.length, maxVisibleContacts);
    i++
  ) {
    const contactId = selectedContacts[i];
    const { initials, id, color } = contacts[contactId - 1];
    selectedList.innerHTML += assignedContacts(initials, id, color);
  }
}

function displayAdditionalCount(selectedList, maxVisibleContacts) {
  if (selectedContacts.length > maxVisibleContacts) {
    const additionalCount = selectedContacts.length - maxVisibleContacts;
    selectedList.innerHTML += `<div class="font-s-20 font-w-700">+${additionalCount}</div>`;
  }
}

function searchContact() {
  let searContact = document.getElementById("assigned_to").value.toLowerCase();
  let filteredContacts = window.allContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searContact)
  );
  displayContacts(filteredContacts);
}

function handleSelectedPriority(priority) {
  selectedPrio = `${priority}`;
}

function selectCategory(category) {
  document.getElementById("category").innerText = category;
  closeSelectCategory();
  resetrequiredCategory();
}

function saveInput(index) {
  let subInput = document.getElementById(`input_subtask_${index}`).value;
  document.getElementById(`list_subtask_${index}`).innerText = subInput;
  toggleSubtasksImgs(index);
  handleInputBlur(subInput, index);
}

function editSubtask(li, index) {
  const currentText = li.innerText;
  let subInput = document.getElementById(`input_subtask_${index}`);
  subInput.value = currentText;
  toggleSubtasksImgs(index);
  subInput.focus();
  subInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      subInput.blur();
      saveInput(index);
    }
  });
}

function handleInputBlur(li, index) {
  let input = document.getElementById(`list_subtask_${index}`).innerText;
  if (input.trim() !== "") {
    saveChanges(li, index);
  } else {
    removeSubtask(li, index);
    return;
  }
}

function saveChanges(subtasksInput, index) {
  let newValue = subtasksInput;
  subTasks[index] = newValue;
}

function removeSubtask(li, index) {
  li.parentNode.remove();
  subTasks.splice(index, 1);
}

function requiredFields() {
  requiredTitle();
  requiredDate();
  requiredCategory();
}

function requiredTitle() {
  let title = document.getElementById("title_input");
  let alertTitle = document.getElementById("title_field_alert");
  if (title.value.trim() == "") {
    title.classList.add("alert-border");
    alertTitle.classList.remove("d-none");
  }
}

function requiredDate() {
  let date = document.getElementById("due_date");
  let alertDate = document.getElementById("date_field_alert");
  if (date.value.trim() == "") {
    date.classList.add("alert-border");
    alertDate.classList.remove("d-none");
  }
}

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

function resetrequiredFields() {
  resetrequiredTitle();
  resetrequiredDate();
  resetrequiredCategory();
}

function resetrequiredTitle() {
  let title = document.getElementById("title_input");
  let alertTitle = document.getElementById("title_field_alert");
  title.classList.remove("alert-border");
  alertTitle.classList.add("d-none");
}

function resetrequiredDate() {
  let date = document.getElementById("due_date");
  let alertDate = document.getElementById("date_field_alert");
  date.classList.remove("alert-border");
  alertDate.classList.add("d-none");
}

function resetrequiredCategory() {
  let categoryValue = document.getElementById("category");
  let category = document.getElementById("category_contant");
  let alertCategory = document.getElementById("category_field_alert");
  if ((categoryValue.innerText = "Technical Task" || "User Story")) {
    category.classList.remove("alert-border");
    alertCategory.classList.add("d-none");
    category.classList.add("category-container");
  }
}