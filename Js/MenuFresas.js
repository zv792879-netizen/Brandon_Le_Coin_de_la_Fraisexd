document.addEventListener('DOMContentLoaded', function() {
    console.log('Página con submenú cargada correctamente');

    // Opcional: para móviles, permitir abrir/cerrar con clic
    const menuItem = document.querySelector('.menu-item-con-submenu');
    if (menuItem && window.innerWidth <= 768) {
        menuItem.addEventListener('click', function(e) {
            e.preventDefault();
            const submenu = this.querySelector('.submenu');
            if (submenu.style.display === 'flex') {
                submenu.style.display = 'none';
            } else {
                submenu.style.display = 'flex';
            }
        });
    }
});
