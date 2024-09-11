let urgentButton = document.getElementById("urgent_span");
let urgentSvg1Ref = document.getElementById("urgent_svg1");
let urgentSvg2Ref = document.getElementById("urgent_svg2");
let mediumButton = document.getElementById("medium_span");
let mediumSVG1Ref = document.getElementById("medium_svg1");
let mediumSVG2Ref = document.getElementById("medium_svg2");
let lowButton = document.getElementById("low_span");
let lowSVG1Ref = document.getElementById("low_svg1");
let lowSVG2Ref = document.getElementById("low_svg2");

function selectUrgent() {
  if ((onclick = true)) {
    switchSelection();
    urgentButton.classList.remove("urgent-button");
    urgentButton.classList.add("clicked-urgent");
    urgentSvg1Ref.setAttribute("fill", "#ffffff");
    urgentSvg2Ref.setAttribute("fill", "#ffffff");
  }
}

function selectMedium() {
  if ((onclick = true)) {
    switchSelection();
    mediumButton.classList.remove("medium-button");
    mediumButton.classList.add("clicked-medium");
    mediumSVG1Ref.setAttribute("fill", "white");
    mediumSVG2Ref.setAttribute("fill", "white");
  }
}

function selectLow() {
  if ((onclick = true)) {
    switchSelection();
    lowButton.classList.remove("low-button");
    lowButton.classList.add("clicked-low");
    lowSVG1Ref.setAttribute("fill", "white");
    lowSVG2Ref.setAttribute("fill", "white");
  }
}

function switchSelection() {
  urgentButton.classList.remove("clicked-urgent");
  urgentButton.classList.add("urgent-button");
  urgentSvg1Ref.setAttribute("fill", "#FF3D00");
  urgentSvg2Ref.setAttribute("fill", "#FF3D00");
  mediumButton.classList.remove("clicked-medium");
  mediumButton.classList.add("medium-button");
  mediumSVG1Ref.setAttribute("fill", "#FFA800");
  mediumSVG2Ref.setAttribute("fill", "#FFA800");
  lowButton.classList.remove("clicked-low");
  lowButton.classList.add("low-button");
  lowSVG1Ref.setAttribute("fill", "#7AE229");
  lowSVG2Ref.setAttribute("fill", "#7AE229");
}

function clearButton(){
  location.reload();
}

function openSelect() {
  if (onclick = true) {
    document.getElementById('assigned_inactiv').classList.add('d-none');
    getContacts();
    document.getElementById('assigned_activ').classList.remove('d-none');
    document.getElementById('contact_contant').innerHTML = showAssignedContact();
  }
}

function closeSelect(){
  if (onclick = true) {
    document.getElementById('assigned_activ').classList.add('d-none');
    document.getElementById('assigned_inactiv').classList.remove('d-none');
  }
}

function openSelectCategory() {
  if (onclick = true) {
    document.getElementById('category_inactiv').classList.add('d-none');
    document.getElementById('category_activ').classList.remove('d-none');
    document.getElementById('category_task_contant').innerHTML = showCategory();
  }
}

function closeSelectCategory(){
  if (onclick = true) {
    document.getElementById('category_activ').classList.add('d-none');
    document.getElementById('category_inactiv').classList.remove('d-none');
  }
}