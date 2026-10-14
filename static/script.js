// Ativa o modo estrito para prevenir erros comuns e tornar o código mais seguro.
"use strict";

// Inicializa o EmailJS com a chave pública da aplicação.
emailjs.init({
  publicKey: "1L6OESQ9uTslAlDah",
});

/* ============================================================
   DADOS - Arrays de Objetos
   ============================================================ */
// Mensagens rotativas exibidas no terminal do Hero
const developerMessages = [
  "Always learning.",
  "Building projects.",
  "Writing clean code.",
  "Learning new technologies.",
  "Solving problems.",
  "Fixing bugs.",
  "Drinking coffee.",
];

// Mensagens apresentadas ao tentar fechar o ficheiro do editor
const codeTabMessages = [
  "Cannot close file: active portfolio preview.",
  "This file is required for the portfolio.",
  "Closing disabled: project is still running.",
  "Access denied: developer mode enabled.",
  "Exception: FileCloseError.",
  "Process interrupted: file still required.",
  "Nice try.",
];

const skillsData = [
  // Linguagens de Programação
  { name: "Python", level: 70, category: "Programação" },
  { name: "JavaScript", level: 55, category: "Programação" },
  { name: "Java", level: 40, category: "Programação" },

  // Desenvolvimento Web
  { name: "HTML5", level: 70, category: "Desenvolvimento Web" },
  { name: "CSS", level: 60, category: "Desenvolvimento Web" },
  { name: "Bootstrap", level: 55, category: "Desenvolvimento Web" },

  // Bases de Dados
  { name: "SQL", level: 60, category: "Bases de Dados" },
  { name: "MySQL", level: 60, category: "Bases de Dados" },
  { name: "SQLite", level: 60, category: "Bases de Dados" },

  // Controlo de Versões
  { name: "GitHub", level: 60, category: "Controlo de Versões" },
  { name: "Git", level: 60, category: "Controlo de Versões" },
];

const projectsData = [
  {
    title: "Painel de dados de Incêndios Florestais em Portugal",
    description:
      "Dashboard interativo sobre os incêndios florestais em Portugal, construído com dados do ICNF " +
      "(mais de 800 mil ocorrências desde 1980).<br><br>" +
      "Inclui um pipeline ETL para extração, transformação e carregamento de dados, com armazenamento " +
      "em Supabase.<br><br>" +
      "Disponibiliza mapas de distribuição geográfica e de probabilidade estimada por concelho, bem como " +
      "análises da evolução temporal dos incêndios e da avaliação do perigo de incêndio através do índice FWI.",
    tech: ["Python", "Streamlit", "Pandas", "GeoPandas", "Plotly", "PyDeck", "Supabase"],
    category: "Dados",
    link: "https://github.com/hugo-henriques-dev/incendio_florestal_dashboard",
  },
  {
    title: "Portefólio Pessoal",
    description: 
      "O website que está a visualizar. Desenvolvido para apresentar o meu percurso, competências e projetos, " +
      "com uma interface dinâmica construída em JavaScript.",
    tech: ["HTML", "CSS", "JavaScript", "Bootstrap"],
    category: "Frontend",
    link: "#projects",
    buttonText: "Projeto atual",
  },
  {
  title: "Jogo da Forca",
  description:
    "Projeto desenvolvido em grupo com tempo limitado, consistindo na implementação " +
    "de um jogo da forca em Python com interface gráfica em Tkinter.<br><br>" +
    "Inclui seleção aleatória de palavras, validação de entradas, gestão de tentativas " +
    "e feedback visual ao utilizador.",
  tech: ["Python", "Tkinter"],
  category: "Outros",
  link: "#projects",
  buttonText: "Exercício prático"
  },
];

/* ============================================================
   FUNÇÕES AUXILIARES
   ============================================================ */
// Devolve a classe Bootstrap da barra de progresso consoante o nível da competência.
function levelColorClass(level) {
  if (level >= 80) {
    return "bg-success";
  } else if (level >= 55) {
    return "bg-warning";
  } else {
    return "bg-danger";
  }
}

// Obtém uma lista de categorias únicas a partir de um array de objetos.
function uniqueCategories(items) {
  const categories = [];
  for (const item of items) {
    if (!categories.includes(item.category)) {
      categories.push(item.category);
    }
  }
  return categories;
}

