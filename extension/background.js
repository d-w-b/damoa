//CONST

const serverURL = "http://ceprj.gachon.ac.kr:60002"
const hostnames = ['www.netflix.com', 'www.disneyplus.com', 'watcha.com', 'www.wavve.com', 'www.youtube.com', 'www.twitch.tv']
const pathnames = ['/browse', '/watch', '/results', '/contents', '/ko-kr']
const searchnames = ['?jbv', 'trackId']

//function
function parseUrlToStatus(url) {
  //hostcode
  hostcode = hostnames.indexOf(url.hostname) + 1
  //pathcode
  pathcode = pathnames.indexOf('/' + url.pathname.split('/')[1]) + 1
  //searchcode
  searchcode = searchnames.indexOf(url.search.split('=')[0]) + 1
  return hostcode.toString() + pathcode.toString() + searchcode.toString()
}


// async function gAuth(token) {
//   const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo?access_token="+token);
//   const jsonData = await response.json();
//   return jsonData
// }


/******************************************************************** */

/**** onInstalled 이벤트 리스너 ****/
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ mark_youvid: [] }),
  chrome.storage.local.set({ mark_ott: [] }),
  chrome.storage.local.set({ mark_channel: [] }),
  chrome.storage.local.set({ mark_streamer: [] }),
  chrome.storage.local.set({ login_status: false });
  chrome.storage.local.set({ id: '' });
  chrome.storage.local.set({ google_email: "rlwlstjr@gachon.ac.kr" });
});

/**** storage.onChanged 이벤트 리스너 ****/

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];

    console.log('Storage key "%s" in namespace "%s" changed. ' +
      'Old value was "%s", new value is "%s".',
      key,
      namespace,
      storageChange.oldValue,
      storageChange.newValue);

    if (key.includes('mark')) {
      chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, 'refresh');
        });
      });
    }

    // fetch data to server
    switch (key) {
      // 사용자 설정 변경사항 전송
      case "user_setting":
        chrome.storage.local.get(['user_setting', 'id', 'google_email'], function (result) {

          console.log(result["user_setting"])
          data = {}
          data.useSet = result["user_setting"]
          data.email = result['id'] + '@gmail.com'
          console.log(data)

          fetch(serverURL + "/userinfo/" + result['id'], {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
          }).then((response) => {
            console.log(response)
          });
        })
        break

      // 유튜브 영상 변경사항 전송
      case "mark_youvid":
      case "mark_youvid_setting":
        chrome.storage.local.get(['mark_youvid', 'mark_youvid_setting', 'id'], function (result) {
          mark_youvid = result['mark_youvid'],
            mark_youvid_setting = result['mark_youvid_setting']
          id = result['id']

          data = {
            id: id,
            vidList: mark_youvid,
            settingList: mark_youvid_setting,
          }
          console.log(data)
          fetch(serverURL + "/mark/youvid/" + id, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
          }).then((response) => {
            console.log("mark_youvid response, " + response)
          });
        })
        break;



      // 유튜브 채널 알림 변경사항 전송
      case "mark_channel":
      //case "mark_channel_setting":
        chrome.storage.local.get(['mark_channel', 'mark_channel_setting', 'mark_channel_name', 'mark_channel_img', 'id'], function (result) {
          mark_channel = result['mark_channel'],
          mark_channel_img = result['mark_channel_img']
          mark_channel_setting = result['mark_channel_setting']
          mark_channel_name = result['mark_channel_name']
          id = result['id']

          data = {
            id: id,
            cnameList: mark_channel_name,
            imgList: mark_channel_img,
            cidList: mark_channel,
            settingList: mark_channel_setting
          }

          console.log(data)
          fetch(serverURL + "/mark/channel/" + id, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
          }).then((response) => {
            console.log(response)
          });
        })
        break;

      // OTT 콘텐트 변경사항 전송
      case "mark_ott":
      case "mark_ott_setting":
        chrome.storage.local.get(['mark_ott', 'mark_ott_type', 'mark_ott_setting', 'mark_ott_img', 'mark_ott_url', 'mark_ott_title', 'id'], function (result) {
          mark_ott = result['mark_ott'],
            mark_ott_setting = result['mark_ott_setting']
          mark_ott_img = result['mark_ott_img']
          mark_ott_type = result['mark_ott_type']
          mark_ott_url = result['mark_ott_url']
          mark_ott_title = result['mark_ott_title']
          id = result['id']

          data = {
            id: id,
            ottidList: mark_ott,
            settingList: mark_ott_setting,
            imgList: mark_ott_img,
            typeList: mark_ott_type,
            urlList: mark_ott_url,
            titleList: mark_ott_title
          }
          console.log(data)

          fetch(serverURL + "/mark/ott/" + id, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
          }).then((response) => {
            console.log("mark_ott fetch")
            console.log(response)
          });
        })
        break;

      // 스트리머 알림 변경 사항 전송
      case "mark_streamer":
      case "mark_streamer_setting":
        chrome.storage.local.get(['mark_streamer_name', 'mark_streamer', 'mark_streamer_setting', 'id'], function (result) {
          mark_streamer_name = result['mark_streamer_name']
          mark_streamer = result['mark_streamer']
          mark_streamer_setting = result['mark_streamer_setting']
          id = result['id']

          data = {
            id: id,
            titleList: mark_streamer_name,
            settingList: mark_streamer_setting,
            idList: mark_streamer,
          }

          fetch(serverURL + "/mark/streamer/" + id, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
          }).then((response) => {
            console.log("mark_streamer response, " + response)
          });
        })
    }
  }
});

