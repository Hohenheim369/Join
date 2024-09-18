function toggleOverlay() {
  let refOverlay = document.getElementById("board-ticket-overlay");
  refOverlay.classList.toggle("d-none");

  if (!refOverlay.classList.contains("d-none")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}

function bubblingPrevention(event) {
  event.stopPropagation();
}


async function renderTasksInBoard() {
  const tasks = await fetchData('tasks');
  const statuses = ['todo', 'inprogress', 'awaitfeedback', 'done'];

  tasks.forEach(task => {
    renderTasks(task.status, task.id, task.title, task.description, task.category, task.priority);
  });

  statuses.forEach(updateColumnStatus);
  // initDragAndDrop();
}

function renderTasks(status, id, title, description, category, priority) {
  let statusArea = document.getElementById(`kanban_${status}`);
  let shortDescription = shortenDescription(description);
  statusArea.innerHTML += generateTasksOnBoard(id, title, shortDescription, category, status, priority);
  updateColumnStatus(status);
}

function shortenDescription(description) {
  const words = description.split(/\s+/);
  if (words.length <= 6) return description;
  return words.slice(0, 6).join(' ') + '...';
}

function updateColumnStatus(status) {
  const statusArea = document.getElementById(`kanban_${status}`);
  const noneTicketDiv = statusArea.querySelector('.ticket-none');
  const tasks = statusArea.querySelectorAll('.ticket-card');

  if (tasks.length === 0) {
    noneTicketDiv.style.display = 'flex';
  } else {
    noneTicketDiv.style.display = 'none';
  }
}



// function initDragAndDrop() {
//   const columns = document.querySelectorAll('.kanban-tickets');
//   columns.forEach(column => {
//     column.addEventListener('dragover', allowDrop);
//     column.addEventListener('drop', drop);
//   });
// }

// function allowDrop(ev) {
//   ev.preventDefault();
// }

// function drop(ev) {
//   ev.preventDefault();
//   const taskId = ev.dataTransfer.getData('text');
//   const task = document.getElementById(taskId);
//   ev.target.closest('.kanban-tickets').appendChild(task);
  
//   // Aktualisiere den Status für beide betroffenen Spalten
//   updateColumnStatus(task.dataset.status);
//   updateColumnStatus(ev.target.closest('.kanban-tickets').id.split('_')[1]);
  
//   // Aktualisiere den Status des Tasks
//   task.dataset.status = ev.target.closest('.kanban-tickets').id.split('_')[1];
// }


// function render() {
//   for (let i = 0; i < dishes.length; i++) {
//     const dish = dishes[i];

//     renderPopulars(i, dish.popular, dish.name, dish.description, dish.price);
//     renderMeal(i, dish.category, dish.name, dish.description, dish.price);
//   }
// }

// function renderMeal(i, category, name, description, price) {
//   let meal = document.getElementById(category);
//   meal.innerHTML += generateDishHtml(i, name, description, price);
// }

// // Lädt alle Posts
// function renderPost(content) {
//   for (let i = 0; i < posts.length; i++) {
//     const post = posts[i];
//     const commentsCount = post["comments"].length;

//     content.innerHTML += generatePostHtml(
//       i,
//       post["logo"],
//       post["author"],
//       post["date"],
//       post["picture"],
//       post["likeName"],
//       post["likeCount"],
//       post["description"],
//       commentsCount
//     );
//     renderLike(i, post["likeStatus"]);
//     renderComments(i, post["comments"], post["commentAuthor"]);
//   }
// }

// // Lädt das Herz je nach Status
// function renderLike(i, status) {
//   if (status) {
//     document.getElementById(`like${i}`).src = `./img/1-heartred.png`;
//   } else {
//     document.getElementById(`like${i}`).src = `./img/1-heart.png`;
//   }
// }

// // Lädt die Kommentare
// function renderComments(i, comments, commentAuthor) {
//   let postComment = document.getElementById(`postComment${i}`);

//   for (let j = 0; j < comments.length; j++) {
//     const commtnAuthor = commentAuthor[j];
//     const comment = comments[j];

//     postComment.innerHTML += `<div><b>${commtnAuthor}</b> ${comment}</div>`;
//   }
// }