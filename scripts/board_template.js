function generateTasksOnBoard(
  id,
  title,
  shortDescription,
  category,
  categoryColor,
  prio
) {
  return `  <div
              id="task_${id}"
              draggable="true"
              ondragstart="startDragging(${id}, event)"
            >
              <div class="task-card d-flex-column gap-24" onclick="openSingleTask(${id})">
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
                <div id="subtasks_${id}" class="d-flex-spbe-center"></div>

                <div class="d-flex-spbe-center">
                  <div class="d-flex-center">
                    <div id="assignees_task_${id}" class="d-flex-center"></div>
                    <div id="assignees_number_${id}" class="d-flex-center"></div>
                  </div>
                  <img src="../assets/img/png/prio-${prio}.png" />
                </div>
              </div>
            </div>
          `;
}

function generateSubtasks(sumDoneSubtasks, sumAllSubtasks) {
  return `
      <div class="task-subtasks-bar"></div>
      <span class="task-subtasks-text font-c-black"
      >${sumDoneSubtasks}/${sumAllSubtasks} Subtasks
      </span>`;
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
          <div class="overflow d-flex-column gap-24">
            <div class="d-flex-spbe-center">
              <div class="single-task-category font-c-white bg-category-${categoryColor}">
              ${category}
              </div>
              <div
                class="litte-button wh-24 d-flex-center"
                onclick="toggleOverlay('board_task_overlay')"            >
                <img src="../assets/img/png/close.png" alt="" />
              </div>
            </div>

            <h1>${title}</h1>

            <div class="font-s-20 font-c-black">
              ${description}
            </div>

            <div class="single-task-meta font-s-20">
              Due date:
              <div class="font-c-black">${date}</div>
            </div>

            <div class="single-task-meta font-s-20">
              Priority:
              <img src="../assets/img/png/prio-${prio}-text.png" alt="" />
            </div>

            <div class="w-100 d-flex-column gap-8 font-s-20">
              Assigned To:

              <div id="single_assignee" class="single-task-lines d-flex-column gap-4 font-s-19 font-c-black">

                <div class="single-task-assignee">
                  <span
                    class="assignee font-c-white wh-42 d-flex-center bg-255-122-0">EM</span>
                    Alex Kaljuzhin
                </div>

              </div>
            </div>

            <div class="w-100 d-flex-column gap-8 font-s-20">
              Subtasks:
              <div id="single_subtask" class="single-task-lines d-flex-column gap-4 font-s-16 font-c-black"></div>
            </div>

            <div class="single-task-edit">
              <div class="delete cursor-p">
                <img
                  class="img-delete"
                  src="../assets/img/png/delete-default.png"
                  alt=""/>
              </div>

              <div class="dividing-line"></div>

              <div class="edit cursor-p">
                <img
                  class="img-edit"
                  src="../assets/img/png/edit-default.png"
                  alt=""/>
              </div>
            </div>
          </div>`;
}

function generateSingleAssignee(contact){
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
            onclick="toggleCheckButton('task_${id}_subtask_${subtask.subId}', 'button')"
            id="task_${id}_subtask_${subtask.subId}"
            class="litte-button"
            src="../assets/img/png/check-button-${subtask.done}.png"
            alt=""/>
            ${subtask.subTaskName}
          </div>`;
}

