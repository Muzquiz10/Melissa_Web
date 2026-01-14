// const hamburger = document.getElementById("hamburger");
// const navLinks = document.querySelector(".nav-links");

// hamburger.addEventListener("click", () => {
//     navLinks.classList.toggle("active");
//     hamburger.classList.toggle("open");
// });

  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Evita la redirección

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { "Accept": "application/json" }
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
