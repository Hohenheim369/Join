/**
 * Opens a single task from the board.
 *
 * @param {number} taskId - Id of the opened task
 */
async function openSingleTask(taskId) {
  let tasks = await fetchData("tasks");
  let singleTask = tasks.find((task) => task.id === taskId);
  let categoryColor = singleTask.category.replace(/\s+/g, "").toLowerCase();
  let contacts = await fetchData("contacts");

  displaySingleTask(singleTask, categoryColor);
  displaySingleAssinees(singleTask, contacts);
  displaySingleSubtasks(singleTask.subtasks, taskId);
  toggleOverlay("board_task_overlay");
}

/**
 * Gets the HTML element in which the task should be displayed,
 * empties it and generates the new task
 *
 * @param {Object} singleTask - Details of the D task
 * @param {string} categoryColor - Color of the category
 * @param {Array} contacts - All contacts from firebase
 */
function displaySingleTask(singleTask, categoryColor) {
  let singleTaskArea = document.getElementById(`single_task`);
  singleTaskArea.innerHTML = "";

  singleTaskArea.innerHTML += generateSingleTasks(
    singleTask,
    categoryColor
  );
}

/**
 * Gets the HTML element in which the assinees should be displayed,
 * empties it and generates the new task
 *
 * @param {Object} singleTask - Details of the selected task
 * @param {Array} contacts - All contacts from firebase
 */
function displaySingleAssinees(singleTask, contacts) {
  let assigneeField = document.getElementById("single_assignee");
  assigneeField.innerHTML = "";
  let hasAssignees = displayAssigneesAndUsers(
    singleTask,
    contacts,
    assigneeField
  );

  if (!hasAssignees) {
    assigneeField.innerHTML = generateNoAssigneeField();
  }
}

/**
 * Checks whether assignees exist
 *
 * @param {Object} singleTask - Details of the selected task
 * @param {Array} contacts - All contacts from the database
 * @param {HTMLElement} assigneeField - The HTML element where assignees will be displayed
 * @returns {boolean} - True if there are assignees, false otherwise
 */
function displayAssigneesAndUsers(singleTask, contacts, assigneeField) {
  let hasUserAssignees = displayUserAsAssignee(singleTask, assigneeField);
  let hasContactAssignees = displayContactAsAssinee(
    singleTask,
    contacts,
    assigneeField
  );

  return hasUserAssignees || hasContactAssignees;
}

/**
 * Display users if they are the activeUser of the task
 *
 * @param {Object} singleTask - Details of the selected task
 * @param {HTMLElement} assigneeField - The HTML element where assignees will be displayed
 * @returns {boolean} - True if there ist user as assignee, false otherwise
 */
function displayUserAsAssignee(singleTask, assigneeField) {
  if (singleTask.user === activeUser.id) {
    assigneeField.innerHTML += generateSingleUserAsAssignee();
    return true;
  }
  return false;
}

/**
 * Display contacts if they are assignees
 *
 * @param {Object} singleTask - Details of the selected task
 * @param {Array} contacts - All contacts from the database
 * @param {HTMLElement} assigneeField - The HTML element where assignees will be displayed
 * @returns {boolean} - True if there are contacts as assignees, false otherwise
 */
function displayContactAsAssinee(singleTask, contacts, assigneeField) {
  let assinees = singleTask.assigned || [];
  let validContacts = contacts.filter(
    (contact) =>
      assinees.includes(contact.id) && activeUser.contacts.includes(contact.id)
  );

  validContacts.forEach(
    (contact) => (assigneeField.innerHTML += generateSingleAssignee(contact))
  );

  return validContacts.length > 0;
}

/**
 * Gets the HTML element in which the subtasks should be displayed,
 * empties it and generates the subtasks
 *
 * @param {Array} subtasks - Subtasks of the Task
 * @param {number} taskId - Task Id
 */
function displaySingleSubtasks(subtasks, taskId) {
  let subtaskField = document.getElementById("single_subtask");
  subtaskField.innerHTML = "";

  if (subtasks) {
    subtasks.forEach((subtask) => {
      subtaskField.innerHTML += generateSingleSubtasks(subtask, taskId);
    });
  } else {
    subtaskField.innerHTML = generateNoSubtaskField();
  }
}

