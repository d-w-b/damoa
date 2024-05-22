const ID_PATTERN = new RegExp("\"externalId\":\".*\",")
console.log("common.js")

/** 공통 함수 및 변수 **/

// containers list
netflixContainersList = []; 
disneyContainersList = [];
disneyDetailContainersList = [];
twitchContainersList = [];
watchaContainersList = []; 
wavveContainersList = [];
disneyContainersList = [];
youtubeContainersList = [];
youtubeResultContainersList = [];  
youtubeWatchContainersList = [];
youtubeRefreshContainersList = [];
youtubeErrList = []
youtubeShortsContainers = []
youtubeMixContainers = []

//함수 정의
/************************************************************************************************/


function waitForElement(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }
  
      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        subtree: true,
        childList: true,
      });
    });
}

function waitForHref(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector).href) {
        return resolve(document.querySelector(selector).href);
      }
  
      const observer = new MutationObserver(() => {
        if (document.querySelector(selector).href) {
          resolve(document.querySelector(selector).href);
          observer.disconnect();
        }
      });
       
      observer.observe(document.body, {
        subtree: true,
        childList: true,
      });
    });
}

/***********************************************************************************/
/*** OTT Local Storage  Add/Delete ***/
function addOTTMarked(ottid){
    chrome.storage.local.get(['mark_ott'], function(result){
        mark_ott = result['mark_ott']
        mark_ott.push(ottid)
        chrome.storage.local.set({mark_ott : mark_ott})
    })
}

function deleteOTTMarked(index){
    chrome.storage.local.get(['mark_ott'], function(result){
        mark_ott = result['mark_ott']
        mark_ott.splice(index,1)
        chrome.storage.local.set({mark_ott : mark_ott})
    })
}

function addOTTType(type){
    chrome.storage.local.get(['mark_ott_type'], function(result){
        mark_ott_type = result['mark_ott_type']
        mark_ott_type.push(type)
        chrome.storage.local.set({mark_ott_type : mark_ott_type})
    })
}

function deleteOTTType(index){
    chrome.storage.local.get(['mark_ott_type'], function(result){
        mark_ott_type = result['mark_ott_type']
        mark_ott_type.splice(index,1)
        chrome.storage.local.set({mark_ott_type : mark_ott_type})
    })
}

function addOTTImg(img){
    chrome.storage.local.get(['mark_ott_img'], function(result){
        mark_ott_img = result['mark_ott_img']
        mark_ott_img.push(img)
        chrome.storage.local.set({mark_ott_img : mark_ott_img})
    })
}

function deleteOTTImg(index){
    chrome.storage.local.get(['mark_ott_img'], function(result){
        mark_ott_img = result['mark_ott_img']
        mark_ott_img.splice(index,1)
        chrome.storage.local.set({mark_ott_img : mark_ott_img})
    })
}

function addOTTUrl(url){
    chrome.storage.local.get(['mark_ott_url'], function(result){
        mark_ott_url = result['mark_ott_url']
        mark_ott_url.push(url)
        chrome.storage.local.set({mark_ott_url : mark_ott_url})
    })
}

function deleteOTTUrl(index){
    chrome.storage.local.get(['mark_ott_url'], function(result){
        mark_ott_url = result['mark_ott_url']
        mark_ott_url.splice(index,1)
        chrome.storage.local.set({mark_ott_url : mark_ott_url})
    })
}

function addOTTTitle(title){
    chrome.storage.local.get(['mark_ott_title'], function(result){
        mark_ott_title = result['mark_ott_title']
        mark_ott_title.push(title)
        chrome.storage.local.set({mark_ott_title : mark_ott_title})
    })
}

function deleteOTTTitle(index){
    chrome.storage.local.get(['mark_ott_title'], function(result){
        mark_ott_title = result['mark_ott_title']
        mark_ott_title.splice(index,1)
        chrome.storage.local.set({mark_ott_title : mark_ott_title})
    })
}

function addOTTSetting(setting){
    chrome.storage.local.get(['mark_ott_setting'], function(result){
        mark_ott_setting = result['mark_ott_setting']
        mark_ott_setting.push(setting)
        chrome.storage.local.set({mark_ott_setting : mark_ott_setting})
    })
}

