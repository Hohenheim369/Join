/**
 * Generates a task representation for the board.
 *
 * @param {number} id - The unique identifier of the task.
 * @param {string} title - The title of the task.
 * @param {string} shortDescription - A brief description of the task.
 * @param {string} category - The category to which the task belongs.
 * @param {string} categoryColor - The color associated with the task's category.
 * @param {string} prio - The priority level of the task.
 * @returns {string} HTML string representing the task on the board.
 */
function generateTasksOnBoard(
  id,
  title,
  shortDescription,
  category,
  categoryColor,
  prio
) {
  return `  <div
              class="task-card-area d-flex-column-center"
              id="task_${id}"
              draggable="true"
              ondragstart="startDragging(${id}, event)"
            >
              <div class="w-100" id="arrow_area_top_${id}"></div>
              
              <div id="task_card_${id}" class="task-card d-flex-column" onclick="openSingleTask(${id}); initTemplateAddTask('edit_task_template', false)">
                <div class="task-category font-c-white bg-category-${categoryColor}">
                  ${category}
                </div>
                <div class="d-flex-column gap-8">
                  <div class="task-title font-w-700">
                  ${title}
                  </div>
                  <div class="task-description">
                  ${shortDescription}
                  </div>
                </div>
                <div id="subtasks_${id}" class="task-subtasks d-flex-spbe-center"></div>

                <div class="d-flex-spbe-center">
                  <div class="d-flex-center">
                    <div id="assignees_task_${id}" class="d-flex-center"></div>
                    <div id="assignees_number_${id}" class="d-flex-center"></div>
                  </div>
                  <img src="../assets/img/png/prio-${prio}.png" />
                </div>
              </div>

              <div class="w-100" id="arrow_area_bottom_${id}"></div>
            </div>
          `;
}

/**
 * Generates HTML for a "No tasks To do" message.
 *
 * @returns {string} HTML string representing a div with a "No tasks To do" message.
 */
function generateNoTaskField() {
  return `<div class="task-none d-flex-center">No tasks To do</div>`;
}

/**
 * Generates HTML for displaying subtask progress.
 *
 * @param {number} sumDoneSubtasks - The number of completed subtasks.
 * @param {number} sumAllSubtasks - The total number of subtasks.
 * @returns {string} HTML string representing the subtask progress bar and count.
 */
function generateSubtasks(sumDoneSubtasks, sumAllSubtasks) {
  return `
      <div class="task-subtasks-bar"></div>
      <span class="task-subtasks-text font-c-black"
      >${sumDoneSubtasks}/${sumAllSubtasks} Subtasks
      </span>`;
}

/**
 * Generates HTML for an assignee field.
 *
 * @param {Object} contact - The contact object for the assignee.
 * @param {string} contact.color - The background color for the assignee field.
 * @param {string} contact.initials - The initials of the assignee.
 * @returns {string} HTML string representing an assignee field with initials and color.
 */
function generateAssigneeField(contact) {
  return `<span class="assignee font-s-12 font-c-white mar-r-8 wh-32 d-flex-center" 
            style="background-color: ${contact.color};">${contact.initials}
      </span>`;
}

/**
 * Generates HTML for displaying additional assignees count.
 *
 * @param {number} remainingCount - The number of additional assignees.
 * @returns {string} HTML string representing a field showing the count of additional assignees.
 */
function generateAdditionallyAssigneeField(remainingCount) {
  return `<span class="additionally-assignee wh-32 d-flex-center">
        +${remainingCount}
      </span>`;
}

/**
 * Generates HTML for a user field.
 *
 * @param {Object} activeUser - The active user object.
 * @returns {string} HTML string representing a user field with initials and color.
 */
function generateUserField(activeUser) {
  return `<span class="user font-s-12 mar-r-8 wh-32 d-flex-center" 
            style="background-color: ${activeUser.color};">${activeUser.initials}
      </span>`;
}

/**
 * Generates HTML for an upward arrow icon to move a task.
 *
 * @param {Object} task - The task object.
 */
function generateArrowTop(task) {
  return `<img class="task-arrow cursor-p" onclick="moveToStatus(${task.id}, '${task.status}', -1)" 
            src="../assets/img/png/arrow-drop-up.png"/>`;
}

/**
 * Generates HTML for a downward arrow icon to move a task.
 *
 * @param {Object} task - The task object.
 * @returns {string} HTML string representing a downward arrow icon with onclick event.
 */
function generateArrowBottom(task) {
  return `<img class="task-arrow cursor-p" onclick="moveToStatus(${task.id}, '${task.status}', 1)" 
            src="../assets/img/png/arrow-drop-down.png"/>`;
}

