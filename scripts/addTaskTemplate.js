/**
 * This function generates html to show the assigned user
 * 
 * @param {Object} activeUser - data of the active user
 * @returns - the html elements with variable data
 */
function showAssignedUser(activeUser){
   return  `<div id="bg_task_0" onclick="addUserToTask('contact_to_task_0', 'task', 'bg_task_0', '${activeUser.id}')" class="contact-list padding-7-16 font-s-20 cursor-p d-flex-spbe-center">
            <div class="d-flex-center gap-16">
              <div class="user-icon d-flex-center" style="background-color: ${activeUser.color};">
                  <span>${activeUser.initials}</span>
              </div>
              <span id="task_name_${activeUser.id}">${activeUser.name}</span>
              <span>(You)</span>
            </div>
            <img id="contact_to_task_0" src="../assets/img/png/check-task-false.png" alt="Empty checkbox">
          </div>`
}

/**
 * This function generates html to show the assigned contacts
 * 
 * @param {Object} contact - data of all contacts
 * @returns - the html elements with variable data
 */
function showAssignedContactList(contact){
  return  `<div id="bg_task_${contact.id}" onclick="addContactToTask('contact_to_task_${contact.id}', 'task', 'bg_task_${contact.id}', '${contact.id}')" class="contact-list padding-7-16 font-s-20 cursor-p d-flex-spbe-center">
            <div class="d-flex-center gap-16">
              <div class="contact-icon d-flex-center" style="background-color: ${contact.color};">
                  <span>${contact.initials}</span>
              </div>
              <span id="task_name_${contact.id}">${contact.name}</span>
            </div>
            <img id="contact_to_task_${contact.id}" src="../assets/img/png/check-task-false.png" alt="Empty checkbox">
          </div>`
}

/**
 * This function generates html if the user is assigned
 * 
 * @param {string} userInitials - is the initials of the user
 * @param {number} activUserID - Id of the user
 * @param {string} userColor - is the user background color
 * @returns - the html elements with variable data
 */
function assignedUser(userInitials, activUserID, userColor){
  return  `<div id="assigned_${activUserID}" class="user-icon d-flex-center"  style="background-color: ${userColor};">
                <span>${userInitials}</span>
          </div>`
}

/**
 * This function generates html if contacts are assigned
 * 
 * 
 * @param {Object} activeContacts - is the data of all contacts in the users list
 * @returns - the html elements with variable data
 */
function assignedContacts(activeContacts){
  return  `<div id="assigned_${activeContacts.id}" class="contact-icon d-flex-center"  style="background-color: ${activeContacts.color};">
                <span>${activeContacts.initials}</span>
          </div>`
}

/**
 * This function generates html and shows the category list 
 * 
 * @returns - the html elements with variable data
 */
function showCategory(){
  return  `<div class="category-list padding-7-16 font-s-20 cursor-p"  onclick="selectCategory('Technical Task')">
            <span>Technical Task</span>
          </div>
          <div class="category-list padding-7-16 font-s-20 cursor-p" onclick="selectCategory('User Story')">
            <span>User Story</span>
          </div>`
}

/**
 * This function generates html and displays all subtasks created by the user
 * 
 * @param {string} subtasksInput - is the input text for a subtasks
 * @param {number} id - Id of each subtasks created
 * @returns - the html elements with variable data
 */
function addSubtasksToList(subtasksInput, id) {
  return  `<div id="listItem_${id}" class="list-item pos-rel li-hover">
            <li id="list_subtask_${id}" ondblclick="editSubtask(this, ${id})">${subtasksInput}</li>
            <div id="list_imgs_activ_${id}" class="d-flex-center gap-4 pos-abs imgs-pos-activ list-imgs-activ">
              <img class="hover-circle-subtask-active" onclick="editSubtask(document.querySelector('#listItem_${id} li'), ${id})" src="../assets/img/png/subtasks-edit.png" alt="Edit pencil">
              <div class="dividing-border"></div>
              <img class="hover-circle-subtask-active" onclick="deleteSubtask(${id})" src="../assets/img/png/subtasks-delete.png" alt="Delet cross">
            </div>
          </div>
          <div id="listItem_input_${id}" class="pos-rel li-hover">
            <input id="input_subtask_${id}" onkeydown="return checkEnterKey(event, ${id})" type="text" class="subtasks-input font-s-16 d-none">
            <div id="list_imgs_inactiv_${id}" class="d-flex-center gap-4 pos-abs imgs-pos d-none">
              <img class="hover-circle-subtask" onclick="deleteSubtask(${id})" src="../assets/img/png/subtasks-delete.png" alt="Delet cross">
              <div class="dividing-border"></div>
              <img class="hover-circle-subtask" onclick="saveInput(${id})" src="../assets/img/png/subtasks-checkmark.png" alt="Checkmark">
            </div>
          </div>` 
}

/**
 * This function generates html and diyplays the task added feedback
 * 
 * @returns - the html elements 
 */
function taskAddedToBoard (){
  document.getElementById('task_added_overlay').classList.remove('d-none')
  return  `<div class="font-s-20 added-overlay d-flex-center gap-10">
            <span>Task added to board</span>
            <img src="../assets/img/png/board-white.png" alt="Board symbol">
          </div>`
}

/**
 * This function generates html and shows the edit design
 * 
 * @param {*} taskId - Id of the task
 * @returns - the html elements with variable data
 */
function editTaskTemplate(taskId){
  return  `<div class="bottom-edit-order">
            <span class="alert-field">
              <span class="required-sign">*</span>
            This field is required</span>
            <button onclick="enableEditButton(${taskId})" id="create_button" class="create-task-button">
              <span>Ok</span>
              <img src="../assets/img/png/create-check-mark.png" alt="Checkmark" />
            </button>
          </div>`
}