function deleteOTTSetting(index){
    chrome.storage.local.get(['mark_ott_setting'], function(result){
        mark_ott_setting = result['mark_ott_setting']
        mark_ott_setting.splice(index,1)
        chrome.storage.local.set({mark_ott_setting : mark_ott_setting})
    })
}
/************************************************************************************************/
/*** Youtube video Local Storage  Add/Delete ***/

function addYouvidMarked(youvidid){
    chrome.storage.local.get(['mark_youvid'], function(result){
        mark_youvid = result['mark_youvid']
        mark_youvid.push(youvidid)
        chrome.storage.local.set({mark_youvid : mark_youvid})
    })

    chrome.runtime.sendMessage({ type: 'getYouVid', data : vid }, response => {
        item = response.items[0].snippet
        console.log(response)
        addYouvidItems(item)
    })
}

function deleteYouvidMarked(index){
    chrome.storage.local.get(['mark_youvid'], function(result){
        mark_youvid = result['mark_youvid']
        mark_youvid.splice(index,1)
        chrome.storage.local.set({mark_youvid : mark_youvid})
    })
}

function addYouvidItems(item){
    chrome.storage.local.get(['mark_youvid_items'], function(result){
        mark_youvid_items = result['mark_youvid_items']
        mark_youvid_items.push(item)
        chrome.storage.local.set({mark_youvid_items : mark_youvid_items})
    })
}

function deleteYouvidItems(index){
    chrome.storage.local.get(['mark_youvid_items'], function(result){
        mark_youvid_items = result['mark_youvid_items']
        mark_youvid_items.splice(index,1)
        chrome.storage.local.set({mark_youvid_items : mark_youvid_items})
    })
}

function addYouvidSetting(setting){
    chrome.storage.local.get(['mark_youvid_setting'], function(result){
        mark_youvid_setting = result['mark_youvid_setting']
        mark_youvid_setting.push(setting)
        chrome.storage.local.set({mark_youvid_setting : mark_youvid_setting})
    })
}

function deleteYouvidSetting(index){
    chrome.storage.local.get(['mark_youvid_setting'], function(result){
        mark_youvid_setting = result['mark_youvid_setting']
        mark_youvid_setting.splice(index,1)
        chrome.storage.local.set({mark_youvid_setting : mark_youvid_setting})
    })
}
/************************************************************************************************/
/*** YoutubeChannel Local Storage  Add/Delete ***/
function addChannelMarked(channelid){
    chrome.storage.local.get(['mark_channel'], function(result){
        mark_channel = result['mark_channel']
        mark_channel.push(channelid)

        // chrome.runtime.sendMessage({ type: 'getChannelInfo', data : channelid }, response => {
        //     if(response.items){
        //         items = response.items
        //         chrome.storage.local.get(['mark_channel_items'], function(result){
        //             mark_channel_items = result['mark_channel_items']
        //             mark_channel_items.push(items)
        //             console.log(mark_channel_items)
        //             chrome.storage.local.set({mark_channel_items : mark_channel_items})
        //             mark_channel.push(channelid)
        //             console.log(mark_channel)
        //             chrome.storage.local.set({mark_channel : mark_channel}, function(){
        //                 console.log(mark_channel)
        //             })
        //         })
        //     }else{
        //         console.log(response.error)
        //         deleteChannelName(idx)
        //         deleteChannelImg(idx)
        //         deleteChannelSetting(idx)
        //     }
        // })

        chrome.storage.local.set({ mark_channel : mark_channel});
    })
}

function deleteChannelMarked(index){
    // channel id 삭제
    chrome.storage.local.get(['mark_channel'], function(result){
        mark_channel = result['mark_channel']
        mark_channel.splice(index,1)
        chrome.storage.local.set({mark_channel : mark_channel})
    })

    // channel items 삭제
    // chrome.storage.local.get(['mark_channel_items'], function(result){
    //     mark_channel_items = result['mark_channel_items']
    //     mark_channel_items.splice(index,1)
    //     chrome.storage.local.set({mark_channel_items : mark_channel_items})
    // })
}

