//for testing reasons my own database
let TEST_URL = `https://remotestorage-6ae7b-default-rtdb.europe-west1.firebasedatabase.app/tasks/`;

async function loadTasks() {
  let response = await fetch(`https://remotestorage-6ae7b-default-rtdb.europe-west1.firebasedatabase.app/tasks/.json`);
  let responseToJson = await response.json();
  let newTaskId;
  if (responseToJson == null) {
    newTaskId = 1;
  } else {
    newTaskId = countId(responseToJson);
  }
  return newTaskId;
}

async function createTask() {
  let title = document.getElementById("title_input").value;
  let description = document.getElementById("description_textarea").value;
  let dueDate = document.getElementById("due_date").value;
  let taskId = await loadTasks();
  let subTasks = [
    { name: "hallo", done: false },
    { name: "Lars1", done: false },
  ];
  let assignedTo = [5, 8];
  putTasksContent(title, description, dueDate, taskId, subTasks, assignedTo);
}

async function tasksArray(path, title = {}) {
  let response = await fetch(path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(title),
  });
  return (responseToJson = await response.json());
}

function putTasksContent(title, description, dueDate, taskId, subTasks, assignedTo){
  tasksArray(`https://remotestorage-6ae7b-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId - 1}/`,
    {
      title: title,
      description: description,
      date: dueDate,
      priority: "TestUrgent",
      category: "TestUserStory1",
      id: taskId,
      subtasks: subTasks,
      assigned: assignedTo,
    }
  );
}

async function getContacts(){
  let response = await fetch(`https://join-b72fb-default-rtdb.europe-west1.firebasedatabase.app/contacts/.json`);
  let responseToJson = await response.json();
  console.log(responseToJson);

}