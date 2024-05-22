console.log('watcha contents page')

/* 버튼 추가 함수 */ 
function watchaContentsCreateBtnMark(pNode,ottid){
    const BtnInner = document.createElement("img");
    chrome.storage.local.get(['mark_ott'], function(result){
        mark_ott = result['mark_ott']
        if( mark_ott.includes(ottid) ){
            // 이미 추가된 항목이라면 체크 표시
            BtnInner.src = chrome.runtime.getURL("/images/check.png")
        } else{
            //아직 추가되지 않은 항목이라면 추가 표시
            BtnInner.src = chrome.runtime.getURL("/images/plus-sign.png")
        }
    })

    // 버튼 스타일링
    BtnInner.style.transition = "all 0.5s"
    BtnInner.style.borderRadius = "18px"

    const BtnMark = document.createElement('button');
    BtnMark.classList.add("btn-mark");
    BtnMark.style.position = "absolute";
    BtnMark.style.left = "327px";
    BtnMark.style.bottom = "17px";
    BtnMark.style.background = "none";
    BtnMark.style.border = "none"
    BtnMark.style.zIndex = 9999;

    BtnInner.addEventListener('mouseover', watchaContentsOnMouseOverHandler, false);
    BtnInner.addEventListener('mouseout', watchaContentsOnMouseOutHandler, false);
    BtnMark.addEventListener('click', watchaContentsOnClickMarkHandler, false);
    
    BtnMark.appendChild(BtnInner)
    pNode.appendChild(BtnMark)
}

function watchaContentsOnClickMarkHandler(e){
    let img = document.body.querySelector('img.custom-amoaq8.e1n8h89u21')
    let title = img.alt
    let imgsrc = img.src
    let l = window.location.pathname
    let ottid = l.split('/').at(-1)
    let url = "https://watcha.com/watch/"+ottid

    chrome.storage.local.get(['mark_ott'], function(result){
        mark_ott = result['mark_ott']
        // 이미 추가된 콘텐트는 목록에서 삭제합니다.
        if( mark_ott.includes(ottid) ){ 
            
            index = mark_ott.indexOf(ottid)
            deleteOTTMarked(index)
            deleteOTTType(index)
            deleteOTTImg(index)
            deleteOTTTitle(index)
            deleteOTTUrl(index)
            deleteOTTSetting(index)

            //상세 페이지 화면의 버튼을 더하기 표시로 변경
            e.target.src = chrome.runtime.getURL("/images/plus-sign.png")
        }else {  
            // 아직 추가되지 않은 콘텐트는 목록에 추가합니다.
            addOTTMarked(ottid)
            addOTTType("Watcha")
            addOTTImg(imgsrc)
            addOTTTitle(title)
            addOTTUrl(url)
            addOTTSetting("0000")

            //상세 페이지 화면의 버튼을 체크 표시로 변경
            e.target.src = chrome.runtime.getURL("/images/check.png")
        }
    })
}


function watchaContentsOnMouseOverHandler(e){
    e.target.style.boxShadow = "0 0 0 3px #FFF inset"

    let l = window.location.pathname
    let ottid = l.split('/').at(-1)
        
    chrome.storage.local.get(['mark_ott'], function(result){
        mark_ott = result['mark_ott']
        if (!mark_ott.includes(ottid)){
            e.target.src = chrome.runtime.getURL("/images/plus-sign2.png")
        }
    })

}

function watchaContentsOnMouseOutHandler(e){
    e.target.style.boxShadow = "none"

    let l = window.location.pathname
    let ottid = l.split('/').at(-1)

    chrome.storage.local.get(['mark_ott'], function(result){
        mark_ott = result['mark_ott']
        // 아직 추가되지 않은 콘텐트라면,
        if (!mark_ott.includes(ottid)){
            e.target.src = chrome.runtime.getURL("/images/plus-sign.png")
        }else{
        // 이미 추가된 콘텐트라면,
            e.target.src = chrome.runtime.getURL("/images/checkmark.png")
        }
    })

}

//Refresh UI
function watchaOnContentsRefresh(){
    chrome.storage.local.get(['mark_ott'], function(result){
        mark_ott = result['mark_ott']
        let l = window.location.pathname
        let ottid = l.split('/').at(-1)
        container = document.body.querySelector('section.custom-1gcurak.e1kgye4v2')
        if(container){
            if(mark_ott.includes(ottid)){
                btnImg = container.querySelector('button.btn-mark > img')
                btnImg.src = chrome.runtime.getURL('images/check.png')
            }else{
                btnImg = container.querySelector('button.btn-mark > img')
                btnImg.src = chrome.runtime.getURL('images/plus-sign.png')
            }
        }
    })
}

/**********************************************************************************/
setTimeout(()=>{
    l = window.location.pathname
    ottid = l.split('/').at(-1)
    container = document.body.querySelector('section.custom-1gcurak.e1kgye4v2')
    watchaContentsCreateBtnMark(container, ottid)
},1000)

chrome.runtime.onMessage.addListener(msg => {
    if(msg === "refresh"){
        watchaOnContentsRefresh()
    }
});


