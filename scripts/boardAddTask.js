function openAddTask(status) {
  let overlay = document.getElementById("board_addtask_overlay");
  overlay.classList.remove("d-none");  
  taskStatus = status
}

function openEditDialog(taskId){
  console.log(taskId);
  let overlay = document.getElementById("edit_task_overlay");
  overlay.classList.remove("d-none");  
  
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