var express = require('express');
var router = express.Router();
// const bodyParser = require('body-parser');
// const localStorage = require('localstorage');
// const fs=require('fs');
const { stringify } = require('querystring');
const { LocalStorage } = require('node-localstorage');
const crypto = require('crypto');
const fs=require('fs');
// 로컬 스토리지 인스턴스 생성
const localStorage = new LocalStorage('./scratch');

// 파일 구조 //
var headings = {
  'Title1': {
    'subTitle2': {
      'feed':
      {
        'title': 'test title',
        'content': 'test content',
        'image': 'test image'
      }
    }
  }
}


// 문자열 랜덤 생성 함수
// function generateRandomString(length) {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   const charactersLength = characters.length;
//   let result = '';

//   const randomBytes = crypto.randomBytes(length);
//   for (let i = 0; i < length; i++) {
//     const index = randomBytes[i] % charactersLength;
//     result += characters.charAt(index);
//   }

//   return result;
// }




/* GET home page. */
router.get('/', function (req, res, next) {
  
  res.render('login');
});

/* POST reigster page */
router.post('/register', function (req, res) {
  const email = req.body.signUpID;
  const pw = req.body.signUpPW;
  const name = req.body.signUpName;

  let userCnt;
  let maxCnt=0;
  const files = fs.readdirSync('./scratch');
  files.forEach((user) => {
    let temp = Number(user.slice(4));
    if (maxCnt < temp) maxCnt = temp;
  });

 
  
  localStorage.setItem("user"+(maxCnt+1), JSON.stringify({ 'email': email, 'pw': pw, 'name': name }))
  // localStorage.setItem("userEmail", email);
  // localStorage.setItem("userPw", pw);
  // localStorage.setItem("userName", name);


  res.send('<script>alert("회원가입에 성공했습니다."); window.location.href="/";</script>');

});
router.post('/swan', function (req, res) {
  console.log(req.body);
  const email = req.body.userID;
  const pw = req.body.userPW;
  let userCnt;
  let loginUser
  // const storedEmail = localStorage.getItem('userEmail');
  // const storedPw = localStorage.getItem('userPw');
  const files = fs.readdirSync('./scratch');
  files.forEach((user) => {
    if(JSON.parse(localStorage.getItem(user))['email']==email){
      loginUser=user;
      return;
    }
  });
  const storedUser = JSON.parse(localStorage.getItem(loginUser));
  console.log(storedUser);
  
  if (email === storedUser['email'] && pw === storedUser['pw']) {
    // 로그인 성공
    
    // const storedHeadings = JSON.parse(localStorage.getItem('headings')) || {};

    // let newSubTitle = {
    //   'newfeed': {
    //     'title': 'test title',
    //     'content': 'test content',
    //     'image': 'test image'
    //   }
    // };
    // let newFeed = {
    //   'title': 'test title',
    //   'content': 'test content',
    //   'image': 'test image'
    // }
    // newSubTitle['newfeed'] = newFeed;
    // storedHeadings['Title1']['newSubTitle'] = newSubTitle;

    // console.log(storedHeadings);
    console.log(storedUser['name']);
    res.render('swan', { userName: storedUser['name'] });



  } else {
    // 로그인 실패   => login redirect
    res.send("<script>alert('로그인 실패');window.location.href='/'</script>");
  }
});




module.exports = router;
