/**
 * Fügt einen Event-Listener hinzu, der ausgelöst wird, wenn der DOM vollständig geladen ist.
 * Bei Auslösung werden die Begrüßung, die Aufgaben gerendert und die mobile Begrüßung überprüft.
 */
document.addEventListener("DOMContentLoaded", () => {
  greeting();
  renderTasks();
  if (window.innerWidth <= 770) {
    checkAndShowGreeting();
  }
});

/**
 * Aktualisiert die Begrüßungsnachricht und zeigt sie an.
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
 * Ruft den Namen des Benutzers aus dem lokalen Speicher ab.
 * @returns {string} - Der Name des angemeldeten Benutzers.
 */
function getNameFromLocalStorage() {
  let activeUser = localStorage.getItem("activeUser");
  const loggedInUser = JSON.parse(activeUser);
  return loggedInUser.name;
}

/**
 * Gibt die Begrüßungsnachricht basierend auf der aktuellen Uhrzeit zurück.
 * @returns {string} - Die Begrüßungsnachricht ("Guten Morgen", "Guten Nachmittag" oder "Guten Abend").
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
 * Generiert die HTML für die Begrüßung.
 * @param {string} greetingMassage - Die Begrüßungsnachricht.
 * @param {string} greetingUser - Der Name des Benutzers.
 * @returns {string} - Die HTML-Darstellung der Begrüßung.
 */
function greetingHtml(greetingMassage, greetingUser) {
  return `${greetingMassage}, <div class="greeting-user">${greetingUser}</div>`;
}

/**
 * Rendert die Aufgaben und aktualisiert die Zähler.
 * @returns {Promise<void>}
 */
async function renderTasks() {
  const tasks = await loadTasks();
  countToDo(tasks);
  countDone(tasks);
  countTasksWithDueDate(tasks);
  countTaskInBoard(tasks);
  countTaskInProgress(tasks);
  countTaskInFeedback(tasks);
}

/**
 * Lädt die Aufgaben des aktiven Benutzers aus dem lokalen Speicher.
 * @returns {Promise<Array>} - Ein Array von Aufgaben.
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
 * Zählt die Anzahl der Aufgaben mit dem Status "todo" und aktualisiert die Anzeige.
 * @param {Array} tasks - Die Liste der Aufgaben.
 */
function countToDo(tasks) {
  let toDo = document.getElementById("count_to_do");
  let count = tasks.filter((task) => task.status === "todo").length;
  toDo.innerHTML = `${count}`;
}

/**
 * Zählt die Anzahl der erledigten Aufgaben und aktualisiert die Anzeige.
 * @param {Array} tasks - Die Liste der Aufgaben.
 */
function countDone(tasks) {
  let done = document.getElementById("count_done");
  let count = tasks.filter((task) => task.status === "done").length;
  done.innerHTML = `${count}`;
}

/**
 * Zählt die Anzahl der Aufgaben mit einem Due-Date und aktualisiert die Anzeige.
 * @param {Array} tasks - Die Liste der Aufgaben.
 */
function countTasksWithDueDate(tasks) {
  const tasksWithDueDate = tasks.filter((task) => task.date);
  tasksWithDueDate.sort((a, b) => new Date(a.date) - new Date(b.date));
  const nextDueDate = tasksWithDueDate[0]?.date;
  const tasksWithSameDueDate = tasks.filter((task) => task.date === nextDueDate);
  const taskCountElement = document.getElementById("count_priority_urgent");
  taskCountElement.innerHTML = `${tasksWithSameDueDate.length}`;
}

/**
 * Zählt die Gesamtzahl der Aufgaben und aktualisiert die Anzeige.
 * @param {Array} tasks - Die Liste der Aufgaben.
 */
function countTaskInBoard(tasks) {
  let taskInBoard = document.getElementById("count_tasks");
  let count = tasks.length;
  taskInBoard.innerHTML = `${count}`;
}

/**
 * Zählt die Anzahl der Aufgaben im Status "in progress" und aktualisiert die Anzeige.
 * @param {Array} tasks - Die Liste der Aufgaben.
 */
function countTaskInProgress(tasks) {
  let taskInProgress = document.getElementById("count_progress");
  let count = tasks.filter((task) => task.status === "inprogress").length;
  taskInProgress.innerHTML = `${count}`;
}

/**
 * Zählt die Anzahl der Aufgaben im Status "await feedback" und aktualisiert die Anzeige.
 * @param {Array} tasks - Die Liste der Aufgaben.
 */
function countTaskInFeedback(tasks) {
  let taskInFeedback = document.getElementById("count_feedback");
  let count = tasks.filter((task) => task.status === "awaitfeedback").length;
  taskInFeedback.innerHTML = `${count}`;
}

/**
 * Gibt das nächste Due-Date der Aufgaben aus und formatiert es.
 * @param {Array} tasks - Die Liste der Aufgaben.
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
 * Navigiert zur Board-Seite.
 */
function navigatonToBoard() {
  window.location.href = "../html/board.html";
}

/**
 * Zeigt die mobile Begrüßung an und blendet sie nach 2,5 Sekunden aus.
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
 * Überprüft, ob die mobile Begrüßung angezeigt werden soll und zeigt sie gegebenenfalls an.
 */
function checkAndShowGreeting() {
  const greetingShown = localStorage.getItem("greetingShown");
  if (greetingShown === "false" || !greetingShown) {
    mobileGreeting();
    localStorage.setItem("greetingShown", "true");
  }
}