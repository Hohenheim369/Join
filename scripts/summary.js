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
    mobileGreeting();
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

    // Hole die spezifischen Tasks aus Firebase basierend auf den IDs im Local Storage
    const tasks = await Promise.all(
      taskIds.map(async (taskId) => await fetchData(`tasks/${taskId}`))
    );
    countToDo(tasks);
    countDone(tasks);
    countUrgent(tasks);
    countTaskInBoard(tasks);
    countTaskInProgress(tasks);
    countTaskInFeedback(tasks);
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
  let count = tasks.filter((task) => task.status === "feedback").length;
  taskInFeedback.innerHTML = `${count}`;
}

function mobileGreeting() {
  const greetingDialog = document.getElementById("greeting_mobile");

  // Öffnet den Dialog
  if (greetingDialog) {
    greetingDialog.showModal();

    // Schließt den Dialog nach 5 Sekunden
    setTimeout(() => {
      greetingDialog.classList.add("d-none");
      greetingDialog.close();
    }, 3000); // 5000 Millisekunden = 5 Sekunden
  }
}
