// 소제목 탭 수정 삭제 기능
function onTab() {
  let tmpHeight = $('.editSub').outerHeight();
  $('.editSub').css('display', 'inline-block');
  $('.delSub').css('display', 'inline-block');
  let pos = $(".nav-link:focus").offset();
  pos = ({ left: pos.left, top: pos.top - tmpHeight });

  let currentTab = $(".nav-link:focus");
  const activeTab=$('.custom-button.active').attr('id');

  // 이전에 연결된 클릭 이벤트 핸들러 제거
  $('.editSub').off('click');
  $('.delSub').off('click');
  //탭 수정 버튼
  $('.editSub').offset(pos);
  $('.editSub').on('click', function () {
    let currentVal = $(currentTab).text();

    // $('.editSub').css('display', 'none');
    // $('.delSub').css('display', 'none');
    currentTab.css('display', 'none');

    let str =
      "<input value='" + currentVal + "'" + " style='width: 10em; border: 0;'>";
    currentTab.after(str);
    currentTab.next().focus();
    currentTab.next().select();

    currentTab.next().on('keypress', function (e) {
      if (e.keyCode === 13) {
        currentTab.html(currentTab.next().val());
        currentTab.css('display', 'inline-block');
        currentTab.next().remove();
        console.log(activeTab,currentTab);
        $.post('/user/goal/sub/edit',{subPK:activeTab,editVal:$('.custom-button.active').text() })
      }
    }).on('blur', function () {
      currentTab.html(currentTab.next().val());
      currentTab.css('display', 'inline-block');
      currentTab.next().remove();
      $.post('/user/goal/sub/edit',{subPK:activeTab,editVal:$('.custom-button.active').text() },function (response) {
        console.log(response); // 서버 응답 확인
      });
    });
  });

  //탭 삭제 버튼
  let tmpWidth = $('.editSub').outerWidth();
  pos = ({ left: pos.left + tmpWidth, top: pos.top })
  $('.delSub').offset(pos).on('click', function () {
    let tmpId = currentTab.attr('data-index');
    const activeTab=$('.custom-button.active').attr('id');
    const url = new URL(window.location.href);
    const urlParams = url.searchParams;
    const titlePK = urlParams.get('pk');

    $('#'+tmpId).remove();
    currentTab.remove();
    $('.editSub').css('display', 'none');
    $('.delSub').css('display', 'none');
    //TODO 삭제 전에 post요청으로 재계산 가능한지 TEST
    // getCheckPercentage();
    // 텝 식제 요청
    $.post('/user/goal/sub/del',{activeTab:activeTab,subNum:$('.nav-link.custom-button').length,titlePK:titlePK},function(response){
      console.log(response);
    })
    // $.post('/user/goal/goalRate',{check_cnt:check_cnt,titlePK:titlePK,subNum:$('.nav-link.custom-button').length},
  });

}