/**
 * Generates HTML for a single task representation.
 *
 * @param {Object} singleTask - The task object containing task details.
 * @param {string} categoryColor - The color associated with the task's category.
 * @returns {string} HTML string representing a single task with its details.
 */
function generateSingleTasks(singleTask, categoryColor) {
  return `
            <div
                class="litte-button singel-task-close-btn wh-24 d-flex-center"
                onclick="toggleOverlay('board_task_overlay'); updateTasksOnBoard(); clearButton()">
                <img src="../assets/img/png/close.png" alt="" />
            </div>        
          <div class="single-task-content d-flex-column gap-24">
            
            <div class="single-task-category font-c-white bg-category-${categoryColor}">
              ${singleTask.category}
            </div>

            <h2>${singleTask.title}</h2>

            <div class="font-c-black">
              ${singleTask.description}
            </div>

            <div class="single-task-meta">
              Due date:
              <div class="font-c-black">${singleTask.date}</div>
            </div>

            <div class="single-task-meta">
              Priority:
              <img class="single-task-prio" src="../assets/img/png/prio-${singleTask.priority}-text.png" alt="" />
            </div>

            <div class="w-100 d-flex-column gap-8">
              Assigned To:

              <div id="single_assignee" class="single-task-lines d-flex-column gap-4 font-c-black">

                <div class="single-task-assignee">
                  <span
                    class="assignee font-c-white wh-42 d-flex-center bg-255-122-0">EM</span>
                    Alex Kaljuzhin
                </div>

              </div>
            </div>

            <div class="w-100 d-flex-column gap-8">
              Subtasks:
              <div id="single_subtask" class="single-task-lines d-flex-column gap-4 font-s-16 font-c-black"></div>
            </div>

            <div class="single-task-edit">
              <div class="delete cursor-p">
                <img
                  class="img-delete"
                  onclick="openDeleteDialog(${singleTask.id})"
                  src="../assets/img/png/delete-default.png"
                  alt=""/>
              </div>

              <div class="dividing-line"></div>

              <div class="edit cursor-p">
                <img
                  class="img-edit"
                  onclick="openEditDialog(${singleTask.id}); taskValuesToEditField(${singleTask.id});"
                  src="../assets/img/png/edit-default.png"
                  alt=""/>
              </div>
            </div>
          </div>`;
}

/**
 * Generates HTML for displaying the active user as an assignee.
 *
 * @returns {string} HTML string representing the active user as an assignee.
 */
function generateSingleUserAsAssignee() {
  return `
         <div class="single-task-assignee">
                  <span
                    class="user font-s-12 wh-42 d-flex-center" style="background-color: ${activeUser.color};">${activeUser.initials}</span>
                    ${activeUser.name}
          </div>`;
}

/**
 * Generates HTML for displaying a single assignee.
 *
 * @param {Object} contact - The contact object representing the assignee.
 * @returns {string} HTML string representing a single assignee.
 */
function generateSingleAssignee(contact) {
  return `
          <div class="single-task-assignee">
                  <span
                    class="assignee font-s-12 font-c-white wh-42 d-flex-center" style="background-color: ${contact.color};">${contact.initials}</span>
                    ${contact.name}
          </div>`;
}

/**
 * Generates HTML for displaying a single subtask.
 *
 * @param {Object} subtask - The subtask object.
 * @param {number} id - The ID of the parent task.
 * @returns {string} HTML string representing a single subtask with a toggle button.
 */
function generateSingleSubtasks(subtask, id) {
  return `
          <div onclick="updateSubtaskStatus(${id}, ${subtask.subId})" class="single-task-subtasks cursor-p">
            <img            
            id="task_${id}_subtask_${subtask.subId}"
            class="litte-button"
            src="../assets/img/png/check-button-${subtask.done}.png"
            alt=""/>
            ${subtask.subTaskName}
          </div>`;
}

/**
 * Generates HTML for displaying a message when no assignees are selected.
 *
 * @returns {string} HTML string representing a message for no assignees.
 */
function generateNoAssigneeField() {
  return `<div class="single-task-subtasks font-s-16">
            No assignee have been selected yet.
          </div>`;
}

/**
 * Generates HTML for displaying a message when no subtasks are created.
 *
 * @returns {string} HTML string representing a message for no subtasks.
 */
function generateNoSubtaskField() {
  return `<div class="single-task-subtasks">
            No subtasks have been created yet.
          </div>`;
}

/**
 * Generates HTML for a delete button for a specific task.
 *
 * @param {number} taskId - The ID of the task to be deleted.
 * @returns {string} HTML string representing a delete button with an onclick event.
 */
function generateDeleteButton(taskId) {
  return `<button class="clear-button"
           onclick="deleteTask(${taskId})">YES
      </button>`;
}
