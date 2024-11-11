const express = require('express');
const math = require('mathjs');

const app = express();
app.use(express.urlencoded({ extended: true }));

// Ruta para procesar el formulario y calcular las integrales
app.post('/calcular', (req, res) => {
    const a = parseFloat(req.body.a); // Límite inferior
    const b = parseFloat(req.body.b); // Límite superior
    const functionInput = req.body.functionInput; // Función ingresada por el usuario
    const n = parseInt(req.body.n); // Número de subintervalos

    // Definir la función f(x) a partir de la entrada del usuario
    function f(x) {
        return math.evaluate(functionInput, { x: x });
    }

    // Cálculo de la integral usando el método del trapecio simple
    const I_simple = (b - a) * (f(a) + f(b)) / 2;

    // Cálculo de la integral usando el método del trapecio compuesto
    const h = (b - a) / n; // Ancho de cada subintervalo
    let I_compuesta = 0.5 * (f(a) + f(b)); // Iniciar con los extremos

    // Array para almacenar los puntos de los trapecios
    const trapezoidPoints = [];

    // Iterar sobre los puntos intermedios
    for (let i = 1; i < n; i++) {
        const x_i = a + i * h;
        I_compuesta += f(x_i); // Sumar f(x_i) al resultado
        // Agregar puntos para la representación gráfica
        trapezoidPoints.push({ x: a + (i - 1) * h, y: f(a + (i - 1) * h) });
        trapezoidPoints.push({ x: x_i, y: f(x_i) });
        trapezoidPoints.push({ x: x_i, y: f(x_i) });
        trapezoidPoints.push({ x: a + i * h, y: f(a + i * h) });
    }

    I_compuesta *= h; // Ajustar por el ancho de los subintervalos

    // Generar puntos para la gráfica de la función
    const points = [];
    const step = (b - a) / 100; // Intervalo para mayor resolución
    for (let x = a; x <= b; x += step) {
        points.push({ x: x, y: f(x) });
    }

    // Enviar el resultado al cliente
    res.json({
        I_simple: I_simple,
        I_compuesta: I_compuesta,
        points: points,
        trapezoidPoints: trapezoidPoints,
    });
});

module.exports = app;