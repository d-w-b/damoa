/** 유튜브 Browse 페이지 크롬 확장 프로그램 스크립트 **/
console.log('youtube.com/')

document.body.addEventListener('forgot', function(){
    forgotEventHandler()
})

/* 버튼 추가 함수 */ 
// 유튜브 영상 추가 버튼
function youtubeBrowseCreateBtnMark(node, vid){

    const BtnInner = document.createElement("img");
    chrome.storage.local.get(['mark_youvid'], function(result){
        //storage.local process
        mark_youvid = result['mark_youvid']
        if( mark_youvid.includes(vid) ){
            // 이미 추가된 항목이라면 체크 표시
            BtnInner.src = chrome.runtime.getURL("/images/check.png")
        }else{
            //아직 추가되지 않은 항목이라면 추가 표시
            BtnInner.src = chrome.runtime.getURL("/images/plus-sign2.png")
        }
    })

    // 버튼 스타일링
    BtnInner.style.transition = "all 0.5s"
    BtnInner.style.borderRadius = "18px"

    const BtnMark = document.createElement('button');
    BtnMark.classList.add("btn-mark");
    BtnMark.style.position = "absolute";
    BtnMark.style.top = "-50px"
    BtnMark.style.right = "0px"
    BtnMark.style.background = "none";
    BtnMark.style.border = "none"
    BtnMark.style.zIndex = 10;
    BtnMark.style.cursor = "pointer"
    
    BtnInner.addEventListener('mouseover', youtubeBrowseOnMouseOverHandler, false);
    BtnInner.addEventListener('mouseout', youtubeBrowseOnMouseOutHandler, false);
    BtnMark.addEventListener('click', youtubeBrowseOnClickMarkHandler, false);
    
    BtnMark.appendChild(BtnInner)
    node.parentNode.querySelector('div#details').appendChild(BtnMark)
    
}

// 유튜브 채널 추가 버튼
function youtubeBrowseCreateChannelBtnMark(node, channelName){

    const BtnInner = document.createElement("img");
    chrome.storage.local.get(['mark_channel_name'], function(result){
        mark_channel_name = result['mark_channel_name']
        if(mark_channel_name.includes(channelName)){
            // 이미 추가된 항목이라면 체크 표시
            BtnInner.src = chrome.runtime.getURL("/images/notifications_mouse_over.png")
        }else{
            // 아직 추가되지 않은 항목이라면
            BtnInner.src = chrome.runtime.getURL("/images/notifications.png")
        }
    })

    // 버튼 스타일링
    const BtnNotification = document.createElement('button');
    BtnNotification.classList.add("btn-notification");
    BtnNotification.style.position = "absolute";
    BtnNotification.style.top = "50px";
    BtnNotification.style.left = "5px";
    BtnNotification.style.background = "none";
    BtnNotification.style.border = "none"
    BtnNotification.style.zIndex = 10;
    BtnNotification.style.cursor = "pointer"

    //버튼 이벤트 추가
    BtnNotification.addEventListener('click', youtubeBrowseOnClickNotificationHandler, false);
    BtnNotification.addEventListener('mouseover', youtubeBrowseOnMouseOverNotificationHandler, false);
    BtnNotification.addEventListener('mouseout',youtubeBrowseOnMouseOutNotificationHandler, false)
    
    //버튼 추가
    BtnNotification.appendChild(BtnInner)
    node.parentNode.querySelector('div#details').appendChild(BtnNotification)
}

// 유튜브 믹스 추가 버튼 생성 (추후 작업)
function youtubeBrowseCreateBtnMarkMix(c){
    if(c.querySelector('.btn-mark')){
        c.querySelector('.btn-mark').remove()
    }
    if(c.querySelector('.btn-notification')){
        c.querySelector('.btn-notification').remove()
    }
    link = c.querySelector('a#thumbnail')
    url = link.href
    imgsrc = link.querySelector('img').src
}

/* 버튼 이벤트 핸들러 */

