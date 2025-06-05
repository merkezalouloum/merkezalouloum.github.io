console.log("Initialisation du carrousel...");

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM entièrement chargé");
    
    const carousel = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (!carousel || items.length === 0 || !prevBtn || !nextBtn) {
        console.error("Éléments du carrousel non trouvés");
        return;
    }

    console.log(`Nombre d'avis trouvés: ${items.length}`);
    
    let currentIndex = 0;
    const intervalTime = 10000;
    let slideInterval;

    function moveToIndex(index) {
        console.log(`Déplacement vers l'index ${index}`);
        if (index >= items.length) index = 0;
        if (index < 0) index = items.length - 1;
        currentIndex = index;
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function nextSlide() {
        console.log("Défilement automatique vers le suivant");
        moveToIndex(currentIndex + 1);
    }

    function startInterval() {
        console.log("Démarrage du défilement automatique");
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    function resetInterval() {
        console.log("Réinitialisation du timer");
        clearInterval(slideInterval);
        startInterval();
    }

    // Initialisation
    console.log("Initialisation des écouteurs d'événements");
    prevBtn.addEventListener('click', () => {
        console.log("Clic sur précédent");
        moveToIndex(currentIndex - 1);
        resetInterval();
    });

    nextBtn.addEventListener('click', () => {
        console.log("Clic sur suivant");
        moveToIndex(currentIndex + 1);
        resetInterval();
    });

    // Démarrer le carrousel
    console.log("Démarrage initial du carrousel");
    moveToIndex(0);
    startInterval();

    // Pause au survol
    carousel.addEventListener('mouseenter', () => {
        console.log("Survol - pause du défilement");
        clearInterval(slideInterval);
    });

    carousel.addEventListener('mouseleave', () => {
        console.log("Fin de survol - reprise du défilement");
        resetInterval();
    });
});

console.log("Script carousel.js chargé");
