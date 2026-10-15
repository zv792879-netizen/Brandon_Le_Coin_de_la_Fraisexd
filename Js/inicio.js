// ========== SCROLL SUAVE PARA ENLACES DEL SIDEBAR ==========
document.querySelectorAll('.nav-sidebar a, nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId === "#" || targetId === "") return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== EFECTO DE APARICIÓN PARA LAS TARJETAS DE INFORMACIÓN =====
const cards = document.querySelectorAll('.card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.2 });

cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ===== MOSTRAR TARJETAS AL CARGAR =====
window.addEventListener('load', () => {
    setTimeout(() => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }, 100);
});

// ===== BOTONES "VER MÁS" DE LOS PRODUCTOS =====
const botonesVerMas = document.querySelectorAll('.btn-ver-mas');


// ===== ANIMACIÓN PARA LAS TARJETAS DE PRODUCTOS Y RAZONES =====
const productosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

const elementosAnimados = document.querySelectorAll('.producto-card, .razon-card');

elementosAnimados.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    productosObserver.observe(el);
});

// ========== CARRUSEL AUTOMÁTICO + MANUAL ==========
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const slidesContainer = document.querySelector('.carousel-slides');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('dotsContainer');

    // Solo ejecutar si existe el carrusel
    if (!slidesContainer || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoInterval;

    // Crear los puntos indicadores
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === currentIndex) dot.classList.add('active-dot');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Actualizar la posición del carrusel
    function updateCarousel() {
        const offset = -currentIndex * 100;
        slidesContainer.style.transform = `translateX(${offset}%)`;
        if (dotsContainer) {
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active-dot');
                } else {
                    dot.classList.remove('active-dot');
                }
            });
        }
    }

    // Ir a un slide específico
    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentIndex = index;
        updateCarousel();
        resetAutoPlay();
    }

    // Siguiente slide
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    // Slide anterior
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // Reiniciar el intervalo automático
    function resetAutoPlay() {
        if (autoInterval) clearInterval(autoInterval);
        autoInterval = setInterval(() => {
            nextSlide();
        }, 5000);
    }

    // Eventos de los botones
    if (prevBtn) prevBtn.addEventListener('click', () => prevSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => nextSlide());

    // Pausar autoplay cuando el mouse está sobre el carrusel
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            if (autoInterval) clearInterval(autoInterval);
        });
        carouselContainer.addEventListener('mouseleave', () => {
            resetAutoPlay();
        });
    }

    // Inicializar carrusel
    createDots();
    updateCarousel();
    resetAutoPlay();

    // Al redimensionar la ventana
    window.addEventListener('resize', () => {
        updateCarousel();
    });

    console.log("🍓 Le Coin de la Fraise - Carrusel activo con " + totalSlides + " imágenes");
});

console.log("🍓 Le Coin de la Fraise - Estructura cargada correctamente");
