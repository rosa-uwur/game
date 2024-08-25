const personaje = document.getElementById('personaje');
const gameArea = document.getElementById('gameArea');
const meta = document.getElementById('meta');
const velocidad = 10; // Velocidad de movimiento en píxeles

let timer;
let timeLeft = 60; // Puedes ajustar el tiempo según la dificultad o preferencia
let startGame = false;

let velocidadEnemigo = 5; // Velocidad de movimiento de los enemigos
let gameOver = false;
let playerName = "";



document.addEventListener('keydown', moverPersonaje);




document.getElementById('difficulty').addEventListener('change', function() {
    var selectedValue = this.options[this.selectedIndex].value;
    switch (selectedValue) {
        case 'easy':
            velocidadEnemigo = 3; 
            break;
        case 'medium':
            velocidadEnemigo = 5; 
            break;
        case 'hard':
            velocidadEnemigo = 7; 
            break;
        default:
            velocidadEnemigo = 5; 
            break;
    }
});

// Mover personaje con las teclas de flechas
function moverPersonaje(event) {
    if (gameOver) return;

    if (!startGame){
        alert('Debes ingresar tu nombre');
        startGame = false;
        return;
    }

    let topPos = parseInt(window.getComputedStyle(personaje).getPropertyValue('bottom'));
    let leftPos = parseInt(window.getComputedStyle(personaje).getPropertyValue('left'));

    if (event.key === 'ArrowUp') {
        if (topPos + velocidad + personaje.offsetHeight < gameArea.offsetHeight) {
            personaje.style.bottom = (topPos + velocidad) + 'px';
        } else {
            verificarMeta();
        }
    }

    if (event.key === 'ArrowDown') {
        if (topPos - velocidad >= 0) {
            personaje.style.bottom = (topPos - velocidad) + 'px';
        }
    }

    // Movimiento hacia la izquierda
    if (event.key === 'ArrowLeft') {
        if (leftPos - velocidad >= 0) {
            personaje.style.left = (leftPos - velocidad) + 'px';
        }
    }

    // Movimiento hacia la derecha
    if (event.key === 'ArrowRight') {
        if (leftPos + velocidad + personaje.offsetWidth < gameArea.offsetWidth) {
            personaje.style.left = (leftPos + velocidad) + 'px';
        }
    }

}

// Verificar si el personaje llegó a la meta
function verificarMeta() {
    const topPos = parseInt(window.getComputedStyle(personaje).getPropertyValue('bottom'));
    const metaPos = gameArea.offsetHeight - meta.offsetHeight;

    if (topPos + personaje.offsetHeight >= metaPos) {
        alert('¡Has ganado! Llegaste al otro lado de la calle.');
        resetGame();
    }
}

// Función para generar enemigos
function generarEnemigo() {
    const enemigo = document.createElement('div');
    enemigo.classList.add('enemigo');
    var img = document.createElement('img');
    img.src = 'enemigo.png'; // Reemplaza con la ruta de tu imagen
    img.alt = 'Descripción de la imagen'; // Opcional, para accesibilidad
    img.width = 50; // Opcional, ajustar el ancho de la imagen
    img.height = 50; // Opcional, ajustar la altura de la imagen
    // Posición inicial del enemigo (arriba, en una posición horizontal aleatoria)
    enemigo.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
    enemigo.style.top = '0px';
    enemigo.innerHTML
    
    enemigo.appendChild(img);

    gameArea.appendChild(enemigo);

    moverEnemigo(enemigo);
}

// Mover los enemigos hacia abajo
function moverEnemigo(enemigo) {
    let movimientoEnemigo = setInterval(() => {
        if (gameOver) {
            clearInterval(movimientoEnemigo);
            return;
        }

        const topPos = parseInt(window.getComputedStyle(enemigo).getPropertyValue('top'));
        const newTopPos = topPos + velocidadEnemigo;

        if (newTopPos + enemigo.offsetHeight > gameArea.offsetHeight) {
            enemigo.remove();
            clearInterval(movimientoEnemigo);
        } else {
            enemigo.style.top = newTopPos + 'px';
        }

        verificarColision(enemigo);
    }, 50);
}

// Verificar si hay colisión con el personaje
function verificarColision(enemigo) {
    const personajeRect = personaje.getBoundingClientRect();
    const enemigoRect = enemigo.getBoundingClientRect();

    if (
        personajeRect.left < enemigoRect.left + enemigoRect.width &&
        personajeRect.left + personajeRect.width > enemigoRect.left &&
        personajeRect.top < enemigoRect.top + enemigoRect.height &&
        personajeRect.top + personajeRect.height > enemigoRect.top
    ) {
        alert('¡Game Over! Has colisionado con un enemigo.');
        gameOver = true;
        resetGame();
    }
}

// Función para reiniciar el juego
function resetGame() {
    personaje.style.bottom = '0px';
    gameOver = false;
    // Eliminar enemigos existentes
    const enemigos = document.querySelectorAll('.enemigo');
    enemigos.forEach(enemigo => enemigo.remove());
    timeLeft = 60;
}



function iniciarJuego(){
    setInterval(() => {
        if (!gameOver) {
            generarEnemigo();
        }
    }, 2000);
}





function startTimer() {
    timer = setInterval(function() {
        timeLeft--;
        document.getElementById('timer').textContent = `Tiempo restante: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

// Función para terminar el juego cuando el tiempo se acaba
function endGame() {
    alert('¡Tiempo agotado! El juego ha terminado.');
    gameOver = true;
    resetGame();
}




function empezarJuego() {
    const nameForm = document.getElementById('nameForm');
    playerName = document.getElementById('playerName').value;
    
    if (playerName.trim() !== "") {
        nameForm.style.display = 'none';
        startGame = true;
        gameOver = false;
        startTimer(); 
        iniciarJuego();
    } else {
        alert("Por favor, ingresa tu nombre.");
        startGame = false;
    }
}