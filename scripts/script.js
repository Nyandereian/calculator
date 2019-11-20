const add = (x, y) => x + y;
const subtract = (x, y) => x - y;
const multiply = (x, y) => x * y;
const divide = (x, y) => x / y;

const inputArea = document.querySelector('.input-area');
const backspace = document.querySelector('.backspace');
const output = document.querySelector('.output');
const currentResult = document.querySelector('result');
const clearButton = document.querySelector('.clear-button');
const primaryButtons = document.querySelectorAll('.primary-btn');

const click = new Audio('media/click.mp3');
const cling = new Audio('media/cling.mp3');
const tap = new Audio('media/tap.mp3');
click.volume = 0.02;
cling.volume = 0.02;
tap.volume = 0.01;

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
    const div = document.querySelector(`[data-key*='${e.key}']`);
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
    tap.play();
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
    // error audio
    return;
  }
  tap.play();
  displayInput();
}

function addValue(value) {
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
    //error audio
    return;
  }
  click.play();
  displayInput();
  value='';
}

function displayInput() {
  inputArea.value = input.join(' ') + ' ' + inputItem;
}

function calculate(operator, x, y) {
  return operator(x, y);

  // let answer be automatically copied
};

// implement paste function
