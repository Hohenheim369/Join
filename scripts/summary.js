document.addEventListener("DOMContentLoaded", () => {
  greeting();
  displayTasks();
  const clickableDivs = document.querySelectorAll(
    ".upper-task-block, .priority-block, .task-in-block"
  );
  clickableDivs.forEach((div) => {
    div.addEventListener("click", () => {
      window.location.href = "../html/board.html";
    });
  });
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
  greeting.innerHTML = `${greetingMassage}, <div class="greeting-user">${greetingUser}</div> `;
  greetingMobile.innerHTML = "";
  greetingMobile.innerHTML = `${greetingMassage}, <div class="greeting-user">${greetingUser}</div> `;
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

async function displayTasks() {
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
    // Verwende Promise.all, um alle Tasks basierend auf den taskIds zu laden
    const tasks = await Promise.all(
      taskIds.map(async (taskId) => {
        // Lade alle Tasks von Firebase
        const allTasks = await fetchData("tasks");
        // Finde den Task, der mit der taskId übereinstimmt
        return allTasks.find((t) => t.id === taskId) || null;
      })
    );
    // Filtere null-Werte heraus, falls keine passenden Tasks gefunden wurden
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

function mobileGreeting() {
  const greetingDialog = document.getElementById("greeting_mobile");

  // Öffnet den Dialog
  if (greetingDialog) {
    greetingDialog.classList.remove("d-none");
    // Schließt den Dialog nach 5 Sekunden
    setTimeout(() => {
      greetingDialog.classList.add("d-none");
      greetingDialog.close();
    }, 3000); // 5000 Millisekunden = 5 Sekunden
  }
}

function checkAndShowGreeting() {
  const greetingShown = localStorage.getItem("greetingShown");

  // Wenn das Greeting noch nicht gezeigt wurde, zeige es an
  if (greetingShown === "false" || !greetingShown) {
    mobileGreeting();
    // Setze den Zustand, dass das Greeting nun gezeigt wurde
    localStorage.setItem("greetingShown", "true");
  }
}
