const field = document.getElementById("field");
const mines = document.getElementById("mines");

const profitField = document.getElementById("profit");
const betField = document.getElementById("bet");

const moneyText = document.getElementById("money");

const betBtn = document.getElementById("bet-btn");

const afterElements = document.querySelectorAll(".after")
const beforeElements = document.querySelectorAll(".before")

var money = localStorage.getItem('money');
if(money){
    money = parseFloat(money);
} else money = 0;
var isLose = false;

var remainingBoxes = 25;
var cash = 0;

changeMoney(0);
for(i = 0; i < 25; i++){
    let box = document.createElement("div");
    box.classList.add("box");
    box.classList.add("disabled");
    field.appendChild(box);
}


function playAnimation(box){
    if(box.isOpened) return;
    box.isOpened = true;

    var audio = new Audio("sounds/click.mp3");
    audio.play();


    img = document.createElement("img");
    if(box.isBomb) {
        img.src = "images/bomb.png";
        box.style.background = "#FF5B61";
        isLose = true;
    }
    else {
        img.src = "images/gem.png";
        box.style.background = "lightgreen";
        increaseCash();
    }

    box.appendChild(img);

    box.classList.remove("active");
    box.classList.add("open");
    if(isLose) gameEnd(); 
    
}

function bet(){
    if(betField.value > money) return;
    changeMoney(betField.value, -1);
    remainingBoxes = 25;
    const boxes = field.children;
    var minesCount = mines.value;
    var boxCnt = 25;
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].classList.add("active");
        boxes[i].classList.remove("disabled");
        boxes[i].innerHTML = "";
        boxes[i].style.background = "rgb(71, 71, 101)";
        boxes[i].isOpened = false;

        if(Math.random() < (minesCount / boxCnt) && minesCount > 0){
            boxes[i].isBomb = true;
            minesCount--;
        } else {
            boxes[i].isBomb = false;
        }
        boxCnt--;

        boxes[i].addEventListener("click", () => playAnimation(boxes[i]));
    }
    betBtn.style.display = "none";
    afterElements.forEach((el) => {
        el.style.display = "block";
    });

    beforeElements.forEach((el) => {
        el.disabled = true;
    });
}

function gameEnd(){
    isLose = false;
    const boxes = field.children;
    profitField.value = 0;
    cash = 0;
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].classList.add("disabled");
        boxes[i].classList.remove("active");
        boxes[i].classList.remove("open");

        if(!boxes[i].isOpened) {
            img = document.createElement("img");
            boxes[i].appendChild(img);
            if(boxes[i].isBomb) {
                img.src = "images/bomb.png";
            }
            else {
                img.src = "images/gem.png";
            }
            boxes[i].firstChild.style.transform = "scale(0.75)";
        }
        boxes[i].isOpened = true;
    }

    betBtn.style.display = "block";

    afterElements.forEach((el) => {
        el.style.display = "none";
    });

    beforeElements.forEach((el) => {
        el.disabled = false;
    });
}

function changeMoney(value, sub = 1){
    value = value * sub;
    money = money += value;
    moneyText.innerHTML = money.toFixed(4);
    localStorage.setItem('money', money);
}

function increaseCash(){
    cash = betField.value * (1 + (mines.value) / (remainingBoxes + 1 - mines.value));
    remainingBoxes--;
    profitField.value = cash.toFixed(4);
    if(remainingBoxes == mines.value) cashout();
}

function cashout(){
    changeMoney(cash);
    gameEnd();
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