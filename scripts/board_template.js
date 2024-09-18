function generateTasksOnBoard(id, title, shortDescription, category, status, prio){
    let categoryColor = category.replace(/\s+/g, '').toLowerCase();
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
                  >2/3 Subtasks</span
                >
              </div>

              <div class="d-flex-spbe-center">
                <div class="d-flex-center">
                  <span
                    class="assignee font-c-white mar-r-8 wh-32 d-flex-center bg-255-122-0"
                    >AK</span
                  >
                  <span
                    class="assignee font-c-white mar-r-8 wh-32 d-flex-center bg-31-215-193"
                    >LS</span
                  >
                  <span
                    class="assignee font-c-white mar-r-8 wh-32 d-flex-center bg-70-47-138"
                    >SR</span
                  >
                </div>
                <img src="../assets/img/png/prio-${prio}.png" />
              </div>
            </div>
          `
}