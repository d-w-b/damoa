pw = document.getElementById('password')
console.log(pw)

pw.onkeyup = function(e){
    if( e.keyCode == 13 ){
        login()
    }
}

function login(){

    const loginWindow = document.querySelector('.loginwindow');
    inputs = loginWindow.getElementsByClassName('text-input')
    userid = inputs[0].value
    password = inputs[1].value

    fetch(serverURL + "/login", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "userid": userid,
            "password": password
        })
    }).then(res => {
        return res.json()
    }).then(res => {
        console.log(res)
        if (res.result_code === 200 || res.result_req === "already logged in") {
            // 로그인 성공 시 처리
            console.log('로그인 성공')
            // 로그인 아이디 저장
            chrome.storage.local.set({ id: userid })

            //유저 세팅 데이터 가져오기
            fetch(serverURL + "/userinfo/" + userid, {
                method: 'GET',
            }).then(res => {
                return res.json()
            }).then(res => {
                console.log(res)
                chrome.storage.local.set({ user_setting: res.user_setting }, function () {
                    document.body.dispatchEvent(new Event('userinfoloaded'))
                });

                // 유저 관심 콘텐트 데이터 가져오기
                getUserDataFromServer(userid)
                // 홈 화면으로 넘어가기
                renderHome(userid)
            })

            

        } else {
            alert("!")
        }
    })
}


document.addEventListener('DOMContentLoaded', function () {
    console.log('init js')
    

    const btnLogin = document.getElementsByClassName('btn-login')[0];

    btnLogin.addEventListener('click', function (event) {
       
        //Login 시도
        login()
    })

    chrome.storage.local.get(['id'], function (result) {
        console.log(result['id'])
        if (result['id'] !== '') {
            //로그인된 상태

            //유저 세팅 데이터 가져오기
            fetch(serverURL + "/userinfo/" + result['id'], {
                method: 'GET',
            }).then(res => {
                return res.json()
            }).then(res => {
                console.log(res)
                chrome.storage.local.set({ user_setting: res.user_setting });
                document.body.dispatchEvent(new Event('userinfoloaded'))

                // 유저 관심 콘텐트 데이터 가져오기
                getUserDataFromServer(result['id'])
                // 홈 화면으로 넘어가기
                renderHome(result['id'])
            })
            
        } else {
            console.log("로그인 필요")
        }
    })
})

// 유저 데이터 받은 후에 구독 설정
// document.body.addEventListener('userinfoloaded', function () {
//     console.log('subscription')
//     chrome.storage.local.get(['user_setting'], function (result) {
//         let subscription = result['user_setting'][5].setting.split(',')
//         let btnSubscriptions = document.querySelectorAll('.platforms-wrapper > button')
//         for (i = 0; i < 4; i++) {
//             var element = btnSubscriptions[i]
//             if (subscription[i] === "true") {
//                 element.querySelector('img').style.opacity = 1
//             } else {
//                 element.querySelector('img').style.opacity = 0.4
//             }
//         }
//     })
// })


// 로그인 화면
document.body.onload = function () {
    const loginpage = document.querySelector('.loginWrapper')
    const tosignuppage = document.querySelector('.tosignupbutton')
    const tofindpasswordpage = document.querySelector('.tofindpasswordbutton')
    const tologinpage = document.querySelectorAll('.signupbutton')

    tologinpage.forEach(element => {
        element.addEventListener('click', (e) => {
            const l = document.querySelector('.login')
            loginpage.prepend(l)
        })

    });

    tosignuppage.addEventListener('click', (e) => {
        const signpage = document.querySelector('.signUp')
        loginpage.prepend(signpage)
    })

    tofindpasswordpage.addEventListener('click', (e) => {
        const passwordpage = document.querySelector('.findpassword')
        loginpage.prepend(passwordpage)
    })

    document.querySelector('.signupbutton').addEventListener('click', function (e) {
        li = e.target.closest('li')
        inputs = li.querySelectorAll('.text-input')
        userid = inputs[0].value
        pw = inputs[1].value

        fetch(serverURL + "/register", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "userid": userid,
                "password": pw,
                "email": userid + "@gachon.ac.kr"
            })
        }).then(res => {
            return res.json()
        }).then(res => {
            console.log(res)
        })
    })
}

// 마이페이지 버튼 이벤트
// for (btn of document.body.querySelectorAll('.platforms-wrapper > button')) {
//     btn.addEventListener('click', function (e) {

//         chrome.storage.local.get(['user_setting'], function (result) {
//             user_setting = result['user_setting']
//             subscription = user_setting[5].setting.split(',')
//             let idx = Array.from(e.target.closest('.platforms-wrapper').children).indexOf(e.target.closest('button'))
//             if (subscription[idx] === "true") {
//                 subscription[idx] = "false"
//                 e.target.style.opacity = "0.5"
//             } else {
//                 subscription[idx] = "true"
//                 e.target.style.opacity = "1"
//             }

//             user_setting[5].setting = subscription.join(',')
//             chrome.storage.local.set({ user_setting: user_setting })
//             console.log(user_setting)
//         })
//     })
// }

