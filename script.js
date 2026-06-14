document.addEventListener("DOMContentLoaded", () => {
  const DEBUG = false;

  /* -------------------------
     TRANSLATIONS (EN / ES / PT)
     ------------------------- */
  const translations = {
    en: {
      menuHome: "Home",
      menuAbout: "About Us",
      menuContact: "Contact",

      ourCompany: "🏢 Our Company",
      widget: "We offer a web widget that allows you to visualize real-time consumption.",

      aboutTitle: "Who We Are",
      aboutText: "We are a company specialized ...",

      teamTitle: "Our Team",

      address: "Address",
      office: "(Representative Office)",
      rights: "All rights reserved.",

      msgLegal: "This website uses necessary cookies and, with your consent, analytics cookies.",
      moreInfo: "View details",
      allOK: "Accept all",
      allNOK: "Reject all"
    },

    es: {
      menuHome: "Inicio",
      menuAbout: "Sobre nosotros",
      menuContact: "Contacto",

      ourCompany: "🏢 Nuestra Empresa",
      widget: "Ofrecemos un widget web que muestra el consumo en tiempo real.",

      aboutTitle: "Quiénes somos",
      aboutText: "Estamos especializados en ...",

      teamTitle: "Nuestro Equipo",

      address: "Dirección",
      office: "(Oficina de Representación)",
      rights: "Todos los derechos reservados.",

      msgLegal: "Este sitio usa cookies necesarias y, con su consentimiento, cookies analíticas.",
      moreInfo: "Más información",
      allOK: "Aceptar todo",
      allNOK: "Rechazar todo"
    },

    pt: {
      menuHome: "Início",
      menuAbout: "Sobre nós",
      menuContact: "Contato",

      ourCompany: "🏢 Nossa Empresa",
      widget: "Oferecemos um widget web que permite visualizar o consumo em tempo real.",

      aboutTitle: "Quem somos",
      aboutText: "Somos uma empresa especializada em ...",

      teamTitle: "Nossa Equipe",

      address: "Endereço",
      office: "(Escritório de Representação)",
      rights: "Todos os direitos reservados.",

      msgLegal: "Este site usa cookies necessários e, com seu consentimento, cookies analíticos.",
      moreInfo: "Ver detalhes",
      allOK: "Aceitar tudo",
      allNOK: "Recusar tudo"
    }
  };

  /* -------------------------
     LANGUAGE INIT
     ------------------------- */
  const supported = ["en", "es", "pt"];

  const browserLang = (navigator.language || "en").substring(0, 2);
  const stored = localStorage.getItem("dga-lang");

  const defaultLang =
    stored && supported.includes(stored)
      ? stored
      : supported.includes(browserLang)
      ? browserLang
      : "en";

  const langSelector = document.querySelector(
    "#languageSelect, #language-select, select[name='language']"
  );

  setLanguage(defaultLang);

  if (langSelector) {
    langSelector.value = defaultLang;
    langSelector.addEventListener("change", (e) => {
      const lang = e.target.value;
      setLanguage(lang);
      localStorage.setItem("dga-lang", lang);
    });
  }

  function setLanguage(lang) {
    if (!translations[lang]) return;

    document.querySelectorAll("[data-key]").forEach((el) => {
      const key = el.dataset.key;
      const val = translations[lang][key];

      if (val == null) return;

      const isHTML = /<[a-z][^>]*>/i.test(val);

      if (isHTML) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });

    setTimeout(() => {
      const el = document.querySelector("span[data-key='msgLegal']");
      if (el) el.textContent = translations[lang].msgLegal;
    }, 100);

    if (DEBUG) console.log("Language set:", lang);
  }

  /* -------------------------
     TAB NAVIGATION
     ------------------------- */
  document.addEventListener("click", (ev) => {
    const tab = ev.target.closest(".tab-link");
    if (tab) {
      if (tab.tagName.toLowerCase() === "a") ev.preventDefault();

      const targetId = tab.dataset.tab;
      if (!targetId) return;

      document.querySelectorAll(".tab-link").forEach((t) =>
        t.classList.toggle("active", t === tab)
      );

      document.querySelectorAll("main section, section").forEach((sec) =>
        sec.classList.toggle("active", sec.id === targetId)
      );

      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const offer = ev.target.closest(".offer-button");
    if (offer) {
      const targetId = "contact";

      document.querySelectorAll(".tab-link").forEach((t) =>
        t.classList.toggle("active", t.dataset.tab === targetId)
      );

      document.querySelectorAll("main section, section").forEach((sec) =>
        sec.classList.toggle("active", sec.id === targetId)
      );

      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const btn = ev.target.closest(".carousel .prev, .carousel .next");
    if (!btn) return;

    const carousel = btn.closest(".carousel");
    const track = carousel.querySelector(".carousel-track");
    const items = carousel.querySelectorAll(".carousel-item");

    let index = parseInt(carousel.dataset.index || "0", 10);

    if (btn.classList.contains("prev") && index > 0) index--;
    if (btn.classList.contains("next") && index < items.length - 1) index++;

    carousel.dataset.index = index;
    track.style.transform = `translateX(-${index * 100}%)`;

    carousel.querySelector(".prev").disabled = index === 0;
    carousel.querySelector(".next").disabled = index === items.length - 1;
  });

  /* -------------------------
     CAROUSEL INIT + SWIPE
     ------------------------- */
  document.querySelectorAll(".carousel").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const items = carousel.querySelectorAll(".carousel-item");

    if (!track || !items.length) return;

    let index = 0;
    carousel.dataset.index = "0";

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      const prev = carousel.querySelector(".prev");
      const next = carousel.querySelector(".next");
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === items.length - 1;
    };

    update();

    let startX = 0;

    track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      const dx = startX - endX;

      if (Math.abs(dx) > 50) {
        if (dx > 0 && index < items.length - 1) index++;
        if (dx < 0 && index > 0) index--;
        update();
      }
    });
  });

  if (DEBUG) console.log("Script loaded (i18n updated)");
});
