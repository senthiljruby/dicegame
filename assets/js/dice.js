let playerCount = 0;
let players = [];
let playerWins = {};
let winPercentageBarChart = null; // Initialize the chart variable
let winPercentagePieChart = null; // Initialize the chart variable


// Function to initialize the game
function initialize() {
    players = [];
    playerWins = {};
    document.querySelectorAll('.dice').forEach(e => e.remove());

    setTimeout(() => {
        getPlayerCount();
    }, 100);
}

// Function to get the number of players from the user
function getPlayerCount() {
    playerCount = parseInt(prompt("Enter how many players?"));

    if (isNaN(playerCount)) {
        alert("Please enter a number for the player count!");
        getPlayerCount();
    } else {
        createPlayers();
    }
}

// Function to create player objects
function createPlayers() {
    for (let i = 1; i <= playerCount; i++) {
        const playerName = prompt(`Enter Player ${i} name`);
        players.push(playerName);
        playerWins[playerName] = 0;
        createPlayerElement(playerName, i);
    }
}

// Function to create a player element
function createPlayerElement(playerName, index) {
    const diceDiv = document.createElement('div');
    diceDiv.classList.add('dice');

    const playerParagraph = document.createElement('p');
    playerParagraph.classList.add(`Player_${index}`);
    playerParagraph.textContent = playerName;

    const imageElement = document.createElement('img');
    imageElement.classList.add(`img_${index}`);
    imageElement.setAttribute('src', 'assets/img/dice6.png');

    diceDiv.appendChild(playerParagraph);
    diceDiv.appendChild(imageElement);

    const container = document.querySelector('.dice-container');
    container.appendChild(diceDiv);
}

// Function to roll the dice and determine the winner
function rollTheDice() {
    const randomNumber = [];
    const diceImages = document.querySelectorAll('.dice img');

    diceImages.forEach((image, index) => {
        const generatedRandomNumber = Math.floor(Math.random() * 6) + 1;
        image.setAttribute('src', `assets/img/dice${generatedRandomNumber}.png`);
        randomNumber.push(generatedRandomNumber);
    });

    setTimeout(() => {
        determineWinner(randomNumber, diceImages);
    }, 100);
}

// Function to determine the winner(s) based on the highest rolled number
function determineWinner(randomNumber, diceImages) {
    const maxRandomNumber = Math.max(...randomNumber);
    const winners = [];

    randomNumber.forEach((number, index) => {
        if (number === maxRandomNumber) {
            winners.push(players[index]);
            diceImages[index].classList.add('winner');
            playerWins[players[index]]++;
        } else {
            diceImages[index].classList.remove('winner');
        }
    });

    const h1Element = document.querySelector('h1');

    if (winners.length === playerCount) {
        h1Element.innerHTML = `🏆 It's a tie between ${winners.join(', ')}! 🏆`;
    } else {
        h1Element.innerHTML = `🏆 Winner: ${winners.join(', ')} 🏆`;
    }

    updateWinTrackTable();

    const chartContainer = document.querySelector('.chart-container');
    //  chartContainer.style.display = 'block';
}

// Function to update the win track table
// Function to update the win track table
function updateWinTrackTable() {
    const table = document.querySelector('.win-track-table');

    // Clear existing table rows
    table.innerHTML = `
                <tr>
                <th>Player</th>
                <th>Wins</th>
                </tr>
            `;

    // Add new table rows
    for (const player in playerWins) {
        const newRow = table.insertRow();
        const playerNameCell = newRow.insertCell();
        const playerWinsCell = newRow.insertCell();

        playerNameCell.textContent = player;
        playerWinsCell.textContent = playerWins[player];
    }

    // Call chart creation functions after updating the table
    createBarChart();
    createPieChart();
}


// Function to toggle between the table and chart view
function toggleView() {
    const chartContainer = document.querySelector('.chart-container');
    const tableContainer = document.querySelector('.win-track-container');

    chartContainer.classList.toggle('active');
    tableContainer.classList.toggle('active');
    console.log('sss', tableContainer.classList);

}

// Function to create a bar chart
function createBarChart() {
    const chartData = {
        labels: Object.keys(playerWins),
        datasets: [{
            label: 'Wins',
            data: Object.values(playerWins),
            backgroundColor: '#ff6b6b',
            borderWidth: 1
        }]
    };

    const chartConfig = {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Win Track'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    const ctx = document.getElementById('barChart').getContext('2d');

    // Destroy the existing chart if it exists
    if (winPercentageBarChart) {
        winPercentageBarChart.destroy();
    }

    // Create the new chart
    winPercentageBarChart = new Chart(ctx, chartConfig);
}

// Function to create a pie chart
function createPieChart() {
    const chartData = {
        labels: Object.keys(playerWins),
        datasets: [{
            data: Object.values(playerWins),
            backgroundColor: ['#ff6b6b', '#ffa06c', '#ffd166', '#06d6a0', '#118ab2', '#073b4c'],
            borderWidth: 1
        }]
    };

    const chartConfig = {
        type: 'pie',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Win Track'
                }
            }
        }
    };

    const ctx = document.getElementById('pieChart').getContext('2d');

    // Destroy the existing chart if it exists
    if (winPercentagePieChart) {
        winPercentagePieChart.destroy();
    }

    // Create the new chart
    winPercentagePieChart = new Chart(ctx, chartConfig);
}