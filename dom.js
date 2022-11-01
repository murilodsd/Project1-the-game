class Player {
  constructor(isHuman, name) {
    this.isHuman;
    this.name = name;
    this.penalty = { goals: 0, missed: 0 };
  }
  setGoal() {
    this.penalty.goals++;
  }
  setPenaltyMissed() {
    this.penalty.missed++;
  }
}

class Match {
  constructor() {
    this.numberOfRounds = 3;
    this.currentRound = 1;
    this.targetDuration;
    this.numbersOfPlayers;
    this.wins = { player1: 0, player2: 0 };
    this.whoIsShooting = "player2";
  }
  setTargetDuration(level) {
    switch (level) {
      case "1":
        this.targetDuration = 900;
        break;
      case "2":
        this.targetDuration = 800;
        break;
      case "3":
        this.targetDuration = 700;
        break;
    }
  }
  setNumberOfPlayers(numberOfPLayers) {
    this.numberOfPlayers = numberOfPLayers;
  }

  // setPlayers(player1,player2) {
  //     [...arguments].forEach(function (player, index) {
  //         match.wins[`player${index}`] = 0;
  //       });
  // }

  increaseRound() {
    match.currentRound++;
  }
  changeWhoIsShooting() {
    if (this.whoIsShooting == "player2") {
      this.whoIsShooting = "player1";
    } else {
      this.whoIsShooting = "player2";
    }
  }

  resetCurrentRound() {
    this.currentRound = 1;
  }
  //ARRUMAR FUNÇÃO
  resetMatch() {
    this.numberOfRounds = 3;
    this.currentRound = 1;
    this.whoIsShooting = "player2";
  }
}

let match = new Match();
let player1;
let player2;
let moveBallIdSetInverval;
let moveGoalkeeperIdSetInverval;

let computerPlayer = new Player("Máquina de fazer gols");
let numberOfRounds = 3;

let $startBtn = document.querySelector(".start-btn");
let $restartBtn = document.querySelector(".restart-btn");
let $shootBtn = document.querySelector(".shoot-btn");
let $target = document.querySelector(".target");
let $goal = document.querySelector(".goal");
let $instructions = document.querySelector(".instructions-container p");
let $howManyPlayersContainer = document.querySelector(".players-container");
let $howManyPlayersRadio = document.querySelectorAll(
  ".players-container input"
);
let $levelContainer = document.querySelector(".level-container");
let $level = document.querySelectorAll(".level-container input");
let $playerNamesContainer = document.querySelector(".player-names-container");
let $nextPenaltiBtn = document.querySelector(".next-penalti-btn");
let $nextPlayerBtn = document.querySelector(".next-player-btn");
let $imagesDisplay = document.querySelector(".images-display");
let $ballProgressBar = document.querySelector(".ball-progress-bar");
let $goalkeeperProgressBar = document.querySelector(".goalkeeper-progress-bar");
let $ballImg = document.querySelector(".ball-progress-bar img");
let $goalkeeperImg = document.querySelector(".goalkeeper-progress-bar img");

window.addEventListener("load", (event) => {
  addClickEventOnTarget();
  addClickEventOnPlayers();
  addClickEventOnStartBtn();
  addClickEventOnLevel();
  addClickEventOnConfirmNames();
  addClickNextPenaltiBtn();
  addClickEventOnShootBtn();
  addClickNextPlayerBtn();
  addClickEventOnRestartBtn();
});

function addClickEventOnStartBtn() {
  $startBtn.addEventListener("click", (e) => {
    $howManyPlayersContainer.classList.remove("hidden");
    $levelContainer.classList.add("hidden");
    $nextPenaltiBtn.classList.add("hidden");
    $playerNamesContainer.classList.add("hidden");
    match.resetMatch();
  });
}

function addClickEventOnPlayers() {
  $howManyPlayersContainer
    .querySelector('input[value="1"]')
    .addEventListener("change", (e) => {
      $howManyPlayersContainer.classList.add("hidden");
      $playerNamesContainer
        .querySelector('input[name="player2-name"]')
        .parentElement.classList.add("hidden");
      clearHowManyPlayersInput();
      $playerNamesContainer.classList.remove("hidden");
      match.setNumberOfPlayers(1);
    });

  $howManyPlayersContainer
    .querySelector('input[value="2"]')
    .addEventListener("change", (e) => {
      $howManyPlayersContainer.classList.add("hidden");
      $playerNamesContainer
        .querySelector('input[name="player2-name"]')
        .parentElement.classList.remove("hidden");
      clearHowManyPlayersInput();
      $playerNamesContainer.classList.remove("hidden");
      match.setNumberOfPlayers(2);
    });
}

