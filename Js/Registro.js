const EMAILJS_CONFIG = {
   PUBLIC_KEY: 'KPaDsXunSjxvhWeCo',   
   SERVICE_ID: 'service_4qpc91j',     
   TEMPLATE_ID: 'template_msvonlr', 
};

// Inicializar EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

// ========== ELEMENTOS DEL DOM ==========
const form = document.getElementById('registroForm');
const btnRegistro = document.getElementById('btnRegistro');
const mensajeExito = document.getElementById('mensajeExito');

// ========== FUNCIÓN PARA MOSTRAR ERRORES ==========
function mostrarError(inputId, mensaje) {
    const errorElement = document.getElementById(`error-${inputId}`);
    if (errorElement) {
        errorElement.textContent = mensaje;
    }
    const input = document.getElementById(inputId);
    if (input) {
        input.style.borderColor = '#e74c3c';
    }
}

function limpiarError(inputId) {
    const errorElement = document.getElementById(`error-${inputId}`);
    if (errorElement) {
        errorElement.textContent = '';
    }
    const input = document.getElementById(inputId);
    if (input) {
        input.style.borderColor = '';
    }
}

function limpiarTodosErrores() {
    const campos = ['nombre', 'email', 'telefono', 'direccion'];
    campos.forEach(campo => limpiarError(campo));
}

// ========== VALIDACIONES ==========
function validarNombre(nombre) {
    if (!nombre.trim()) {
        mostrarError('nombre', 'El nombre es obligatorio');
        return false;
    }
    if (nombre.trim().length < 3) {
        mostrarError('nombre', 'El nombre debe tener al menos 3 caracteres');
        return false;
    }
    if (!/^[a-zA-ZáéíóúñÑüÜ\s]+$/.test(nombre.trim())) {
        mostrarError('nombre', 'El nombre solo puede contener letras y espacios');
        return false;
    }
    limpiarError('nombre');
    return true;
}

function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
        mostrarError('email', 'El correo electrónico es obligatorio');
        return false;
    }
    if (!emailRegex.test(email.trim())) {
        mostrarError('email', 'Ingresa un correo electrónico válido (ejemplo@correo.com)');
        return false;
    }
    limpiarError('email');
    return true;
}

function validarTelefono(telefono) {
    const telefonoLimpio = telefono.trim().replace(/[-\s]/g, '');
    if (!telefonoLimpio) {
        mostrarError('telefono', 'El teléfono es obligatorio');
        return false;
    }
    if (!/^[0-9]{8,}$/.test(telefonoLimpio)) {
        mostrarError('telefono', 'Ingresa un número de teléfono válido (mínimo 8 dígitos)');
        return false;
    }
    limpiarError('telefono');
    return true;
}

function validarDireccion(direccion) {
    if (!direccion.trim()) {
        mostrarError('direccion', 'La dirección es obligatoria');
        return false;
    }
    if (direccion.trim().length < 5) {
        mostrarError('direccion', 'La dirección debe tener al menos 5 caracteres');
        return false;
    }
    limpiarError('direccion');
    return true;
}

// ========== FUNCIÓN PARA ENVIAR CORREO CON EMAILJS ==========
async function enviarCorreo(datosCliente) {
    const templateParams = {
        nombre: datosCliente.nombre,
        email: datosCliente.email,
        telefono: datosCliente.telefono,
        direccion: datosCliente.direccion,
        intereses: datosCliente.intereses,
        mensaje: datosCliente.mensaje || 'Sin mensaje adicional',
        fecha_registro: new Date().toLocaleString('es-ES')
    };

    try {
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        );
        console.log('Correo enviado exitosamente:', response);
        return true;
    } catch (error) {
        console.error('Error al enviar correo:', error);
        return false;
    }
}

// ========== FUNCIÓN PARA GUARDAR EN LOCALSTORAGE ==========
function guardarEnLocalStorage(datosCliente) {
    const clientes = JSON.parse(localStorage.getItem('clientesLeCoin') || '[]');
    const nuevoCliente = {
        ...datosCliente,
        id: Date.now(),
        fecha_registro: new Date().toISOString()
    };
    clientes.push(nuevoCliente);
    localStorage.setItem('clientesLeCoin', JSON.stringify(clientes));
    console.log('Cliente guardado en localStorage');
}

