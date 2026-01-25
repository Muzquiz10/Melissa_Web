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

if (form) {
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
  ".service-item, .team-photo"
);

const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        scrollObserver.unobserve(entry.target); // anima solo una vez
      }
    });
  },
  {
    threshold: 0.3
  }
);

animatedElements.forEach(element => {
  scrollObserver.observe(element);
});


/* ===================== CARRUSEL ARTÍCULOS (VENTAS) ===================== */
const carousels = document.querySelectorAll(".carousel");

if (carousels.length > 0) {
  carousels.forEach(carousel => {
    const track = carousel.querySelector(".carousel-track");
    const images = track.querySelectorAll("img");
    const prevBtn = carousel.querySelector(".prev");
    const nextBtn = carousel.querySelector(".next");

    let index = 0;

    function updateCarousel() {
      track.style.transform = `translateX(-${index * 100}%)`;
    }

    nextBtn.addEventListener("click", () => {
      index = (index + 1) % images.length;
      updateCarousel();
    });

    prevBtn.addEventListener("click", () => {
      index = (index - 1 + images.length) % images.length;
      updateCarousel();
    });
  });
}


