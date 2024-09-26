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