function addChannelImg(img){
    chrome.storage.local.get(['mark_channel_img'], function(result){
        mark_channel_img = result['mark_channel_img']
        mark_channel_img.push(img)
        chrome.storage.local.set({mark_channel_img : mark_channel_img})
    })
}

function deleteChannelImg(index){
    chrome.storage.local.get(['mark_channel_img'], function(result){
        mark_channel_img = result['mark_channel_img']
        mark_channel_img.splice(index,1)
        chrome.storage.local.set({mark_channel_img : mark_channel_img})
    })

}

function addChannelName(channelName){
    chrome.storage.local.get(['mark_channel_name'], function(result){
        mark_channel_name = result['mark_channel_name']
        mark_channel_name.push(channelName)
        chrome.storage.local.set({mark_channel_name : mark_channel_name})
    })
}

function deleteChannelName(index){
    chrome.storage.local.get(['mark_channel_name'], function(result){
        mark_channel_name = result['mark_channel_name']
        mark_channel_name.splice(index,1)
        chrome.storage.local.set({mark_channel_name : mark_channel_name})
    })
}

function addChannelSetting(setting){
    chrome.storage.local.get(['mark_channel_setting'], function(result){
        mark_channel_setting = result['mark_channel_setting']
        mark_channel_setting.push(setting)
        chrome.storage.local.set({mark_channel_setting : mark_channel_setting})
    })
}

function deleteChannelSetting(index){
    chrome.storage.local.get(['mark_channel_setting'], function(result){
        mark_channel_setting = result['mark_channel_setting']
        mark_channel_setting.splice(index,1)
        chrome.storage.local.set({mark_channel_setting : mark_channel_setting})
    })  
}


/************************************************************************************************/
/*** Twitch Streamer Loacl Storage Add/Delete ***/
function addStreamerMarked(broadcaster_login, display_name){
    chrome.storage.local.get(['mark_streamer_name'], function(result){
        mark_streamer_name = result['mark_streamer_name']
        mark_streamer_name.push(display_name)
        if( display_name.includes('(')){ display_name = display_name.split(' ')[0] }
        
        chrome.storage.local.set({mark_streamer_name : mark_streamer_name})

        chrome.runtime.sendMessage({ type: 'fetchDisplayName', data : broadcaster_login }, response => {
           
            searchList = response.data
            console.log(searchList, display_name)
            match = undefined
            for (item of searchList){
                if (item.display_name === display_name){
                    match = item.id
                }
            }
            if(match){
                console.log(match)
                addStreamerid(match)
            }
        })
    })
}

function deleteStreamerName(index){
    chrome.storage.local.get(['mark_streamer_name'], function(result){
        mark_streamer_name = result['mark_streamer_name']
        mark_streamer_name.splice(index,1)
        chrome.storage.local.set({mark_streamer_name : mark_streamer_name})
    })  
}

function addStreamerid(id){
    chrome.storage.local.get(['mark_streamer'], function(result){
        mark_streamer = result['mark_streamer']
        mark_streamer.push(id)
        addStreamerItems(id)
        chrome.storage.local.set({mark_streamer : mark_streamer})
    })
}

function deleteStreamerid(index){
    chrome.storage.local.get(['mark_streamer'], function(result){
        mark_streamer = result['mark_streamer']
        mark_streamer.splice(index,1)
        chrome.storage.local.set({mark_streamer : mark_streamer})
    })  
}

function addStreamerItems(streamerid){
    chrome.storage.local.get(['mark_streamer_items'], function(result){
        mark_streamer_items = result['mark_streamer_items']
        chrome.runtime.sendMessage({ type: 'fetchTwitchID', data : streamerid }, response => {
            mark_streamer_items.push(response.data[0])
            chrome.storage.local.set({mark_streamer_items : mark_streamer_items})
        })
    })
}

function updateStreamerItems(index){
    chrome.storage.local.get(['mark_streamer_items'], function(result){
        mark_streamer_items = result['mark_streamer_items']
        chrome.runtime.sendMessage({ type: 'fetchTwitchID', data : id }, response => {
            mark_streamer_items[index] = response.data[0]
        })
        chrome.storage.local.set({mark_streamer_items : mark_streamer_items})
    })
}

