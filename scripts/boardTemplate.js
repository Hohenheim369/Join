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
              <div id="arrow_area_top_${id}"></div>
              
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

              <div  id="arrow_area_bottom_${id}" onclick="moveToStatus(${id}, 1)"></div>
            </div>
          `;
}

function generateNoTaskField() {
  return `<div class="task-none d-flex-center">No tasks To do</div>`;
}

function generateSubtasks(sumDoneSubtasks, sumAllSubtasks) {
  return `
      <div class="task-subtasks-bar"></div>
      <span class="task-subtasks-text font-c-black"
      >${sumDoneSubtasks}/${sumAllSubtasks} Subtasks
      </span>`;
}

function generateAssigneeField(contact) {
  return `<span class="assignee font-s-12 font-c-white mar-r-8 wh-32 d-flex-center" 
            style="background-color: ${contact.color};">${contact.initials}
      </span>`;
}

function generateAdditionallyAssigneeField(remainingCount) {
  return `<span class="additionally-assignee wh-32 d-flex-center">
        +${remainingCount}
      </span>`;
}

function generateUserField(activeUser) {
  return `<span class="user font-s-12 mar-r-8 wh-32 d-flex-center" 
            style="background-color: ${activeUser.color};">${activeUser.initials}
      </span>`;
}

function generateArrowTop(task) {
  return `<img class="task-arrow" onclick="moveToStatus(${task.id}, 0)" 
            src="../assets/img/png/arrow-drop-up.png"/>`;
}

function generateArrowBottom(task) {
  return `<img class="task-arrow" onclick="moveToStatus(${task.id}, 1)" 
            src="../assets/img/png/arrow-drop-down.png"/>`;
}

function generateSingleTasks(
  id,
  title,
  description,
  category,
  categoryColor,
  date,
  prio
) {
  return `
          <div class="single-task-content d-flex-column gap-24">
            <div class="d-flex-spbe-center">
              <div class="single-task-category font-c-white bg-category-${categoryColor}">
              ${category}
              </div>
              <div
                class="litte-button wh-24 d-flex-center"
                onclick="toggleOverlay('board_task_overlay'); updateTasksOnBoard(); clearButton()">
                <img src="../assets/img/png/close.png" alt="" />
              </div>
            </div>

            <h2>${title}</h2>

            <div class="font-c-black">
              ${description}
            </div>

            <div class="single-task-meta">
              Due date:
              <div class="font-c-black">${date}</div>
            </div>

            <div class="single-task-meta">
              Priority:
              <img class="single-task-prio" src="../assets/img/png/prio-${prio}-text.png" alt="" />
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
                  onclick="openDeleteDialog(${id})"
                  src="../assets/img/png/delete-default.png"
                  alt=""/>
              </div>

              <div class="dividing-line"></div>

              <div class="edit cursor-p">
                <img
                  class="img-edit"
                  onclick="openEditDialog(${id})"
                  src="../assets/img/png/edit-default.png"
                  alt=""/>
              </div>
            </div>
          </div>`;
}

function generateSingleUserAsAssignee() {
  return `
         <div class="single-task-assignee">
                  <span
                    class="user font-s-12 wh-42 d-flex-center" style="background-color: ${activeUser.color};">${activeUser.initials}</span>
                    ${activeUser.name}
          </div>`;
}

function generateSingleAssignee(contact) {
  return `
          <div class="single-task-assignee">
                  <span
                    class="assignee font-s-12 font-c-white wh-42 d-flex-center" style="background-color: ${contact.color};">${contact.initials}</span>
                    ${contact.name}
          </div>`;
}

function generateSingleSubtasks(subtask, id) {
  return `
          <div class="single-task-subtasks">
            <img
            onclick="updateSubtaskStatus(${id}, ${subtask.subId})"
            id="task_${id}_subtask_${subtask.subId}"
            class="litte-button"
            src="../assets/img/png/check-button-${subtask.done}.png"
            alt=""/>
            ${subtask.subTaskName}
          </div>`;
}

function generateNoAssigneeField() {
  return `<div class="single-task-subtasks font-s-16">
            No assignee have been selected yet.
          </div>`;
}

function generateNoSubtaskField() {
  return `<div class="single-task-subtasks">
            No subtasks have been created yet.
          </div>`;
}

function generateDeleteButton(taskId) {
  return `<div class="delete-btn font-s-20 font-c-66-82-110 cursor-p"
           onclick="deleteTask(${taskId})">YES
      </div>`;
}
