const MOVE_D = 1.5;
const TITLE_SIZE = 30;
const NAME_SIZE = 50;

export class NameProcessor{
    constructor(config){
        this.names = [];
        this.canvas = config.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.wait = 0;
        this.d = 0;
        this.finish = false;
    }

    init(){
        this.names.push(new Name({title: '', name: ''}));

        this.names.push(new Name({title: '新郎友人', name: '中　村　　将　吾　様'}));
        this.names.push(new Name({title: '新郎友人', name: '和久津　　駿　也　様'}));
        this.names.push(new Name({title: '新郎友人', name: '和　田　　祐　紀　様'}));

        this.names.push(new Name({title: '', name: ''}));
        this.names.push(new Name({title: '', name: ''}));

        this.names.push(new Name({title: '新郎友人', name: '大　野　　悠　人　様'}));
        this.names.push(new Name({title: '新郎友人', name: '山　内　　一　輝　様'}));

        this.names.push(new Name({title: '', name: ''}));
        this.names.push(new Name({title: '', name: ''}));

        this.names.push(new Name({title: '新郎友人', name: '岩　本　　稜　平　様'}));
        this.names.push(new Name({title: '新郎友人', name: '大　谷　　洋　一　様'}));

        this.names.push(new Name({title: '', name: ''}));
        this.names.push(new Name({title: '', name: ''}));

        this.names.push(new Name({title: '新郎叔母', name: '堀　野　　清　子　様'}));
        this.names.push(new Name({title: '新郎叔母', name: '中　野　　久美枝　様'}));

        this.names.push(new Name({title: '', name: ''}));
        this.names.push(new Name({title: '', name: ''}));

        this.names.push(new Name({title: '新郎伯父', name: '平　山　　康　允　様'}));
        this.names.push(new Name({title: '新郎伯母', name: '井　上　　初　江　様'}));

        this.names.push(new Name({title: '', name: ''}));
        this.names.push(new Name({title: '', name: ''}));

        this.names.push(new Name({title: '新郎伯父', name: '平　山　　良　治　様'}));
        this.names.push(new Name({title: '新郎伯母', name: '平　山　　康　子　様'}));

        this.names.push(new Name({title: '', name: ''}));
        this.names.push(new Name({title: '', name: ''}));

        this.names.push(new Name({title: '新郎伯父', name: '内　田　　道　孝　様'}));
        this.names.push(new Name({title: '新郎伯母', name: '内　田　　美　鈴　様'}));


        this.names.push(new Name({title: '', name: ''}));
        this.names.push(new Name({title: '', name: ''}));

        this.names.push(new Name({title: '新郎従兄', name: '平　山　　　亨　　様'}));
        this.names.push(new Name({title: '新郎従姉', name: '平　山　　ま　ゆ　様'}));

        this.names.push(new Name({title: '', name: ''}));
        this.names.push(new Name({title: '', name: ''}));

        this.names.push(new Name({title: '新郎従兄', name: '一　関　　和　行　様'}));
        this.names.push(new Name({title: '新郎従姉', name: '一　関　　彩　子　様'}));
        this.names.push(new Name({title: '新郎従姪', name: '一　関　　花　菜　ちゃん'}));

        this.names.push(new Name({title: '', name: ''}));
        this.names.push(new Name({title: '', name: ''}));

        this.names.push(new Name({title: '新郎父', name: '堀　野　　春　雄'}));
        this.names.push(new Name({title: '新郎母', name: '堀　野　　みどり'}));

        this.names.push(new Name({title: '', name: ''}));
        this.names.push(new Name({title: '', name: ''}));

        this.names.push(new Name({title: '新婦友人', name: '大　原　　理　恵　様'}));
        this.names.push(new Name({title: '新婦友人', name: '長　沢　　研　作　様'}));
        this.names.push(new Name({title: '新婦友人', name: '松　本　　駿　亮　様'}));
        this.names.push(new Name({title: '新婦友人', name: '溝呂木　　咲　希　様'}));
        this.names.push(new Name({title: '新婦友人', name: '渡　部　　　亮　　様'}));

        this.names.push(new Name({title: '', name: ''}));
        this.names.push(new Name({title: '', name: ''}));

        this.names.push(new Name({title: '新婦友人', name: '植　松　　佑　亮　様'}));
        this.names.push(new Name({title: '新婦友人', name: '倉　田　　晃　佑　様'}));
        this.names.push(new Name({title: '新婦友人', name: '柴　崎　　友　紀　様'}));
        this.names.push(new Name({title: '新婦友人', name: '直　井　　見　和　様'}));
        this.names.push(new Name({title: '新婦友人', name: '原　川　　卓　也　様'}));
        this.names.push(new Name({title: '新婦友人', name: '三　星　　早　紀　様'}));
        this.names.push(new Name({title: '新婦友人', name: '安　田　　智　美　様'}));

        this.names.push(new Name({title: '', name: ''}));
        this.names.push(new Name({title: '', name: ''}));

        this.names.push(new Name({title: '新婦友人', name: '有　泉　　誠　浩　様'}));
        this.names.push(new Name({title: '新婦友人', name: '岩　澤　　幸　輝　様'}));
        this.names.push(new Name({title: '新婦友人', name: '江　田　　瑠　花　様'}));
        this.names.push(new Name({title: '新婦友人', name: '大　里　　恭　平　様'}));
        this.names.push(new Name({title: '新婦友人', name: '大　里　　千　恵　様'}));
        this.names.push(new Name({title: '新婦友人', name: '藤　嶋　　和　紀　様'}));
        this.names.push(new Name({title: '新婦友人', name: '森　川　　　泉　　様'}));

        this.names.push(new Name({title: '', name: ''}));
        this.names.push(new Name({title: '', name: ''}));

        this.names.push(new Name({title: '新婦妹', name: '長　岡　　理花子 様'}));
        this.names.push(new Name({title: '新婦友人', name: '荒　木　　淳　美　様'}));

        this.names.push(new Name({title: '', name: ''}));
        this.names.push(new Name({title: '', name: ''}));

        this.names.push(new Name({title: '新婦父', name: '長　岡　　宏　典'}));
        this.names.push(new Name({title: '新婦母', name: '長　岡　　佐登子'}));
    }