function deleteStreamerItems(index){
    chrome.storage.local.get(['mark_streamer_items'], function(result){
        mark_streamer_items = result['mark_streamer_items']
        mark_streamer_items.splice(index,1)
        chrome.storage.local.set({mark_streamer_items : mark_streamer_items})
    })  
}

function addStreamerSetting(setting){
    chrome.storage.local.get(['mark_streamer_setting'], function(result){
        mark_streamer_setting = result['mark_streamer_setting']
        mark_streamer_setting.push(setting)
        chrome.storage.local.set({mark_streamer_setting : mark_streamer_setting})
    })
}

function deleteStreamerSetting(index){
    chrome.storage.local.get(['mark_streamer_setting'], function(result){
        mark_streamer_setting = result['mark_streamer_setting']
        mark_streamer_setting.splice(index,1)
        chrome.storage.local.set({mark_streamer_setting : mark_streamer_setting})
    })  
}

/************************************************************************************************/
// type 은 정수 ( 0 : OTT, 1: YoutubeChannel , 2: YoutubeVideo , 3: Streamer)
function addCategory(type, categoryName){
    chrome.storage.local.get(['user_setting'], function(result){
        user_setting = result['user_setting']
        user_setting[type].setting.push(categoryName)
        chrome.storage.local.set({user_setting : user_setting})
    })
}

function deleteCategory(type, index){
    chrome.storage.local.get(['user_setting'], function(result){
        user_setting = result['user_setting']
        user_setting[type].setting.splice(index, 1)
        chrome.storage.local.set({user_setting : user_setting})
    })
}

function switchCategory(type, index1, index2){
    chrome.storage.local.get(['user_setting'], function(result){
        user_setting = result['user_setting']
        temp = user_setting[type].setting[index1]
        user_setting[type].setting[index1] = user_setting[type].setting[index2]
        user_setting[type].setting[index2] = temp
        chrome.storage.local.set({user_setting : user_setting})
    })
}

function switchItem(type, pos1, pos2){
    if( pos1 !== pos2 ){
        switch(type){
            case 0:
                chrome.local.storage.get(['mark_ott_setting'], function(result){
                    mark_ott_setting = result['mark_ott_setting']
                    idx1 = mark_ott_setting.indexOf(pos1)
                    idx2 = mark_ott_setting.indexOf(pos2)
                    temp = mark_ott_setting[idx1] 
                    mark_ott_setting[idx1] = mark_ott_setting[idx2] 
                    mark_ott_setting[idx2] = temp

                    chrome.storage.local.set({mark_ott_setting : mark_ott_setting})
                })
            break

            case 1:
                chrome.local.storage.get(['mark_channel_setting'], function(result){
                    mark_channel_setting = result['mark_channel_setting']
                    idx1 = mark_channel_setting.indexOf(pos1)
                    idx2 = mark_channel_setting.indexOf(pos2)
                    temp = mark_channel_setting[idx1] 
                    mark_channel_setting[idx1] = mark_channel_setting[idx2] 
                    mark_channel_setting[idx2] = temp

                    chrome.storage.local.set({mark_channel_setting : mark_channel_setting})
                })
            break

            case 2:
                chrome.local.storage.get(['mark_youvid_setting'], function(result){
                    mark_youvid_setting = result['mark_youvid_setting']
                    idx1 = mark_youvid_setting.indexOf(pos1)
                    idx2 = mark_youvid_setting.indexOf(pos2)
                    temp = mark_youvid_setting[idx1] 
                    mark_youvid_setting[idx1] = mark_youvid_setting[idx2] 
                    mark_youvid_setting[idx2] = temp

                    chrome.storage.local.set({mark_youvid_setting : mark_youvid_setting})
                })
            break

            case 3:
                chrome.local.storage.get(['mark_streamer_setting'], function(result){
                    mark_streamer_setting = result['mark_streamer_setting']
                    idx1 = mark_streamer_setting.indexOf(pos1)
                    idx2 = mark_streamer_setting.indexOf(pos2)
                    temp = mark_streamer_setting[idx1] 
                    mark_streamer_setting[idx1] = mark_streamer_setting[idx2] 
                    mark_streamer_setting[idx2] = temp

                    chrome.storage.local.set({mark_streamer_setting : mark_streamer_setting})
                })
            break
        }
    }
}
/************************************************************************************************/