import AnimeManager from './AnimeManager'
const MOVE_D = 10;

export class PhotoManager extends AnimeManager{

    constructor(config){
        super(config);
        this.photos = [];
        this.photoStock = [];
        this.photoQueue = config.photoQueue;
        this.maxHeight = config.maxHeight;
    }

    async init(){
        await Promise.all([...Array(7)].map((()=>{
            return this.makeImage(this.photoQueue.shift());
        }).bind(this)));

        [...Array(4)].forEach(()=>{
            this.animes.push(this.photoStock.shift());
        });

        super.init();
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

        const per = this.maxHeight / img.height;
        img.width *= per;
        img.height *= per;
        result.img = img;

        return result;
    }

    makeRandAngle(){
        return 0;
    }

    rotateAnime(){
        this.animes.shift();
        this.animes.push(this.photoStock.shift());
        this.makeImage(this.photoQueue.shift());

    }
}

export default PhotoManager
