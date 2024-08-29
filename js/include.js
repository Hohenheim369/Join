async function includeHTML() {
  const elements = document.querySelectorAll("[w3-include-html]");
  const promises = [];

  for (const element of elements) {
    const file = element.getAttribute("w3-include-html");
    if (file) {
      const promise = fetch(file)
        .then((response) => {
          if (!response.ok)
            throw new Error(`Failed to load ${file}: ${response.statusText}`);
          return response.text();
        })
        .then((text) => {
          element.innerHTML = text;
          element.removeAttribute("w3-include-html");
        })
        .catch((error) => {
          console.error(`Error loading ${file}:`, error);
          element.innerHTML = "Error loading content.";
        });

      promises.push(promise);
    }
  }

  await Promise.all(promises);
  document.dispatchEvent(new CustomEvent("includesLoaded"));
}

document.addEventListener("DOMContentLoaded", includeHTML);
document.addEventListener("includesLoaded", () => {
  document.body.style.visibility = "visible";
});
