// ============================================================
// Pedidos.js - Le Coin de la Fraise
// Funcionalidad: Carrito de compras, gestión de pedidos y envío de facturas con EmailJS
// ============================================================

// --- INICIALIZACIÓN DE EMAILJS ---
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'KPaDsXunSjxvhWeCo',
    SERVICE_ID: 'service_4qpc91j',
    TEMPLATE_ID: 'template_562038q'
};

// Inicializar EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

// --- VARIABLES GLOBALES ---
let carrito = [];

// --- FUNCIONES DEL CARRITO ---

function agregarAlCarrito(id, nombre, precio) {
    const productoExistente = carrito.find(item => item.id === id && item.nombre === nombre);
    
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }
    
    actualizarCarrito();
    mostrarNotificacion(`🍓 ${nombre} agregado al carrito`);
}

function eliminarDelCarrito(index) {
    const producto = carrito[index];
    if (producto) {
        if (producto.cantidad > 1) {
            producto.cantidad--;
        } else {
            carrito.splice(index, 1);
        }
        actualizarCarrito();
        mostrarNotificacion(`🗑️ ${producto.nombre} actualizado`);
    }
}

function vaciarCarrito() {
    if (carrito.length === 0) {
        mostrarNotificacion('El carrito ya está vacío');
        return;
    }
    
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        carrito = [];
        actualizarCarrito();
        mostrarNotificacion('Carrito vaciado correctamente');
    }
}

