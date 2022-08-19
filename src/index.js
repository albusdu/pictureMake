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
    frame8
} from './assets/frames';

const frames = [frame1,frame2,frame3,frame4,frame5,frame6,frame7,frame8]
let activeFrame = frames[0];
let link = '';
let l ='';
let el = document.getElementById('vanilla-demo');
let vanilla = null;
let timer;

let img = document.createElement('img');
img.style.cssText = 'position: absolute; top: -5px; left: -5px; width: 260px; height: 260px; z-index: 1;pointer-events: none;'
document.querySelectorAll('.frame').forEach((item,index)=> {
    item.src = frames[index]
    item.addEventListener('click', ()=> {
        activeFrame = frames[index];
        let options = {width: 800, height: 800};
        l = '';

        img.src = frames[index]
        document.querySelector('.cr-boundary').append(img)

        mergeImages([{ src: link, x: 20, y: 20 }, activeFrame], options)
            .then(b64 => {
                l = b64; 
                document.querySelector('.preview').src = l;
            });
    })
})
document.querySelector('input[type="file"]').addEventListener('change', function() {
    if (this.files && this.files[0]) {
        link =  URL.createObjectURL(this.files[0]);
        if(vanilla){
            vanilla.destroy()
        }
        vanilla = new Croppie(el, {
            viewport: { width: 250, height: 250, type: 'circle' },
            boundary: { width: 250, height: 250 },
            showZoomer: true,
        });
        croppieF(link);
    }
});
function croppieF(lk){
    img.src = activeFrame;
    document.querySelector('.cr-boundary').append(img)
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
                        document.querySelector('.preview').src = l;
                    });
                
            })
        }, 400)
    });
}

document.querySelector('#btn').addEventListener('click', ()=> {
    downloadImage(l,'download')
})