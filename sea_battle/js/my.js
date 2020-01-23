'use strict';
var view = {
    displayMessage: function(msg){
        var messageArea = document.querySelector('#messageArea');
        messageArea.innerHTML = msg;
    },
    
    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.className = 'hit';
    },
    
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.className = 'miss';
    }
} 

var model = {
    boardSize: 7,   //размер игрового поля
    numShips: 3,    //количество кораблей в игре
    shipLength: 3,  //длина корабля 
    shipSunk: 0,    //количество потопленных кораблей
    
    ships: [
        { locations: ['0', '0', '0'], hits: ['', '', ''] },
        { locations: ['0', '0', '0'], hits: ['', '', ''] },
        { locations: ['0', '0', '0'], hits: ['', '', ''] }
    ],
        
    fire: function(guess) { //получает координаты выстрела
        for(var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if(index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('HIT!!!');
                if(this.isSunk(ship)) {
                    view.displayMessage('You sank my battleship!');
                    this.shipSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage('You missed!');
        return false;
    },
    
    isSunk: function(ship) {
        for(var i = 0; i < this.shipLength; i++) {
            if(ship.hits[i] !== "hit") 
                return false;
        }
        return true;
    },
	
	generateShipLocations: function() {
		var locations;
		for(var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while(this.collision(locations));
			this.ships[i].locations = locations;
		}
		console.log("Ship array: ");
		console.log(this.ships);
	},
	
	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;
		
		if(direction === 1) {
			//генерация начальной позиции горизонтального корабля
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else {
			//генерация начальной позиции веритикального корабля
			col = Math.floor(Math.random() * this.boardSize);
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		}
		var newShipLocations = [];
		for(var i = 0; i < this.shipLength; i++) {
			if(direction === 1) {
				//добавить позицию для горизонтального корабля
				newShipLocations.push(row + '' + (col + i));
			} else {
				//добавить позицию для веритикального корабля
				newShipLocations.push((row + i) + '' + col);
			}
		}
		return newShipLocations;
	},
	
	collision: function(locations) {
		for(var i = 0; i < this.numShips; i++) {
			var ship = model.ships[i];
			for(var j = 0; j < locations.length; j++) {
				if(ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
};

var controller = {
	gusses: 0,
	
	processGuess: function(guess) {
		var location = parceGuess(guess);
		if(location) {
			this.gusses++;
			var hit = model.fire(location);
			if(hit && model.shipSunk === model.numShips) {
				view.displayMessage(`You have sunk ${model.numShips} the ships in ${this.gusses} shots.`);
			}
		}
	}
}

function parceGuess(guess) {
	var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
	if(guess === 0 || guess.length !== 2) 
		view.displayMessage('Вы ввели неверные координаты');
	else {
		var firstChar = guess.charAt(0); //Извлекаем первый символ
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);
		
		if(isNaN(row) || isNaN(column))
			view.displayMessage('Вы ввели неверные координаты');
		else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize)
			view.displayMessage('Вы ввели неверные координаты');
		else
			return '' + row + column;
	}
	return null;
}

function init() {
	var fireButton = document.getElementById('fireButton');
	fireButton.onclick = handleFireButton;
	
	var guessInput = document.getElementById('guessInput');
	guessInput.onkeyup = handleKeyPress;
	document.onkeypress = null;
	
	model.generateShipLocations();
}

function handleFireButton(e) {
	var guessInput = document.getElementById('guessInput');
	var guess = guessInput.value.toUpperCase();
	controller.processGuess(guess);
	
	guessInput.value = '';
}

function handleKeyPress(event) {
	var fireButton = document.getElementById('fireButton');
	if(event.keyCode == 13) {
		fireButton.click();
		return false;
	}
}

window.onload = init;