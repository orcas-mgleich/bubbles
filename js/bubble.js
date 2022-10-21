let lastId = 0;
let speed = 0.2;
let time = 10;
let createInterval = null;
let moveInterval = null;
let speedInterval = null;
let legendInterval = null;

function init() {
    createInterval = setInterval(function() { createBubble(); }, 2000);
    moveInterval = setInterval(function() { moveBubble(); }, 20);
    speedInterval = setInterval(function() { speedUp(); }, 10000);
    legendInterval = setInterval(function() { legendUpdate(); }, 1000);
}

function lost() {
    clearInterval(createInterval);
    clearInterval(moveInterval);
    clearInterval(speedInterval);
    clearInterval(legendInterval);
    let endDiv = document.getElementById('result');
    endDiv.style.display = 'block';
}

function speedUp() {
    speed += 0.2;
    time = 10;
}

function legendUpdate() {
    time -= 1;
    let timeElement = document.getElementById('time');
    timeElement.innerText = parseInt(time) + 's';
    let speedElement = document.getElementById('speed');
    speedElement.innerText = parseInt(speed * 5 + "") + "";
}

function createBubble() {
    let max = window.innerWidth - 150;
    const min = 1;
    lastId = lastId + 1;

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.setAttribute('id', lastId);
    bubble.style.left = (Math.random()*(max-min)+min) +"px";
    let size = Math.random()*100;
    bubble.style.width = bubble.style.height = (size < 10 ? 10 : size) +"px";
    bubble.style.top = window.innerHeight - parseInt(bubble.style.width) - 3 +"px";
    bubble.style.background = randomColor();
    bubble.style.cursor = 'pointer';
    bubble.style.border = '1px solid black';
    bubble.onclick = removeBubble;
    document.body.appendChild(bubble);
}

function randomColor() {
    let possibleCharacters = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];
    let color = "#";
    let c = 0;
    while(c < 8) {
        color += possibleCharacters[Math.floor(Math.random()*16)];
        c++;
    }
    return color;
}

function removeBubble() {
    document.body.removeChild(this);
}

function moveBubble() {
    let allBubbles = document.getElementsByClassName("bubble");
    let b =  0;
    while(b < allBubbles.length) {
        let topValue =  allBubbles[b].style.top;
        topValue = parseFloat(topValue);
        topValue = topValue - speed;
        if (topValue <= 0) {
            lost();
        }
        allBubbles[b].style.top = topValue + "px";
        b++;
    }
}
