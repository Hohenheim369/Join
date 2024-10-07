/**
 * This function opens the add task overlay
 * 
 * @param {string} status - of location
 */
function openAddTask(status) {
  toggleOverlay('board_addtask_overlay');
  taskStatus = status;
}

/**
 * This function opens the edit window 
 * 
 * @param {number} taskId - Id of the task the user has clicked
 */
function openEditDialog(taskId) {
  let editTaskButton = document.getElementById("create_button_div");
  document.getElementById("edit_task_overlay").classList.remove("d-none");
  document.getElementById("create_button").classList.add("d-none");
  document.getElementById("clear_button").classList.add("d-none");
  document.getElementById("alert_field").classList.add("d-none");
  document.getElementById("alert_field").classList.remove("alert-field");
  document.getElementById("dividing_bar").classList.add("d-none");
  document.getElementById("content_order").classList.remove("content-order");
  document.getElementById("content_order").classList.add("edit-content-order");
  document.getElementById('bottom_button_order').classList.add('edit-bottom-button-order');
  document.getElementById('create_button_div').classList.add('edit-ok-button');
  editTaskButton.innerHTML = editTaskTemplate(taskId);
}

/**
 * This function gets all informations of the clicked task
 * 
 * @param {number} taskId -Id of the task the user has clicked
 */
async function taskValuesToEditField(taskId) {
  let tasks = await fetchData("tasks");
  let singleTask = tasks.find((task) => task.id === taskId);
  let contacts = await fetchData("contacts");
  setTaskBasicValues(singleTask);
  setTaskUser(singleTask);
  setTaskContacts(singleTask, contacts);
  setTaskPriority(singleTask);
  setTaskCategory(singleTask);
  setTaskSubtasks(singleTask);
}

/**
 * This function puts the values into the elements
 * 
 * @param {array} singleTask - is the array of the clicked task
 */
function setTaskBasicValues(singleTask) {
  document.getElementById("title_input").value = singleTask.title;
  document.getElementById("description_textarea").value =
    singleTask.description;
  document.getElementById("due_date").value = singleTask.date;
}

/**
 * This function puts the user to the task
 * 
 * @param {array} singleTask - is the array of the clicked task
 */
function setTaskUser(singleTask) {
  if (singleTask.user === activeUser.id) {
    addUserToTask("contact_to_task_0", "task", "bg_task_0", `${activeUser.id}`);
  }
}

/**
 * This function sets all selected contacts to the task
 * 
 * @param {array} singleTask - is the array of the clicked task
 * @param {numberObject} contacts - all selected contact ids
 * @returns - stops the function
 */
function setTaskContacts(singleTask, contacts) {
  if (!singleTask.assigned) {
    return;
  }
  let userContacts = singleTask.assigned.filter((data) => data !== null);
  let contactsToRender = contacts.filter((contact) =>
    userContacts.includes(contact.id)
  );
  window.allContacts = contactsToRender;
  contactsToRender.forEach((contact) => {
    addContactToTask(
      `contact_to_task_${contact.id}`,
      "task",
      `bg_task_${contact.id}`,
      `${contact.id}`
    );
  });
}

/**
 * This function sets the priority to the task
 * 
 * @param {array} singleTask - is the array of the clicked task
 */
function setTaskPriority(singleTask) {
  selectPrio(singleTask.priority);
}

/**
 * This function sets then category to the task
 * 
 * @param {array} singleTask - is the array of the clicked task
 */
function setTaskCategory(singleTask) {
  document.getElementById("category").innerText = singleTask.category;
  document.getElementById("edit_category").classList.add("d-none");
  document.getElementById("edit_category").classList.remove("form-child-order");
}

/**
 * This function sets all subtasks to the task
 * 
 * @param {array} singleTask - is the array of the clicked task
 */
function setTaskSubtasks(singleTask) {
  let subtaskEdit = singleTask.subtasks;
  let subTaskField = document.getElementById("subtasks_list");
  subTaskField.innerHTML = "";
  if (subtaskEdit) {
    subtaskEdit.forEach((subtask) => {
      subTasks.push(subtask.subTaskName);
      let ids = subTasks.length;
      subTaskField.innerHTML += addSubtasksToList(subtask.subTaskName, ids - 1);
    });
  }
}

/**
 * This function enables the edit button
 * 
 * @param {number} taskId -id of the task
 */
function enableEditButton(taskId) {
  let input = getInputFields();
  let category = getCategory();
  if (isFormValid(input, category)) {
    handleValidForm(taskId);
  } else {
    handleInvalidForm();
  }
}

/**
 * This function gets the Input values
 * 
 * @returns - the values as key
 */
