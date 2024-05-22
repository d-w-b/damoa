/****************************  각 탭에서의 기능 구현 **************************************/

// ott 카테고리 삭제 버튼 이벤트 핸들러
function ottbtncategoryDeleteClickEventHandler(event) {
  chrome.storage.local.get(['user_setting'], function (result) {
    user_setting = result['user_setting']
    element = event.target;
    const categoryContainer = element.closest('.category');
    let cardWrappers = categoryContainer.querySelectorAll('.cardWrapper')

    if (cardWrappers.length === 0) {
      const categoryIndex = Array.from(categoryContainer.parentNode.children).indexOf(categoryContainer);
      if (categoryIndex) {

        user_setting[0].setting.splice(categoryIndex, 1)
        chrome.storage.local.set({ user_setting: user_setting })
        console.log('deletecategory')
        console.log(categoryIndex)
      }
      if (categoryContainer) {
        categoryContainer.remove();
        console.log('deletecategory');
      }
    }
  })
}

var ottflag = false
// ott 같은 카테고리 내의 콘텐트 순서 이동 on/off
function ottbtnSwitchClickEventHandler(event) {
  if (ottflag === false) {
    ottflag = true
    ottcontentsswitch = []
    console.log('콘텐트 순서 바꾸기 on', ottcontentsswitch)
    event.target.style.background = '#c6c6c6'
  } else {
    ottflag = false
    event.target.style.background = 'transparent'
  }
  console.log(ottflag)
}

// 카테고리 내 콘텐트 순서 변경
function ottswitchcontentsincategory() {
  chrome.storage.local.get(['mark_ott_setting', 'mark_ott'], function (result) {
    mark_ott_setting = result['mark_ott_setting']
    mark_ott = result['mark_ott']
    // mark index
    id1 = mark_ott.indexOf(ottcontentsswitch[0][1].querySelector('a.card').dataset.id)
    id2 = mark_ott.indexOf(ottcontentsswitch[1][1].querySelector('a.card').dataset.id)
    if (ottcontentsswitch.length === 2) {
      index1 = ottcontentsswitch[0][0]
      index2 = ottcontentsswitch[1][0]
      if (index1 !== index2) {

        parent = ottcontentsswitch[1][1].parentNode
        if (index1 < index2) {
          parent.insertBefore(ottcontentsswitch[0][1], parent.children[index2]);
          parent.insertBefore(ottcontentsswitch[1][1], parent.children[index1]);
        } else {
          parent.insertBefore(ottcontentsswitch[1][1], parent.children[index1]);
          parent.insertBefore(ottcontentsswitch[0][1], parent.children[index2]);
        }

        let temp = mark_ott_setting[id1]
        mark_ott_setting[id1] = mark_ott_setting[id2]
        mark_ott_setting[id2] = temp
        chrome.storage.local.set({ mark_ott_setting: mark_ott_setting })

      }
      if (ottcontentsswitch.length === 2) {
        const btnsSeleted = document.querySelectorAll('.btnSeleteditemImg');
        btnsSeleted.forEach(img => {
          img.src = 'icons/check_box_black.png'
          img.style.background = 'transparent'
          console.log('색상변경')
        });
      }
      ottcontentsswitch = []
    }
  })

}

var ottaddcategoryindex = null
var ottcontentsswitch = []
// ott에 콘텐트의 카테고리 이동
function ottcontentPlusClickEventHandler(event) {
  chrome.storage.local.get(['mark_ott', 'mark_ott_setting'], function (result) {
    mark_ott = result['mark_ott']
    mark_ott_setting = result['mark_ott_setting']
    var element = event.target
    var category = element.closest('.category')
    ottaddcategoryindex = Array.from(category.parentNode.children).indexOf(category)
    console.log(ottcontentsswitch)
    var target = category.querySelector('.itemContainer')
    for (let i of ottcontentsswitch) {
      target.appendChild(i[1])
      idx = mark_ott.indexOf(i[1].querySelector('a.card').dataset.id)
      mark_ott_setting[idx] = categoryIndexToString(ottaddcategoryindex) + itemIndexToString(target.children.length)
      chrome.storage.local.set({ mark_ott_setting: mark_ott_setting })
    }
    ottcontentsswitch = []

    const btnsSeleted = document.querySelectorAll('.btnSeleteditemImg');
    console.log(btnsSeleted)
    btnsSeleted.forEach(img => {
      img.src = 'icons/check_box_black.png'
      img.style.background = 'transparent'
      console.log("색상 원래대로")
    });
  })
}

