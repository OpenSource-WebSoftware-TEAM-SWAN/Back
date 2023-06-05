var express = require('express');
var router = express.Router();
const { stringify } = require('querystring');
const { LocalStorage } = require('node-localstorage');
const formidable = require('formidable')
const fs = require('fs');
const localStorage = new LocalStorage('./scratch/contentJSON');
const loginUser = require('./login.js');
const titleArray = require('./swan.js');
const userContent = require('./login.js');
const path = require('path');
const multer = require('multer');
// const upload=multer().none();
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/'); // 파일 저장 경로
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);  // 확장자
      const fileName = file.originalname.slice(0, -ext.length);  // 확장자를 제외한 파일 이름
      cb(null, fileName + '_' + Date.now() + ext);  // 날짜를 붙여 고유성 + 확장자
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});



router.get('/', function (req, res, next) {
  const headTitle = req.query.headTitle; // 쿼리 파라미터 headTitle 값
  const pk = req.query.pk; // 쿼리 파라미터 pk 값

  // headTitle과 pk를 사용하여 필요한 처리 수행
  console.log("userContent module Load : " + titleArray);
  // console.log("loginUser module Load : " + loginUser);

  res.render('bucket', { headTitle: headTitle, pk: pk, userContent: userContent, loginUser: loginUser });
});

// feed 작성 POST 요청을 처리하는 핸들러 함수
router.post('/writeFeed',upload.single('feedImage'), (req, res) => {
  const form = new formidable.IncomingForm();
  // 파일 업로드 설정
  form.uploadDir = path.join(__dirname, '../uploads'); // 파일이 저장될 디렉토리 설정
  form.keepExtensions = true; // 파일 확장자 유지

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      res.sendStatus(500); // 오류 응답
      return;
    }

    // 파일 업로드 완료 후의 로직 수행
    const feedGoal = fields.feedGoal;
    const feedMemo = fields.feedMemo;
    const feedImg = files.feedImage; // 업로드된 파일 정보

    let currentFeed = localStorage.getItem("feed");
    console.log(currentFeed);
    if (currentFeed) {
      currentFeed = JSON.parse(currentFeed);
      currentFeed.push({ subTitlePK: 1, feedGoal: feedGoal, feedMemo: feedMemo, feedImg: [feedImg] })
    }
    else {
      currentFeed = [{ subTitlePK: 1, feedImg: feedGoal, feedMemo: feedMemo, feedImg: [feedImg] }];
    }
    localStorage.setItem('feed', JSON.stringify(currentFeed));


    res.sendStatus(200); // 성공적인 응답을 보낼 경우
  });
});

module.exports = router;
