//for testing reasons my own database
let TEST_URL = `https://remotestorage-6ae7b-default-rtdb.europe-west1.firebasedatabase.app/`;
let selectedContacts = [];
let selectedPrio;
let subTasks = [];
//global outsourced if finished 
async function loadTasks() {
  let response = await fetch(`${TEST_URL}tasks/.json`);
  let responseToJson = await response.json();
  let newTaskId;
  if (responseToJson == null) {
    newTaskId = 1;
  } else {
    newTaskId = countId(responseToJson);
  }
  return newTaskId;
}

async function createTask() {
  let title = document.getElementById("title_input").value;
  let description = document.getElementById("description_textarea").value;
  let dueDate = document.getElementById("due_date").value;
  let categorySeleced = document.getElementById("category").innerText;
  let taskId = await loadTasks();
  let assignedTo = [5, 8];
  putTasksContent(title, description, dueDate, taskId, subTasks, assignedTo, categorySeleced);
}

function putTasksContent(title, description, dueDate, taskId, subTasks, assignedTo, categorySeleced){
  postData(`https://remotestorage-6ae7b-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId-1}/`,
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
  if (!categoryActiv.contains(event.target) && !categoryInactiv.contains(event.target)) {
      closeSelectCategory();
  }
});

function editSubtask(li){
  const currentText = li.innerText;

    // Erstelle ein Eingabefeld mit dem aktuellen Text als Value
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("subtasks-input");
    input.classList.add("font-s-16");
    input.value = currentText;

    // Füge einen Event Listener hinzu, um das Element zu speichern, wenn Enter gedrückt wird
    input.addEventListener("blur", function() {
        if (input.value.trim() !== "") {
            li.innerText = input.value; // Aktualisiere den Text des Listenelements
        } else {
            li.remove(); // Entferne das Element, wenn es leer ist
        }
    });

    // Ersetze das Listenelement durch das Eingabefeld
    li.innerHTML = ""; // Leere den Inhalt des Listenelements
    li.appendChild(input); // Füge das Eingabefeld hinzu
    input.focus(); // Setze den Fokus auf das Eingabefeld
}