// ott 콘텐트 항목 선택
function ottSeleteditemClickEventHandler(event) {
  var element = event.target
  var content = element.closest('.cardWrapper')
  var addcontentindex = Array.from(content.parentNode.children).indexOf(content)

  console.log(content)

  if (ottflag === false) {
    ottcontentsswitch.push([addcontentindex, content])
    console.log(ottcontentsswitch)
    element.src = 'icons/checked_box_black.png'
    element.style.background = '#fff'

  } else {
    ottcontentsswitch.push([addcontentindex, content])
    element.src = 'icons/checked_box_black.png'
    element.style.background = '#fff'
    ottswitchcontentsincategory()
  }
}


var ottselectedCategory = null
var ottclickedcategory = []

// ott 카테고리 순서 변경
function ottSeletedClickEventHandler(event) {
  const element = event.target;
  const category = element.closest('.category')
  const categoryIndex = Array.from(category.parentNode.children).indexOf(category);
  ottclickedcategory.push([categoryIndex, category])

  element.style.background = '#c6c6c6'
  console.log(ottclickedcategory)
  console.log(ottclickedcategory.length)

  if (ottclickedcategory.length === 2) {
    const btnsSeleted = document.querySelectorAll('.btnSeletedImg');

    btnsSeleted.forEach(img => {
      img.style.background = 'transparent'
    });
  }
  ottcheckClicked()
}

function ottcheckClicked() {
  if (ottclickedcategory.length === 2) {
    chrome.storage.local.get(['mark_ott', 'mark_ott_setting'], function (result) {
      index1 = ottclickedcategory[0][0]
      index2 = ottclickedcategory[1][0]

      parent = ottclickedcategory[1][1].parentNode

      if (index1 !== index2) {
        if (index1 < index2) {
          parent.insertBefore(ottclickedcategory[0][1], parent.children[index2]);
          parent.insertBefore(ottclickedcategory[1][1], parent.children[index1]);

        } else {
          parent.insertBefore(ottclickedcategory[1][1], parent.children[index1]);
          parent.insertBefore(ottclickedcategory[0][1], parent.children[index2]);
        }

        // 카테고리 내에 있는 콘텐트들의 setting 변경
        mark_ott = result['mark_ott']
        mark_ott_setting = result['mark_ott_setting']
        cards1 = ottclickedcategory[0][1].getElementsByClassName('card')
        cards2 = ottclickedcategory[1][1].getElementsByClassName('card')
        for (c of cards1) {
          idx = mark_ott.indexOf(c.dataset.id)
          mark_ott_setting[idx] = categoryIndexToString(index2) + mark_ott_setting[idx].slice(2,)
        }
        for (c of cards2) {
          idx = mark_ott.indexOf(c.dataset.id)
          mark_ott_setting[idx] = categoryIndexToString(index1) + mark_ott_setting[idx].slice(2,)
        }
        chrome.storage.local.set({ mark_ott_setting: mark_ott_setting })
      }
      ottclickedcategory = []
    })
  }
}

// Ott 분류 카테고리 내용 입력 칸 생성 
const addOttCategoryBtn = document.querySelector('#addOttCategoryBtn');

