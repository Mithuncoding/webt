// Initialize AOS
AOS.init({
    duration: 1000,
    once: true
});

// Three.js Background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
});

const container = document.getElementById('three-container');
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Create stars
const starGeometry = new THREE.BufferGeometry();
const starCount = 7000;
const positionArray = new Float32Array(starCount * 3);
const scaleArray = new Float32Array(starCount);

for(let i = 0; i < starCount; i++) {
    // Position
    positionArray[i * 3] = (Math.random() - 0.5) * 100;
    positionArray[i * 3 + 1] = (Math.random() - 0.5) * 100;
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 100;
    
    // Scale
    scaleArray[i] = Math.random();
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
starGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));

// Star material
const starMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    color: 0xffffff,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending
});

// Create star points
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Camera position
camera.position.z = 50;

// Animation
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.001;

    // Rotate stars
    stars.rotation.y = time * 0.1;
    stars.rotation.x = time * 0.05;

    // Make stars twinkle
    const positions = stars.geometry.attributes.position.array;
    const scales = stars.geometry.attributes.aScale.array;
    
    for(let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];
        
        // Twinkle effect
        const twinkle = Math.sin(time * 5 + x + y + z) * 0.5 + 0.5;
        scales[i] = Math.max(0.1, twinkle);
    }
    
    stars.geometry.attributes.aScale.needsUpdate = true;
    
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
});

// Typing effect
const phrases = [
    "Full Stack Developer 💻",
    "UI/UX Designer 🎨",
    "Problem Solver 🧩",
    "Tech Enthusiast 🚀"
];

let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeText() {
    const typingElement = document.getElementById('typing-text');
    const currentPhrase = phrases[currentPhraseIndex];

    if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        typingSpeed = 50;
    } else {
        typingElement.textContent = currentPhrase.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && currentCharIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 1500; // Pause at the end
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        typingSpeed = 500; // Pause before starting new phrase
    }

    setTimeout(typeText, typingSpeed);
}

// Start typing effect
setTimeout(typeText, 1000);

// Game Management - Using working game sources
const games = {
    'pacman': {
        url: 'https://pacman-e281c.web.app/'
    },
    'snake': {
        url: 'https://slither.io/'
    },
    'minesweeper': {
        url: 'https://minesweeper.online/'
    },
    '2048': {
        url: 'https://2048.io/'
    },
    'mario': {
        url: 'https://supermario-game.com/'
    },
    'dino': {
        url: 'https://chromedino.com/'
    }
};

// Game card click handlers
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
        const gameType = card.dataset.game;
        const container = document.getElementById('game-container');
        const gameIframe = document.getElementById('game-iframe');
        
        if (games[gameType]) {
            gameIframe.src = games[gameType].url;
            container.classList.remove('hidden');
        }
    });
});

// Close game button
document.getElementById('close-game').addEventListener('click', () => {
    const container = document.getElementById('game-container');
    const gameIframe = document.getElementById('game-iframe');
    
    container.classList.add('hidden');
    gameIframe.src = '';
});