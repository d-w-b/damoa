//CONST
const serverURL = "http://ceprj.gachon.ac.kr:60002"

//var
var pos = 0
var ott_groups = []
var youvid_groups = []
var channel_groups = []
var streamer_groups = []
var refreshContainers = []

// renderHome 함수
// 로그인 화면에서 홈 화면으로 넘어가도록 처리
function renderHome(userid) {
  const loginWindow = document.querySelector('.loginwindow');
  const windowWrapper = document.querySelector('.window');

  loginWindow.style.display = 'none';
  windowWrapper.style.display = 'block';
  windowWrapper.querySelector('.main').style.display = "block";

  const memberid = document.body.querySelector('.memberid')
  memberid.textContent = userid + ' 님'

}

// renderGlimpse 함수
// Glimpse 카테고리 생성

// #title : 플랫폼별 제목
function renderGlimpse(title, index) {
  const contentsContainer = document.body.querySelector('.contents-container')
  const contentDiv = document.createElement('div');
  contentDiv.className = 'contents';

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';

  const button = document.createElement('button');
  button.className = 'btn-tab';
  button.textContent = title;
  button.addEventListener('click', btntabClickEventHandler)

  const dataContainer = document.createElement('div');
  dataContainer.className = 'contentsdata';

  buttonContainer.appendChild(button);
  contentDiv.appendChild(buttonContainer);
  contentDiv.appendChild(dataContainer);
  contentsContainer.appendChild(contentDiv);

  return dataContainer
}

// renderStreamer 함수
// Glimpse Streamer 아이템 생성

// # dataContainer : 각 item 을 담을 div
// # item : twitch API response item
function renderStreamersLive(dataContainer, item) {
  //Streamer
  const btnWrapper = document.createElement('div')
  btnWrapper.className = "itemBtnWrapper"
  const cardwrapper = document.createElement('div')
  cardwrapper.className = 'cardWrapper'
  const btnDelete = document.createElement('button')
  const btnDeleteImg = document.createElement('img')
  btnDeleteImg.src = 'icons/delete_black.png'
  btnDelete.addEventListener('click', streamerDeleteClickEventHandler)

  user_name = item.user_name
  user_login = item.user_login
  thumbnailUrl = item.thumbnail_url
  thumbnailUrl = thumbnailUrl.replace('{width}', '320')
  thumbnailUrl = thumbnailUrl.replace('{height}', '240')
  is_live = item.type

  if (is_live === "live") {
    const itemDiv = document.createElement('a');
    itemDiv.className = 'card'
    itemDiv.dataset.type = 'mark_streamer'
    itemDiv.dataset.id = item.id
    itemDiv.href = "https://www.twitch.tv/" + user_login
    itemDiv.innerHTML = `
      <img class='thumbnail' src=${thumbnailUrl} alt=${user_name}>
      <h3> ${user_name} </h3>
      `;

    itemDiv.addEventListener('click', function (e) {
      chrome.tabs.create({ url: e.target.parentNode.href });
      return false
    })

    btnDelete.appendChild(btnDeleteImg)
    btnWrapper.appendChild(btnDelete)
    cardwrapper.appendChild(btnWrapper)
    cardwrapper.appendChild(itemDiv)
    dataContainer.appendChild(cardwrapper);
  }
}


// moveContainer 함수 각 탭으로 이동 클릭시 화면 전환
// #direction 방향
function moveContainer(direction) {
  const moveDistance = 800 * direction;
  const container = document.querySelector(".container");
  pos += moveDistance
  container.style.right = `${pos}px`
}

function renderTab(index) {
  const screens = Array.from(document.body.querySelector('.container').children)
  for (i in screens) {
    if (i == index) { screens[i].style.display = "block" }
    else { screens[i].style.display = "none" }
  }
}

// init 함수
// 로그인한 후에 유저 데이터를 받아서 화면을 생성합니다.