addOttCategoryBtn.addEventListener('click', (event) => {
  const inputcontainer = document.querySelector('.input-container')
  if (inputcontainer === null) {
    element = event.target
    console.log("category add button click");
    var inputContainer = document.createElement('div');
    inputContainer.className = "input-container";

    var input = document.createElement('input');
    input.id = "input";
    input.placeholder = "카테고리 이름을 입력하세요";

    var addbutton = document.createElement('button');
    addbutton.id = 'add-button';
    addbutton.textContent = "추가";

    inputContainer.appendChild(input);
    inputContainer.appendChild(addbutton);

    addbutton.addEventListener('click', () => {
      chrome.storage.local.get(['user_setting'], function (result) {
        user_setting = result['user_setting']

        const input = document.querySelector('#input');
        const text = input.value.trim();

        if (text !== '') {
          user_setting[0].setting.push(text)
          chrome.storage.local.set({ user_setting: user_setting })

          console.log(text)
          var target = document.querySelector('.ottpage')
          // var target = category.querySelector('.ottpage')
          var categoryDiv = document.createElement('div')
          categoryDiv.className = 'category'

          var categorysettingDiv = document.createElement('div')
          categorysettingDiv.className = 'categorysetting'

          var h2 = document.createElement('h2');
          h2.textContent = text;

          var btncategoryWrapper = document.createElement('div')
          btncategoryWrapper.className = 'btncategoryWrapper'

          const btncontentPlus = document.createElement('button')
          const btncontentPlusImg = document.createElement('img')
          btncontentPlus.addEventListener('click', ottcontentPlusClickEventHandler)

          const btnSeleted = document.createElement('button')
          const btnSeletedImg = document.createElement('img')
          btnSeletedImg.className = 'btnSeletedImg'
          btnSeleted.addEventListener('click', ottSeletedClickEventHandler)

          const btnSwitch = document.createElement('button')
          const btnSwitchImg = document.createElement('img')
          btnSwitch.addEventListener('click', ottbtnSwitchClickEventHandler)

          const btncategoryDelete = document.createElement('button')
          const btncategoryDeleteImg = document.createElement('img')
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
          btnSeleted.appendChild(btnSeletedImg)
          btnSwitch.appendChild(btnSwitchImg)
          btncategoryDelete.appendChild(btncategoryDeleteImg)
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

          target.appendChild(categoryDiv)

        }
        inputContainer.remove();
      })
    });
    addOttCategoryBtn.insertAdjacentElement('beforebegin', inputContainer);
  }
});

var recommendBoxVisible = false;


