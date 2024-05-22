console.log('twitch on browse')

/* 버튼 추가 함수 */
function twitchBrowseCreateBtnMarkElement(pNode, displayName) {
    const BtnInner = document.createElement("img");
    chrome.storage.local.get(['mark_streamer_name'], function (result) {
        mark_streamer_name = result['mark_streamer_name']
        if (mark_streamer_name.includes(displayName)) {
            // 이미 추가된 항목이라면 체크 표시
            BtnInner.src = chrome.runtime.getURL("/images/check.png")
        } else {
            //아직 추가되지 않은 항목이라면 추가 표시
            BtnInner.src = chrome.runtime.getURL("/images/plus-sign2.png")
        }
    })

    // 버튼 스타일링
    BtnInner.style.transition = "all 0.5s"
    BtnInner.style.borderRadius = "18px"

    const BtnMark = document.createElement('button');
    BtnMark.classList.add("btn-mark");
    BtnMark.style.position = "relative";
    BtnMark.style.left = "87%";
    BtnMark.style.bottom = "17px";
    BtnMark.style.background = "none";
    BtnMark.style.border = "none"
    BtnMark.style.zIndex = 9999;

    BtnInner.addEventListener('mouseover', twitchBrowseOnMouseOverHandler, false);
    BtnInner.addEventListener('mouseout', twitchBrowseOnMouseOutHandler, false);
    BtnMark.addEventListener('click', twitchBrowseOnClickMarkHandler, false);

    BtnMark.appendChild(BtnInner)
    pNode.appendChild(BtnMark)
}

function twitchWatchCreateBtnMarkElement(pNode, displayName) {
    const BtnInner = document.createElement("img");
    chrome.storage.local.get(['mark_streamer_name'], function (result) {
        mark_streamer_name = result['mark_streamer_name']
        if (mark_streamer_name.includes(displayName)) {
            // 이미 추가된 항목이라면 체크 표시
            BtnInner.src = chrome.runtime.getURL("/images/check.png")
        } else {
            //아직 추가되지 않은 항목이라면 추가 표시
            BtnInner.src = chrome.runtime.getURL("/images/plus-sign2.png")
        }
    })

    // 버튼 스타일링
    BtnInner.style.transition = "all 0.5s"
    BtnInner.style.borderRadius = "18px"

    const BtnMark = document.createElement('button');
    BtnMark.classList.add("btn-mark");
    BtnMark.style.position = "relative";
    BtnMark.style.left = "95%";
    BtnMark.style.bottom = "7px";
    BtnMark.style.background = "none";
    BtnMark.style.border = "none"
    BtnMark.style.zIndex = 9999;

    BtnInner.addEventListener('mouseover', twitchBrowseOnMouseOverHandler, false);
    BtnInner.addEventListener('mouseout', twitchBrowseOnMouseOutHandler, false);
    BtnMark.addEventListener('click', twitchWatchOnClickMarkHandler, false);

    BtnMark.appendChild(BtnInner)
    pNode.querySelector("div.Layout-sc-1xcs6mc-0").appendChild(BtnMark)
}


/* 버튼 이벤트 핸들러 */

//클릭 이벤트
function twitchBrowseOnClickMarkHandler(e) {
    container = e.target.parentNode.parentNode
    thumbnail = container.querySelector(".tw-avatar > img").src
    console.log(container.querySelectorAll('[data-a-target="preview-card-channel-link"]'))
    twLink = container.querySelectorAll('[data-a-target="preview-card-channel-link"]')[1].closest('a').href
    display_name = container.querySelectorAll('[data-a-target="preview-card-channel-link"]')[1].textContent
    broadcaster_login = twLink.split('/').pop()

    console.log(broadcaster_login, display_name)

    if (display_name && thumbnail) {
        chrome.storage.local.get(['mark_streamer_name'], function (result) {
            mark_streamer_name = result['mark_streamer_name']
            if (mark_streamer_name.includes(display_name)) {
                // 이미 추가된 항목이라면
                del = mark_streamer_name.indexOf(display_name)
                deleteStreamerid(del)
                deleteStreamerItems(del)
                deleteStreamerSetting(del)
                deleteStreamerName(del)

            } else {
                // 아직 추가되지 않은 항목이라면
                addStreamerMarked(broadcaster_login, display_name)
                addStreamerSetting("0000")
            }
            twitchRefresh()
        })
    }
}