// #res : 유저별 관심콘텐트 데이터 요청에 대한 응답 JSON.
function init(res) {

  // mypage EventListeners
  const btnLogout = document.querySelector('button.logout')
  btnLogout.addEventListener('click', logoutClickEventHandler)
  document.getElementById('myPageBtn').addEventListener('click', btnmypageClickEventHandler)

  // mark_ott
  const ottGlimpseContainer = renderGlimpse(`찜한 OTT`)

  if (res.result.marked_ott.ottID && res.result.marked_ott.ottID.length) {
    // mark_ott item 이 있을 경우
    mark_ott = res.result.marked_ott.ottID.split("|")
    mark_ott_setting = res.result.marked_ott.groupSet.split("|")
    mark_ott_title = res.result.marked_ott.title.split("|")
    mark_ott_img = res.result.marked_ott.img.split("|")
    mark_ott_url = res.result.marked_ott.url.split("|")
    mark_ott_genre = res.result.marked_ott.genre.split('|')
    mark_ott_type = res.result.marked_ott.type.split("|")

    //renderUserStat(mark_ott_genre)
    for (let i = 0; i < mark_ott.length; i++) {

      const btnWrapper = document.createElement('div')
      btnWrapper.className = "itemBtnWrapper"
      const cardwrapper = document.createElement('div')
      cardwrapper.className = 'cardWrapper'
      const btnDelete = document.createElement('button')
      const btnDeleteImg = document.createElement('img')
      btnDeleteImg.src = 'icons/delete_black.png'
      btnDelete.addEventListener('click', ottDeleteClickEventHandler)

      const btnRecommenditem = document.createElement('button')
      btnRecommenditem.addEventListener('click', ottRecommenditemClickEventHandler)
      btnRecommenditem.className = 'btn-recommend'
      const btnRecommenditemInner = document.createElement('p')
      btnRecommenditemInner.className = 'btnRecommenditemInner'
      btnRecommenditemInner.textContent = "AI 추천"

      const itemDiv = document.createElement('a');
      itemDiv.className = 'card'
      let id = mark_ott[i]
      let url = mark_ott_url[i]

      itemDiv.dataset.id = id
      itemDiv.dataset.type = 'mark_ott'
      itemDiv.dataset.genre = mark_ott_genre[i]
      itemDiv.dataset.platform = mark_ott_type[i]
      itemDiv.href = url
      itemDiv.innerHTML = `
          <img class='thumbnail' src=${mark_ott_img[i]} alt=${mark_ott_title[i]}>
          <h3>${mark_ott_title[i]}</h3>
          `;

      itemDiv.addEventListener('click', function (e) {
        chrome.tabs.create({ url: e.target.parentNode.href });
        return false
      })

      btnDelete.appendChild(btnDeleteImg)
      btnWrapper.appendChild(btnDelete)
      btnRecommenditem.appendChild(btnRecommenditemInner)
      cardwrapper.appendChild(btnRecommenditem)
      cardwrapper.appendChild(btnWrapper)
      cardwrapper.appendChild(itemDiv)
      ottGlimpseContainer.appendChild(cardwrapper);

    }

    renderOTTTab()

    const button = document.createElement('button');
    button.className = 'btn-tab-plus';
    button.textContent = '전체 보기 >>';
    button.addEventListener('click', btntabClickEventHandler)

    ottGlimpseContainer.closest('.contents').appendChild(button)

    // 스크롤 버튼 추가
    createcontentsscrollbtn(ottGlimpseContainer.closest('.contents'))
    createPlatformIcons(ottGlimpseContainer.closest('.contents'))

    chrome.storage.local.set({
      mark_ott: mark_ott,
      mark_ott_setting: mark_ott_setting,
      mark_ott_title: mark_ott_title,
      mark_ott_img: mark_ott_img,
      mark_ott_url: mark_ott_url,
      mark_ott_genre: mark_ott_genre,
      mark_ott_type: mark_ott_type
    })
  } else {

    const greetings = document.createElement('h4')
    greetings.textContent = "콘텐트를 추가해주세요."
    ottGlimpseContainer.parentNode.getElementsByClassName('button-container')[0].appendChild(greetings)

    chrome.storage.local.set({
      mark_ott: [],
      mark_ott_setting: [],
      mark_ott_title: [],
      mark_ott_img: [],
      mark_ott_url: [],
      mark_ott_genre: [],
      mark_ott_type: []
    })
  }


  //mark_channel
  const channelGlimpseContainer = renderGlimpse(`최근 업로드된 영상`)
  const channelContentsDiv = channelGlimpseContainer.closest('.contents')
  const channelBtnContainerDiv = channelContentsDiv.querySelector('.button-container');
  const channeliconsDiv = document.createElement('div')
  channelBtnContainerDiv.appendChild(channeliconsDiv)
  channeliconsDiv.className = 'channelicons'

  var channelResponseCount = 0
  if (res.result.marked_channel.channelID && res.result.marked_channel.channelID.length) {

    // mark_channel
    mark_channel = res.result.marked_channel.channelID.split("|")
    channelMax = mark_channel.length
    mark_channel_setting = res.result.marked_channel.groupSet.split("|")
    mark_channel_img = res.result.marked_channel.img.split("|")
    mark_channel_name = res.result.marked_channel.title.split("|")
    mark_channel_items = res.result.marked_channel.items
    console.log(mark_channel_items)

    for (i in mark_channel) {

      channelResponseCount += 1;
      const channelbtn = document.createElement('a')
      const channelimg = document.createElement('img')
      channelimg.className = 'channelimg'

      const channelId = mark_channel[i]

      channelimg.src = mark_channel_img[i]
      channelbtn.href = 'https://www.youtube.com/channel/' + channelId
      channelbtn.dataset.id = channelId

      channelbtn.addEventListener('click', function (e) {
        chrome.tabs.create({ url: e.target.parentNode.href });
        return false
      })

      channelbtn.appendChild(channelimg)
      channeliconsDiv.appendChild(channelbtn)


      const btnWrapper = document.createElement('div')
      btnWrapper.className = "itemBtnWrapper"
      const cardwrapper = document.createElement('div')
      cardwrapper.className = 'cardWrapper'
      const btnDelete = document.createElement('button')
      const btnDeleteImg = document.createElement('img')
      btnDeleteImg.src = 'icons/delete_black.png'
      btnDelete.addEventListener('click', channelDeleteClickEventHandler)

      const itemDiv = document.createElement('a');
      itemDiv.className = 'card'
      latestVideo = mark_channel_items[i][0]  // 해당 채널의 가장 최근 영상
      //id = mark_channel[i]
      title = latestVideo.snippet.title
      itemDiv.dataset.type = 'mark_channel'
      itemDiv.dataset.id = channelId
      itemDiv.href = "https://www.youtube.com/watch?v=" + latestVideo.id.videoId
      itemDiv.innerHTML = `
            <img class='thumbnail' src=${latestVideo.snippet.thumbnails.high.url} alt=${title}>
            <h3>${title}</h3>
            `;
      itemDiv.addEventListener('click', function (e) {
        chrome.tabs.create({ url: e.target.parentNode.href });
        return false
      })

      btnDelete.appendChild(btnDeleteImg)
      btnWrapper.appendChild(btnDelete)
      cardwrapper.appendChild(btnWrapper)
      cardwrapper.appendChild(itemDiv)
      channelGlimpseContainer.appendChild(cardwrapper);



      if (channelResponseCount === mark_channel.length) {
        const button = document.createElement('button');
        button.className = 'btn-tab-plus';
        button.textContent = '전체 보기 >>';
        button.addEventListener('click', btntabClickEventHandler)

        channelGlimpseContainer.closest('.contents').appendChild(button)
        // 스크롤 버튼 추가
        createcontentsscrollbtn(channelGlimpseContainer.closest('.contents'))
      }
      // } else {
      // 유튜브 채널 데이터 요청 오류
      //console.log("ERR :: FETCH YOUTUBE CHANNEL")
      // chrome.storage.local.set({
      //     mark_channel: [],
      //     mark_channel_setting: [],
      //     mark_channel_img: [],
      //     mark_channel_name: [],
      //     mark_channel_items: [],
      // })
    }

    //})
    //}


    chrome.storage.local.set({
      mark_channel: mark_channel,
      mark_channel_setting: mark_channel_setting,
      mark_channel_img: mark_channel_img,
      mark_channel_name: mark_channel_name,
      mark_channel_items: mark_channel_items
    }, function () {
      renderChannelTab()
    })

  } else {
    const greetings = document.createElement('h4')
    greetings.textContent = "콘텐트를 추가해주세요."
    channelGlimpseContainer.parentNode.getElementsByClassName('button-container')[0].appendChild(greetings)

    isChannelLoaded = true
    document.body.dispatchEvent(new Event('channelloaded'))
    chrome.storage.local.set({
      mark_channel: [],
      mark_channel_setting: [],
      mark_channel_img: [],
      mark_channel_name: [],
      mark_channel_items: []
    })
  }


  const youvidGlimpseContainer = renderGlimpse(`최근 추가된 유튜브 영상`)
  var youvidResponseCount = 0
  if (res.result.marked_youvid.vID && res.result.marked_youvid.vID.length) {
    // mark_youvid
    mark_youvid = res.result.marked_youvid.vID.split("|")
    youvidMax = mark_youvid.length
    mark_youvid_setting = res.result.marked_youvid.groupSet.split("|")
    mark_youvid_items = res.result.marked_youvid.snippet
    console.log(mark_youvid_items)
    chrome.storage.local.set({
      mark_youvid: mark_youvid,
      mark_youvid_setting: mark_youvid_setting,
      mark_youvid_items: mark_youvid_items
    })

    for (i in mark_youvid) {

      youvidResponseCount += 1


      // 최근 추가된 유튜브 영상 항목 생성
      const vidInfo = mark_youvid_items[i]
      const btnWrapper = document.createElement('div')
      btnWrapper.className = "itemBtnWrapper"
      const cardwrapper = document.createElement('div')
      cardwrapper.className = 'cardWrapper'
      const btnDelete = document.createElement('button')
      const btnDeleteImg = document.createElement('img')
      btnDeleteImg.src = 'icons/delete_black.png'
      btnDelete.addEventListener('click', youvidDeleteClickEventHandler)

      // 각 항목 카드 컨테이너 생성
      const itemDiv = document.createElement('a');
      itemDiv.className = 'card'
      itemDiv.dataset.type = 'mark_youvid'
      const id = mark_youvid[i]
      title = vidInfo.title
      itemDiv.dataset.id = id
      itemDiv.href = "https://www.youtube.com/watch?v=" + id
      itemDiv.innerHTML = `
      <img class='thumbnail' src=${vidInfo.thumbnails.high.url} alt=${title}>
      <h3> ${title} </h3>
      `;

      itemDiv.addEventListener('click', function (e) {
        chrome.tabs.create({ url: e.target.parentNode.href });
        return false
      })

      btnDelete.appendChild(btnDeleteImg)
      btnWrapper.appendChild(btnDelete)
      cardwrapper.appendChild(btnWrapper)
      cardwrapper.appendChild(itemDiv)
      youvidGlimpseContainer.appendChild(cardwrapper);




      if (youvidResponseCount === mark_youvid.length) {
        const button = document.createElement('button');
        button.className = 'btn-tab-plus';
        button.textContent = '전체 보기 >>';
        button.addEventListener('click', btntabClickEventHandler)

        youvidGlimpseContainer.closest('.contents').appendChild(button)
        // 스크롤 버튼 추가
        createcontentsscrollbtn(youvidGlimpseContainer.closest('.contents'))
      }


    }


  } else {
    const greetings = document.createElement('h4')
    greetings.textContent = "콘텐트를 추가해주세요."
    youvidGlimpseContainer.parentNode.getElementsByClassName('button-container')[0].appendChild(greetings)

    isYouvidLoaded = true
    document.body.dispatchEvent(new Event('youvidloaded'))
    chrome.storage.local.set({
      mark_youvid: [],
      mark_youvid_setting: [],
      mark_youvid_items: []
    })
  }

  renderYouvidTab()

  // MARKED STREAMER
  const streamerGlimpseContainer = renderGlimpse(`현재 방송중인 스트리머`)
  var twitchResponseCount = 0
  if (res.result.marked_streamer.streamerID && res.result.marked_streamer.streamerID.length) {
    // mark_streamer
    mark_streamer = res.result.marked_streamer.streamerID.split("|")
    mark_streamer_name = res.result.marked_streamer.title.split("|")
    mark_streamer_setting = res.result.marked_streamer.groupSet.split("|")
    chrome.storage.local.set({ mark_streamer_items: [] }, function () {
      for (streamerID of mark_streamer) {
        fetch("https://api.twitch.tv/helix/streams?user_id=" + streamerID, {
          headers: {
            "client-id": "avpot9bsjk3bf4s087ajyyey1qfpw0",
            "Authorization": "Bearer lhs2ryedpf2bvhmmdd8s2077g34o39"
          },
          method: 'GET',
        }).then(res => {
          return res.json()
        }).then(res => {
          console.log(res)
          twitchResponseCount += 1
          if (res.data.length > 0) {
            renderStreamersLive(streamerGlimpseContainer, res.data[0])
            renderStreamers(res.data[0])
            // chrome.storage.local.get(['mark_streamer_items'], function (result) {
            //   result["mark_streamer_items"].push(res.data[0])
            //   chrome.storage.local.set({ mark_streamer_items: result["mark_streamer_items"] }, function () {
            //   })
            // })
          } else {
            fetch("https://api.twitch.tv/helix/channels?broadcaster_id=" + streamerID, {
              headers: {
                "client-id": "avpot9bsjk3bf4s087ajyyey1qfpw0",
                "Authorization": "Bearer lhs2ryedpf2bvhmmdd8s2077g34o39"
              },
              method: 'GET',
            }).then(res => {
              return res.json()
            }).then(res => {
              console.log(res)
              //renderStreamersOff(res)
            })
            //renderStreamersItem({is_live : "off"})
            // chrome.storage.local.get(['mark_streamer_items'], function (result) {
            //   result["mark_streamer_items"].push('off')
            //   chrome.storage.local.set({ mark_streamer_items: result["mark_streamer_items"] }, function () {
            //   })
            // })
          }

          if (twitchResponseCount === mark_streamer.length) {
            const button = document.createElement('button');
            button.className = 'btn-tab-plus';
            button.textContent = '전체 보기 >>';
            button.addEventListener('click', btntabClickEventHandler)

            streamerGlimpseContainer.closest('.contents').appendChild(button)
            // 스크롤 버튼 추가
            createcontentsscrollbtn(streamerGlimpseContainer.closest('.contents'))
          }
        })
      }

    })

    chrome.storage.local.set({
      mark_streamer: mark_streamer,
      mark_streamer_setting: mark_streamer_setting,
      mark_streamer_name: mark_streamer_name,
    })
  } else {
    const greetings = document.createElement('h4')
    greetings.textContent = "콘텐트를 추가해주세요."
    streamerGlimpseContainer.parentNode.getElementsByClassName('button-container')[0].appendChild(greetings)

    chrome.storage.local.set({
      mark_streamer: [],
      mark_streamer_setting: [],
      mark_streamer_name: [],
      mark_streamer_items: []
    })
  }

  refreshHome()
}

