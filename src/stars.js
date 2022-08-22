function generateStars() {
    let count = 31;
    for (let i = 0; i < count; i++) {
        let randomX = randomRange(10, 990) * 0.1;
        let randomY = randomRange(10, 990) * 0.1;
        let randomScale = randomRange(50, 80) * 0.01;
        let randomOpacity = randomRange(50, 100) * 0.01;
        drawStars(randomX,randomY,randomScale,randomOpacity);
    }
    setInterval( ()=> {
        changePos();
    },10000)
};
function drawStars(randomX,randomY,randomScale,randomOpacity){
    let starsWrapper = document.getElementById('stars')
    let star = document.createElement('div')
    star.className = 'star';
    star.style.transform = `translate(${randomX+ 'vw'}, ${randomY + 'vh'}) scale(${randomScale})`
    star.style.opacity = `${randomOpacity}`;    
    starsWrapper.append(star)
};
function changePos() {
    let stars = document.querySelectorAll('.star')
    stars.forEach((star) => {
        let randomInt = randomRange(-5, 5);
        let randomScale = randomRange(50, 80) * 0.01;
        let randomOpacity = randomRange(50, 100) * 0.01;

        let style = window.getComputedStyle(star);
        var matrix = new WebKitCSSMatrix(style.transform);
        console.log(matrix)
        let translateX = matrix.m41;
        let translateY = matrix.m42;
        let vw = 100 * translateX / window.innerWidth;
        let vh = 100 * translateY / window.innerHeight;
        let randomX = vw + randomInt >= 100
              ? vw + randomInt - 15
              : vw + randomInt <= 0
              ? vw + randomInt + 15
              : vw + randomInt;
        let randomY = vh + randomInt >= 100
                ? vh + randomInt - 15
                : vh + randomInt <= 0
                ? vh + randomInt + 15
                : vh + randomInt;
        star.style.transform = `translate(${randomX + 'vw'}, ${randomY + 'vh'}) scale(${randomScale})`
        star.style.opacity = `${randomOpacity}`;    
    });
};
function randomRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
};

export default generateStars;