let lastId = 0;
let speed = 1;
let time = 10;
let hits = 0;
let points = 0;
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

function highscore(data) {
    let rows = JSON.parse(data);
    let table = "" +
        "  <table id=\"highscoreTable\">\n" +
        "    <thead>\n" +
        "      <tr>\n" +
        "        <th>Platz</th>\n" +
        "        <th>Punkte</th>\n" +
        "        <th>Vorname</th>\n" +
        "        <th>Nachname</th>\n" +
        "        <th></th>\n" +
        "      </tr>\n" +
        "    </thead>\n" +
        "    <tbody>\n";
    let foundedRow = -1;
    let pos = 1;
    for (let r=0; r <= rows.length; r++) {
        let row = r === rows.length && foundedRow < 0 ? { 'points': 0 } : rows[r];
        if (foundedRow < 0 && row['points'] <= points) {
            foundedRow = r;
            if (row['points'] < points) {
                table += "" +
                    "      <tr class='input'>\n" +
                    "        <td>" + pos + "</td>\n" +
                    "        <td>" + points + "</td>\n" +
                    "        <td><input type='text' id='firstname' name='firstname'></td>\n" +
                    "        <td><input type='text' id='lastname' name='lastname'></td>\n" +
                    "        <td><input type='button' value='Speichern' onclick='save()'></td>\n" +
                    "      </tr>\n";
            }
        }
        if(r < rows.length) {
            table += "" +
                "      <tr" + (foundedRow === r ? " class='current'" : "") + ">\n" +
                "        <td>" + pos + "</td>\n" +
                "        <td>" + row['points'] + "</td>\n" +
                "        <td>" + row['firstname'] + "</td>\n" +
                "        <td>" + row['lastname'] + "</td>\n" +
                "        <td></td>\n" +
                "      </tr>\n";
        }
        if (pos > 10) {
            break;
        }
        pos++;
    }
    table += "" +
        "    </tbody>\n" +
        "  </table>";
    document.getElementById("highscore").innerHTML = table;

    let endDiv = document.getElementById('result');
    endDiv.style.display = 'block';
}

function save() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        highscore(this.responseText);
    }
    xhttp.open("GET", "bubble.php?action=save" +
        "&points=" + points +
        "&firstname=" + document.getElementById('firstname').value +
        "&lastname=" + document.getElementById('lastname').value, true);
    xhttp.send();
}

function lost() {
    clearInterval(createInterval);
    clearInterval(moveInterval);
    clearInterval(speedInterval);
    clearInterval(legendInterval);

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        highscore(this.responseText);
    }
    xhttp.open("GET", "bubble.php?points=" + points, true);
    xhttp.send();
}

function speedUp() {
    speed += 0.2;
    time = 10;
}

function legendUpdate() {
    time -= 1;
    points = (hits * 1000) + (speed * 5 * 10) + (10 - time);
    let timeElement = document.getElementById('time');
    timeElement.innerText = parseInt(time) + 's';
    let speedElement = document.getElementById('speed');
    speedElement.innerText = parseInt(speed * 5 + "") + "";
    let pointsElement = document.getElementById('points');
    pointsElement.innerText = parseInt(points + "") + "";
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
    hits++;
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
