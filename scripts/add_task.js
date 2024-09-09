let tasksindex = 3;
let tasks = {};
//for testing reasons my own database

let TEST_URL = `https://remotestorage-6ae7b-default-rtdb.europe-west1.firebasedatabase.app/tasks/${tasksindex}/`;

async function loadTasks() {
  console.log("test");
  let response = await fetch(`https://remotestorage-6ae7b-default-rtdb.europe-west1.firebasedatabase.app/tasks/.json`);
  let responseToJson = await response.json();
  console.log(responseToJson);

  let JsonLength = Object.keys(responseToJson).length;
  console.log(JsonLength);

  let keys = Object.keys(responseToJson);
  let lastKey = keys[keys.length - 1];
  let newTaskId = responseToJson[lastKey].id;
  console.log(newTaskId);
  newTaskId++;
  return newTaskId;
}

async function createTask() {
  tasksindex++;
  // let assignedindex = 1;
  // let subtasksindex = 1;
  let title = document.getElementById("title_input").value;
  let description = document.getElementById("description_textarea").value;
  let dueDate = document.getElementById("due_date").value;
  let taskId = await loadTasks();
  postTitle(
    `https://remotestorage-6ae7b-default-rtdb.europe-west1.firebasedatabase.app/tasks/${tasksindex}/`,
    {
      title: title,
      description: description,
      date: dueDate,
      priority: "TestUrgent",
      category: "TestUserStory1",
      id: taskId,
    }
  );
  // postAssignedTO(
  //   `https://remotestorage-6ae7b-default-rtdb.europe-west1.firebasedatabase.app/tasks/${tasksindex}/assigned/${assignedindex}/`,
  //   { name: "Testassigned1Name" }
  // );  
  // assignedindex++;
  // postSubtasks(
  //   `https://remotestorage-6ae7b-default-rtdb.europe-west1.firebasedatabase.app/tasks/${tasksindex}/subtasks/${subtasksindex}/`,
  //   { Title: "TestSubTitle1" }
  // );
  // subtasksindex++;
}

async function postTitle(path, title = {}) {
  let response = await fetch(path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(title),
  });
  return (responseToJson = await response.json());
}

// async function postAssignedTO(path, data = {}) {
//   let response = await fetch(path + ".json", {
//     method: "PUT",
//     header: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
//   return (responseToJson = await response.json());
// }

// async function postSubtasks(path, data1 = {}) {
//   let response = await fetch(path + ".json", {
//     method: "PUT",
//     header: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data1),
//   });
//   return (responseToJson = await response.json());
// }