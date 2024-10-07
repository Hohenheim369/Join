/**
 * Adds an event listener that is triggered when the DOM is fully loaded.
 * Upon triggering, the greeting is displayed, tasks are rendered, and 
 * the mobile greeting is checked.
 */
document.addEventListener("DOMContentLoaded", () => {
  greeting();
  renderTasks();
  if (window.innerWidth <= 770) {
    checkAndShowGreeting();
  }
});

/**
 * Updates the greeting message and displays it.
 */
function greeting() {
  let greeting = document.getElementById("greetings");
  let greetingMobile = document.getElementById("greeting_mobile");
  let greetingUser = getNameFromLocalStorage();
  let greetingMassage = getGreetingMessage();
  greeting.innerHTML = "";
  greetingMobile.innerHTML = "";
  greeting.innerHTML = greetingHtml(greetingMassage, greetingUser);
  greetingMobile.innerHTML = greetingHtml(greetingMassage, greetingUser);
}

/**
 * Retrieves the user's name from local storage.
 * @returns {string} - The name of the logged-in user.
 */
function getNameFromLocalStorage() {
  let activeUser = localStorage.getItem("activeUser");
  const loggedInUser = JSON.parse(activeUser);
  return loggedInUser.name;
}

/**
 * Returns the greeting message based on the current time.
 * @returns {string} - The greeting message ("Good morning", "Good afternoon", or "Good evening").
 */
function getGreetingMessage() {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return "Good morning";
  } else if (currentHour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

/**
 * Generates the HTML for the greeting.
 * @param {string} greetingMassage - The greeting message.
 * @param {string} greetingUser - The user's name.
 * @returns {string} - The HTML representation of the greeting.
 */
function greetingHtml(greetingMassage, greetingUser) {
  return `${greetingMassage}, <div class="greeting-user">${greetingUser}</div>`;
}

/**
 * Renders the tasks and updates the counters.
 * @returns {Promise<void>}
 */
async function renderTasks() {
  const tasks = await loadTasks();
  countToDo(tasks);
  countDone(tasks);
  countUrgent(tasks);
  deadlineDate(tasks);
  countTaskInBoard(tasks);
  countTaskInProgress(tasks);
  countTaskInFeedback(tasks);
}

/**
 * Loads the active user's tasks from local storage.
 * @returns {Promise<Array>} - An array of tasks.
 */
async function loadTasks() {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  if (activeUser && activeUser.tasks) {
    const taskIds = activeUser.tasks;
    const tasks = await Promise.all(
      taskIds.map(async (taskId) => {
        const allTasks = await fetchData("tasks");
        return allTasks.find((t) => t.id === taskId) || null;
      })
    );
    return tasks.filter((task) => task !== null);
  }
  return [];
}

/**
 * Counts the number of tasks with the status "todo" and updates the display.
 * @param {Array} tasks - The list of tasks.
 */
function countToDo(tasks) {
  let toDo = document.getElementById("count_to_do");
  let count = tasks.filter((task) => task.status === "todo").length;
  toDo.innerHTML = `${count}`;
}

/**
 * Counts the number of completed tasks and updates the display.
 * @param {Array} tasks - The list of tasks.
 */
function countDone(tasks) {
  let done = document.getElementById("count_done");
  let count = tasks.filter((task) => task.status === "done").length;
  done.innerHTML = `${count}`;
}

/**
 * Counts the number of tasks with a due date and updates the display.
 * @param {Array} tasks - The list of tasks.
 */
function countUrgent(tasks) {
  let urgent = document.getElementById("count_priority_urgent");
  let count = tasks.filter((task) => task.priority === "urgent").length;
  urgent.innerHTML = `${count}`;
}

/**
 * Counts the total number of tasks and updates the display.
 * @param {Array} tasks - The list of tasks.
 */
function countTaskInBoard(tasks) {
  let taskInBoard = document.getElementById("count_tasks");
  let count = tasks.length;
  taskInBoard.innerHTML = `${count}`;
}

/**
 * Counts the number of tasks in the "in progress" status and updates the display.
 * @param {Array} tasks - The list of tasks.
 */
function countTaskInProgress(tasks) {
  let taskInProgress = document.getElementById("count_progress");
  let count = tasks.filter((task) => task.status === "inprogress").length;
  taskInProgress.innerHTML = `${count}`;
}

/**
 * Counts the number of tasks in the "await feedback" status and updates the display.
 * @param {Array} tasks - The list of tasks.
 */
function countTaskInFeedback(tasks) {
  let taskInFeedback = document.getElementById("count_feedback");
  let count = tasks.filter((task) => task.status === "awaitfeedback").length;
  taskInFeedback.innerHTML = `${count}`;
}

/**
 * Outputs the next due date of the tasks and formats it.
 * @param {Array} tasks - The list of tasks.
 */
function deadlineDate(tasks) {
  const tasksWithDueDate = tasks.filter((task) => task.date);
  tasksWithDueDate.sort((a, b) => new Date(a.date) - new Date(b.date));
  const nextDueDate = tasksWithDueDate[0]?.date; 
  const [year, month, day] = nextDueDate.split("-");
  const dateObj = new Date(year, month - 1, day);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const deadlineElement = document.getElementById("deadline_date");
  deadlineElement.innerHTML = `${formattedDate}`;
}

/**
 * Navigates to the board page.
 */
function navigatonToBoard() {
  window.location.href = "../html/board.html";
}

/**
 * Displays the mobile greeting and hides it after 2.5 seconds.
 */
function mobileGreeting() {
  const greetingDialog = document.getElementById("greeting_mobile");
  if (greetingDialog) {
    greetingDialog.classList.remove("d-none");
    setTimeout(() => {
      greetingDialog.classList.add("d-none");
      greetingDialog.close();
    }, 2500); 
  }
}

/**
 * Checks if the mobile greeting should be displayed and shows it if necessary.
 */
function checkAndShowGreeting() {
  const greetingShown = localStorage.getItem("greetingShown");
  if (greetingShown === "false" || !greetingShown) {
    mobileGreeting();
    localStorage.setItem("greetingShown", "true");
  }
}