// Cria a barra de progresso de uma competência.
function createProgressBar(level) {
  const progress = document.createElement("div");
  progress.className = "progress";

  progress.setAttribute("role", "progressbar");
  progress.setAttribute("aria-valuenow", level);
  progress.setAttribute("aria-valuemin", "0");
  progress.setAttribute("aria-valuemax", "100");

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar " + levelColorClass(level);
  progressBar.style.width = "0%";
  progressBar.dataset.level = level;

  progress.appendChild(progressBar);

  return progress;
}

// Ativa o botão selecionado e desativa os restantes do mesmo grupo.
function activateFilterButton(selector, activeButton) {
  document.querySelectorAll(selector).forEach((button) => {
    button.classList.remove("active");
  });

  activeButton.classList.add("active");
}

function setFeedback(feedback, message, className) {
  feedback.textContent = message;
  feedback.className = className;
}

/* ============================================================
   SIDEBAR - Highlight da secção ativa
   ============================================================ */
// Inicializa o destaque automático da secção ativa na barra lateral.
function initSidebarHighlight() {
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const links = document.querySelectorAll(".sidebar-link");

  // Secções atualmente dentro da "banda" de deteção
  const visibleSections = new Set();

  function setActiveLink(sectionId) {
    links.forEach((link) => {
      const isActive = link.dataset.section === sectionId;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  // Escolhe, entre as secções visíveis, a mais próxima do topo (ordem do documento)
  function updateActiveSection() {
    if (visibleSections.size === 0) return;

    const topMost = sections.find((section) => visibleSections.has(section.id));

    if (topMost) {
      setActiveLink(topMost.id);
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.add(entry.target.id);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      updateActiveSection();
    },
    {
      threshold: 0,
      rootMargin: "-20% 0px -40% 0px",
    },
  );

  sections.forEach((section) => observer.observe(section));
}

// Substitui o salto nativo de qualquer âncora interna por um scroll centrado no viewport.
function initSmoothAnchors() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href.length < 2) {
        return;
      }

      const targetId = href.slice(1);
      const target = document.getElementById(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      history.pushState(null, "", `#${targetId}`);
    });
  });
}

function initSidebarToggle() {
  const toggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("mainSidebar");
  const backdrop = document.getElementById("sidebarBackdrop");

  if (!toggle || !sidebar || !backdrop) {
    return;
  }

  const icon = toggle.querySelector("i");

  function syncToggleUI(isOpen) {
    if (icon) {
      icon.className = isOpen ? "bi bi-x-lg" : "bi bi-list";
    }
    toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    backdrop.classList.remove("show");
    toggle.setAttribute("aria-expanded", "false");
    syncToggleUI(false);
  }

  function toggleSidebar() {
    const isOpen = sidebar.classList.toggle("open");
    backdrop.classList.toggle("show", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    syncToggleUI(isOpen);
  }

  toggle.addEventListener("click", toggleSidebar);
  backdrop.addEventListener("click", closeSidebar);

  // Fecha automaticamente ao escolher uma secção
  sidebar.querySelectorAll(".sidebar-link").forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });
}

/* ============================================================
   TEMA CLARO / ESCURO
   ============================================================ */
function initThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  if (!toggle) {
    return;
  }

  const STORAGE_KEY = "portfolio-theme";

  function syncToggleUI(theme) {
    const icon = toggle.querySelector("i");

    if (icon) {
      icon.className = theme === "light" ? "bi bi-moon-stars" : "bi bi-sun";
    }

    toggle.dataset.tooltip = theme === "light" ? "Modo escuro" : "Modo claro";
    toggle.setAttribute(
      "aria-label",
      theme === "light" ? "Ativar modo escuro" : "Ativar modo claro",
    );
  }

  // O tema inicial já foi aplicado pelo script no <head>
  syncToggleUI(root.getAttribute("data-bs-theme") || "dark");

  toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-bs-theme") === "light" ? "dark" : "light";

    root.setAttribute("data-bs-theme", next);
    syncToggleUI(next);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      // Armazenamento indisponível - o tema aplica-se, mas a preferência não é guardada.
    }
  });
}

/* ============================================================
   HERO - Mensagem dinâmica
   ============================================================ */
