const field = document.getElementById("field");

for(i = 0; i <= 25; i++){
    let box = document.createElement("div");
    box.classList.add("box");
    box.classList.add("active");

    box.isOpened = false;

    if(Math.random() > 0.5){
        box.isBomb = true;
    } else {
        box.isBomb = false;
    }
    box.addEventListener("click", () => playAnimation(box));
    field.appendChild(box);
}


function playAnimation(box){
    var audio = new Audio("sounds/click.mp3");
    audio.play();

    if(box.isOpened) return;
    box.isOpened = true;
    img = document.createElement("img");
    if(box.isBomb) {
        img.src = "images/bomb.png";
        box.style.background = "#FF5B61";

    }
    else {
        img.src = "images/gem.png";
        box.style.background = "lightgreen";
    }

    box.appendChild(img);

    box.classList.remove("active");
    box.classList.add("open");
    
}