
console.log('category.js')
//각 탭 화면 생성


/**********************************************************************/

// 유저 설정 불러오기
chrome.storage.local.get(['user_setting'], function (result) {

  channel_groups = result['user_setting'][1].setting
  // channel 페이지 카테고리 생성

})

/*******************************************************************************************************/


function renderYouvidTab() {
  // 유저 설정 불러오기
  chrome.storage.local.get(['mark_youvid', 'mark_youvid_setting', 'mark_youvid_items', 'user_setting'], function (result) {
    youvid_groups = result['user_setting'][2].setting
    mark_youvid = result['mark_youvid']
    mark_youvid_setting = result['mark_youvid_setting']
    mark_youvid_items = result['mark_youvid_items']

    // youtube 페이지 카테고리 생성
    for (let name of youvid_groups) {
      var pageDiv = document.querySelector('.youvidpage')
      console.log(pageDiv)
      var categoryDiv = document.createElement('div')
      categoryDiv.className = 'category'

      var categorysettingDiv = document.createElement('div')
      categorysettingDiv.className = 'categorysetting'

      var h2 = document.createElement('h2');
      h2.textContent = name;

      var btncategoryWrapper = document.createElement('div')
      btncategoryWrapper.className = 'btncategoryWrapper'

      if (youvid_groups.indexOf(name) === 0) {

        const btncontentPlus = document.createElement('button')
        const btncontentPlusImg = document.createElement('img')
        btncontentPlusImg.className = 'btncontentPlusImg'
        btncontentPlus.addEventListener('click', youvidcontentPlusClickEventHandler)

        const btnSwitch = document.createElement('button')
        const btnSwitchImg = document.createElement('img')
        btnSwitchImg.className = 'btnSwitchImg'
        btnSwitch.addEventListener('click', youvidbtnSwitchClickEventHandler)

        chrome.storage.local.get(['user_setting'], function (result) {
          const thememode = result.user_setting[4].type
          if (thememode === 'light-mode') {
            btncontentPlusImg.src = 'icons/plus_black.png'
            btnSwitchImg.src = 'icons/switch_black.png'
          } else {
            btncontentPlusImg.src = 'icons/plus_white.png'
            btnSwitchImg.src = 'icons/switch_white.png'
          }
        })

        btncontentPlus.appendChild(btncontentPlusImg)

        btnSwitch.appendChild(btnSwitchImg)
        btncategoryWrapper.appendChild(btncontentPlus)
        btncategoryWrapper.appendChild(btnSwitch)

      } else {
        const btncontentPlus = document.createElement('button')
        const btncontentPlusImg = document.createElement('img')
        btncontentPlusImg.className = 'btncontentPlusImg'
        btncontentPlus.addEventListener('click', youvidcontentPlusClickEventHandler)

        const btnSeleted = document.createElement('button')
        const btnSeletedImg = document.createElement('img')
        btnSeletedImg.className = 'btnSeletedImg'
        btnSeleted.addEventListener('click', youvidSeletedClickEventHandler)

        const btnSwitch = document.createElement('button')
        const btnSwitchImg = document.createElement('img')
        btnSwitchImg.className = 'btnSwitchImg'
        btnSwitch.addEventListener('click', youvidbtnSwitchClickEventHandler)

        const btncategoryDelete = document.createElement('button')
        const btncategoryDeleteImg = document.createElement('img')
        btncategoryDeleteImg.className = 'btncategoryDeleteImg'
        btncategoryDelete.addEventListener('click', youvidbtncategoryDeleteClickEventHandler)

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



    // youtube 페이지 콘텐트 생성
    var youvidsettinglist = []
    for (let i = 0; i < mark_youvid.length; i++) {
      var setting = mark_youvid_setting[i]
      youvidsettinglist.push([i, setting])
    }
    youvidsettinglist.sort(function (a, b) {
      return Number(a[1]) - Number(b[1]);
    });

    for (let s of youvidsettinglist) {
      var youvidpage = document.querySelector('.youvidpage')
      var setting = String(s[1])
      if (setting.length === 3) { setting = "0" + setting }
      var categoryindex = Number(setting.slice(0, 2))
      var settingindex = Number(setting.slice(2, 4))

      categoryindex = (categoryindex) % 100
      settingindex = (settingindex) % 100

      var categoryDiv = youvidpage.children[categoryindex]
      var itemContainerDiv = categoryDiv.querySelector('.itemContainer')

      const btnWrapper = document.createElement('div')
      btnWrapper.className = "itemBtnWrapper"
      const cardwrapper = document.createElement('div')
      cardwrapper.className = 'cardWrapper'

      const btnSeleteditem = document.createElement('button')
      const btnSeleteditemImg = document.createElement('img')
      btnSeleteditemImg.className = 'btnSeleteditemImg'
      btnSeleteditem.addEventListener('click', youvidSeleteditemClickEventHandler)

      const btnDelete = document.createElement('button')
      const btnDeleteImg = document.createElement('img')
      btnDeleteImg.className = 'btnDeleteImg'
      btnDelete.addEventListener('click', youvidDeleteClickEventHandler)

      chrome.storage.local.get(['user_setting'], function (result) {
        const thememode = result.user_setting[4].type
        if (thememode === 'light-mode') {
          btnSeleteditemImg.src = 'icons/check_box_black.png'
          btnDeleteImg.src = 'icons/delete_black.png'
        } else {
          btnSeleteditemImg.src = 'icons/check_box_white.png'
          btnDeleteImg.src = 'icons/delete_white.png'
        }
      })

      const itemDiv = document.createElement('a');
      itemDiv.className = 'card'
      let id = mark_youvid[s[0]]

      itemDiv.dataset.id = id
      itemDiv.dataset.type = 'mark_youvid'
      itemDiv.href = "https://www.youtube.com/watch?v=" + id
      itemDiv.innerHTML = `
            <img class='thumbnail' src=${mark_youvid_items[s[0]].thumbnails.high.url} alt=${mark_youvid_items[s[0]].title}>
            <h3> ${mark_youvid_items[s[0]].title} </h3>
          `;

      itemDiv.addEventListener('click', function (e) {
        chrome.tabs.create({ url: e.target.parentNode.href });
        return false
      })

      btnDelete.appendChild(btnDeleteImg)
      btnSeleteditem.appendChild(btnSeleteditemImg)
      btnWrapper.appendChild(btnSeleteditem)
      btnWrapper.appendChild(btnDelete)
      cardwrapper.appendChild(btnWrapper)
      cardwrapper.appendChild(itemDiv)
      itemContainerDiv.appendChild(cardwrapper)

      itemSetting = itemIndexToString(itemContainerDiv.children.length - 1)
      mark_youvid_setting = result["mark_youvid_setting"]
      mark_youvid_setting[s[0]] = mark_youvid_setting[s[0]].slice(0, 2) + itemSetting
      chrome.storage.local.set({ mark_youvid_setting: mark_youvid_setting })
    }
    youvidcreatecontentsscrollbtn()
  })
}



/*****************************************************************************************************/

document.body.addEventListener('createcategory', function (e) {
  chrome.storage.local.get('user_setting', function (result) {
    ottGroups = result["user_setting"][0].setting
    let ottpageDiv = document.body.getElementsByClassName('ottpage')[0]
    let cards = ottpageDiv.children[0].getElementsByClassName('card')
    while (cards.length > 0) {
      for (c of cards) {
        let wrapper = c.closest('.cardWrapper')
        let genres = c.dataset.genre.split(',')
        for (i in genres) {
          genres[i] = genres[i].trim()
        }
        let g = classify(genres)

        if (ottGroups.includes(g)) {
          ottpageDiv.children[ottGroups.indexOf(g)].querySelector('.itemContainer').appendChild(wrapper)
        }
      }
    }
    refreshOTTSetting()
  })
})

/****************************************************************************************************************/

function classify(genres) {
  let priority = ["다큐멘터리", "스릴러", "역사", "애니메이션", "드라마", "판타지", "SF", "코미디", "액션", "범죄"]   // 순서 중요!
  for (g in priority) {
    if (genres.includes(priority[g])) { return priority[g] }
    else if (g == (priority.length - 1)) { return ("기타") }
  }
}

/******************************************************************************************************************/
// 장르별 분류 버튼 이벤트 핸들러
function btnClassifyClickEventHandler(e) {
  chrome.storage.local.get('user_setting', function (result) {
    ottGroups = result["user_setting"][0].setting

    let ottpageDiv = e.target.closest('.ottpage')
    let cards = ottpageDiv.getElementsByClassName('card')

    for (c of cards) {

      let g = classify(c.dataset.genre)
      if (!ottGroups.includes(g)) {
        ottGroups.push(g)
        var categoryDiv = document.createElement('div')
        categoryDiv.className = 'category'

        var categorysettingDiv = document.createElement('div')
        categorysettingDiv.className = 'categorysetting'

        var h2 = document.createElement('h2');
        h2.textContent = g;

        var btncategoryWrapper = document.createElement('div')
        btncategoryWrapper.className = 'btncategoryWrapper'

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

        var itemContainer = document.createElement('div')
        itemContainer.className = 'itemContainer'

        categorysettingDiv.appendChild(h2)
        categorysettingDiv.appendChild(btncategoryWrapper)
        categoryDiv.appendChild(categorysettingDiv)
        categoryDiv.appendChild(itemContainer)
        ottpageDiv.appendChild(categoryDiv)
      }
    }
    result["user_setting"][0].setting = ottGroups
    chrome.storage.local.set({ user_setting: result["user_setting"] }, function () {
      let e = new Event('createcategory')
      document.body.dispatchEvent(e)
    })
  })
}


function renderChannelTab() {
  chrome.storage.local.get(['mark_channel', 'mark_channel_img', 'mark_channel_items', 'mark_channel_name'], function (result) {
    mark_channel = result['mark_channel']
    mark_channel_img = result['mark_channel_img']
    mark_channel_items = result['mark_channel_items']
    mark_channel_name = result['mark_channel_name']

    for (let i = 0; i < mark_channel.length; i++) {

      const channel_img = mark_channel_img[i]
      const channel_name = mark_channel_items[i][0].snippet.channelTitle

      var pageDiv = document.querySelector('.channelpage')
      var categoryDiv = document.createElement('div')
      categoryDiv.className = 'category'
      categoryDiv.dataset.id = mark_channel[i]
      categoryDiv.dataset.type = "mark_channel"

      var categorysettingDiv = document.createElement('div')
      categorysettingDiv.className = 'categorysetting'

      var channelbtn = document.createElement('a')
      var channelimg = document.createElement('img')
      channelimg.className = 'channelimg'
      channelimg.src = channel_img
      channelbtn.href = 'https://www.youtube.com/channel/' + mark_channel[i]

      channelbtn.addEventListener('click', function (e) {
        chrome.tabs.create({ url: e.target.parentNode.href });
        return false
      })

      var h2 = document.createElement('h2');
      h2.textContent = channel_name

      var btncategoryWrapper = document.createElement('div')
      btncategoryWrapper.className = 'btncategoryWrapper'

      // const btnSeleted = document.createElement('button')
      // const btnSeletedImg = document.createElement('img')
      // btnSeletedImg.className = 'btnSeletedImg'
      // btnSeleted.addEventListener('click', channelSeletedClickEventHandler)

      const cardDiv = document.createElement('div');
      cardDiv.className = 'card'
      cardDiv.dataset.type = 'mark_channel'
      cardDiv.dataset.id = mark_channel[i]

      const btncategoryDelete = document.createElement('button')
      const btncategoryDeleteImg = document.createElement('img')
      btncategoryDeleteImg.className = 'btncategoryDeleteImg'
      btncategoryDelete.addEventListener('click', channelbtncategoryDeleteClickEventHandler)

      chrome.storage.local.get(['user_setting'], function (result) {
        const thememode = result.user_setting[4].type
        if (thememode === 'light-mode') {
          // btnSeletedImg.src = 'icons/swap_black.png'
          btncategoryDeleteImg.src = 'icons/delete_black.png'
        } else {
          // btnSeletedImg.src = 'icons/swap_white.png'
          btncategoryDeleteImg.src = 'icons/delete_white.png'
        }
      })

      cardDiv.appendChild(btncategoryDeleteImg);
      btncategoryDelete.appendChild(cardDiv)
      // btnSeleted.appendChild(btnSeletedImg)
      // btncategoryWrapper.appendChild(btnSeleted)
      btncategoryWrapper.appendChild(btncategoryDelete)

      channelbtn.appendChild(channelimg)
      categorysettingDiv.appendChild(channelbtn)
      categorysettingDiv.appendChild(h2)
      categorysettingDiv.appendChild(btncategoryWrapper)

      categoryDiv.appendChild(categorysettingDiv)

      var itemContainerDiv = document.createElement('div')
      itemContainerDiv.className = 'itemContainer'

      for (let k = 0; k < 5; k++) {
        const cardwrapper = document.createElement('div')
        cardwrapper.className = "cardWrapper"

        const itemDiv = document.createElement('a');
        itemDiv.classList.add('card')
        itemDiv.classList.add('refresh')

        let id = mark_channel[i]
        let items = mark_channel_items[i][k]
        let videoId = mark_channel_items[i][k].id.videoId
        let thumbnail = mark_channel_items[i][k].snippet.thumbnails

        itemDiv.dataset.id = id
        itemDiv.dataset.type = 'mark_channel'
        itemDiv.href = 'https://www.youtube.com/watch?v=' + videoId
        itemDiv.innerHTML = `
            <img class='thumbnail' src=${thumbnail.high.url} alt=${items.snippet.title}>
            <h3> ${items.snippet.title} </h3>
          `;

        itemDiv.addEventListener('click', function (e) {
          chrome.tabs.create({ url: e.target.parentNode.href });
          return false
        })

        cardwrapper.appendChild(itemDiv)
        itemContainerDiv.appendChild(cardwrapper)
      }

      categoryDiv.appendChild(itemContainerDiv)
      pageDiv.appendChild(categoryDiv)
    }
    channelcreatecontentsscrollbtn()
  })
}

/*************************************************************************************************************/

function renderStreamers(item) {
  // 스트리머 탭 카테고리 생성
  console.log(item)
  chrome.storage.local.get(['mark_streamer'], function (result) {
    console.log(result['mark_streamer'])
  })
  var pageDiv = document.querySelector('.streamerpage')
  var categoryDiv = document.createElement('div')
  categoryDiv.className = 'category'

  var categorysettingDiv = document.createElement('div')
  categorysettingDiv.className = 'categorysetting'

  var streamerbtn = document.createElement('a')
  var h2 = document.createElement('h2');

  const name = item.user_name
  const pageRef = item.user_login
  h2.textContent = name
  streamerbtn.href = 'https://www.twitch.tv/' + pageRef

  streamerbtn.addEventListener('click', function (e) {
    chrome.tabs.create({ url: e.target.parentNode.href });
    return false
  })

  var btncategoryWrapper = document.createElement('div')
  btncategoryWrapper.className = 'btncategoryWrapper'

  // const btnSeleted = document.createElement('button')
  // const btnSeletedImg = document.createElement('img')
  // btnSeletedImg.className = 'btnSeletedImg'
  // btnSeleted.addEventListener('click', streamerSeletedClickEventHandler)

  const cardDiv = document.createElement('div');
  cardDiv.className = 'card'
  cardDiv.dataset.id = item.id
  cardDiv.dataset.type = 'mark_streamer'

  const btncategoryDelete = document.createElement('button')
  const btncategoryDeleteImg = document.createElement('img')
  btncategoryDeleteImg.className = 'btncategoryDeleteImg'
  btncategoryDelete.addEventListener('click', streamerbtncategoryDeleteClickEventHandler)


  chrome.storage.local.get(['user_setting'], function (result) {
    const thememode = result.user_setting[4].type
    if (thememode === 'light-mode') {
      // btnSeletedImg.src = 'icons/swap_black.png'
      btncategoryDeleteImg.src = 'icons/delete_black.png'
    } else {
      // btnSeletedImg.src = 'icons/swap_white.png'
      btncategoryDeleteImg.src = 'icons/delete_white.png'
    }
  })

  cardDiv.appendChild(btncategoryDeleteImg)
  btncategoryDelete.appendChild(cardDiv)
  // btnSeleted.appendChild(btnSeletedImg)
  // btncategoryWrapper.appendChild(btnSeleted)
  btncategoryWrapper.appendChild(btncategoryDelete)

  streamerbtn.appendChild(h2)
  categorysettingDiv.appendChild(streamerbtn)
  categorysettingDiv.appendChild(btncategoryWrapper)

  categoryDiv.appendChild(categorysettingDiv)

  var itemContainerDiv = document.createElement('div')
  itemContainerDiv.className = 'itemContainer'

  const cardwrapper = document.createElement('div')
  cardwrapper.className = "cardWrapper"

  const is_live = item.type

  const itemDiv = document.createElement('a');
  itemDiv.classList.add('card')
  itemDiv.classList.add('refresh')
  //let id = mark_streamer[i]
  //let streamerid = mark_streamer_name[i].match(/\((.*?)\)/);

  let thumbnail = item.thumbnail_url;
  thumbnail = thumbnail.replace('{width}', '640')
  thumbnail = thumbnail.replace('{height}', '360')
  //itemDiv.dataset.id = id
  itemDiv.dataset.type = 'mark_streamer'

  itemDiv.href = "https://www.twitch.tv/" + pageRef


  if (is_live === "live") {
    // 현재 방송중이라면,
    itemDiv.innerHTML = `
          <img class='thumbnail' src=${thumbnail} alt=${name}>
          <h3> ${item.title} </h3>
        `;
  } else {
    // 방송중이지 않은 경우
    itemDiv.innerHTML = `
      <h3> 현재 방송중이지 않습니다. </h3>
    `;
  }

  itemDiv.addEventListener('click', function (e) {
    chrome.tabs.create({ url: e.target.parentNode.href });
    return false
  })

  cardwrapper.appendChild(itemDiv)
  itemContainerDiv.appendChild(cardwrapper)
  //itemSetting = itemIndexToString(itemContainerDiv.children.length - 1)

  categoryDiv.appendChild(itemContainerDiv)
  pageDiv.appendChild(categoryDiv)

}
