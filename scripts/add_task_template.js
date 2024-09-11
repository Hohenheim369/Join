function showAssignedContact(eachContact){
  return  `<div id="bg_task_${eachContact.id}" onclick="addContactToTask('contact_to_task_${eachContact.id}', 'task', 'bg_task_${eachContact.id}')" class="contact-list padding-7-16 font-s-20 cursor-p d-flex-spbe-center">
            <div class="d-flex-center gap-16">
              <div class="contact-icon d-flex-center bg-147-39-255">
                  <span>${eachContact.initials}</span>
              </div>
              <span>${eachContact.name}</span>
            </div>
            <img id="contact_to_task_${eachContact.id}" src="../assets/img/png/check-task-false.png" alt="">
          </div>`
         
}

function showCategory(){
  return  `<div class="contact-list padding-7-16 font-s-20 cursor-p">
            <span>Technical Task</span>
          </div>
          <div class="contact-list padding-7-16 font-s-20 cursor-p">
            <span>User Story</span>
          </div>`
}