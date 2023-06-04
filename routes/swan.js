var express = require('express');
var router = express.Router();
const { stringify } = require('querystring');
const { LocalStorage } = require('node-localstorage');
const fs = require('fs');
const localStorage = new LocalStorage('./scratch/contentJSON');
let titleArray = [];

// console.log(currentUser);
/* GET swan page. */
router.get('/', function (req, res, next) {


  // console.log("get SWAN PAGE: " + userContent);
  res.render('swan');
});

/* 대제목 추가 버튼 클릭 시 post  */
router.post('/sendTitle', function (req, res) {
  const loginUser = require('./login.js');
  const { headTitle } = req.body;
  let maxPk = 0;
  let cnttitleArray = [];

  let checkTitleJson = localStorage.getItem("title");
  if (checkTitleJson) {
    cnttitleArray = JSON.parse(checkTitleJson);

    cnttitleArray.forEach((title) => {
      if (title.titlePK > maxPk) {
        maxPk = title.titlePK;
      }
    });
  }

  let currentTitle = localStorage.getItem('title');
  if (currentTitle) {
    currentTitle = JSON.parse(currentTitle);
    currentTitle.push({ userPK: loginUser.pk, titlePK: maxPk + 1, headTitle: headTitle });
  } else {
    currentTitle = [{ userPK: loginUser.pk, titlePK: maxPk + 1, headTitle: headTitle }];
  }

  localStorage.setItem('title', JSON.stringify(currentTitle));
  res.sendStatus(200);
});

router.get('/getTitlePk', function (req, res) {
  const sendTitlePk = req.query.sendTitlePk; // 클라이언트에서 전달된 sendTitlePk 값
  console.log("send title pk value : " + sendTitlePk);
  let checkTitleJson = localStorage.getItem("title");
  if (checkTitleJson) {
    let titleArray = JSON.parse(checkTitleJson);
    // 여기에서 필요한 처리를 수행하여 title pk 값을 추출합니다
    // 예시로 첫 번째 title의 titlePK 값을 가져오도록 구현합니다
    let receivePk = null;

    titleArray.forEach((title) => {
      if (title.titlePK == sendTitlePk) {
        receivePk = title.titlePK;
        return;
      }
    });

    res.json({ receivePk: receivePk });

  } else {
    res.json({ receivePk: null }); // title이 없을 경우 null 값을 응답합니다
  }

});

router.post('/edit', function (req, res) {
  const { titlePk, newGoalElement, className } = req.body;
  console.log(titlePk, newGoalElement, className);
  let checkTitleJson = localStorage.getItem("title");
  if (checkTitleJson) {
    titleArray = JSON.parse(checkTitleJson);

    titleArray.forEach((title) => {
      if (title.titlePK == titlePk) {
        title.headTitle = newGoalElement;
      }
    });
    console.log(titleArray);
    localStorage.setItem("title", JSON.stringify(titleArray));
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
  // module.exports.titleArray = titleArray;
});


router.get('/convertPage', function (req, res) {
  var titlePK = req.query.titlepk; // 클라이언트에서 전달된 headTitle 값
  var headTitle=req.query.headTitle
  var checkTitleJson = localStorage.getItem("title");
  if (checkTitleJson) {
    var titleArray = JSON.parse(checkTitleJson);
    var contentJSON = null;

    // titleArray에서 headTitle과 일치하는 요소의 contentJSON 값을 가져옵니다
    // titleArray.forEach(function (title) {
    //   if (title.titlePK === titlePK) {
    //     contentJSON = title.contentJSON;
    //     return;
    //   }
    // });
    // 필요한 렌더링 작업을 수행한 후 클라이언트에 응답을 보냅니다
    var url = '/user/goal?headTitle=' + encodeURIComponent(headTitle) + '&pk=' + encodeURIComponent(titlePK);
    res.json({ url:url });
  }
});
;


module.exports = router;
