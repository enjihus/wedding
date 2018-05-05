export class PhotoQueue{
    constructor(){
        this.allPhotos = [];
        this.priorityPhotos = [];
        this.tmpPhotos = [];
    }
    shift(){
        if(this.tmpPhotos.length === 0){
            this.tmpPhotos = this.allPhotos.concat();
        }
        if(this.priorityPhotos.length > 0){
            return this.priorityPhotos.shift();
        }
        return this.tmpPhotos.shift();
    }
    addAndShufflePhotos(photos){
        const tmpPhotos = photos.concat();
        tmpPhotos.sort(()=>{
            return Math.floor( Math.random() * 2 ) - 0.5
        })
        this.allPhotos = this.allPhotos.concat(tmpPhotos);
    }
    addPhotos(photos){
        // this.allPhotos = (photos || []).concat(this.allPhotos);
        this.allPhotos = photos.concat(this.allPhotos);
    }
}

export default PhotoQueue
