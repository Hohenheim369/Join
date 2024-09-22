function generateTasksOnBoard(
  id,
  title,
  shortDescription,
  category,
  categoryColor,
  prio,
  sumAllSubtasks,
  sumDoneSubtasks
) {
  return `<div
              id="task_${id}"
              draggable="true"
              ondragstart="startDragging(${id}, event)"
            >
              <div class="ticket-card d-flex-column gap-24" onclick="openSingleTask(${id})">
                <div class="ticket-category font-c-white bg-category-${categoryColor}">
                  ${category}
                </div>
                <div class="d-flex-column gap-8">
                  <div class="ticket-title font-w-700">
                  ${title}
                  </div>
                  <div class="ticket-description">
                  ${shortDescription}
                  </div>
                </div>
                <div class="d-flex-spbe-center">
                  <div class="ticket-subtasks-bar"></div>
                  <span class="ticket-subtasks-text font-c-black"
                    >${sumDoneSubtasks}/${sumAllSubtasks} Subtasks
                  </span>
                </div>

                <div class="d-flex-spbe-center">
                    <div id="assignees_task_${id}" class="d-flex-center">                  
                    </div>
                  <img src="../assets/img/png/prio-${prio}.png" />
                </div>
              </div>
            </div>
          `;
}




function generateSingleTasks(
  id,
  title,
  description,
  category,
  categoryColor,
  date,
  prio,
) {
  return `<div class="overflow d-flex-column gap-24">
          <div class="d-flex-spbe-center">
            <div class="single-ticket-category font-c-white bg-category-${categoryColor}">
            ${category}
            </div>
            <div
              class="litte-button wh-24 d-flex-center"
              onclick="toggleOverlay()"            >
              <img src="../assets/img/png/close.png" alt="" />
            </div>
          </div>

          <h1>${title}</h1>

          <div class="font-s-20 font-c-black">
            ${description}
          </div>

          <div class="single-ticket-meta font-s-20">
            Due date:
            <div class="font-c-black">${date}</div>
          </div>

          <div class="single-ticket-meta font-s-20">
            Priority:
            <img src="../assets/img/png/prio-${prio}-text.png" alt="" />
          </div>

          <div class="w-100 d-flex-column gap-8 font-s-20">
            Assigned To:

            <div class="single-ticket-lines d-flex-column gap-4 font-s-19 font-c-black">

              <div class="single-ticket-assignee">
                <span
                  class="assignee font-c-white wh-42 d-flex-center bg-255-122-0">EM</span>
                  Alex Kaljuzhin
              </div>

            </div>
          </div>

          <div class="w-100 d-flex-column gap-8 font-s-20">
            Subtasks:

            <div class="single-ticket-lines d-flex-column gap-4 font-s-16 font-c-black">

              <div class="single-ticket-subtasks">
                <img
                  onclick="toggleCheckButton('todo_1_subtask_1', 'button')"
                  id="todo_1_subtask_1"
                  class="litte-button"
                  src="/assets/img/png/check-button-false.png"
                  alt=""/>
                Implement Recipe Recommendatio
              </div>

            </div>
          </div>

          <div class="single-ticket-edit">
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