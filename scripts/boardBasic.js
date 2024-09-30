const statuses = ["todo", "inprogress", "awaitfeedback", "done"];
let currentDraggedElement;

function toggleOverlay(section) {
  let refOverlay = document.getElementById(section);
  refOverlay.classList.toggle("d-none");

  // if (!refOverlay.classList.contains("d-none")) {
  //   document.body.style.overflow = "hidden";
  // } else {
  //   document.body.style.overflow = "auto";
  // }
}

async function moveToStatus(taskId, status, moveToDirection) {
  let currentIndex = statuses.indexOf(status);
  let newIndex = currentIndex + moveToDirection;
  let newStatus = statuses[newIndex];

  currentDraggedElement = taskId;

  await moveTo(newStatus);
}

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

function clearSearchField(field){
  let searchFiel = document.getElementById(field);
  searchFiel.value = "";
}

