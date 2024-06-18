const maxPlayersOnCourt = 5, numQuarters = 4;                              // 1
let currentQuarter = 0, playersOnCourt = 0, quarterInPlay = false;         // 2
let quarterPER = 0, quarterAvePER = 0, totalAvePER = 0;                    // 3
const playerMap = new Map();                                               // 4

function processPlayers(allPlayerStats) {                                  // 5
  const allPlayerStatLines = allPlayerStats.trim().split(/\r?\n/).slice(1);// 6
  allPlayerStatLines.forEach(line => {                                     // 7
    const stats = line.split(',');                                         // 8
    if (stats.length > 1) {                                                // 9
      const playerName = stats[1];                                         // 10
      if (!playerMap.has(playerName)) playerMap.set(playerName, []);       // 11
      playerMap.get(playerName).push(parseFloat(stats[9]));                // 12
    }                                                                      // 13
  });                                                                      // 14
  displayPlayerBench();                                                    // 15
}                                                                          // 16

function createButton(playerName) {                                        // 17
  const button = document.createElement('button');                         // 18
  button.id = playerName;                                                  // 19
  button.className = 'playerButton';                                       // 20
  button.onclick = movePlayer;                                             // 21
  const img = document.createElement('img');                               // 22
  img.src = 'images/' + playerName + '.png';                               // 23
  button.appendChild(img);                                                 // 24
  return button;                                                           // 25
}                                                                          // 26

function displayPlayerBench() {                                             // 27
  const bench = document.getElementById('playersOnBench');                 // 28
  playerMap.forEach((_, playerName) => bench.appendChild(createButton(playerName))); // 29
  displayPlayerCards();                                                    // 30
}                                                                          // 31

function displayPlayerCards() {                                            // 32
  const playerCardDisplay = document.getElementById('playerCards');        // 33
  playerMap.forEach((playerStats, playerName) => {                         // 34
    const playerCard = document.createElement('div');                      // 35
    playerCard.id = playerName + '_card';                                  // 36
    playerCard.className = 'playerCard';                                   // 37
    const img = document.createElement('img');                             // 38
    img.className = 'perCard';                                             // 39
    img.src = 'images/' + playerName + '.png';                             // 40
    const perText = document.createElement('p');                           // 41
    perText.className = 'perCard';                                         // 42
    perText.innerText = 'PER: ' + playerStats[currentQuarter].toPrecision(4); // 43
    playerCard.append(img, perText);                                       // 44
    playerCardDisplay.appendChild(playerCard);                             // 45
  });                                                                      // 46
}                                                                          // 47

function movePlayer() {                                                    // 48
  if (quarterInPlay) return;                                               // 49
  const parentDiv = this.parentElement;                                    // 50
  const playerName = this.id;                                              // 51
  const playerPER = playerMap.get(playerName)[currentQuarter];             // 52
  if (parentDiv.id == 'playersOnBench') {                                  // 53
    if (playersOnCourt >= maxPlayersOnCourt) {                             // 54
      alert(`You can only have ${maxPlayersOnCourt} players on the court at a time.`); // 55
    } else {                                                               // 56
      playersOnCourt++;                                                    // 57
      quarterPER += playerPER;                                             // 58
      updateQuarterPER();                                                  // 59
      document.getElementById('playersOnCourt').appendChild(this);         // 60
    }                                                                      // 61
  } else {                                                                 // 62
    playersOnCourt--;                                                      // 63
    quarterPER -= playerPER;                                               // 64
    updateQuarterPER();                                                    // 65
    document.getElementById('playersOnBench').appendChild(this);           // 66
  }                                                                        // 67
}                                                                          // 68

function updateQuarterPER() {                                              // 69
  quarterAvePER = playersOnCourt ? quarterPER / playersOnCourt : 0;        // 70
  document.getElementById('currentPER').innerText = 'Current PER: ' + quarterAvePER.toPrecision(4); // 71
}                                                                          // 72

function updateCardsInGame() {                                             // 73
  playerMap.forEach((playerStats, playerName) => {                         // 74
    document.getElementById(playerName + '_card').children[1].innerText = 'PER: ' + playerStats[currentQuarter].toPrecision(4); // 75
  });                                                                      // 76
  quarterPER = 0;                                                          // 77
  Array.from(document.getElementById('playersOnCourt').children).forEach(player => { // 78
    quarterPER += playerMap.get(player.id)[currentQuarter];                // 79
  });                                                                      // 80
  updateQuarterPER();                                                      // 81
}                                                                          // 82

function endQuarter() {                                                    // 83
  document.getElementById('timer').innerText = `Q ${currentQuarter + 1} Time: 0:00`; // 84
  quarterInPlay = false;                                                   // 85
  totalAvePER += parseFloat(quarterAvePER.toPrecision(4));                 // 86
  document.getElementById('averagePER').innerText += quarterAvePER + ' + '; // 87
  currentQuarter++;                                                        // 88
  updateCardsInGame();                                                     // 89
  alert(`Q${currentQuarter + 1} PER stats are in!`);                       // 90
  document.getElementById('quarter').innerText = `Choose Players for Q${currentQuarter + 1}`; // 91
  document.getElementById('start').innerText = `Start Q${currentQuarter + 1}`; // 92
}                                                                          // 93

function endGame() {                                                       // 94
  quarterInPlay = true;                                                    // 95
  totalAvePER += parseFloat(quarterAvePER);                                // 96
  const averagePER = totalAvePER / numQuarters;                            // 97
  alert(`Game Over. Game Average PER was: ${averagePER.toPrecision(4)}`);  // 98
  document.getElementById('averagePER').innerText += quarterAvePER.toPrecision(4) + ' = ' + averagePER.toPrecision(4); // 99
}