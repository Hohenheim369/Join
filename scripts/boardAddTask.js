function openAddTask(status) {
  let overlay = document.getElementById("board_addtask_overlay");
  overlay.classList.remove("d-none");
  taskStatus = status;
}

function openEditDialog(taskId) {
  let overlay = document.getElementById("edit_task_overlay");
  let editTaskButton = document.getElementById("create_button_div");
  let createTaskButton = document.getElementById("create_button");
  let clearButton = document.getElementById("clear_button");
  createTaskButton.classList.add("d-none");
  clearButton.classList.add("d-none");
  overlay.classList.remove("d-none");
  editTaskButton.innerHTML = editTaskTemplate(taskId);
}

// function taskValuesToEditField(singleTask, contacts) {
//   document.getElementById("title_input").value = singleTask.title;
//   document.getElementById("description_textarea").value =
//     singleTask.description;
//   document.getElementById("due_date").value = singleTask.date;
//   if (singleTask.user === activeUser.id) {
//     addUserToTask("contact_to_task_0", "task", "bg_task_0", `${activeUser.id}`);
//   }
//   let userContacts = singleTask.assigned.filter((data) => data !== null);
//   let contactsToRender = contacts.filter((contact) =>
//     userContacts.includes(contact.id)
//   );
//   window.allContacts = contactsToRender;
//   contactsToRender.forEach((contact) => {
//     addContactToTask(
//       `contact_to_task_${contact.id}`,
//       "task",
//       `bg_task_${contact.id}`,
//       `${contact.id}`
//     );
//   });
//   selectPrio(singleTask.priority);
//   document.getElementById("category").innerText = singleTask.category;
//   document.getElementById("edit_category").classList.add("d-none");
//   document.getElementById("edit_category").classList.remove("form-child-order");
//   const subtaskEdit = singleTask.subtasks;
//   if (subtaskEdit) {
//     subtaskEdit.forEach((subtask) => {
//       subTasks.push(subtask.subTaskName);
//       let ids = subTasks.length;
//       document.getElementById("subtasks_list").innerHTML += addSubtasksToList(
//         subtask.subTaskName,
//         ids - 1
//       );
//     });
//   }
// }

function taskValuesToEditField(singleTask, contacts) {
  setTaskBasicValues(singleTask);
  setTaskUser(singleTask);
  setTaskContacts(singleTask, contacts);
  setTaskPriority(singleTask);
  setTaskCategory(singleTask);
  setTaskSubtasks(singleTask);
}

function setTaskBasicValues(singleTask) {
  document.getElementById("title_input").value = singleTask.title;
  document.getElementById("description_textarea").value = singleTask.description;
  document.getElementById("due_date").value = singleTask.date;
}

function setTaskUser(singleTask) {
  if (singleTask.user === activeUser.id) {
    addUserToTask("contact_to_task_0", "task", "bg_task_0", `${activeUser.id}`);
  }
}

function setTaskContacts(singleTask, contacts) {
  let userContacts = singleTask.assigned.filter((data) => data !== null);
  let contactsToRender = contacts.filter((contact) =>
    userContacts.includes(contact.id)
  );
  window.allContacts = contactsToRender;
  contactsToRender.forEach((contact) => {
    addContactToTask(
      `contact_to_task_${contact.id}`,
      "task",
      `bg_task_${contact.id}`,
      `${contact.id}`
    );
  });
}

function setTaskPriority(singleTask) {
  selectPrio(singleTask.priority);
}

function setTaskCategory(singleTask) {
  document.getElementById("category").innerText = singleTask.category;
  document
    .getElementById("edit_category")
    .classList.add("d-none");
  document
    .getElementById("edit_category")
    .classList.remove("form-child-order");
}

function setTaskSubtasks(singleTask) {
  const subtaskEdit = singleTask.subtasks;
  if (subtaskEdit) {
    subtaskEdit.forEach((subtask) => {
      subTasks.push(subtask.subTaskName);
      let ids = subTasks.length;
      document.getElementById("subtasks_list").innerHTML += addSubtasksToList(
        subtask.subTaskName,
        ids - 1
      );
    });
  }
}


