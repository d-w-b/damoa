console.log('netflix browse jbv')

/* 버튼 추가 함수 */ 
function netflixBrowseJbvCreateBtnMark(pNode,ottid){
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
    BtnMark.style.left = "47px";
    BtnMark.style.bottom = "107px";
    BtnMark.style.background = "none";
    BtnMark.style.border = "none"
    BtnMark.style.zIndex = 9999;

    BtnInner.addEventListener('mouseover', netflixBrowseJbvOnMouseOverHandler, false);
    BtnInner.addEventListener('mouseout', netflixBrowseJbvOnMouseOutHandler, false);
    BtnMark.addEventListener('click', netflixBrowseJbvOnClickMarkHandler, false);
    
    BtnMark.appendChild(BtnInner)
    pNode.appendChild(BtnMark)
}

function netflixBrowseJbvOnClickMarkHandler(e){
    const l = window.location.href
    let ottid = l.split('=')[1]
    let container = e.target.parentNode.parentNode.parentNode
    let img = container.querySelector("img.previewModal--player-titleTreatment-logo").src
    for(c of netflixContainersList){
        if(ottid === c.querySelector('a').href.split('/')[4].split('?')[0]){
            img = c.querySelector('img').src
        }
    }
    let title = container.querySelector("img.previewModal--player-titleTreatment-logo").alt
    let url = "https://www.netflix.com/watch?"+ottid

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
            addOTTType("Netflix")
            addOTTImg(img)
            addOTTTitle(title)
            addOTTUrl(url)
            addOTTSetting("0000")

            //상세 페이지 화면의 버튼을 체크 표시로 변경
            e.target.src = chrome.runtime.getURL("/images/check.png")
        }
    })
}


function netflixBrowseJbvOnMouseOverHandler(e){
    e.target.style.boxShadow = "0 0 0 3px #FFF inset"
        let l = window.location.href;
        let ottid = l.split('=')[1]
        
        chrome.storage.local.get(['mark_ott'], function(result){
            mark_ott = result['mark_ott']
            if (!mark_ott.includes(ottid)){
                e.target.src = chrome.runtime.getURL("/images/plus-sign2.png")
            }
        })
    
}

function netflixBrowseJbvOnMouseOutHandler(e){
    e.target.style.boxShadow = "none"
    let l = window.location.href;
    let ottid = l.split('=')[1]

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

l = new URL(window.location)
ottid = l.search.split('=')[1]
container = document.body.querySelector('div.previewModal--player_container.detail-modal.has-smaller-buttons')
netflixBrowseJbvCreateBtnMark(container, ottid)


//Refresh UI
function netflixOnBrowseJbvRefresh(){
    l = window.location.href
    if(l.includes('jbv')){
        ottid = l.split('=')[1]
        console.log(ottid)
        container = document.body.querySelector('div.previewModal--player_container.detail-modal.has-smaller-buttons')
        chrome.storage.local.get(['mark_ott'], function(result){
            mark_ott = result['mark_ott']
            btnimg = container.querySelector('button.btn-mark > img')
            if(mark_ott.includes(ottid)){
                btnimg.src = chrome.runtime.getURL("/images/check.png")
            }else{
                btnimg.src = chrome.runtime.getURL("/images/plus-sign.png")
            }
        })
    }
}

chrome.runtime.onMessage.addListener(msg => {
    if(msg === "refresh"){
        netflixOnBrowseJbvRefresh()
    }
});