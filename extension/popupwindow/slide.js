function createcontentsscrollbtn(contentsDiv) {

  const contentsdata = contentsDiv.querySelector('.contentsdata');

  if (contentsdata !== null) {
    const cardWrapperDivs = contentsDiv.getElementsByClassName('cardWrapper');
    const numberOfCardWrapperDivs = cardWrapperDivs.length;
    console.log(cardWrapperDivs)
    console.log(numberOfCardWrapperDivs);

    const contentsbtnDiv = document.createElement('div');
    contentsbtnDiv.className = 'contentsbtncontainer'

    const contentsprevbtn = document.createElement('button');
    contentsprevbtn.className = 'contentsprevbtn'
    contentsprevbtn.addEventListener('click', contentScrollPrevClickEventHandler)

    const contentsprevbtnImg = document.createElement('img');
    contentsprevbtnImg.src = 'icons/arrow_left_white.png';
    contentsprevbtnImg.className = 'contentprevbtnImg';

    const contentsnextbtn = document.createElement('button');
    contentsnextbtn.className = 'contentsnextbtn'
    contentsnextbtn.addEventListener('click', contentScrollNextClickEventHandler)

    const contentsnextbtnImg = document.createElement('img');
    contentsnextbtnImg.src = 'icons/arrow_right_white.png';
    contentsnextbtnImg.className = 'contentnextbtnImg';

    contentsprevbtn.appendChild(contentsprevbtnImg)
    contentsnextbtn.appendChild(contentsnextbtnImg);
    contentsbtnDiv.appendChild(contentsprevbtn)
    contentsbtnDiv.appendChild(contentsnextbtn);
    contentsDiv.appendChild(contentsbtnDiv);

    if (numberOfCardWrapperDivs < 4) {
      contentsbtnDiv.style.display = 'none';
    } else {
      contentsbtnDiv.style.display = 'flex';
    }
  }
}

function createRecommendScrollBtn(wrapper) {

  if (wrapper !== null) {
    const cardWrapperDivs = wrapper.getElementsByClassName('recommendcolumn');
    const numberOfCardWrapperDivs = cardWrapperDivs.length;

    const contentsbtnDiv = document.createElement('div');
    contentsbtnDiv.className = 'contentsbtncontainer'

    const contentsprevbtn = document.createElement('button');
    contentsprevbtn.className = 'contentsprevbtn'
    contentsprevbtn.addEventListener('click', recScrollPrevClickEventHandler)

    const contentsprevbtnImg = document.createElement('img');
    contentsprevbtnImg.src = 'icons/arrow_left_white.png';
    contentsprevbtnImg.className = 'contentprevbtnImg';

    const contentsnextbtn = document.createElement('button');
    contentsnextbtn.className = 'contentsnextbtn'
    contentsnextbtn.addEventListener('click', recScrollNextClickEventHandler)

    const contentsnextbtnImg = document.createElement('img');
    contentsnextbtnImg.src = 'icons/arrow_right_white.png';
    contentsnextbtnImg.className = 'contentnextbtnImg';

    contentsprevbtn.appendChild(contentsprevbtnImg)
    contentsnextbtn.appendChild(contentsnextbtnImg);
    contentsbtnDiv.appendChild(contentsprevbtn)
    contentsbtnDiv.appendChild(contentsnextbtn);
    wrapper.appendChild(contentsbtnDiv);

    if (numberOfCardWrapperDivs < 4) {
      contentsbtnDiv.style.display = 'none';
    } else {
      contentsbtnDiv.style.display = 'flex';
    }
  }
}

// 콘텐트 왼쪽으로 이동
function recScrollNextClickEventHandler(event) {
  const element = event.target;
  const contentsdataparent = element.closest('.recommendcontents');
  const contents =  contentsdataparent.querySelector('.recommendrow');
  const contentscount = contents.querySelectorAll('.recommendcolumn').length;
  const scrollSize = 180;
  const notscrolledsize = contentscount * scrollSize;

  var currentRight = parseInt(contents.style.right || 0, 10);

  const contentsprevbtn = contentsdataparent.querySelector('.contentsprevbtn')
  contentsprevbtn.style.display = 'block'


  if ((currentRight + scrollSize) < (notscrolledsize - 510)) {
    contents.style.right = (currentRight + scrollSize) + 'px';
  }
  event.target.closest('.contentsbtncontainer').querySelector('.contentsprevbtn').style.display = "block";
}

