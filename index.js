let link = '';
window.addEventListener('load', function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            var img = document.querySelector('img');
            img.onload = () => {
                URL.revokeObjectURL(img.src);  // no longer needed, free memory
            }
            link =  URL.createObjectURL(this.files[0]);
            img.src = URL.createObjectURL(this.files[0]); // set src to blob url
        }
    });
});
document.querySelector('#btn').addEventListener('click', ()=> {
    downloadImage(link, 'download')
})
function downloadImage(url, name){
    fetch(url)
        .then(resp => resp.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            // the filename you want
            a.download = name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(() => alert('An error sorry'));
}

import mergeImages from '/merge-images';
 console.log(mergeImages)
// mergeImages(['/body.png'])
//   .then(b64 => console.log(b64));

