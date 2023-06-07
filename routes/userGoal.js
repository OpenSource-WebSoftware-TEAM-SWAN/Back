var express = require('express');
var router = express.Router();
const { stringify } = require('querystring');
const { LocalStorage } = require('node-localstorage');
const formidable = require('formidable')
const fs = require('fs');
const localStorage = new LocalStorage('./scratch/contentJSON');
const subLocalStorage = new LocalStorage('./scratch/contentJSON');
// let titleArray = require('./swan.js');
var activeSubTitlePK;


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
  const { loginUser, userContent } = require('./login.js');
  // let firstSubTitle;

  // headTitle과 pk를 사용하여 필요한 처리 수행

  // console.log("loginUser module Load : " + loginUser);
  // TODO 대제목에 맞는 소제목 필터
  // 서버 스토리지에서 파일 가져옴
  const getCustomSubTitle = fs.readFileSync('./scratch/contentJSON/subTitle', 'utf-8');
  const getCustomFeed = fs.readFileSync('./scratch/contentJSON/feed', 'utf-8');

  // 각 파일을 JavaScript로 파싱
  const subTitleArray = JSON.parse(getCustomSubTitle);
  const feedArray = JSON.parse(getCustomFeed);
  // console.log(subTitleArray);

  // 첫 번째 subTitle을 가져옴
  activeSubTitlePK = subTitleArray.find(sub => sub.TitlePK === pk);

  console.log(activeSubTitlePK);
  // console.log(""+pk)
  console.log(feedArray);
  // 첫 번째 subTitle의 feedArray를 가져옴
  const filteredFeedArray = feedArray.filter(feed => feed.subTitlePK === activeSubTitlePK.subTitlePK);

  // res.render('bucket', { headTitle: headTitle, pk: pk, userContent: userContent, loginUser: loginUser });
  console.log(filteredFeedArray);
  res.render('bucket', { headTitle: headTitle, userContent: userContent, loginUser: loginUser, feedArray: filteredFeedArray });
});



router.get('/custom/goal',(req,res,next)=>{
  console.log(req.body);
  const subTitlePK=req.body.subTitlePK;
  console.log(subTitlePK);
  // const userJSONFile = fs.readFileSync('./scratch/userJSON/user', 'utf-8');
  // const userArray = JSON.parse(userJSONFile);
  const getCustomFeed=fs.readFileSync('./scratch/contentJSON/feed','utf-8');
  const feedArray=JSON.parse(getCustomFeed);
  console.log(feedArray);
  const filteredFeedArray = feedArray.filter(feed => {console.log(feed);feed.subTitlePK === subTitlePK});
  console.log(filteredFeedArray);
  res.json({feedArray:filteredFeedArray});

});

// feed 작성 POST 요청을 처리하는 핸들러 함수
router.post('/writeFeed', upload.single('feedImage'), (req, res) => {
  const form = new formidable.IncomingForm();
  // 파일 업로드 설정
  form.uploadDir = path.join(__dirname, '../uploads'); // 파일이 저장될 디렉토리 설정
  form.keepExtensions = true; // 파일 확장자 유지

  // Check if an image file is included
  if (req.file) {
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

      console.log(feedGoal, feedMemo, feedImg);
      let currentFeed = localStorage.getItem('feed');
      if (currentFeed) {
        currentFeed = JSON.parse(currentFeed);
        currentFeed.push({ subTitlePK: activeSubTitlePK, feedGoal: feedGoal, feedMemo: feedMemo, feedImg: [feedImg] });
      } else {
        currentFeed = [{ subTitlePK: activeSubTitlePK, feedImg: feedGoal, feedMemo: feedMemo, feedImg: [feedImg] }];
      }
      localStorage.setItem('feed', JSON.stringify(currentFeed));

      res.sendStatus(200); // 성공적인 응답을 보낼 경우
    });
  } else {
    // No image file included, handle the case accordingly
    const feedGoal = req.body.feedGoal;
    const feedMemo = req.body.feedMemo;

    console.log(feedGoal, feedMemo);
    let currentFeed = localStorage.getItem('feed');
    if (currentFeed) {
      currentFeed = JSON.parse(currentFeed);
      currentFeed.push({ subTitlePK: 1, feedGoal: feedGoal, feedMemo: feedMemo, feedImg: [] });
    } else {
      currentFeed = [{ subTitlePK: 1, feedGoal: feedGoal, feedMemo: feedMemo, feedImg: [] }];
    }
    localStorage.setItem('feed', JSON.stringify(currentFeed));

    res.sendStatus(200); // 성공적인 응답을 보낼 경우
  }
});


// 소제목 추가 버튼 클릭 post이벤트
router.post('/post/subTitle',function(req,res){
  
  const obj=JSON.parse(JSON.stringify(req.body));
  console.log(obj);
  let subTitlePK=obj.subTitlePK;
  let subTitle=obj.subTitle;
  const TitlePK = req.query.pk; // 쿼리 파라미터 pk 값
  
  console.log(subTitlePK,subTitle,TitlePK);
  const subTitleData={
    subTitlePK:subTitlePK,
    TitlePK:TitlePK,
    subTitle:subTitle
  }
  let currentSubTitle = subLocalStorage.getItem("subTitle");
  if (currentSubTitle) {
    currentSubTitle = JSON.parse(currentSubTitle);
    currentSubTitle.push(subTitleData)
  }
  else {
    currentSubTitle = [subTitleData];
  }
  subLocalStorage.setItem('subTitle', JSON.stringify(currentSubTitle));
  res.sendStatus('200');
});

module.exports = router;
