let selectedContacts = [];
let userId = [];
let selectedPrio = "low"
let subTasks = [];

// document.addEventListener("DOMContentLoaded", () => {
//   loadTaskTemplate();
// });
// async function loadTaskTemplate() {
//   const response = await fetch("../assets/templates/task_form.html");
//   const data = await response.text();
//   document.getElementById("add_task_template").innerHTML = data;
// }

async function openAddTaskDialog(){
  document.getElementById('task_added_overlay').innerHTML = taskAddedToBoard ();
  await sleep(10);
  const slidingDiv = document.getElementById('task_added_overlay');
  slidingDiv.classList.toggle('visible');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createTask() {
  //add function to check if all required fields are filled
  let title = document.getElementById("title_input").value;
  let description = document.getElementById("description_textarea").value;
  let dueDate = document.getElementById("due_date").value;
  let categorySeleced = document.getElementById("category").innerText;
  let taskId = await getNewId('tasks');
  let assignedTo = selectedContacts;
  putTasksContent(title, description, dueDate, taskId, assignedTo, categorySeleced);
  openAddTaskDialog();
  await sleep(1500);
  window.location.href = "../html/board.html";
}

function putTasksContent(title, description, dueDate, taskId, assignedTo, categorySeleced){
  postData(`tasks/${taskId-1}/`,
    {
      title: title,
      description: description,
      date: dueDate,
      priority: selectedPrio,
      category: categorySeleced,
      id: taskId,
      subtasks: subTasks,
      assigned: assignedTo,
      status: "todo",
    }
  );
}

async function getContacts() {
  document.getElementById('contact_contant').innerHTML = "";
  let response = await fetch(`https://join-b72fb-default-rtdb.europe-west1.firebasedatabase.app/contacts/.json`);
  let contacts = await response.json();
  window.allContacts = contacts;
  contacts.sort((a, b) => a.name.localeCompare(b.name));
  displayContacts(contacts);
}

function displayContacts(contacts) {
  document.getElementById('contact_contant').innerHTML = "";
  const userHtml = showAssignedUser(activeUser);
  document.getElementById('contact_contant').innerHTML = userHtml;
  for (let contact of contacts) {
      const contactHtml = showAssignedContactList(contact);
      document.getElementById('contact_contant').innerHTML += contactHtml;
      console.log(contact);
  }
}

function addContactToTask(CheckButtonId, CheckTaskButton, bgChange, contactId) {
  toggleCheckButton(CheckButtonId, CheckTaskButton);
  let colorChange = document.getElementById(bgChange);
  colorChange.classList.toggle('assigned-color-change');
  colorChange.classList.toggle('contact-list');
  const existingContactIndex = selectedContacts.findIndex(contact => contact.contactId === contactId);
  if (existingContactIndex === -1) {
      addContactAssigned(contactId);
  } else {
      removeContactAssigned(existingContactIndex);
  }
}

function addContactAssigned(contactId) {
  if (!selectedContacts.some(contact => contact.contactId === contactId)) {
      selectedContacts.push(contactId);
      updateSelectedContactsDisplay(contactId);
  }
}

function removeContactAssigned(index) {
  if (index > -1) {
      selectedContacts.splice(index, 1);
      updateSelectedContactsDisplay(contactId);
  }
}

// function displayActiveUser(contactName, contactInitials, contactColor, contactId){
//   if (contactName == 'Gast') {
//     let displayUser = document.getElementById('selected_contacts');
//     displayUser += assignedUser(contactInitials, contactColor, contactId);
//   }
// }

async function updateSelectedContactsDisplay(contactId) {
  let contacts = await fetchData('contacts');
  let selectedList = document.getElementById('selected_contacts');
  selectedList.innerHTML = "";
  const maxVisibleContacts = 3;
  for (let i = 0; i < Math.min(selectedContacts.length, maxVisibleContacts); i++) {
      contactId = selectedContacts[i];
      const contactInitials = contacts[contactId-1].initials
      const contactID = contacts[contactId-1].id
      const contactColor = contacts[contactId-1].color
      // displayActiveUser(contactId);
      selectedList.innerHTML += assignedContacts(contactInitials, contactID, contactColor);
  }
  if (selectedContacts.length > maxVisibleContacts) {
      const additionalCount = selectedContacts.length - maxVisibleContacts;
      selectedList.innerHTML += `<div>+${additionalCount}</div>`;
  }
}

document.getElementById('assigned_to').addEventListener('input', searchContact);

function searchContact() {
  let searContact = document.getElementById('assigned_to').value.toLowerCase();
  let filteredContacts = window.allContacts.filter(contact => 
      contact.name.toLowerCase().includes(searContact));
  displayContacts(filteredContacts);
}

function handleSelectedPriority(priority) {
  selectedPrio = `${priority}`;
}

function selectCategory(category) {
  document.getElementById("category").innerText = category;
  closeSelectCategory();
}

let clickListenerActive = false;

function toggleClickListener() {
    const categoryActiv = document.getElementById('category_activ');
    const categoryInactiv = document.getElementById('category_inactiv');
    const subtasksActiv = document.getElementById('subtasks_inactiv');
    const subTasksList = document.getElementById(`subtasks_list`);
    if (categoryActiv || categoryInactiv || subtasksActiv || subTasksList) {
        if (!clickListenerActive) {
            document.addEventListener('click', handleDocumentClick);
            clickListenerActive = true;
        }
    } else {
        if (clickListenerActive) {
            document.removeEventListener('click', handleDocumentClick);
            clickListenerActive = false;
        }
    }
}

function handleDocumentClick(event) {
  const categoryActiv = document.getElementById('category_activ');
  const categoryInactiv = document.getElementById('category_inactiv');
  const subtasksActiv = document.getElementById('subtasks_inactiv');
  const subTasksList = document.getElementById(`subtasks_list`);
  if (!categoryActiv.contains(event.target) && 
      !categoryInactiv.contains(event.target) && 
      !subtasksActiv.contains(event.target)&&
      !subTasksList.contains(event.target)){
      closeSelectCategory();
      cancelSubtasks();
      toggleClickListener();
  }
}

function saveChangesOnClickOutside(index) {
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
}

function handleInputBlur(li, index) {
  let input = document.getElementById(`list_subtask_${index}`).innerText
  if (input.trim() !== "") {
      saveChanges(li, index);
  } else {
      removeSubtask(li, index);
      return
  }
  toggleClickListener();
}

function saveChanges(subtasksInput, index) {
  let newValue = { subTaskName: subtasksInput, done: false }
  subTasks[index] = newValue;
}

function removeSubtask(li, index) {
  li.parentNode.remove();
  subTasks.splice(index, 1);
}