// ========== FUNCIÓN PRINCIPAL DEL FORMULARIO ==========
async function manejarSubmit(event) {
    event.preventDefault();
    
    // Limpiar mensaje de éxito anterior
    mensajeExito.style.display = 'none';
    
    // Obtener valores
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const interesesSelect = document.getElementById('intereses');
    const intereses = interesesSelect.options[interesesSelect.selectedIndex].text;
    const mensaje = document.getElementById('mensaje').value;
    
    // Validar todos los campos
    const esNombreValido = validarNombre(nombre);
    const esEmailValido = validarEmail(email);
    const esTelefonoValido = validarTelefono(telefono);
    const esDireccionValida = validarDireccion(direccion);
    
    if (!esNombreValido || !esEmailValido || !esTelefonoValido || !esDireccionValida) {
        return;
    }
    
    // Deshabilitar botón mientras se procesa
    btnRegistro.disabled = true;
    const textoOriginal = btnRegistro.innerHTML;
    btnRegistro.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Registrando...';
    
    const datosCliente = {
        nombre: nombre.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        direccion: direccion.trim(),
        intereses: intereses,
        mensaje: mensaje.trim()
    };
    
    // Guardar en localStorage
    guardarEnLocalStorage(datosCliente);
    
    // Enviar correo con EmailJS
    const correoEnviado = await enviarCorreo(datosCliente);
    
    // Restaurar botón
    btnRegistro.disabled = false;
    btnRegistro.innerHTML = textoOriginal;
    
    if (correoEnviado) {
        // Mostrar mensaje de éxito
        mensajeExito.style.display = 'flex';
        
        // Limpiar formulario
        form.reset();
        limpiarTodosErrores();
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            mensajeExito.style.display = 'none';
        }, 5000);
        
        // Scroll suave al mensaje de éxito
        mensajeExito.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        alert('⚠️ Hubo un problema al enviar el registro. Por favor, verifica tu conexión o contacta con soporte.');
    }
}

// ========== VALIDACIÓN EN TIEMPO REAL ==========
function setupValidacionTiempoReal() {
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
    const direccionInput = document.getElementById('direccion');
    
    if (nombreInput) {
        nombreInput.addEventListener('blur', () => validarNombre(nombreInput.value));
        nombreInput.addEventListener('input', () => validarNombre(nombreInput.value));
    }
    
    if (emailInput) {
        emailInput.addEventListener('blur', () => validarEmail(emailInput.value));
        emailInput.addEventListener('input', () => validarEmail(emailInput.value));
    }
    
    if (telefonoInput) {
        telefonoInput.addEventListener('blur', () => validarTelefono(telefonoInput.value));
        telefonoInput.addEventListener('input', () => validarTelefono(telefonoInput.value));
    }
    
    if (direccionInput) {
        direccionInput.addEventListener('blur', () => validarDireccion(direccionInput.value));
        direccionInput.addEventListener('input', () => validarDireccion(direccionInput.value));
    }
}

// ========== VERIFICAR CONFIGURACIÓN DE EMAILJS ==========
function verificarConfiguracionEmailJS() {
    const configValida = EMAILJS_CONFIG.PUBLIC_KEY !== 'KPaDsXunSjxvhWeCo' &&
                        EMAILJS_CONFIG.SERVICE_ID !== 'service_4qpc91j' &&
                        EMAILJS_CONFIG.TEMPLATE_ID !== 'template_msvonlr';
    
    if (!configValida) {
        console.warn('⚠️ EmailJS no está configurado. Reemplaza las variables en EMAILJS_CONFIG con tus credenciales.');
        console.log('📧 Para usar EmailJS:');
        console.log('   1. Ve a https://www.emailjs.com/ y regístrate');
        console.log('   2. Obtén tu Public Key en el menú "Account"');
        console.log('   3. Crea un nuevo servicio de correo (Gmail, Outlook, etc.)');
        console.log('   4. Crea una plantilla de correo con las variables necesarias');
    } else {
        console.log('✅ EmailJS configurado correctamente');
    }
}

// ========== INICIALIZACIÓN ==========
function init() {
    if (form) {
        form.addEventListener('submit', manejarSubmit);
        setupValidacionTiempoReal();
    }
    verificarConfiguracionEmailJS();
    console.log("🍓 Le Coin de la Fraise - Página de registro cargada correctamente");
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
