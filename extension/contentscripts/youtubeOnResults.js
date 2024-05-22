console.log("youtube on results")

/* Config */
observerConfig={
    childList : true,
    subtree: true
}

/* 버튼 추가 함수 */ 
// 유튜브 영상 추가 버튼
function youtubeResultCreateBtnMarkElement(node, vid){
    const BtnInner = document.createElement("img");
    chrome.storage.local.get(['mark_youvid'], function(result){

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
    BtnMark.classList.add('btn-mark')
    BtnMark.style.position = "absolute";
    BtnMark.style.right = "32px"
    BtnMark.style.top = "-7px"
    BtnMark.style.background = "none";
    BtnMark.style.border = "none"
    BtnMark.style.zIndex = 10;
    BtnMark.style.cursor = "pointer"

    BtnInner.addEventListener('mouseover', youtubeResultOnMouseOverHandler, false);
    BtnInner.addEventListener('mouseout', youtubeResultOnMouseOutHandler, false);
    BtnMark.addEventListener('click', youtubeResultOnClickMarkHandler, false);
    
    BtnMark.appendChild(BtnInner)
    node.appendChild(BtnMark)
}

// 유튜브 채널 버튼 추가
function youtubeResultCreateChannelBtnMark(node, channelName){
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
    BtnNotification.style.position = "relative";
    BtnNotification.style.top = "0px";
    BtnNotification.style.left = "5px";
    BtnNotification.style.background = "none";
    BtnNotification.style.border = "none"
    BtnNotification.style.zIndex = 9999;
    BtnNotification.style.cursor = "pointer"

    //버튼 이벤트 추가
    BtnNotification.addEventListener('click', youtubeResultOnClickNotificationHandler, false);
    BtnNotification.addEventListener('mouseover', youtubeResultOnMouseOverNotificationHandler, false);
    BtnNotification.addEventListener('mouseout',youtubeResultOnMouseOutNotificationHandler, false)
    
    //버튼 추가
    BtnNotification.appendChild(BtnInner)
    node.querySelector('div#channel-info').appendChild(BtnNotification)
}

/* 버튼 이벤트 핸들러 */

//클릭 이벤트
function youtubeResultOnClickMarkHandler(e){
    thumbnail = e.target.closest('#dismissible').querySelector("a#thumbnail")
    url = thumbnail?.href
    if(url){
        // 쇼츠를 제외한 영상만 처리
        if(!url.includes("shorts")){
            vid = url.split('/')[3].split('=')[1].slice(0,-3)
        }
    }

    chrome.storage.local.get(['mark_youvid'], function(result){
        mark_youvid = result['mark_youvid']
        if (mark_youvid.includes(vid)){
            // 이미 추가된 콘텐트라면
            del = mark_youvid.indexOf(vid)
            deleteYouvidMarked(del)
            deleteYouvidSetting(del)
            e.target.src = chrome.runtime.getURL("/images/plus-sign2.png")
        }else{
            // 아직 추가되지 않은 콘텐트라면
            addYouvidMarked(vid)
            addYouvidSetting("0000")
            e.target.src = chrome.runtime.getURL("/images/check.png")
        } 
    })
}


// 채널 알림 클릭 이벤트
function youtubeResultOnClickNotificationHandler(e){
    container = e.target.closest('#channel-info')
    channelUrl = container.querySelector("a#channel-thumbnail").href
    if(channelUrl.split('/')[3].includes('@')){
        channelName= channelUrl.split('/')[3].slice(1,)
        fetchType = "getChannelPage"
    }else{
        channelName= channelUrl.split('/')[4]
        fetchType = "getChannelPage_"
    }
    console.log(channelName, channelUrl)
    channelImg = container.querySelector('img#img').src

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
                // HTML 에서 "externalid 찾기"
                match = response.match(ID_PATTERN)
                // externalid 를 찾은 경우
                if(match){
                    match = match[0].split(',')[0]
                    channelid = match.split(':')[1]
                    channelid = channelid.slice(1,-1)
                    addChannelMarked(channelid)
                    //onResult 화면의 해당 카드의 버튼을 체크 표시로 변경
                    e.target.src = chrome.runtime.getURL("/images/notifications_cancel_mouse_over.png")
                
                // channelid를 찾을 수 없음
                }else{
                    console.log("ERR : CANNOT LOAD channel page")
                    /* 극히 드문 경우이긴 한데, 유튜브 자체적으로 오류가 있습니다. 몇몇 채널 페이지는 404 NOT FOUND 를 회신합니다. */
                    chrome.storage.local.get(['mark_channel_name'], function(result){
                        mark_channel_name = result['mark_channel_name']
                        index = mark_channel_name.indexOf(channelName)
                        deleteChannelName(index)
                        deleteChannelImg(index)
                        deleteChannelSetting(index)
                        e.target.src = chrome.runtime.getURL("/images/notifications.png")
                    })
                }
                youtubeOnResultRefresh()
            })
        }
    })
}