//btn-mark 클릭 이벤트
function youtubeBrowseOnClickMarkHandler(e){
    console.log( e.target.closest('#details'))
    thumbnail = e.target.closest('#details').querySelector("a#video-title-link")
    vid = thumbnail?.href.split('/')[3].split('=')[1]
    chrome.storage.local.get(['mark_youvid'], function(result){
        mark_youvid = result['mark_youvid']
        if (mark_youvid.includes(vid)){
            // 이미 추가된 콘텐트라면
            del = mark_youvid.indexOf(vid)
            deleteYouvidMarked(del)
            deleteYouvidSetting(del)
            //e.target.src = chrome.runtime.getURL("/images/plus-sign2.png")
        }else{
            // 아직 추가되지 않은 콘텐트라면
            addYouvidMarked(vid)
            addYouvidSetting("0000")
            //e.target.src = chrome.runtime.getURL("/images/check.png")
        } 
        youtubeOnBrowseRefresh()
    })
}

// 채널 알림 클릭 이벤트
function youtubeBrowseOnClickNotificationHandler(e){
    container = e.target.closest('#details')
    channelUrl = container.getElementsByClassName("yt-simple-endpoint style-scope ytd-rich-grid-media")[0].href
    if(channelUrl.split('/')[3].includes('@')){
        channelName= channelUrl.split('/')[3].slice(1,)
        fetchType = "getChannelPage"
    }else{
        channelName= channelUrl.split('/')[4]
        fetchType = "getChannelPage_"
    }
    channelImg = container.querySelector('img').src

    chrome.storage.local.get(['mark_channel_name'], function(result){
        mark_channel_name = result['mark_channel_name']
        if (mark_channel_name.includes(channelName)){
            // 이미 추가된 콘텐트라면 클릭 시 채널 알림목록에서 삭제
            idx = mark_channel_name.indexOf(channelName)
            deleteChannelMarked(idx)
            deleteChannelName(idx)
            deleteChannelSetting(idx)
            deleteChannelImg(idx)

            e.target.src = chrome.runtime.getURL("/images/notifications_mouse_over.png")
        }else if(channelName !== null){
            // 아직 추가되지 않은 콘텐트라면 클릭 시 채널 알림목록에 추가
            addChannelImg(channelImg)
            addChannelSetting("0000")
            addChannelName(channelName)
            //채널 페이지 HTML 요청
            chrome.runtime.sendMessage({ type: fetchType, data : channelName }, response => {
                // HTML 에서 "externalid" 찾기
                match = response.match(ID_PATTERN)

                // externalid 를 찾은 경우
                if(match){
                    match = match[0].split(',')[0]
                    channelid = match.split(':')[1]
                    channelid = channelid.slice(1,-1)
                    console.log(channelid)
                    addChannelMarked(channelid)
                    
                    //e.target.src = chrome.runtime.getURL("/images/notifications.png")
                    
                // externalid 를 찾을 수 없음
                }else{
                    console.log("ERR : CANNOT LOAD channel page")
                    /* 드문 경우이긴 한데, 유튜브 자체적으로 오류가 있습니다. 몇몇 채널 페이지는 404 NOT FOUND 를 회신합니다. */
                    chrome.storage.local.get(['mark_channel_name'], function(result){
                        mark_channel_name = result['mark_channel_name']
                        index = mark_channel_name.indexOf(channelName)
                        deleteChannelName(index)
                        deleteChannelImg(index)
                        deleteChannelSetting(index)
                        e.target.src = chrome.runtime.getURL("/images/notifications.png")
                    })
                } 
                youtubeOnBrowseRefresh()
            })
        }
    })
}

// btn-mark 마우스 오버 이벤트
function youtubeBrowseOnMouseOverHandler(e){
    thumbnail = e.target.parentNode.parentNode.querySelector("a#video-title-link")
    url = thumbnail?.href
    if(url){
        url = url.split('/')
        // 쇼츠를 제외한 영상만 처리
        if(!url.includes("shorts") && url[3]){
            vid = url[3].split('=')[1]
            e.target.style.boxShadow = "0 0 0 3px #d0d0d0 inset"
            youtubeOnBrowseRefresh()
        }
    }
}