function ottRecommenditemClickEventHandler(event) {

  const w = event.target.closest('.cardWrapper')
  const a = w.querySelector('a.card')
  
  platform = a.dataset.platform
  title = a.querySelector('h3').textContent
  chrome.storage.local.get(['id'], function (result) {
    const userid = result["id"]
    const behaviorData = {
      // "event_target": title + "_" + platform ,
      // "event_type": "request_rec"
      "event_type": "click",
      "event_target": "rec" 
    }

    fetch(serverURL + "/userinfo/userbehavior/" + userid, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(behaviorData)
    }).then((response) => {
      console.log(response)
    });
  })

  const parentNode = event.target.closest('.main')
  if (!recommendBoxVisible) {
    var recommendbox = document.createElement("div");
    recommendbox.className = "recommenditem-box";
    parentNode.appendChild(recommendbox);

    var recommendtitelWrapper = document.createElement('div')
    recommendtitelWrapper.className = 'recommendtitelWrapper'
    recommendbox.appendChild(recommendtitelWrapper)

    var recommendtitle = document.createElement('h2')
    recommendtitle.textContent = 'AI가 추천하는 ' + title + ' 의 연관 콘텐트'
    recommendtitle.className = 'recommendtitle'
    recommendtitelWrapper.appendChild(recommendtitle)

    var deleteButton = document.createElement("button");
    deleteButton.className = 'recommenddeleteButton'
    deleteButton.innerHTML = '<img src="icons/delete_black.png" alt="Delete Icon">';
    recommendtitelWrapper.appendChild(deleteButton);
    deleteButton.addEventListener("click", function () {
      recommendbox.remove();
      recommendBoxVisible = false;
    });

    const recommendcontents = document.createElement('div')
    recommendcontents.className = 'recommendcontents'

    const loadingBox = document.createElement('div')
    loadingBox.className = "recLoading"
    const loadingText = document.createElement('p')
    const loadingImg = document.createElement('img')
    loadingImg.src = 'icons/refresh.png'
    loadingImg.alt = 'AI 추천 리스트를 불러오는 중 입니다.'
    loadingText.textContent = 'AI 추천 리스트를 불러오는 중 입니다.'
    // 로딩 애니메이션
    const errp = document.createElement('p');
    errp.className = 'p-err'
    recommendbox.appendChild(errp)
    loadingBox.appendChild(loadingText)
    loadingBox.appendChild(loadingImg)
    recommendcontents.appendChild(loadingBox)
    recommendbox.appendChild(recommendcontents)


    chrome.storage.local.get(['id'], function (result) {
      const userid = result["id"]
      fetch(serverURL + "/recommend", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "userid": userid,
          "title": title,
          "platform": platform
        })
      }).then(res => {
        return res.json()
      }).then(res => {
        console.log(res)
        loadingBox.remove()

        rec = res.recommendation
        if (res.recsims) {
          sims = res.recsims
        } else {
          sims = null;
          errp.textContent = "AI 연관 콘텐트 목록에서 데이터를 찾을 수 없습니다. TMDB 추천 API 에 연결합니다."
        }

        var row = document.createElement('div');
        row.className = 'recommendrow';
        recommendcontents.appendChild(row);

        for (let i = 0; i < rec.length; i++) {
          const recommendcontentWrapper = document.createElement('div');
          recommendcontentWrapper.className = 'recommendcolumn';

          const recommendcontent = document.createElement('a');
          const wrapperSims = document.createElement('div')
          wrapperSims.className = 'wrapper-sims'
          const simsTitle = document.createElement('p')
          simsTitle.textContent = '콘텐트 유사도'
          const simsScore = document.createElement('p')
          if (sims === null) {
            simsScore.textContent = '0'
          } else {
            // simsScore.textContent = String( (parseFloat(sims[i]) * 100).toFixed(3) ) + '%'
            simsScore.textContent = sims[i]
          }

          wrapperSims.appendChild(simsTitle)
          wrapperSims.appendChild(simsScore)

          recommendcontent.dataset.tmbdId = rec[i].id
          recommendcontent.dataset.mlId = rec[i].movieid
          recommendcontent.className = 'recommendcontent';
          const recommendcontentImg = document.createElement('img');
          recommendcontentImg.src = 'https://www.themoviedb.org/t/p/w440_and_h660_face' + rec[i].poster_path
          recommendcontentImg.alt = rec[i].title
          recommendcontent.href = 'https://www.themoviedb.org/movie/' + rec[i].id
          recommendcontent.addEventListener('click', function (e) {

            chrome.storage.local.get(['id'], function (result) {

              const b = {
                "event_target": e.target.closest('a').querySelector('img').alt,
                "event_type": "hit"
              }

              fetch(serverURL + "/userinfo/userbehavior/" + result["id"], {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(b)
              }).then((response) => {
                console.log(response)
              });
            })

            getCurrentTab().then(tab => {
              console.log(tab)
              chrome.tabs.update(tab.id ? tab.id : tab, { url: e.target.closest('a').href });
            })
            //chrome.tabs.create({ url: e.target.closest('a').href });
            return false;
          })
          const recommendcontentTitle = document.createElement('h3');
          recommendcontentTitle.textContent = rec[i].title;

          recommendcontent.appendChild(wrapperSims);

          recommendcontent.appendChild(recommendcontentImg);
          recommendcontent.appendChild(recommendcontentTitle);

          recommendcontentWrapper.appendChild(recommendcontent);
          row.appendChild(recommendcontentWrapper);
          
          if(i == rec.length - 1){
            console.log(i)
            createRecommendScrollBtn(recommendcontents)
          }
        }
        recommendBoxVisible = true;
      })

    })

  } else {
    var recom = document.querySelector(".recommenditem-box");
    if (recom) {
      recom.remove();
    }
    recommendBoxVisible = false;
  }
}



