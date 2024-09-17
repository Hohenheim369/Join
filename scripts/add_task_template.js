function showAssignedContactList(contact){
  return  `<div id="bg_task_${contact.id}" onclick="addContactToTask('contact_to_task_${contact.id}', 'task', 'bg_task_${contact.id}')" class="contact-list padding-7-16 font-s-20 cursor-p d-flex-spbe-center">
            <div class="d-flex-center gap-16">
              <div class="contact-icon d-flex-center bg-147-39-255">
                  <span>${contact.initials}</span>
              </div>
              <span id="task_name_${contact.id}">${contact.name}</span>
            </div>
            <img id="contact_to_task_${contact.id}" src="../assets/img/png/check-task-false.png" alt="">
          </div>`
         
}

function showCategory(){
  return  `<div class="category-list padding-7-16 font-s-20 cursor-p"  onclick="selectCategory('Technical Task')">
            <span>Technical Task</span>
          </div>
          <div class="category-list padding-7-16 font-s-20 cursor-p" onclick="selectCategory('User Story')">
            <span>User Story</span>
          </div>`
}

function addSubtasksToList(subtasksInput, id) {
  return  `<div id="listItem_${id}" class="pos-rel">
            <li ondblclick="editSubtask(this, ${id})">${subtasksInput}</li>
            <div id="list_imgs_activ_${id}" class="d-flex-center gap-4 pos-abs imgs-pos">
              <img class="hover-circle-subtask" onclick="editSubtask(document.querySelector('#listItem_${id} li'), ${id})" src="../assets/img/png/subtasks-edit.png" alt="">
              <div class="dividing-border"></div>
              <img class="hover-circle-subtask" onclick="deleteSubtask(${id})" src="../assets/img/png/subtasks-delete.png" alt="">
            </div>
            <div id="list_imgs_inactiv_${id}" class="d-flex-center gap-4 pos-abs imgs-pos d-none">
              <img class="hover-circle-subtask" onclick="deleteSubtask(${id})" src="../assets/img/png/subtasks-delete.png" alt="">
              <div class="dividing-border"></div>
              <img class="hover-circle-subtask" onclick="saveChangesOnClickOutside(${id})" src="../assets/img/png/subtasks-checkmark.png" alt="">
            </div>
          </div>` 
}

function taskAddedToBoard (){
  document.getElementById('task_added_overlay').classList.remove('d-none')
  return  `<div class="font-s-20 added-overlay d-flex-center gap-10">
            <span>Task added to board</span>
            <img src="../assets/img/png/board-white.png" alt="">
          </div>`
}