const inquirer = require('inquirer');
const math = require('mathjs');

// Definir la función f(x) usando la entrada del usuario
function f(x, functionInput) {
    return math.evaluate(functionInput, { x: x });
}

// Configurar las preguntas para la interfaz interactiva
inquirer.prompt([
    {
        type: 'input',
        name: 'a',
        message: 'Introduce el límite inferior (a):',
        validate: value => !isNaN(value) || 'Por favor, introduce un número válido'
    },
    {
        type: 'input',
        name: 'b',
        message: 'Introduce el límite superior (b):',
        validate: value => !isNaN(value) || 'Por favor, introduce un número válido'
    },
    {
        type: 'input',
        name: 'functionInput',
        message: 'Introduce la función f(x) en términos de x (ejemplo: x^2 o sin(x)):'
    }
]).then(answers => {
    const a = parseFloat(answers.a);
    const b = parseFloat(answers.b);
    const functionInput = answers.functionInput;

    // Calcular la aproximación usando la regla del trapecio
    const I = (b - a) * (f(a, functionInput) + f(b, functionInput)) / 2;

    console.log("La aproximación de la integral es:", I);
});
