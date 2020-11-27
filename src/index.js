import Utils from './utils.js';

export default function BaseballGame(N) {
  const util = new Utils();

  const userInputElem = document.querySelector('#user-input');
  const resultElem = document.querySelector('#result');
  const playBtn = document.querySelector('#submit');

  const EMPTY = 0;
  const NOT_N_DIGIT = 1;
  const REDUNDANT = 2;
  const ZERO_INCLUDED = 3;
  const CHAR_INCLUDED = 4;

  const getComputerInputnumbers = (numbers) => {
    if (numbers !== '') {
      return numbers;
    }
    numbers = util.generateRandomNumbers(N);
    console.log(`⚾LOG: Sorry For The Spolier! The Answer Is... ${numbers}`);
    return numbers;
  };

  const getUserInputnumbers = () => {
    return userInputElem.value;
  };

  const isErrorInput = (numbers) => {
    if (numbers === '') {
      return EMPTY;
    }
    for (let n of numbers) {
      if (n === '0') {
        return ZERO_INCLUDED;
      }
      if (util.isNumber(n)) {
        return CHAR_INCLUDED;
      }
    }
    if (numbers.length !== N) {
      return NOT_N_DIGIT;
    }
    if (numbers.length !== new Set(numbers).size) {
      return REDUNDANT;
    }
    return false;
  };

  const alertErrorMessage = (errno) => {
    console.log(`⚾LOG: Invalid User Input. 🚨Error Code: ${errno}`);

    alert(getErrorMessage(errno));
    util.initialize(userInputElem);
  };

  const getErrorMessage = (errno) => {
    if (errno == EMPTY) {
      return `\n🚨 안내 🚨\n\n 아무것도 입력되지 않았습니다.\n ${N}자리 숫자를 예상해서 입력해 주세요.`;
    }
    if (errno == CHAR_INCLUDED) {
      return `\n🚨 안내 🚨\n\n 숫자만 입력해주셔야 합니다.\n 다시 입력해 주세요.`;
    }
    if (errno == ZERO_INCLUDED) {
      return `\n🚨 안내 🚨\n\n 0을 제외한 1부터 9까지의 숫자만 입력해주셔야 합니다.\n 다시 입력해 주세요.`;
    }
    if (errno == NOT_N_DIGIT) {
      return `\n🚨 안내 🚨\n\n ${N}자리 숫자로 입력해 주셔야 합니다.\n 다시 입력해 주세요.`;
    }
    if (errno == REDUNDANT) {
      return `\n🚨 안내 🚨\n\n 서로 다른 숫자로 입력해주셔야 합니다.\n 다시 입력해 주세요.`;
    }
  };

  const play = (computerInputNumbers, userInputNumbers) => {
    console.log(`⚾LOG: Your Guess Is... ${userInputNumbers}`);

    let score = markScore(computerInputNumbers, userInputNumbers);
    return getGameResult(score);
  };

  const markScore = (computerInputNumbers, userInputNumbers) => {
    let score = {
      strike: 0,
      ball: 0,
    };

    for (let i in userInputNumbers) {
      if (userInputNumbers[i] === computerInputNumbers[i]) {
        score.strike++;
        continue;
      }
      if (computerInputNumbers.includes(userInputNumbers[i])) {
        score.ball++;
      }
    }
    return score;
  };

  const getGameResult = (score) => {
    if (score.strike === N) {
      prepareRestartButton();
      return `<h4>🎉정답을 맞추셨습니다!🎉</h4>게임을 새로 시작하시겠습니까? `;
    }
    if (score.strike === 0 && score.ball === 0) {
      return `낫싱`;
    }
    let msg = '';
    if (score.ball !== 0) {
      msg += `${score.ball}볼 `;
    }
    if (score.strike !== 0) {
      msg += `${score.strike}스트라이크`;
    }
    return msg;
  };

  const prepareRestartButton = () => {
    let restartElem = util.createBtn('game-restart-button', '게임 재시작');

    restartElem.addEventListener('click', function restart(e) {
      e.preventDefault();
      computerInputNumbers = '';
      resultElem.innerHTML = '';
      restartElem.remove();
      userInputElem.value = '';
      userInputElem.focus();
    });
    util.initialize(resultElem);
    resultElem.append(restartElem);
    console.log(`⚾LOG: You Win!💛💛💛`);
  };

  const clearForm = (e) => {
    userInputElem.value = '';
  };

  const showGameResult = (e) => {
    e.preventDefault();
    util.initialize(resultElem);

    const userInputNumbers = getUserInputnumbers();
    const errno = isErrorInput(userInputNumbers);
    if (errno) {
      return alertErrorMessage(errno, userInputElem);
    }
    computerInputNumbers = getComputerInputnumbers(computerInputNumbers);

    const gameResult = play(computerInputNumbers, userInputNumbers);
    resultElem.insertAdjacentHTML('afterbegin', gameResult);
  };

  let computerInputNumbers = '';

  userInputElem.addEventListener('click', clearForm);
  playBtn.addEventListener('click', showGameResult);
}

new BaseballGame(3);
