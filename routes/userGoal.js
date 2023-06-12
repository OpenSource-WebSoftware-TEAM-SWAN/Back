var express = require('express');
var router = express.Router();
const { stringify } = require('querystring');
const { LocalStorage } = require('node-localstorage');
const formidable = require('formidable');
const ejs = require('ejs');
const fs = require('fs');
const localStorage = new LocalStorage('./scratch/contentJSON');
const subLocalStorage = new LocalStorage('./scratch/contentJSON');
// let titleArray = require('./swan.js');
var activeSubTitle;
var activeSubTitlePK;
let filteredFeedArray;


const path = require('path');
const multer = require('multer');

/* 파일 업로드 전처리 */
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'public/uploads/'); // 파일 저장 경로
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);  // 확장자
      const fileName = file.originalname.slice(0, -ext.length);  // 확장자를 제외한 파일 이름
      cb(null, fileName + '_' + Date.now() + ext);  // 날짜를 붙여 고유성 + 확장자
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// bucket.ejs로 이동 시
router.get('/', function (req, res, next) {
  const headTitle = req.query.headTitle; // 쿼리 파라미터 headTitle 값

  const pk = req.query.pk; // 쿼리 파라미터 pk 값
  const { loginUser, userContent } = require('./login.js');
  console.log(userContent);
  // headTitle과 pk를 사용하여 필요한 처리 수행

  // TODO 대제목에 맞는 소제목 필터
  // 서버 스토리지에서 파일 가져옴
  const getCustomSubTitle = fs.readFileSync('./scratch/contentJSON/subTitle', 'utf-8');
  const getCustomFeed = fs.readFileSync('./scratch/contentJSON/feed', 'utf-8');

  // 각 파일을 JavaScript로 파싱
  const subTitleArray = JSON.parse(getCustomSubTitle);
  const feedArray = JSON.parse(getCustomFeed);
  // console.log(subTitleArray);

  // subTitle들을 가져옴
  activeSubTitle = subTitleArray.filter(sub => sub.TitlePK === pk);

  /** 첫 번째 subTitle을 가져온 다음 거기에 맞는 피드들을 보여줌 */

  let activeSubTitlePK = subTitleArray.find(sub => sub.TitlePK === pk);
  console.log(activeSubTitlePK);
  if (activeSubTitlePK) {

    // 첫 번째 subTitle의 feedArray를 가져옴
    activeSubTitlePK = activeSubTitlePK.subTitlePK;
    filteredFeedArray = feedArray.filter(feed => feed.subTitlePK === activeSubTitlePK);
  }
  else {

    filteredFeedArray = [];
  }

  /** end */
  let subTitleNum = activeSubTitle.length;
  console.log("subTitles"+activeSubTitle);
  
  res.render('bucket', { headTitle: headTitle, userContent: userContent, loginUser: loginUser, feedArray: filteredFeedArray, 
    subTitles: activeSubTitle, tabTarget: "1", subTitleNum: subTitleNum ,});
  // res.render('bucket', { headTitle: headTitle, userContent: userContent, loginUser: loginUser,subTitles:activeSubTitle});
});


// feed rendering
router.get('/custom/goal', (req, res, next) => {
  const { loginUser, userContent } = require('./login.js');
  const headTitle = req.query.headTitle; // 쿼리 파라미터 headTitle 값
  const subTitlePK = Number(req.query.subTitlePK);
  const tabTarget = req.query.tabTarget;
  const subTitleNumber = req.query.subTitleNum;
  const checked=req.query.subChecked;
  // console.log(subTitleNumber);
  // console.log("##############"+headTitle);
  // const userJSONFile = fs.readFileSync('./scratch/userJSON/user', 'utf-8');
  // const userArray = JSON.parse(userJSONFile);
  const getCustomFeed = fs.readFileSync('./scratch/contentJSON/feed', 'utf-8');
  const feedArray = JSON.parse(getCustomFeed);
  filteredFeedArray = [];
  feedArray.forEach(feed => {
    if (feed.subTitlePK == subTitlePK) {
      filteredFeedArray.push(feed);
    }
  });
  filteredFeedArray = feedArray.filter(feed => { 
    return feed.subTitlePK == Number(subTitlePK)
  });
  // filteredFeedArray=JSON.stringify(filteredFeedArray);


  ejs.renderFile('./views/goalCard.ejs', { userContent: userContent, loginUser: loginUser, subTitles: activeSubTitle, headTitle: headTitle, feedArray: filteredFeedArray, 
    tabTarget: tabTarget, subTitleNum: subTitleNumber,subChecked:checked}, function (err, renderedHTML) {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(renderedHTML);
  });
});

