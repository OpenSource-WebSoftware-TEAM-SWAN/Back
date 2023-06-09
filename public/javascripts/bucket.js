var nav_cnt = 0;

$(document).ready(function () {
  // Masonry 초기화
  var $grid = $(".row").masonry({
    percentPosition: true,
    // 필요한 Masonry 옵션들을 설정해주세요
  });

  // 탭 변경 이벤트 핸들러
  $(".nav-link").on("shown.bs.tab", function () {
    // 현재 탭의 컨텐츠에 있는 이미지들을 로드
    var $currentTabContent = $($(this).attr("data-bs-target")).find(".row");
    $currentTabContent.imagesLoaded(function () {
      // 이미지 로드 완료 후 Masonry 업데이트
      $grid.masonry("layout");
      console.log("nav link event");
      // 스크롤 초기화
      $currentTabContent.closest(".tab-content").scrollTop(0);
    });
  });
  /* 소제목 버튼 클릭시 url에 추가  */
  $('.nav-link.custom-button').on('click',function(){
    console.log('Click');
    // 현재 선택된 탭의 id 값을 가져옴
    var subPK = $(".nav-link.custom-button.active").attr("id");
    // URL에 파라미터 추가
    var url = new URL(window.location.href);
    url.searchParams.set("subTitlePK", subPK);
    history.pushState(null, "", url.toString());
    // $.get('/user/goal/custom/goal', { subTitlePK: subTitlePK })
    //   .done(function (response) {
    //     // 성공적인 응답을 받았을 때 수행할 동작
    //     console.log(response);
    //   })
    //   .fail(function (error) {
    //     // 요청이 실패했을 때 수행할 동작
    //     console.error(error);
    //   });
  });
});

// 소제목 추가
$('.linkPlus').click(function () {
  
  let tmpNav = 'nav-' + nav_cnt;
  let str;
  let subTitlePkDate = Date.now();
  subTitlePkDate = String(subTitlePkDate);
  const urlParams = new URLSearchParams(window.location.search);
  const pk = urlParams.get('pk');
  // 버튼 내용
  str =
    '<button class="nav-link custom-button" ' +
    'data-bs-toggle="tab" data-bs-target="#' + tmpNav + '" type="button" ' +
    'role="tab" aria-controls="' + tmpNav + '" aria-selected="false">New Subgoal</button>';
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
            '<div class="row" data-masonry=' + tmpMasonry + '>' +
            '</div></div></div>'
          let tmpdiv = $('#nav-tabContent').append(tmpStr);
          tmpdiv.focus();
          nav_cnt++;

          // 서버와 통신  parameter : 소제목 소제목 pk값
          $.post('/user/goal/post/subTitle?pk=' + pk, { subTitlePK: subTitlePkDate, subTitle: newGoalElement }, function (response) {
            console.log(response); // 서버 응답 확인
          });


          return $('<button class="nav-link custom-button" data-bs-toggle="tab" data-bs-target="#' + tmpNav + '" type="button" ' +
            'role="tab" aria-controls="' + tmpNav + '" aria-selected="false" id=' + subTitlePkDate + '>' + newGoalElement + ' </button>');
        });

      }
    }).on('blur', function () {
      let newGoalElement = $(this).val();
      $(this).replaceWith(function () {
        $(this).focus();
        let tmpMasonry = '{"percentPosition": true}';
        let tmpStr =
          '<div class="tab-pane fade " id="' + tmpNav + '" role="tabpanel" aria-labelledby="' + tmpNav + '-tab">' +
          '<div class="container-fluid">' +
          '<div class="row" data-masonry=' + tmpMasonry + '>' +
          '</div></div></div>'
        let tmpdiv = $('#nav-tabContent').append(tmpStr);
        tmpdiv.focus();
        nav_cnt++;

        // 서버와 통신  parameter : 소제목 소제목 pk값
        console.log(subTitlePkDate, newGoalElement);
        $.post('/user/goal/post/subTitle?pk=' + pk, { subTitlePK: subTitlePkDate, subTitle: newGoalElement }, function (response) {
          console.log(response); // 서버 응답 확인
        });


        return $('<button class="nav-link custom-button" data-bs-toggle="tab" data-bs-target="#' + tmpNav + '" type="button" ' +
          'role="tab" aria-controls="' + tmpNav + '" aria-selected="false" id=' + subTitlePkDate + '>' + newGoalElement + '</button>');

      });
    });
  });
  $('.custom-button').last().next().focus();
  $('.custom-button').last().next().trigger('click');

});