/**** onUpdated 이벤트 리스너 ****/
chrome.tabs.onUpdated.addListener(
  function (tabId, changeInfo, tab) {
    statuscode = parseUrlToStatus(new URL(tab.url))
    let id = tabId
    let url = new URL(tab.url)
    console.log(statuscode, tabId, changeInfo, tab)

    if (changeInfo.status == "complete" && hostnames.includes(url.hostname)) {
      //history
      console.log("url : ", url)
      /*
      chrome.storage.local.get(['history'], function(result){
        history = result['history']
        history.push(url.href)
        console.log(history)
        chrome.storage.local.set({history : history})
      })
      */
    }

    if (changeInfo.status == "complete") {
      switch (statuscode) {
        case "110":
          chrome.scripting.executeScript({
            target: { tabId: id },
            files: ["contentscripts/netflixOnBrowse.js"]
          })
          break

        case "111":
          chrome.scripting.executeScript({
            target: { tabId: id },
            files: ["contentscripts/netflixOnBrowsejbv.js"]
          })
          break

        case "250":
          chrome.scripting.executeScript({
            target: { tabId: id },
            files: ["contentscripts/disneyOnBrowse.js"]
          })
          break

        case "310":
          chrome.scripting.executeScript({
            target: { tabId: id },
            files: ["contentscripts/watchaOnBrowse.js"]
          })
          break

        case "340":
          chrome.scripting.executeScript({
            target: { tabId: id },
            files: ["contentscripts/watchaOnContents.js"]
          })
          break

        case "400":
          chrome.scripting.executeScript({
            target: { tabId: id },
            files: ["contentscripts/wavveOnBrowse.js"]
          })
          break

        case "500":
          chrome.scripting.executeScript({
            target: { tabId: id },
            files: ["contentscripts/youtubeOnBrowse.js"]
          })
          break

        case "520":
          chrome.scripting.executeScript({
            target: { tabId: id },
            files: ["contentscripts/youtubeOnWatch.js"]
          })
          chrome.tabs.sendMessage(id, 'refresh');

          break

        case "530":
          chrome.scripting.executeScript({
            target: { tabId: id },
            files: ["contentscripts/youtubeOnResults.js"]
          })
          break;

        case "600":
          chrome.scripting.executeScript({
            target: { tabId: id },
            files: ["contentscripts/twitchOnBrowse.js"]
          })
          break;
      }
    }
  }
);