// function enableEditButton(taskId) {
//   let input = document.getElementById("title_input");
//   let date = document.getElementById("due_date");
//   let category = document.getElementById("category").innerText;
//   let createButton = document.getElementById("create_button");
//   if (
//     input.value.trim() !== "" &&
//     date.value.trim() !== "" &&
//     (category === "Technical Task" || category === "User Story")
//   ) {
//     createButton.disabled = false;
//     resetrequiredFields();
//     editTask(taskId);
//   } else {
//     createButton.disabled = true;
//     requiredFields();
//     createButton.disabled = false;
//   }
// }

function enableEditButton(taskId) {
  const input = getInputFields();
  const category = getCategory();
  if (isFormValid(input, category)) {
    handleValidForm(taskId);
  } else {
    handleInvalidForm();
  }
}

function getInputFields() {
  return {
    input: document.getElementById("title_input").value.trim(),
    date: document.getElementById("due_date").value.trim(),
  };
}

function getCategory() {
  return document.getElementById("category").innerText;
}

function isFormValid(input, category) {
  return (
    input.input !== "" &&
    input.date !== "" &&
    (category === "Technical Task" || category === "User Story")
  );
}

function handleValidForm(taskId) {
  resetrequiredFields();
  editTask(taskId);
}

function handleInvalidForm() {
  requiredFields();
}


// async function editTask(taskId) {
//   let title = document.getElementById("title_input").value;
//   let description = document.getElementById("description_textarea").value;
//   let dueDate = document.getElementById("due_date").value;
//   let categorySeleced = document.getElementById("category").innerText;
//   let assignedTo = selectedContacts.map(Number);
//   let tasks = await fetchData("tasks");
//   let singleTask = tasks.find((task) => task.id === taskId);
//   let currenttaskStatus = singleTask.status;
//   let userTaskId = usertest(singleTask);
//   putEditTasksContent(
//     title,
//     description,
//     dueDate,
//     taskId,
//     assignedTo,
//     categorySeleced,
//     userTaskId,
//     currenttaskStatus
//   );
//   // putTaskToUser(taskId);
//   openAddTaskDialogFeedback();
//   await sleep(1500);
//   toggleOverlay("edit_task_overlay");
//   toggleOverlay("board_task_overlay");
//   closeAddTaskDialogFeedback();
//   openSingleTask(taskId);
// }

async function editTask(taskId) {
  const taskData = getTaskFormData();
  const tasks = await fetchData("tasks");
  const singleTask = tasks.find((task) => task.id === taskId);
  const userTaskId = usertest(singleTask);
  const currenttaskStatus = singleTask.status;
  updateTaskContent(taskData, taskId, userTaskId, currenttaskStatus);
  await handleTaskEditCompletion(taskId);
}

function getTaskFormData() {
  const title = document.getElementById("title_input").value;
  const description = document.getElementById("description_textarea").value;
  const dueDate = document.getElementById("due_date").value;
  const categorySeleced = document.getElementById("category").innerText;
  const assignedTo = selectedContacts.map(Number);
  return { title, description, dueDate, categorySeleced, assignedTo };
}

function updateTaskContent(taskData, taskId, userTaskId, currenttaskStatus) {
  putEditTasksContent(
    taskData.title,
    taskData.description,
    taskData.dueDate,
    taskId,
    taskData.assignedTo,
    taskData.categorySeleced,
    userTaskId,
    currenttaskStatus
  );
}

async function handleTaskEditCompletion(taskId) {
  openAddTaskDialogFeedback();
  await sleep(1500);
  toggleTaskOverlays();
  closeAddTaskDialogFeedback();
  openSingleTask(taskId);
}

function toggleTaskOverlays() {
  toggleOverlay("edit_task_overlay");
  toggleOverlay("board_task_overlay");
}


function usertest(singleTask) {
  if (singleTask.user) {
    let userTaskId = singleTask.user;
    return userTaskId;
  } else {
    let userTaskId = "";
    return userTaskId;
  }
}

function putEditTasksContent(
  title,
  description,
  dueDate,
  taskId,
  assignedTo,
  categorySeleced,
  userTaskId,
  currenttaskStatus
) {
  postData(`tasks/${taskId - 1}/`, {
    title: title,
    description: description,
    date: dueDate,
    priority: selectedPrio,
    category: categorySeleced,
    id: taskId,
    subtasks: getSubtasks(),
    assigned: assignedTo,
    status: currenttaskStatus,
    user: userTaskId,
  });
}

async function closeAddTaskDialogFeedback() {
  const slidingDiv = document.getElementById("task_added_overlay");
  slidingDiv.classList.toggle("visible");
}
