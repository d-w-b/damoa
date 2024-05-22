/** wavve Browse 페이지 크롬 확장 프로그램 스크립트 **/
console.log("wavve on browse")

/* 버튼 추가 함수 */ 
function wavveBrowseCreateBtnMark(pNode,title){
    let ottid = "wavve_"+title
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
    BtnMark.style.position = "relative";
    BtnMark.style.width = "0px"
    BtnMark.style.height = "0px"
    BtnMark.style.left = "85%";
    BtnMark.style.top = "3px";
    BtnMark.style.cursor = "pointer"
    BtnMark.style.background = "none";
    BtnMark.style.border = "none";
    BtnMark.style.outline = "none";
    BtnMark.style.zIndex = 9999;

    BtnInner.addEventListener('mouseover', wavveBrowseOnMouseOverHandler, false);
    BtnInner.addEventListener('mouseout', wavveBrowseOnMouseOutHandler, false);
    BtnMark.addEventListener('click', wavveBrowseOnClickMarkHandler, false);
    
    BtnMark.appendChild(BtnInner)
    pNode.appendChild(BtnMark)
}

// Detail 페이지 btn-mark 생성
function wavveDetailCreateBtnMark(pNode,title){
    let ottid = "wavve_"+title
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
    BtnMark.style.width = "0px"
    BtnMark.style.height = "0px"
    BtnMark.style.left = "20%";
    BtnMark.style.top = "477px";
    BtnMark.style.cursor = "pointer"
    BtnMark.style.background = "none";
    BtnMark.style.border = "none";
    BtnMark.style.outline = "none";
    BtnMark.style.zIndex = 9999;

    BtnInner.addEventListener('mouseover', wavveDetailOnMouseOverHandler, false);
    BtnInner.addEventListener('mouseout', wavveDetailOnMouseOutHandler, false);
    BtnMark.addEventListener('click', wavveDetailOnClickMarkHandler, false);
    
    BtnMark.appendChild(BtnInner)
    pNode.appendChild(BtnMark)
}

/* 버튼 이벤트 핸들러 */
function wavveBrowseOnClickMarkHandler(e){
    let c = e.target.parentNode.parentNode
    imgsrc = c.querySelector('.picture-area > picture > source').srcset.split(' ')[0]
    title = c.querySelector('.picture-area > picture > img').alt
    let ottid = "wavve_"+title

    chrome.storage.local.get(['mark_ott'], function(result){
        mark_ott = result['mark_ott']
        // 이미 추가된 콘텐트는 목록에서 삭제합니다.
        if( mark_ott.includes(ottid) ){ 
            index = mark_ott.indexOf(ottid)

            deleteOTTType(index)
            deleteOTTImg(index)
            deleteOTTTitle(index)
            deleteOTTUrl(index)
            deleteOTTSetting(index)
            deleteOTTMarked(index)

            e.target.src = chrome.runtime.getURL("/images/plus-sign.png")
        }else {
        // 아직 추가되지 않은 콘텐트는 목록에 추가합니다.

            addOTTType('wavve')
            addOTTImg(imgsrc)
            addOTTTitle(title)
            addOTTUrl(null)
            addOTTSetting("0000")
            addOTTMarked(ottid)

            e.target.src = chrome.runtime.getURL("/images/check.png")
        }
    })
}

function wavveDetailOnClickMarkHandler(e){
    let c = e.target.parentNode.parentNode
    imgsrc = c.querySelector('div.picture-area > picture > source').srcset.split(' ')[0]
    logoElement = c.querySelector('div.video-detail-area > h1 > em')
    titleimg = logoElement.querySelector('img').src
    title = logoElement.querySelector('img').alt
    let ottid = "wavve_"+title

    chrome.storage.local.get(['mark_ott'], function(result){
        mark_ott = result['mark_ott']
        // 이미 추가된 콘텐트는 목록에서 삭제합니다.
        if( mark_ott.includes(ottid) ){ 
            index = mark_ott.indexOf(ottid)

            deleteOTTType(index)
            deleteOTTImg(index)
            deleteOTTTitle(index)
            deleteOTTUrl(index)
            deleteOTTSetting(index)
            deleteOTTMarked(index)

            e.target.src = chrome.runtime.getURL("/images/plus-sign.png")
        }else {
        // 아직 추가되지 않은 콘텐트는 목록에 추가합니다.

            addOTTType('wavve')
            addOTTImg(imgsrc)
            addOTTTitle(title)
            addOTTUrl(null)
            addOTTSetting("0000")
            addOTTMarked(ottid)

            e.target.src = chrome.runtime.getURL("/images/check.png")
        }
    })
}