/**** onStartup 이벤트 리스너 ****/
chrome.runtime.onStartup.addListener(
  function () {
    console.log('Start!')
    chrome.storage.local.get(['id'], function (result) {
      id = result["id"]
      if (id) {
        // 로그인 기능 만들고 나서는 이 부분에서 fetch login 삭제,  fetch mark는 그대로. , popup.js 에서도 이부분 실행
        fetch(serverURL + "/login", {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "userid": id,
            "password": "test"
          })
        }).then(res => {
          return res.json()
        }).then(res => {
          if (res.result_code === 200 || res.result_req === "already logged in") { // 로그인 성공 시에 수행
            fetch(serverURL + "/mark/" + id, {
              method: 'GET',
            }).then(res => {
              return res.json()
            }).then(res => {

              if (res.result.marked_channel.channelID.length) {
                // mark_channel
                mark_channel = res.result.marked_channel.channelID.split("|")
                mark_channel_setting = res.result.marked_channel.groupSet.split("|")
                mark_channel_img = res.result.marked_channel.img.split("|")
                mark_channel_name = res.result.marked_channel.title.split("|")
                mark_channel_items = res.result.marked_channel.items

                chrome.storage.local.set({
                  mark_channel: mark_channel,
                  mark_channel_setting: mark_channel_setting,
                  mark_channel_img: mark_channel_img,
                  mark_channel_name: mark_channel_name,
                  mark_channel_items: mark_channel_items
                })
              }

              if (res.result.marked_youvid.vID.length) {
                // mark_youvid
                mark_youvid = res.result.marked_youvid.vID.split("|")
                mark_youvid_setting = res.result.marked_youvid.groupSet.split("|")
                mark_youvid_items = res.result.marked_youvid.snnipet
                
                chrome.storage.local.set({
                  mark_youvid: mark_youvid,
                  mark_youvid_setting: mark_youvid_setting,
                  mark_youvid_items: mark_youvid_items
                })
              }

              if (res.result.marked_ott.ottID.length) {
                // mark_ott
                mark_ott = res.result.marked_ott.ottID.split("|")
                mark_ott_setting = res.result.marked_ott.groupSet.split("|")
                mark_ott_title = res.result.marked_ott.title.split("|")
                mark_ott_img = res.result.marked_ott.img.split("|")
                mark_ott_url = res.result.marked_ott.url.split("|")
                mark_ott_genre = res.result.marked_ott.genre.split('|')
                mark_ott_type = res.result.marked_ott.type.split("|")

                //mark_ott_type = res.result[2].marked_ott[0].type
                chrome.storage.local.set({
                  mark_ott: mark_ott,
                  mark_ott_setting: mark_ott_setting,
                  mark_ott_title: mark_ott_title,
                  mark_ott_img: mark_ott_img,
                  mark_ott_url: mark_ott_url,
                  mark_ott_genre: mark_ott_genre,
                  mark_ott_type: mark_ott_type
                })
              }

              if (res.result.marked_streamer.streamerID.length) {
                // mark_streamer
                mark_streamer = dense(res.result.marked_streamer.streamerID.split("|"))
                mark_streamer_name = dense(res.result.marked_streamer.title.split("|"))
                mark_streamer_setting = dense(res.result.marked_streamer.groupSet.split("|"))
                mark_streamer_items = []
                for (i of mark_streamer) {

                  fetch("https://api.twitch.tv/helix/streams?user_id=" + i, {
                    headers: {
                      "client-id": "avpot9bsjk3bf4s087ajyyey1qfpw0",
                      "Authorization": "Bearer lhs2ryedpf2bvhmmdd8s2077g34o39"
                    },
                    method: 'GET',
                  }).then(res => {
                    return res.json()
                  }).then(res => {
                    mark_streamer_items.push(res.data[0])
                    chrome.storage.local.set({ mark_streamer_items: mark_streamer_items })
                    console.log(mark_streamer_items)
                  })
                }

                chrome.storage.local.set({
                  mark_streamer: mark_streamer,
                  mark_streamer_setting: mark_streamer_setting,
                  mark_streamer_name: mark_streamer_name,
                })
              }
            })
          }
        })
      }
    })
  }
)