// 콘텐트 왼쪽으로 이동
function contentScrollNextClickEventHandler(event) {
  const element = event.target;
  const contentsdataparent = element.closest('.contents');
  const contents = contentsdataparent.children[1];
  const contentscount = contents.querySelectorAll('.cardWrapper').length;
  const scrollSize = 230;
  const notscrolledsize = contentscount * scrollSize;

  var currentRight = parseInt(contents.style.right || 0, 10);


  const contentsprevbtn = contentsdataparent.querySelector('.contentsprevbtn')
  contentsprevbtn.style.display = 'block'


  if ((currentRight + scrollSize) < (notscrolledsize - 510)) {
    contents.style.right = (currentRight + scrollSize) + 'px';
  }
  event.target.closest('.contentsbtncontainer').querySelector('.contentsprevbtn').style.display = "block";
}

// 콘텐트 오른쪽으로 이동
function recScrollPrevClickEventHandler(event) {
  const element = event.target;
  const contentsdataparent = element.closest('.recommendcontents');
  const contents =  contentsdataparent.querySelector('.recommendrow');

  var currentRight = parseInt(contents.style.right || 0, 10);
  const scrollSize = 180;

  if (currentRight !== 0) {
    contents.style.right = (currentRight - scrollSize) + 'px';
  }
}

// 콘텐트 오른쪽으로 이동
function contentScrollPrevClickEventHandler(event) {
  const element = event.target;
  const contentsdataparent = element.closest('.contents');
  const contents = contentsdataparent.children[1];
  const contentscount = contents.querySelectorAll('.cardWrapper').length;

  console.log(contentsdataparent);
  console.log(contentscount);

  var currentRight = parseInt(contents.style.right || 0, 10);
  console.log(currentRight);
  const scrollSize = 230;

  if (currentRight !== 0) {
    contents.style.right = (currentRight - scrollSize) + 'px';
  }
}




/**************************************************************/

// ott 페이지 콘텐트 스크롤 함수
function ottcreatecontentsscrollbtn() {
  const ottpage = document.querySelector('.ottpage');
  const contentstab = ottpage.querySelectorAll('.category');

  for (let i = 0; i < contentstab.length; i++) {
    const contents = contentstab[i];
    console.log(contents)
    const contentsdata = contents.querySelector('.itemContainer')

    const cardWrapperDivs = contentsdata.childNodes
    const numberOfCardWrapperDivs = (Array.from(cardWrapperDivs).filter(item => true)).length
    const contentsbtnDIV = document.createElement('div');
    contentsbtnDIV.className = 'contentsbtncontainer'

    const contentsprevbtn = document.createElement('button');
    contentsprevbtn.className = 'contentsprevbtn'
    contentsprevbtn.addEventListener('click', ottcontentscrollprevClickEventHandler)

    const contentsprevbtnImg = document.createElement('img');
    contentsprevbtnImg.src = 'icons/arrow_left_white.png';
    contentsprevbtnImg.className = 'contentprevbtnImg';

    const contentsnextbtn = document.createElement('button');
    contentsnextbtn.className = 'contentsnextbtn'
    contentsnextbtn.addEventListener('click', ottcontentscrollnextClickEventHandler)

    const contentsnextbtnImg = document.createElement('img');
    contentsnextbtnImg.src = 'icons/arrow_right_white.png';
    contentsnextbtnImg.className = 'contentnextbtnImg';

    contentsprevbtn.appendChild(contentsprevbtnImg)
    contentsnextbtn.appendChild(contentsnextbtnImg);
    contentsbtnDIV.appendChild(contentsprevbtn)
    contentsbtnDIV.appendChild(contentsnextbtn);
    contents.appendChild(contentsbtnDIV);

    if (numberOfCardWrapperDivs < 3) {
      contentsbtnDIV.style.display = 'none';
    } else {
      contentsbtnDIV.style.display = 'flex';
    }
  }
}


// 콘텐트 왼쪽으로 이동
function ottcontentscrollnextClickEventHandler(event) {

  const element = event.target
  const contentsdataparent = element.closest('.category');
  const contents = contentsdataparent.children[1];
  const contentscount = (Array.from(contents.childNodes).filter(item => true)).length
  const scrollSize = 230;
  const notscrolledsize = contentscount * scrollSize;
  var currentRight = parseInt(contents.style.right || 0, 10);
  
  const contentsprevbtn = contentsdataparent.querySelector('.contentsprevbtn')
  contentsprevbtn.style.display = 'block'

  if ((currentRight + scrollSize) < (notscrolledsize - 510)) {
    contents.style.right = (currentRight + scrollSize) + 'px';
  }
}

// 콘텐트 오른쪽으로 이동
function ottcontentscrollprevClickEventHandler(event) {
  const element = event.target;
  const contentsdataparent = element.closest('.category');
  const contents = contentsdataparent.children[1];
  //const contentscount = contents.querySelectorAll('.cardWrapper').length;
  var currentRight = parseInt(contents.style.right || 0, 10);
  const scrollSize = 230;

  if (currentRight !== 0) {
    contents.style.right = (currentRight - scrollSize) + 'px';
  }

}




/**************************************************************/

