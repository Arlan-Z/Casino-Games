const wheel = document.getElementById("wheel");
const root = document.documentElement;

const bet = document.getElementById("bet");
const cash = document.getElementById("cash");

const input = document.querySelectorAll("input")

const btn = document.getElementById("spin-btn");

const moneyText = document.getElementById("money");
var money = localStorage.getItem('money');
if(money){
    money = parseFloat(money);
} else money = 0;
changeMoney(0);

input.forEach((el) => {
    el.addEventListener('input', () => calculate())
})

let angle = 0;
let chance = -1;

let isSpinning = false;

function spin() {
    if(!check()) return;

    var audio = new Audio("sounds/spin.mp3");
    audio.play();

    isSpinning = true;
    angle += Math.round(Math.random() * 360 + 360); 
    root.style.setProperty('--angle', `${angle}deg`);
    wheel.classList.remove("spin");

    void wheel.offsetWidth;

    wheel.classList.add("spin");
    btn.classList.add("disabled");

    wheel.addEventListener('animationend', () => {
        angle = angle % 360;
        wheel.style.transform = `rotate(${angle}deg)`;
        isSpinning = false;
        btn.classList.remove("disabled");
        if((360 - angle % 360) <= (chance * 360)){
            changeMoney(cash.value);
        }
    }, { once: true });
    
}

function calculate(){
    if(bet.value <= 0 || cash.value <= 0) return;
    if(parseInt(bet.value) >= parseInt(cash.value)) return;
    chance = bet.value / cash.value - 0.015;
    chance = chance.toFixed(4);
    root.style.setProperty('--chance', `${chance * 100}%`);
}

function changeMoney(value, sub = 1){
    value = value * sub;
    money = money += value;
    moneyText.innerHTML = money.toFixed(4);
    localStorage.setItem('money', money);
}

function check(){
    if(isSpinning) return false; 
    if(parseInt(bet.value) >= parseInt(cash.value)) return false;
    if(chance >= 1 || chance <= 0) return false;
    if(bet.value > money) return false;
    changeMoney(bet.value, -1);
    return true
}

function addMoney(){
    let amount = prompt("Enter Amount:");
    if (amount == null || amount == "") {
        console.log("operation cancelled");
      } else if(amount != 0){
        console.log(amount + "$ added");
        changeMoney(amount);
      } else{
        console.log("Money resetted to 0");
        changeMoney(money, -1);
      }
}