function actualizarCarrito() {
    const carritoBody = document.getElementById('carritoBody');
    const carritoVacio = document.getElementById('carritoVacioMsg');
    const carritoLleno = document.getElementById('carritoLleno');
    const totalElement = document.getElementById('totalCarrito');
    
    carritoBody.innerHTML = '';
    
    if (carrito.length === 0) {
        carritoVacio.style.display = 'block';
        carritoLleno.style.display = 'none';
        return;
    }
    
    carritoVacio.style.display = 'none';
    carritoLleno.style.display = 'block';
    
    let total = 0;
    
    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${item.nombre}</strong></td>
            <td>
                <button class="btn-cantidad" onclick="cambiarCantidad(${index}, -1)">-</button>
                <span class="cantidad-numero">${item.cantidad}</span>
                <button class="btn-cantidad" onclick="cambiarCantidad(${index}, 1)">+</button>
            </td>
            <td>$${item.precio.toFixed(2)}</td>
            <td>$${subtotal.toFixed(2)}</td>
            <td>
                <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        `;
        carritoBody.appendChild(row);
    });
    
    totalElement.textContent = `$${total.toFixed(2)}`;
}

function cambiarCantidad(index, cambio) {
    if (carrito[index]) {
        const nuevaCantidad = carrito[index].cantidad + cambio;
        if (nuevaCantidad <= 0) {
            carrito.splice(index, 1);
        } else {
            carrito[index].cantidad = nuevaCantidad;
        }
        actualizarCarrito();
    }
}

// --- NOTIFICACIONES ---

function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-flotante';
    notificacion.innerHTML = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #FF6B8A, #E8416D);
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(232, 65, 109, 0.4);
        font-weight: 600;
        z-index: 9999;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        font-size: 0.95rem;
        max-width: 400px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.transform = 'translateY(0)';
        notificacion.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        notificacion.style.transform = 'translateY(100px)';
        notificacion.style.opacity = '0';
        setTimeout(() => {
            notificacion.remove();
        }, 400);
    }, 3000);
}

// --- GENERAR FACTURA PARA EL MODAL (WEB) ---

function generarFacturaHTML(data) {
    const productosLista = carrito.map(item => 
        `<tr>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${item.nombre}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.cantidad}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${item.precio.toFixed(2)}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${(item.precio * item.cantidad).toFixed(2)}</td>
        </tr>`
    ).join('');
    
    return `
        <div class="factura-contenido" style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #FF6B8A, #E8416D); padding: 25px 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px; font-weight: 700;">🍓Le Coin de la Fraise🍓 </h1>
                <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">Dulzura en Cada Bocado</p>
            </div>
            <div style="padding: 20px 30px 10px; border-bottom: 2px solid #f0f0f0;">
                <h2 style="margin: 0; color: #333; font-size: 22px;">📄 Factura de Pedido</h2>
                <div style="display: flex; justify-content: space-between; margin-top: 8px; flex-wrap: wrap;">
                    <p style="margin: 5px 0; color: #666; font-size: 14px;"><strong>Fecha:</strong> ${data.fecha_pedido}</p>
                    <p style="margin: 5px 0; color: #666; font-size: 14px;"><strong>Nº Pedido:</strong> ${data.numero_pedido}</p>
                </div>
            </div>
            <div style="padding: 15px 30px; background: #f8f8f8;">
                <h3 style="margin: 0 0 8px; color: #E8416D; font-size: 16px;">👤 Datos del Cliente</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px 20px; font-size: 14px;">
                    <p style="margin: 3px 0;"><strong>Nombre:</strong> ${data.nombre_cliente}</p>
                    <p style="margin: 3px 0;"><strong>Email:</strong> ${data.email_cliente}</p>
                    <p style="margin: 3px 0;"><strong>Teléfono:</strong> ${data.telefono_cliente}</p>
                    <p style="margin: 3px 0;"><strong>Dirección:</strong> ${data.direccion_cliente}</p>
                </div>
            </div>
            <div style="padding: 20px 30px;">
                <h3 style="margin: 0 0 12px; color: #E8416D; font-size: 16px;">🛒 Detalle del Pedido</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <thead>
                        <tr style="background: #f0f0f0;">
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Producto</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Cant.</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Precio</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productosLista}
                    </tbody>
                    <tfoot>
                        <tr style="background: #FFF3F5; font-weight: bold;">
                            <td colspan="3" style="padding: 12px; border: 1px solid #ddd; text-align: right; font-size: 16px;">Total a pagar:</td>
                            <td style="padding: 12px; border: 1px solid #ddd; text-align: right; color: #E8416D; font-size: 22px;">${data.total}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div style="background: #FFF3F5; padding: 20px 30px; text-align: center; border-top: 2px solid #f0f0f0;">
                <p style="margin: 0; color: #E8416D; font-size: 18px; font-weight: 600;">¡Gracias por tu pedido!</p>
                <p style="margin: 8px 0 0; color: #666; font-size: 14px;">Tu pedido estará listo en aproximadamente 20-30 minutos</p>
                <p style="margin: 5px 0 0; color: #999; font-size: 13px;">🍓¡Te esperamos con la mejor sonrisa y fresas frescas!🍓</p>
            </div>
            <div style="padding: 15px 30px; text-align: center; background: #f8f8f8; color: #999; font-size: 12px; border-top: 1px solid #e0e0e0;">
                <p style="margin: 0;">Le Coin de la Fraise - Dulzura en Cada Bocado</p>
                <p style="margin: 3px 0 0;">📞 Tel:+503 7288-7854| 📧 elrincondelasfresas@gmail.com</p>
            </div>
        </div>
    `;
}

// --- CONFIRMAR PEDIDO ---

document.getElementById('btnConfirmarPedido')?.addEventListener('click', function(e) {
    e.preventDefault();
    
    if (carrito.length === 0) {
        mostrarNotificacion('⚠️ Tu carrito está vacío. Agrega productos primero.');
        return;
    }
    
    const nombre = document.getElementById('nombreCliente').value.trim();
    const email = document.getElementById('emailCliente').value.trim();
    const direccion = document.getElementById('direccionCliente').value.trim();
    const telefono = document.getElementById('telefonoCliente').value.trim();
    
    if (!nombre || !email || !direccion || !telefono) {
        mostrarNotificacion('⚠️ Por favor, completa todos los datos del cliente.');
        return;
    }
    
    if (!validarEmail(email)) {
        mostrarNotificacion('⚠️ Por favor, ingresa un correo electrónico válido.');
        return;
    }
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    const pedidoData = {
        nombre_cliente: nombre,
        email_cliente: email,
        direccion_cliente: direccion,
        telefono_cliente: telefono,
        fecha_pedido: new Date().toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        total: `$${total.toFixed(2)}`,
        numero_pedido: `#${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`
    };
    
    // Mostrar factura en el modal
    const facturaHTML = generarFacturaHTML(pedidoData);
    document.getElementById('modalBodyFactura').innerHTML = facturaHTML;
    document.getElementById('modalFactura').style.display = 'flex';
    
    // Enviar factura por email
    enviarFacturaEmail(pedidoData);
});

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// --- ENVIAR FACTURA POR EMAIL ---

