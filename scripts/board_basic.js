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

  const subtasksBar = taskElement.querySelector('.ticket-subtasks-bar');
  if (!subtasksBar) return;

  const percentage = sumAllSubtasks > 0 ? (sumDoneSubtasks / sumAllSubtasks) * 100 : 0;
  subtasksBar.style.setProperty('--progress', `${percentage}%`);

  const subtasksText = taskElement.querySelector('.ticket-subtasks-text');
  if (subtasksText) {
    subtasksText.textContent = `${sumDoneSubtasks}/${sumAllSubtasks} Subtasks`;
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

function renderTasks(task) {
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
  // updateColumnStatus(task.status);
}

async function renderTasksInBoard() {
  const tasks = await fetchData("tasks");
  const statuses = ["todo", "inprogress", "awaitfeedback", "done"];

  tasks.forEach((task) => {
    renderTasks(task);
    // renderSubTasks(task);
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
