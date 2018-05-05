const MOVE_D = 10;

export class AnimeManager{

    constructor(config){
        this.animes = config.animes || [];
        this.startAngle = config.startAngle;
        this.endAngle = config.endAngle;
        this.angleD = config.angleD;
        this.angleWidth;
        this.count;
        this.changeCount;
    }

    init(){
        this.angleWidth = (this.endAngle - this.startAngle) / (this.animes.length - 1);
        this.animes.forEach((anime, i)=>{
            anime.currentAngle = this.startAngle + i * this.angleWidth;
            anime.randAngle = this.makeRandAngle();
        })

        this.count = 0;
        this.changeCount = this.angleWidth / this.angleD;
    }

    makeRandAngle(){
        const margin = this.angleWidth * 0.3
        return Math.floor( Math.random() * (margin + 1 + margin) ) -margin;
    }

    getAnimes(){
        this.count++;
        if(this.changeCount < this.count){
            this.count = 0;
            const prevEnd = this.animes[this.animes.length - 1];
            this.rotateAnime();
            const currentEnd = this.animes[this.animes.length - 1];
            currentEnd.currentAngle = prevEnd.currentAngle + this.angleWidth;
            currentEnd.randAngle = this.makeRandAngle();
        }
        this.animes.forEach((anime)=>{
            let angle = anime.currentAngle -= this.angleD;
            if(angle > 360){ angle -= 360 }
            if(angle < 0){ angle += 360 }
            anime.currentAngle = angle;
        });
        return this.animes;
    }

    rotateAnime(){
        this.animes.push(this.animes.shift());
    }
}

export default AnimeManager
