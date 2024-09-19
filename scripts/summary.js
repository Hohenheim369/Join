document.addEventListener("DOMContentLoaded", () => {
  greeting();
  displayTasks();
});

function greeting() {
    let greeting = document.getElementById("greetings");
    let greetingUser = getNameFromLocalStorage();
    let greetingMassage = getGreetingMessage();
    greeting.innerHTML = "";
    greeting.innerHTML = `${greetingMassage}, <div class="greeting-user">${greetingUser}</div> `;
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
    tasks = await fetchData('tasks'); 
    countToDo(tasks);
    countDone(tasks);
    countUrgent(tasks);
    countTaskInBoard(tasks);
    countTaskInProgress(tasks);
    countTaskInFeedback(tasks);
}

function countToDo(tasks) {
    let toDo = document.getElementById('count_to_do');
    let count = tasks.filter(task => task.status === "todo").length;
    toDo.innerHTML = `${count}`;
}

function countDone(tasks) {
    let done = document.getElementById('count_done');
    let count = tasks.filter(task => task.status === "done").length;
    done.innerHTML = `${count}`;
}

function countUrgent(tasks) {
    let urgent = document.getElementById('count_priority_urgent');
    let count = tasks.filter(task => task.priority === "urgent").length;
    urgent.innerHTML = `${count}`;
}

function countTaskInBoard(tasks) {
    let taskInBoard = document.getElementById('count_tasks');
    let count = tasks.length;
    taskInBoard.innerHTML = `${count}`;
}

function countTaskInProgress(tasks) {
    let taskInProgress = document.getElementById('count_progress');
    let count = tasks.filter(task => task.status === "inprogress").length;
    taskInProgress.innerHTML = `${count}`;
}

function countTaskInFeedback(tasks) {
    let taskInFeedback = document.getElementById('count_feedback');
    let count = tasks.filter(task => task.status === "feedback").length;
    taskInFeedback.innerHTML = `${count}`;
}