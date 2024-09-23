function bubblingPrevention(event) {
  event.stopPropagation();
}

async function openSingleTask(id) {
  toggleOverlay();
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
    singleTask.priority,
  );
}

function toggleOverlay() {
  let refOverlay = document.getElementById("board-task-overlay");
  refOverlay.classList.toggle("d-none");

  if (!refOverlay.classList.contains("d-none")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}
