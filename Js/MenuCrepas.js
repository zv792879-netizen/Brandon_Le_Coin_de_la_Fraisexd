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

console.log("🍓 Le Coin de la Fraise - Estructura cargada correctamente");