function addClickEventOnConfirmNames() {
  $playerNamesContainer
    .querySelector('input[type="button"]')
    .addEventListener("click", function (e) {
      player1 = new Player(
        true,
        $playerNamesContainer.querySelector(`input[name="player1-name"]`).value
      );
      if (match.numberOfPlayers == 2) {
        player2 = new Player(
          true,
          $playerNamesContainer.querySelector(
            `input[name="player2-name"]`
          ).value
        );
      } else player2 = new Player(false, "Máquinas de Fazer Gols");

      $playerNamesContainer.classList.add("hidden");
      $levelContainer.classList.remove("hidden");
    });
}

function addClickEventOnLevel() {
  $level.forEach(function (level, i, arr) {
    level.addEventListener("click", (e) => {
      $levelContainer.classList.add("hidden");
      match.setTargetDuration(level.value);
      computerShoot();
    });
  });
}

function addClickNextPenaltiBtn() {
  $nextPenaltiBtn.addEventListener("click", (e) => {
    $nextPenaltiBtn.classList.add("hidden");
    computerShoot();
  });
}

function computerShoot() {
  displayPenaltyInstructions();

  setTimeout(function () {
    ramdomPositionForTarget();
    showTargetForATime(match.targetDuration);
  }, 6000);
  setTimeout(function () {
    console.log("penalti batido");
    if (match.currentRound < match.numberOfRounds) {
      console.log("menos de 3 penaltis batidos");
      match.increaseRound();
      $nextPenaltiBtn.classList.remove("hidden");
    } else if (
      match.currentRound == match.numberOfRounds &&
      match.whoIsShooting == "player2"
    ) {
      match.changeWhoIsShooting();
      $nextPlayerBtn.classList.remove("hidden");
    }
  }, 9000);
}

function showTargetForATime(duration) {
  $target.style.display = "block";
  window.idSetTimeout = setTimeout(() => {
    hideTarget();
    match.whoIsShooting == "player1" ? player1.setGoal() : player2.setGoal();
    insertMainImg("goal");
  }, duration);
}

function hideTarget() {
  $target.style.display = "none";
  $goal.style.display = "flex"; //colocamos block apenas para o "chute"
}

function addClickEventOnTarget() {
  $target.addEventListener("click", (e) => {
    clearTimeout(idSetTimeout);
    match.whoIsShooting == "player1"
      ? player1.setPenaltyMissed()
      : player2.setPenaltyMissed();
    console.log("defendeu");
    hideTarget();
    insertMainImg("defense");
  });
}

function addClickNextPlayerBtn() {
  $nextPlayerBtn.addEventListener("click", (e) => {
    match.resetCurrentRound();
    $nextPlayerBtn.classList.add("hidden");
    $goalkeeperProgressBar.classList.remove("hidden");
    $shootBtn.classList.remove("hidden");
    inicializePlayerShoot();
  });
}

function inicializePlayerShoot() {
  moveBall();
  moveGoalkeeper();
}

function moveBall() {
  // $ballProgressBar.ariaValueNow = 5;
  //     $ballProgressBar.style.width = '5%';
  let reverse = false;
  moveBallIdSetInverval = setInterval(function () {
    if (reverse) {
      $ballProgressBar.ariaValueNow = `${
        parseInt($ballProgressBar.ariaValueNow) - 5
      }`;
      $ballProgressBar.style.width = `${
        parseInt($ballProgressBar.style.width) - 5
      }%`;
    } else {
      $ballProgressBar.ariaValueNow = `${
        parseInt($ballProgressBar.ariaValueNow) + 5
      }`;
      $ballProgressBar.style.width = `${
        parseInt($ballProgressBar.style.width) + 5
      }%`;
    }
    if (
      $ballProgressBar.ariaValueNow == 100 ||
      $ballProgressBar.ariaValueNow == 5
    ) {
      reverse = !reverse;
    }
  }, 50);
}