document.body.addEventListener('userinfoloaded', function () {
    console.log('화면 설정')
    //다크모드 버튼 이벤트
    const darkmodeBtn = document.querySelector('.darkmode__btn')
    darkmodeBtn.addEventListener('click', (event) => {
        if (document.body.dataset.theme === 'light-mode') {
            chrome.storage.local.get(['user_setting'], function (result) {
                if (result.user_setting) {
                    result.user_setting[4].type = "dark-mode";
                    result.user_setting[4].setting = 0
                    chrome.storage.local.set({ user_setting: result.user_setting });
                }
            });
            document.body.dataset.theme = 'dark-mode';

            const plusbtnImg = document.querySelectorAll('.btncontentPlusImg')
            for (let img of plusbtnImg) {
                console.log(img)
                img.src = 'icons/plus_white.png'
            }
            const switchbtnImg = document.querySelectorAll('.btnSwitchImg')
            for (let img of switchbtnImg) {
                img.src = 'icons/switch_white.png'
            }
            const autocategoryImg = document.querySelectorAll('.autocategory')
            for (let img of autocategoryImg) {
                img.src = 'icons/auto_white.png'
            }
            const seletedbtnImg = document.querySelectorAll('.btnSeletedImg')
            for (let img of seletedbtnImg) {
                img.src = 'icons/swap_white.png'
            }
            const categorydeletebtnImg = document.querySelectorAll('.btncategoryDeleteImg')
            for (let img of categorydeletebtnImg) {
                img.src = 'icons/delete_white.png'
            }
            const searchbtnImg = document.querySelectorAll('.btnsearchImg')
            for (let img of searchbtnImg) {
                img.src = 'icons/search_white.png'
            }
            const mypagebtnImg = document.querySelectorAll('.btnmypageImg')
            for (let img of mypagebtnImg) {
                img.src = 'icons/mypage_white.png'
            }
            const categoryplusImg = document.querySelectorAll('.categoryplusImg')
            for (let i of categoryplusImg) {
                i.src = 'icons/plus_white.png'
            }

        } else {
            chrome.storage.local.get(['user_setting'], function (result) {
                if (result.user_setting) {
                    result.user_setting[4].type = "light-mode";
                    result.user_setting[4].setting = 1
                    chrome.storage.local.set({ user_setting: result.user_setting });
                }
            });
            document.body.dataset.theme = 'light-mode';

            const plusbtnImg = document.querySelectorAll('.btncontentPlusImg')
            for (let img of plusbtnImg) {
                console.log(img)
                img.src = 'icons/plus_black.png'
            }
            const switchbtnImg = document.querySelectorAll('.btnSwitchImg')
            for (let img of switchbtnImg) {
                img.src = 'icons/switch_black.png'
            }
            const autocategoryImg = document.querySelectorAll('.autocategory')
            for (let img of autocategoryImg) {
                img.src = 'icons/auto_black.png'
            }
            const seletedbtnImg = document.querySelectorAll('.btnSeletedImg')
            for (let img of seletedbtnImg) {
                img.src = 'icons/swap_black.png'
            }
            const categorydeletebtnImg = document.querySelectorAll('.btncategoryDeleteImg')
            for (let img of categorydeletebtnImg) {
                img.src = 'icons/delete_black.png'
            }
            const searchbtnImg = document.querySelectorAll('.btnsearchImg')
            for (let img of searchbtnImg) {
                img.src = 'icons/search_black.png'
            }
            const mypagebtnImg = document.querySelectorAll('.btnmypageImg')
            for (let img of mypagebtnImg) {
                img.src = 'icons/mypage_black.png'
            }
            const categoryplusImg = document.querySelectorAll('.categoryplusImg')
            for (let i of categoryplusImg) {
                i.src = 'icons/plus_black.png'
            }
        }
    });


    chrome.storage.local.get(['user_setting'], function (result) {
        const thememode = result.user_setting[4].type
        if (thememode === 'light-mode') {
            document.body.dataset.theme = 'light-mode'
            const searchImg = document.querySelector('.btnsearchImg')
            searchImg.src = 'icons/search_black.png'
            const mypageImg = document.querySelector('.btnmypageImg')
            mypageImg.src = 'icons/mypage_black.png'
            const categoryplusImg = document.querySelectorAll('.categoryplusImg')
            for (let i of categoryplusImg) {
                i.src = 'icons/plus_black.png'
            }
        } else {
            document.body.dataset.theme = 'dark-mode'
            const searchImg = document.querySelector('.btnsearchImg')
            searchImg.src = 'icons/search_white.png'
            const mypageImg = document.querySelector('.btnmypageImg')
            mypageImg.src = 'icons/mypage_white.png'
            const categoryplusImg = document.querySelectorAll('.categoryplusImg')
            for (let i of categoryplusImg) {
                i.src = 'icons/plus_white.png'
            }
        }
    })
})

const helpbtn = document.querySelector('.help')

helpbtn.addEventListener('click', (event) => {
    const element = event.target
    const main = element.closest('.empty')

    if (main.querySelector('.help-wrapper')) {
        main.querySelector('.help-wrapper').remove();
    }
    else {
        const wrapper = document.createElement('div')
        wrapper.className = "help-wrapper"
        const helpbox = document.createElement('h2')
        // helpbox.text = `어서오세요, [앱 이름]!
        const helpText = document.createElement('p')
        helpText.innerHTML =
            `
            도움말<br><br>
            여러 콘텐트 플랫폼을 한 곳에서 효율적으로 관리할 수 있는 서비스를 제공합니다. <br>
            이제 여러 플랫폼을 이동하지 않고도 쉽게 콘텐트를 찾고 관리할 수 있습니다.<br><br>

            ■ 관심 콘텐트<br>
            <span class="small-text">관심 콘텐트를 한 눈에 확인할 수 있습니다.</span><br><br>
            
            ■ 다양한 플랫폼 연동<br>
            <span class="small-text">Netflix, YouTube 등 여러 플랫폼의 콘텐트를 선택하여 한 번의 로그인으로 관심 콘텐트를 편리하게 관리하세요.</span><br><br>
            
            ■ 통합 검색<br>
            <span class="small-text">여러 플랫폼의 콘텐트를 한 번에 검색하세요.</span><br><br>`
        helpbox.appendChild(helpText)
        wrapper.appendChild(helpbox)
        main.appendChild(wrapper)
    }
})