function createPlatformIcons(OTTcontentsDiv) {
  // 이벤트 리스너 추가해야합니다.
  const iconsWrapper = document.createElement('div')
  iconsWrapper.className = 'icons-wrapper'
  const btnContainer = OTTcontentsDiv.querySelector('.button-container')
  btnContainer.appendChild(iconsWrapper)

  btnNetflix = createBtn(iconsWrapper, 'btn-ott', 'icons/netflix.png', 'Netflix', btnPlatformClickEventHandler)
  btnDisney = createBtn(iconsWrapper, 'btn-ott', 'icons/disney.png', 'Disney Plus', btnPlatformClickEventHandler)
  btnWavve = createBtn(iconsWrapper, 'btn-ott', 'icons/watcha.png', 'watcha', btnPlatformClickEventHandler)
  btnWatcha = createBtn(iconsWrapper, 'btn-ott', 'icons/wavve.png', 'Wavve', btnPlatformClickEventHandler)
  btnYoutube = createBtn(iconsWrapper, 'btn-ott', 'icons/youtube.png', 'Youtube', btnPlatformClickEventHandler)
  btnTwitch = createBtn(iconsWrapper, 'btn-ott', 'icons/twitch.png', 'Twitch', btnPlatformClickEventHandler)
}

function btnPlatformClickEventHandler(e) {
  chrome.storage.local.get(['user_setting'], function (result) {
    setting = result['user_setting'][5].setting.split(',')
    console.log(setting.join(','))
    p = e.target.alt

    switch (p) {
      case "Netflix":
        if (setting[0] === "true") {
          e.target.style.opacity = 0.4
          setting[0] = "false"
          result['user_setting'][5].setting = setting.join(',')
          chrome.storage.local.set({ user_setting: result['user_setting'] })
        }
        else {
          e.target.style.opacity = 1
          setting[0] = "true"
          result['user_setting'][5].setting = setting.join(',')
          chrome.storage.local.set({ user_setting: result['user_setting'] })
        }
        break

      case "Disney Plus":
        if (setting[1] === "true") {
          e.target.style.opacity = 0.4
          setting[1] = "false"
          result['user_setting'][5].setting = setting.join(',')
          chrome.storage.local.set({ user_setting: result['user_setting'] })
        }
        else {
          e.target.style.opacity = 1
          setting[1] = "true"
          result['user_setting'][5].setting = setting.join(',')
          chrome.storage.local.set({ user_setting: result['user_setting'] })
        }
        break

      case "watcha":
        if (setting[2] === "true") {
          e.target.style.opacity = 0.4
          setting[2] = "false"
          result['user_setting'][5].setting = setting.join(',')
          chrome.storage.local.set({ user_setting: result['user_setting'] })
        }
        else {
          e.target.style.opacity = 1
          setting[2] = "true"
          result['user_setting'][5].setting = setting.join(',')
          chrome.storage.local.set({ user_setting: result['user_setting'] })
        }
        break

      case "Wavve":
        if (setting[3] === "true") {
          e.target.style.opacity = 0.4
          setting[3] = "false"
          result['user_setting'][5].setting = setting.join(',')
          chrome.storage.local.set({ user_setting: result['user_setting'] })
        }
        else {
          e.target.style.opacity = 1
          setting[3] = "true"

          result['user_setting'][5].setting = setting.join(',')

          chrome.storage.local.set({ user_setting: result['user_setting'] })
        }
        break

      case "Youtube":
        if (setting[4] === "true") {
          e.target.style.opacity = 0.4


          setting[4] = "false"
          result['user_setting'][5].setting = setting.join(',')
          chrome.storage.local.set({ user_setting: result['user_setting'] })

        }
        else {

          e.target.style.opacity = 1


          setting[4] = "true"
          result['user_setting'][5].setting = setting.join(',')
          chrome.storage.local.set({ user_setting: result['user_setting'] })
        }
        break

      case "Twitch":
        if (setting[5] === "true") {
          e.target.style.opacity = 0.4


          setting[5] = "false"
          result['user_setting'][5].setting = setting.join(',')
          chrome.storage.local.set({ user_setting: result['user_setting'] })
        }
        else {
          e.target.style.opacity = 1


          setting[5] = "true"
          result['user_setting'][5].setting = setting.join(',')
          chrome.storage.local.set({ user_setting: result['user_setting'] })
        }
        break
    }
    refreshOTTCards()
    refreshHome()
  })
}


