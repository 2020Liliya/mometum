// DATE
const day = document.querySelector('.date');
function showDate() {
    const date = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const currentDate = date.toLocaleDateString('en-Us', options);
    day.textContent = currentDate;
}


// GREETING
const greeting = document.querySelector('.greeting');
function getTimeOfDay(h) {
    if (h === 6 || h === 7 || h === 8 || h === 9 || h === 10 || h === 11) {
        return 'morning';
    } else if (h === 12 || h === 13 || h === 14 || h === 15 || h === 16 || h === 17) {
        return 'afternoon';
    } else if (h === 18 || h === 19 || h === 20 || h === 21 || h === 22 || h === 23) {
        return 'evening';
    } else {
        return 'night';
    }
}
function showGreeting() {
    const date = new Date();
    const hours = date.getHours();
    const timeOfDay = getTimeOfDay(hours);
    greeting.textContent = `Good ${timeOfDay}, `;
}


// TIME
const time = document.querySelector('.time');
function showTime() {
    const date = new Date();
    const options = { hour12: false };
    const currentTime = date.toLocaleTimeString('ru-Ru', options);
    time.textContent = currentTime;
    setTimeout(showTime, 1000);
    showDate();
    showGreeting();
}
showTime();


// LOCAL STORAGE FOR NAME
const name = document.querySelector('.name');
function setLocalStorage() {
    localStorage.setItem('name', name.value);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
    if (localStorage.getItem('name')) {
        name.value = localStorage.getItem('name');
    }
}
window.addEventListener('load', getLocalStorage);


// BG
const body = document.querySelector('body');

let randomNum;
function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNum;
}

let bgNum = getRandomNum(1, 20);
function setBg() {
    const date = new Date();
    const hours = date.getHours();
    const timeOfDay = getTimeOfDay(hours);
    const link = `https://raw.githubusercontent.com/2020Liliya/stage1-tasks/assets/images/${timeOfDay}/compressed/${String(bgNum).padStart(2, '0')}.webp`;
    const img = new Image();
    img.src = link;
    img.onload = () => {
        body.style.backgroundImage = 'url(' + link + ')';
    };
}
setBg();


// SLIDER
function getSlideNext() {
    bgNum >= 1 && bgNum < 20 ? bgNum += 1 : bgNum = 1;
    setBg();
}

function getSlidePrev() {
    bgNum > 1 && bgNum <= 20 ? bgNum -= 1 : bgNum = 20;
    setBg();
}

const slideNext = document.querySelector('.slide-next');
slideNext.addEventListener('click', getSlideNext);
const slidePrev = document.querySelector('.slide-prev');
slidePrev.addEventListener('click', getSlidePrev);


// WEATHER
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const city = document.querySelector('.city');
const weatherError = document.querySelector('.weather-error');

// LOCAL STORAGE FOR WEATHER
function setLocalStorageCity() {
    localStorage.setItem('city', city.value);
    getWeather();
}
window.addEventListener('beforeunload', setLocalStorageCity);

function getLocalStorageCity() {
    if (localStorage.getItem('city')) {
        city.value = localStorage.getItem('city');
        getWeather();
    }
}
window.addEventListener('load', getLocalStorageCity);


async function getWeather() {
    try {
        weatherError.textContent = '';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=a09df06f608594655e334d7e55396d50&units=metric`;
        const res = await fetch(url);
        const data = await res.json();
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
        wind.textContent = `Wind speed: ${data.wind.speed.toFixed(0)} m/s`;
        humidity.textContent = `Humidity: ${data.main.humidity.toFixed(0)}%`;
        weatherDescription.textContent = data.weather[0].description;
    } catch (err) {
        weatherError.textContent = `Error! city not found for '${city.value}'`;
        temperature.textContent = '';
        wind.textContent = '';
        humidity.textContent = '';
        weatherDescription.textContent = '';
    }
}

function setCity(event) {
    if (event.code === 'Enter') {
        getWeather();
        city.blur();
    }
}

document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);


// QUOTE
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
async function getQuotes() {
    const quotes = 'data.json';
    const res = await fetch(quotes);
    const data = await res.json();
    const randomNum = getRandomNum(0, 1642);
    quote.textContent = `"${data[randomNum].text}"`;
    author.textContent = `${data[randomNum].author}`;
}
getQuotes();

const changeQuote = document.querySelector('.change-quote');
changeQuote.addEventListener('click', getQuotes);


// AUDIO
import playList from './playList.js';
let isPlay = false;
const playBtn = document.querySelector('.play');

function playIcon() {
    playBtn.classList.remove('pause');
    playBtn.classList.add('play');
}
function stopIcon() {
    playBtn.classList.remove('play');
    playBtn.classList.add('pause');
}

const audio = new Audio();
let playNum = 0;

const playListContainer = document.querySelector('.play-list');
playList.forEach(el => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = `${playList[playNum].title}`;
    playListContainer.append(li);
    playNum += 1;
})

playNum = 0;
const playItem = document.querySelectorAll('.play-item');
function playAudio() {
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    if (!isPlay) {
        audio.play();
        isPlay = true;
        stopIcon();
        playItem[playNum].classList.add('item-active');
        audio.onended = function() {
            playNext();
        };
    } else {
        audio.pause();
        isPlay = false;
        playIcon();
    }
}
playBtn.addEventListener('click', playAudio);

function playNext() {
    playItem[playNum].classList.remove('item-active');
    playNum >= 0 && playNum < 3 ? playNum += 1 : playNum = 0;
    isPlay = false;
    playAudio();
}

function playPrev() {
    playItem[playNum].classList.remove('item-active');
    playNum > 0 && playNum <= 3 ? playNum -= 1 : playNum = 3;
    isPlay = false;
    playAudio();
}

const playNextAudio = document.querySelector('.play-next');
playNextAudio.addEventListener('click', playNext);
const playPrevAudio = document.querySelector('.play-prev');
playPrevAudio.addEventListener('click', playPrev);
