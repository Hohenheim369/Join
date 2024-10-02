/** wenn der DOM geladen wird wird die begrüßung geladen */
document.addEventListener("DOMContentLoaded", () => {
  greeting();
  renderTasks();
  if (window.innerWidth <= 770) {
    checkAndShowGreeting();
  }
});

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

function getNameFromLocalStorage() {
  let activeUser = localStorage.getItem("activeUser");
  const loggedInUser = JSON.parse(activeUser);
  return loggedInUser.name;
}

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

function greetingHtml(greetingMassage, greetingUser){
   return `${greetingMassage}, <div class="greeting-user">${greetingUser}</div> `
}

async function renderTasks() {
  const tasks = await loadTasks();
  countToDo(tasks);
  countDone(tasks);
  countTasksWithDueDate(tasks);
  countTaskInBoard(tasks);
  countTaskInProgress(tasks);
  countTaskInFeedback(tasks);
  deadlineDate(tasks);
}

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

function countToDo(tasks) {
  let toDo = document.getElementById("count_to_do");
  let count = tasks.filter((task) => task.status === "todo").length;
  toDo.innerHTML = `${count}`;
}

function countDone(tasks) {
  let done = document.getElementById("count_done");
  let count = tasks.filter((task) => task.status === "done").length;
  done.innerHTML = `${count}`;
}

function countTasksWithDueDate(tasks) {
  // Filtere Tasks, die ein Due-Date haben
  const tasksWithDueDate = tasks.filter((task) => task.date);
  // Sortiere die Tasks nach ihrem Due-Date
  tasksWithDueDate.sort((a, b) => new Date(a.date) - new Date(b.date));
  // Nächstes Due-Date (das früheste in der Zukunft)
  const nextDueDate = tasksWithDueDate[0].date;
  // Zähle die Anzahl der Tasks, die das gleiche Due-Date haben
  const tasksWithSameDueDate = tasks.filter(
    (task) => task.date === nextDueDate
  );
  // Gib die Anzahl im Element mit der ID 'count_priority_urgent' aus
  const taskCountElement = document.getElementById("count_priority_urgent");
  taskCountElement.innerHTML = `${tasksWithSameDueDate.length}`;
}

function countTaskInBoard(tasks) {
  let taskInBoard = document.getElementById("count_tasks");
  let count = tasks.length;
  taskInBoard.innerHTML = `${count}`;
}

function countTaskInProgress(tasks) {
  let taskInProgress = document.getElementById("count_progress");
  let count = tasks.filter((task) => task.status === "inprogress").length;
  taskInProgress.innerHTML = `${count}`;
}

function countTaskInFeedback(tasks) {
  let taskInFeedback = document.getElementById("count_feedback");
  let count = tasks.filter((task) => task.status === "awaitfeedback").length;
  taskInFeedback.innerHTML = `${count}`;
}

function deadlineDate(tasks) {
  // Filtere Tasks, die ein Due-Date haben
  const tasksWithDueDate = tasks.filter((task) => task.date);
  // Sortiere die Tasks nach ihrem Due-Date
  tasksWithDueDate.sort((a, b) => new Date(a.date) - new Date(b.date));
  // Nächstes Due-Date (das früheste in der Zukunft)
  const nextDueDate = tasksWithDueDate[0].date;
  // Manuelle Formatierung: "Month Day, Year"
  const [year, month, day] = nextDueDate.split("-");
  const dateObj = new Date(year, month - 1, day); // Monat muss um 1 reduziert werden, da er bei 0 beginnt
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  // Gib das nächste Due-Date im Element mit der ID 'deadline_date' aus
  const deadlineElement = document.getElementById("deadline_date");
  deadlineElement.innerHTML = `${formattedDate}`;
}

function navigatonToBoard(){
  window.location.href = "../html/board.html";
}

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

function checkAndShowGreeting() {
  const greetingShown = localStorage.getItem("greetingShown");
  if (greetingShown === "false" || !greetingShown) {
    mobileGreeting();
    localStorage.setItem("greetingShown", "true");
  }
}