function createBtn(wrapper, className, imgSrc, alt, listener) {
  chrome.storage.local.get(['user_setting'], function (result) {
    let setting = result['user_setting'][5].setting.split(',')

    const PLATFORMS = ['Netflix', 'Disney Plus', 'watcha', 'Wavve', 'Youtube', 'Twitch']
    const newBtn = document.createElement('button')
    const btnImage = document.createElement('img')
    btnImage.src = imgSrc
    btnImage.alt = alt
    let idx = PLATFORMS.indexOf(alt)

    if (setting[idx] === "true") {
      btnImage.style.opacity = "1"
    } else {
      btnImage.style.opacity = "0.4"
    }

    newBtn.appendChild(btnImage)
    newBtn.className = className
    newBtn.addEventListener('click', listener)

    wrapper.appendChild(newBtn)
  })
}

function refreshHome() {
  chrome.storage.local.get(['user_setting'], function (result) {

    let setting = result['user_setting'][5].setting.split(',')

    if (setting[4] === 'false') {
      document.body.querySelectorAll('.main')[0].querySelectorAll('.contents')[1].style.display = "none"
      document.body.querySelectorAll('.main')[0].querySelectorAll('.contents')[2].style.display = "none"
    } else {
      document.body.querySelectorAll('.main')[0].querySelectorAll('.contents')[1].style.display = "block"
      document.body.querySelectorAll('.main')[0].querySelectorAll('.contents')[2].style.display = "block"
    }

    if (setting[5] === 'false') {
      document.body.querySelectorAll('.main')[0].querySelectorAll('.contents')[3].style.display = "none"
    } else {
      document.body.querySelectorAll('.main')[0].querySelectorAll('.contents')[3].style.display = "block"
    }

  })
}