// 마우스 오버 이벤트
function youtubeResultOnMouseOverHandler(e){
    e.target.style.boxShadow = "0 0 0 4px #a7a7a7 inset"
}

// 채널 알림 마우스 오버 이벤트
function youtubeResultOnMouseOverNotificationHandler(e){
    channelUrl = e.target.closest('#channel-info').querySelector("a#channel-thumbnail").href
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
function youtubeResultOnMouseOutHandler(e){
    e.target.style.boxShadow = "none"
}

// 채널 알림 마우스 아웃 이벤트
function youtubeResultOnMouseOutNotificationHandler(e){
    channelUrl = e.target.closest('#channel-info').querySelector("a#channel-thumbnail").href
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
function youtubeResultRecognizeContainers() {
    cards = document.querySelectorAll('div#dismissible.style-scope.ytd-video-renderer');
    // 각 container 별로 버튼 추가 및 배열에 저장
    for (c of cards){
        if (!youtubeResultContainersList.includes(c)){
            thumbnail = c.querySelector('a#thumbnail')
            url = thumbnail?.href
            if(c.querySelector('a#channel-thumbnail')?.href.includes('@')){
                channelName = c.querySelector('a#channel-thumbnail')?.href.split('@')[1]
            }else{
                channelName = c.querySelector('a#channel-thumbnail')?.href.split('/')[4]
            }
            
            if(!url.includes("shorts") && channelName ){
                vid = url.split('/')[3].split('=')[1].slice(0,-3)
                youtubeResultCreateBtnMarkElement(c, vid)
                youtubeResultCreateChannelBtnMark(c, channelName)
                youtubeResultContainersList.push(c)
            }
        }
    }
}

function youtubeOnResultRefresh(){
    //onResult 화면의 카드의 알림 버튼 업데이트
    chrome.storage.local.get(['mark_channel_name', 'mark_youvid'], function(result){
        mark_channel_name = result["mark_channel_name"]
        mark_youvid = result['mark_youvid']
        
        for(c of youtubeResultContainersList){
            channelUrl = c.querySelector("a#channel-thumbnail").href
            if(channelUrl.split('/')[3].includes('@')){
                channelName= channelUrl.split('/')[3].slice(1,)
            }else{
                channelName= channelUrl.split('/')[4]
            }
            vid = c.querySelector('a#thumbnail').href.split('/')[3].split('=')[1].slice(0,-3)
            
            if(mark_channel_name.includes(channelName)){
                btnImg = c.querySelector('button.btn-notification > img')
                btnImg.src = chrome.runtime.getURL('images/notifications_mouse_over.png')
            }else{
                btnImg = c.querySelector('button.btn-notification > img')
                btnImg.src = chrome.runtime.getURL('images/notifications.png')
            }

            if(mark_youvid.includes(vid)){
                btnImg = c.querySelector('button.btn-mark > img')
                btnImg.src = chrome.runtime.getURL('/images/check.png')
            }else{
                btnImg = c.querySelector('button.btn-mark > img')
                btnImg.src = chrome.runtime.getURL('/images/plus-sign2.png')
            }
        }
    })
}

// mutationObserver 이벤트 핸들러
function youtubeResultMutationHandler(mutationList, observer) {
    youtubeResultRecognizeContainers();
}

/***********************************************************************************************************************/
chrome.runtime.onMessage.addListener(msg => {
    if(msg === "refresh"){
        youtubeOnResultRefresh()
    }
});
appMountPoint = document.querySelector('div#content');
observer = new MutationObserver(youtubeResultMutationHandler);
observer.observe(appMountPoint, observerConfig)

    

