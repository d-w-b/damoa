
// btn-mark 클릭 이벤트
function youtubeWatchOnClickMarkHandler(e){
    vid = window.location.href.split('=')[1]
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
function youtubeWatchOnClickNotificationHandler(e){
    container = document.body.querySelector('div#owner.item.style-scope.ytd-watch-metadata')
    //console.log(container.getElementsByClassName('ytd-video-owner-renderer'))
    a = container.getElementsByClassName('ytd-video-owner-renderer')[0]
    //console.log(a)
    if(a.href.split('/')[3].includes('@')){
        channelName= a.href.split('/')[3].slice(1,)
    }else{
        channelName= a.href.split('/')[4]
    }

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
            //e.target.src = chrome.runtime.getURL("/images/notifications_mouse_over.png")
        }else if(channelName !== null){
            // 아직 추가되지 않은 콘텐트라면 클릭 시 채널 알림목록에 추가
            
            addChannelImg(channelImg)
            addChannelSetting("0000")
            addChannelName(channelName)
            //채널 페이지 HTML 요청
            chrome.runtime.sendMessage({ type: 'getChannelPage', data : channelName }, response => {
                // HTML 에서 "externalid 찾기"
                match = response.match(ID_PATTERN)

                // externalid 를 찾은 경우
                if(match){
                    match = match[0].split(',')[0]
                    channelid = match.split(':')[1]
                    channelid = channelid.slice(1,-1)
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
                        //e.target.src = chrome.runtime.getURL("/images/notifications.png")
                    })
                } 
                youtubeOnWatchRefresh()
            })
            
        }
    })
}

