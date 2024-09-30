function openAddTask(status) {
  //hier könnten wir die toggleOverlay mit einfügen...
  let overlay = document.getElementById("board_addtask_overlay");
  overlay.classList.remove("d-none");

  taskStatus = status;
}

function openEditDialog(taskId) {
  let editTaskButton = document.getElementById("create_button_div");
  document.getElementById("edit_task_overlay").classList.remove("d-none");
  document.getElementById("create_button").classList.add("d-none");
  document.getElementById("clear_button").classList.add("d-none");
  document.getElementById("dividing_bar").classList.add("d-none");
  document.getElementById("add_task_h1").classList.add("d-none");
  document.getElementById("content_order").classList.remove("content-order");
  document.getElementById("edit_overflow").classList.add("overflow");
  document.getElementById("edit_task_board").classList.add("edit-task-height");

  editTaskButton.innerHTML = editTaskTemplate(taskId);
}

async function taskValuesToEditField(taskId) {
  let tasks = await fetchData("tasks");
  let singleTask = tasks.find((task) => task.id === taskId);
  const contacts = await fetchData("contacts");
  setTaskBasicValues(singleTask);
  setTaskUser(singleTask);
  setTaskContacts(singleTask, contacts);
  setTaskPriority(singleTask);
  setTaskCategory(singleTask);
  setTaskSubtasks(singleTask);
}

function setTaskBasicValues(singleTask) {
  document.getElementById("title_input").value = singleTask.title;
  document.getElementById("description_textarea").value =
    singleTask.description;
  document.getElementById("due_date").value = singleTask.date;
}

function setTaskUser(singleTask) {
  if (singleTask.user === activeUser.id) {
    addUserToTask("contact_to_task_0", "task", "bg_task_0", `${activeUser.id}`);
  }
}

function setTaskContacts(singleTask, contacts) {
  if (!singleTask.assigned) {
    return;
  }
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
  document.getElementById("edit_category").classList.add("d-none");
  document.getElementById("edit_category").classList.remove("form-child-order");
}

function setTaskSubtasks(singleTask) {
  const subtaskEdit = singleTask.subtasks;
  let subTaskField = document.getElementById("subtasks_list");
  subTaskField.innerHTML = "";
  if (subtaskEdit) {
    subtaskEdit.forEach((subtask) => {
      subTasks.push(subtask.subTaskName);
      let ids = subTasks.length;
      subTaskField.innerHTML += addSubtasksToList(subtask.subTaskName, ids - 1);
    });
  }
}

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
    (category === "Technical Task" || category === "User Story" || category === "Tutorial")
  );
}

function handleValidForm(taskId) {
  resetrequiredFields();
  editTask(taskId);
}

function handleInvalidForm() {
  requiredFields();
}

async function editTask(taskId) {
  const taskData = getTaskFormData();
  const tasks = await fetchData("tasks");
  const singleTask = tasks.find((task) => task.id === taskId);
  const userTaskId = userTest();
  const currenttaskStatus = singleTask.status;
  await updateTaskContent(taskData, taskId, userTaskId, currenttaskStatus);
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

async function updateTaskContent(taskData, taskId, userTaskId, currenttaskStatus) {
  await putEditTasksContent(
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
  subTasks = []; //zugefügt OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
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

function userTest() {
  if (userId[0]) {
    let userTaskId = Number(userId[0]);
    return userTaskId;
  } else {
    let userTaskId = "";
    return userTaskId;
  }
}

async function putEditTasksContent(
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
    subtasks: await getEditSubtasks(taskId),
    assigned: assignedTo,
    status: currenttaskStatus,
    user: userTaskId,
  });
}

async function getEditSubtasks(taskId) {
  let tasks = await fetchData("tasks");
  let editSingleTask = tasks.find((task) => task.id === taskId);
  let filteredSubtasks = editSingleTask.subtasks?.filter(data => data !== null) || [];
  if (subTasks.length === 0) return [];
  return subTasks.map((subName, index) => 
    createSubtaskObject(subName, index, filteredSubtasks)
  );
}

function createSubtaskObject(subName, index, filteredSubtasks) {
  let foundSubtask = filteredSubtasks.find(
    (filteredTask) => filteredTask.subTaskName === subName
  );
  return {
    subTaskName: subName,
    subId: index + 1,
    done: foundSubtask ? foundSubtask.done : false
  };
}

async function closeAddTaskDialogFeedback() {
  const slidingDiv = document.getElementById("task_added_overlay");
  slidingDiv.classList.toggle("visible");
}
