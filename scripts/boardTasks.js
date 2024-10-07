/**
 * Updates the Kanban board by cleaning it and rendering tasks in their respective status areas.
 */
async function updateTasksOnBoard() {
  cleanBoard();
  await renderTasksInStatusArea();
}

/**
 * Cleans the Kanban board by removing all tasks from each status column.
 */
function cleanBoard() {
  STATUSES.forEach((status) => {
    let statusColumn = document.getElementById(`kanban_${status}`);
    statusColumn.innerHTML = "";
  });
}

/**
 * Renders filtered tasks in their respective status areas on the Kanban board.
 */
async function renderTasksInStatusArea() {
  let tasksToRender = await filterUserTasks();
  tasksToRender = filterSoughtTaskToRender(tasksToRender);
  noTaskFound(tasksToRender);
  let contacts = await fetchData("contacts");

  STATUSES.forEach((status) =>
    renderStatusArea(status, tasksToRender, contacts)
  );
}

/**
 * Filters tasks assigned to the active user.
 *
 * @returns {Object} An array of task objects assigned to the active user
 */
async function filterUserTasks() {
  let userTasks = activeUser.tasks;
  let allTasks = await fetchData("tasks");

  let tasksToRender = allTasks.filter((task) => userTasks.includes(task.id));
  return tasksToRender;
}

/**
 * Filters tasks based on a search query in their title or description.
 *
 * @param {Object} tasksToRender - An array of task objects to filter
 * @returns {Object} An array of filtered task objects matching the search query
 */
function filterSoughtTaskToRender(tasksToRender) {
  let soughtTask = getSoughtTask();

  if (soughtTask.length != 0) {
    return tasksToRender.filter(
      (task) =>
        task.title.toLowerCase().includes(soughtTask) ||
        task.description.toLowerCase().includes(soughtTask)
    );
  }

  return tasksToRender;
}

/**
 * Retrieves the search query from both desktop and mobile input fields.
 *
 * @returns {string} The lowercase search query
 */
function getSoughtTask() {
  let soughtedTaskDesktop = document.getElementById("sought_task").value;
  let soughtedTaskMobile =
    document.getElementById("sought_task_mobile").value;
  return (soughtedTaskDesktop || soughtedTaskMobile).toLowerCase();
}

/**
 * User feedback for no task found.
 * 
 * @param {Object} tasksToRender - all filtered user tasks
 */
function noTaskFound(tasksToRender){
  let noTaskField = document.getElementById("task_not_found");
  let kanbanField = document.getElementById("kanban_board");

  noTaskField.classList.add('d-none');
  kanbanField.classList.remove('d-none');

  if (tasksToRender.length == 0) {
    noTaskField.classList.remove('d-none');
    kanbanField.classList.add('d-none');
  }  
}

/**
 * Renders tasks in a specific status area on the Kanban board.
 *
 * @param {string} status - The status of the tasks to render
 * @param {Array} tasks - An array of all tasks
 * @param {Array} contacts - An array of contact objects
 */
function renderStatusArea(status, tasks, contacts) {
  let statusArea = document.getElementById(`kanban_${status}`);
  statusArea.innerHTML = "";

  let statusTasks = tasks.filter((task) => task.status == status);

  if (statusTasks == "") {
    statusArea.innerHTML = generateNoTaskField();
  } else {
    renderStatusTasks(statusTasks, statusArea, contacts);
  }
}

/**
 * Renders individual tasks in a specific status area.
 *
 * @param {Array} tasks - An array of tasks to render
 * @param {HTMLElement} area - The HTML element to render tasks in
 * @param {Array} contacts - An array of contact objects
 */
function renderStatusTasks(tasks, area, contacts) {
  tasks.forEach((task) => {
    let shortDescription = shortenDescription(task.description);
    let categoryColor = task.category.replace(/\s+/g, "").toLowerCase();

    area.innerHTML += generateTasksOnBoard(
      task.id,
      task.title,
      shortDescription,
      task.category,
      categoryColor,
      task.priority
    );
    displaySubtasks(task);
    displayAssigneesForTask(task, contacts);
    displayStatusArrows(task);
  });
}

/**
 * Shortens a task description to a maximum of 6 words.
 *
 * @param {string} description - The full task description
 * @returns {string} - The shortened description
 */
function shortenDescription(description) {
  let words = description.split(/\s+/);
  if (words.length <= 6) return description;
  return words.slice(0, 6).join(" ") + "...";
}

/**
 * Displays subtasks for a given task on the Kanban board.
 *
 * @param {Object} task - The task object containing subtasks
 */
function displaySubtasks(task) {
  let subtaskArea = document.getElementById(`subtasks_${task.id}`);
  subtaskArea.innerHTML = "";
  subtaskArea.classList.add("d-none");

  addSubtasksOnBoardTasks(subtaskArea, task);
}

/**
 * Adds subtasks to a task card on the Kanban board.
 *
 * @param {HTMLElement} subtaskArea - The DOM element to render subtasks in
 * @param {Object} task - The task object containing subtasks
 */
