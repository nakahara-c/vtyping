'use strict';

const [blackoutTime, lagTime, countUpTime] = [5000, 1000, 7500];
const kpm = 1000;
const isDebug = true;

const playAudio = (name) => {
    const audio = document.getElementById(`sound-${name}`);
    audio.play();
}
const stopAudio = (name) => {
    const audio = document.getElementById(`sound-${name}`);
    audio.pause();
}

if (!isDebug) {
    const kpmView = document.getElementById("kpm-view");
    setTimeout(() => {
        const elem = document.documentElement;
        const method = elem.requestFullscreen || elem.webkitRequestFullscreen || elem.mozRequestFullScreen || elem.msRequestFullscreen;
        if (method) method.call(elem);

        document.body.style.backgroundColor = "black";
        document.getElementById("header").remove();
        document.getElementById("typing-input").style.display = "none";

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