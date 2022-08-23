import mergeImages from 'merge-images';
import Croppie from 'croppie';
import addFav from './addFav';
import generateStars from './stars';
import downloadImage from './downloadImage';
import './styles/main.scss';
import { 
    frame1, 
    frame2, 
    frame3, 
    frame4, 
    frame5, 
    frame6, 
    frame7, 
    frame8,
    frame9,
    frame10
} from './assets/frames';
import add from './assets/add-image.png';
import remove from './assets/remove.png';
import save from './assets/button.svg';
import logo from './assets/logo.png';
import twitterIcon from './assets/t-b.png';
import discordIcon from './assets/d-b.png';
import zoomInIcon from './assets/zoom-in.png';
import zoomOutIcon from './assets/zoom-out.png';
import deleteIcon from './assets/delete.png';

//static
let addBtn = document.getElementById('add')
addBtn.src = add;
let removeBtn = document.getElementById('remove')
removeBtn.src = remove;
let saveBtn = document.getElementById('save')
saveBtn.src = save;
let logoImg = document.getElementById('logo')
logoImg.src = logo;
let twitter = document.getElementById('twitter')
twitter.src = twitterIcon;
let discord = document.getElementById('discord')
discord.src = discordIcon;
let delLayer = document.getElementById('delete');
delLayer.src = deleteIcon;

