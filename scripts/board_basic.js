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
  const users = await fetchData('users');
  console.log(users);
  
}




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