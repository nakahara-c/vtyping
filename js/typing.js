import { wordList } from './wordList.js';
let typeText = '';
let order = [];
let shuffledOrder = [];
const typingArea = document.getElementById('typing_area');
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