/***************************************************************/

/*** 채널 항목 삭제 이벤트 핸들러 ***/
function channelbtncategoryDeleteClickEventHandler(event) {
  c = event.target.closest('.category')
  a = c.querySelector('div.card')

  chrome.storage.local.get(['mark_channel'], function (result) {
    mark_channel = result['mark_channel']
    idx = mark_channel.indexOf(a.dataset.id)
    deleteChannelImg(idx)
    deleteChannelSetting(idx)
    deleteChannelName(idx)
    deleteChannelMarked(idx)

    const cards = Array.from(document.querySelectorAll('a.card')).filter(item => true)
    const icons = Array.from(document.querySelectorAll('.channelicons > a')).filter(item => true)

    for (let card of cards) {
      if (card.dataset.type === a.dataset.type && card.dataset.id === a.dataset.id) {
        card.closest('.cardWrapper').remove()
      }
    }

    for (let icon of icons) {
      if (icon.dataset.id === a.dataset.id) {
        icon.remove()
      }
    }
    c.remove()
  })
}




/***************************************************************/
// youvid 카테고리 삭제
function youvidbtncategoryDeleteClickEventHandler(event) {
  chrome.storage.local.get(['user_setting'], function (result) {
    user_setting = result['user_setting']
    element = event.target;
    const categoryContainer = element.closest('.category');
    let cardWrappers = categoryContainer.querySelectorAll('.cardWrapper')

    if (cardWrappers.length === 0) {
      const categoryIndex = Array.from(categoryContainer.parentNode.children).indexOf(categoryContainer);
      if (categoryIndex) {
        user_setting[2].setting.splice(categoryIndex, 1)
        chrome.storage.local.set({ user_setting: user_setting })
      }
      if (categoryContainer) {
        categoryContainer.remove();
      }
    }
  })
}

var youvidflag = false
// youvid 같은 카테고리 내의 콘텐트 순서 이동 on/off
function youvidbtnSwitchClickEventHandler(event) {
  if (youvidflag === false) {
    youvidflag = true
    youvidcontentsswitch = []
    console.log('콘텐트 순서 바꾸기 on', youvidcontentsswitch)
    event.target.style.background = '#c6c6c6'
  } else {
    youvidflag = false
    event.target.style.background = 'transparent'
  }
  console.log(youvidflag)
}

// 카테고리 내 콘텐트 순서 변경
function youvidswitchcontentsincategory() {
  chrome.storage.local.get(['mark_youvid_setting', 'mark_youvid'], function (result) {
    mark_youvid = result['mark_youvid']
    // mark index
    id1 = mark_youvid.indexOf(youvidcontentsswitch[0][1].querySelector('a.card').dataset.id)
    id2 = mark_youvid.indexOf(youvidcontentsswitch[1][1].querySelector('a.card').dataset.id)
    if (youvidcontentsswitch.length === 2) {
      index1 = youvidcontentsswitch[0][0]
      index2 = youvidcontentsswitch[1][0]
      if (index1 !== index2) {
        parent = youvidcontentsswitch[1][1].parentNode

        if (index1 < index2) {
          parent.insertBefore(youvidcontentsswitch[0][1], parent.children[index2]);
          parent.insertBefore(youvidcontentsswitch[1][1], parent.children[index1]);
        } else {
          parent.insertBefore(youvidcontentsswitch[1][1], parent.children[index1]);
          parent.insertBefore(youvidcontentsswitch[0][1], parent.children[index2]);
        }

        mark_youvid_setting = result['mark_youvid_setting']
        let temp = mark_youvid_setting[id1]
        mark_youvid_setting[id1] = mark_youvid_setting[id2]
        mark_youvid_setting[id2] = temp
        chrome.storage.local.set({ mark_youvid_setting: mark_youvid_setting })
      }
      if (youvidcontentsswitch.length === 2) {
        const btnsSeleted = document.querySelectorAll('.btnSeleteditemImg');
        btnsSeleted.forEach(img => {
          img.src = 'icons/check_box_black.png'
          img.style.background = 'transparent'
        });
      }
      youvidcontentsswitch = []
    }
  })
}

