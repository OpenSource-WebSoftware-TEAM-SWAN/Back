var express = require('express');
var router = express.Router();
// const bodyParser = require('body-parser');
// const localStorage = require('localstorage');
// const fs=require('fs');
const { stringify } = require('querystring');
const { LocalStorage } = require('node-localstorage');
const fs = require('fs');
const crypto = require('crypto');
const { loadavg } = require('os');
const cookieParser=require('cookie-parser');
const session = require('express-session');
let loginUser;

// 로컬 스토리지 인스턴스 생성
const localStorage = new LocalStorage('./scratch/userJSON');
const contnetLocalStorage = new LocalStorage('./scratch/contentJSON');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('about');
});
router.get('/login', function (req, res, next) {
  res.render("login");
});
router.get('/signup', function (req, res, next) {
  res.render("signup");
});
/* POST reigster page */
router.post('/register', function (req, res) {
  const email = req.body.signUpID;
  const pw = req.body.signUpPW;
  const name = req.body.signUpName;

  let userArray = [];
  let maxPk = 0;


  let checkUserJson = localStorage.getItem("user");
  if (checkUserJson) {
    console.log(checkUserJson);
    userArray = JSON.parse(checkUserJson);
    // 현재 사용자 리스트에서 가장 큰 pk 값을 찾음
    userArray.forEach((user) => {
      if (user.pk > maxPk) {
        maxPk = user.pk;
      }
    });
  }

  const newUser = {
    pk: maxPk + 1,
    email: email,
    pw: pw,
    name: name
  };
  userArray.push(newUser);

  localStorage.setItem("user", JSON.stringify(userArray));

  // res.sendStatus(200);

  res.send('<script>alert("회원가입에 성공했습니다."); window.location.href="/";</script>');
});

//홈 버튼 눌렀을때
router.get('/swan', function (req, res) {
  let userContent=getUserContent();
  const images=getUserImages();
  res.render('swan',{userName:loginUser.name,userContent:userContent,images:images});
});

router.post('/swan', function (req, res) {
  const email = req.body.userID;
  const pw = req.body.userPW;
  let labels = [];
  let data = [];

  const userJSONFile = fs.readFileSync('./scratch/userJSON/user', 'utf-8');
  const userArray = JSON.parse(userJSONFile);
  let userContent = [];
  
  userArray.forEach((user) => {
    if (user.email === email && user.pw === pw) {
      loginUser = user;
      
      return;
    }

  });

  if (loginUser) {
    // 로그인 성공
    const authUser = loginUser.pk; // loginUser 객체에서 pk 속성에 접근하여 authUser 변수에 할당

    let titleArray = [];
    

    let checkTitleJson = contnetLocalStorage.getItem("title");
    

    if (checkTitleJson) {
      titleArray = JSON.parse(checkTitleJson);
    
      titleArray.forEach((title) => {
        if (title.userPK === authUser) {
          userContent.push(title);
        }
      });
    const postingImages=getUserImages();
    req.session.loginUser=loginUser;
      module.exports = { loginUser, userContent };      
      res.render('swan', { userName: loginUser.name, userContent: userContent, images:postingImages});
    }
    
    
  } else {
    // 로그인 실패
    res.send("<script>alert('로그인 실패');window.location.href='/'</script>");
  }
});

router.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
});

router.get('/swan/chart/data',function(req,res){
  let labels=[];
  let data=[];
  let userContent=[];

  userContent=getUserContent();
  userContent.forEach(title => {
    labels.push(title.headTitle);
    data.push(title.goalRate*100);
  })
  res.json({labels:labels,data:data})
});
// router.get('',function{
//   const userImages = contnetLocalStorage.getItem('feed');

// });
function getUserContent(){
  let checkTitleJson = contnetLocalStorage.getItem("title");
  let titleArray = JSON.parse(checkTitleJson);
  let userContent=[];
      titleArray.forEach((title) => {
        if (title.userPK === loginUser.pk) {
          userContent.push(title);
        }
      });
  return userContent;
}
function getUserImages(){
  let checkFeedJson=contnetLocalStorage.getItem('feed');
  let feedArray=JSON.parse(checkFeedJson);
  const feedImages=feedArray.filter(feed=>feed.userPK===loginUser.pk);
  return feedImages;
}
module.exports = router;
