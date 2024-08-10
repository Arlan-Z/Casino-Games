const animObjects = document.querySelectorAll(".anim");
const plane = document.getElementById("plane");
const line = document.getElementById("line");

const factor = document.getElementById("factor")

const btn = document.getElementById("btn");

const bet = document.getElementById("bet");
const profit = document.getElementById("profit")
const cashoutAt = document.getElementById("cashout-at");

const inputs = document.querySelectorAll(".input")

const moneyText = document.getElementById("money");
var money = localStorage.getItem('money');
if(money){
    money = parseFloat(money);
} else money = 0;
changeMoney(0);

let ratio = 1;
let max = 0;

let isOut = true;

async function flyAway(){
    profit.value = "0.00";
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

    inputs.forEach((el) => {el.disabled = false;});
    changeBtnState("Bet");
}


async function start(){
    if(bet.value <= 0 || (cashoutAt.value < 1 && cashoutAt.value != "") || (bet.value > money && isOut)) return;
    if(!isOut){
        cashout();
        return;
    }
    let del = 300;

    inputs.forEach((el) => {el.disabled = true;});

    changeMoney(bet.value, -1);
    isOut = false;
    ratio = 1;
    factor.classList.remove("lose");
    changeBtnState();
    plane.style.color = "rgb(130, 206, 122)";
    line.style.background = "rgba(100, 226, 104, 0.548)";

    max = await unsafeSimulateResult(generateGameHash());
    factor.innerHTML = ratio.toFixed(2) + '<i class="fa-solid fa-xmark"></i>';

    await delay(300);
    changeBtnState("Cashout");
    while(ratio < max){
        if(!isOut) profit.value = (bet.value * ratio).toFixed(2);
        if(ratio >= cashoutAt.value && cashoutAt.value != "") cashout();
        factor.innerHTML = ratio.toFixed(2) + '<i class="fa-solid fa-xmark"></i>';
        ratio += 0.01
        del = del * 0.99;
        await delay(1 + del);
    }
    flyAway();
}


function changeBtnState(text = ""){
    btn.disabled = !text; 
    btn.innerHTML = text || "Wait"; 
}

function generateGameHash(){
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);
  
    let gameHash = '';
    for (let i = 0; i < randomBytes.length; i++) {
      gameHash += randomBytes[i].toString(16).padStart(2, '0');
    }
  
    return gameHash;
}

function unsafeSimulateResult(gameHash) {
    let h = gameHash + "";  
    let hNum = parseInt(h.substring(0, 13), 16);
  
    if (hNum % 5 === 0) {
      return 1;
    }
  
    const e = Math.pow(2, 52); 
    return (((100 * e - hNum) / (e - hNum)) / 100);
}

function cashout(){
    isOut = true;
    changeBtnState();
    changeMoney(profit.value);
    profit.value = "0.00";

    inputs.forEach((el) => {el.disabled = false;});
}

function changeMoney(value, sub = 1){
    value = value * sub;
    money = money += value;
    moneyText.innerHTML = money.toFixed(4);
    localStorage.setItem('money', money);
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

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}