//frames
const frames = [frame1,frame2,frame3,frame4,frame5,frame6,frame7,frame8,frame9,frame10]
let el = document.getElementById('vanilla');
let activeFrame = frames[0];
let croppieImg = '';
let completeImg ='';
let vanilla = null;
let timer;
//opacity range
let opacityRange = document.getElementById('opacityRange');
let opacity = 0.5;
let bgColor = '#ffd500';
//color-picker
let color_picker = document.getElementById("color-picker");
let color_picker_wrapper = document.getElementById("color-picker-wrapper");
color_picker.value = '#ffd500';
color_picker_wrapper.style.backgroundColor = color_picker.value;
//canvasLayer
let colorLayerContainer = document.querySelector('.color-layer')
let colorLayer = null;
//file isnt uploaded
let notUpload = true;
//uploaded img in vanilla
let img = document.createElement('img');
img.className = 'vanilla-img';
// img.style.cssText = 'position: absolute; top: -5px; left: -5px; width: 410px; height: 410px; z-index: 2;pointer-events: none;';
//zoomIn
let zoomIn = document.createElement('img');
zoomIn.className = 'zoom-in';
// zoomIn.style.cssText = 'margin-left: 10px;width: 20px;transform: rotate(90deg)';
//zoomOut
let zoomOut = document.createElement('img');
zoomOut.className = 'zoom-out'
// zoomOut.style.cssText = 'margin-right: 10px;width: 20px;transform: rotate(90deg)';
//color Layer above picture
let bgLayer = document.createElement('div');
bgLayer.className = 'bg-layer'
// bgLayer.style.cssText = 'position: absolute; top: 10px; left: 10px; width: 390px; height: 390px; z-index: 1;pointer-events: none;border-radius: 50%;'
//run stars
generateStars();
//add favicon
addFav();
//add urls to frame + on click choose frame
document.querySelectorAll('.frame').forEach((item,index)=> {
    item.src = frames[index]
    item.addEventListener('click', ()=> {
        if(notUpload){
            return;
        }
        activeFrame = frames[index];
        completeImg = '';
        img.src = frames[index]
        el.append(img)
    })
})
//upload img
let input = document.querySelector('input[type="file"]');
input.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        colorLayerContainer.style.display = 'flex';
        document.querySelector('#saveBtn').style.display = 'flex';
        removeBtn.style.display = 'block';
        croppieImg =  URL.createObjectURL(this.files[0]);
        vanilla = new Croppie(el, {
            viewport: { width: down768px ? 210 : down992px() ? 260 : down1450px() ? 310 : 350, height: down768px ? 210 : down992px() ? 260 : down1450px() ? 310 : 350, type: 'circle' },
            boundary: { width: down768px ? 210 : down992px() ? 260 : down1450px() ? 310 : 350, height: down768px ? 210 : down992px() ? 260 : down1450px() ? 310 : 350, },
            showZoomer: true,
        });
        notUpload = false;
        el.classList.add('active')
        addBtn.style.display = 'none';
        croppieF(croppieImg);
    }
});
//breakpoints func
function down1450px() {
    return window.innerWidth <= 1450;
}
function down992px() {
    return window.innerWidth <= 992;
}
function down768px() {
    return window.innerWidth <= 768;
}
console.log(down768px())
//remove img
removeBtn.addEventListener('click', ()=> {
    input.value = '';
    vanilla.destroy();
    removeBtn.style.display = 'none';
    document.querySelector('#saveBtn').style.display = 'none';
    addBtn.style.display = 'block';
    el.classList.remove('active');
    img.style.display = 'none';
    notUpload = true;
    resetColorLayer('hide');
})
//create croppie img
function croppieF(uploadedImg){
    img.src = activeFrame;
    zoomIn.src = zoomInIcon;
    zoomOut.src = zoomOutIcon;
    el.append(img);
    el.append(bgLayer);
    img.style.display = 'block';
    document.querySelector('.cr-slider-wrap').prepend(zoomOut)
    document.querySelector('.cr-slider-wrap').append(zoomIn)
    vanilla.bind({
        url: uploadedImg,
    })
    el.addEventListener('update', ()=> {
        clearTimeout(timer)
        timer = setTimeout(()=> {
            vanilla.result({type: 'blob', size: { width: 760, height: 760 }}).then((blob)=> {
                const url = window.URL.createObjectURL(blob);
                croppieImg = url;
            })
        }, 400)
    });
}
//saveImage
document.querySelector('#saveBtn').addEventListener('click', ()=> {
    if(notUpload){
        return;
    }
    let options = {width: 800, height: 800}
    if(colorLayer){
        mergeImages([{ src: croppieImg, x: 20, y: 20 }, {src: colorLayer, x: 20, y: 20 }, activeFrame], options)
        .then(b64 => {
            completeImg = b64; 
            downloadImage(completeImg, 'Mutual Friends PFP')
        });
        return;
    }
    mergeImages([{ src: croppieImg, x: 20, y: 20 }, activeFrame], options)
        .then(b64 => {
            completeImg = b64; 
            downloadImage(completeImg, 'Mutual Friends PFP')
        });
})
//clear colorLayer
delLayer.addEventListener('click', ()=> {
    resetColorLayer('');
})
//choose opacity
opacityRange.addEventListener('input', ()=> {
    opacity = opacityRange.value
    createColorLayer(hex2rgba(bgColor, opacity));
    bgLayer.style.backgroundColor = hex2rgba(bgColor, opacity);
})
//choose color
color_picker.addEventListener('input', ()=> {
    color_picker_wrapper.style.backgroundColor = color_picker.value;
    bgColor = color_picker.value;
    createColorLayer(hex2rgba(bgColor, opacity));
    bgLayer.style.backgroundColor = hex2rgba(bgColor, opacity);
});
//create image with color layer
let canvas = document.getElementById('canvasid');
let context = canvas.getContext('2d');
function createColorLayer(color){
    context.clearRect(0,0,760,760)
    context.fillStyle = color;
    context.arc(380, 380, 380, 0, 2 * Math.PI);
    context.fill();
    colorLayer = canvas.toDataURL("img/png");
}
//reset color pick
function resetColorLayer(directive){
    if(directive == 'hide'){
        colorLayerContainer.style.display = 'none';
    }
    colorLayer = null;
    opacity = 0.5;
    bgColor = '#ffd500';
    bgLayer.style.backgroundColor = 'transparent';
    color_picker.value = '#ffd500';
    opacityRange.value = opacity;
    color_picker_wrapper.style.backgroundColor = color_picker.value;
}
//hex to rgba
const hex2rgba = (hex, alpha = 0.5) => {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
};
//loader
let loader = document.querySelector('.loader');
let starsWrapper = document.getElementById('stars')
setTimeout(()=> {
    loader.style.display = 'none';
    starsWrapper.style.cssText = 'z-index: -1';
}, 1400)