const STATUSES = ["todo", "inprogress", "awaitfeedback", "done"];
let currentDraggedElement;

/**
 * Toggles the visibility of an overlay section and adjusts the body scroll.
 *
 * @param {string} section - The ID of the overlay section to toggle.
 */
function toggleOverlay(section) {
  let refOverlay = document.getElementById(section);

  refOverlay.classList.toggle("d-none");

  if (!refOverlay.classList.contains("d-none")) {
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      refOverlay.classList.add("active", "visible");
    }, 50);
  } else {
    document.body.style.overflow = "auto";
    refOverlay.classList.remove("active", "visible");
  }
}

/**
 * Moves a task to a new status in the kanban board.
 *
 * @param {number|string} taskId - The ID of the task to be moved.
 * @param {string} status - The current status of the task.
 * @param {number} moveToDirection - The direction to move (-1 for left, 1 for right).
 */
async function moveToStatus(taskId, status, moveToDirection) {
  let currentIndex = STATUSES.indexOf(status);
  let newIndex = currentIndex + moveToDirection;
  let newStatus = STATUSES[newIndex];

  currentDraggedElement = taskId;

  await moveTo(newStatus);
}

/**
 * Initiates the dragging process for a task.
 *
 * @param {number|string} id - The ID of the task being dragged.
 */
function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * Prevents the default handling of the drag event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Highlights a specific kanban status column.
 *
 * @param {string} status - The status of the column to highlight.
 */
function hightlight(status) {
  document
    .getElementById(`kanban_${status}`)
    .classList.add("kanban-tasks-highlight");
}

/**
 * Removes the highlight from a specific kanban status column.
 *
 * @param {string} status - The status of the column to remove highlight from.
 */
function removeHightlight(status) {
  document
    .getElementById(`kanban_${status}`)
    .classList.remove("kanban-tasks-highlight");
}

/**
 * Moves the currently dragged task to a new status.
 *
 * @param {string} status - The new status to move the task to.
 */
async function moveTo(status) {
  let tasks = await fetchData("tasks");
  let movedTask = tasks.find((task) => task.id === currentDraggedElement);
  movedTask.status = status;
  await postUpdatedTask(movedTask);
  removeHightlight(status);
  updateTasksOnBoard();
}

/**
 * Posts an updated task to the server.
 *
 * @param {Object} task - The task object to be updated.
 */
async function postUpdatedTask(task) {
  try {
    let updatedTask = await postData(`tasks/${task.id - 1}`, task);
    return updatedTask;
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Tasks:", error);
  }
}

/**
 * Clears the value of a specified search field.
 *
 * @param {string} field - The ID of the search field to clear.
 */
function clearSearchField(field) {
  let searchFiel = document.getElementById(field);
  searchFiel.value = "";
}
