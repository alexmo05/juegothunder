let player;
let fallingObjects = [];
let gameInterval;
let difficulty = 'easy';
let score = 0;
let lives = 3;

// Array de imágenes que caen
const objectImages = [
    'enemy.webp', // Imagen 1
    'enemy1.webp' , // Imagen 3
    'enemy2.webp', // Imagen 2
    'enemy3.webp'  // Imagen 3
];

function startGame(selectedDifficulty) {
    difficulty = selectedDifficulty;
    score = 0;
    lives = 3;
    document.getElementById('menu').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('score').textContent = `Puntos: ${score}`;
    document.getElementById('lives').textContent = `Vidas: ${lives}`;
    
    player = document.getElementById('player');
    fallingObjects = [];
    spawnObject();
    gameInterval = setInterval(gameLoop, 1000 / 60);
}

function gameLoop() {
    updateObjects();
    checkCollisions();
    updateUI();
}

function spawnObject() {
    const object = document.createElement('div');
    object.classList.add('fallingObject');
    object.style.top = '0px';
    object.style.left = `${Math.random() * window.innerWidth}px`; // Random position
    
    // Seleccionar una imagen aleatoria de las disponibles
    const randomImage = objectImages[Math.floor(Math.random() * objectImages.length)];
    object.style.backgroundImage = `url("${randomImage}")`; // Imagen del objeto que cae
    
    document.body.appendChild(object);
    fallingObjects.push(object);

    const speed = difficulty === 'easy' ? 2 : (difficulty === 'medium' ? 4 : 6);
    object.speed = speed;
}

function updateObjects() {
    for (let i = fallingObjects.length - 1; i >= 0; i--) {
        const obj = fallingObjects[i];
        const objRect = obj.getBoundingClientRect();
        obj.style.top = `${objRect.top + obj.speed}px`;

        if (objRect.top > window.innerHeight) {
            // Object reached the bottom (lose life)
            fallingObjects.splice(i, 1);
            document.body.removeChild(obj);
            lives--;
            if (lives <= 0) {
                gameOver();
            } else {
                spawnObject();
            }
        }
    }
}

function checkCollisions() {
    const playerRect = player.getBoundingClientRect();
    for (let i = fallingObjects.length - 1; i >= 0; i--) {
        const obj = fallingObjects[i];
        const objRect = obj.getBoundingClientRect();

        if (
            objRect.top + objRect.height > playerRect.top &&
            objRect.left + objRect.width > playerRect.left &&
            objRect.left < playerRect.left + playerRect.width
        ) {
            // Player caught the object
            fallingObjects.splice(i, 1);
            document.body.removeChild(obj);
            score++;
            spawnObject();
        }
    }
}

function updateUI() {
    document.getElementById('score').textContent = `Puntos: ${score}`;
    document.getElementById('lives').textContent = `Vidas: ${lives}`;
}

function gameOver() {
    clearInterval(gameInterval);
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('gameOver').style.display = 'block';
}

function backToMenu() {
    // Ocultar la pantalla de Game Over y mostrar el menú
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
    // Detener cualquier objeto en pantalla (si es necesario)
    fallingObjects.forEach((obj) => {
        document.body.removeChild(obj);
    });
    fallingObjects = [];
}

// Movimiento del jugador en el móvil
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

document.addEventListener('touchmove', (e) => {
    const touchMoveX = e.touches[0].clientX;
    const deltaX = touchMoveX - touchStartX;
    const newLeft = Math.max(0, Math.min(window.innerWidth - player.offsetWidth, player.offsetLeft + deltaX));
    player.style.left = `${newLeft}px`;
    touchStartX = touchMoveX;
});

// Movimiento del jugador en escritorio
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        player.style.left = `${Math.max(0, player.offsetLeft - 10)}px`;
    } else if (e.key === 'ArrowRight') {
        player.style.left = `${Math.min(window.innerWidth - player.offsetWidth, player.offsetLeft + 10)}px`;
    }
});