/************************************************ 홈화면, 메인페이지 이벤트 핸들러 *******************************************/

// 각 탭 이동 버튼 클릭 이벤트 핸들러

// 마이페이지 아이콘 클릭 이벤트
function btnmypageClickEventHandler(e) {
  window.scrollTo(0, 0)
  renderTab(1)
}

// 각 탭으로 이동 버튼 클릭 이벤트
function btntabClickEventHandler(e) {
  m = e.target.closest(".contents")
  index = Array.from(m.parentNode.children).indexOf(m)
  console.log(e.target, index)
  window.scrollTo(0, 0)
  renderTab(index + 2); // 해당 탭으로 이동
  console.log('이전 클릭');
}

// 홈 화면으로 이동 클릭 이벤트 핸들러
const prevBtns = document.querySelectorAll(".prev");
prevBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    window.scrollTo(0, 0)
    renderTab(0)
    console.log('이전 클릭');
  });
});


//항목 삭제 버튼 클릭 이벤트 핸들러
function ottDeleteClickEventHandler(e) {
  c = e.target.closest('.cardWrapper')
  a = c.querySelector('a.card')

  chrome.storage.local.get(['mark_ott'], function (result) {
    mark_ott = result['mark_ott']
    idx = mark_ott.indexOf(a.dataset.id)
    deleteOTTType(idx)
    deleteOTTImg(idx)
    deleteOTTTitle(idx)
    deleteOTTUrl(idx)
    deleteOTTSetting(idx)
    deleteOTTMarked(idx)
  })

  const cards = Array.from(document.querySelectorAll('a.card')).filter(item => true)
  // 동일한 id 의 카드 모두 삭제
  for (let card of cards) {
    if (card.dataset.type === a.dataset.type && card.dataset.id === a.dataset.id) {
      card.closest('.cardWrapper').remove()
    }
  }
  c.remove()
}


/*** 로그아웃 클릭 이벤트 ***/
function logoutClickEventHandler(e) {
  chrome.storage.local.get(['id'], function (result) {
    id = result["id"]
    fetch(serverURL + "/logout/" + id, {
      method: 'DELETE',
    }).then(res => {
      return res.json()
    }).then(res => {
      console.log(res)
      console.log('로그아웃')
      chrome.storage.local.set({
        id: '',
        mark_channel: [],
        mark_channel_setting: [],
        mark_channel_img: [],
        mark_channel_name: [],
        mark_channel_items: [],
        mark_ott: [],
        mark_ott_setting: [],
        mark_ott_title: [],
        mark_ott_img: [],
        mark_ott_url: [],
        mark_ott_genre: [],
        mark_ott_type: [],
        mark_streamer: [],
        mark_streamer_setting: [],
        mark_streamer_name: [],
        mark_youvid: [],
        mark_youvid_setting: [],
        mark_youvid_items: []
      }, function () {
        window.close()
      })
    })
  })
}

/*** 채널 항목 삭제 이벤트 핸들러 ***/
function channelDeleteClickEventHandler(e) {
  c = e.target.closest('.cardWrapper')
  a = c.querySelector('a.card')

  chrome.storage.local.get(['mark_channel'], function (result) {
    mark_channel = result['mark_channel']
    idx = mark_channel.indexOf(a.dataset.id)
    deleteChannelImg(idx)
    deleteChannelSetting(idx)
    deleteChannelName(idx)
    deleteChannelMarked(idx)

  })

  const channels = Array.from(document.querySelectorAll('.channelpage > .category')).filter(item => true)
  console.log(channels)


  // 채널 탭 내 해당 채널 삭제
  for (let c of channels) {
    console.log(c.dataset.type, a.dataset.type, c.dataset.id, a.dataset.id)
    if (c.dataset.type === a.dataset.type && c.dataset.id === a.dataset.id) {
      c.remove()
    }
  }

  const contents = c.closest('.contents')
  const icons = Array.from(contents.querySelectorAll('.channelicons > a')).filter(item => true);

  // 아이콘 삭제
  for (let icon of icons) {
    if (icon.dataset.id === a.dataset.id) {
      icon.remove()
    }
  }

  c.remove()
}

/*** 유튜브 영상 항목 삭제 이벤트 핸들러 ***/
function youvidDeleteClickEventHandler(e) {
  c = e.target.closest('.cardWrapper')
  a = c.querySelector('a.card')

  chrome.storage.local.get(['mark_youvid'], function (result) {
    mark_ott = result['mark_youvid']
    idx = mark_ott.indexOf(a.dataset.id)
    deleteYouvidItems(idx)
    deleteYouvidSetting(idx)
    deleteYouvidMarked(idx)

  })
  const cards = Array.from(document.querySelectorAll('a.card')).filter(item => true)

  for (let card of cards) {
    if (card.dataset.type === a.dataset.type && card.dataset.id === a.dataset.id) {
      card.closest('.cardWrapper').remove()
    }
  }
  c.remove()
}

/*** 스트리머 항목 삭제 이벤트 핸들러 ***/
function streamerDeleteClickEventHandler(e) {
  c = e.target.closest('.cardWrapper')
  a = c.querySelector('a.card')

  chrome.storage.local.get(['mark_streamer'], function (result) {
    mark_streamer = result['mark_streamer']
    idx = mark_streamer.indexOf(a.dataset.id)

    deleteStreamerItems(idx)
    deleteStreamerName(idx)
    deleteStreamerid(idx)
    deleteStreamerSetting(idx)

  })

  const cards = Array.from(document.querySelectorAll('div.card')).filter(item => true)
  console.log(cards)

  for (let card of cards) {
    if (card.dataset.type === a.dataset.type && card.dataset.id === a.dataset.id) {
      card.closest('.category').remove()
    }
  }
  c.remove()
}

