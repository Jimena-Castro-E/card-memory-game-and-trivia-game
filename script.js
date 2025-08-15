document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  // Solo borrar el nombre si estás en la página principal
  if (path.includes("index.html") || path === "/" || path === "/index") {
    localStorage.removeItem("jugador");
  }

  const input = document.getElementById("nickname");
  const btnGuardar = document.querySelector(".btn-nick");
  const nombreVisible = document.getElementById("nombreJugadorVisible");
  const nombreModal = document.getElementById("nombreJugadorModal");
  // const contenedorInput = document.querySelector(".nick-container");
  const labelNombre = document.getElementById("nombreJugador");
  const jugadorGuardado = localStorage.getItem("jugador");

  // Mostrar nombre si ya está en localStorage
  if (jugadorGuardado && nombreVisible) {
    nombreVisible.textContent = `Jugador: ${jugadorGuardado}`;
    if (nombreModal) {
      nombreModal.textContent = jugadorGuardado;
    }
  }

  // Guardar el nombre al hacer clic
  if (btnGuardar) {
    btnGuardar.addEventListener("click", () => {
      const nickname = input.value.trim();
      if (nickname !== "") {
        localStorage.setItem("jugador", nickname);
        nombreVisible.textContent = `Jugador: ${nickname}`;
        if (nombreModal) {
          nombreModal.textContent = nickname;
        }
        input.style.display = "none";
        btnGuardar.style.display = "none";
        labelNombre.style.display = "none";
      } else {
        alert("Por favor, ingresa tu nombre de jugador.");
      }
    });
  }

  //--------------Botones de jugar : valida en cada boton si el usuario ya se registro
  const botonesJugar = document.querySelectorAll(".btn-jugar");

  botonesJugar.forEach(boton => {
    boton.addEventListener("click", () => {
      const jugador = localStorage.getItem("jugador");

      if (!jugador) {
        alert("Debes ingresar tu nombre antes de jugar.");
        return;
      }

      if (boton.id === "btnMemoria") {
        window.location.href = "memoria.html";
      } else if (boton.id === "btnTrivia") {
        window.location.href = "trivia.html";
      }
    });
  });
});