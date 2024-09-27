function toggleOverlay(section) {
  let refOverlay = document.getElementById(section);
  refOverlay.classList.toggle("d-none");

  if (!refOverlay.classList.contains("d-none")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}

let currentDraggedElement;

function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function hightlight(status) {
  document
    .getElementById(`kanban_${status}`)
    .classList.add("kanban-tasks-highlight");
}

function removeHightlight(status) {
  document
    .getElementById(`kanban_${status}`)
    .classList.remove("kanban-tasks-highlight");
}

async function moveTo(status) {
  let tasks = await fetchData("tasks");
  let movedTask = tasks.find((task) => task.id === currentDraggedElement);
  movedTask.status = status;
  await postUpdatedTask(movedTask);
  removeHightlight(status);
  updateTasksOnBoard();
}

async function postUpdatedTask(task) {
  try {
    const updatedTask = await postData(`tasks/${task.id - 1}`, task);
    return updatedTask;
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Tasks:", error);
  }
}

async function updateTasksOnBoard() {
  const statuses = ["todo", "inprogress", "awaitfeedback", "done"];
  cleanBoard(statuses);
  await renderTasksInStatusArea(statuses);
}

function cleanBoard(statuses) {
  statuses.forEach((status) => {
    const statusColumn = document.getElementById(`kanban_${status}`);
    statusColumn.innerHTML = "";
  });
}

async function renderTasksInStatusArea(statuses) {
  let tasksToRender = await filterUserTasks();
  tasksToRender = filterSoughtTask(tasksToRender);
  const contacts = await fetchData("contacts");

  statuses.forEach((status) =>
    renderStatusArea(status, tasksToRender, contacts)
  );
}

function filterSoughtTask(tasksToRender) {
  let soughtedTask = document.getElementById("sought_task").value.toLowerCase();
  if (soughtedTask.length === 0) {
    return tasksToRender;
  }

  return tasksToRender.filter(
    (task) =>
      task.title.toLowerCase().includes(soughtedTask) ||
      task.description.toLowerCase().includes(soughtedTask)
  );
}

async function filterUserTasks() {
  let userTasks = activeUser.tasks;
  let allTasks = await fetchData("tasks");

  const tasksToRender = allTasks.filter((task) => userTasks.includes(task.id));
  return tasksToRender;
}

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
  });
}

function shortenDescription(description) {
  const words = description.split(/\s+/);
  if (words.length <= 6) return description;
  return words.slice(0, 6).join(" ") + "...";
}

function displaySubtasks(task) {
  let subtaskArea = document.getElementById(`subtasks_${task.id}`);
  subtaskArea.innerHTML = "";
  subtaskArea.classList.add("d-none");

  addSubtasksOnBoardTasks(subtaskArea, task);
}

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

function updateSubtasksBar(taskId, sumDoneSubtasks, sumAllSubtasks) {
  const taskElement = document.getElementById(`task_${taskId}`);
  const subtasksBar = taskElement.querySelector(".task-subtasks-bar");

  const percentage = (sumDoneSubtasks / sumAllSubtasks) * 100;
  subtasksBar.style.setProperty("--progress", `${percentage}%`);
}

function displayAssigneesForTask(task, contacts) {
  const assignedField = document.getElementById(`assignees_task_${task.id}`);
  assignedField.innerHTML = "";
  let maxDisplayed = determineMaxDisplayed(task);

  if (task.assigned) {
    let assignees = task.assigned.filter((data) => data !== null);
    displayAssignees(assignees, contacts, assignedField, maxDisplayed);
    displayCount(task, assignees, maxDisplayed);
  }

  displayUser(task, assignedField);
}

function determineMaxDisplayed(task) {
  if (task.user === activeUser.id) {
    return 2;
  }
  return 3;
}

function displayAssignees(assignees, contacts, assignedField, maxDisplayed) {
  assignees
    .slice(0, maxDisplayed)
    .forEach((contactId) => renderAssignee(contactId, contacts, assignedField));
}

function renderAssignee(contactId, contacts, assignedField) {
  const contact = contacts.find((c) => c.id === contactId);

  if (contact) {
    assignedField.innerHTML += `
      <span class="assignee font-s-12 font-c-white mar-r-8 wh-32 d-flex-center" 
            style="background-color: ${contact.color};">${contact.initials}
      </span>`;
  }
}

function displayCount(task, assignees, maxDisplayed) {
  const assignedNumberField = document.getElementById(
    `assignees_number_${task.id}`
  );
  assignedNumberField.innerHTML = "";

  if (assignees.length > maxDisplayed) {
    const remainingCount = assignees.length - maxDisplayed;
    assignedNumberField.innerHTML += `
      <span class="additionally-assignee wh-32 d-flex-center">
        +${remainingCount}
      </span>`;
  }
}

function displayUser(task, assignedField) {
  if (task.user === activeUser.id) {
    assignedField.innerHTML += `
      <span class="user font-s-12 mar-r-8 wh-32 d-flex-center" 
            style="background-color: ${activeUser.color};">${activeUser.initials}
      </span>`;
  }
}
