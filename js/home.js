// HOME.JS — apenas comportamento da página inicial.

document.querySelector("#themeToggle")?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("libraryTheme",
    document.body.classList.contains("dark") ? "dark" : "light");
});

document.querySelector("#refreshHome")?.addEventListener("click", () => {
  location.reload();
});

if (localStorage.getItem("libraryTheme") === "dark") {
  document.body.classList.add("dark");
}

document.querySelectorAll(".language-card").forEach(button => {
  button.addEventListener("click", () => {
    alert(`Área de ${button.dataset.language} preparada para a próxima etapa.`);
  });
});

document.querySelector("#newBookHome")?.addEventListener("click", () => {
  window.loadPage("library");
});

document.querySelectorAll(".book-action").forEach(button => {
  button.addEventListener("click", () => {
    window.loadPage("library");
  });
});