$(document).ready(function () {
  

    // 홈버튼
    $('.btnHome').click(function(){
      location.href = '/swan';
    });
  // Masonry 초기화
  

  // 탭 변경 이벤트 핸들러
  $(".nav-link").on("shown.bs.tab", function () {
    

    
    // 현재 탭의 컨텐츠에 있는 이미지들을 로드
    var $currentTabContent = $($(this).attr("data-bs-target")).find(".row");
    $currentTabContent.imagesLoaded(function () {
      // 이미지 로드 완료 후 Masonry 업데이트
      $grid.masonry('reloadItems');
      $grid.masonry("layout");
      // 스크롤 초기화
      $currentTabContent.closest(".tab-content").scrollTop(0);


    });
    getCheckPercentage();
    
    

  });

// 퍼센티지 구하기
function getCheckPercentage(){
  var check_cnt=0;
  var box_cnt=0;

  $('.checkSub').each(function(){
    if ($(this).is(":checked")) {
      check_cnt++;
      const url = new URL(window.location.href);
      const urlParams = url.searchParams;
      const titlePK = urlParams.get('pk');
      $.post('/user/goal/goalRate',{check_cnt:check_cnt,titlePK:titlePK,subNum:$('.nav-link.custom-button').length,subPK:$('.custom-button.active').attr('id')},function (response) {
        console.log(response); // 서버 응답 확인
      });
    }
    box_cnt++;
  });
  // alert(check_cnt*100/box_cnt);
  /* 소제목 버튼 클릭시 url에 추가  */
  $('.nav-link.custom-button').on('click', function (event) {
    

    // 현재 선택된 탭의 id 값을 가져옴
    var subPK = $(".nav-link.custom-button.active").attr("id");
    let subTabTarget = $(this).attr('data-index');
    let headTitle=$('#pageHeader').children().text();
    let subChecked=$('#subCheck').is(':checked');
    subChecked=subChecked?1:0;
    // URL에 파라미터 추가
    var url = new URL(window.location.href);
    url.searchParams.set("subTitlePK", subPK);
    history.pushState(null, "", url.toString());
    
    $.get('/user/goal/custom/goal', { headTitle:headTitle,subTitlePK: subPK, tabTarget: subTabTarget,subTitleNum:$('.nav-link.custom-button').length,subChecked:subChecked},function(data){
      $('.aboveTabCard').html(data);
    });

  });
}
// 소제목 탭 함수 끝


// 소제목 추가
$('.linkPlus').click(function () {
  let nav_cnt = $(this).prev().attr('data-index')?Number($(this).prev().attr('data-index'))+1:1;
  let tmpNav = nav_cnt;
  let str;
  let subTitlePkDate = Date.now();
  subTitlePkDate = String(subTitlePkDate);
  const urlParams = new URLSearchParams(window.location.search);
  const pk = urlParams.get('pk');
  
  // 버튼 내용
  str =
    '<button class="nav-link custom-button" ' +
    'data-bs-toggle="tab" data-bs-target="#' + tmpNav + '" type="button" ' +
    'role="tab" aria-controls="' + tmpNav + '" aria-selected="false" data-index="' + tmpNav + '">New Subgoal</button>';
  let tmp = $(this);
  $('#nav-tab').remove('linkPlus');
  $('#nav-tab').append(str);
  $('#nav-tab').append(tmp);
  tmp.prev().replaceWith(function () {
    let changeGoalElement = $(this).text();
    return $("<input value='" + changeGoalElement + "'" + " style='width: 10em; border: 0;'>", {
    }).on('keypress', function (e) {
      if (e.keyCode === 13) {
        let newGoalElement = $(this).val();
        $(this).replaceWith(function () {
          $(this).focus();
          let tmpMasonry = '{"percentPosition": true}';
          // 소제목 추가
          let tmpStr =
            '<div class="tab-pane fade " id="' + tmpNav + '" role="tabpanel" aria-labelledby="' + tmpNav + '-tab">' +
            '<div class="container-fluid">' +
            '<form action=""><input class="checkSub" type="checkbox"></form>'+
            '<div class="row " data-masonry=' + tmpMasonry + '>' +
            '</div></div></div>'
          let tmpdiv = $('#nav-tabContent').append(tmpStr);
          tmpdiv.focus();
          nav_cnt++;

          // 서버와 통신  parameter : 소제목 소제목 pk값
          $.post('/user/goal/post/subTitle?pk=' + pk, { subTitlePK: subTitlePkDate, subTitle: newGoalElement }, function (response) {
            console.log(response); // 서버 응답 확인
          });


          return $('<button class="nav-link custom-button" data-bs-toggle="tab" data-bs-target="#' + tmpNav + '" data-index="' + tmpNav + '" type="button" ' +
            'role="tab" aria-controls="' + tmpNav + '" aria-selected="false" id=' + subTitlePkDate + ' onclick="onTab();" >' + newGoalElement + ' </button>');
        });0

      }
    }).on('blur', function () {
      let newGoalElement = $(this).val();
      $(this).replaceWith(function () {
        $(this).focus();
        let tmpMasonry = '{"percentPosition": true}';
        let tmpStr =
          '<div class="tab-pane fade " id="' + tmpNav + '" role="tabpanel" aria-labelledby="' + tmpNav + '-tab">' +
          '<div class="container-fluid">' +
          '<form action=""><input class="checkSub" type="checkbox"></form>'+
          '<div class="row " data-masonry=' + tmpMasonry + '>' +
          '</div></div></div>'
        let tmpdiv = $('#nav-tabContent').append(tmpStr);
        tmpdiv.focus();
        nav_cnt++;

        // 서버와 통신  parameter : 소제목 소제목 pk값
        console.log(subTitlePkDate, newGoalElement);
        $.post('/user/goal/post/subTitle?pk=' + pk, { subTitlePK: subTitlePkDate, subTitle: newGoalElement}, function (response) {
          console.log(response); // 서버 응답 확인
        });


        return $('<button class="nav-link custom-button" data-bs-toggle="tab" data-bs-target="#' + tmpNav + '"  data-index="' + tmpNav + '" type="button" ' +
          'role="tab" aria-controls="' + tmpNav + '" aria-selected="false" id=' + subTitlePkDate + ' onclick="onTab();">' + newGoalElement + '</button>');

      });
    });
  });
  $('.linkPlus').prev().focus();
  $('.linkPlus').prev().select();
  
});});