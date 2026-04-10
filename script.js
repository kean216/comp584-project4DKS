// DOM Elements
const currentOperandTextElement = document.getElementById('current-operand');
const previousOperandTextElement = document.getElementById('previous-operand');
const buttons = document.querySelectorAll('.btn');

// State Variables
let currentOperand = '0'; 
let previousOperand = '';
let currentOperation = undefined;

// Core Functions
function clear() {
    currentOperand = '0';
    previousOperand = '';
    currentOperation = undefined;
}

function deleteNumber() {
    if (currentOperand === '0') return;
    currentOperand = currentOperand.toString().slice(0, -1);
    if (currentOperand === '') currentOperand = '0';
}

function appendNumber(number) {
    if (number === '.' && currentOperand.includes('.')) return;
    if (currentOperand === '0') {
        currentOperand = number;
    } else {
        currentOperand = currentOperand.toString() + number.toString();
    }
}

function chooseOperation(operation) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
        compute();
    }
    // Map HTML entities back to raw math operators
    if (operation === '÷') operation = '/';
    if (operation === '×') operation = '*';
    
    currentOperation = operation;
    previousOperand = currentOperand;
    currentOperand = '';
}

function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;

    switch (currentOperation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            // Handle divide by zero gracefully
            computation = current === 0 ? "Error" : prev / current;
            break;
        default:
            return;
    }
    
    currentOperand = computation;
    currentOperation = undefined;
    previousOperand = '';
}

function updateDisplay() {
    currentOperandTextElement.innerText = currentOperand;
    if (currentOperation != null) {
        // Swap raw operators back to nice display characters if needed
        let displayOp = currentOperation;
        if (displayOp === '/') displayOp = '÷';
        if (displayOp === '*') displayOp = '×';
        previousOperandTextElement.innerText = `${previousOperand} ${displayOp}`;
    } else {
        previousOperandTextElement.innerText = '';
    }
}

// Event Listeners
buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.hasAttribute('data-number')) {
            appendNumber(button.innerText);
            updateDisplay();
        } 
        else if (button.dataset.action === 'operator') {
            chooseOperation(button.innerText);
            updateDisplay();
        } 
        else if (button.dataset.action === 'clear') {
            clear();
            updateDisplay();
        } 
        else if (button.dataset.action === 'delete') {
            deleteNumber();
            updateDisplay();
        } 
        else if (button.dataset.action === 'calculate') {
            compute();
            updateDisplay();
        }
    });
});