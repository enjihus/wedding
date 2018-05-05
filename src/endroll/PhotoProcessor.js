const MOVE_D = 5;

export class PhotoProcessor{

    constructor(config){
        this.photos = [];
        this.photoStock = [];
        this.photoQueue = config.photoQueue;
        this.canvas = config.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.d = 0;
    }

    async init(){
        await Promise.all([...Array(8)].map((()=>{
            return this.makeImage(this.photoQueue.shift());
        }).bind(this)));

        [...Array(5)].forEach(()=>{
            this.photos.push(this.photoStock.shift());
        });
    }

    async makeImage(photo){
        const result = Object.assign({}, photo);
        this.photoStock.push(result);
        const img  = new Image();
        await new Promise(function(resolver,rejector){
            img.src = photo.url;
            img.addEventListener("load", function(){ resolver(this) })
            img.addEventListener("error",function(){ rejector(this) })
        })
        result.img = img;
        result.width = this.canvas.width;
        result.height = this.canvas.width / photo.width * photo.height;

        return result;
    }

    process(){
        let photosHeight = 0;
        this.photos.forEach((photo)=>{
            this.ctx.drawImage(
                photo.img,
                0,
                photosHeight - this.d,
                photo.width,
                photo.height
            );
            photosHeight += photo.height;
        })

        this.d += MOVE_D;

        // if first photo is out of display
        if(this.photos[0].height < this.d){
            this.photos.shift();
            this.photos.push(this.photoStock.shift());
            this.d = 0;
            this.makeImage(this.photoQueue.shift());
        }
    }
}

export default PhotoProcessor