function initDeveloperMessage() {
  const status = document.getElementById("developer-status");

  if (!status) {
    return;
  }

  // Adiciona aspas a cada mensagem para simular o código Python
  const messages = developerMessages.map((message) => `"${message}"`);

  /* velocidades da animação */
  const TYPING_SPEED = 55;
  const ERASE_SPEED = 28;

  /* pausas da animação */
  const PAUSE_AFTER_TYPING = 2500;
  const PAUSE_BEFORE_TYPING = 300;

  let index = 0;

  // Escreve a mensagem carácter a carácter
  async function typeMessage(text) {
    status.textContent = "";

    for (const character of text) {
      status.textContent += character;
      await new Promise((resolve) => window.setTimeout(resolve, TYPING_SPEED));
    }
  }

  // Apaga a mensagem carácter a carácter
  async function eraseMessage() {
    while (status.textContent.length > 0) {
      status.textContent = status.textContent.slice(0, -1);
      await new Promise((resolve) => window.setTimeout(resolve, ERASE_SPEED));
    }
  }

  // Alterna continuamente entre as diferentes mensagens
  async function animate() {
    while (true) {
      await new Promise((resolve) => window.setTimeout(resolve, PAUSE_AFTER_TYPING));

      await eraseMessage();

      index = (index + 1) % messages.length;

      await new Promise((resolve) => window.setTimeout(resolve, PAUSE_BEFORE_TYPING));

      await typeMessage(messages[index]);
    }
  }

  animate();
}

// Oculta a seta do hero assim que a secção "Sobre" entra em vista.
function initHeroScrollIndicator() {
  const about = document.getElementById("about");
  const scrollLink = document.querySelector(".hero-scroll");

  if (!about || !scrollLink) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      scrollLink.classList.toggle("hero-scroll-hidden", entry.isIntersecting);
    },
    {
      threshold: 0,
      rootMargin: "-20% 0px -40% 0px",
    },
  );

  observer.observe(about);
}

/* ============================================================
   CODE WINDOW - Mensagem ao tentar fechar ficheiro
   ============================================================ */
function initCodeTabClose() {
  const closeButton = document.querySelector(".tab-close");
  const message = document.querySelector(".code-message");

  if (!closeButton || !message) {
    return;
  }

  let hideMessageTimeout;

  closeButton.addEventListener("click", () => {
    const randomMessage = codeTabMessages[Math.floor(Math.random() * codeTabMessages.length)];

    message.textContent = randomMessage;

    message.classList.add("show");

    // Cancela o desaparecimento anterior
    clearTimeout(hideMessageTimeout);

    // Cria um novo
    hideMessageTimeout = setTimeout(() => {
      message.classList.remove("show");
    }, 3000);
  });
}

/* ============================================================
   COMPETÊNCIAS
   ============================================================ */
// Indica se a secção já foi vista e a animação inicial já ocorreu.
let skillsVisible = false;

// Define a largura real de cada barra, disparando a transição CSS.
function animateSkillBars() {
  requestAnimationFrame(() => {
    document.querySelectorAll("#skills-container .progress-bar").forEach((bar) => {
      bar.style.width = bar.dataset.level + "%";
    });
  });
}

// Observa a secção de competências e inicia a animação apenas na primeira visualização.
function initSkillsAnimation() {
  const skillsSection = document.getElementById("skills");

  if (!skillsSection) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observer) => {
      if (entries[0].isIntersecting) {
        skillsVisible = true;
        animateSkillBars();
        observer.disconnect();
      }
    },
    {
      threshold: 0.3,
    },
  );

  observer.observe(skillsSection);
}

function renderSkills(filter) {
  const container = document.getElementById("skills-container");
  container.innerHTML = "";

  // Cria os cartões apenas para as competências visíveis pelo filtro
  for (const skill of skillsData) {
    if (filter !== "Todas" && skill.category !== filter) {
      continue;
    }

    const col = document.createElement("div");
    col.className = "col-md-6";

    const card = document.createElement("div");
    card.className = "card h-100";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const skillHeader = document.createElement("div");
    skillHeader.className = "skill-item-header mb-2";

    const name = document.createElement("span");
    name.className = "fw-semibold";
    name.textContent = skill.name;

    const badge = document.createElement("span");
    badge.className = "badge text-bg-secondary";
    badge.textContent = skill.level + "%";

    skillHeader.appendChild(name);
    skillHeader.appendChild(badge);

    const progress = createProgressBar(skill.level);

    cardBody.appendChild(skillHeader);
    cardBody.appendChild(progress);
    card.appendChild(cardBody);
    col.appendChild(card);
    container.appendChild(col);
  }

  // Reanima as barras ao trocar de filtro, se a secção já tiver sido vista
  if (skillsVisible) {
    animateSkillBars();
  }
}

