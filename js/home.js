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

// Inicialização do carrossel: colocada aqui para tornar o comportamento robusto e
// garantir que corre após a DOM estar completamente carregada.
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('bannerCarousel');
  const track = document.getElementById('carouselTrack');
  const prev = document.getElementById('carouselPrev');
  const next = document.getElementById('carouselNext');

  // segurança: se algum elemento faltante, aborta sem lançar erro
  if (!carousel || !track || !prev || !next) {
    console.warn('Carrossel: elemento(s) não encontrado(s). IDs esperados: bannerCarousel, carouselTrack, carouselPrev, carouselNext');
    return;
  }

  const slides = Array.from(track.querySelectorAll('img'));
  if (slides.length === 0) {
    console.warn('Carrossel: sem slides (imgs) dentro de #carouselTrack');
    return;
  }

  let index = Math.floor(Math.random() * slides.length);
  const intervalMs = 3500; // 3.5 segundos entre slides
  let timer = null;
  let isAutoPlaying = true; // controle de autoplay

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    update();
  }

  function nextSlide() { 
    goTo(index + 1); 
  }
  
  function prevSlide() { 
    goTo(index - 1); 
  }

  next.addEventListener('click', () => { 
    nextSlide(); 
    resetTimer(); 
  });
  
  prev.addEventListener('click', () => { 
    prevSlide(); 
    resetTimer(); 
  });

  function startTimer() { 
    if (!isAutoPlaying) return;
    stopTimer(); 
    timer = setInterval(nextSlide, intervalMs); 
  }
  
  function stopTimer() { 
    if (timer) { 
      clearInterval(timer); 
      timer = null; 
    } 
  }
  
  function resetTimer() { 
    stopTimer(); 
    startTimer(); 
  }

  // pause on hover / focus (carousel precisa de tabindex para ser focável)
  carousel.addEventListener('mouseenter', stopTimer);
  carousel.addEventListener('mouseleave', startTimer);
  carousel.addEventListener('focusin', stopTimer);
  carousel.addEventListener('focusout', startTimer);

  // suporte a teclado: setas esquerda/direita
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { 
      nextSlide(); 
      resetTimer(); 
      e.preventDefault(); 
    }
    if (e.key === 'ArrowLeft') { 
      prevSlide(); 
      resetTimer(); 
      e.preventDefault(); 
    }
  });

  // iniciar na imagem aleatória e arranque do autoplay
  goTo(index);
  startTimer();
  
  // garantir que autoplay inicia quando a página fica visível novamente
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopTimer();
    } else {
      if (isAutoPlaying) {
        startTimer();
      }
    }
  });
});
