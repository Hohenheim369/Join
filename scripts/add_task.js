//for testing reasons my own database
let TEST_URL = `https://remotestorage-6ae7b-default-rtdb.europe-west1.firebasedatabase.app/`;
let selectedContacts = [];
let selectedPrio;
let subTasks = [];

//global outsourced if finished -> ist outgesourced
// async function loadTasks() {
//   let response = await fetch(`${TEST_URL}tasks/.json`);
//   let responseToJson = await response.json();
//   let newTaskId;
//   if (responseToJson == null) {
//     newTaskId = 1;
//   } else {
//     newTaskId = countId(responseToJson);
//   }
//   return newTaskId;
// }

async function createTask() {
  //add function to check if all required fields are filled
  let title = document.getElementById("title_input").value;
  let description = document.getElementById("description_textarea").value;
  let dueDate = document.getElementById("due_date").value;
  let categorySeleced = document.getElementById("category").innerText;
  let taskId = await getNewId('tasks'); //Habe ich geändert - Gruß Susanne
  let assignedTo = [5, 8];
  putTasksContent(title, description, dueDate, taskId, assignedTo, categorySeleced);
  openAddTaskDialog();
  await sleep(1500);
  window.location.href = "../html/board.html";
}

async function openAddTaskDialog(){
  document.getElementById('task_added_overlay').innerHTML = taskAddedToBoard ();
  await sleep(10);
  const slidingDiv = document.getElementById('task_added_overlay');
  slidingDiv.classList.toggle('visible');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function putTasksContent(title, description, dueDate, taskId, assignedTo, categorySeleced){
  postData(`tasks/${taskId-1}/`, //Habe ich geändert - Gruß Susanne
    {
      title: title,
      description: description,
      date: dueDate,
      priority: selectedPrio,
      category: categorySeleced,
      id: taskId,
      subtasks: subTasks,
      assigned: assignedTo,
    }
  );
}

async function getContacts() {
  document.getElementById('contact_contant').innerHTML = "";
  let response = await fetch(`https://join-b72fb-default-rtdb.europe-west1.firebasedatabase.app/contacts/.json`);
  let contacts = await response.json();
  window.allContacts = contacts;
  displayContacts(contacts);
}

function displayContacts(contacts) {
  document.getElementById('contact_contant').innerHTML = "";
  for (let contact of contacts) {
      document.getElementById('contact_contant').innerHTML += showAssignedContactList(contact);
      document.querySelector(`#bg_task_${contact.id}`).addEventListener('click', () => addContactAssigned(contact.name));
      console.log(contact);
  }
}

document.getElementById('assigned_to').addEventListener('input', searchContact);

function searchContact() {
  let searContact = document.getElementById('assigned_to').value.toLowerCase();
  let filteredContacts = window.allContacts.filter(contact => 
      contact.name.toLowerCase().includes(searContact));
  displayContacts(filteredContacts);
}

function addContactAssigned(contactName) {
  if (!selectedContacts.includes(contactName)) {
      selectedContacts.push(contactName);
      updateSelectedContactsDisplay();
  }
}

function updateSelectedContactsDisplay() {
  const selectedDiv = document.getElementById('selected_contacts');
  selectedDiv.innerHTML = "";
  selectedContacts.forEach(name => {
      const nameDiv = document.createElement('div');
      nameDiv.textContent = name;
      selectedDiv.appendChild(nameDiv);
  });
}

function addContactToTask(CheckButtonId, CheckTaskButton, bgChange) {
  toggleCheckButton(CheckButtonId, CheckTaskButton);
  let colorChange = document.getElementById(bgChange);
  colorChange.classList.toggle('assigned-color-change');
  colorChange.classList.toggle('contact-list');
}

function handleSelectedPriority(priority) {
  selectedPrio = `${priority}`;
}

function selectCategory(category) {
  document.getElementById("category").innerText = category;
  closeSelectCategory();
}

document.addEventListener('click', function(event) {
  const categoryActiv = document.getElementById('category_activ');
  const categoryInactiv = document.getElementById('category_inactiv');
  const subtasksActiv = document.getElementById('subtasks_inactiv');
  const subTasksList = document.getElementById('subtasks_list');
  if (!categoryActiv.contains(event.target) && !categoryInactiv.contains(event.target) && !subtasksActiv.contains(event.target) && !subTasksList.contains(event.target)) {
      closeSelectCategory();
      cancelSubtasks();
  }
});

function saveChangesOnClickOutside(input, li, index) {
  input.addEventListener("focusout", function () {
      handleInputBlur(input, li, index);
  });
}

function editSubtask(li, index) {
  const currentText = li.innerText;
  const input = createInputField(currentText);
  li.innerHTML = ""; 
  li.appendChild(input); 
  input.focus(); 
  saveChangesOnClickOutside(input, li, index);
  toggleSubtasksImgs(index);
}

function createInputField(value) {
  const input = document.createElement("input");
  input.type = "text";
  input.classList.add("subtasks-input");
  input.classList.add("font-s-16");
  input.value = value;
  return input;
}

function handleInputBlur(input, li, index) {
  if (input.value.trim() !== "") {
      saveChanges(input.value, li, index);
  } else {
      removeSubtask(li, index);
  }
  toggleSubtasksImgs(index);
}

function saveChanges(newValue, li, index) {
  li.innerText = newValue;
  subTasks[index] = newValue;
}

function removeSubtask(li, index) {
  li.parentNode.remove();
  subTasks.splice(index, 1);
}