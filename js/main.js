import { wordList } from './wordList.js';

const isDebug = 0;

const time = 1;
let typeText, startTime, intervalId;
let [kpm, typedKeysCount, passedTime] = [0, 0, 0];
let [timerArray, order, shuffledOrder] = [[], [], []];
const timer = document.getElementById('timer');
const typingArea = document.getElementById('typing_area');
const [blackoutTime, lagTime, countUpTime] = [0, 1000, 2500];

const audioList = document.querySelectorAll("audio");
audioList.forEach(audio => audio.volume = 0);
const volumeSlider = document.getElementById("volume-slider");
volumeSlider.addEventListener("input", () => {
    audioList.forEach(audio => audio.volume = volumeSlider.value);
});

const playAudio = (name) => {
    const audio = document.getElementById(`sound-${name}`);
    audio.play();
}
const stopAudio = (name) => {
    const audio = document.getElementById(`sound-${name}`);
    audio.pause();
}

const blackout = () => {
    if (isDebug) return;
    // kpm = Math.round(typedKeysCount / passedTime * 60);
    kpm = 100;
    const kpmView = document.getElementById("kpm-view");
    setTimeout(() => {
        const elem = document.documentElement;
        const method = elem.requestFullscreen || elem.webkitRequestFullscreen || elem.mozRequestFullScreen || elem.msRequestFullscreen;
        if (method) method.call(elem);

        document.body.style.backgroundColor = "black";
        document.getElementById("header").remove();
        document.getElementById("typing-input").style.display = "none";
        document.getElementById("audio-input").style.display = "none";

        playAudio('blackout');
        
        document.body.style.backgroundImage = "url(./images/blackout.webp)";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundAttachment = "fixed";
    }, blackoutTime);

    setTimeout(() => {
        document.body.style.backgroundImage = "none";
    }, lagTime);

    setTimeout(() => {
        document.body.style.backgroundImage = "none";

        document.body.style.backgroundImage = "url(./images/goldkeys.webp)";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundAttachment = "fixed";

        playAudio('result1');

        kpmView.hidden = false;
        const kpmNum = document.getElementById("kpm-num");
        const kpmStr = document.getElementById("kpm-str");
        let val = 0;
        const kpmAnimation = () => {
            for (let i = 0; i <= 40; i++) {
                setTimeout(() => {
                    kpmNum.style.fontSize = `${30 + i * 5}em`;
                }, i * 10);
            }
            for (let i = 0; i <= 40; i++) {
                setTimeout(() => {
                    kpmNum.style.fontSize = `${230 + 10 - i * 5}em`;
                }, 400 + i * 5);
            }
            kpmStr.hidden = false;
            stopAudio('result1');
            playAudio('result2');
        };
        const kpmInterval = setInterval(() => {
            val += 1;
            kpmNum.textContent = val;
            if (val >= kpm) {
                clearInterval(kpmInterval);
                kpmAnimation();
            }
        }, 5);
    }, countUpTime);
}

/**
 * typing
 */



startTime = performance.now();
intervalId = setInterval(startTimer, 100);

setWordEnglish(1000, typingArea);
function setWordEnglish(keysCount, typingArea) {
    let shuffledWordList;
    shuffledWordList = fisherYatesShuffle(wordList);
    typeText = shuffledWordList.join(' ');
    typingArea.value = typeText.slice(0, keysCount);
    order = [];
    shuffledOrder = [];
    for (let i = 0; i < (keysCount * 2); i++) order.push(i);
    shuffledOrder = reorder(fisherYatesShuffle(order), keysCount);
    window.addEventListener('keydown', judgeKeys, false);
}
function judgeKeys(e) {
    e.preventDefault();
    let typedKey = e.key;
    let nextKey = typeText[0];
    if (typedKey === nextKey) {
        correctType(typedKey);
    } else {
        incorrectType(typedKey);
    }
}
function correctType(key) {
    typeText = typeText.slice(1);
    typingArea.value = typeText;
    typedKeysCount++;
}
function incorrectType(key) {
    typingArea?.classList.add('missed');
    setTimeout(() => {
        typingArea?.classList.remove('missed');
    }, 1000);
}
function fisherYatesShuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
function reorder(array, cnt) {
    let result = [...array];
    let cnt2 = cnt * 2;
    for (let i = 0; i < array.length; i++) {
        let a = array[i];
        let b = (a + cnt) % cnt2;
        let aIndex = i;
        let bIndex = array.indexOf(b);
        if (a < b && aIndex > bIndex) {
            [result[aIndex], result[bIndex]] = [result[bIndex], result[aIndex]];
        }
    }
    return result;
}
function startTimer () {
    let elapsedTime = (performance.now() - startTime) / 1000;
    let remainingTime = time - Number(elapsedTime.toFixed(0));
    if (remainingTime !== Number(timer.textContent)) {
        timer.textContent = remainingTime;
        void timer.offsetWidth;
    }
    passedTime = elapsedTime.toFixed(0);
    if (remainingTime <= 0) {
        blackout();
        clearInterval(intervalId);
    } else if (remainingTime <= 8) {
        timer.classList.add('color-red');
    }
}