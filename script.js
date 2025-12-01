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
    
    // Agrupar en pares
    let matriz = '[';
    for (let i = 0; i < valores.length; i += 2) {
        if (i > 0) matriz += ' ';
        matriz += '[' + valores[i];
        if (i + 1 < valores.length) {
            matriz += ', ' + valores[i + 1];
        } else {
            matriz += ', ' + (valores.length % 2 === 0 ? '' : '23'); // Padding con 'X'
        }
        matriz += ']';
    }
    matriz += ']';
    
    matrizMensaje.textContent = matriz;
}

// Función de encriptación Hill
btnEncriptar.addEventListener('click', () => {
    // Validar inputs
    const key = [
        [parseInt(k11.value) || 0, parseInt(k12.value) || 0],
        [parseInt(k21.value) || 0, parseInt(k22.value) || 0]
    ];
    
    if (key[0][0] === 0 && key[0][1] === 0 && key[1][0] === 0 && key[1][1] === 0) {
        resultado.textContent = 'Error: Ingresa una matriz clave válida';
        resultado.classList.add('error');
        return;
    }
    
    const texto = mensaje.value.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (texto.length === 0) {
        resultado.textContent = 'Error: Ingresa un mensaje';
        resultado.classList.add('error');
        return;
    }
    
    // Calcular determinante
    const det = (key[0][0] * key[1][1] - key[0][1] * key[1][0]) % 26;
    
    // Convertir texto a números
    let numeros = texto.split('').map(char => char.charCodeAt(0) - 65);
    
    // Agregar padding si es impar
    if (numeros.length % 2 !== 0) {
        numeros.push(23); // 'X'
    }
    
    // Encriptar
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
});

// Función de desencriptación (CORREGIDA)
btnDencriptar.addEventListener('click', () => {
    // 1. Obtener la matriz clave
    const key = [
        [parseInt(k11.value) || 0, parseInt(k12.value) || 0],
        [parseInt(k21.value) || 0, parseInt(k22.value) || 0]
    ];

    const texto = resultado.textContent.toUpperCase().replace(/[^A-Z]/g, '');

    if (texto.length === 0 || resultado.classList.contains('error')) {
        dresultado.textContent = 'Error: Primero debes encriptar un mensaje válido';
        dresultado.classList.add('error');
        return;
    }

    let det = (key[0][0] * key[1][1] - key[0][1] * key[1][0]) % 26;
    det = ((det % 26) + 26) % 26; // Asegurar positivo

    // Encontrar el inverso multiplicativo modular del determinante
    let detInv = -1;
    for (let i = 1; i < 26; i++) {
        if ((det * i) % 26 === 1) {
            detInv = i;
            break;
        }
    }

    if (detInv === -1) {
        dresultado.textContent = 'Error: La matriz no es invertible (Determinante no válido)';
        dresultado.classList.add('error');
        return;
    }

    // Calcular la Matriz Inversa
    const mod = (n) => ((n % 26) + 26) % 26;

    const ik11 = mod(key[1][1] * detInv);      
    const ik12 = mod(-key[0][1] * detInv);   
    const ik21 = mod(-key[1][0] * detInv);     
    const ik22 = mod(key[0][0] * detInv);      

    // Convertir texto cifrado a números
    let numeros = texto.split('').map(char => char.charCodeAt(0) - 65);

    // Padding de seguridad (aunque al venir de encriptar ya debería ser par)
    if (numeros.length % 2 !== 0) {
        numeros.push(23); 
    }

    // Desencriptar multiplicando por la Matriz inversa
    let desencriptado = '';
    for (let i = 0; i < numeros.length; i += 2) {
        const c1 = numeros[i];
        const c2 = numeros[i + 1];

        // Aplicar fórmula: P = K^-1 * C
        const p1 = mod(ik11 * c1 + ik12 * c2);
        const p2 = mod(ik21 * c1 + ik22 * c2);

        desencriptado += String.fromCharCode(65 + p1);
        desencriptado += String.fromCharCode(65 + p2);
    }

    // Mostrar resultado
    dresultado.classList.remove('error');
    dresultado.textContent = desencriptado;
});