function addSubtasksOnBoardTasks(subtaskArea, task) {
  if (task.subtasks || Array.isArray(task.subtasks)) {
    subtaskArea.classList.remove("d-none");
    let sumAllSubtasks = task.subtasks.length;
    let sumDoneSubtasks = task.subtasks.filter(
      (subtask) => subtask.done
    ).length;

    subtaskArea.innerHTML = generateSubtasks(sumDoneSubtasks, sumAllSubtasks);

    updateSubtasksBar(task.id, sumDoneSubtasks, sumAllSubtasks);
  }
}

/**
 * Updates the visual progress bar for subtasks on a task card.
 *
 * @param {number} taskId - The ID of the task
 * @param {number} sumDoneSubtasks - The number of completed subtasks
 * @param {number} sumAllSubtasks - The total number of subtasks
 */
function updateSubtasksBar(taskId, sumDoneSubtasks, sumAllSubtasks) {
  let taskElement = document.getElementById(`task_${taskId}`);
  let subtasksBar = taskElement.querySelector(".task-subtasks-bar");

  let percentage = (sumDoneSubtasks / sumAllSubtasks) * 100;
  subtasksBar.style.setProperty("--progress", `${percentage}%`);
}

/**
 * Displays assignees for a given task on the Kanban board.
 *
 * @param {Object} task - The task object
 * @param {Array} contacts - An array of contact objects
 */
function displayAssigneesForTask(task, contacts) {
  let assignedField = document.getElementById(`assignees_task_${task.id}`);
  assignedField.innerHTML = "";
  let maxDisplayed = determineMaxDisplayed(task);
  let validContacts = contacts.filter(
    (contact) =>
      activeUser.contacts.includes(contact.id)
  );

  if (task.assigned) {
    let assignees = task.assigned.filter((data) => data !== null);
    displayAssignees(assignees, validContacts, assignedField, maxDisplayed);
    displayCount(task, assignees, maxDisplayed);
  }

  displayUser(task, assignedField);
}

/**
 * Determines the maximum number of assignees to display on a task card.
 *
 * @param {Object} task - The task object
 * @returns {number} - The maximum number of assignees to display
 */
function determineMaxDisplayed(task) {
  if (task.user === activeUser.id) {
    return 2;
  }
  return 3;
}

/**
 * Renders assignees on a task card up to a maximum number.
 *
 * @param {Array} assignees - An array of assignee IDs
 * @param {Array} contacts - An array of contact objects
 * @param {HTMLElement} assignedField - The HTML element to render assignees in
 * @param {number} maxDisplayed - The maximum number of assignees to display
 */
function displayAssignees(assignees, contacts, assignedField, maxDisplayed) {
  assignees
    .slice(0, maxDisplayed)
    .forEach((contactId) => renderAssignee(contactId, contacts, assignedField));
}

/**
 * Renders a single assignee on a task card.
 *
 * @param {string} contactId - The ID of the contact to render
 * @param {Array} contacts - An array of contact objects
 * @param {HTMLElement} assignedField - The HTML element to render the assignee in
 */
function renderAssignee(contactId, contacts, assignedField) {
  let contact = contacts.find((c) => c.id === contactId);

  if (contact) {
    assignedField.innerHTML += generateAssigneeField(contact);
  }
}

/**
 * Displays the count of additional assignees if there are more than the maximum displayed.
 *
 * @param {Object} task - The task object
 * @param {Array} assignees - An array of assignee IDs
 * @param {number} maxDisplayed - The maximum number of assignees displayed
 */
function displayCount(task, assignees, maxDisplayed) {
  let numberField = document.getElementById(`assignees_number_${task.id}`);
  numberField.innerHTML = "";

  if (assignees.length > maxDisplayed) {
    let remainingCount = assignees.length - maxDisplayed;
    numberField.innerHTML += generateAdditionallyAssigneeField(remainingCount);
  }
}

/**
 * Displays the active user on the task card if they are assigned to the task.
 *
 * @param {Object} task - The task object
 * @param {HTMLElement} assignedField - The DOM element to render the user in
 */
function displayUser(task, assignedField) {
  if (task.user === activeUser.id) {
    assignedField.innerHTML += generateUserField(activeUser);
  }
}

/**
 * Displays status change arrows on a task card based on its current status.
 *
 * @param {Object} task - The task object
 */
function displayStatusArrows(task) {
  let taskCard = document.getElementById(`task_card_${task.id}`);
  let arrowTop = document.getElementById(`arrow_area_top_${task.id}`);
  let arrowBottom = document.getElementById(`arrow_area_bottom_${task.id}`);

  if (task.status != "todo") {
    arrowTop.innerHTML = generateArrowTop(task);
    taskCard.classList.add("task-arrow-top");
  }

  if (task.status != "done") {
    arrowBottom.innerHTML = generateArrowBottom(task);
    taskCard.classList.add("task-arrow-bottom");
  }
}
