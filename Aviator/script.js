const animObjects = document.querySelectorAll(".anim");
const plane = document.getElementById("plane");
const line = document.getElementById("line");

const factor = document.getElementById("factor")

const btn = document.getElementById("btn");

const bet = document.getElementById("bet");
const profit = document.getElementById("profit")
const cashoutAt = document.getElementById("cashout-at");

const moneyText = document.getElementById("money");
var money = localStorage.getItem('money');
if(money){
    money = parseFloat(money);
} else money = 0;
changeMoney(0);

let ratio = 0;
let max = 0.50;

let isOut = true;

async function flyAway(){
    isOut = true;
    changeBtnState();
    plane.style.color = "rgb(104, 104, 104)";
    line.style.background = "rgba(255, 255, 255, 0.548)";

    factor.classList.add("lose");
    animObjects.forEach((el) => {
        el.classList.toggle("end");
    });
    await delay(500);

    animObjects.forEach((el) => {
        el.classList.toggle("restart");
    })
    await delay(1000);
    animObjects.forEach((el) => {
        el.classList.toggle("end");
        el.classList.toggle("restart");
    });

    changeBtnState("Bet");
}


async function start(){
    if(!isOut){
        cashout();
        return;
    }
    changeMoney(bet.value, -1);
    isOut = false;
    ratio = 0;
    factor.classList.remove("lose");
    changeBtnState();
    plane.style.color = "rgb(130, 206, 122)";
    line.style.background = "rgba(100, 226, 104, 0.548)";
    await delay(300);
    changeBtnState("Cashout");
    while(ratio <= max){
        if(!isOut) profit.value = (bet.value * ratio).toFixed(2);
        if(ratio >= cashoutAt.value) cashout();
        factor.innerHTML = ratio.toFixed(2) + '<i class="fa-solid fa-xmark"></i>';
        ratio += 0.01
        await delay(100);
    }
    flyAway();
}


function changeBtnState(text = ""){
    if(text == ""){
        btn.disabled = true;
        btn.innerHTML = "Wait";
    }
    else{
        btn.disabled = false;
        btn.innerHTML = text;
    }
}

function cashout(){
    isOut = true;
    changeBtnState();
    changeMoney(profit.value);
    profit.value = "0.00";
}

function changeMoney(value, sub = 1){
    value = value * sub;
    money = money += value;
    moneyText.innerHTML = money.toFixed(4);
    localStorage.setItem('money', money);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}