function renderSkillFilters() {
  const list = document.getElementById("filter-list");
  const categories = ["Todas", ...uniqueCategories(skillsData)];

  list.innerHTML = "";

  categories.forEach((category, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "list-group-item list-group-item-action" + (index === 0 ? " active" : "");
    button.textContent = category;
    button.dataset.category = category;

    button.addEventListener("click", () => {
      activateFilterButton("#filter-list .list-group-item", button);
      renderSkills(category);
    });

    list.appendChild(button);
  });
}

/* ============================================================
   PROJETOS
   ============================================================ */
function renderProjects(filter) {
  const container = document.getElementById("projects-container");
  container.innerHTML = "";

  for (const project of projectsData) {
    if (filter !== "Todos" && project.category !== filter) {
      continue;
    }

    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";

    const card = document.createElement("article");
    card.className = "card h-100";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body d-flex flex-column";

    const title = document.createElement("h3");
    title.className = "h5 card-title";
    title.textContent = project.title;

    const description = document.createElement("p");
    description.className = "card-text";
    description.innerHTML = project.description;

    const techList = document.createElement("ul");
    techList.className = "list-unstyled project-tech mb-3";
    project.tech.forEach((tech) => {
      const li = document.createElement("li");
      const badge = document.createElement("span");
      badge.className = "badge text-bg-light border";
      badge.textContent = tech;
      li.appendChild(badge);
      techList.appendChild(li);
    });

    const projectLink = document.createElement("a");
    projectLink.href = project.link;
    projectLink.className = "btn btn-sm btn-outline-primary mt-auto";
    projectLink.textContent = project.buttonText || "Ver projeto";
    if (project.link !== "#projects") {
      projectLink.target = "_blank";
      projectLink.rel = "noopener noreferrer";
    }

    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(techList);
    cardBody.appendChild(projectLink);
    card.appendChild(cardBody);
    col.appendChild(card);
    container.appendChild(col);
  }
}

function renderProjectFilters() {
  const container = document.getElementById("project-filter");
  const categories = ["Todos", ...uniqueCategories(projectsData)];

  container.innerHTML = "";

  categories.forEach((category, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-outline-primary" + (index === 0 ? " active" : "");
    button.textContent = category;
    button.dataset.category = category;

    button.addEventListener("click", () => {
      activateFilterButton("#project-filter .btn", button);
      renderProjects(category);
    });

    container.appendChild(button);
  });
}

/* ============================================================
   FORMULÁRIO DE CONTACTO
   ============================================================ */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");

  if (!form || !feedback) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.classList.add("was-validated");

    if (!form.checkValidity()) {
      setFeedback(
        feedback,
        "Por favor preencha corretamente todos os campos obrigatórios.",
        "text-danger",
      );
      return;
    }

    setFeedback(feedback, "A enviar mensagem...", "text-muted");

    // Envia o formulário através do serviço EmailJS
    emailjs
      .send("service_8r0ejhs", "template_331j52k", {
        name: form.name.value,
        email: form.email.value,
        subject: form.subject.value,
        message: form.message.value,
      })
      .then(() => {
        setFeedback(
          feedback,
          "Mensagem enviada com sucesso! Entrarei em contacto brevemente.",
          "text-success",
        );

        form.reset();
        form.classList.remove("was-validated");
      })
      .catch(() => {
        setFeedback(
          feedback,
          "Ocorreu um erro ao enviar a mensagem. Tente novamente.",
          "text-danger",
        );
      });
  });
}

/* ============================================================
   RODAPÉ
   ============================================================ */
function initFooter() {
  const yearSpan = document.getElementById("year");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  // Navegação / layout global
  initSidebarHighlight();
  initSmoothAnchors();
  initSidebarToggle();
  initHeroScrollIndicator();
  initThemeToggle();

  // Hero
  initDeveloperMessage();
  initCodeTabClose();

  // Competências
  renderSkillFilters();
  renderSkills("Todas");
  initSkillsAnimation();

  // Projetos
  renderProjectFilters();
  renderProjects("Todos");

  // Contacto
  initContactForm();

  // Rodapé
  initFooter();
});
