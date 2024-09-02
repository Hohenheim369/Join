function changeColorUrgent() {
  let urgentRef = document.getElementById("urgentSpan");
  let urgentSvg1Ref = document.getElementById("urgentSVG1");
  let urgentSvg2Ref = document.getElementById("urgentSVG2");
  if (onclick = true) {
    urgentRef.classList.remove("urgent_button");
    urgentRef.classList.add("clicked_urgent");
    urgentSvg1Ref.setAttribute("fill", "#ffffff");
    urgentSvg2Ref.setAttribute("fill", "#ffffff");
  }
}

function changeColorMedium() {
  let mediumRef = document.getElementById("mediumSpan");
  let mediumSVG1Ref = document.getElementById("mediumSVG1");
  let mediumSVG2Ref = document.getElementById("mediumSVG2");
  if (onclick = true) {
    mediumRef.classList.remove("medium_button");
    mediumRef.classList.add("clicked_medium");
    mediumSVG1Ref.setAttribute("fill", "white");
    mediumSVG2Ref.setAttribute("fill", "white");
  }
}

function changeColorLow() {
  let lowRef = document.getElementById("lowSpan");
  let lowSVG1Ref = document.getElementById("lowSVG1");
  let lowSVG2Ref = document.getElementById("lowSVG2");
  if (onclick = true) {
    lowRef.classList.remove("low_button");
    lowRef.classList.add("clicked_low");
    lowSVG1Ref.setAttribute("fill", "white");
    lowSVG2Ref.setAttribute("fill", "white");
  }
}