import request              from 'superagent';
import { Anime, AnimeData } from './display/Anime';
import PhotoQueue           from './endroll/PhotoQueue';
import PhotoManager         from './display/PhotoManager';
import RandManager          from './display/RandManager';
import AnimeManager         from './display/AnimeManager';

const allPhotoList = [];
const INTERVAL = 20;

const ANGLE_D = 0.3;
const CUT_WIDTH_PER = 0.8;
const CUT_HEIGHT_PER = 0.2;

let CENTER_Y;
let R;
let CENTER_ANGLE;

let animes = {};

window.onload = async ()=>{
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cutWidth = canvas.width * CUT_WIDTH_PER;
    const cutHeight = canvas.height * CUT_HEIGHT_PER;
    R = calcPos(cutWidth, cutHeight).r;
    CENTER_Y = calcPos(cutWidth, cutHeight).centerY;
    CENTER_ANGLE = Math.asin((cutWidth / 2) / R) / Math.PI * 180;

    const photoQueue = new PhotoQueue();
    const photos = await reloadPhotos(photoQueue);

    const ctx = canvas.getContext('2d');

    // ctx.translate(parseInt(canvas.width / 2), parseInt(canvas.height / 2));
    ctx.translate(parseInt(canvas.width / 2), parseInt(canvas.height + CENTER_Y));

    const angleManagers = {
        front : new AngleManager({ctx, angleD: ANGLE_D}),
        back : new AngleManager({ctx, angleD: ANGLE_D}),
        sky : new AngleManager({ctx, angleD: ANGLE_D * 0.3}),
    }

    animes = await AnimeData.loadAnimes(canvas, cutWidth, cutHeight);
    const animeManagers = {
        front: new AnimeManager({
            animes      : [animes.bush, animes.fence, animes.post, animes.stone],
            startAngle  : -CENTER_ANGLE,
            endAngle    : CENTER_ANGLE * 2,
            angleD      : ANGLE_D,
        }),
        back: new AnimeManager({
            animes      : [animes.pine, animes.tree, animes.pine2, animes.tree2],
            startAngle  : -CENTER_ANGLE,
            endAngle    : CENTER_ANGLE * 2,
            angleD      : ANGLE_D,
        }),
        photo: new PhotoManager({
            photoQueue  : photoQueue,
            maxHeight   : (canvas.height + CENTER_Y - R) * 0.8,
            startAngle  : -CENTER_ANGLE,
            endAngle    : CENTER_ANGLE * 2,
            angleD      : ANGLE_D,
        }),
        sky: new AnimeManager({
            animes      : [animes.bird, animes.cloud, animes.bird2, animes.cloud2],
            startAngle  : -CENTER_ANGLE,
            endAngle    : CENTER_ANGLE * 2,
            angleD      : ANGLE_D * 0.3,
        }),
    }
    Object.keys(animeManagers).forEach((name)=>{
        animeManagers[name].init();
    })

    draw(
        canvas,
        angleManagers,
        animeManagers,
        new RandManager({min: 1, max: 10}),
        new RandManager({min: 0, max: 3}),
    );
}

