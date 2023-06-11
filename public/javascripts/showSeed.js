//시드 보여주기
function showSeed(){
    $('.seedViewBg').css('display','inline-block');
    $('.seedView').css('display','flex');
};

$(document).ready(function(){
    //화면 끄기
    $('.seedViewBg').click(function(e){
        $('.seedViewBg').css('display','none');
        $('.seedView').css('display','none');
    });

        // 값 불러오기
        $('.card').click(function(){
            let pos=$(this).children('div').children('div');
            $('.seedView_goal').text(pos.children('h3').text());
            $('.seedView_memo').text(pos.children('p:eq(0)').text());
            $('.seedView_time').text(pos.children('p:eq(1)').text());
        })
});

