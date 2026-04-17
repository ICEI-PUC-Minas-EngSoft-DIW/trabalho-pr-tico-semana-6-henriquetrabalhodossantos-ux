const toggle = document.getElementById("theme-toggle");
const icon = document.querySelector(".icon");

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");

  if (toggle.checked) {
    icon.textContent = "☀️";
  } else {
    icon.textContent = "🌙";
  }
});