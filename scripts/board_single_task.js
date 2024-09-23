function bubblingPrevention(event) {
  event.stopPropagation();
}

async function openSingleTask(id) {
  let tasks = await fetchData("tasks");
  let activeTasks = tasks.filter((taskId) => taskId !== null);
  let singleTask = activeTasks.find((task) => task.id === id);
  let categoryColor = singleTask.category.replace(/\s+/g, "").toLowerCase();
  const contacts = await fetchData("contacts");
  console.log(singleTask);

  displaySingleTask(singleTask, categoryColor);
  displaySingleAssinees(singleTask, contacts);
  displaySingleSubtasks(singleTask.subtasks, id);

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

  if (singleTask.user === activeUser.id) {
    assigneeField.innerHTML += `
          <div class="single-task-assignee">
                  <span
                    class="user font-s-12 wh-42 d-flex-center" style="background-color: ${activeUser.color};">${activeUser.initials}</span>
                    ${activeUser.name}
          </div>`;
  }

  let assinees = singleTask.assigned;
  
  if (assinees) {
    const activContacts = contacts.filter((contactId) => contactId !== null);
    const tasksToContects = activContacts.filter((contact) => assinees.includes(contact.id));

    tasksToContects.forEach((contact) => {
      assigneeField.innerHTML += generateSingleAssignee(contact);
    });
  } else {
    assigneeField.innerHTML = `<div class="single-task-subtasks font-s-16">No assignee have been selected yet.</div>`;
  }
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