// btn-mark 마우스 오버 이벤트
function youtubeWatchOnMouseOverHandler(e){
    e.target.style.boxShadow = "0 0 0 4px #a7a7a7 inset"
}
// 채널 알림 마우스 오버 이벤트
function youtubeWatchOnMouseOverNotificationHandler(e){
    container = document.body.querySelector('div#owner.item.style-scope.ytd-watch-metadata')
    if(container.querySelector('a.yt-simple-endpoint.style-scope.ytd-video-owner-renderer').href.split('/')[3].includes('@')){
        channelName= container.querySelector('a.yt-simple-endpoint.style-scope.ytd-video-owner-renderer').href.split('/')[3].slice(1,)
    }else{
        channelName= container.querySelector('a.yt-simple-endpoint.style-scope.ytd-video-owner-renderer').href.split('/')[4]
    }
    console.log(channelName)
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

// btn-mark 마우스 아웃 이벤트
function youtubeWatchOnMouseOutHandler(e){
    e.target.style.boxShadow = "none"
}


// 채널 알림 마우스 아웃 이벤트
function youtubeWatchOnMouseOutNotificationHandler(e){
    container = document.body.querySelector('div#owner.item.style-scope.ytd-watch-metadata')
    if(container.querySelector('a.yt-simple-endpoint.style-scope.ytd-video-owner-renderer').href.split('/')[3].includes('@')){
        channelName= container.querySelector('a.yt-simple-endpoint.style-scope.ytd-video-owner-renderer').href.split('/')[3].slice(1,)
    }else{
        channelName= container.querySelector('a.yt-simple-endpoint.style-scope.ytd-video-owner-renderer').href.split('/')[3]
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

// Refresh UI
function youtubeOnWatchRefresh(){
    
    let container = document.body.querySelector('div#owner.item.style-scope.ytd-watch-metadata')
    if(container.querySelector('a.yt-simple-endpoint.style-scope.ytd-video-owner-renderer').href.split('/')[3].includes('@')){
        channelName= container.querySelector('a.yt-simple-endpoint.style-scope.ytd-video-owner-renderer').href.split('/')[3].slice(1,)
    }else{
        channelName= container.querySelector('a.yt-simple-endpoint.style-scope.ytd-video-owner-renderer').href.split('/')[3]
    }
    console.log(channelName)
    let vid = window.location.href.split('=')[1]   
    
   
    chrome.storage.local.get(['mark_channel_name'], function(result){
        mark_channel_name = result["mark_channel_name"]

        if(mark_channel_name.includes(channelName)){
            btnImg = container.querySelector('button.btn-notification > img')
            btnImg.src = chrome.runtime.getURL('images/notifications_mouse_over.png')
        }else{
            btnImg = container.querySelector('button.btn-notification > img')
            btnImg.src = chrome.runtime.getURL('images/notifications.png')
        }
    })

    chrome.storage.local.get(['mark_youvid'], function(result){
        mark_youvid = result['mark_youvid']

        if(mark_youvid.includes(vid)){
            btnImg = container.querySelector('button.btn-mark > img')
            btnImg.src = chrome.runtime.getURL('/images/check.png')
        }else{
            btnImg = container.querySelector('button.btn-mark > img')
            btnImg.src = chrome.runtime.getURL('/images/plus-sign2.png')
        }
    })
}


chrome.runtime.onMessage.addListener(msg => {
    if(msg === "refresh"){
        console.log("youtube on watch refresh")
        youtubeOnWatchRefresh()
    }
});

function youtubeWatchRecognizeContainer(){
    container = document.body.querySelector('div#owner.item.style-scope.ytd-watch-metadata')
    if(container.querySelector('a.yt-simple-endpoint.style-scope.ytd-video-owner-renderer')?.href.split('/')[3].includes('@')){
        channelName= container.querySelector('a.yt-simple-endpoint.style-scope.ytd-video-owner-renderer')?.href.split('/')[3].slice(1,)
    }else{
        channelName= container.querySelector('a.yt-simple-endpoint.style-scope.ytd-video-owner-renderer')?.href.split('/')[3]
    }
    vid = window.location.href.split('=')[1]

    if(!youtubeWatchContainersList.includes(container) && channelName && vid){

        // 영상 추가 버튼 생성+-
        BtnMarkInner = document.createElement("img");
    
        chrome.storage.local.get(['mark_youvid'], function(result){
            mark_youvid = result['mark_youvid']
            if( mark_youvid.includes(vid) ){
                // 이미 추가된 항목이라면 체크 표시
                BtnMarkInner.src = chrome.runtime.getURL("/images/check.png")
            }else{
                //아직 추가되지 않은 항목이라면 추가 표시
                BtnMarkInner.src = chrome.runtime.getURL("/images/plus-sign2.png")
            }
        })
    
        // 버튼 스타일링
        BtnMarkInner.style.transition = "all 0.5s"
        BtnMarkInner.style.borderRadius = "18px"
    
        const BtnMark = document.createElement('button');
        BtnMark.classList.add("btn-mark");
        BtnMark.style.position = "absolute";
        BtnMark.style.right = "0px";
        BtnMark.style.top = "-7px";
        BtnMark.style.background = "none";
        BtnMark.style.border = "none"
        BtnMark.style.zIndex = 9999;
        BtnMark.style.cursor = "pointer"
    
        BtnMarkInner.addEventListener('mouseover', youtubeWatchOnMouseOverHandler, false);
        BtnMarkInner.addEventListener('mouseout', youtubeWatchOnMouseOutHandler, false);
        BtnMark.addEventListener('click', youtubeWatchOnClickMarkHandler, false);
    
        BtnMark.appendChild(BtnMarkInner)
        container.appendChild(BtnMark)
    
        // 알림 추가 버튼 생성
        BtnInner = document.createElement("img");
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
        BtnNotification.style.left = "0px";
        BtnNotification.style.background = "none";
        BtnNotification.style.border = "none"
        BtnNotification.style.zIndex = 10;
        BtnNotification.style.cursor = "pointer"
    
        //버튼 이벤트 추가
        BtnNotification.addEventListener('click', youtubeWatchOnClickNotificationHandler, false);
        BtnNotification.addEventListener('mouseover', youtubeWatchOnMouseOverNotificationHandler, false);
        BtnNotification.addEventListener('mouseout',youtubeWatchOnMouseOutNotificationHandler, false)
    
        //버튼 추가
        BtnNotification.appendChild(BtnInner)
        container.appendChild(BtnNotification)
        youtubeWatchContainersList.push(container)
    }    
    
}
function youtubeBrowseMutationHandler(mutationList, observer) {
    if(!window.location.href.includes('watch')){ observer.disconnect() }
    else{youtubeWatchRecognizeContainer();}
}

/***********************************************************************************************************************/
/* Config */
observerConfig={
    childList : true,
    subtree: true
}

waitForElement('div#columns').then((mountPoint)=>{
    observer = new MutationObserver(youtubeBrowseMutationHandler);
    observer.observe(mountPoint, observerConfig);
})



