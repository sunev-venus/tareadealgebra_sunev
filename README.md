# Proyecto: Encriptador de Cifrado Hill

## **Nombre Completo:** Venus Getsemaní Semino Alemán
## **Grupo:** B
## **Materia:** Fundamentos de Álgebra
## **Docente:** Jorge Javier Pedrozo Romero
## **Cuatrimestre:** 1° - 2025
## **Institución:** Tecnológico de Software

Este proyecto es una aplicación web que implementa el algoritmo de **Cifrado Hill**, un método de criptografía de sustitución poligráfica basado en el álgebra lineal. Permite tanto encriptar como desencriptar mensajes utilizando matrices de 2x2.

---

### *Puedes probar la aplicación funcionando directamente aquí:*
**https://sunev-venus.github.io/tareadealgebra_sunev/**

---

## Descripción del Proyecto
El programa es una interfaz gráfica desarrollada con **HTML, CSS y JavaScript** que permite al usuario visualizar cómo las matemáticas detrás de las matrices pueden ocultar y revelar información.


### Funcionalidades Principales:
1.  **Encriptación:** Convierte texto plano en texto cifrado usando una matriz clave.
2.  **Desencriptación:** Restaura el mensaje original calculando la matriz inversa modular.
3.  **Visualización:** Muestra en tiempo real cómo el texto se convierte en vectores numéricos antes de ser operado.

---

## Lógica Matemática

El núcleo del proyecto se basa en operaciones de matrices sobre un módulo de 26 (el alfabeto inglés).

### 1. El Alfabeto y Módulo
Se utiliza el mapeo estándar donde `A=0`, `B=1`, ..., `Z=25`. Todas las operaciones se realizan en **Módulo 26** (`% 26`).

### 2. Encriptación
La fórmula utilizada es:
$$C = (K \times P) \pmod{26}$$
Donde:
* $C$ = Vector del texto cifrado.
* $K$ = Matriz clave de 2x2 (ingresada por el usuario).
* $P$ = Vector del texto plano (convertido a números).

*Ojo:* Si el mensaje tiene una longitud impar, el sistema agrega automáticamente una letra **'X' (23)** como relleno (padding) para completar el par.

### 3. Desencriptación
Para recuperar el mensaje, implementamos la fórmula:
$$P = (K^{-1} \times C) \pmod{26}$$

El desafío matemático implementado en el código incluye:
* **Cálculo del Determinante:** $det = (ad - bc)$.
* **Inverso Modular:** Se busca un número $x$ tal que $(det \times x) \equiv 1 \pmod{26}$. Si no existe (si el determinante comparte factores con 26), el programa alerta que la matriz no es invertible.
* **Matriz Adjunta:** Se reorganizan los elementos y se cambian signos, aplicando módulo positivo para evitar números negativos en JavaScript.

---

## Personalización y Diseño
Se diseñó una interfaz moderna y limpia ("Clean UI") enfocada en la usabilidad:
* **Feedback Visual:** Si la matriz no es válida, los bordes se tornan rojos y aparece un mensaje de error.
* **Interactividad:** Un contador de caracteres en tiempo real y una vista previa de la matriz del mensaje (`[7, 14]...`) ayudan a entender el proceso interno.
* **Estilos:** Uso de CSS para centrar elementos, sombras suaves y tipografía clara.

---
