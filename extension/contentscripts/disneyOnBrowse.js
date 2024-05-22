/** Disney Plus Browse 페이지 크롬 확장 프로그램 스크립트 **/
console.log('Disney Plus on Browse')

/* 버튼 추가 함수 */ 
function disneyBrowseCreateBtnMark(pNode,title){
    let ottid = "DisneyPlus_"+title
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
    BtnMark.style.top = "27px";
    BtnMark.style.cursor = "pointer"
    BtnMark.style.background = "none";
    BtnMark.style.border = "none";
    BtnMark.style.outline = "none";
    BtnMark.style.zIndex = 9999;

    BtnInner.addEventListener('mouseover', disneyBrowseOnMouseOverHandler, false);
    BtnInner.addEventListener('mouseout', disneyBrowseOnMouseOutHandler, false);
    BtnMark.addEventListener('click', disneyBrowseOnClickMarkHandler, false);
    
    BtnMark.appendChild(BtnInner)
    pNode.appendChild(BtnMark)
}

function disneyDetailCreateBtnMark(pNode,title){
    let ottid = "DisneyPlus_"+title
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
    BtnMark.style.left = "18%";
    BtnMark.style.top = "350px";
    BtnMark.style.cursor = "pointer"
    BtnMark.style.background = "none";
    BtnMark.style.border = "none";
    BtnMark.style.outline = "none";
    BtnMark.style.zIndex = 9999;

    BtnInner.addEventListener('mouseover', disneyDetailOnMouseOverHandler, false);
    BtnInner.addEventListener('mouseout', disneyDetailOnMouseOutHandler, false);
    BtnMark.addEventListener('click', disneyDetailOnClickMarkHandler, false);
    
    BtnMark.appendChild(BtnInner)
    pNode.appendChild(BtnMark)
}

/* 버튼 이벤트 핸들러 */
function disneyBrowseOnClickMarkHandler(e){
    let container = e.target.parentNode.parentNode
    let img = container.querySelector('img')
    let imgsrc = img.src
    let title = img.alt
    if(container.querySelector('#asset-metadata') && container.querySelector('p.body-copy')){
        title = container.querySelector('p.body-copy').textContent
    }else if(title.includes('.')){
        title = title.split('.')[0]
    }
    let ottid = "DisneyPlus_"+title

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
        }else {
        // 아직 추가되지 않은 콘텐트는 목록에 추가합니다.
            addOTTMarked(ottid)
            addOTTType('Disney Plus')
            addOTTImg(imgsrc)
            addOTTTitle(title)
            addOTTUrl(null)
            addOTTSetting("0000")
        }
        disneyOnBrowseRefresh()
    })
}

function disneyDetailOnClickMarkHandler(e){
    let container = e.target.parentNode.parentNode
    let img = container.querySelector('img')
    let imgsrc = img.src
    let title = img.alt
    let ottid = "DisneyPlus_"+title

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
        }else {
        // 아직 추가되지 않은 콘텐트는 목록에 추가합니다.
            addOTTMarked(ottid)
            addOTTType('Disney Plus')
            addOTTImg(imgsrc)
            addOTTTitle(title)
            addOTTUrl(null)
            addOTTSetting("0000")
        }
        disneyOnDetailRefresh()
    })
}

function disneyBrowseOnMouseOverHandler(e){
    let container = e.target.parentNode.parentNode
    let img = container.querySelector('img')
    let title = img.alt
    if(container.querySelector('#asset-metadata') && container.querySelector('p.body-copy')){
        title = container.querySelector('p.body-copy').textContent
    }else if(title.includes('.')){
        title = title.split('.')[0]
    }
    let ottid = "DisneyPlus_"+title
    e.target.style.boxShadow = "0 0 0 3px #FFF inset"
    chrome.storage.local.get(['mark_ott'], function(result){
        mark_ott = result['mark_ott']
        if (!mark_ott.includes(ottid)){
            e.target.src = chrome.runtime.getURL("/images/plus-sign2.png")
        }
    })
}

function disneyDetailOnMouseOverHandler(e){
    let container = e.target.parentNode.parentNode
    let img = container.querySelector('img')
    let title = img.alt
    let ottid = "DisneyPlus_"+title
    e.target.style.boxShadow = "0 0 0 3px #FFF inset"
    chrome.storage.local.get(['mark_ott'], function(result){
        mark_ott = result['mark_ott']
        if (!mark_ott.includes(ottid)){
            e.target.src = chrome.runtime.getURL("/images/plus-sign2.png")
        }
    })
}

