// ========== SCROLL SUAVE PARA ENLACES DEL SIDEBAR ==========
document.querySelectorAll('.nav-sidebar a, nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Si el enlace tiene un ID válido (empieza con #)
        if (targetId && targetId !== "#" && targetId !== "" && targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        
        // Actualizar clase activa en el menú
        document.querySelectorAll('.nav-sidebar a').forEach(link => {
            link.classList.remove('activo');
        });
        this.classList.add('activo');
    });
});

// ========== MARCAR EL BOTÓN "¿QUIÉNES SOMOS?" COMO ACTIVO ==========
const quienesLink = document.querySelector('.nav-sidebar a[href="#"]');
if (quienesLink && quienesLink.innerText.includes('Quiénes')) {
    document.querySelectorAll('.nav-sidebar a').forEach(link => {
        link.classList.remove('activo');
    });
    quienesLink.classList.add('activo');
}

// ========== AGREGAR EFECTO DE REVELADO AL HACER SCROLL ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

// Aplicar animación suave a las tarjetas al aparecer
document.querySelectorAll('.card-mv, .historia-texto, .valores-lista, .hero-quienes').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    observer.observe(el);
});

// Forzar primera carga para elementos visibles
setTimeout(() => {
    document.querySelectorAll('.card-mv, .historia-texto, .valores-lista, .hero-quienes').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
    });
}, 100);

console.log("🍓 Le Coin de la Fraise - Sección Quiénes Somos, Misión y Visión cargada correctamente");
