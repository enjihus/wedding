export class RandManager{
    constructor(config){
        this.index = 0;
        this.rand = [];
        this.max = config.max || 20;
        this.min = config.min || 1;
    }

    reset(){
        this.index = 0;
    }

    get(){
        if(this.rand.length === this.index){
            this.rand.push(Math.floor( Math.random() * (this.max + 1 - this.min) ) + this.min);
        }
        return this.rand[this.index++];
    }
}

export default RandManager
