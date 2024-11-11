//Elaborado por Jersain Felipe Vázquez Badillo,Ramirez Beltran Gerardo Antonio y Yolanda Salas Calixto,
const express = require('express'); // Framework para crear el servidor
const math = require('mathjs'); // Librería para cálculos matemáticos avanzados
const app = express(); // Crear una instancia de la aplicación Express
const port = process.env.PORT || 3000; // Puerto en el que se ejecutará el servidor

// Configuración para servir archivos estáticos (por ejemplo, CSS)
app.use(express.static(__dirname));

// Ruta raíz para mostrar el formulario inicial al usuario
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Calculadora de Integral</title>
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>
            <div class="formula">
                <p>Fórmula Trapecio Simple: I ≈ (b - a) * [f(a) + f(b)] / 2</p>
                <p>Fórmula Trapecio Compuesto: I ≈ (b - a) / (2n) * [f(a) + 2Σf(x_i) + f(b)]</p>
            </div>
            
            <div class="container">
                <div class="portada">
                    <h1>Proyecto de Cálculo de Integral por Regla del Trapecio</h1>
                    <p>Elaborado por:</p>
                    <p><strong>Jersain Felipe Vázquez Badillo</strong></p>
                    <p><strong>Ramirez Beltran Gerardo Antonio</strong></p>
                    <p><strong>Yolanda Salas Calixto</strong></p>
                    <button onclick="document.getElementById('formulario').style.display='block'; this.style.display='none'">Ingresar</button>
                </div>
                
                <div id="formulario" style="display:none;">
                    <h2>Calculadora de Integral</h2>
                    <form action="/calcular" method="POST">
                        <!-- Inputs para ingresar los datos necesarios -->
                        <label for="a">Límite inferior (a):</label>
                        <input type="number" name="a" step="any" required><br>
                        <label for="b">Límite superior (b):</label>
                        <input type="number" name="b" step="any" required><br>
                        <label for="functionInput">Función f(x):</label>
                        <input type="text" name="functionInput" required><br>
                        <label for="n">Número de subintervalos (n):</label>
                        <input type="number" name="n" step="1" required><br>
                        <button type="submit">Calcular</button>
                    </form>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Ruta para procesar el formulario y calcular las integrales
app.post('/calcular', express.urlencoded({ extended: true }), (req, res) => {
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
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Resultado</title>
            <link rel="stylesheet" href="styles.css">
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        </head>
        <body>
            <div class="container">
                <h1>Resultado</h1>
                <p>La aproximación de la integral (trapecio simple) es: ${I_simple}</p>
                <p>La aproximación de la integral (trapecio compuesto) es: ${I_compuesta}</p>
                <canvas id="functionChart" width="400" height="200"></canvas>
                <script>
                    // Configuración del gráfico con los datos calculados
                    const ctx = document.getElementById('functionChart').getContext('2d');
                    const chart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            datasets: [{
                                label: 'f(x) = ${functionInput}',
                                data: ${JSON.stringify(points)},
                                borderColor: 'rgba(0, 123, 255, 1)',
                                borderWidth: 2,
                                fill: false
                            },
                            {
                                label: 'Trapecios Compuestos',
                                data: ${JSON.stringify(trapezoidPoints)},
                                borderColor: 'rgba(255, 99, 132, 1)',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                borderWidth: 1,
                                fill: true,
                                tension: 0 // Mantener las líneas rectas
                            }]
                        },
                        options: {
                            scales: {
                                x: {
                                    type: 'linear',
                                    position: 'bottom'
                                },
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                </script>
                <a href="/" style="display: inline-block; margin-top: 20px; color: #007bff; text-decoration: none;">Calcular otra vez</a>
            </div>
        </body>
        </html>
    `);
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});