/**** onMessage 이벤트 리스너 ****/
chrome.runtime.onMessage.addListener(function (message, sender, senderResponse) {

  switch (message.type) {
    case "postLogin":
      fetch(serverURL + "/login", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message.data)
      }).then(res => {
        return res.json()
      }).then(res => {
        senderResponse(res);
      })
      break

    case "postUserInfo":
      fetch(serverURL + "/userinfo/" + message.data, {
        method: 'POST',
      }).then(res => {
        return res.json()
      }).then(res => {
        senderResponse(res);
      })
      break

    case "getUserInfo":
      fetch(serverURL + "/userinfo/" + message.data, {
        method: 'GET',
      }).then(res => {
        return res.json()
      }).then(res => {
        senderResponse(res);
        console.log(res)
      })
      break

    case "getUserMark":
      chrome.storage.local.get(['id'], function (result) {
        id = result['id']
        console.log('GET ' + id + " Mark List ")
        fetch(serverURL + "/mark/" + id, {
          method: 'GET',
        }).then(res => {
          return res.json()
        }).then(res => {
          senderResponse(res);
        })
      })
      break

    case "fetchTwitchID":
      fetch("https://api.twitch.tv/helix/streams?user_id=" + message.data, {
        headers: {
          "client-id": "avpot9bsjk3bf4s087ajyyey1qfpw0",
          "Authorization": "Bearer lhs2ryedpf2bvhmmdd8s2077g34o39"
        },
        method: 'GET',
      }).then(res => {
        return res.json()
      }).then(res => {
        senderResponse(res);
      })
      break


    case "fetchDisplayName":
      fetch("https://api.twitch.tv/helix/search/channels?first=100&query=" + message.data, {
        headers: {
          "client-id": "avpot9bsjk3bf4s087ajyyey1qfpw0",
          "Authorization": "Bearer lhs2ryedpf2bvhmmdd8s2077g34o39"
        },
        method: 'GET',
      }).then(res => {
        return res.json()
      }).then(res => {
        senderResponse(res);
      })
      break

    case "getChannelPage":
      fetch("https://www.youtube.com/@" + message.data, {
        method: 'GET',
      }).then(res => {
        return res.text()
      }).then(res => {
        console.log(res)
        senderResponse(res);
      })
      break

    case "getChannelPage_":
      fetch("https://www.youtube.com/channel/" + message.data, {
        method: 'GET',
      }).then(res => {
        return res.text()
      }).then(res => {
        console.log(res)
        senderResponse(res);
      })
      break

    // case "getChannelInfo":
    //   fetch("https://www.googleapis.com/youtube/v3/search?part=id,snippet&order=date&type=video&key=" + APIKEY + "&channelId=" + message.data, {
    //     method: 'GET',
    //   }).then(res => {
    //     return res.json()
    //   }).then(res => {
    //     console.log(res)
    //     senderResponse(res);
    //   })
    //   break

    // case "getYouVid":
    //   fetch("https://www.googleapis.com/youtube/v3/videos?fields=items(snippet(title,tags,thumbnails,publishedAt))&part=snippet&key=" + APIKEY + "&id=" + message.data, {
    //     method: 'GET',
    //   }).then(res => {
    //     return res.json()
    //   }).then(res => {
    //     senderResponse(res);
    //   })
    //   break
  }
  return true
});