function getInputFields() {
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
function getCategory() {
  return document.getElementById("category").innerText;
}

/**
 * This function checks if the elements are filled and valid
 * 
 * @param {string} input - key for the title and date value
 * @param {string} category - key for the category text
 * @returns - true or false of completion
 */
function isFormValid(input, category) {
  return (
    input.input !== "" &&
    input.date !== "" &&
    (category === "Technical Task" || category === "User Story" || category === "Tutorial")
  );
}

/**
 * This function handles through the valid form
 * 
 * @param {number} taskId - Id of the task
 */
function handleValidForm(taskId) {
  resetrequiredFields();
  editTask(taskId);
}

/** This function handles through the invalid form */
function handleInvalidForm() {
  requiredFields();
}

/**
 * This function gathers all data to edit the task
 * 
 * @param {number} taskId - Id of the task
 */
async function editTask(taskId) {
  let taskData = getTaskFormData();
  let tasks = await fetchData("tasks");
  let singleTask = tasks.find((task) => task.id === taskId);
  let userTaskId = userTest();
  let currenttaskStatus = singleTask.status;
  await updateTaskContent(taskData, taskId, userTaskId, currenttaskStatus);
  await handleTaskEditCompletion(taskId);
}

/**
 * This function updates all data
 * 
 * @param {Object} taskData - all inputs of the task an chnages
 * @param {number} taskId - Id of the task
 * @param {number} userTaskId - user id 
 * @param {string} currenttaskStatus - current status of the task
 */
async function updateTaskContent(taskData, taskId, userTaskId, currenttaskStatus) {
  await putEditTasksContent(
    taskData.title,
    taskData.description,
    taskData.dueDate,
    taskId,
    taskData.assignedTo,
    taskData.categorySeleced,
    userTaskId,
    currenttaskStatus
  );
}

/**
 * This function handles the completion after editing a task
 * 
 * @param {number} taskId - Id of the task
 */
async function handleTaskEditCompletion(taskId) {
  subTasks = [];
  openAddTaskDialogFeedback();
  await sleep(1500);
  toggleTaskOverlays();
  closeAddTaskDialogFeedback();
  openSingleTask(taskId);
}

/** This function toggles the task overlay */
function toggleTaskOverlays() {
  toggleOverlay("edit_task_overlay");
  toggleOverlay("board_task_overlay");
}

/**
 * This function checks if a user is preset to the task 
 * 
 * @returns - the user id 
 */
function userTest() {
  if (userId[0]) {
    let userTaskId = Number(userId[0]);
    return userTaskId;
  } else {
    let userTaskId = "";
    return userTaskId;
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
 * @param {number} userTaskId - key of the user Id
 * @param {string} currenttaskStatus -key of the current task status
 */
async function putEditTasksContent(
  title,
  description,
  dueDate,
  taskId,
  assignedTo,
  categorySeleced,
  userTaskId,
  currenttaskStatus
) {
  postData(`tasks/${taskId - 1}/`, {
    title: title,
    description: description,
    date: dueDate,
    priority: selectedPrio,
    category: categorySeleced,
    id: taskId,
    subtasks: await getEditSubtasks(taskId),
    assigned: assignedTo,
    status: currenttaskStatus,
    user: userTaskId,
  });
}

/**
 * This function gets all subtasks if edited
 * 
 * @param {number} taskId - Id of the task
 * @returns - the subtasks 
 */
async function getEditSubtasks(taskId) {
  let tasks = await fetchData("tasks");
  let editSingleTask = tasks.find((task) => task.id === taskId);
  let filteredSubtasks = editSingleTask.subtasks?.filter(data => data !== null) || [];
  if (subTasks.length === 0) return [];
  return subTasks.map((subName, index) => 
    createSubtaskObject(subName, index, filteredSubtasks)
  );
}

/**
 * This function creates the subtask as object 
 * 
 * @param {string} subName - input value of the subtasks
 * @param {number} index - array location of the subtasks
 * @param {boolean} filteredSubtasks - subtask status
 * @returns - the new subtasks object
 */
function createSubtaskObject(subName, index, filteredSubtasks) {
  let foundSubtask = filteredSubtasks.find(
    (filteredTask) => filteredTask.subTaskName === subName
  );
  return {
    subTaskName: subName,
    subId: index + 1,
    done: foundSubtask ? foundSubtask.done : false
  };
}

/** This function closes the dialog feedback after editing a task */
function closeAddTaskDialogFeedback() {
  let slidingDiv = document.getElementById("task_added_overlay");
  slidingDiv.innerHTML = "";
  slidingDiv.classList.toggle("visible");
}