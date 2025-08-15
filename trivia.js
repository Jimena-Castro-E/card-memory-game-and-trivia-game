document.addEventListener('DOMContentLoaded', function () {

    if (!sessionStorage.getItem("juegoIniciado")) {
        localStorage.clear();
        sessionStorage.setItem("juegoIniciado", "true");
    }

    const iniciar = document.querySelector('.iniciar-btn');
    const quiz = document.querySelector('.quiz-section');
    const paginaInicio = document.querySelector('.trivia-pagina');
    const quizBox = document.querySelector('.quiz-box');
    const resultBox = document.querySelector('.result-box');
    const tryAgain = document.querySelector('.tryAgain-btn');
    const goHome = document.querySelector('.goHome-btn');
    const btnNext = document.querySelector('.next-btn');
    const optionList = document.querySelector('.option-list');
    const repetirBoton = document.getElementById('repetir-boton');
    const timerElement = document.querySelector('.timer');

    let preguntaActual = 0;
    let num = 1;
    let userScore = 0;
    let correctas = 0;
    let incorrectas = 0;
    let timer;
    let tiempoRestante = 20;


    //BOTON DE INICIAR QUIZ EN LA PAGINA INICIAL DEL JUEGO DE TRIVIA
    iniciar.onclick = () => {
        document.body.classList.add('quiz-activo');
        quiz.classList.add('active');
        paginaInicio.style.display = 'none';
        quizBox.classList.add('active');
        repetirBoton.style.display = "flex";
        mostrarPreguntas(preguntaActual);
        actualizarContador(num);
        headerScore();
        if (timerElement) {
            timerElement.style.display = 'block'; 
        }
    };

    //boton de siguien pregunta
    btnNext.onclick = () => {
        if (preguntaActual < preguntas.length - 1) {
            preguntaActual++;
            mostrarPreguntas(preguntaActual);
            num++;
            actualizarContador(num);
            btnNext.classList.remove('active');
        } else {
            console.log('Preguntas Completadas');
            verResultado();
        }
    };

   // MOSTRAR LAS PREGUNTAS Y SUS OPCIONES
    function mostrarPreguntas(i) {
        clearInterval(timer);
        const textoPreguntas = document.querySelector('.question-text');
        const optionList = document.querySelector('.option-list');
        textoPreguntas.textContent = preguntas[i].pregunta;
        iniciarTemporizador();

        let optionTag = `
            <div class="option"><span>${preguntas[i].opciones[0]}</span></div>
            <div class="option"><span>${preguntas[i].opciones[1]}</span></div>
            <div class="option"><span>${preguntas[i].opciones[2]}</span></div>
            <div class="option"><span>${preguntas[i].opciones[3]}</span></div>
        `;
        optionList.innerHTML = optionTag;

        const opciones = document.querySelectorAll('.option');
        for (let j = 0; j < opciones.length; j++) {
            opciones[j].setAttribute('onclick', 'opcionSeleccionada(this)');
        }
    }

    repetirBoton.addEventListener('click', () => {
        window.location.reload();
    });


    //TEMPORIZADOR DE 20S
    function iniciarTemporizador() {
        clearInterval(timer);
        tiempoRestante = 20;
        actualizarTemporizador();
        timer = setInterval(() => {
            tiempoRestante--;
            actualizarTemporizador();
            if (tiempoRestante <= 0) {
                clearInterval(timer);
                tiempoAgotado();
            }
        }, 1000);
    }

    function actualizarTemporizador() {
        if (timerElement) {
            timerElement.textContent = `Tiempo: ${tiempoRestante}s`;
    
            if (tiempoRestante <= 5) {
                timerElement.style.color = 'red'; 
                timerElement.style.fontWeight = 'bold';
            } else {
                timerElement.style.color = ''; 
                timerElement.style.fontWeight = '';
            }
        }
    }

    //MODAL DE TIEMPO AGOTADO
    function tiempoAgotado() {
        if (!quiz.classList.contains('active')) return; // Evita que se ejecute si no estamos en el quiz
        let respuestaCorrecta = preguntas[preguntaActual].respuesta;
        let todasLasOpciones = optionList.children.length;
        for (let i = 0; i < todasLasOpciones; i++) {
            if (optionList.children[i].textContent == respuestaCorrecta) {
                optionList.children[i].classList.add('correct');
            }
            optionList.children[i].classList.add('disabled');
        }
        incorrectas++;
        actualizarContadores();
        btnNext.classList.add('active');
        mostrarModal('Tiempo agotado', `La respuesta correcta era: ${respuestaCorrecta}`, false, false);  
    }

    function actualizarContador(i) {
        const preguntasTotal = document.querySelector('.question-total');
        preguntasTotal.textContent = `${i} de ${preguntas.length} Preguntas`;
    }

    //puntaje
    function headerScore() {
        const headerScoreText = document.querySelector('.header-score');
        headerScoreText.textContent = `Puntaje: ${userScore} / ${preguntas.length}`;
    }

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

    //resultado
    function verResultado() {
        clearInterval(timer);
        quiz.classList.remove('active');
        quizBox.classList.remove('active');
        resultBox.classList.add('active');
        document.body.classList.remove('quiz-activo');
        document.body.classList.add('resultado-activo');
        if (timerElement) {
            timerElement.style.display = 'none';
        }

        const puntajeTexto = document.querySelector('.score-text');
        puntajeTexto.textContent = `Tu puntaje: ${userScore} de ${preguntas.length}`;

        const circularProgress = document.querySelector('.circular-progress');
        const progressValue = document.querySelector('.progress-value');
        let progressStartValue = 0;
        let progressEndValue = Math.round((userScore / preguntas.length) * 100);
        let speed = 20;

        let progress = setInterval(() => {
            progressStartValue++;
            progressValue.textContent = `${progressStartValue}%`;
            circularProgress.style.background = `conic-gradient(#c40094 ${progressStartValue * 3.6}deg, rgba(255, 255, 255, .1) 0deg)`;

            if (progressStartValue >= progressEndValue) {
                clearInterval(progress);
                if (progressEndValue >= 80) {
                    lanzarConfeti();
                    //libreria sweet alert de js para crear popus mejorados
                    Swal.fire({
                        title: '¡Ganaste!',
                        text: '¡Excelente desempeño!',
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                        customClass: {
                            popup: 'mi-modal'
                        }
                    });
                } else {
                    mostrarOverlayPerder();
                    Swal.fire({
                        title: 'Perdiste',
                        text: '¡Inténtalo de nuevo!',
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                        customClass: {
                            popup: 'mi-modal'
                        }
                    });
                }
            }
        }, speed);
    }


    //boton de intentar de nuevo
    tryAgain.onclick = () => {
        clearInterval(timer);
        if (timerElement) {
            timerElement.style.display = 'block';
        }
        quiz.classList.add('active');
        quizBox.classList.add('active');
        resultBox.classList.remove('active');
        btnNext.classList.remove('active');
        preguntaActual = 0;
        num = 1;
        userScore = 0;
        correctas = 0;
        incorrectas = 0;
        mostrarPreguntas(preguntaActual);
        actualizarContador(num);
        headerScore();
        actualizarContadores();
    }


    //boton de ir al menu
    goHome.onclick = () => {
        clearInterval(timer);
        tiempoRestante = 20;
        quiz.classList.remove('active');
        quizBox.classList.remove('active');
        resultBox.classList.remove('active');
        btnNext.classList.remove('active');
        paginaInicio.classList.add('active');
        document.body.classList.remove('quiz-activo', 'resultado-activo');
        paginaInicio.style.display = 'flex';
        repetirBoton.style.display = "flex";
        preguntaActual = 0;
        num = 1;
        userScore = 0;
        correctas = 0;
        incorrectas = 0;
        actualizarContador(num);
        headerScore();
        actualizarContadores();
        if (timerElement) {
            timerElement.style.display = 'none';
        }
    };

    function actualizarContadores() {
        const correctasElement = document.querySelector('.correctas');
        const incorrectasElement = document.querySelector('.incorrectas');
        if (correctasElement && incorrectasElement) {
            correctasElement.textContent = `Correctas: ${correctas}`;
            incorrectasElement.textContent = `Incorrectas: ${incorrectas}`;
        }
    }

    function mostrarModal(titulo, mensaje, correcto, autoCerrar = true) {
        Swal.fire({
            title: titulo,
            text: mensaje,
            icon: correcto ? 'success' : 'error',
            confirmButtonText: 'Continuar',
            timer: autoCerrar ? 2000 : undefined,
            customClass: {
                popup: 'mi-modal'
            }
        });
    }


    window.opcionSeleccionada = function (respuesta) {
        let respuestaUsuario = respuesta.textContent;
        let respuestaCorrecta = preguntas[preguntaActual].respuesta;
        let todasLasOpciones = optionList.children.length;
    
        if (respuestaUsuario == respuestaCorrecta) {
            respuesta.classList.add('correct');
            userScore += 1;
            correctas++;
            headerScore();
            actualizarContadores();
            clearInterval(timer);
            mostrarModal('¡Correcto!', '¡Bien hecho!', true);
        } else {
            respuesta.classList.add('incorrect');
            incorrectas++;
            actualizarContadores();
            clearInterval(timer);
            mostrarModal('Incorrecto', `La respuesta correcta era: ${respuestaCorrecta}`, false);
    
            for (let i = 0; i < todasLasOpciones; i++) {
                if (optionList.children[i].textContent == respuestaCorrecta) {
                    optionList.children[i].classList.add('correct');
                }
            }
        }
    
        for (let i = 0; i < todasLasOpciones; i++) {
            optionList.children[i].classList.add('disabled');
        }
    
        btnNext.classList.add('active');
    }
    

});
