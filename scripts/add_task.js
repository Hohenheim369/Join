let selectedContacts = [];
let selectedPrio;
// let subTasks = [];
let counter = 0;

async function createTask() {
  //add function to check if all required fields are filled
  let title = document.getElementById("title_input").value;
  let description = document.getElementById("description_textarea").value;
  let dueDate = document.getElementById("due_date").value;
  let categorySeleced = document.getElementById("category").innerText;
  let taskId = await getNewId('tasks');
  let assignedTo = [5, 8];
  // let subTask = createSubtasks();
  putTasksContent(title, description, dueDate, taskId, assignedTo, categorySeleced);
  // openAddTaskDialog();
  // await sleep(1500);
  // window.location.href = "../html/board.html";
}

// async function openAddTaskDialog(){
//   document.getElementById('task_added_overlay').innerHTML = taskAddedToBoard ();
//   await sleep(10);
//   const slidingDiv = document.getElementById('task_added_overlay');
//   slidingDiv.classList.toggle('visible');
// }

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
}


function editSubtask(li, index) {
  const currentText = li.innerText;
  let subInput = document.getElementById(`input_subtask_${index}`);
  subInput.value = currentText; 
  toggleSubtasksImgs(index);
  subInput.focus();
}

function handleInputBlur(input, li, index) {
  if (input.value.trim() !== "") {
      saveChanges(input.value, li, index);
  } else {
      removeSubtask(li, index);
      return
  }
  toggleClickListener();
}

function saveChanges(newValue, li, index) {
  li.innerText = newValue;
  subTasks[index] = newValue;
}

function removeSubtask(li, index) {
  li.parentNode.remove();
  subTasks.splice(index, 1);
}