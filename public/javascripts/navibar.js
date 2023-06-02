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

    $("#images-modal").load("./imagesModal.html");

    // 목표 추가
    $('.add-title').click(function(){
        let str;
        if(titleCnt>0){
        str="<ul class='elementGoal'>"+
                "<img class='imgGoal' src='./images/button_hirDown.png'>"+
                "<li><a class='aGoal'>새 목표("+titleCnt+")</a></li>"+
                "<li class='exception'><div style='float:right;'>"+
                    "<button class='editGoal'>수정</button>"+"&nbsp;"+
                    "<button>삭제</button>"+
                "</div></li>"+
                "<ul class='elementSub' style='clear:both;'>"+
                    "<img class='imgSub' src='./images/button_hirDown.png'>"+
                    "<li><a class='aSub'>새 소제목</a></li>"+
                    "<li class='exception'><div style='float:right;'>"+
                        "<button class='editGoal'>수정</button>"+"&nbsp;"+
                        "<button>삭제</button>"+
                    "</div></li>"+
                    "<ul class='elementFeed' style='clear:both;'>"+
                        "<li><a href='#'>새 피드</a></li>"+
                        "<li class='exception'><div style='float:right;'>"+
                            "<button class='editGoal'>수정</button>"+"&nbsp;"+
                            "<button>삭제</button>"+
                        "</div></li>"+
                    "</ul>"+
                "</ul>"+
            "</ul>"
        }
        else{
        str="<ul class='elementGoal'>"+
                "<img class='imgGoal' src='./images/button_hirDown.png'>"+
                "<li><a class='aGoal'>새 목표</a></li>"+
                "<li class='exception'><div style='float:right;'>"+
                    "<button class='editGoal'>수정</button>"+"&nbsp;"+
                    "<button>삭제</button>"+
                "</div></li>"+
                "<ul class='elementSub' style='clear:both;'>"+
                    "<img class='imgSub' src='./images/button_hirDown.png'>"+
                    "<li><a class='aSub'>새 소제목</a></li>"+
                    "<li class='exception'><div style='float:right;'>"+
                        "<button class='editGoal'>수정</button>"+"&nbsp;"+
                        "<button>삭제</button>"+
                    "</div></li>"+
                    "<ul class='elementFeed' style='clear:both;'>"+
                        "<li><a href='#'>새 피드</a></li>"+
                        "<li class='exception'><div style='float:right;'>"+
                            "<button class='editGoal'>수정</button>"+"&nbsp;"+
                            "<button>삭제</button>"+
                        "</div></li>"+
                    "</ul>"+
                "</ul>"+
            "</ul>"
        }
        $('.headline-info').prepend(str);
        titleCnt++;
        let headTitle=$('.aGoal')[0].text;
        localStorage.setItem(headTitle,JSON.stringify({}));
        // console.log(localStorage.getItem(headTitle));
        // localStorage.setItem('title':{"$('.aGoal').text"})
    });

    //버킷리스트 누를 시
    
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
    $(this).next().next().next().toggle();
});
$(document).on('click','.imgSub',function(){
    $(this).next().next().next().toggle();
});

$(document).on('click', '.editGoal', function() {
    // $(this).css('display','none'); 수정 시 버튼들 사라지기
    const editGoalElement = $(this).parent().parent().prev().children();
    editGoalElement.replaceWith(function() {
        let changeGoalElement = $(this).text();
        return $("<input class='aGoal' style='width: 70%'>", {
        type: 'text',
        value: changeGoalElement
        }).on('keypress', function(e) {
        if (e.keyCode === 13) {
            let newGoalElement = $(this).val();
            const oldVal=localStorage.getItem(changeGoalElement);
            const newKey=newGoalElement
            localStorage.setItem(newKey,oldVal);
            localStorage.removeItem(changeGoalElement);
            // localStorage[changeGoalElement]=newGoalElement;
            $(this).replaceWith(function() {
            return $("<a class='aGoal' href='#'>" + newGoalElement + "</a>");
            
            });
        }
        });
    });
});