function draw(canvas, angleManagers, animeManagers, randMargin, randObjects){
    const ctx = canvas.getContext('2d');

    ctx.clearRect(
        -( canvas.height + CENTER_Y),
        -( canvas.height + CENTER_Y),
        ( canvas.height + CENTER_Y) * 2,
        ( canvas.height + CENTER_Y) * 2
    );

    randMargin.reset();
    randObjects.reset();

    ctx.restore();

    // --------------------------------------------------------
    // 空
    // --------------------------------------------------------

    const skyHeight = (canvas.height + CENTER_Y - R);
    const skyAnimes = animeManagers.sky.getAnimes();
    skyAnimes.forEach((skyAnime)=>{
        ctx.save();
        drawImageOnEarth(angleManagers.sky, ctx, (skyAnime.currentAngle + skyAnime.randAngle), 0, skyHeight - skyAnime.getImg().height, skyAnime.getImg());
        ctx.restore();
    })

    // --------------------------------------------------------
    // 背景・写真
    // --------------------------------------------------------

    const photoAnimes = animeManagers.photo.getAnimes();
    photoAnimes.forEach((photoAnime)=>{
        ctx.save();
        drawPhotoOnEarth(angleManagers.back, ctx, (photoAnime.currentAngle + photoAnime.randAngle), 0, (canvas.height + CENTER_Y - R) * 0.1, photoAnime.img, animes.pole.getImg());
        ctx.restore();
    })

    const backAnimes = animeManagers.back.getAnimes();
    backAnimes.forEach((backAnime)=>{
        ctx.save();
        drawImageOnEarth(angleManagers.back, ctx, (backAnime.currentAngle + backAnime.randAngle), 0, - backAnime.getImg().height * 0.1, backAnime.getImg());
        ctx.restore();
    })



    // --------------------------------------------------------
    // 地面、車
    // --------------------------------------------------------

    ctx.save();

    ctx.drawImage(
        animes.land.getImg(),
        -(animes.land.getImg().width / 2),
        -R,
        animes.land.getImg().width,
        animes.land.getImg().height
    );
    ctx.drawImage(
        animes.car.getImg(),
        -(animes.car.getImg().width / 2),
        -R - animes.car.getImg().height + (animes.car.getImg().height * 0.3),
        animes.car.getImg().width,
        animes.car.getImg().height
    );

    ctx.restore();

    // --------------------------------------------------------
    // 前景
    // --------------------------------------------------------

    const frontAnimes = animeManagers.front.getAnimes();
    frontAnimes.forEach((frontAnime)=>{
        ctx.save();
        drawImageOnEarth(angleManagers.front, ctx, (frontAnime.currentAngle + frontAnime.randAngle), 0, - frontAnime.getImg().height / 2 + frontAnime.top, frontAnime.getImg());
        ctx.restore();
    })

    // --------------------------------------------------------
    // 完了
    // --------------------------------------------------------

    ctx.save();

    setTimeout(draw, INTERVAL, canvas, angleManagers, animeManagers, randMargin, randObjects);
}

function drawImageOnEarth(angleManager, ctx, angle, x, y, img){
    const r = R + y;

    const width = img.width;
    const height = img.height;

    angleManager.rotate(-angle);

    const centerAngle = Math.asin((width / 2) / r) / Math.PI * 180
    angleManager.rotate(-centerAngle);

    ctx.drawImage(
        img,
        (-width / 2) + x,
        -(R + y - (r - Math.sqrt((r*r) - (width * width / 4)))) - height,
        width,
        height
    );

    angleManager.rotate(-centerAngle);
}

function drawPhotoOnEarth(angleManager, ctx, marginAngle, x, y, photo, pole){
    const r = R + y;

    angleManager.rotate(-marginAngle);

    const centerAngle = Math.atan((photo.width / 2) / r) / Math.PI * 180
    angleManager.rotate(-centerAngle);

    ctx.drawImage(
        pole,
        (-pole.width / 2) + x,
        -R - pole.height + pole.height * 0.1,
        pole.width,
        pole.height
    );

    ctx.drawImage(
        photo,
        (-photo.width / 2) + x,
        -r - photo.height,
        photo.width,
        photo.height
    );

    angleManager.rotate(-centerAngle);
}

function calcDrawPosSync(x, y, width, height){
    const r = R + y;
    return [
        (-width / 2) + x,
        R + y - (r - Math.sqrt((r*r) - (width * width / 4))),
        width,
        height
    ]
}

function calcPos(cutWidth, cutHeight){
    const r = cutHeight / 2 + (cutWidth * cutWidth) / (8 * cutHeight);
    const centerY = r - cutHeight;

    return {r, centerY}
}

class AngleManager{
    constructor(config){
        this.ctx = config.ctx
        this.angleD = config.angleD;
        const START_MARGIN_ANGLE = 10;
        this.baseAngle = CENTER_ANGLE + START_MARGIN_ANGLE;
    }

    rotateAbsolute(){
        this.baseAngle += this.angleD;
        if(this.baseAngle > 360){
            this.baseAngle = 0;
        }
        this.ctx.rotate( -this.baseAngle * Math.PI / 180 ) ;
    }

    rotate(angle){
        this.ctx.rotate( -angle * Math.PI / 180 ) ;
    }
}

async function reloadPhotos(photoQueue, photoIndex = 0){
    const result = await getPhotos(photoIndex);
    if( result.photos && result.photos.length ){
        if(photoIndex === 0){
            photoQueue.addAndShufflePhotos(result.photos);
        }else{
            photoQueue.addPhotos(result.photos);
        }
    }
    setTimeout(reloadPhotos, 10000, photoQueue, result.index);
}

async function getPhotos(photoIndex = 0){
    const result = await request
        .get(`/api/photo`)
        .query({index: photoIndex})
        .set('Content-Type', 'application/json')
        .catch((error)=>{
            console.error({
                error,
                message: 'failed to get image'
            });
            throw error;
        })
    return result.body;
}