function wavveBrowseOnMouseOverHandler(e){
    let c = e.target.parentNode.parentNode
    //let imgsrc = c.querySelector('.picture-area > picture > source').srcset.split(' ')[0]
    let title = c.querySelector('.picture-area > picture > img').alt
    let ottid = "wavve_"+title
    e.target.style.boxShadow = "0 0 0 3px #FFF inset"
    chrome.storage.local.get(['mark_ott'], function(result){
        mark_ott = result['mark_ott']
        if (!mark_ott.includes(ottid)){
            e.target.src = chrome.runtime.getURL("/images/plus-sign2.png")
        }
    })
}

function wavveDetailOnMouseOverHandler(e){
    let c = e.target.parentNode.parentNode
    //imgsrc = c.querySelector('div.picture-area > picture > source').srcset.split(' ')[0]
    logoElement = c.querySelector('div.video-detail-area > h1 > em')
    titleimg = logoElement.querySelector('img').src
    title = logoElement.querySelector('img').alt
    let ottid = "wavve_"+title
    e.target.style.boxShadow = "0 0 0 3px #FFF inset"
    chrome.storage.local.get(['mark_ott'], function(result){
        mark_ott = result['mark_ott']
        if (!mark_ott.includes(ottid)){
            e.target.src = chrome.runtime.getURL("/images/plus-sign2.png")
        }
    })
}

function wavveBrowseOnMouseOutHandler(e){
    let c = e.target.parentNode.parentNode
    //let imgsrc = c.querySelector('.picture-area > picture > source').srcset.split(' ')[0]
    let title = c.querySelector('.picture-area > picture > img').alt
    let ottid = "wavve_"+title
    e.target.style.boxShadow = 'none' 
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

function wavveDetailOnMouseOutHandler(e){
    let c = e.target.parentNode.parentNode
    //imgsrc = c.querySelector('div.picture-area > picture > source').srcset.split(' ')[0]
    logoElement = c.querySelector('div.video-detail-area > h1 > em')
    titleimg = logoElement.querySelector('img').src
    title = logoElement.querySelector('img').alt
    let ottid = "wavve_"+title
    e.target.style.boxShadow = 'none' 
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
function wavveOnBrowseRefresh(){
    chrome.storage.local.get(['mark_ott'], function(result){
        mark_ott = result['mark_ott']
        for(c of wavveContainersList){
            if(c.querySelector('.picture-area > picture > source') && c.querySelector('.picture-area > picture > img')){
                imgsrc = c.querySelector('.picture-area > picture > source').srcset.split(' ')[0]
                title = c.querySelector('.picture-area > picture > img').alt
                ottid = "wavve_"+title
                btnImg = c.querySelector('button.btn-mark > img')
    
                if(mark_ott.includes(ottid)){
                    btnImg.src = chrome.runtime.getURL('images/check.png')
                }else{
                    btnImg.src = chrome.runtime.getURL('images/plus-sign.png')
                }
            }
        }
    })
}

function wavveOnBrowseRecognizeContainers(){
    containers = document.body.querySelectorAll('div.thumb.portrait > a')
    for (c of containers){
        if(!wavveContainersList.includes(c)){
            imgsrc = c.querySelector('.picture-area > picture > source').srcset.split(' ')[0]
            title = c.querySelector('.picture-area > picture > img').alt
            wavveBrowseCreateBtnMark(c, title)
            wavveContainersList.push(c)
        }
        
    }
    
}


function wavveOnDetailRecognizeContainers(){
    wavveDetailContainer = document.body.querySelector('div.player-contents')
    if(!wavveContainersList.includes(wavveDetailContainer)){
        imgsrc = document.body.querySelector('div.picture-area > picture > source').srcset.split(' ')[0]
        logoElement = document.body.querySelector('div.video-detail-area > h1 > em')
        titleimg = logoElement.querySelector('img').src
        title = logoElement.querySelector('img').alt
    
        wavveDetailCreateBtnMark(wavveDetailContainer, title)
        wavveContainersList.push(wavveDetailContainer)
    }
    
}
/*****************************************************************************************************************/
chrome.runtime.onMessage.addListener(msg => {
    if(msg === "refresh"){
        wavveOnBrowseRefresh()
    }
});

/* Config */
observerConfig={
    childList : true,
    subtree: true
}

// mutationObserver 이벤트 핸들러
function wavveOnBrowseMutationHandler(mutationList, observer) {
    if(window.location.href.includes('player')) { observer.disconnect() }
    else{
        console.log("mutated!")
        wavveOnBrowseRecognizeContainers();
        wavveOnBrowseRefresh()
    }
}

function wavveOnDetailMutationHandler(mutationList, observer){
    if(window.location.href.includes('player')){
        console.log("detail page mutated")
        wavveOnDetailRecognizeContainers()
    }else{ observer.disconnect() }   
}

waitForElement("main#contents").then(element => {
    observer = new MutationObserver(wavveOnBrowseMutationHandler);
    observer.observe(element, observerConfig)
    wavveOnBrowseRecognizeContainers()
})

waitForElement("main.vod.player-wrap").then(element => {
    observer = new MutationObserver(wavveOnDetailMutationHandler)
    observer.observe(element, observerConfig)
})