function twitchWatchOnClickMarkHandler(e) {
    container = e.target.parentNode.parentNode
    element = container.querySelector("h1.tw-title")
    display_name = element.textContent
    broadcaster_login = element.parentNode.href.split('/')[3]
    title = display_name + ' (' + broadcaster_login + ')'
    if (display_name && broadcaster_login) {
        chrome.storage.local.get(['mark_streamer_name'], function (result) {
            mark_streamer_name = result['mark_streamer_name']
            if (mark_streamer_name.includes(title)) {
                // 이미 추가된 콘텐트라면
                del = mark_streamer_name.indexOf(title)
                deleteStreamerid(del)
                deleteStreamerItems(del)
                deleteStreamerSetting(del)
                deleteStreamerName(del)
            } else {
                // 아직 추가되지 않은 콘텐트라면
                addStreamerMarked(title)
                addStreamerSetting("0000")
            }
            twitchRefresh()
        })
    }
}


// 마우스 오버 이벤트
function twitchBrowseOnMouseOverHandler(e) {
    e.target.style.boxShadow = "0 0 0 4px #a7a7a7 inset"
}

// 마우스 아웃 이벤트
function twitchBrowseOnMouseOutHandler(e) {
    e.target.style.boxShadow = "none"
}



/* 컨테이너 DOM Recognition */
function twichRecognizeContainers() {
    let card_containers = document.getElementsByClassName('shelf-card__impression-wrapper');
    // 각 container 별로 '+' 버튼 추가 및 배열에 저장
    for (c of card_containers) {
        p = c.querySelector("div.ScTextMargin-sc-10mto54-2 > a > p")
        //console.log(p,c)
        if (p && !twitchContainersList.includes(c)) {
            //리스트에 추가되지 않은 card-container 내에 있는 content 인식
            //버튼 생성 및 추가
            streamerid = p.textContent
            twitchBrowseCreateBtnMarkElement(c, streamerid);
            twitchContainersList.push(c)
        }
    }
}

function twitchRefresh() {
    chrome.storage.local.get(['mark_streamer_name'], function (result) {
        console.log("twitch refresh")
        mark_streamer_name = result['mark_streamer_name']
        for (c of twitchContainersList) {
            title = c.querySelectorAll('[data-a-target="preview-card-channel-link"]')[1].textContent

            if (c.querySelector("h1.tw-title")) {
                element = c.querySelector("h1.tw-title")
                display_name = element.textContent
                broadcaster_login = element.parentNode.href.split('/')[3]
                title = display_name + ' (' + broadcaster_login + ')'
            }

            if (mark_streamer_name.includes(title)) {
                console.log(title)
                btnImg = c.querySelector('button.btn-mark > img')
                btnImg.src = chrome.runtime.getURL('images/check.png')
            } else {
                btnImg = c.querySelector('button.btn-mark > img')
                btnImg.src = chrome.runtime.getURL('images/plus-sign2.png')
            }
        }
    })
}

// mutationObserver 이벤트 핸들러
function onBrowseMutationHandler(mutationList, observer) {
    console.log('mutation observed')
    twichRecognizeContainers();
}

/***********************************************************************************************************************/
/* Config */
chrome.runtime.onMessage.addListener(msg => {
    if (msg === "refresh") {
        twitchRefresh()
    }
});

url = new URL(window.location.href)
if (url.pathname.length > 1) {
    container = document.body.querySelector('div.channel-info-content')
    if (!twitchContainersList.includes(container)) {
        twitchContainersList.push(container)
    }
    setTimeout(() => {
        if (!document.body.querySelector('.btn-mark')) {
            element = container.querySelector("img.tw-image.tw-image-avatar")
            broadcaster_login = url.pathname.slice(1,)
            displayName = element.alt
            twitchWatchCreateBtnMarkElement(container, displayName + ' (' + broadcaster_login + ')')
        }
    }, 2000)

} else {

    observerConfig = {
        childList: true,
        subtree: true
    }

    appMountPoint = document.querySelector("div.root-scrollable__wrapper");
    observer = new MutationObserver(onBrowseMutationHandler);
    observer.observe(appMountPoint, observerConfig)
}