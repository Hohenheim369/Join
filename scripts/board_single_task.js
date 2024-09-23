function bubblingPrevention(event) {
  event.stopPropagation();
}

async function openSingleTask(id) {
  toggleOverlay('board_task_overlay');
  let tasks = await fetchData("tasks");
  let singleTask = tasks.find((task) => task.id === id);
  let categoryColor = singleTask.category.replace(/\s+/g, "").toLowerCase();
  const contacts = await fetchData("contacts");

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

