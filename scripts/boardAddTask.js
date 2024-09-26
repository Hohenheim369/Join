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
  addUserToTask('contact_to_task_0', 'task', 'bg_task_0', `${activeUser.id}`)
  const assineesEdit = singleTask.assigned
  const editAssignContact = contacts.filter((contact) =>
    assineesEdit.includes(contact.id)
  );
  editAssignContact.forEach((contact) => {
    addContactToTask(`contact_to_task_${contact.id}`, 'task', `bg_task_${contact.id}`, `${contact.id}`);
  });
  console.log(singleTask.assigned);
  console.log(editAssignContact);
  selectPrio(singleTask.priority);
  document.getElementById("category").innerText = singleTask.category;
  // subTasks.length = 0;
  // document.getElementById("subtasks_list").innerHTML = "";
}