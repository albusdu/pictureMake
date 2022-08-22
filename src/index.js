import mergeImages from 'merge-images';
import Croppie from 'croppie';
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
let del = document.getElementById('delete');
del.src = deleteIcon;

const frames = [frame1,frame2,frame3,frame4,frame5,frame6,frame7,frame8,frame9,frame10]
let activeFrame = frames[0];
let link = '';
let l ='';
let el = document.getElementById('vanilla-demo');
let vanilla = null;
let timer;

let colorLayer = null;

let disabledFrames = true;

let img = document.createElement('img');
img.style.cssText = 'position: absolute; top: -5px; left: -5px; width: 410px; height: 410px; z-index: 2;pointer-events: none;';
let zoomIn = document.createElement('img')
zoomIn.style.cssText = 'margin-left: 10px;width: 20px;transform: rotate(90deg)'
let zoomOut = document.createElement('img')
zoomOut.style.cssText = 'margin-right: 10px;width: 20px;transform: rotate(90deg)'
document.querySelectorAll('.frame').forEach((item,index)=> {
    item.src = frames[index]
    
    item.addEventListener('click', ()=> {
        if(disabledFrames){
            return;
        }
        activeFrame = frames[index];
        // let options = {width: 800, height: 800};
        l = '';
        
        img.src = frames[index]
        el.append(img)
        // if(colorLayer){
        //     mergeImages([{ src: link, x: 20, y: 20 }, {src: colorLayer, x: 20, y: 20 }, activeFrame], options)
        //     .then(b64 => {
        //         l = b64; 
        //     });
        //     return;
        // }
        // mergeImages([{ src: link, x: 20, y: 20 }, activeFrame], options)
        //     .then(b64 => {
        //         l = b64; 
        //     });
    })
})
let input = document.querySelector('input[type="file"]');
input.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        removeBtn.style.display = 'block';
        link =  URL.createObjectURL(this.files[0]);
        vanilla = new Croppie(el, {
            viewport: { width: 395, height: 395, type: 'circle' },
            boundary: { width: 395, height: 395 },
            showZoomer: true,
        });
        disabledFrames = false;
        el.classList.add('active')
        addBtn.style.display = 'none';
        croppieF(link);
    }
});
removeBtn.addEventListener('click', ()=> {
    input.value = '';
    vanilla.destroy();
    removeBtn.style.display = 'none';
    addBtn.style.display = 'block';
    el.classList.remove('active');
    img.style.display = 'none';
    disabledFrames = true;
})

let div = document.createElement('div');
div.style.cssText = 'position: absolute; top: 7.5px; left: 7.5px; width: 395px; height: 395px; z-index: 1;pointer-events: none;border-radius: 50%;'

function croppieF(lk){
    img.src = activeFrame;
    zoomIn.src = zoomInIcon;
    zoomOut.src = zoomOutIcon;
    el.append(img);
    el.append(div);
    img.style.display = 'block';
    document.querySelector('.cr-slider-wrap').prepend(zoomOut)
    document.querySelector('.cr-slider-wrap').append(zoomIn)
    vanilla.bind({
        url: lk,
    })
    document.getElementById('vanilla-demo').addEventListener('update', (ev)=> {
        clearTimeout(timer)
        timer = setTimeout(()=> {
            vanilla.result({type: 'blob', size: { width: 760, height: 760 }}).then((blob)=> {
                const url = window.URL.createObjectURL(blob);
                link = url;
    
                // let options = {width: 800, height: 800}
                // l = '';
                // if(colorLayer){
                //     mergeImages([{ src: link, x: 20, y: 20 }, {src: colorLayer, x: 20, y: 20 }, activeFrame], options)
                //     .then(b64 => {
                //         l = b64; 
                //     });
                //     return;
                // }
                // mergeImages([{ src: link, x: 20, y: 20 }, activeFrame], options)
                //     .then(b64 => {
                //         l = b64; 
                //     });
                
            })
        }, 400)
    });
}

document.querySelector('#btn').addEventListener('click', ()=> {
    let options = {width: 800, height: 800}
    if(colorLayer){
        mergeImages([{ src: link, x: 20, y: 20 }, {src: colorLayer, x: 20, y: 20 }, activeFrame], options)
        .then(b64 => {
            l = b64; 
            downloadImage(l, 'Mutual Friends PFP')
        });
        return;
    }
    mergeImages([{ src: link, x: 20, y: 20 }, activeFrame], options)
        .then(b64 => {
            l = b64; 
            downloadImage(l, 'Mutual Friends PFP')
        });
})

del.addEventListener('click', ()=> {
    colorLayer = null;
    div.style.backgroundColor = 'transparent';
})

let loader = document.querySelector('.loader');
setTimeout(()=> {
    loader.style.display = 'none'
}, 1400)

let opacityRange = document.getElementById('vol');
let opacity = 0.5;
let bgColor = '';
opacityRange.addEventListener('input', ()=> {
    opacity = opacityRange.value
    createColorLayer(hex2rgba(bgColor, opacity));
    div.style.backgroundColor = hex2rgba(bgColor, opacity);
})

var color_picker = document.getElementById("color-picker");
var color_picker_wrapper = document.getElementById("color-picker-wrapper");
color_picker.value = '#ffd500'
color_picker.oninput = function() {
    color_picker_wrapper.style.backgroundColor = this.value;
    bgColor = this.value;
    createColorLayer(hex2rgba(bgColor, opacity));
    div.style.backgroundColor = hex2rgba(bgColor, opacity);
}
color_picker_wrapper.style.backgroundColor = color_picker.value;

const hex2rgba = (hex, alpha = 1) => {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
};

function createColorLayer(color){
    var canvas = document.getElementById('canvasid');
    var context = canvas.getContext('2d');
    context.clearRect(0,0,760,760)
    context.fillStyle=color;
    context.arc(380, 380, 380, 0, 2 * Math.PI);
    context.fill()

    colorLayer = canvas.toDataURL("img/png");
    // let options = {width: 800, height: 800}
    // mergeImages([{ src: link, x: 20, y: 20 }, {src: colorLayer, x: 20, y: 20 }, activeFrame], options)
    // .then(b64 => {
    //     l = b64; 
    // });
    document.getElementById('canvasImg').src = canvas.toDataURL("img/png");
    return canvas.toDataURL("img/png")
}