// channel 페이지 콘텐트 스크롤 함수
function channelcreatecontentsscrollbtn() {
  const channelpage = document.querySelector('.channelpage');
  const contentstab = channelpage.querySelectorAll('.category');

  for (let i = 0; i < contentstab.length; i++) {
    const contents = contentstab[i];
    const contentsdata = contents.querySelector('.itemContainer')
    const cardWrapperDivs = contentsdata.childNodes
    const numberOfCardWrapperDivs = (Array.from(cardWrapperDivs).filter(item => true)).length
    const contentsbtnDIV = document.createElement('div');
    contentsbtnDIV.className = 'contentsbtncontainer'

    const contentsprevbtn = document.createElement('button');
    contentsprevbtn.className = 'contentsprevbtn'
    contentsprevbtn.addEventListener('click', channelcontentscrollprevClickEventHandler)

    const contentsprevbtnImg = document.createElement('img');
    contentsprevbtnImg.src = 'icons/arrow_left_white.png';
    contentsprevbtnImg.className = 'contentprevbtnImg';

    const contentsnextbtn = document.createElement('button');
    contentsnextbtn.className = 'contentsnextbtn'
    contentsnextbtn.addEventListener('click', channelcontentscrollnextClickEventHandler)

    const contentsnextbtnImg = document.createElement('img');
    contentsnextbtnImg.src = 'icons/arrow_right_white.png';
    contentsnextbtnImg.className = 'contentnextbtnImg';

    contentsprevbtn.appendChild(contentsprevbtnImg)
    contentsnextbtn.appendChild(contentsnextbtnImg);
    contentsbtnDIV.appendChild(contentsprevbtn)
    contentsbtnDIV.appendChild(contentsnextbtn);
    contents.appendChild(contentsbtnDIV);
    console.log('버튼 생성')

    if (numberOfCardWrapperDivs < 4) {
      contentsbtnDIV.style.display = 'none';
    } else {
      contentsbtnDIV.style.display = 'flex';
    }
  }
}


// 콘텐트 왼쪽으로 이동
function channelcontentscrollnextClickEventHandler(event) {
  const element = event.target
  const contentsdataparent = element.closest('.category');
  const contents = contentsdataparent.children[1];
  const contentscount = (Array.from(contents.childNodes).filter(item => true)).length
  const notscrolledsize = contentscount * 230;

  var currentRight = parseInt(contents.style.right || 0, 10);
  const scrollSize = 230;
  const contentsprevbtn = contentsdataparent.querySelector('.contentsprevbtn')
  contentsprevbtn.style.display = 'block'

  if ((currentRight + scrollSize) < (notscrolledsize - 510)) {
    contents.style.right = (currentRight + scrollSize) + 'px';
  }
}

// 콘텐트 오른쪽으로 이동
function channelcontentscrollprevClickEventHandler(event) {

  const element = event.target;
  const contentsdataparent = element.closest('.category');
  const contents = contentsdataparent.children[1];
  const contentscount = contents.querySelectorAll('.cardWrapper').length;

  var currentRight = parseInt(contents.style.right || 0, 10);
  const scrollSize = 230;

  if (currentRight !== 0) {
    contents.style.right = (currentRight - scrollSize) + 'px';
  }
}


/**************************************************************/

// youvid 페이지 콘텐트 스크롤 함수
function youvidcreatecontentsscrollbtn() {
  const youvidpage = document.querySelector('.youvidpage');
  const contentstab = youvidpage.querySelectorAll('.category');

  for (let i = 0; i < contentstab.length; i++) {
    const contents = contentstab[i];
    const contentsdata = contents.querySelector('.itemContainer')
    const cardWrapperDivs = contentsdata.childNodes
    const numberOfCardWrapperDivs = (Array.from(cardWrapperDivs).filter(item => true)).length

    const contentsbtnDIV = document.createElement('div');
    contentsbtnDIV.className = 'contentsbtncontainer'

    const contentsprevbtn = document.createElement('button');
    contentsprevbtn.className = 'contentsprevbtn'
    contentsprevbtn.addEventListener('click', youvidcontentscrollprevClickEventHandler)

    const contentsprevbtnImg = document.createElement('img');
    contentsprevbtnImg.src = 'icons/arrow_left_white.png';
    contentsprevbtnImg.className = 'contentprevbtnImg';

    const contentsnextbtn = document.createElement('button');
    contentsnextbtn.className = 'contentsnextbtn'
    contentsnextbtn.addEventListener('click', youvidcontentscrollnextClickEventHandler)

    const contentsnextbtnImg = document.createElement('img');
    contentsnextbtnImg.src = 'icons/arrow_right_white.png';
    contentsnextbtnImg.className = 'contentnextbtnImg';

    contentsprevbtn.appendChild(contentsprevbtnImg)
    contentsnextbtn.appendChild(contentsnextbtnImg);
    contentsbtnDIV.appendChild(contentsprevbtn)
    contentsbtnDIV.appendChild(contentsnextbtn);
    contents.appendChild(contentsbtnDIV);

    if (numberOfCardWrapperDivs < 4) {
      contentsbtnDIV.style.display = 'none';
    } else {
      contentsbtnDIV.style.display = 'flex';
    }
  }
}


