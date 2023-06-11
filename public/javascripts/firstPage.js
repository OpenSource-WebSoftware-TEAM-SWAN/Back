// import {loginUser,userContent} from '../../routes/login.js'

$(document).ready(function () {
  /* chart 초기 설정 */
  $.get('/swan/chart/data',function(response){console.log(response)}).done(
    function (chartData) {
      var ctx = $("#myChart");
      var chart;
      var labels = chartData.labels;
      var data = chartData.data;
      console.log(labels);
      console.log(data);
      // const {userContent}=require('../../routes/login.js')
      // console.log("userContent"+userContent);
      // userContent.forEach(title => {
      //   labels.push(title.headTitle);
      //   data.push((parseFloat(title.goalRate)*100).toPrecision(2));
      // });

      function createChart() {
        chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Goal Rate of Titles",
                data: data, // 데이터별 퍼센티지
                borderWidth: 1,
                backgroundColor: "rgba(0, 12, 62, 0.75)",
                borderColor: "rgba(0, 12, 62, 1)",
              },
            ],
          },
          options: {
            indexAxis: "y",
            scales: {
              y: {
                beginAtZero: true,
              },
              x: {
                max: 100,
                grid: {
                  display: false
                }
              }
            },
            plugins: {
              datalabels: {
                display: false // label 숨기기
              }
            }
          },
          // 플러그인

        });
      }
      var $grid = $("#images-container").masonry({
        itemSelector: ".col",
        percentPosition: true,
        // 필요한 Masonry 옵션들을 설정해주세요
      });
    
      function resizeChart() {
        var chartContainer = $("#row-chart");
        var containerWidth = chartContainer.width();
        ctx.attr("width", containerWidth);
        ctx.attr("height", containerWidth);
    
        if (chart) {
          chart.resize();
        }
      }
    
      createChart();
      resizeChart();
    
      $(window).resize(function () {
        resizeChart();
      });
    
      function testOrganize() {
        // 새로운 데이터 값으로 업데이트할 배열 생성
        var newValues = data;
    
        // 차트 데이터의 첫 번째 데이터셋에 새로운 값을 할당
        chart.data.datasets[0].data = newValues;
    
        // 차트 업데이트
        chart.update();
      }
      testOrganize();
    });


  // Masonry 초기화
  
});