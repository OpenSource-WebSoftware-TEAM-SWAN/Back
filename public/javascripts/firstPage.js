$(document).ready(function () {
  /* chart 초기 설정 */
  var ctx = $("#myChart");
  var chart;

  function createChart() {
    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
            backgroundColor: [
              "rgba(0, 12, 62, 0.75)",
              "rgba(0, 12, 62, 0.75)",
              "rgba(0, 12, 62, 0.75)",
              "rgba(0, 12, 62, 0.75)",
              "rgba(0, 12, 62, 0.75)",
              "rgba(0, 12, 62, 0.75)",
            ],
            borderColor: [
              "rgba(0, 12, 62, 1)",
              "rgba(0, 12, 62, 1)",
              "rgba(0, 12, 62, 1)",
              "rgba(0, 12, 62, 1)",
              "rgba(0, 12, 62, 1)",
              "rgba(0, 12, 62, 1)",
            ],
          },
        ],
      },
      options: {
        indexAxis: "y",
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Masonry 초기화
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
});
