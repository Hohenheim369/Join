/**
 * This function loads the Add Task Template content an finds the exact location to render
 *
 * @param {string} domLocation This variable is the id where to load the template
 * @param {boolean} clear This variable is a state of true or false
 */
async function initTemplateAddTask(domLocation, clear) {
  let response = await fetch("../assets/templates/taskTemplate.html");
  let data = await response.text();
  document.getElementById(domLocation).innerHTML = data;
  clearTemplate(clear);
  getContacts();
  setDate();
  if (clear) {
      clearButton();
      renderEditButtons();
  }
}

/**
 * This function clears the closed template
 * 
 * @param {boolean} clear This variable is a state of true or false
 */
function clearTemplate(clear) {
  if (clear === true) {
      document.getElementById('edit_task_template').innerHTML = "";
  } else if (clear === false) {
      document.getElementById('add_task_template').innerHTML = "";
  }
}

function renderEditButtons(){
  document.getElementById("content_order").classList.add("content-order");
  document.getElementById("content_order").classList.remove("edit-content-order");
  document.getElementById('bottom_button_order').classList.remove('edit-bottom-button-order');
  document.getElementById('create_button_div').classList.remove('edit-ok-button');
}

/** This function gathers all data to create a task */
async function createTask() {
  let taskData = getTaskFormData();
  let taskId = await getNewId("tasks");

  setTaskData(taskData, taskId);
  await handleTaskCreationCompletion(taskId);
}

/**
 * This function sets all data
 * 
 * @param {Objekt} taskData - all user inputs for a task
 * @param {number} taskId - Id of the task
 */
function setTaskData(taskData, taskId) {
  putTasksContent(
    taskData.title,
    taskData.description,
    taskData.dueDate,
    taskId,
    taskData.assignedTo,
    taskData.categorySeleced
  );
  putTaskToUser(taskId);
}

/**
 * This function checks if the task Id is includes in active user data 
 * 
 * @param {number} taskId - Id of the task
 */
async function putTaskToUser(taskId) {
  if (!activeUser.tasks.includes(taskId)) {
    activeUser.tasks.push(taskId);
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
    try {
      await updateUserTaskInDatabase(activeUser.id, taskId);
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Tasks:", error);
      activeUser.tasks.pop();
      localStorage.setItem("activeUser", JSON.stringify(activeUser));
    }
  }
}

/**
 * Thias function updates the user database Informations
 * 
 * @param {number} userId - Id of the active user
 * @param {number} taskId - Id of the task
 * @returns - activates the pstData function
 */
async function updateUserTaskInDatabase(userId, taskId) {
  if (userId != 0) {
    let path = `users/${userId - 1}/tasks/${activeUser.tasks.length - 1}`;
    return postData(path, taskId);
  }
}

/**
 * This function puts all informations of the task together
 * 
 * @param {string} title - key of input value of the title
 * @param {string} description - key of input value of the description
 * @param {number} dueDate - key of selected date
 * @param {number} taskId - key of Id of the task 
 * @param {number} assignedTo - key of Id of all selcted assigned
 * @param {string} categorySeleced - key of text of the selected category
 */
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
    status: taskStatus,
    user: Number(userId[0]),
  });
}

/** This function fetches all contact data from the database */
async function getContacts() {
  document.getElementById("contact_contant").innerHTML = "";
  let contacts = await fetchData("contacts");
  let userContacts = activeUser.contacts;
  let contactsToRender = contacts.filter((contact) =>
    userContacts.includes(contact.id)
  );
  window.allContacts = contactsToRender;
  displayContacts(contactsToRender);
}

/** This function fetches all selected contact data from the database */
async function updateSelectedContactsDisplay() {
  let newContacts = await fetchData("contacts");
  let selectedList = document.getElementById("selected_contacts");
  selectedList.innerHTML = "";
  let userContacts = activeUser.contacts;
  let contactsToRender = newContacts.filter((contact) =>
    userContacts.includes(contact.id)
  );
  window.allContacts = contactsToRender;
  displaySelectedContacts(contactsToRender, selectedList);
}