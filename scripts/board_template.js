function generateTasksOnBoard(
  id,
  title,
  shortDescription,
  category,
  status,
  prio,
  sumAllSubtasks,
  sumDoneSubtasks
) {
  let categoryColor = category.replace(/\s+/g, "").toLowerCase();
  return `<div
              id="task_${id}"
              data-status="${status}"
              draggable="true"
              class="ticket-card d-flex-column gap-24"
              onclick="toggleOverlay()"
            >
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
                  >${sumDoneSubtasks}/${sumAllSubtasks} Subtasks</span
                >
              </div>

              <div class="d-flex-spbe-center">
                  <div id="assignees_task_${id}" class="d-flex-center">                  
                  </div>
                <img src="../assets/img/png/prio-${prio}.png" />
              </div>
            </div>
          `;
}