// 채널 알림 마우스 오버 이벤트
function youtubeBrowseOnMouseOverNotificationHandler(e){
    channelUrl = e.target.closest('#details').querySelector("a#avatar-link").href
    if(channelUrl.split('/')[3].includes('@')){
        channelName= channelUrl.split('/')[3].slice(1,)
    }else{
        channelName= channelUrl.split('/')[4]
    }

    chrome.storage.local.get(['mark_channel_name'], function(result){
        mark_channel_name = result['mark_channel_name']
        if (mark_channel_name.includes(channelName)){
            // 이미 추가된 콘텐트라면
            e.target.src = chrome.runtime.getURL("/images/notifications_cancel_mouse_over.png")
        }else{
            // 아직 추가되지 않은 콘텐트라면
            e.target.src = chrome.runtime.getURL("/images/notifications_mouse_over.png")
        } 
    })
}

// 마우스 아웃 이벤트
function youtubeBrowseOnMouseOutHandler(e){
    thumbnail = e.target.parentNode.parentNode.querySelector("a#video-title-link")
    url = thumbnail?.href
    if(url){
        url = url.split('/')
        // 쇼츠를 제외한 영상만 처리
        if(!url.includes("shorts") && url[3]){
            vid = url[3].split('=')[1]
            youtubeOnBrowseRefresh()
            e.target.style.boxShadow = "none"
        }
    }
}

// 채널 알림 마우스 아웃 이벤트
function youtubeBrowseOnMouseOutNotificationHandler(e){
    channelUrl = e.target.closest('#details').querySelector("a#avatar-link").href
    if(channelUrl.split('/')[3].includes('@')){
        channelName= channelUrl.split('/')[3].slice(1,)
    }else{
        channelName= channelUrl.split('/')[4]
    }

    chrome.storage.local.get(['mark_channel_name'], function(result){
        mark_channel_name = result['mark_channel_name']
        if (mark_channel_name.includes(channelName)){
            // 이미 추가된 콘텐트라면
            e.target.src = chrome.runtime.getURL("/images/notifications_mouse_over.png")
        }else{
            // 아직 추가되지 않은 콘텐트라면
            e.target.src = chrome.runtime.getURL("/images/notifications.png")
        } 
    })
}

/* 컨테이너 DOM Recognition */
function youtubeBrowseRecognizeContainers() {
    console.log("onBrowseRecognizeContainers")
    cards = document.querySelectorAll('div#content.style-scope.ytd-rich-item-renderer');
    // 각 container 별로 '+' 버튼 추가 및 배열에 저장
    for (c of cards){
        if (!youtubeContainersList.includes(c)){
            thumbnail = c.querySelector('a#thumbnail')
            
            url = thumbnail?.href
            if(c.querySelector('a#avatar-link')?.href.includes('@')){
                channelName = c.querySelector('a#avatar-link')?.href.split('@')[1]
            }else{
                channelName = c.querySelector('a#avatar-link')?.href.split('/')[4]
            }

            if(url && channelName ){ 
                url = url.split('/')
                // 쇼츠를 제외한 영상만 처리
                if(!url.includes("shorts") && url[3]){
                    vid = url[3].split('=')[1]
                    youtubeBrowseCreateBtnMark(c, vid)
                    youtubeBrowseCreateChannelBtnMark(c, channelName)
                    youtubeContainersList.push(c)
                }
            }else{
                // 쇼츠, 믹스, 설문조사 등... 처리
                if(!youtubeErrList.includes(c) ){
                    youtubeErrList.push(c)
                    let errEvent = new Event("forgot")
                    document.body.dispatchEvent(errEvent)
                }
            }
        }
    }
}

