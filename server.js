'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var postImage = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(file) {
        var accessToken, result;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return getAccessToken();

                    case 2:
                        accessToken = _context3.sent;
                        _context3.prev = 3;
                        _context3.next = 6;
                        return _superagent2.default.post('https://picasaweb.google.com/data/feed/api/user/' + _config2.default.USER_ID + '/albumid/' + _config2.default.ALBUM_ID).set('Content-Type', file.includes('image/jpeg') ? 'image/jpeg' : 'image/png').query({
                            access_token: accessToken
                        }).send(new Buffer(file.replace(/^data:image\/\w+;base64,/, ""), 'base64'));

                    case 6:
                        result = _context3.sent;

                        console.log("success");
                        return _context3.abrupt('return', result);

                    case 11:
                        _context3.prev = 11;
                        _context3.t0 = _context3['catch'](3);

                        console.error({
                            message: 'failed to post image',
                            error: _context3.t0
                        });
                        throw _context3.t0;

                    case 15:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this, [[3, 11]]);
    }));

    return function postImage(_x5) {
        return _ref3.apply(this, arguments);
    };
}();

var getImages = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var startIndex, response, resultData, entries, now, today, validPhotoCount, photos;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.prev = 0;
                        startIndex = parseInt(START_INDEX) + parseInt(index);

                        console.log({
                            'start-index': startIndex,
                            now: new Date().getTime()
                        });
                        _context4.next = 5;
                        return _superagent2.default.get('https://picasaweb.google.com/data/feed/api/user/' + _config2.default.USER_ID + '/albumid/' + _config2.default.ALBUM_ID)
                        // .use(noCache.withQueryStrings)
                        .query({
                            'start-index': startIndex
                        }).set('Content-Type', 'application/atom+xml').set('If-None-Match', '').set('If-Modified-Since', '').set('Cache-Control', 'private, no-cache, no-store, must-revalidate, max-age=0').set('Pragma', 'no-cache').buffer(true);

                    case 5:
                        response = _context4.sent;
                        _context4.next = 8;
                        return new Promise(function (resolve, reject) {
                            xmlParser.parseString(response.text, function (err, result) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            });
                        });

                    case 8:
                        resultData = _context4.sent;

                        if (resultData.feed.entry) {
                            _context4.next = 11;
                            break;
                        }

                        return _context4.abrupt('return', {
                            photos: [],
                            index: index
                        });

                    case 11:
                        entries = resultData.feed.entry;
                        now = new Date();
                        today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
                        validPhotoCount = 0;
                        photos = Object.keys(entries).map(function (key) {
                            return {
                                timestamp: entries[key]['gphoto:timestamp'],
                                width: entries[key]['gphoto:width'],
                                height: entries[key]['gphoto:height'],
                                url: entries[key]['media:group'][0]['media:content'][0]['$']['url']
                            };
                        }).filter(function (photo) {
                            validPhotoCount++;
                            return !isNaN(photo.width) && photo.width > 0 && !isNaN(photo.height) && photo.height > 0 && photo.url && /^http.*/.test(photo.url);
                        }).filter(function (photo) {
                            return (
                                // (today.getTime() < photo.timestamp)
                                true
                            );
                        });
                        return _context4.abrupt('return', {
                            photos: photos,
                            index: parseInt(index) + parseInt(validPhotoCount)
                        });

                    case 19:
                        _context4.prev = 19;
                        _context4.t0 = _context4['catch'](0);

                        console.error({
                            message: 'failed to get images',
                            error: _context4.t0
                        });
                        throw _context4.t0;

                    case 23:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this, [[0, 19]]);
    }));

    return function getImages() {
        return _ref4.apply(this, arguments);
    };
}();

var getAccessToken = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
        var result;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.prev = 0;
                        _context5.next = 3;
                        return _superagent2.default.post('https://www.googleapis.com/oauth2/v4/token').query({
                            refresh_token: _config2.default.REFRESH_TOKEN,
                            client_id: _config2.default.CLIENT_ID,
                            client_secret: _config2.default.CLIENT_SECRET,
                            grant_type: 'refresh_token'
                        });

                    case 3:
                        result = _context5.sent;
                        return _context5.abrupt('return', result.body.access_token);

                    case 7:
                        _context5.prev = 7;
                        _context5.t0 = _context5['catch'](0);

                        console.error({ message: 'failed to get the access_token' });
                        throw _context5.t0;

                    case 11:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this, [[0, 7]]);
    }));

    return function getAccessToken() {
        return _ref5.apply(this, arguments);
    };
}();

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _xml2js = require('xml2js');

var _xml2js2 = _interopRequireDefault(_xml2js);

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import noCache      from 'superagent-no-cache';
var app = (0, _express2.default)();
var xmlParser = new _xml2js2.default.Parser({
    async: false
});

// 写真サイズが一定大きくても耐えられるように
app.use(_bodyParser2.default.json({ limit: '50mb' }));
app.use(_bodyParser2.default.urlencoded({ limit: '50mb', extended: true }));

// api定義
app.use("/api/", function () {
    var _this = this;

    var router = _express2.default.Router();

    router.post("/photo", function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request, response) {
            var file;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            file = request.body.file;

                            if (file) {
                                _context.next = 3;
                                break;
                            }

                            return _context.abrupt('return', response.status(400).json(false));

                        case 3:
                            _context.next = 5;
                            return postImage(file).catch(function (error) {
                                response.status(500).json(error);
                            });

                        case 5:
                            response.status(204).json(true);

                        case 6:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }());

    router.get("/photo", function () {
        var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(request, response) {
            var result;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return getImages(request.query.index);

                        case 2:
                            result = _context2.sent;

                            response.json(result);

                        case 4:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this);
        }));

        return function (_x3, _x4) {
            return _ref2.apply(this, arguments);
        };
    }());

    return router;
}());

// .htmlかっこわるいのでとりあえず隠す
var displayContent = _fs2.default.readFileSync('./display.html', 'utf8');
app.get('/display', function (req, res) {
    res.send(displayContent);
});

var endrollContent = _fs2.default.readFileSync('./endroll.html', 'utf8');
app.get('/endroll', function (req, res) {
    res.send(endrollContent);
});

app.use(_express2.default.static('.'));
app.listen(8081, '127.0.0.1');
// app.listen(3000);

console.log("open server");

var START_INDEX = 88;

