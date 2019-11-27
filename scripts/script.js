const inputArea = document.querySelector('.input-area');
const backspace = document.querySelector('.backspace');
const output = document.querySelector('.output');
const currentResult = document.querySelector('.result');
const clearButton = document.querySelector('.clear-button');
const primaryButtons = document.querySelectorAll('.primary-btn');

const click = new Audio('media/click.mp3');
const cling = new Audio('media/cling.mp3');
const tap = new Audio('media/tap.mp3');
click.volume = 0.06;
cling.volume = 0.06;
tap.volume = 0.03;

// variables
let input = [];
let inputItem = '';

// eventlisteners
primaryButtons.forEach(button => {
  button.addEventListener('click', e => addValue(e.target.value));
});

window.addEventListener('keydown', e => {
  if(e.key == 'Backspace') {
    deleteLast();
  } else {
    const div = document.querySelector(`[data-key~='${e.key}']`);
    if(!div) return;
    const btn = div.querySelector('button');
    addValue(btn.value);
  }
});

backspace.addEventListener('click', () => {
  deleteLast()
});

clearButton.addEventListener('click', () => {
  input = [];
  inputItem = '';
  displayInput();
  const outputs = document.querySelectorAll('.output p');
  outputs.forEach(p => {
    if(p.getAttribute('class') != 'result') {
      output.removeChild(p);
    } else {
      p.textContent='=';
      p.style.visibility = 'hidden';
    }
    tap.currentTime = 0;
    tap.play();
    clearButton.blur();
  })
});

// functions

function deleteLast() {
  if(inputItem) {
    inputItem = inputItem.substring(0, inputItem.length - 1);
  } else if(input.length > 0) {
    inputItem = input.pop();
    copy = inputItem;
    inputItem = inputItem.substring(0, inputItem.length - 1);
    if(!inputItem && copy == '/' || copy == 'X' || copy == '+' || copy =='-') {
      inputItem = input.pop();
    }
  } else {
    cling.currentTime = 0;
    cling.play();
    return;
  }
  tap.play();
  displayInput();
  updateResult();
}

function addValue(value) {
  if(value == '=') {
    if(inputItem.length > 1 || inputItem.length == 1 && !isNaN(inputItem)) {
      addResult();
      return;
    }
    return;
  }
  currentResult.style.visibility = 'visible';
  let prevValue = input[input.length - 1] || NaN;
  if(value == '-' && !inputItem) {
    inputItem += value;
  } else if(value == '.' && !inputItem.includes('.')) {
    inputItem += value;
  } else if(!isNaN(value)) {
    inputItem += value;
  } else if(isNaN(value) && value != '.' && inputItem != '' &&
            inputItem != '.' && inputItem != '-') {
    input.push(inputItem);
    inputItem = '';
    input.push(value);
  } else {
    cling.currentTime = 0;
    cling.play();
    return;
  }
  click.play();
  displayInput();
  value='';

  updateResult();
}

function addResult() {
  result = calculate();
  const p = document.createElement('p');
  input.push(inputItem);
  p.textContent = input.join(' ') + ' = ' + result;
  output.insertBefore(p, currentResult.nextSibling);
  if(output.childElementCount > 4) output.removeChild(output.lastElementChild);
  input = [];
  inputItem = '';
  currentResult.style.visibility = 'hidden';
  displayInput();
}

function updateResult() {
  currentResult.textContent = '= ' + calculate();
}

function displayInput() {
  inputArea.value = input.join(' ') + ' ' + inputItem;
}

const add = (x, y) => +x + +y;
const subtract = (x, y) => x - y;
const multiply = (x, y) => x * y;
const divide = (x, y) => x / y;

function calculate() {
  let copyInput = input.slice(0);
  copyInput.push(inputItem);
  let result = copyInput[0];
  while(copyInput.includes("X") || copyInput.includes("/")) {
    copyInput.forEach((entry, index) => {
      if(entry == 'X' || entry == '/') {
        let x = copyInput[index - 1];
        let y = copyInput[index + 1];
        result = (entry == 'X') ? multiply(x, y) : divide(x, y);
        copyInput.splice(index - 1, 3, result);
      }
    });
  }

  while(copyInput.includes("+") || copyInput.includes("-")) {
    copyInput.forEach((entry, index) => {
      if(entry == '+' || entry == '-') {
        let x = copyInput[index - 1];
        let y = copyInput[index + 1];
        result = (entry == '+') ? add(x, y) : subtract(x, y);
        copyInput.splice(index - 1, 3, result);
      }
    });
  }

  return result;
}