// forgot 이벤트 핸들러
function forgotEventHandler(){  
    for(c of youtubeErrList){
        // 아직 처리되지 않은 카드 컨테이너들 처리
        idx = youtubeErrList.indexOf(c)
        youtubeErrList.splice(idx, 1)
        thumbnail = c.querySelector('a#thumbnail')
        url = thumbnail?.href
        channelUrl = c.querySelector("a#avatar-link")?.href
        if(url&& channelUrl && !url.includes("shorts")){
            if( channelUrl.split('/')[3].includes('@') ){
                channelName= channelUrl.split('/')[3].slice(1,)
            }else{
                channelName= channelUrl.split('/')[4]
            }
            vid = url?.split('/')[3].split('=')[1]
            console.log(vid, channelName)
            youtubeBrowseCreateBtnMark(c, vid)
            youtubeBrowseCreateChannelBtnMark(c, channelName)
            youtubeContainersList.push(c)
        }else if(!url){ // 광고, 설문조사 등..
            console.log('YOUTUBE AD')
        }else if(url.includes("shorts")){   // 유튜브 쇼츠 처리
            if(!youtubeShortsContainers.includes(c)){
                youtubeShortsContainers.push(c)
                console.log('SHORTS DETECTED')
            }
        }else if(c.querySelector("a#video-title-link")?.title.includes('믹스')){
            //유튜브 믹스 핸들링
            if(!youtubeMixContainers.includes(c)){
                youtubeMixContainers.push(c)
                youtubeBrowseCreateBtnMarkMix(c)  
            }
        }else{
            //RETRY
            youtubeErrList.push(c)
            setTimeout(()=>{
                let errEvent = new Event("forgot")
                document.body.dispatchEvent(errEvent)
            },1000)
        }
    }
}

// Refresh UI
function youtubeOnBrowseRefresh(){
    console.log("onBrowseRefresh")
    // REFRESH
    chrome.storage.local.get(['mark_channel_name', 'mark_youvid'], function(result){
        mark_channel_name = result["mark_channel_name"]
        mark_youvid = result['mark_youvid']

        // refresh cards in Containers List 
        for(c of youtubeContainersList){
            if(c.querySelector('a#avatar-link')?.href.includes('@')){
                channelName = c.querySelector('a#avatar-link')?.href.split('@')[1]
            }else{
                channelName = c.querySelector('a#avatar-link')?.href.split('/')[4]
            }
            url = c.querySelector('a#thumbnail')?.href
            if( !url.includes('shorts') ){

                vid = url.split('/')[3].split('=')[1]
                title = (c.querySelector("a#avatar-link")?.title === "undefined")
    
                if(title){
                    youtubeBrowseCreateBtnMarkMix(c)
                }
    
                btnNotificationImg = c.querySelector('button.btn-notification > img')
                btnMarkImg = c.querySelector('button.btn-mark > img')
                if( btnMarkImg && btnNotificationImg ){
                    if( mark_channel_name.includes(channelName) && channelName ){
                        btnNotificationImg.src = chrome.runtime.getURL('images/notifications_mouse_over.png')
                    }else{
                        btnNotificationImg.src = chrome.runtime.getURL('images/notifications.png')
                    }
        
                    if( mark_youvid.includes(vid) && vid ){
                        btnMarkImg.src = chrome.runtime.getURL('/images/check.png')
                    }else{
                        btnMarkImg.src = chrome.runtime.getURL('/images/plus-sign2.png')
                    }
                }else{
                    youtubeBrowseCreateBtnMark(c, vid)
                    youtubeBrowseCreateChannelBtnMark(c, channelName)
                }
            }
        }
    })
}



/***********************************************************************************************************************/
chrome.runtime.onMessage.addListener(msg => {
    if(msg === "refresh"){
        youtubeOnBrowseRefresh()
    }
});

/* Mutation Observer */
/* Config */
observerConfig={
    childList : true,
    subtree: true
}
// mutationObserver 이벤트 핸들러
function youtubeBrowseMutationHandler(mutationList, observer) {
    let u = new URL(window.location.href)
    if(u.pathname.length > 1 || u.host !== "www.youtube.com"){ observer.disconnect() }
    else{
        youtubeBrowseRecognizeContainers();
        youtubeOnBrowseRefresh()
    }
}

onBrowseAppMountPoint = document.querySelector('div#content');
observer = new MutationObserver(youtubeBrowseMutationHandler);
observer.observe(onBrowseAppMountPoint, observerConfig);