function disneyBrowseOnMouseOutHandler(e){
    let container = e.target.parentNode.parentNode
    let img = container.querySelector('img')
    let title = img.alt
    if(container.querySelector('#asset-metadata') && container.querySelector('p.body-copy')){
        title = container.querySelector('p.body-copy').textContent
    }else if(title.includes('.')){
        title = title.split('.')[0]
    }
    let ottid = "DisneyPlus_"+title
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

function disneyDetailOnMouseOutHandler(e){
    let container = e.target.parentNode.parentNode
    let img = container.querySelector('img')
    let title = img.alt
    let ottid = "DisneyPlus_"+title
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

function disneyOnBrowseRecognizeContainers(){
   containers = document.body.querySelectorAll('div.gv2-asset')
   for(c of containers){
    if(!disneyContainersList.includes(c) && !c.parentNode.classList.length){
        img = c.querySelector('img')
        imgsrc = img.src
        title = img.alt
        if(c.querySelector('#asset-metadata') && c.querySelector('p.body-copy')){
            title = c.querySelector('p.body-copy').textContent
        }else if(title.includes('.')){
            title = title.split('.')[0]
        }
        disneyBrowseCreateBtnMark(c, title)
        disneyContainersList.push(c)
    }
   }
}

function disneyOnDetailRecognizeContainers(){
    container = document.body.querySelector('article')
    if(!disneyContainersList.includes(container)){
        img = container.querySelector('img')
        imgsrc = img.src
        title = img.alt
        disneyDetailCreateBtnMark(container, title)
        disneyContainersList.push(container)
    }
    
}

//Refresh UI
function disneyOnBrowseRefresh(){
    chrome.storage.local.get(['mark_ott'], function(result){
        mark_ott = result['mark_ott']
        for(c of disneyContainersList){
            img = c.querySelector('img')
            title = img.alt
            if(c.querySelector('#asset-metadata') && c.querySelector('p.body-copy')){
                title = c.querySelector('p.body-copy').textContent
            }else if(title.includes('.')){
                title = title.split('.')[0]
            }
            ottid = "DisneyPlus_"+ title

            if(mark_ott.includes(ottid)){
                btnImg = c.querySelector('button.btn-mark > img')
                btnImg.src = chrome.runtime.getURL('images/check.png')
            }else{
                btnImg = c.querySelector('button.btn-mark > img')
                btnImg.src = chrome.runtime.getURL('images/plus-sign.png')
            }
        }
    })
}

function disneyOnDetailRefresh(){
    console.log('disney on detail')
    chrome.storage.local.get(['mark_ott'], function(result){
        mark_ott = result['mark_ott']
        for(c of disneyContainersList){
            
            img = c.querySelector('img')
            title = img.alt
            ottid = "DisneyPlus_"+ title

            if(mark_ott.includes(ottid)){
                btnImg = c.querySelector('button.btn-mark > img')
                btnImg.src = chrome.runtime.getURL('images/check.png')
            }else{
                btnImg = c.querySelector('button.btn-mark > img')
                btnImg.src = chrome.runtime.getURL('images/plus-sign.png')
            }
        }
    })
}

// mutationObserver 이벤트 핸들러
function onBrowseMutationHandler(mutationList, observer) {
    disneyOnBrowseRecognizeContainers();
}

function onDetailMutationHandler(mutationList, observer) {
    disneyOnDetailRecognizeContainers();
}

/* Config */
observerConfig={
    childList : true,
    subtree: true
}
/***********************************************************************************************************************/
chrome.runtime.onMessage.addListener(msg => {
    if(msg === "refresh"){
        if(window.location.href.includes('home')){
            disneyOnBrowseRefresh()
        }
        else{
            disneyOnDetailRefresh()
        }
    }
});

waitForElement("main#section_index").then(element => {
    observer = new MutationObserver(onBrowseMutationHandler);
    observer.observe(element, observerConfig)
})

waitForElement("main.details").then(element => {
    observer = new MutationObserver(onDetailMutationHandler);
    observer.observe(element, observerConfig)

    // if(!c.querySelector('btn-mark')){
    //     container = document.body.querySelector('article')
    //     disneyDetailCreateBtnMark(container, title)
    // }
})

