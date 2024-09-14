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
  return  `<div class="contact-list padding-7-16 font-s-20 cursor-p"  onclick="selectCategory('Technical Task')">
            <span>Technical Task</span>
          </div>
          <div class="contact-list padding-7-16 font-s-20 cursor-p" onclick="selectCategory('User Story')">
            <span>User Story</span>
          </div>`
}

function addSubtasksToList(){
  return  `<li class="list-order">Contact Form</li>
          <li class="list-order">Write Legal imprint</li>`
}