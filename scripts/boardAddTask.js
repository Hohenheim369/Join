function openAddTask(status) {
  let overlay = document.getElementById("board_addtask_overlay");
  overlay.classList.remove("d-none");
  taskStatus = status;
}

function openEditDialog(taskId) {
  let overlay = document.getElementById("edit_task_overlay");
  let editTaskButton = document.getElementById('create_button_div');
  let createTaskButton = document.getElementById('create_button');
  let clearButton = document.getElementById('clear_button');
  createTaskButton.classList.add('d-none')
  clearButton.classList.add('d-none')
  overlay.classList.remove("d-none");
  editTaskButton.innerHTML = editTaskTemplate(taskId)
}

function taskValuesToEditField(singleTask, contacts, id) {
  document.getElementById("title_input").value = singleTask.title;
  document.getElementById("description_textarea").value =
    singleTask.description;
  document.getElementById("due_date").value = singleTask.date;
  addUserToTask("contact_to_task_0", "task", "bg_task_0", `${activeUser.id}`);
  const assineesEdit = singleTask.assigned;
  const editAssignContact = contacts.filter((contact) =>
    assineesEdit.includes(contact.id)
  );
  editAssignContact.forEach((contact) => {
    addContactToTask(
      `contact_to_task_${contact.id}`,
      "task",
      `bg_task_${contact.id}`,
      `${contact.id}`
    );
  });
  selectPrio(singleTask.priority);
  document.getElementById("category").innerText = singleTask.category;
  document.getElementById("edit_category").classList.add("d-none");
  document.getElementById("edit_category").classList.remove("form-child-order");
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

function enableEditButton(taskId) {
  let input = document.getElementById("title_input");
  let date = document.getElementById("due_date");
  let category = document.getElementById("category").innerText;
  let createButton = document.getElementById("create_button");
  if (
    input.value.trim() !== "" &&
    date.value.trim() !== "" &&
    (category === "Technical Task" || category === "User Story")
  ) {
    createButton.disabled = false;
    resetrequiredFields();
    editTask(taskId);
  } else {
    createButton.disabled = true;
    requiredFields();
    createButton.disabled = false;
  }
}

async function editTask(taskId) {
  let title = document.getElementById("title_input").value;
  let description = document.getElementById("description_textarea").value;
  let dueDate = document.getElementById("due_date").value;
  let categorySeleced = document.getElementById("category").innerText;
  taskId = await getNewId("tasks");
  let assignedTo = selectedContacts.map(Number);
  putEditTasksContent(
    title,
    description,
    dueDate,
    taskId,
    assignedTo,
    categorySeleced
  );
  putTaskToUser(taskId);
  openAddTaskDialog();
  await sleep(1500);
  window.location.href = "../html/board.html";
}

function putEditTasksContent(
  title,
  description,
  dueDate,
  taskId,
  assignedTo,
  categorySeleced
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
    status: taskStatus,
    user: Number(userId[0]),
  });
}


