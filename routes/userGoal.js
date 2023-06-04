var express = require('express');
var router = express.Router();
const { stringify } = require('querystring');
const { LocalStorage } = require('node-localstorage');
const fs = require('fs');
const localStorage = new LocalStorage('./scratch/contentJSON');
const loginUser = require('./login.js');
const titleArray = require('./swan.js');
const userContent = require('./login.js');
const path=require('path');
const multer=require('multer');
// const upload=multer().none();
const upload=multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);  // 확장자
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);  // 날짜를 붙여 고유성
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/', function(req, res, next) {
  const headTitle = req.query.headTitle; // 쿼리 파라미터 headTitle 값
  const pk = req.query.pk; // 쿼리 파라미터 pk 값

  // headTitle과 pk를 사용하여 필요한 처리 수행
  console.log("userContent module Load : " + titleArray);
  // console.log("loginUser module Load : " + loginUser);

  res.render('bucket', { headTitle: headTitle, pk: pk, userContent: userContent, loginUser: loginUser });
});

// POST 요청을 처리하는 핸들러 함수
router.post('/writeFeed', upload.single("goalImg"),async(req, res) =>{
  // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
  const feedName = req.body.feedGoal;
  const feedMemo = req.body.feedMemo;
  const feedImg = req.file;

  // 데이터를 저장하는 로직
  let currentFeed = localStorage.getItem('feed');
  if (currentFeed) {
    currentFeed = JSON.parse(currentFeed);
    currentFeed.push({ subTitlePK: 1, feedName: feedName, feedMemo: feedMemo, feedImg: [feedImg] });
  } else {
    currentFeed = [{ subTitlePK: 1, feedName: feedName, feedMemo: feedMemo, feedImg: [feedImg] }];
  }

  localStorage.setItem('feed', JSON.stringify(currentFeed));
  // res.redirect('/user/goal');
  res.sendStatus(200); // 성공적인 응답을 보낼 경우
});

module.exports = router;
