$(document).ready(function () {
  var viewportWidth = $(window).width();
  var responsiveWidth = viewportWidth * 0.5; // 50%로 설정 예시
  $("#fullpage").fullpage({
    navigation: true, // 페이지 인디케이터 활성화
    navigationPosition: "right", // 페이지 인디케이터 위치 (오른쪽)
    navigationTooltips: ["", ""], // 페이지 인디케이터 툴팁
    showActiveTooltip: true, // 현재 활성화된 섹션의 툴팁 표시
    scrollingSpeed: 1000, // 스크롤 속도 (1초)
    easingcss3: "cubic-bezier(0.86, 0, 0.07, 1)", // 스크롤 이동에 사용할 easing 효과
    responsiveWidth: responsiveWidth, // 뷰포트 너비가 768px 이하일 때 응답형 동작
    controlArrows: true,
  });
});