    async makeImage(name){

        const result = Object.assign({}, photo);
        this.photoStock.push(result);
        const img  = new Image();
        context.fillText(text, this.canvas.width * 0.05, this.canvas.height, this.canvas.width * 0.9)
        result.img = img;
        result.width = this.canvas.width;
        result.height = this.canvas.width / photo.width * photo.height;

        return result;
    }

    process(){
        if(this.finish){
            this.ctx.fillText(
                'ありがとうございました！',
                this.canvas.width * 0.05,
                this.canvas.height / 2 + 20,
                this.canvas.width * 0.9
            )
            return;
        }

        let namesHeight = 0;
        let lastBottom = 0;
        this.names.forEach((name)=>{
            this.ctx.font = `${TITLE_SIZE}px 'うずらフォント'`;
            this.ctx.color = '#333333';
            this.ctx.fillText(
                name.title,
                this.canvas.width * 0.05,
                this.canvas.height + namesHeight - this.d + TITLE_SIZE,
                this.canvas.width * 0.9
            )

            this.ctx.font = `bold ${NAME_SIZE}px 'うずらフォント'`;
            this.ctx.color = '#333333';
            this.ctx.fillText(
                name.name,
                this.canvas.width * 0.05,
                this.canvas.height + namesHeight - this.d + TITLE_SIZE + NAME_SIZE + 5,
                this.canvas.width * 0.9
            )
            namesHeight += NAME_SIZE + TITLE_SIZE + 70;
            lastBottom = this.canvas.height + namesHeight - this.d + TITLE_SIZE + NAME_SIZE + 5;
        })

        if(lastBottom < 0){
            this.finish = true;
        }

        this.d += MOVE_D;
    }
}

export class Name{
    constructor(config){
        this.title = config.title;
        this.name = config.name;
    }
}

export default NameProcessor
