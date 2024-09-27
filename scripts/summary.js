document.addEventListener("DOMContentLoaded", () => {
  greeting();
  displayTasks();
  const clickableDivs = document.querySelectorAll(
    ".upper-task-block, .priority-block, .task-in-block"
  );
  clickableDivs.forEach((div) => {
    div.addEventListener("click", () => {
      // Navigiere zur gewünschten Seite (ersetze URL entsprechend)
      window.location.href = "../html/board.html"; // Ersetze 'your-board-page.html' mit der tatsächlichen URL deines Boards
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
  if (activeUser) {
    // In ein JSON-Objekt umwandeln
    const loggedInUser = JSON.parse(activeUser);
    // Initialen abrufen
    return loggedInUser.name;
  }
  return "";
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
    const validTasks = tasks.filter(task => task !== null);
    countToDo(validTasks);
    countDone(validTasks);
    countUrgent(validTasks);
    countTaskInBoard(validTasks);
    countTaskInProgress(validTasks);
    countTaskInFeedback(validTasks);
    deadlineDate(validTasks);
  }
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

function countUrgent(tasks) {
  let urgent = document.getElementById("count_priority_urgent");
  let count = tasks.filter((task) => task.priority === "urgent").length;
  urgent.innerHTML = `${count}`;
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
  const tasksWithDueDate = tasks.filter(task => task.date);

  if (tasksWithDueDate.length === 0) {
    return null; // Kein Fälligkeitsdatum vorhanden
  }

  // Sortiere die Tasks nach ihrem Due-Date
  tasksWithDueDate.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Nächstes Due-Date (das früheste in der Zukunft)
  const nextDueDate = new Date(tasksWithDueDate[0].date);

  // Formatiere das Datum (optional, um es benutzerfreundlicher zu machen)
  const formattedDate = nextDueDate.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Gib das nächste Due-Date im Element mit der ID 'deadline_date' aus
  const deadlineElement = document.getElementById('deadline_date');
  deadlineElement.innerHTML = `${formattedDate}`;
}

function mobileGreeting() {
  const greetingDialog = document.getElementById("greeting_mobile");

  // Öffnet den Dialog
  if (greetingDialog) {
    greetingDialog.classList.remove("d-none")
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

