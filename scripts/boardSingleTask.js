function bubblingPrevention(event) {
  event.stopPropagation();
}

async function openSingleTask(taskId) {
  let tasks = await fetchData("tasks");
  let singleTask = tasks.find((task) => task.id === taskId);
  let categoryColor = singleTask.category.replace(/\s+/g, "").toLowerCase();
  const contacts = await fetchData("contacts");

  displaySingleTask(singleTask, categoryColor);
  displaySingleAssinees(singleTask, contacts);
  displaySingleSubtasks(singleTask.subtasks, taskId);

  taskValuesToEditField(singleTask, contacts, taskId);

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
  let hasAssignees = displayAssigneesAndUsers(
    singleTask,
    contacts,
    assigneeField
  );

  if (!hasAssignees) {
    assigneeField.innerHTML = generateNoAssigneeField();
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

function displayContactAsAssinee(contacts, assinees, assigneeField) {
  const tasksToContects = contacts.filter((contact) =>
    assinees.includes(contact.id)
  );

  tasksToContects.forEach((contact) => {
    assigneeField.innerHTML += generateSingleAssignee(contact);
  });
}

function displaySingleSubtasks(subtasks, taskId) {
  let subtaskField = document.getElementById("single_subtask");
  subtaskField.innerHTML = "";

  if (subtasks) {
    subtasks.forEach((subtask) => {
      subtaskField.innerHTML += generateSingleSubtasks(subtask, taskId);
    });
  } else {
    subtaskField.innerHTML = generateNoSubtaskField();
  }
}

async function updateSubtaskStatus(taskId, subId) {
  toggleCheckButton(`task_${taskId}_subtask_${subId}`, "button");

  const checkButton = document.getElementById(`task_${taskId}_subtask_${subId}`);
  const isChecked = checkButton.src.includes("true");

  let tasks = await fetchData("tasks");
  let task = tasks.find((task) => task.id === taskId);

  task.subtasks[subId - 1].done = isChecked;

  await postUpdatedTask(task);
}

function openDeleteDialog(taskId) {
  toggleOverlay("board_delete_overlay");

  let yesButton = document.getElementById("delete_yes_btn");
  yesButton.innerHTML = generateDeleteButton(taskId);
}

async function deleteTask(taskId) {
  let users = await fetchData("users");

  if (taskId >= 1 && taskId <= 10) {
    await deleteTaskOnlyforUser(taskId, users);
  } else {
    await deleteTaskforAllUsers(taskId, users);
  }
  deleteTaskInLocalStorage(taskId);

  await showSuccessfullyDelete();
  toggleOverlay("board_delete_overlay");
  toggleOverlay("board_task_overlay");
  window.location.reload();
}

async function deleteTaskOnlyforUser(taskId, users) {
  if (activeUser.id === 0) {
    return
  }
  users = users.map((user) => {
    if (user.id === activeUser.id) {
      return {
        ...user,
        tasks: user.tasks.filter((task) => task !== taskId),
      };
    }
    return user;
  });
  await postData("users", users);
}

async function deleteTaskforAllUsers(taskId, users) {
  await deleteData("tasks", taskId);
  if (activeUser.id === 0) {
    return
  }
  users = users.map((user) => ({
    ...user,
    tasks: user.tasks.filter((task) => task !== taskId),
  }));
  await postData("users", users);
}

function deleteTaskInLocalStorage(taskId) {
  let activeUser = JSON.parse(localStorage.getItem("activeUser"));
  activeUser.tasks = activeUser.tasks.filter((task) => task !== taskId);
  localStorage.setItem("activeUser", JSON.stringify(activeUser));
}

function showSuccessfullyDelete() {
  return new Promise((resolve) => {
    const overlay = document.getElementById("successfully_delete_task");
    overlay.classList.remove("d-none");
    overlay.classList.add("active");

    setTimeout(() => {
      overlay.classList.add("visible");
      setTimeout(() => {
        overlay.classList.remove("active", "visible");
        overlay.classList.add("d-none");
        resolve();
      }, 1500);
    }, 50);
  });
}
