// btnNaviBar 클릭 시
const body = document.querySelector('body');
const navModal = document.querySelector('.navModal');
const btnOpenPopup = document.querySelector('.btnNaviBar');
const mainNav = document.querySelector('.main-nav');

btnOpenPopup.addEventListener('click', () => {
    navModal.style.display='inline-block';
    btnOpenPopup.style.display='none';

    if (navModal.style.display='inline-block') {// 화면 고정
        body.style.overflow = 'hidden'; 
        mainNav.style.overflowY = 'auto';
    }
});

navModal.addEventListener('click', (event) => {
    if (event.target === navModal) { // 외부 클릭 시 창닫음
        navModal.style.display='';
        btnOpenPopup.style.display='inline-block';

        if (navModal.style.display!='inline-block') {  // 화면 고정 해제
            body.style.overflowX = 'hidden';
        }
    }
});

var toggled=0;
var titleCnt=0;
$(document).ready(function () {
    // const {loginUser,titlePK}=require('./login.js');
    
    
    
    $("#images-modal").load("/imagesModal.html");

    // 목표 추가
    $('.add-title').click(function(){
        let pkDate=Date.now();
        pkDate=String(pkDate);
        let str;
        if(titleCnt>0){
        str="<ul class='elementGoal'>"+
        "<li><a class='aGoal' id='temp'>새 목표("+titleCnt+")</a></li>"+
        "<li class='exception'><div style='float:right;'>"+
            "<button class='editGoal'>수정</button>"+"&nbsp;"+
            "<button class='delGoal'>삭제</button>"+
        "</div></li>"+
    "</ul>"
        }
        else{
        str="<ul class='elementGoal'>"+
        "<li><a class='aGoal' id='temp'>새 목표</a></li>"+
        "<li class='exception'><div style='float:right;'>"+
            "<button class='editGoal'>수정</button>"+"&nbsp;"+
            "<button class='delGoal'>삭제</button>"+
        "</div></li>"+
    "</ul>"
        }
        $('.headline-info').prepend(str);
        titleCnt++;
        
        $('#temp').attr("id",pkDate);
        $.post('/swan/sendTitle',{
            headTitle:$('.aGoal')[0].text,
            titlePk:pkDate
        });
    });

    //버킷리스트 누를 시
    $(document).on('click', '.aGoal', function () {
        // 해당 요소의 데이터를 가져올 수 있는 방법에 따라 다른 페이지로 리다이렉션하거나 데이터를 전달할 수 있습니다.
        var headTitle = $(this).text().trim(); // 클릭한 요소의 텍스트 가져오기
        var titlepk=$(this).attr('id');
        
        // window.location.href = '/user/goal/' + encodeURIComponent(headTitle); // 다른 페이지로 리다이렉션
        $.get('/swan/convertPage',{headTitle:headTitle,titlepk:titlepk},function(data){
            window.location.href=data.url
        })
    });
    
    // 최근항목
    $('.divRecentSeed').click(function(){
        $('.divRecentSeedOpen').slideToggle("fast");
        if(toggled==1){
            $('.imgToggle').attr("src","images/button_down.png");
            toggled=0;
        }
        else if(toggled==0){
            $('.imgToggle').attr("src","images/button_up.png");
            toggled=1;
        };
    });

    //검색
    $('#searchBox').focus(function(){
        $('.divSearch').css('border','1px solid #f26322');
    });

    $('#searchBox').blur(function(){
        $('.divSearch').css('border','1px solid black');
    });
});

$(document).on('click','.imgGoal',function(){
    $(this).next().next().next().slideToggle(90);
});
$(document).on('click','.imgSub',function(){
    $(this).next().next().next().slideToggle(90);
});

// 수정하기
$(document).on('click', '.editGoal', function () {
    const editGoalElement = $(this).parent().parent().prev().children();
    let className;
    let titlePk;
    let $this = $(this); // $(this)를 변수에 저장
    sendTitlePk = editGoalElement.attr('id');

    // 서버로부터 title pk 값을 가져오기
    $.get('/swan/getTitlePk', { sendTitlePk: sendTitlePk }, function (data) {
        titlePk = data.receivePk;

        editGoalElement.replaceWith(function () {
            className = $(this).attr('class');
            let changeGoalElement = $(this).text();

            let $inputElement = $("<input class='aGoal' style='width: 70%'>", {
                type: 'text',
                value: changeGoalElement
            });

            let $newAnchorElement = $("<a class='aGoal' href='#' id='" + titlePk + "'>" + changeGoalElement + "</a>");
            // $('#temp').attr("id",pkDate);
            
            // $newAnchorElement.on('click', handleGoalClick); // 클릭 이벤트 핸들러 등록

            $inputElement.on('click', function (e) {
                e.stopPropagation(); // 이벤트 전파(stopPropagation)를 통해 aGoal 클릭 이벤트 막기
            }).on('keypress', function (e) {
                if (e.keyCode === 13) {
                    let newGoalElement = $(this).val();

                    // 서버로 새로운 headTitle 값 전송
                    $.post('/swan/edit', {
                        titlePk: titlePk,
                        newGoalElement: newGoalElement,
                        className: className
                    }, function (response) {
                        // 성공적으로 서버로 데이터를 전송한 후의 처리
                        console.log(newGoalElement);
                        $newAnchorElement.text(newGoalElement); // 수정한 부분
                        $this.css('display', ''); // 수정한 부분
                    });

                    $inputElement.replaceWith($newAnchorElement);
                    
                    e.preventDefault();
                }
            }).on('blur', function () {
                let newGoalElement = $(this).val();

                // 서버로 새로운 headTitle 값 전송
                $.post('/swan/edit', {
                    titlePk: titlePk,
                    newGoalElement: newGoalElement,
                    className: className
                }, function (response) {
                    // 성공적으로 서버로 데이터를 전송한 후의 처리
                    console.log(newGoalElement);
                    $newAnchorElement.text(newGoalElement); // 수정한 부분
                    $this.css('display', ''); // 수정한 부분
                });

                $inputElement.replaceWith($newAnchorElement);
            });

            $(this).replaceWith($inputElement);
            $inputElement.focus();
            $inputElement.select();
        });
    });
});
