const ANIME_FRAME = 15;
export class Anime{
    constructor(config){
        this.paths = config.paths;
        this.imgs = [config.paths.length];
        this.count = 0;
        this.index = 0;
        this.frame = config.frame;
        this.width = config.width;
        this.height = config.height;
        this.top = config.top || 0;
        this.currentAngle = config.currentAngle || 0;
        this.angleWidth = config.angleWidth || 0;
    }

    async init(){
        await Promise.all(this.paths.map(((path, i)=>{
            return (async()=>{
                const img  = new Image();
                await new Promise(function(resolver,rejector){
                    img.src = path;
                    img.addEventListener("load", function(){ resolver(this) })
                    img.addEventListener("error",function(){ rejector(this) })
                });
                const per = this.width / img.width;
                img.width = this.width;
                img.height = this.height || per * img.height;
                this.imgs[i] = img;
            })();
        }).bind(this)));
    }

    getImg(){
        if(this.count < this.frame){
            this.count++;
        }else{
            this.count = 0;
            this.index++;
            if(this.index >= this.imgs.length){
                this.index = 0;
            }
        }
        return this.imgs[this.index];
    }
}

export class AnimeData{
    static async loadAnimes(canvas, cutWidth, cutHeight){
        const animes = {
            bird : new Anime({paths: ([...Array(7)].map((key, i)=>{
                return `./img/bird/bird${i + 1}.png`;
            }).concat([...Array(3)].map((key, i)=>{
                return `./img/bird/bird${i + 1}.png`;
            }))), frame: ANIME_FRAME, width: canvas.width * 0.1}),
            bird2 : new Anime({paths: ([...Array(7)].map((key, i)=>{
                return `./img/bird/bird${i + 1}.png`;
            }).concat([...Array(3)].map((key, i)=>{
                return `./img/bird/bird${i + 1}.png`;
            }))), frame: ANIME_FRAME, width: canvas.width * 0.1}),
            bush : new Anime({paths: [...Array(7)].map((key, i)=>{
                return `./img/bush/bush${i + 1}.png`;
            }), frame: ANIME_FRAME, width: canvas.width * 0.1}),
            car : new Anime({paths: [...Array(7)].map((key, i)=>{
                return `./img/car/car${i + 1}.png`;
            }), frame: ANIME_FRAME, width: canvas.width * 0.2}),
            cloud : new Anime({paths: [...Array(7)].map((key, i)=>{
                return `./img/cloud/cloud${i + 1}.png`;
            }), frame: ANIME_FRAME, width: canvas.width * 0.2}),
            cloud2 : new Anime({paths: [...Array(7)].map((key, i)=>{
                return `./img/cloud/cloud${i + 1}.png`;
            }), frame: ANIME_FRAME, width: canvas.width * 0.2}),
            fence : new Anime({paths: [...Array(7)].map((key, i)=>{
                return `./img/fence/fence${i + 1}.png`;
            }), frame: ANIME_FRAME, width: canvas.width * 0.09, top: 13}),
            land : new Anime({paths: [...Array(7)].map((key, i)=>{
                return `./img/land/land${i + 1}.png`;
            }), frame: ANIME_FRAME, width: cutWidth, height: cutHeight}),
            pole : new Anime({paths: [...Array(7)].map((key, i)=>{
                return `./img/pole/pole${i + 1}.png`;
            }), frame: ANIME_FRAME, width: canvas.width * 0.05}),
            pine : new Anime({paths: [...Array(7)].map((key, i)=>{
                return `./img/pine/pine${i + 1}.png`;
            }), frame: ANIME_FRAME, width: canvas.width * 0.11}),
            pine2 : new Anime({paths: [...Array(7)].map((key, i)=>{
                return `./img/pine/pine${i + 1}.png`;
            }), frame: ANIME_FRAME, width: canvas.width * 0.11}),
            post : new Anime({paths: [...Array(7)].map((key, i)=>{
                return `./img/post/post${i + 1}.png`;
            }), frame: ANIME_FRAME, width: canvas.width * 0.05, top: 15}),
            stone : new Anime({paths: [...Array(7)].map((key, i)=>{
                return `./img/stone/stone${i + 1}.png`;
            }), frame: ANIME_FRAME, width: canvas.width * 0.05, top: -15}),
            tree : new Anime({paths: [...Array(7)].map((key, i)=>{
                return `./img/tree/tree${i + 1}.png`;
            }), frame: ANIME_FRAME, width: canvas.width * 0.12}),
            tree2 : new Anime({paths: [...Array(7)].map((key, i)=>{
                return `./img/tree/tree${i + 1}.png`;
            }), frame: ANIME_FRAME, width: canvas.width * 0.12})
        }

        await Promise.all([
            animes.bird.init(),
            animes.bird2.init(),
            animes.bush.init(),
            animes.car.init(),
            animes.cloud.init(),
            animes.cloud2.init(),
            animes.fence.init(),
            animes.land.init(),
            animes.pine.init(),
            animes.pine2.init(),
            animes.pole.init(),
            animes.post.init(),
            animes.stone.init(),
            animes.tree.init(),
            animes.tree2.init(),
        ]);

        return animes;
    }
}


export default Anime