// 콘텐트 왼쪽으로 이동
function youvidcontentscrollnextClickEventHandler(event) {
  const element = event.target
  const contentsdataparent = element.closest('.category');
  const contents = contentsdataparent.children[1];
  const contentscount = (Array.from(contents.childNodes).filter(item => true)).length
  const scrollSize = 230;
  const notscrolledsize = contentscount * scrollSize;

  var currentRight = parseInt(contents.style.right || 0, 10);

  const contentsprevbtn = contentsdataparent.querySelector('.contentsprevbtn')
  contentsprevbtn.style.display = 'block'


  if ((currentRight + scrollSize) < (notscrolledsize - 510)) {
    contents.style.right = (currentRight + scrollSize) + 'px';
  }
}

// 콘텐트 오른쪽으로 이동
function youvidcontentscrollprevClickEventHandler(event) {

  const element = event.target;
  const contentsdataparent = element.closest('.category');
  const contents = contentsdataparent.children[1];
  //const contentscount = contents.querySelectorAll('.cardWrapper').length;
  var currentRight = parseInt(contents.style.right || 0, 10);
  const scrollSize = 230;

  if (currentRight !== 0) {
    contents.style.right = (currentRight - scrollSize) + 'px';
  }
}



/**************************************************************/

// streamer 페이지 콘텐트 스크롤 함수
function streamercreatecontentsscrollbtn() {
  const streamerpage = document.querySelector('.streamerpage');
  const contentstab = streamerpage.querySelectorAll('.category');

  for (let i = 0; i < contentstab.length; i++) {
    const contents = contentstab[i];
    const contentsdata = contents.querySelector('.itemContainer')

    const cardWrapperDivs = contentsdata.childNodes
    const numberOfCardWrapperDivs = (Array.from(cardWrapperDivs).filter(item => true)).length

    const contentsbtnDIV = document.createElement('div');
    contentsbtnDIV.className = 'contentsbtncontainer'

    const contentsprevbtn = document.createElement('button');
    contentsprevbtn.className = 'contentsprevbtn'
    contentsprevbtn.addEventListener('click', streamercontentscrollprevClickEventHandler)

    const contentsprevbtnImg = document.createElement('img');
    contentsprevbtnImg.src = 'icons/arrow_left_white.png';
    contentsprevbtnImg.className = 'contentprevbtnImg';

    const contentsnextbtn = document.createElement('button');
    contentsnextbtn.className = 'contentsnextbtn'
    contentsnextbtn.addEventListener('click', streamercontentscrollnextClickEventHandler)

    const contentsnextbtnImg = document.createElement('img');
    contentsnextbtnImg.src = 'icons/arrow_right_white.png';
    contentsnextbtnImg.className = 'contentnextbtnImg';

    contentsprevbtn.appendChild(contentsprevbtnImg)
    contentsnextbtn.appendChild(contentsnextbtnImg);
    contentsbtnDIV.appendChild(contentsprevbtn)
    contentsbtnDIV.appendChild(contentsnextbtn);
    contents.appendChild(contentsbtnDIV);

    if (numberOfCardWrapperDivs < 4) {
      contentsbtnDIV.style.display = 'none';
    } else {
      contentsbtnDIV.style.display = 'flex';
    }
  }
}


// 콘텐트 왼쪽으로 이동
function streamercontentscrollnextClickEventHandler(event) {
  const element = event.target
  const contentsdataparent = element.closest('.category');
  const contents = contentsdataparent.children[1];
  const contentscount = (Array.from(contents.childNodes).filter(item => true)).length
  const scrollSize = 230;
  const notscrolledsize = contentscount * scrollSize;

  var currentRight = parseInt(contents.style.right || 0, 10);

  const contentsprevbtn = contentsdataparent.querySelector('.contentsprevbtn')
  contentsprevbtn.style.display = 'block'


  if ((currentRight + scrollSize) < (notscrolledsize - 510)) {
    contents.style.right = (currentRight + scrollSize) + 'px';
  }
}

// 콘텐트 오른쪽으로 이동
function streamercontentscrollprevClickEventHandler(event) {

  const element = event.target;
  const contentsdataparent = element.closest('.category');
  const contents = contentsdataparent.children[1];
  //const contentscount = contents.querySelectorAll('.cardWrapper').length;

  var currentRight = parseInt(contents.style.right || 0, 10);
  const scrollSize = 230;

  if (currentRight !== 0) {
    contents.style.right = (currentRight - scrollSize) + 'px';
  }
}
