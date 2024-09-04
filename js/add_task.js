function changeColorUrgent() {
  let urgentRef = document.getElementById("urgent_span");
  let urgentSvg1Ref = document.getElementById("urgentSVG1");
  let urgentSvg2Ref = document.getElementById("urgentSVG2");
  if (onclick = true) {
    urgentRef.classList.remove("urgent-button");
    urgentRef.classList.add("clicked-urgent");
    urgentSvg1Ref.setAttribute("fill", "#ffffff");
    urgentSvg2Ref.setAttribute("fill", "#ffffff");
  }
}

function changeColorMedium() {
  let mediumRef = document.getElementById("medium_span");
  let mediumSVG1Ref = document.getElementById("mediumSVG1");
  let mediumSVG2Ref = document.getElementById("mediumSVG2");
  if (onclick = true) {
    mediumRef.classList.remove("medium-button");
    mediumRef.classList.add("clicked-medium");
    mediumSVG1Ref.setAttribute("fill", "white");
    mediumSVG2Ref.setAttribute("fill", "white");
  }
}

function changeColorLow() {
  let lowRef = document.getElementById("low_span");
  let lowSVG1Ref = document.getElementById("lowSVG1");
  let lowSVG2Ref = document.getElementById("lowSVG2");
  if (onclick = true) {
    lowRef.classList.remove("low-button");
    lowRef.classList.add("clicked-low");
    lowSVG1Ref.setAttribute("fill", "white");
    lowSVG2Ref.setAttribute("fill", "white");
  }
}