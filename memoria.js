document.addEventListener("DOMContentLoaded", () => {

  //borrar el jugador
  if (!sessionStorage.getItem("juegoIniciado")) {
    localStorage.clear();
    sessionStorage.setItem("juegoIniciado", "true");
  }  

  const iniciarContenedor = document.querySelector(".container-juego"),
    iniciarJuego = document.querySelector(".btn-iniciar"),
    tablero = document.querySelector(".tablero"),
    repetir = document.querySelector(".bi-arrow-repeat"),
    estadisticas = document.querySelector(".estadisticas");
  const resultadoContainer = document.getElementById("resultado-container");
  const resultadoMensaje = document.getElementById("resultado-mensaje");
  const botonReintentar = document.getElementById("boton-reintentar");

  // Todas las cartas de configuración
  const cards = document.querySelectorAll(".card-config");

  // Variables del juego
  let nivel = 2,
    columnas = 2,
    filas = 2,
    coincide = 0,
    cartaUno = null,
    cartaDos = null,
    prevenirClick = true;

  // Variables de estadísticas
  let victorias = parseInt(localStorage.getItem("victorias")) || 0;
  let derrotas = parseInt(localStorage.getItem("derrotas")) || 0;
  let movimientos = 0;

  document.querySelector("#victorias").textContent = `Victorias: ${victorias}`;
  document.querySelector("#derrotas").textContent = `Derrotas: ${derrotas}`;
  document.querySelector("#movimientos").textContent = `Movimientos: ${movimientos}`;

  function actualizarEstadisticas() {
    document.querySelector("#victorias").textContent = `Victorias: ${victorias}`;
    document.querySelector("#derrotas").textContent = `Derrotas: ${derrotas}`;
    document.querySelector("#movimientos").textContent = `Movimientos: ${movimientos}`;

    // Actualizar localStorage
    localStorage.setItem("victorias", victorias);
    localStorage.setItem("derrotas", derrotas);
  }

  // Selección de tipo y dificultad
  cards.forEach(card => {
    card.addEventListener("click", (e) => {
      const parent = card.parentElement;
      parent.querySelectorAll(".card-config").forEach(c => {
        c.classList.remove("flipped", "selected");
      });
      card.classList.add("flipped", "selected");
    });
  });

  let tiempoRestante;
  let temporizador;
  // BOTON DE INICIAR JUEGO
  iniciarJuego.addEventListener("click", (e) => {
    repetir.style.display = "grid";
    estadisticas.style.display = "block";

    const tipoSeleccionado = document.querySelector(".card-config[data-tipo].selected");
    const dificultadSeleccionada = document.querySelector(".card-config[data-dificultad].selected");

    if (!tipoSeleccionado || !dificultadSeleccionada) {
      alert("Debes seleccionar el tipo de juego y la dificultad antes de comenzar.");
      estadisticas.style.display = "none";
      repetir.style.display = "none";
      return;
    }

    const tipo = tipoSeleccionado.getAttribute("data-tipo");
    const dificultad = dificultadSeleccionada.getAttribute("data-dificultad");

    columnas = parseInt(dificultadSeleccionada.getAttribute("column"));
    filas = parseInt(dificultadSeleccionada.getAttribute("row"));
    nivel = (columnas * filas) / 2;

    if (dificultad === "facil") {
      tiempoRestante = 40;
    } else if (dificultad === "dificil") {
      tiempoRestante = 80;
    }

    iniciarContenedor.style.display = "none";
    tablero.style.display = "grid";
    tablero.style.gridTemplateColumns = `repeat(${columnas}, 110px)`;

    const anchoCarta = 110;
    const altoCarta = 110;
    const espacioEntre = 15;
    const paddingExtra = 40;

    const maxWidth = (anchoCarta * columnas) + (espacioEntre * (columnas - 1)) + paddingExtra;
    tablero.style.maxWidth = `${maxWidth}px`;

    const maxHeight = (altoCarta * filas) + (espacioEntre * (filas - 1)) + paddingExtra;
    tablero.style.minHeight = `${maxHeight}px`;

    crearCartas(tipo);
  });

  let reverso = "assets/imgs/pregunta.png";

  function crearCartas(tipo) {
    tablero.innerHTML = "";
    let cartas = [];
    const piedras = [
      "assets/imgs/diamantes/aguamarina.png", "assets/imgs/diamantes/amatista.png", "assets/imgs/diamantes/cuarzo.png",
      "assets/imgs/diamantes/diamante.png", "assets/imgs/diamantes/esmeralda.png", "assets/imgs/diamantes/rubi.png",
      "assets/imgs/diamantes/topacio.png", "assets/imgs/diamantes/zafiro.png", "assets/imgs/diamantes/onix.png",
      "assets/imgs/diamantes/turmalina.png", "assets/imgs/diamantes/obsidiana.png", "assets/imgs/diamantes/corazon.png",
      "assets/imgs/diamantes/celeste.png", "assets/imgs/diamantes/plateado.png", "assets/imgs/diamantes/peridoto.png",
      "assets/imgs/diamantes/amarillo.png", "assets/imgs/diamantes/morada.png", "assets/imgs/diamantes/gemas.png"
    ];

    if (tipo === "numerico") {
      for (let i = 1; i <= nivel; i++) {
        cartas.push(i, i);
      }
    } else if (tipo === "grafico") {
      const seleccionadas = piedras.slice(0, nivel);
      cartas = [...seleccionadas, ...seleccionadas];
    }

    cartas.sort(() => Math.random() - 0.5);

    cartas.forEach((contenido) => {
      const htmlCarta = tipo === "numerico"
        ? `<div class="card-config"><div class="card-inner" onclick="flipCard(this)"><div class="card-front"><img src="${reverso}" alt="Reverso" width="100px"></div><div class="card-back numero">${contenido}</div></div></div>`
        : `<div class="card-config"><div class="card-inner" onclick="flipCard(this)"><div class="card-front"><img src="${reverso}" alt="Reverso" width="100px"></div><div class="card-back"><img src="${contenido}" alt="Piedra"></div></div></div>`;

      tablero.innerHTML += htmlCarta;
    });

    tablero.querySelectorAll(".card-config").forEach(card => {
      card.classList.add("flipped");
    });
    const mensaje = document.getElementById("mensaje-preparacion");
    mensaje.style.display = "block";
    mensaje.textContent = "¡Prepárate!";


    let cuentaRegresiva = 3;
    const intervaloCuenta = setInterval(() => {
      if (cuentaRegresiva > 0) {
        mensaje.textContent = `¡Preparados en ${cuentaRegresiva}...!`;
        cuentaRegresiva--;
      } else {
        clearInterval(intervaloCuenta);
        mensaje.textContent = "¡Listo!";
        setTimeout(() => {
          mensaje.style.display = "none"; // Oculta el mensaje después de decir "Listo"

          // Voltear las cartas
          tablero.querySelectorAll(".card-config").forEach(card => {
            card.classList.remove("flipped");
          });
          prevenirClick = true;

          // Ahora sí empieza el temporizador:
          temporizador = setInterval(() => {
            tiempoRestante--;
            document.querySelector("#tiempoRestante").textContent = `Tiempo restante: ${tiempoRestante}s`;
            if (tiempoRestante <= 0) {
              clearInterval(temporizador);
              perder();
            }
          }, 1000);

        }, 500); // medio segundo mostrando "¡Listo!"
      }
    }, 1000);

  }

  window.flipCard = function (card) {
    if (prevenirClick && !card.classList.contains("flipped")) {
      card.parentElement.classList.add("flipped");
      if (!cartaUno) {
        cartaUno = card;
        return;
      }
      if (card === cartaUno) {
        return;
      }
      cartaDos = card;
      prevenirClick = false;
      let valorUno = cartaUno.querySelector(".card-back").innerHTML;
      let valorDos = cartaDos.querySelector(".card-back").innerHTML;

      setTimeout(() => {
        matchCards(valorUno, valorDos);
      }, 1000);
    }
  }

  function matchCards(valorUno, valorDos) {
    movimientos++;
    actualizarEstadisticas();

    if (valorUno === valorDos) {
      coincide++;
      cartaUno.onclick = null;
      cartaDos.onclick = null;
      cartaUno.parentElement.classList.add("match");
      cartaDos.parentElement.classList.add("match");

      cartaUno = null;
      cartaDos = null;
      prevenirClick = true;

      if (coincide === nivel) {
        clearInterval(temporizador);
        ganar();
      }
    } else {
      cartaUno.parentElement.classList.add("shake");
      cartaDos.parentElement.classList.add("shake");
      setTimeout(() => {
        cartaUno.parentElement.classList.remove("shake", "flipped");
        cartaDos.parentElement.classList.remove("shake", "flipped");
        cartaUno = null;
        cartaDos = null;
        prevenirClick = true;
      }, 1200);
    }
  }

  repetir.addEventListener("click", () => {
    location.reload();
  });

  function ganar() {
    victorias++;
    actualizarEstadisticas();
    lanzarConfeti();
    mostrarResultado("¡Felicidades has ganado!");
  }


  function perder() {
    derrotas++;
    actualizarEstadisticas();
    mostrarOverlayPerder();
    mostrarResultado("¡Perdiste!");
  }

  function mostrarResultado(mensaje) {
    resultadoMensaje.textContent = mensaje;
    resultadoContainer.style.display = "flex";
  }
  
  botonReintentar.addEventListener("click", () => {
    location.reload(); 
  });
  
  function lanzarConfeti() {
    const confettiContainer = document.getElementById("confetti-container");
    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.backgroundColor = getRandomColor();
      confetti.style.animationDuration = (Math.random() * 2 + 2) + "s";
      confettiContainer.appendChild(confetti);
      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }
  }

  function getRandomColor() {
    const colores = ["#ff0", "#f0f", "#0ff", "#0f0", "#f00", "#00f"];
    return colores[Math.floor(Math.random() * colores.length)];
  }

  function mostrarOverlayPerder() {
    const overlay = document.getElementById("perder-overlay");
    overlay.style.display = "block";
    overlay.style.animation = "fadeOut 2s forwards";
    setTimeout(() => {
      overlay.style.display = "none";
    }, 2000);
  }
});