function enviarFacturaEmail(pedidoData) {
    const btnConfirmar = document.getElementById('btnConfirmarPedido');
    const textoOriginal = btnConfirmar.innerHTML;
    btnConfirmar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btnConfirmar.disabled = true;
    
    // Generar tabla de productos en TEXTO PLANO
    let productosTabla = '';
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        const nombreProducto = item.nombre.padEnd(30);
        const cantidad = `x${item.cantidad}`.padEnd(8);
        const precio = `$${item.precio.toFixed(2)}`.padEnd(10);
        const subtotalText = `$${subtotal.toFixed(2)}`;
        productosTabla += `  ${nombreProducto} ${cantidad} ${precio} ${subtotalText}\n`;
    });
    
    const separador = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    const separador2 = '─────────────────────────────────────────────────';
    
    // Construir el mensaje completo
    const mensajeTexto = `

          L E   C O I N   D E   L A   F R A I S E
                Dulzura en Cada Bocado

📄 FACTURA DE PEDIDO
${separador}

📅 Fecha: ${pedidoData.fecha_pedido}
🔢 Nº Pedido: ${pedidoData.numero_pedido}

${separador}

👤 DATOS DEL CLIENTE
${separador2}
Nombre:     ${pedidoData.nombre_cliente}
Email:      ${pedidoData.email_cliente}
Teléfono:   ${pedidoData.telefono_cliente}
Dirección:  ${pedidoData.direccion_cliente}

${separador}

🛒 DETALLE DEL PEDIDO
${separador2}
  Producto                      Cant.   Precio   Subtotal
${productosTabla}
${separador}

💰 TOTAL A PAGAR: ${pedidoData.total}

${separador}

   ¡GRACIAS POR TU PEDIDO!

    Tu pedido estará listo en aproximadamente 20-30 minutos
🍓 ¡Te esperamos con la mejor sonrisa y fresas frescas!🍓

${separador}
Le Coin de la Fraise - Dulzura en Cada Bocado
📞 Tel: +503 7288-7854  | 📧 elrincondelasfresas@gmail.com
`;
    
    // Preparar parámetros para EmailJS
    const templateParams = {
        to_email: pedidoData.email_cliente,
        subject: `🍓 Confirmación de Pedido ${pedidoData.numero_pedido} - Le Coin de la Fraise`,
        mensaje: mensajeTexto
    };
    
    console.log('📧 Enviando factura por email...');
    console.log('📋 Email:', templateParams.to_email);
    
    emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('✅ Correo enviado con éxito:', response);
            mostrarNotificacion('✅ ¡Factura enviada a tu correo!');
            
            carrito = [];
            actualizarCarrito();
            
            document.getElementById('nombreCliente').value = '';
            document.getElementById('emailCliente').value = '';
            document.getElementById('direccionCliente').value = '';
            document.getElementById('telefonoCliente').value = '';
            
            btnConfirmar.innerHTML = textoOriginal;
            btnConfirmar.disabled = false;
            
            setTimeout(() => cerrarModal(), 3000);
        })
        .catch(function(error) {
            console.error('❌ Error al enviar correo:', error);
            mostrarNotificacion('❌ Error al enviar la factura. Verifica tu conexión.');
            
            btnConfirmar.innerHTML = textoOriginal;
            btnConfirmar.disabled = false;
        });
}

// --- FUNCIONES DEL MODAL ---

function cerrarModal() {
    document.getElementById('modalFactura').style.display = 'none';
}

document.getElementById('modalFactura')?.addEventListener('click', function(e) {
    if (e.target === this) {
        cerrarModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        cerrarModal();
    }
});

// --- INICIALIZACIÓN ---

document.addEventListener('DOMContentLoaded', function() {
    actualizarCarrito();
    
    const cards = document.querySelectorAll('.producto-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });
    
    console.log('🍓 Le Coin de la Fraise - Pedidos listo!');
    console.log(`📦 ${carrito.length} productos en el carrito`);
});

console.log('🍓 Le Coin de la Fraise - Pedidos.js cargado correctamente');
console.log('📧 EmailJS configurado con:', EMAILJS_CONFIG);
