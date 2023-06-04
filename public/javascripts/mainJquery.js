/*피드 추가버튼*********************************************************************/
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