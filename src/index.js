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
document.querySelectorAll('.frame').forEach((item,index)=> {
    item.src = frames[index]
    item.addEventListener('click', ()=> {
        activeFrame = frames[index];
        let options = {width: 800, height: 800};
        l = '';
        mergeImages([{ src: link, x: 20, y: 20 }, activeFrame], options)
            .then(b64 => {
                l = b64; 
                document.querySelector('.preview').src = l;
            });
    })
})

let link = '';
let l ='';
document.querySelector('input[type="file"]').addEventListener('change', function() {
    if (this.files && this.files[0]) {
        // var img = document.querySelector('.img');
        // img.onload = () => {
        //     URL.revokeObjectURL(img.src);  // no longer needed, free memory
        // }
        link =  URL.createObjectURL(this.files[0]);
        test(link)
        // img.src = URL.createObjectURL(this.files[0]); // set src to blob url
    }
});

function test(lk){
    let el = document.getElementById('vanilla-demo');
    let vanilla = new Croppie(el, {
        viewport: { width: 250, height: 250, type: 'circle' },
        boundary: { width: 250, height: 250 },
        showZoomer: true,
    });
    vanilla.bind({
        url: lk,
    });
    document.getElementById('vanilla-demo').addEventListener('update', function(ev) { 
        vanilla.result({type: 'blob', size: { width: 760, height: 760 }}).then((blob)=> {
            const url = window.URL.createObjectURL(blob);
            link = url;

            let options = {width: 800, height: 800}
            l = '';
            mergeImages([{ src: link, x: 20, y: 20 }, activeFrame], options)
                .then(b64 => {
                    l = b64; 
                    document.querySelector('.preview').src = b64;
                });
            
        })
    });
}
document.querySelector('#btn').addEventListener('click', ()=> {
    downloadImage(link,'download')
})