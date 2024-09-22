function toggleOverlay() {
  let refOverlay = document.getElementById("board-ticket-overlay");
  refOverlay.classList.toggle("d-none");

  if (!refOverlay.classList.contains("d-none")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}

function bubblingPrevention(event) {
  event.stopPropagation();
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
  const tasksToRender = await filterUserTasks();
  const contacts = await fetchData("contacts");

  statuses.forEach((status) =>
    renderStatusArea(status, tasksToRender, contacts)
  );
}

async function filterUserTasks() {
  let userTasks = activeUser.tasks;
  const allTasks = await fetchData("tasks");

  const tasksToRender = allTasks.filter((task) => userTasks.includes(task.id));
  console.log("User Tasks:", userTasks);
  console.log("Tasks to render:", tasksToRender);
  return tasksToRender;
}

function renderStatusArea(status, tasks, contacts) {
  let statusArea = document.getElementById(`kanban_${status}`);
  statusArea.innerHTML = "";

  let statusTasks = tasks.filter((task) => task.status == status);

  if (statusTasks == "") {
    statusArea.innerHTML =
      '<div class="ticket-none d-flex-center">No tasks To do</div>';
  } else {
    renderStatusTasks(statusTasks, statusArea, contacts);
  }
}

function renderStatusTasks(tasks, area, contacts) {
  tasks.forEach((task) => {
    let shortDescription = shortenDescription(task.description);
    let sumAllSubtasks = task.subtasks.length;
    let sumDoneSubtasks = task.subtasks.filter(
      (subtask) => subtask.done
    ).length;

    area.innerHTML += generateTasksOnBoard(
      task.id,
      task.title,
      shortDescription,
      task.category,
      task.status,
      task.priority,
      sumAllSubtasks,
      sumDoneSubtasks
    );
    updateSubtasksBar(task.id, sumDoneSubtasks, sumAllSubtasks);
    displayAssigneesForTask(task.id, task.assigned, contacts);
  });
}

function shortenDescription(description) {
  const words = description.split(/\s+/);
  if (words.length <= 6) return description;
  return words.slice(0, 6).join(" ") + "...";
}

function updateSubtasksBar(taskId, sumDoneSubtasks, sumAllSubtasks) {
  const taskElement = document.getElementById(`task_${taskId}`);
  if (!taskElement) return;

  const subtasksBar = taskElement.querySelector(".ticket-subtasks-bar");
  if (!subtasksBar) return;

  const percentage =
    sumAllSubtasks > 0 ? (sumDoneSubtasks / sumAllSubtasks) * 100 : 0;
  subtasksBar.style.setProperty("--progress", `${percentage}%`);

  const subtasksText = taskElement.querySelector(".ticket-subtasks-text");
  if (subtasksText) {
    subtasksText.textContent = `${sumDoneSubtasks}/${sumAllSubtasks} Subtasks`;
  }
}

function displayAssigneesForTask(taskId, assigned, contacts) {
  const assignedField = document.getElementById(`assignees_task_${taskId}`);
  assignedField.innerHTML = "";

  const maxDisplayed = 3;
  
  assigned
    .filter(contactId => contactId !== null)
    .slice(0, maxDisplayed)
    .forEach(contactId => renderAssignee(contactId, contacts, assignedField));

  displayAdditionalAssigneesCount(assigned, maxDisplayed, assignedField);
}

function renderAssignee(contactId, contacts, assignedField) {
  const contact = contacts.find(c => c.id === contactId);
  
  if (contact) {
    assignedField.innerHTML += `
      <span class="assignee font-c-white mar-r-8 wh-32 d-flex-center" 
            style="background-color: ${contact.color};">
        ${contact.initials}
      </span>`;
  } else {
    console.log(`Kontakt mit ID ${contactId} nicht gefunden.`);
  }
}

function displayAdditionalAssigneesCount(assigned, maxDisplayed, assignedField) {
  if (assigned.length > maxDisplayed) {
    const remainingCount = assigned.length - maxDisplayed;
    assignedField.innerHTML += `
      <span class="additionally-assignee wh-32 d-flex-center">
        +${remainingCount}
      </span>`;
  }
}