function moveGoalkeeper() {
  $goal.style.justifyContent = "flex-start";
  // $goalkeeperProgressBar.ariaValueNow = 30;
  //     $goalkeeperProgressBar.style.width = '30%';
  let reverse = false;
  moveGoalkeeperIdSetInverval = setInterval(function () {
    if (reverse) {
      $goalkeeperProgressBar.ariaValueNow = `${
        parseInt($goalkeeperProgressBar.ariaValueNow) - 5
      }`;
      $goalkeeperProgressBar.style.width = `${
        parseInt($goalkeeperProgressBar.style.width) - 5
      }%`;
    } else {
      $goalkeeperProgressBar.ariaValueNow = `${
        parseInt($goalkeeperProgressBar.ariaValueNow) + 5
      }`;
      $goalkeeperProgressBar.style.width = `${
        parseInt($goalkeeperProgressBar.style.width) + 5
      }%`;
    }
    if (
      $goalkeeperProgressBar.ariaValueNow == 100 ||
      $goalkeeperProgressBar.ariaValueNow == 30
    ) {
      reverse = !reverse;
    }
  }, 40);
}

function checkIfWasGoal() {
  if (
    parseFloat($ballProgressBar.style.width) >= 15 &&
    parseFloat($ballProgressBar.style.width) <= 90
  ) {
    if (
      $goalkeeperImg.x - $ballImg.x <= 20 &&
      $goalkeeperImg.x - $ballImg.x >= -180
    ) {
      match.whoIsShooting == "player1"
        ? player1.setPenaltyMissed()
        : player2.setPenaltyMissed();
        return false;
    } else
      match.whoIsShooting == "player1"
        ? player1.setGoal()
        : player2.setGoal();
        return true;
  } else
    match.whoIsShooting == "player1"
      ? player1.setPenaltyMissed()
      : player2.setPenaltyMissed();
      return false;
}

function addClickEventOnShootBtn() {
  $shootBtn.addEventListener("click", function () {
    clearInterval(moveBallIdSetInverval);
    clearInterval(moveGoalkeeperIdSetInverval);
    if (checkIfWasGoal()) {
      insertMainImg('goal')
    } else {insertMainImg('defense');}
    match.increaseRound();
    
    if(match.currentRound > match.numberOfRounds) {
      setTimeout(function(){
        finishGame();
      },2000)
    } else {
    setTimeout(function(){
      inicializePlayerShoot();
    },2000)}
  });
}

function finishGame(){
  $shootBtn.classList.add("hidden");
  $goalkeeperProgressBar.classList.add("hidden");
  $goal.style.justifyContent = "center";
  $restartBtn.classList.remove("hidden")
  $instructions.textContent = getWinner();
  }

  function addClickEventOnRestartBtn() {
    $restartBtn.addEventListener("click", (e) => {
      $restartBtn.classList.add("hidden");
      $instructions.textContent = ''
      match.resetMatch();
      computerShoot();
    });
  }

function getWinner(){
  if(player1.penalty.goals > player2.penalty.goals) {
    match.wins.player1++
    return `${player1.name} é o vencedor`
  } else if (player1.penalty.goals < player2.penalty.goals) {
    match.wins.player2++
    return `${player2.name} é o vencedor`
  } else return `O jogo empatou!`
}


function clearHowManyPlayersInput() {
  $howManyPlayersRadio.forEach(
    (numberOfPlayers, i, array) => (numberOfPlayers.checked = false)
  );
}

function displayPenaltyInstructions() {
  let i = 0;

  $goal.style.justifyContent = "center";
  $goal.style.alignItems = "center";

  let idSetInverval = setInterval(function () {
    switch (i) {
      case 0:
        $instructions.textContent = "Prepare-se vai começar";
        break;
      case 1:
      case 2:
      case 3:
        $instructions.textContent = i;
        break;
      case 4:
        $instructions.textContent = "";
        clearInterval(idSetInverval);
    }
    i++;
  }, 1000);
}

function ramdomPositionForTarget() {
  $goal.style.display = "block"; //tive que botar block aqui pra nao dar pau na posicao da aleatoria da bola
  $target.style.top = `${
    (Math.random() * ($goal.clientHeight - $target.offsetHeight)) / 10
  }rem`;
  $target.style.left = `${(Math.random() * $goal.clientWidth) / 10}rem`;
}

function getImg(moment) {
  return `./images/${moment}${Math.ceil(Math.random() * 2)}.jpg`;
}

function gerarMainImgTag(moment) {
  return `<img style="height:420px" src="${getImg(
    moment
  )}" alt="" class="penalti"></img>`;
}

function insertMainImg(moment) {
  $imagesDisplay.innerHTML = gerarMainImgTag(moment);
  $imagesDisplay.classList.remove("hidden");
  setTimeout(function () {
    $imagesDisplay.classList.add("hidden");
  }, 2000);
}