/**
 * Updates the status of the subtask and re-uploads the task.
 *
 * @param {number} taskId - Task Id
 * @param {number} subId - Subtaskask Id
 */
async function updateSubtaskStatus(taskId, subId) {
  toggleCheckButton(`task_${taskId}_subtask_${subId}`, "button");

  let checkButton = document.getElementById(
    `task_${taskId}_subtask_${subId}`
  );
  let isChecked = checkButton.src.includes("true");

  let tasks = await fetchData("tasks");
  let task = tasks.find((task) => task.id === taskId);

  task.subtasks[subId - 1].done = isChecked;

  await postUpdatedTask(task);
}

/**
 * opens the delete window and adds the "YES" button
 *
 * @param {number} taskId - Task Id
 */
function openDeleteDialog(taskId) {
  toggleOverlay("board_delete_overlay");

  let yesButton = document.getElementById("delete_yes_btn");
  yesButton.innerHTML = generateDeleteButton(taskId);
}

/**
 * Deletes the task depending on the task ID.
 *
 * @param {number} taskId - Task Id
 */
async function deleteTask(taskId) {
  let users = await fetchData("users");

  if (taskId >= 1 && taskId <= 10) {
    await deleteTaskOnlyforUser(taskId, users);
  } else {
    await deleteTaskforAllUsers(taskId, users);
  }

  deleteTaskInLocalStorage(taskId);

  await showSuccessfullyDelete();
  toggleOverlay("board_delete_overlay");
  toggleOverlay("board_task_overlay");
  window.location.reload();
}

/**
 * Checks whether the task is assigned to the activeUser and deletes it.
 * The task is not deleted for the guest.
 *
 * @param {number} taskId - Task Id
 * @param {Array} users - All users of the database
 */
async function deleteTaskOnlyforUser(taskId, users) {
  if (activeUser.id === 0) {
    return;
  }
  users = users.map((user) => removeTaskFromUser(user, taskId));
  await postData("users", users);
}

/**
 * Deletes the task for the user if it is the activeUser.
 *
 * @param {Object} user - User details
 * @param {number} taskId - Task Id
 * @returns {Object} - updated user details
 */
function removeTaskFromUser(user, taskId) {
  if (user.id === activeUser.id) {
    return {
      ...user,
      tasks: user.tasks.filter((task) => task !== taskId),
    };
  }
  return user;
}

/**
 * Deletes the task for all users.
 * The task is not deleted for the guest.
 *
 * @param {number} taskId - Task Id
 * @param {Array} users - All users of the database
 */
async function deleteTaskforAllUsers(taskId, users) {
  await deleteData("tasks", taskId);
  if (activeUser.id === 0) {
    return;
  }
  users = removeTaskFromUsers(users, taskId);
  await postData("users", users);
}

/**
 * Deletes the task for all users if it is the activeUser.
 *
 * @param {Array} users - All users of the database
 * @param {number} taskId - Task Id
 * @returns {Object} - updated user details
 */
function removeTaskFromUsers(users, taskId) {
  return users.map((user) => ({
    ...user,
    tasks: user.tasks.filter((task) => task !== taskId),
  }));
}

/**
 * Deletes the task for the activeUser in localStorage.
 *
 * @param {number} taskId - Task Id
 */
function deleteTaskInLocalStorage(taskId) {
  let activeUser = JSON.parse(localStorage.getItem("activeUser"));
  activeUser.tasks = activeUser.tasks.filter((task) => task !== taskId);
  localStorage.setItem("activeUser", JSON.stringify(activeUser));
}

/**
 * Shows the message for successful deletion.
 */
function showSuccessfullyDelete() {
  return new Promise((resolve) => {
    let overlay = document.getElementById("successfully_delete_task");
    overlay.classList.remove("d-none");
    overlay.classList.add("active");

    setTimeout(() => {
      overlay.classList.add("visible");
      setTimeout(() => {
        overlay.classList.remove("active", "visible");
        overlay.classList.add("d-none");
        resolve();
      }, 1500);
    }, 50);
  });
}


