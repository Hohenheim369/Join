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

function renderAssignees(id, assigned, contacts) {
  let updateAssigned = assigned.filter((item) => item !== null);
  let assignedField = document.getElementById(`assignees_task_${id}`);
  assignedField.innerHTML = "";

  const maxDisplayed = 3;
  const displayCount = Math.min(updateAssigned.length, maxDisplayed);

  for (let index = 0; index < displayCount; index++) {
    const contactId = updateAssigned[index];
    console.log(contactId);

    const contact = contacts.find((c) => c.id === contactId);

    if (contact) {
      let assignedInitials = contact.initials;
      let assignedColor = contact.color;

      assignedField.innerHTML += `<span
        class="assignee font-c-white mar-r-8 wh-32 d-flex-center" style="background-color: ${assignedColor};"
        >${assignedInitials}</span>`;
    } else {
      console.log(`Kontakt mit ID ${contactId} nicht gefunden.`);
    }
  }

  if (updateAssigned.length > maxDisplayed) {
    const remainingCount = updateAssigned.length - maxDisplayed;
    assignedField.innerHTML += `<span class="additionally-assignee wh-32 d-flex-center"">+${remainingCount}</span>`;
  }
}

function updateColumnStatus(status) {
  const statusArea = document.getElementById(`kanban_${status}`);
  const noneTicketDiv = statusArea.querySelector(".ticket-none");
  const tasks = statusArea.querySelectorAll(".ticket-card");

  if (tasks.length === 0) {
    noneTicketDiv.style.display = "flex";
  } else {
    noneTicketDiv.style.display = "none";
  }
}

function renderTasks(task, contacts) {
  let statusArea = document.getElementById(`kanban_${task.status}`);
  let shortDescription = shortenDescription(task.description);
  let sumAllSubtasks = task.subtasks.length;
  let sumDoneSubtasks = task.subtasks.filter((subtask) => subtask.done).length;

  statusArea.innerHTML += generateTasksOnBoard(
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
  renderAssignees(task.id, task.assigned, contacts);
  // updateColumnStatus(task.status);
}

async function renderBoard() {
  let userTasks = activeUser.tasks;
  console.log('User Tasks:', userTasks);
  
  const allTasks = await fetchData("tasks");
  const contacts = await fetchData("contacts");
  const statuses = ["todo", "inprogress", "awaitfeedback", "done"];

  const tasksToRender = allTasks.filter(task => userTasks.includes(task.id));
  console.log('Tasks to render:', tasksToRender);

  statuses.forEach(status => {
    const statusColumn = document.getElementById(`kanban_${status}`);
    // statusColumn.innerHTML = '';
  });

  tasksToRender.forEach((task) => {
    renderTasks(task, contacts);
  });

  statuses.forEach(updateColumnStatus);
}

// function initDragAndDrop() {
//   const columns = document.querySelectorAll('.kanban-tickets');
//   columns.forEach(column => {
//     column.addEventListener('dragover', allowDrop);
//     column.addEventListener('drop', drop);
//   });
// }

// function allowDrop(ev) {
//   ev.preventDefault();
// }

// function drop(ev) {
//   ev.preventDefault();
//   const taskId = ev.dataTransfer.getData('text');
//   const task = document.getElementById(taskId);
//   ev.target.closest('.kanban-tickets').appendChild(task);

//   // Aktualisiere den Status für beide betroffenen Spalten
//   updateColumnStatus(task.dataset.status);
//   updateColumnStatus(ev.target.closest('.kanban-tickets').id.split('_')[1]);

//   // Aktualisiere den Status des Tasks
//   task.dataset.status = ev.target.closest('.kanban-tickets').id.split('_')[1];
// }
