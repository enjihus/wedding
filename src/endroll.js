import request from 'superagent';
import PhotoProcessor from './endroll/PhotoProcessor'
import NameProcessor from './endroll/NameProcessor'
import PhotoQueue from './endroll/PhotoQueue'

const allPhotoList = [];
const INTERVAL = 25;

window.onload = async ()=>{
    const photoQueue = new PhotoQueue();
    const photoCanvas = document.getElementById('photoCanvas');
    photoCanvas.width = window.innerWidth / 2;
    photoCanvas.height = window.innerHeight;

    const photos = await getPhotos();
    console.log({photos});
    photoQueue.addAndShufflePhotos(photos);

    const photoProcessor = new PhotoProcessor({
        canvas: photoCanvas,
        photoQueue
    });

    const nameCanvas = document.getElementById('nameCanvas');
    nameCanvas.width = window.innerWidth / 2;
    nameCanvas.height = window.innerHeight;

    const nameProcessor = new NameProcessor({
        canvas: nameCanvas
    });

    const firstMessage = document.getElementById('firstMessage');

    firstMessage.children[0].classList.remove('hidden');

    Promise.all([
        await photoProcessor.init(),
        await nameProcessor.init(),
        await new Promise(resolve => setTimeout(resolve, 4000)),
    ])

    firstMessage.children[0].classList.add('hidden');

    await new Promise(resolve => setTimeout(resolve, 2000)),

    firstMessage.classList.add('hidden');

    drawPhotos(photoCanvas, photoProcessor);
    drawNames(nameCanvas, nameProcessor);

}

function drawNames(canvas, nameProcessor){
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nameProcessor.process();

    setTimeout(drawNames, INTERVAL, canvas, nameProcessor);
}

function drawPhotos(canvas, photoProcessor){
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    photoProcessor.process();

    setTimeout(drawPhotos, INTERVAL, canvas, photoProcessor);
}

async function getPhotos(){
    const result = await request
        .get(`/api/photo`)
        .buffer(true)
        .query({'index': 0})
        .set('Content-Type', 'application/json')
        .catch((error)=>{
            console.error({
                error,
                message: 'failed to get image'
            });
            throw error;
        })
    return result.body.photos;
}
