var express = require('express');
var router = express.Router();
const { stringify } = require('querystring');
const { LocalStorage } = require('node-localstorage');

const fs = require('fs');
const calendarLocalStorage = new LocalStorage('./scratch/calendarJSON');


router.get('/', function (req, res, next) {
    const { loginUser } = require('./login.js');
    let calendarList = [];
    const calendarFilePath = './scratch/calendarJSON/calendar';

    // 파일 내 데이터 존재 여부 확인
    fs.readFile(calendarFilePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading calendar file:', err);
            res.json(calendarList); // 빈 배열 반환
            return;
        }

        let userCalendar = [];
        if (data.trim().length > 0) {
            userCalendar = JSON.parse(data);
        }
        calendarList = userCalendar.filter(calendar => calendar.userPK === loginUser.pk);
        // console.log(calendarList);
        res.json(calendarList);
    });
});




router.post('/save', function (req, res) {
    const { loginUser, userContent } = require('./login.js');
    const { id, title, start, end, color } = req.body;

    // 날짜 형식 변환
    let startDate = new Date(start);
    let endDate = new Date(end);
    // 변환값 오차 해결
    let offset = startDate.getTimezoneOffset() * 60000; //ms단위라 60000곱해줌
    startDate=new Date(startDate.getTime()-offset);
    endDate=new Date(endDate.getTime()-offset);
    // startDate.setDate(startDate.getDate()-1);
    // endDate.setDate(endDate.getDate()-1);
    const formattedStart = startDate.toISOString().substring(0, 10);
    const formattedEnd = endDate.toISOString().substring(0, 10);

    const calendarData = {
        userPK: loginUser.pk,
        id: id,
        title: title,
        start: formattedStart,
        end: formattedEnd,
        color: color
    };

    let currentCalendar = calendarLocalStorage.getItem("calendar");
    if (currentCalendar) {
        currentCalendar = JSON.parse(currentCalendar);
        currentCalendar.push(calendarData);
    } else {
        currentCalendar = [calendarData];
    }

    calendarLocalStorage.setItem("calendar", JSON.stringify(currentCalendar));

    res.sendStatus(200);
});

//    TODO\n Calendar Update func




module.exports = router
