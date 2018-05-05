import request      from 'superagent';
// import noCache      from 'superagent-no-cache';
import express      from 'express';
import bodyParser   from 'body-parser';
import xml2js       from 'xml2js';
import config       from './config.js';
import fs           from 'fs';
import http         from 'http';

const app = express();
const xmlParser = new xml2js.Parser({
    async: false,
});

// 写真サイズが一定大きくても耐えられるように
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit:'50mb', extended: true }));

// api定義
app.use("/api/", (function () {
    var router = (express.Router)();

    router.post("/photo", async (request, response) => {
        const file = request.body.file;
        if (!file) {
            return response.status(400).json(false);
        }

        await postImage(file).catch((error)=>{
            response.status(500).json(error);
        });
        response.status(204).json(true);

    });

    router.get("/photo", async(request, response) => {
        const result = await getImages(request.query.index);
        response.json(result);
    });

    return router;
})());

// .htmlかっこわるいのでとりあえず隠す
const displayContent = fs.readFileSync('./display.html', 'utf8');
app.get('/display', function(req, res) {
    res.send(displayContent);
});

const endrollContent = fs.readFileSync('./endroll.html', 'utf8');
app.get('/endroll', function(req, res) {
    res.send(endrollContent);
});

app.use(express.static('.'));
app.listen(8081, '127.0.0.1');
// app.listen(3000);

console.log("open server");

async function postImage(file){
    const accessToken = await getAccessToken();
    try{
        const result = await request
            .post(`https://picasaweb.google.com/data/feed/api/user/${config.USER_ID}/albumid/${config.ALBUM_ID}`)
            .set('Content-Type', file.includes('image/jpeg') ? 'image/jpeg' : 'image/png')
            .query({
                access_token: accessToken,
            })
            .send(new Buffer(file.replace(/^data:image\/\w+;base64,/, ""), 'base64'));
        console.log("success");
        return result;
    }catch(error){
        console.error({
            message: 'failed to post image',
            error
        });
        throw error;
    }
}

const START_INDEX = 88;
async function getImages(index = 0){
    try{
        const startIndex = parseInt(START_INDEX) + parseInt(index);
        console.log({
            'start-index': startIndex,
            now: new Date().getTime()
        });
        const response = await request
            .get(`https://picasaweb.google.com/data/feed/api/user/${config.USER_ID}/albumid/${config.ALBUM_ID}`)
            // .use(noCache.withQueryStrings)
            .query({
                'start-index': startIndex,
                // 'max-results': new Date().getTime()  - 1520766720000
            })
            .set('Content-Type', 'application/atom+xml')
            .set('If-None-Match', '')
            .set('If-Modified-Since', '')
            .set('Cache-Control', 'private, no-cache, no-store, must-revalidate, max-age=0')
            .set('Pragma', 'no-cache')
            .buffer(true)

            // console.log(response.request);
            // http.get(`http://picasaweb.google.com/data/feed/api/user/${config.USER_ID}/albumid/${config.ALBUM_ID}?alt=json&start-index=${startIndex}&now=${new Date().getTime()}`, (res) => {
            //     let body = '';
            //     res.setEncoding('utf8');
            //
            //     res.on('data', (chunk) => {
            //         body += chunk;
            //     });
            //
            //     res.on('end', (res) => {
            //       res = JSON.parse(body);
            //       if(res.feed.entry){
            //           console.log("ある");
            //           console.log(res.feed.entry.length);
            //       }else{
            //           console.log("ない");
            //       }
            //     });
            //     }).on('error', (e) => {
            //     console.log(e.message); //エラー時
            // });

        const resultData = await new Promise((resolve, reject) => {
             xmlParser.parseString(response.text, (err, result) => {
                 if (err){
                     reject(err);
                 }else{
                     resolve(result);
                 }
            })
        });
// console.log({startIndex, result:!!resultData.feed.entry});
// console.log(resultData.feed.updated);
        if(!resultData.feed.entry){
            return {
                photos: [],
                index
            };
        }

        const entries = resultData.feed.entry;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

        let validPhotoCount = 0;
        const photos = Object.keys(entries).map((key)=>{
            return {
                timestamp: entries[key]['gphoto:timestamp'],
                width: entries[key]['gphoto:width'],
                height: entries[key]['gphoto:height'],
                url: entries[key]['media:group'][0]['media:content'][0]['$']['url']
            }
        }).filter((photo)=>{
            validPhotoCount++;
            return (
                (!isNaN(photo.width) && photo.width > 0) &&
                (!isNaN(photo.height) && photo.height > 0) &&
                (photo.url && /^http.*/.test(photo.url))
            );
        }).filter((photo)=>{
            return (
                // (today.getTime() < photo.timestamp)
                true
            );
        });

        return {
            photos,
            index: parseInt(index) + parseInt(validPhotoCount)
        };
    }catch(error){
        console.error({
            message: 'failed to get images',
            error
        });
        throw error;
    }
}

async function getAccessToken(){
    try{
        const result = await request
            .post('https://www.googleapis.com/oauth2/v4/token')
            .query({
                refresh_token: config.REFRESH_TOKEN,
                client_id: config.CLIENT_ID,
                client_secret: config.CLIENT_SECRET,
                grant_type: 'refresh_token',
            })
        return result.body.access_token;
    }catch(error){
        console.error({message: 'failed to get the access_token'});
        throw error;
    }
}
