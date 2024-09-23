function bubblingPrevention(event) {
  event.stopPropagation();
}

async function openSingleTask(id) {
  let tasks = await fetchData("tasks");
  let singleTask = tasks.find((task) => task.id === id);
  let categoryColor = singleTask.category.replace(/\s+/g, "").toLowerCase();
  const contacts = await fetchData("contacts");

  displaySingleTask(singleTask, categoryColor);
  // displaySingleAssinees(singleTask.assinees);
  displaySingleSubtasks(singleTask.subtasks, id);

  toggleOverlay("board_task_overlay");
}

function displaySingleTask(singleTask, categoryColor){
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

// function displaySingleAssinees(assinees){
//   let assigneeField = document.getElementById("single_assignee");
//   assigneeField.innerHTML = "";

//   if (assinees) {
//     assinees.forEach((assinee) => {
//       assigneeField.innerHTML += generateSingleAssignee(assinee);
//     });
//   } else {
//     assigneeField.innerHTML = `<div class="single-task-subtasks">No assignee have been selected yet</div>`;
//   }
// }

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
