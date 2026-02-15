/* ===================== MENÚ HAMBURGUESA ===================== */
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("open");
  });
}


/* ===================== FORMULARIO CONTACTO ===================== */
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

if (form && status) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        status.textContent = "¡Tu mensaje se ha enviado con éxito!";
        form.reset();
      } else {
        status.textContent = "Hubo un problema al enviar el mensaje. Inténtalo de nuevo.";
      }
    } catch (error) {
      status.textContent = "Error de conexión. Por favor, inténtalo más tarde.";
    }
  });
}


/* ===================== ANIMACIONES SCROLL ===================== */
const animatedElements = document.querySelectorAll(
  ".service-item, .team-photo, .product-item"
);

if (animatedElements.length > 0) {
  const scrollObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target); // anima solo una vez
        }
      });
    },
    { threshold: 0.3 }
  );

  animatedElements.forEach(el => scrollObserver.observe(el));
}


/* ===================== CARRUSEL UNIVERSAL ===================== */
/*
  ✔ Funciona para:
    - Servicios
    - Ventas / productos
    - Cualquier carrusel futuro
*/
document.querySelectorAll(".carousel").forEach(carousel => {
  const track = carousel.querySelector(".carousel-track");
  const images = track ? track.querySelectorAll("img") : [];
  const prevBtn = carousel.querySelector(".prev");
  const nextBtn = carousel.querySelector(".next");

  let index = 0;

  // Seguridad
  if (!track || images.length === 0) return;

  // 🔹 Si solo hay una imagen, ocultamos flechas
  if (images.length <= 1) {
    if (prevBtn) prevBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";
    return;
  }

  function updateCarousel() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      index = (index + 1) % images.length;
      updateCarousel();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      index = (index - 1 + images.length) % images.length;
      updateCarousel();
    });
  }
});


/* ===================== HERO CAROUSEL FADE AUTO ===================== */
/*
  ✔ Independiente del resto
  ✔ No interfiere con otros carruseles
*/
const heroImages = document.querySelectorAll(".hero-carousel-track img");

if (heroImages.length > 0) {
  let currentHero = 0;

  heroImages[currentHero].classList.add("active");

  setInterval(() => {
    heroImages[currentHero].classList.remove("active");
    currentHero = (currentHero + 1) % heroImages.length;
    heroImages[currentHero].classList.add("active");
  }, 3000);
}

/* ===================== INTRO CORAZÓN ABOUT US ===================== */

const intro = document.getElementById("intro-animation");
const heart = document.querySelector(".heart");

if (intro && heart) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      heart.classList.add("expand");

      setTimeout(() => {
        intro.style.display = "none";
      }, 1000);

    }, 500); // tiempo que late antes de expandirse
  });
}