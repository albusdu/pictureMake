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

const frames = [frame1,frame2,frame3,frame4,frame5,frame6,frame7,frame8,frame9,frame10]
let activeFrame = frames[0];
let link = '';
let l ='';
let el = document.getElementById('vanilla-demo');
let vanilla = null;
let timer;

let disabledFrames = true;

let img = document.createElement('img');
img.style.cssText = 'position: absolute; top: -5px; left: -5px; width: 410px; height: 410px; z-index: 1;pointer-events: none;';
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
        let options = {width: 800, height: 800};
        l = '';
        
        img.src = frames[index]
        el.append(img)
        
        mergeImages([{ src: link, x: 20, y: 20 }, activeFrame], options)
            .then(b64 => {
                l = b64; 
            });
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
    disabledFrames = true;
})
function croppieF(lk){
    img.src = activeFrame;
    zoomIn.src = zoomInIcon
    zoomOut.src = zoomOutIcon
    el.append(img)
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
    
                let options = {width: 800, height: 800}
                l = '';
                mergeImages([{ src: link, x: 20, y: 20 }, activeFrame], options)
                    .then(b64 => {
                        l = b64; 
                    });
                
            })
        }, 400)
    });
}

document.querySelector('#btn').addEventListener('click', ()=> {
    if(l){
        downloadImage(l, 'Mutual Friends PFP')
    }
})

let loader = document.querySelector('.loader');
setTimeout(()=> {
    loader.style.display = 'none'
}, 1400)