// 유저 관심 콘텐트 데이터 요청 함수
function getUserDataFromServer(userid) {
  console.log(userid)
  fetch(serverURL + "/mark/" + userid, {
    method: 'GET',
  }).then(res => {
    return res.json()
  }).then(res => {
    console.log(res)

    // init 홈 화면
    init(res)

    // 검색창
    var isBoxVisible = false;
    document.getElementById("searchBtn").addEventListener("click", function (event) {
      if (!isBoxVisible) {
        var box = document.createElement("div");
        box.className = "custom-box";
        document.body.appendChild(box);

        var searchInput = document.createElement("input");
        searchInput.placeholder = "검색어를 입력하세요";
        box.appendChild(searchInput);

        var buttonWrapper = document.createElement("div");
        buttonWrapper.className = "button-wrapper";
        box.appendChild(buttonWrapper);

        var searchButton = document.createElement("button");

        buttonWrapper.appendChild(searchButton);

        var deleteButton = document.createElement("button");

        buttonWrapper.appendChild(deleteButton);

        chrome.storage.local.get(['user_setting'], function (result) {
          const thememode = result.user_setting[4].type
          if (thememode === 'light-mode') {
            searchButton.innerHTML = '<img src="icons/search_black.png" alt="Search Icon">';
            deleteButton.innerHTML = '<img src="icons/delete_black.png" alt="Delete Icon">';
          } else {
            box.style.background = '#2d2d2d'
            searchInput.style.background = '#555555'
            searchInput.style.color = '#ffffff'
            searchInput.style.borderBottom = '2px solid #ffffff';
            searchButton.innerHTML = '<img src="icons/search_white.png" alt="Search Icon">';
            deleteButton.innerHTML = '<img src="icons/delete_white.png" alt="Delete Icon">';
          }
        })

        isBoxVisible = true;

        deleteButton.addEventListener("click", function () {
          box.remove();
          isBoxVisible = false;
        });

        searchButton.addEventListener("click", function (e) {
          for (c of box.getElementsByClassName('searchcontents')) {
            c.remove()
          }
          var searchInputValue = searchInput.value;
          const searchcontents = document.createElement('div');
          searchcontents.className = 'searchcontents'

          fetch(serverURL + "/search/" + searchInputValue, {
            method: 'GET',
          }).then(res => {
            return res.json()
          }).then(res => {
            console.log(res)
            results = res.possible_match

            for (let i = 0; i < results.length; i++) {
              offers = results[i].Offers

              if (i % 3 === 0) {
                var row = document.createElement('div');
                row.className = 'searchrow';
                searchcontents.appendChild(row);
              }

              const searchcontentWrapper = document.createElement('div');
              searchcontentWrapper.className = 'searchcolumn'; // 각 칼럼에 스타일을 적용하기 위한 클래스
              const offersList = document.createElement('li')
              searchcontentWrapper.appendChild(offersList)

              if(offers.includes('Netflix')){
                const offerLink = document.createElement('a')
                offerLink.className = 'offerlink'
                //offerLink.href = results[i].netflixURL
                offerLink.addEventListener('click', function(e){
                  chrome.tabs.create({ url: e.target.closest('a').href });
                  return false
                })
                const offerImg = document.createElement('img')
                offerImg.src = 'icons/netflix.png'
                offerLink.appendChild(offerImg)
                offersList.appendChild(offerLink)
              }

              if(offers.includes('Disney Plus')){
                const offerLink = document.createElement('a')
                offerLink.className = 'offerlink'
                offerLink.href = results[i].disneyURL
                offerLink.addEventListener('click', function(e){
                  chrome.tabs.create({ url: e.target.closest('a').href });
                  return false
                })
                const offerImg = document.createElement('img')
                offerImg.src = 'icons/disney.png'
                offerLink.appendChild(offerImg)
                offersList.appendChild(offerLink)
              }

              if(offers.includes('wavve')){
                const offerLink = document.createElement('a')
                offerLink.className = 'offerlink'
                offerLink.href = results[i].wavveURL
                offerLink.addEventListener('click', function(e){
                  chrome.tabs.create({ url: e.target.closest('a').href });
                  return false
                })
                const offerImg = document.createElement('img')
                offerImg.src = 'icons/wavve.png'
                offerLink.appendChild(offerImg)
                offersList.appendChild(offerLink)
              }

              const searchcontent = document.createElement('a');
              searchcontent.className = 'searchcontent';
              searchcontent.href = results[i].jwURL
              searchcontent.addEventListener('click', function (e) {
                chrome.tabs.create({ url: e.target.closest('a').href });
                return false
              })
              const searchcontentImg = document.createElement('img');
              searchcontentImg.src = results[i].jwimg;
              searchcontentImg.alt = results[i].title;
              const searchcontentTitle = document.createElement('h3');
              searchcontentTitle.textContent = results[i].title;

              searchcontent.appendChild(searchcontentImg);
              searchcontent.appendChild(searchcontentTitle);

              searchcontentWrapper.appendChild(searchcontent);
              row.appendChild(searchcontentWrapper);
            }
          })

          box.appendChild(searchcontents);

        });

      } else {
        var box = document.querySelector(".custom-box");
        if (box) {
          box.remove();
        }
        isBoxVisible = false;
      }
    });
  })
}

/*********************************************************************************/
// 인덱스를 문자열로 변환하는 함수
function itemIndexToString(index) {
  if (index < 0) {
    return "00"
  } else if (index < 10) {
    return "0" + String(index)
  } else {
    return String(index % 100)
  }
}

function categoryIndexToString(index) {
  if (index <= 0) {
    return "00"
  } else if (index < 10) {
    return "0" + String(index)
  } else {
    return String(index % 100)
  }
}
/********************************************************************************* */
// 각 카드의 세팅 재설정
function refreshOTTSetting() {
  chrome.storage.local.get(['mark_ott', 'mark_ott_setting'], function (result) {
    mark_ott_setting = result['mark_ott_setting']
    mark_ott = result['mark_ott']
    let o = document.body.getElementsByClassName('ottpage')[0]
    cards = o.getElementsByClassName('card')

    for (a of cards) {
      c = a.closest('.itemContainer')
      idx = result['mark_ott'].indexOf(a.dataset.id)
      categoryIdx = (Array.prototype.slice.call(o.children)).indexOf(a.closest('.category'))
      categoryIdx = categoryIndexToString(categoryIdx)
      mark_ott_setting[idx] = categoryIdx + itemIndexToString((Array.prototype.slice.call(c.children)).indexOf(a.parentNode))
    }
    chrome.storage.local.set({ mark_ott_setting: mark_ott_setting })
  })
}

