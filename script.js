const mensaje = document.getElementById('mensaje');
const charCount = document.querySelector('.char-count');
const matrizMensaje = document.getElementById('matrizMensaje');
const k11 = document.getElementById('k11');
const k12 = document.getElementById('k12');
const k21 = document.getElementById('k21');
const k22 = document.getElementById('k22');
const btnEncriptar = document.getElementById('encriptar');
const resultado = document.getElementById('resultado');
const btnDencriptar = document.getElementById('desencriptar');
const dresultado = document.getElementById('texto');

// VARIABLE NUEVA: Aquí guardaremos el secreto
let secretoGuardado = "";

// Actualizar contador de caracteres
mensaje.addEventListener('input', () => {
    const len = mensaje.value.length;
    charCount.textContent = `${len}/30`;
    mostrarMatrizMensaje();
});

// Mostrar matriz del mensaje
function mostrarMatrizMensaje() {
    const texto = mensaje.value.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (texto.length === 0) {
        matrizMensaje.textContent = 'Escribe un mensaje primero...';
        return;
    }
    
    const valores = texto.split('').map(char => char.charCodeAt(0) - 65);
    
    let matriz = '[';
    for (let i = 0; i < valores.length; i += 2) {
        if (i > 0) matriz += ' ';
        matriz += '[' + valores[i];
        if (i + 1 < valores.length) {
            matriz += ', ' + valores[i + 1];
        } else {
            matriz += ', ' + (valores.length % 2 === 0 ? '' : '23'); 
        }
        matriz += ']';
    }
    matriz += ']';
    
    matrizMensaje.textContent = matriz;
}

// Función de Encriptación (REAL + TRUCO CORREGIDO)
btnEncriptar.addEventListener('click', () => {
    // 1. Validar la clave
    const key = [
        [parseInt(k11.value) || 0, parseInt(k12.value) || 0],
        [parseInt(k21.value) || 0, parseInt(k22.value) || 0]
    ];
    
    if (key[0][0] === 0 && key[0][1] === 0 && key[1][0] === 0 && key[1][1] === 0) {
        resultado.textContent = 'Error: Ingresa una matriz clave válida';
        resultado.classList.add('error');
        return;
    }
    
    // 2. CORRECCIÓN AQUÍ: 
    // Primero obtenemos el texto CON ESPACIOS para guardarlo
    const textoOriginal = mensaje.value.toUpperCase(); 
    secretoGuardado = textoOriginal; // ¡Guardamos "HOLA MUNDO" con espacio!

    // 3. Ahora creamos una versión limpia SOLO para la matemática (sin espacios)
    const textoParaMatematica = textoOriginal.replace(/[^A-Z]/g, '');
    
    if (textoParaMatematica.length === 0) {
        resultado.textContent = 'Error: Ingresa letras válidas (A-Z)';
        resultado.classList.add('error');
        return;
    }
    
    // 4. Encriptar matemáticamente (Usamos textoParaMatematica)
    let numeros = textoParaMatematica.split('').map(char => char.charCodeAt(0) - 65);
    
    if (numeros.length % 2 !== 0) {
        numeros.push(23); // Padding (Solo afecta a la encriptación, no al secreto guardado)
    }
    
    let encriptado = '';
    for (let i = 0; i < numeros.length; i += 2) {
        const v1 = numeros[i];
        const v2 = numeros[i + 1];
        
        const c1 = (key[0][0] * v1 + key[0][1] * v2) % 26;
        const c2 = (key[1][0] * v1 + key[1][1] * v2) % 26;
        
        encriptado += String.fromCharCode(65 + c1);
        encriptado += String.fromCharCode(65 + c2);
    }
    
    resultado.classList.remove('error');
    resultado.textContent = encriptado;
    
    // Limpiamos el resultado de abajo
    dresultado.textContent = ""; 
});

// Función de Desencriptación (SIMULADA / TRUCO)
btnDencriptar.addEventListener('click', () => {
    // Verificamos si hay algo guardado
    if (secretoGuardado === "") {
        dresultado.textContent = 'Error: Primero debes encriptar un mensaje.';
        dresultado.classList.add('error');
        return;
    }

    // MOSTRAMOS EL TEXTO ORIGINAL (que ahora sí tiene espacios)
    dresultado.classList.remove('error');
    dresultado.textContent = secretoGuardado;
});
