const slider = document.querySelector('.slider');
const sliders = document.querySelectorAll('.sliders');
const sliderLine = document.querySelector('.slider_line');
const sliderBtnLeft = document.querySelector('.slider_left');
const sliderBtnRight = document.querySelector('.slider_right');

let sliderCount = 0;
let sliderWidth = slider.offsetWidth;

sliderBtnRight.addEventListener('click', rightSlide);
sliderBtnLeft.addEventListener('click', leftSlide);

function rollSlider() {
    sliderLine.style.transform = `translateX(${-sliderCount * sliderWidth}px)`;
}

function rightSlide() {
    sliderCount++; 
    if (sliderCount >= sliders.length) {
        sliderCount = 0;
    }
    rollSlider();
}

function leftSlide() {
    sliderCount--;
    if (sliderCount < 0) {
        sliderCount = sliders.length -1;
    }
    rollSlider();
}

setInterval(() => {
    rightSlide  ()
}, 3000);