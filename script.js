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

// Encriptación Hill
btnEncriptar.addEventListener('click', () => {
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
    
    const det = (key[0][0] * key[1][1] - key[0][1] * key[1][0]) % 26;
    
    let numeros = texto.split('').map(char => char.charCodeAt(0) - 65);
    
    if (numeros.length % 2 !== 0) {
        numeros.push(23);
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
});

// Desencriptación Hill
btnDencriptar.addEventListener('click', () => {
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
    det = ((det % 26) + 26) % 26;

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

    const mod = (n) => ((n % 26) + 26) % 26;

    const ik11 = mod(key[1][1] * detInv);
    const ik12 = mod(-key[0][1] * detInv);
    const ik21 = mod(-key[1][0] * detInv);
    const ik22 = mod(key[0][0] * detInv);

    let numeros = texto.split('').map(char => char.charCodeAt(0) - 65);

    if (numeros.length % 2 !== 0) {
        numeros.push(23);
    }

    let desencriptado = '';
    for (let i = 0; i < numeros.length; i += 2) {
        const c1 = numeros[i];
        const c2 = numeros[i + 1];

        const p1 = mod(ik11 * c1 + ik12 * c2);
        const p2 = mod(ik21 * c1 + ik22 * c2);

        desencriptado += String.fromCharCode(65 + p1);
        desencriptado += String.fromCharCode(65 + p2);
    }

    if (desencriptado.endsWith('X')) {
        desencriptado = desencriptado.slice(0, -1);
    }

    dresultado.classList.remove('error');
    dresultado.textContent = desencriptado;
});


// ======================================================
//   ⬇️ AQUI SE AGREGA *SOLO LA LÓGICA* DEL SEGUNDO CÓDIGO
// ======================================================

class NumeroComplejo {
    constructor(real, imag = 0) {
        this.real = real;
        this.imag = imag;
    }

    sumar(otro) {
        return new NumeroComplejo(this.real + otro.real, this.imag + otro.imag);
    }

    multiplicar(otro) {
        return new NumeroComplejo(
            this.real * otro.real - this.imag * otro.imag,
            this.real * otro.imag + this.imag * otro.real
        );
    }

    toString() {
        if (Math.abs(this.imag) < 1e-10) return Number(this.real.toFixed(4)).toString();
        
        const r = Number(this.real.toFixed(4));
        const i = Math.abs(this.imag).toFixed(4);
        const signo = this.imag >= 0 ? '+' : '-';
        
        if (Math.abs(this.real) < 1e-10) 
            return `${this.imag < 0 ? '-' : ''}${Number(i)}i`;
        
        return `${r} ${signo} ${Number(i)}i`;
    }
}

function parsearPolinomio(str) {
    str = str.replace(/\s+/g, '').replace(/-/g, '+-');
    if(str.startsWith('+-')) str = str.substring(1);
    
    const terminos = str.split('+');
    let coeficientesMap = {};
    let gradoMax = 0;

    terminos.forEach(term => {
        if(!term) return;
        let coef = 1, exp = 0;
        
        if(term.includes('x')) {
            const parts = term.split('x');
            if(parts[0] === '' || parts[0] === '+') coef = 1;
            else if(parts[0] === '-') coef = -1;
            else coef = parseFloat(parts[0]);

            if(parts[1].includes('^')) exp = parseInt(parts[1].replace('^', ''));
            else exp = 1;
        } else {
            coef = parseFloat(term);
            exp = 0;
        }

        if(exp > gradoMax) gradoMax = exp;
        coeficientesMap[exp] = new NumeroComplejo(coef);
    });

    let coefsArr = [];
    for(let i = gradoMax; i >= 0; i--) {
        coefsArr.push(coeficientesMap[i] || new NumeroComplejo(0));
    }
    
    return coefsArr;
}

function divisionSintetica(coeficientes, raiz) {
    let resultado = [];
    let procesoMultiplicacion = [];
    
    let actual = coeficientes[0];
    resultado.push(actual);
    procesoMultiplicacion.push(new NumeroComplejo(0));

    for (let i = 1; i < coeficientes.length; i++) {
        let mult = resultado[i-1].multiplicar(raiz);
        procesoMultiplicacion.push(mult);
        
        let suma = coeficientes[i].sumar(mult);
        resultado.push(suma);
    }

    return {
        coefs: coeficientes,
        mults: procesoMultiplicacion,
        res: resultado,
        raiz: raiz
    };
}