var youvidaddcategoryindex = null
var youvidcontentsswitch = []
// youvid 카테고리에 콘텐트의 카테고리 이동
function youvidcontentPlusClickEventHandler(event) {
  var element = event.target
  var category = element.closest('.category')
  youvidaddcategoryindex = Array.from(category.parentNode.children).indexOf(category)
  var target = category.querySelector('.itemContainer')
  chrome.storage.local.get(["mark_youvid", "mark_youvid_setting"], function (result) {
    mark_youvid = result['mark_youvid']
    mark_youvid_setting = result['mark_youvid_setting']
    for (let i of youvidcontentsswitch) {
      target.appendChild(i[1])
      idx = mark_youvid.indexOf(i[1].querySelector('a.card').dataset.id)
      mark_youvid_setting[idx] = categoryIndexToString(youvidaddcategoryindex) + itemIndexToString(target.children.length)
      chrome.storage.local.set({ mark_youvid_setting: mark_youvid_setting })
    }
    youvidcontentsswitch = []
  })
  const btnsSeleted = document.querySelectorAll('.btnSeleteditemImg');
  btnsSeleted.forEach(img => {
    img.src = 'icons/check_box_black.png'
    img.style.background = 'transparent'
  });
}

// youvid 콘텐트 
function youvidSeleteditemClickEventHandler(event) {
  var element = event.target
  var content = element.closest('.cardWrapper')
  var addcontentindex = Array.from(content.parentNode.children).indexOf(content)

  console.log(content)

  if (youvidflag === false) {
    youvidcontentsswitch.push([addcontentindex, content])
    console.log(youvidcontentsswitch)
    element.src = 'icons/checked_box_black.png'
    element.style.background = '#fff'

  } else {
    youvidcontentsswitch.push([addcontentindex, content])
    element.src = 'icons/checked_box_black.png'
    element.style.background = '#fff'
    youvidswitchcontentsincategory()
  }
}


var youvidselectedCategory = null
var youvidclickedcategory = []

// youvid 카테고리 순서 변경
function youvidSeletedClickEventHandler(event) {
  const element = event.target;
  const category = element.closest('.category')
  const categoryIndex = Array.from(category.parentNode.children).indexOf(category);
  youvidclickedcategory.push([categoryIndex, category])

  element.style.background = '#c6c6c6'
  console.log(youvidclickedcategory)
  console.log(youvidclickedcategory.length)

  if (youvidclickedcategory.length === 2) {
    const btnsSeleted = document.querySelectorAll('.btnSeletedImg');

    btnsSeleted.forEach(img => {
      img.style.background = 'transparent'
    });
  }

  youvidcheckClicked()
}

function youvidcheckClicked() {
  chrome.storage.local.get(['mark_youvid', 'mark_youvid_setting'], function (result) {
    if (youvidclickedcategory.length === 2) {
      index1 = youvidclickedcategory[0][0]
      index2 = youvidclickedcategory[1][0]

      parent = youvidclickedcategory[1][1].parentNode

      if (index1 !== index2) {
        if (index1 < index2) {
          parent.insertBefore(youvidclickedcategory[0][1], parent.children[index2]);
          parent.insertBefore(youvidclickedcategory[1][1], parent.children[index1]);

        } else {
          parent.insertBefore(youvidclickedcategory[1][1], parent.children[index1]);
          parent.insertBefore(youvidclickedcategory[0][1], parent.children[index2]);
        }

        cards1 = youvidclickedcategory[0][1].getElementsByClassName('card')
        cards2 = youvidclickedcategory[1][1].getElementsByClassName('card')
        for (c of cards1) {
          console.log(result.mark_youvid)
          idx = result.mark_youvid.indexOf(c.dataset.id)
          result.mark_youvid_setting[idx] = categoryIndexToString(index2) + result.mark_youvid_setting[idx].slice(2,)
        }
        for (c of cards2) {
          idx = result.mark_youvid.indexOf(c.dataset.id)
          result.mark_youvid_setting[idx] = categoryIndexToString(index1) + result.mark_youvid_setting[idx].slice(2,)
        }
        chrome.storage.local.set({ mark_youvid_setting: result.mark_youvid_setting })
      }
      youvidclickedcategory = []
    }
  })
}