// 플랫폼별 카드 보이기 / 숨기기
function refreshOTTCards() {
  chrome.storage.local.get(['user_setting'], function (result) {

    let cards = document.body.getElementsByClassName('card')
    let setting = result["user_setting"][5].setting.split(',')

    var subscription = []
    if (setting[0] === "true") {
      subscription.push('Netflix')
    }
    if (setting[1] === "true") {
      subscription.push('Disney Plus')
    }
    if (setting[2] === "true") {
      subscription.push('Watcha')
    }
    if (setting[3] === "true") {
      subscription.push('wavve')
    }

    for (a of cards) {
      c = a.closest('.cardWrapper')
      if (a.dataset.type === "mark_ott") {
        if (subscription.includes(a.dataset.platform)) {
          c.style.display = "block";
        } else {
          c.style.display = "none";
        }
      }
    }
  })
}


function renderUserStat(mark_ott_genre) {
  console.log(mark_ott_genre)
  var genres = {}
  var inputs = []
  for (g of mark_ott_genre) {
    gList = g.split(',')
    for (e of gList) {
      e = e.trim()
      if (genres.hasOwnProperty(e)) {
        genres[e] += 1
      } else {
        genres[e] = 1
      }
    }
  }

  for (e of Object.entries(genres)) {
    inputs.push({ name: e[0], count: e[1] })
  }

  const w = document.body.querySelector('.user-stat')
  const chartWrapper = document.createElement('div')

  d3.select("#pie")
    .append("g")
    .attr("transform", "translate(100,100)");

  var angleGen = d3.pie()
    .sort(null)
    .value(function (d) {
      return d.count;
    }).padAngle(.03);


  //var data = angleGen(genres);

  var arcGen = d3.arc()
    .innerRadius(30)
    .outerRadius(90)

  d3.select("#pie g")
    .selectAll("path")
    .data(angleGen(inputs))
    .enter()
    .append("path")
    .attr("id", function (d, i) { return "arc_" + i; })
    .attr("d", arcGen)
    .attr("fill", "#441443")
    .attr("stroke", "gray")
    .attr("stroke-width", 1);

  //Append the month names to each slice
  d3.select("#pie g")
    .selectAll(".monthText")
    .data(inputs)
    .enter()
    .append("text")
    .attr("class", "monthText")
    .append("textPath")
    .attr("xlink:href", function (d, i) { return "#arc_" + i; })
    .text(function (d) { return d.name; });

}


