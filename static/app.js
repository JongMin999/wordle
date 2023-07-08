let attempts = 0;
let index = 0;
let timer;

function appStart() {
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료됐습니다.";
    div.style =
      "display:flex; justify-content:center; align-items:center; position:absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color:white; width:200px; height:100px;";
    const main = document.querySelector("main");
    main.appendChild(div);
  };

  const nextLine = () => {
    if (attempts === 6) return gameover();
    attempts += 1;
    index = 0;
  };

  const gameover = () => {
    window.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("click", handleKeyboardClick);
    displayGameover();
    clearInterval(timer);
  };

  const handleEnterKey = async () => {
    let correctCount = 0;
    const 응답 = await fetch("/answer");
    const 정답 = await 응답.json();

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${attempts}${i}']`
      );
      const 입력한_글자 = block.innerText;
      const 정답_글자 = 정답[i];
      if (입력한_글자 === 정답_글자) {
        correctCount += 1;
        block.style.background = "#6AAA64";
        const boardKey = document.querySelector(
          `.board-key[data-key='${입력한_글자}']`
        );
        boardKey.classList.add("correct");
        boardKey.style.animation = "correctAnimation 0.5s";
        block.style.animation = "correctAnimation 0.5s";
      } else if (정답.includes(입력한_글자)) {
        block.style.background = "#C9B458";
      } else {
        block.style.background = "#787C7E";
      }
      block.style.color = "white";
    }
    if (correctCount === 5) {
      gameover();
    } else {
      nextLine();
    }
  };

  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) {
      index -= 1;
    }
  };

  const handleKeydown = (event) => {
    const key = event.key.toUpperCase();
    const keyCode = event.keyCode;
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );

    if (event.key === "Backspace") {
      handleBackspace();
    } else if (index === 5) {
      if (event.key === "Enter") {
        handleEnterKey();
      } else {
        return;
      }
    } else if (event.key === "Enter") {
      handleEnterKey();
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      index += 1;
    }
  };

  const handleKeyboardClick = (event) => {
    const key = event.target.dataset.key.toUpperCase();
    if (key.length !== 1) return;
    const keyCode = key.charCodeAt(0);
    if (65 <= keyCode && keyCode <= 90) {
      const thisBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index}']`
      );
      thisBlock.innerText = key;
      index += 1;
    } else if (key === "DELETE") {
      handleBackspace();
    } else if (key === "ENTER") {
      handleEnterKey();
    }
  };

  const startTimer = () => {
    const startTime = new Date();

    function setTime() {
      const currentTime = new Date();
      const elapsedTime = new Date(currentTime - startTime);
      const minutes = elapsedTime.getMinutes().toString().padStart(2, "0");
      const seconds = elapsedTime.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector("#timer");
      timeDiv.innerText = `${minutes}:${seconds}`;
    }

    timer = setInterval(setTime, 1000);
  };

  startTimer();
  window.addEventListener("keydown", handleKeydown);
  const keyboard1 = document.querySelector(".board-keyboard1");
  const keyboard2 = document.querySelector(".board-keyboard2");
  const keyboard3 = document.querySelector(".board-keyboard3");
  keyboard1.addEventListener("click", handleKeyboardClick);
  keyboard2.addEventListener("click", handleKeyboardClick);
  keyboard3.addEventListener("click", handleKeyboardClick);
}

appStart();
