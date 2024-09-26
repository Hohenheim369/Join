function bubblingPrevention(event) {
  event.stopPropagation();
}

async function openSingleTask(id) {
  let tasks = await fetchData("tasks");
  let singleTask = tasks.find((task) => task.id === id);
  let categoryColor = singleTask.category.replace(/\s+/g, "").toLowerCase();
  const contacts = await fetchData("contacts");

  displaySingleTask(singleTask, categoryColor);
  displaySingleAssinees(singleTask, contacts);
  displaySingleSubtasks(singleTask.subtasks, id);

  taskValuesToEditField(singleTask, contacts, id);

  toggleOverlay("board_task_overlay");
}

function displaySingleTask(singleTask, categoryColor) {
  let singleTaskArea = document.getElementById(`single_task`);
  singleTaskArea.innerHTML = "";

  singleTaskArea.innerHTML += generateSingleTasks(
    singleTask.id,
    singleTask.title,
    singleTask.description,
    singleTask.category,
    categoryColor,
    singleTask.date,
    singleTask.priority
  );
}

function displaySingleAssinees(singleTask, contacts) {
  let assigneeField = document.getElementById("single_assignee");
  assigneeField.innerHTML = "";
  let hasAssignees = displayAssigneesAndUsers(singleTask, contacts, assigneeField);

  if (!hasAssignees) {
    assigneeField.innerHTML = `<div class="single-task-subtasks font-s-16">No assignee have been selected yet.</div>`;
  }
}

function displayAssigneesAndUsers(singleTask, contacts, assigneeField) {
  let hasAssignees = false;
  if (singleTask.user === activeUser.id) {
    assigneeField.innerHTML += generateSingleUserAsAssignee();
    hasAssignees = true;
  }

  let assinees = singleTask.assigned;
  if (assinees) {
    displayContactAsAssinee(contacts, assinees, assigneeField);
    hasAssignees = true;
  } 
  return hasAssignees;
}

function displayContactAsAssinee(contacts, assinees, assigneeField){
    const tasksToContects = contacts.filter((contact) =>
      assinees.includes(contact.id)
    );

    tasksToContects.forEach((contact) => {
      assigneeField.innerHTML += generateSingleAssignee(contact);
    });
}

function displaySingleSubtasks(subtasks, id) {
  let subtaskField = document.getElementById("single_subtask");
  subtaskField.innerHTML = "";

  if (subtasks) {
    subtasks.forEach((subtask) => {
      subtaskField.innerHTML += generateSingleSubtasks(subtask, id);
    });
  } else {
    subtaskField.innerHTML = `<div class="single-task-subtasks">No subtasks have been created yet.</div>`;
  }
}

async function updateSubtaskStatus(id, subId) {
  toggleCheckButton(`task_${id}_subtask_${subId}`, "button");

  const checkButton = document.getElementById(`task_${id}_subtask_${subId}`);
  const isChecked = checkButton.src.includes("true");

  let tasks = await fetchData("tasks");
  let task = tasks.find((task) => task.id === id);

  task.subtasks[subId - 1].done = isChecked;

  await postUpdatedTask(task);
}

function openDeleteDialog(id) {
  toggleOverlay("board_delete_overlay");

  let yesButton = document.getElementById("delete_yes_btn");
  yesButton.innerHTML = `
      <div class="delete-btn font-s-20 font-c-66-82-110 cursor-p"
           onclick="deleteTask(${id})">YES
      </div>`;
}

async function deleteTask(id) {
  let users = await fetchData("users");

  if (id >= 1 && id <= 10) {
    await deleteTaskOnlyforUser(id, users);
  } else {
    await deleteTaskforAllUsers(id, users);
  }
  deleteTaskInLocalStorage(id);

  toggleOverlay("board_delete_overlay");
  toggleOverlay("board_task_overlay");
  window.location.reload();
}

async function deleteTaskOnlyforUser(id, activeUsers) {
  users = activeUsers.map((user) => {
    if (user.id === activeUser.id) {
      return {
        ...user,
        tasks: user.tasks.filter((taskId) => taskId !== id),
      };
    }
    return user;
  });
  await postData("users", users);
}

async function deleteTaskforAllUsers(id, activeUsers) {
  await deleteData("tasks", id);
  users = activeUsers.map((user) => ({
    ...user,
    tasks: user.tasks.filter((taskId) => taskId !== id),
  }));
  await postData("users", users);
}

function deleteTaskInLocalStorage(id) {
  let activeUser = JSON.parse(localStorage.getItem("activeUser"));
  activeUser.tasks = activeUser.tasks.filter((taskId) => taskId !== id);
  localStorage.setItem("activeUser", JSON.stringify(activeUser));
}

function taskValuesToEditField(singleTask, contacts, id){
  document.getElementById("title_input").value = singleTask.title;
  document.getElementById("description_textarea").value = singleTask.description;
  document.getElementById("due_date").value = singleTask.date;
  // const existingUserIndex = userId.map(Number);
  // removeUserAssigned(existingUserIndex);
  // selectedContacts.length = 0;
  // updateSelectedContactsDisplay();
  // getContacts();
  // selectPrio("medium");
  document.getElementById("category").innerText = singleTask.category;
  // subTasks.length = 0;
  // document.getElementById("subtasks_list").innerHTML = "";
}
