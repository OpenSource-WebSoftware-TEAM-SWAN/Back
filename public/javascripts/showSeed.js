//시드 보여주기
function showSeed(){
    $('.seedViewBg').css('display','inline-block');
    $('.seedView').css('display','flex');
};

$(document).ready(function(){
    // 화면 끄기
    $('.seedViewBg').click(function(e){
        $('.seedViewBg').css('display','none');
        $('.seedView').css('display','none');
    });

    // 값 불러오기
    $('.card').click(function(){
        let currentPeed = $(this);
        let pos=$(this).children('div').children('div');

        // 이미지 불러오기
        let src=$(this).children('img').attr('src');
        console.log("123"+src);
        $('.seedView_imgs').children('img').attr('src',src);

        // 텍스트 불러오기
        $('.seedView_goal').text(pos.children('h3').text());
        $('.seedView_memo').text(pos.children('p:eq(0)').text());
        $('.seedView_time').text(pos.children('p:eq(1)').text());
        
        $('.delPeed').click(function(){
            $('.seedViewBg').click();
            currentPeed.remove();
            let $grid2 = $(".row").masonry({
                percentPosition:true,
            });
            $grid2.masonry('reloadItems');
            $grid2.masonry('layout');
        });
    })
});
