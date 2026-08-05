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
// garantir que corre após a DOM estar completamente carregada. Antes o código
// usava apenas DOMContentLoaded — se o script fosse carregado depois do evento
// este listener nunca era executado. Para robustez, verificamos o estado do
// documento e inicializamos imediatamente quando apropriado.
(function init() {
  function startCarousel() {
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
      // garante que a track tenha a largura dos slides (cada slide 100% do container)
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
    // small timeout to ensure layout/paint settled (helps in some browsers)
    requestAnimationFrame(() => goTo(index));
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startCarousel);
  } else {
    // DOMContentLoaded já ocorreu — inicializa imediatamente
    startCarousel();
  }
})();

// ---------- Simples persistência local para livros e músicas (localStorage)
// Proposta: guarda itens em localStorage para que apareçam de verdade no site.
// Isto é uma solução cliente-only (funciona no teu navegador). Para multi-dispositivo
// ou acesso remoto é necessário um backend (posso ajudar a adicionar um API/DB).

(function libraryPersistence() {
  const BOOKS_KEY = 'myBooks';
  const MUSIC_KEY = 'myMusic';

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch (e) { return []; }
  }
  function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

  function renderBooks() {
    const row = document.querySelector('.book-row');
    if (!row) return;
    const books = read(BOOKS_KEY);
    if (books.length === 0) return; // deixa os cartões estáticos se não houver nada salvo

    row.innerHTML = '';
    books.forEach((b, i) => {
      const btn = document.createElement('button');
      btn.className = 'book-card book-action';
      btn.dataset.index = i;
      btn.innerHTML = `<span class="book-title">${escapeHtml(b.title).replace(/\n/g,'<br>')}</span><small>${escapeHtml(b.author)}</small><b>◎</b>`;
      btn.addEventListener('click', () => { window.loadPage('library'); });
      row.appendChild(btn);
    });
  }

  function renderMusic() {
    const favRow = document.querySelector('.favorites-row');
    if (!favRow) return;
    const music = read(MUSIC_KEY);
    if (music.length === 0) return;
    favRow.innerHTML = '';
    music.forEach((m, i) => {
      const btn = document.createElement('button');
      btn.className = 'favorite-card';
      btn.dataset.index = i;
      btn.textContent = `${m.title} — ${m.artist}`;
      btn.addEventListener('click', () => { alert(`A tocar: ${m.title} — ${m.artist}`); });
      favRow.appendChild(btn);
    });
  }

  function addBookInteractive() {
    const input = prompt('Adicionar livro (formato: Título - Autor)');
    if (!input) return;
    const parts = input.split('-').map(s => s.trim());
    if (parts.length < 2) return alert('Formato inválido — use: Título - Autor');
    const [title, author] = parts;
    const books = read(BOOKS_KEY);
    books.push({ title, author, addedAt: Date.now() });
    write(BOOKS_KEY, books);
    renderBooks();
    alert('Livro adicionado.');
  }

  function addMusicInteractive() {
    const input = prompt('Adicionar música (formato: Título - Artista)');
    if (!input) return;
    const parts = input.split('-').map(s => s.trim());
    if (parts.length < 2) return alert('Formato inválido — use: Título - Artista');
    const [title, artist] = parts;
    const music = read(MUSIC_KEY);
    music.push({ title, artist, addedAt: Date.now() });
    write(MUSIC_KEY, music);
    renderMusic();
    alert('Música adicionada.');
  }

  // pequeno botão flutuante para adicionar itens
  function injectFab() {
    const fab = document.createElement('div');
    fab.id = 'libraryFab';
    fab.innerHTML = `+`;
    fab.title = 'Adicionar livro ou música';
    fab.style.position = 'fixed';
    fab.style.right = '18px';
    fab.style.bottom = '78px';
    fab.style.width = '52px';
    fab.style.height = '52px';
    fab.style.display = 'flex';
    fab.style.alignItems = 'center';
    fab.style.justifyContent = 'center';
    fab.style.borderRadius = '50%';
    fab.style.background = '#ff7a59';
    fab.style.color = '#fff';
    fab.style.boxShadow = '0 6px 18px rgba(0,0,0,0.18)';
    fab.style.cursor = 'pointer';
    fab.style.zIndex = 1200;
    fab.style.fontSize = '1.6rem';
    fab.setAttribute('aria-label','Adicionar item à biblioteca');

    fab.addEventListener('click', () => {
      const choice = prompt('Adicionar: escreva "livro" ou "música"');
      if (!choice) return;
      if (choice.toLowerCase().startsWith('l')) addBookInteractive();
      else if (choice.toLowerCase().startsWith('m')) addMusicInteractive();
      else alert('Opção não reconhecida. Escreva "livro" ou "música".');
    });

    document.body.appendChild(fab);
  }

  // segurança: escapar HTML ao inserir conteúdo do utilizador
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (m) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { renderBooks(); renderMusic(); injectFab(); });
  } else {
    renderBooks(); renderMusic(); injectFab();
  }
})();