function renderOTTTab() {
  // 유저 설정 불러오기
  chrome.storage.local.get(['user_setting'], function (result) {
    ott_groups = result['user_setting'][0].setting
    console.log(ott_groups)
    // ott 페이지 카테고리 생성
    for (let name of ott_groups) {
      var pageDiv = document.querySelector('.ottpage')
      var categoryDiv = document.createElement('div')
      categoryDiv.className = 'category'
      var categorysettingDiv = document.createElement('div')
      categorysettingDiv.className = 'categorysetting'

      var h2 = document.createElement('h2');
      h2.textContent = name;

      var btncategoryWrapper = document.createElement('div')
      btncategoryWrapper.className = 'btncategoryWrapper'

      if (ott_groups.indexOf(name) === 0) {
        const btncontentPlus = document.createElement('button')
        const btncontentPlusImg = document.createElement('img')
        btncontentPlusImg.className = 'btncontentPlusImg'
        btncontentPlus.addEventListener('click', ottcontentPlusClickEventHandler)

        const btnSwitch = document.createElement('button')
        const btnSwitchImg = document.createElement('img')
        btnSwitchImg.className = 'btnSwitchImg'
        btnSwitch.addEventListener('click', ottbtnSwitchClickEventHandler)

        // ott 콘텐트 장르별 분류 버튼 생성
        var btnClassify = document.createElement('button')
        var btnClassifyInner = document.createElement('img')
        btnClassifyInner.className = "autocategory"

        btnClassify.appendChild(btnClassifyInner)
        btnClassify.style.position = "relative"
        btnClassify.addEventListener('click', btnClassifyClickEventHandler)

        chrome.storage.local.get(['user_setting'], function (result) {
          const thememode = result.user_setting[4].type
          if (thememode === 'light-mode') {
            btncontentPlusImg.src = 'icons/plus_black.png'
            btnSwitchImg.src = 'icons/switch_black.png'
            btnClassifyInner.src = 'icons/auto_black.png'
          } else {
            btncontentPlusImg.src = 'icons/plus_white.png'
            btnSwitchImg.src = 'icons/switch_white.png'
            btnClassifyInner.src = 'icons/auto_white.png'
          }
        })

        btncontentPlus.appendChild(btncontentPlusImg)
        btnSwitch.appendChild(btnSwitchImg)
        btncategoryWrapper.appendChild(btncontentPlus)
        btncategoryWrapper.appendChild(btnSwitch)
        btncategoryWrapper.appendChild(btnClassify)

      } else {
        const btncontentPlus = document.createElement('button')
        const btncontentPlusImg = document.createElement('img')
        btncontentPlusImg.className = 'btncontentPlusImg'
        btncontentPlus.addEventListener('click', ottcontentPlusClickEventHandler)

        const btnSeleted = document.createElement('button')
        const btnSeletedImg = document.createElement('img')
        btnSeletedImg.className = 'btnSeletedImg'
        btnSeleted.addEventListener('click', ottSeletedClickEventHandler)

        const btnSwitch = document.createElement('button')
        const btnSwitchImg = document.createElement('img')
        btnSwitchImg.className = 'btnSwitchImg'
        btnSwitch.addEventListener('click', ottbtnSwitchClickEventHandler)

        const btncategoryDelete = document.createElement('button')
        const btncategoryDeleteImg = document.createElement('img')
        btncategoryDeleteImg.className = 'btncategoryDeleteImg'
        btncategoryDelete.addEventListener('click', ottbtncategoryDeleteClickEventHandler)

        chrome.storage.local.get(['user_setting'], function (result) {
          const thememode = result.user_setting[4].type
          if (thememode === 'light-mode') {
            btncontentPlusImg.src = 'icons/plus_black.png'
            btnSeletedImg.src = 'icons/swap_black.png'
            btnSwitchImg.src = 'icons/switch_black.png'
            btncategoryDeleteImg.src = 'icons/delete_black.png'
          } else {
            btncontentPlusImg.src = 'icons/plus_white.png'
            btnSeletedImg.src = 'icons/swap_white.png'
            btnSwitchImg.src = 'icons/switch_white.png'
            btncategoryDeleteImg.src = 'icons/delete_white.png'
          }
        })

        btncontentPlus.appendChild(btncontentPlusImg)
        btnSwitch.appendChild(btnSwitchImg)
        btncategoryDelete.appendChild(btncategoryDeleteImg)
        btnSeleted.appendChild(btnSeletedImg)
        btncategoryWrapper.appendChild(btncontentPlus)
        btncategoryWrapper.appendChild(btnSeleted)
        btncategoryWrapper.appendChild(btnSwitch)
        btncategoryWrapper.appendChild(btncategoryDelete)
      }

      var itemContainer = document.createElement('div')
      itemContainer.className = 'itemContainer'

      categorysettingDiv.appendChild(h2)
      categorysettingDiv.appendChild(btncategoryWrapper)

      categoryDiv.appendChild(categorysettingDiv)

      categoryDiv.appendChild(itemContainer)

      pageDiv.appendChild(categoryDiv)
    }


    // ott 페이지 콘텐트 생성
    chrome.storage.local.get(['mark_ott', 'mark_ott_setting', "mark_ott_img", "mark_ott_title", "mark_ott_url", "mark_ott_genre", "mark_ott_type"], function (result) {
      var ottsettinglist = []
      mark_ott = result['mark_ott']
      mark_ott_setting = result['mark_ott_setting']
      mark_ott_img = result['mark_ott_img']
      mark_ott_title = result['mark_ott_title']
      mark_ott_url = result['mark_ott_url']
      mark_ott_genre = result['mark_ott_genre']
      mark_ott_type = result['mark_ott_type']

      for (let i = 0; i < mark_ott.length; i++) {
        var setting = mark_ott_setting[i]
        ottsettinglist.push([i, setting])
      }

      ottsettinglist.sort(function (a, b) {
        return Number(a[1]) - Number(b[1]);
      });

      for (let i of ottsettinglist) {

        var ottpage = document.querySelector('.ottpage')
        var setting = String(i[1])
        if (setting.length === 3) { setting = "0" + setting }
        console.log(setting)
        var categoryindex = Number(setting.slice(0, 2))
        var settingindex = Number(setting.slice(2, 4))
        console.log(categoryindex, settingindex)

        categoryindex = (categoryindex) % 100
        settingindex = (settingindex) % 100

        var categoryDiv = ottpage.children[categoryindex]
        var itemContainerDiv = categoryDiv.getElementsByClassName('itemContainer')[0]

        const btnWrapper = document.createElement('div')
        btnWrapper.className = "itemBtnWrapper"
        const cardwrapper = document.createElement('div')
        cardwrapper.className = 'cardWrapper'

        const btnDelete = document.createElement('button')
        const btnDeleteImg = document.createElement('img')
        btnDeleteImg.className = 'btnDeleteImg'
        btnDelete.addEventListener('click', ottDeleteClickEventHandler)

        const btnSeleteditem = document.createElement('button')
        const btnSeleteditemImg = document.createElement('img')
        btnSeleteditemImg.className = 'btnSeleteditemImg'
        btnSeleteditem.addEventListener('click', ottSeleteditemClickEventHandler)

        const btnRecommenditem = document.createElement('button')
        btnRecommenditem.className = 'btn-recommend'
        const btnRecommenditemInner = document.createElement('p')
        btnRecommenditemInner.className = 'btnRecommenditemInner'
        btnRecommenditemInner.textContent = "AI 추천"

        btnRecommenditem.addEventListener('click', ottRecommenditemClickEventHandler)

        chrome.storage.local.get(['user_setting'], function (result) {
          const thememode = result.user_setting[4].type
          if (thememode === 'light-mode') {
            btnDeleteImg.src = 'icons/delete_black.png'
            btnSeleteditemImg.src = 'icons/check_box_black.png'
            //btnRecommenditemImg.src = 'icons/thumb_up_black.png'
          } else {
            btnDeleteImg.src = 'icons/delete_white.png'
            btnSeleteditemImg.src = 'icons/check_box_white.png'
            //btnRecommenditemImg.src = 'icons/thumb_up_white.png'
          }
        })

        const itemDiv = document.createElement('a');
        itemDiv.className = 'card'
        let id = mark_ott[i[0]]
        let url = mark_ott_url[i[0]]

        itemDiv.dataset.id = id
        itemDiv.dataset.type = 'mark_ott'
        itemDiv.dataset.genre = result['mark_ott_genre'][i[0]]
        itemDiv.dataset.platform = mark_ott_type[i[0]]
        itemDiv.href = url
        itemDiv.innerHTML = `
              <img class='thumbnail' src=${mark_ott_img[i[0]]} alt=${mark_ott_title[i[0]]}>
              <h3>${mark_ott_title[i[0]]}</h3>
            `;

        itemDiv.addEventListener('click', function (e) {
          chrome.tabs.create({ url: e.target.parentNode.href });
          return false
        })

        btnDelete.appendChild(btnDeleteImg)
        btnSeleteditem.appendChild(btnSeleteditemImg)
        btnRecommenditem.appendChild(btnRecommenditemInner)
        //btnWrapper.appendChild(btnRecommenditem)
        btnWrapper.appendChild(btnSeleteditem)
        btnWrapper.appendChild(btnDelete)

        cardwrapper.appendChild(btnRecommenditem)
        cardwrapper.appendChild(btnWrapper)
        cardwrapper.appendChild(itemDiv)
        itemContainerDiv.appendChild(cardwrapper)

        itemSetting = itemIndexToString(itemContainerDiv.children.length - 1)
        mark_ott_setting[i[0]] = mark_ott_setting[i[0]].slice(0, 2) + itemSetting
        chrome.storage.local.set({ mark_ott_setting: mark_ott_setting })
      }
      ottcreatecontentsscrollbtn()
      refreshOTTCards()
    })
  })
}