// youvid 분류 카테고리 내용 입력 칸 생성 
const addYouvidCategoryBtn = document.querySelector('#addYouvidCategoryBtn');

addYouvidCategoryBtn.addEventListener('click', (event) => {
  const inputcontainer = document.querySelector('.input-container')
  if (inputcontainer === null) {

    element = event.target
    console.log("category add button click");
    var inputContainer = document.createElement('div');
    inputContainer.className = "input-container";

    var input = document.createElement('input');
    input.id = "input";
    input.placeholder = "카테고리 이름을 입력하세요";

    var addbutton = document.createElement('button');
    addbutton.id = 'add-button';
    addbutton.textContent = "추가";

    inputContainer.appendChild(input);
    inputContainer.appendChild(addbutton);

    addbutton.addEventListener('click', () => {
      chrome.storage.local.get(['user_setting'], function (result) {
        user_setting = result['user_setting']

        const input = document.querySelector('#input');
        const text = input.value.trim();

        if (text !== '') {
          user_setting[2].setting.push(text)
          chrome.storage.local.set({ user_setting: user_setting })
          console.log(text)
          var target = document.querySelector('.youvidpage')
          // var target = category.querySelector('.youvidpage')
          var categoryDiv = document.createElement('div')
          categoryDiv.className = 'category'

          var categorysettingDiv = document.createElement('div')
          categorysettingDiv.className = 'categorysetting'

          var h2 = document.createElement('h2');
          h2.textContent = text;
          console.log(text)

          var btncategoryWrapper = document.createElement('div')
          btncategoryWrapper.className = 'btncategoryWrapper'

          const btncontentPlus = document.createElement('button')
          const btncontentPlusImg = document.createElement('img')
          btncontentPlus.addEventListener('click', youvidcontentPlusClickEventHandler)

          const btnSeleted = document.createElement('button')
          const btnSeletedImg = document.createElement('img')
          btnSeletedImg.className = 'btnSeletedImg'
          btnSeleted.addEventListener('click', youvidSeletedClickEventHandler)

          const btnSwitch = document.createElement('button')
          const btnSwitchImg = document.createElement('img')
          btnSwitch.addEventListener('click', youvidbtnSwitchClickEventHandler)

          const btncategoryDelete = document.createElement('button')
          const btncategoryDeleteImg = document.createElement('img')
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
          btnSeleted.appendChild(btnSeletedImg)
          btnSwitch.appendChild(btnSwitchImg)
          btncategoryDelete.appendChild(btncategoryDeleteImg)
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

          target.appendChild(categoryDiv)

        }
        inputContainer.remove();
      })
    });
    addYouvidCategoryBtn.insertAdjacentElement('beforebegin', inputContainer);
  }
});


/***************************************************************/

// streamer 카테고리 삭제
function streamerbtncategoryDeleteClickEventHandler(event) {
  c = event.target.closest('.category')
  a = c.querySelector('div.card')

  chrome.storage.local.get(['mark_streamer'], function (result) {
    mark_streamer = result['mark_streamer']
    idx = mark_streamer.indexOf(a.dataset.id)

    deleteStreamerItems(idx)
    deleteStreamerName(idx)
    deleteStreamerid(idx)
    deleteStreamerSetting(idx)
  })

  const cards = Array.from(document.querySelectorAll('a.card')).filter(item => true)
  console.log(cards)
  for (let card of cards) {
    if (card.dataset.type === a.dataset.type && card.dataset.id === a.dataset.id) {
      card.closest('.cardWrapper').remove()
    }
  }
  c.remove()
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}