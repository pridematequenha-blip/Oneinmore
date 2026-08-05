// LEARN.JS — área de aprendizagem.

const documents = JSON.parse(localStorage.getItem("libraryDocuments") || "[]");
const readBooks = documents.filter(book => book.read).length;
document.querySelector("#booksRead").textContent = readBooks;

document.querySelector("#quizGame").onclick = () => {
  alert("Quiz: na próxima etapa vamos gerar perguntas a partir dos livros marcados como lidos.");
};

document.querySelector("#memoryGame").onclick = () => {
  alert("Jogo da memória: módulo preparado para a próxima etapa.");
};

document.querySelector("#webGame").onclick = () => {
  alert("HTML & CSS: vamos criar desafios práticos baseados no que estudaste.");
};