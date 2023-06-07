$(document).ready(function () {
    $('img').on("error", function () {
        $(this).attr("src", "/images/이지형.png");
    });

    let $grid2 = $(".row").masonry({
        percentPosition: true,
    });

    // 이미지 추가
    $('.writeSeed_body_imgPlus').click(function (e) {
        e.preventDefault();
        $('#uploadImg').click();
    });

    $('#uploadImg').change(function () {
        changeValue(this);
    });

    function changeValue(obj) {
        
        var fReader = new FileReader();
        fReader.readAsDataURL(obj.files[0]);
        fReader.onloadend = function (event) {
            console.log(event.target.result);
            let tmp = $('.writeSeed_body_imgPlus');
            let str = '<img src="' + event.target.result + '" alt="">';
            $('.writeSeed_body_img').remove($('.writeSeed_body_imgPlus'));
            $('.writeSeed_body_img').append(str);
            $('.writeSeed_body_img').append(tmp);
        }
        changeValue(0);
    }

    // 게시하기
    $(document).on('click', '.writeSeed_body_btn', function (e) {
        e.preventDefault(); // DB 연결 시 삭제
        if ($('#seedGoal').val() != 0) {
            let selectedTab = $('#nav-tabContent .tab-pane.active');
            let putArea = selectedTab.children('div').children('div');
            let h = new Date().getHours() + ':';
            let m = new Date().getMinutes() + ' ';
            let date = new Date().getDate() + '/';
            let month = parseInt(new Date().getMonth() + 1) + '/';
            let year = new Date().getFullYear();
            let time = '' + h + m + date + month + year;
            let feedGoal = $('#seedGoal').val();
            let feedMemo = $('#seedMemo').val();
            let fileInput = $('#uploadImg');
            let file = null;

            if (fileInput[0].files && fileInput[0].files.length > 0) {
                file = fileInput[0].files[0];
            }

            let str =
                '<div class="col-6 col-md-4 col-lg-3">' +
                '<div class="card">' +
                '<img src="./images/sameple_image.jpeg" class="card-img-top">' + // 내부 이미지의 첫 번째
                '<div class="card-body">' +
                '<div class="card-text">' +
                '<h3>' + $('#seedGoal').val() + '</h3>' + // 피드 제목
                '<p>' + $('#seedMemo').val() + '</p>' + // 피드 메모
                '<p style="text-align:right;">' + time + '</p>' + // 게시 시간
                '</div></div></div></div>';
            putArea.append(str);
            let $grid2 = $(".row").masonry({
                percentPosition: true,
            });
            $grid2.masonry('reloadItems');
            $grid2.masonry('layout');
            $('#seedGoal').val('');
            $('#seedMemo').val('');
            $('.writeSeed_body_img').children('img').remove();

            // 피드 보기
            $('.card').click(function () {
                $('.seedViewBg').css('display', 'block');
                $('.seedView').css('display', 'block');
                $('.seedViewClose').css('display', 'block');
                $('.seedViewClose').click(function () {
                    $('.seedViewBg').css('display', 'none');
                    $('.seedView').css('display', 'none');
                });
                $('.seedViewBg').click(function () {
                    $('.seedViewBg').css('display', 'none');
                    $('.seedView').css('display', 'none');
                });
                var tmpPos = $(this).children('div').children('div');
                $('seedViewTime').text($(tmpPos).children('p').first().text());
                $('seedViewGoal').children('h2').text($(tmpPos).children('h3').text());
                $('seedViewMemo').children('p').text($(tmpPos).children('p').last().text());
            });
            
            
            let formData = new FormData();
            formData.append('feedGoal', feedGoal);
            formData.append('feedMemo', feedMemo);

            if (file) {
                formData.append('feedImage', file);
            } else {
                formData.append('feedImage', null);
            }
            console.log("=================="+feedGoal,feedMemo,file);
            // POST 요청 보내기
            $.post({
                url: '/user/goal/writeFeed',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    // 서버로부터의 응답 처리
                    console.log(response);
                },
                error: function (error) {
                    // 오류 처리
                    console.log(error);
                }
            });
            $('.writeSeedClose').click();
        }
    });

    const bodyBucket = document.querySelector('body');
    const writeSeed = document.querySelector('.writeSeed');
    const writeSeedClose = document.querySelector('.writeSeedClose');
    const btnWrite = document.querySelector('.btnWrite');

    btnWrite.addEventListener('click', () => {
        writeSeed.style.display = 'inline-block';// 화면 고정
        bodyBucket.style.overflow = 'hidden';
    });

    writeSeedClose.addEventListener('click', (event) => {
        if (event.target === writeSeedClose) { // 외부 클릭 시 창닫음
            writeSeed.style.display = '';
            if (writeSeed.style.display != 'inline-block') {  // 화면 고정 해제
                bodyBucket.style.overflow = 'auto';
            }
        }
    });

    $grid2.masonry('reloadItems');
    $grid2.masonry('layout');
});
