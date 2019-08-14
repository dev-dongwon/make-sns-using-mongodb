const DiscoverHandler = class {
  constructor() {
    this.dateDomArr = document.getElementsByClassName('post-created-time');
    this.displayDateDomArr = document.getElementsByClassName('box-header-time');
  }
  
  calcDate(postDate) {
    const parsedDate = Date.parse(postDate);
    const nowDate = Date.now();
    const gapByMinute = Math.floor((nowDate - parsedDate)/(1000*60));

    if (gapByMinute < 60) {
      return `${gapByMinute} m`
    }

    const gapByHours = Math.floor(gapByMinute / 60);

    if (gapByHours < 24) {
      return `${gapByHours} h`
    }

    const gapByDay = Math.floor(gapByHours / 24);

    if (gapByDay < 7) {
      return `${gapByDay} d`
    }

    const gapByWeek = Math.floor(gapByDay / 7);

    if (gapByWeek < 4) {
      return `${gapByWeek} w` 
    }
  }

  displayTime() {
    const gapTimeArr = [];
    Array.from(this.dateDomArr).forEach((dom) => {
      gapTimeArr.push(this.calcDate(dom.value));
    })

    Array.from(this.displayDateDomArr).forEach((dom, index) => {
      dom.innerHTML = `${gapTimeArr[index]}`
    })
  }

  addUpdateLikeEvent() {
    const likeBtns = document.getElementsByClassName('box-bottom-like');
    Array.from(likeBtns).forEach((btn) => {
      btn.addEventListener('click', async (event) => {
        const contentNumber = event.target.parentNode.firstChild.value;
        const result = await this.ajax().updateLikeStatus(contentNumber);

        if (result === 'notLoggedIn') {
          alert('로그인이 필요한 서비스입니다');
          return;
        }

        if (result === 'unlike') {
          event.target.src = '/images/board/like.png'
          let likeNumber = event.target.parentNode.parentNode.getElementsByClassName('box-like-count')[0].textContent * 1 - 1;
          event.target.parentNode.parentNode.getElementsByClassName('box-like-count')[0].textContent = likeNumber;
          likeNumber -= 1;
          return;
        }
        
        if (result === 'like') {
          event.target.src = '/images/board/fill-like.png'
          let likeNumber = event.target.parentNode.parentNode.getElementsByClassName('box-like-count')[0].textContent * 1 + 1;
          event.target.parentNode.parentNode.getElementsByClassName('box-like-count')[0].textContent = likeNumber;
          likeNumber += 1;
          return;
        }
      })
    })
  }

  addFollowAndUnfollowEvent() {
    const followBtn = document.getElementsByClassName('box-header-follow');

    if(followBtn) {
      Array.from(followBtn).forEach((btn) => {
        btn.addEventListener('click', (event) => {
          this.followEvent(event);
        })

        btn.addEventListener('mouseenter', (event) => {
          const statusBadge = event.target.parentNode.getElementsByClassName('follow-status')[0];
          statusBadge.style.display = 'block';
        })

        btn.addEventListener('mouseout', (event) => {
          const statusBadge = event.target.parentNode.getElementsByClassName('follow-status')[0];
          statusBadge.style.display = 'none';
        })
      })
    }
  }
  

  async followEvent(event) {
    const targetBtn = event.target;
    const targetBtnId = targetBtn.id;
    const followUserId = targetBtnId.split('-')[2];
    const result = await this.ajax().updateFollowStatus(followUserId);

    if (result === 'notLoggedIn') {
      alert('로그인이 필요한 서비스입니다');
      return;
    }

    if (result === 'follow') {
      const board = document.getElementsByClassName(`${followUserId}`);
      Array.from(board).forEach((val) => {
        const badge = val.parentElement.getElementsByClassName('follow-status')[0]
        val.src = '/images/board/check.png';
        badge.innerHTML = 'now following'
        badge.style.background = 'green';
      })
      return;
    }

    if (result === 'unfollow') {
      const board = document.getElementsByClassName(`${followUserId}`);
      Array.from(board).forEach((val) => {
        const badge = val.parentElement.getElementsByClassName('follow-status')[0]
        val.src = '/images/board/plus.svg';
        badge.innerHTML = 'not followed'
        badge.style.background = 'red';
      })
      return;
    }
  }

  ajax() {
    const getTrendingPageEvent = async () => {
      const url = `/discover/trending`;
      const response = await fetch(url, {
        method : 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      return await response.json();
    }


    const updateLikeStatus = async (contentsNumber) => {
      const url = `/contents/meta/${contentsNumber}/like`
      const response = await fetch(url, {
        method : 'PATCH'
      })
      return await response.text();
    }

    const updateFollowStatus = async (followUserId) => {
      const url = `/api/follow/${followUserId}`
      const response = await fetch(url, {
        method : 'PATCH'
      })
      return await response.text();
    }

    return {
      getTrendingPageEvent,
      updateLikeStatus,
      updateFollowStatus
    }
  }

  setContentTimeParams() {
    const contentTimes = document.getElementsByClassName('box-header-time');
    const contentLinks = document.getElementsByClassName('disdover-content-link');
    Array.from(contentLinks).forEach((dom, index) => {
      dom.href = `${dom.href}?time=${contentTimes[index].textContent}`
    })
  }


  run() {
    this.displayTime();
    this.setContentTimeParams();
    this.addUpdateLikeEvent();
    this.addFollowAndUnfollowEvent();
  }
}

window.addEventListener('load', () => {
  const discoverHandler = new DiscoverHandler();
  discoverHandler.run();
  new Isotope( '.discover-content', {});
})