// feed 작성 POST 요청을 처리하는 핸들러 함수
router.post('/write/feed', upload.single('feedImage'), (req, res) => {
  const { loginUser, userContent } = require('./login.js');
  if (req.file) {
    const feedGoal = req.body.feedGoal;
    const feedMemo = req.body.feedMemo;
    const subTitlePK = req.body.subTitlePK;
    const feedImgPath = "/uploads/" + req.file.filename; // 이미지 파일 경로

    // console.log(subTitlePK,feedGoal, feedMemo, feedImgPath);

    let currentFeed = localStorage.getItem('feed');
    if (currentFeed) {
      currentFeed = JSON.parse(currentFeed);
      currentFeed.push({ userPK:loginUser.pk,subTitlePK: subTitlePK, feedGoal: feedGoal, feedMemo: feedMemo, feedImgPath: feedImgPath });
    } else {
      currentFeed = [{ userPK:loginUser.pk,subTitlePK: subTitlePK, feedGoal: feedGoal, feedMemo: feedMemo, feedImgPath: feedImgPath }];
    }
    localStorage.setItem('feed', JSON.stringify(currentFeed));

    res.sendStatus(200); // 성공적인 응답을 보낼 경우
  } else {
    // No image file included, handle the case accordingly
    const feedGoal = req.body.feedGoal;
    const feedMemo = req.body.feedMemo;
    const subTitlePK = req.body.subTitlePK;

    console.log(feedGoal, feedMemo);

    let currentFeed = localStorage.getItem('feed');
    if (currentFeed) {
      currentFeed = JSON.parse(currentFeed);
      currentFeed.push({ subTitlePK: subTitlePK, feedGoal: feedGoal, feedMemo: feedMemo, feedImgPath: '' });
    } else {
      currentFeed = [{ subTitlePK: subTitlePK, feedGoal: feedGoal, feedMemo: feedMemo, feedImgPath: '' }];
    }
    localStorage.setItem('feed', JSON.stringify(currentFeed));
    res.sendStatus(200); // 성공적인 응답을 보낼 경우
  }
});



// 소제목 추가 버튼 클릭 post이벤트
router.post('/post/subTitle', function (req, res) {

  const obj = JSON.parse(JSON.stringify(req.body));
  console.log(obj);
  let subTitlePK = obj.subTitlePK;
  let subTitle = obj.subTitle;
  const TitlePK = req.query.pk; // 쿼리 파라미터 pk 값

  // console.log(subTitlePK, subTitle, TitlePK);
  const subTitleData = {
    subTitlePK: subTitlePK,
    TitlePK: TitlePK,
    subTitle: subTitle,
    checked:0
  }
  let currentSubTitle = localStorage.getItem("subTitle");
  if (currentSubTitle) {
    currentSubTitle = JSON.parse(currentSubTitle);
    currentSubTitle.push(subTitleData)
  }
  else {
    currentSubTitle = [subTitleData];
  }
  localStorage.setItem('subTitle', JSON.stringify(currentSubTitle));
  res.sendStatus('200');
});

router.post('/sub/edit', function (req, res) {
  const obj = JSON.parse(JSON.stringify(req.body));
  let editSubTitlePK = obj.subPK;
  let editVal = obj.editVal;
  const subTitleFile = localStorage.getItem("subTitle");
  subTitleArray = JSON.parse(subTitleFile);
  subTitleArray.forEach((sub) => {
    if (sub.subTitlePK == editSubTitlePK) sub.subTitle = editVal;
  });
  localStorage.setItem("subTitle", JSON.stringify(subTitleArray));

  res.send('Success');
});

router.post('/goalRate', function (req, res) {
  const obj = JSON.parse(JSON.stringify(req.body));
  console.log(obj);
  calcuGoalRate(obj.titlePK, obj.check_cnt, obj.subNum);

  let subTitles = localStorage.getItem('subTitle');
  subTitles = JSON.parse(subTitles);
  subTitles.forEach(sub => {
    if (sub.subTitlePK === obj.subPK) {
      console.log(sub.subTitle)
      sub.checked = 1;
    }
  });
  localStorage.setItem('subTitle', JSON.stringify(subTitles));
  
  res.sendStatus(200);
});


router.post('/sub/del', function (req, res) {
  const delSubTitlePK = req.body.activeTab;
  const titlePK=req.body.titlePK;
  const subNum=req.body.subNum;

  let subTitles = localStorage.getItem("subTitle");
  subTitles = JSON.parse(subTitles);
  let newSubTitles = subTitles.filter(sub => sub.subTitlePK !== delSubTitlePK);
  
  newSubTitles = JSON.stringify(newSubTitles);
  console.log(newSubTitles);
  localStorage.setItem("subTitle", newSubTitles);
  // TODO 삭제 시 달성률 재계신 필요
  // $.post('/user/goal/sub/del',{activeTab:activeTab,subNum:$('.nav-link.custom-button').length,titlePK:titlePK},function(response){

  // 달성률 재계산
  let cnt=0;
  subTitles.forEach(sub=>{
    if(sub.checked===1)cnt++;
  })
  console.log(titlePK,cnt,subNum);
  calcuGoalRate(titlePK,cnt,subNum);
  
});
function calcuGoalRate(titlePK,check_cnt,subNum){
  const titleFile = localStorage.getItem("title");
  let titleArray = JSON.parse(titleFile);
  titleArray.forEach((title) => {
    if (title.titlePK == titlePK) {
      title.goalRate = parseFloat(Number(check_cnt) / Number(subNum)).toPrecision(2);
      return;
    }
  });
  localStorage.setItem("title", JSON.stringify(titleArray));
}
module.exports = router;
