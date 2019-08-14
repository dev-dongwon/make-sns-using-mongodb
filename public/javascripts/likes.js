const ProfileHandler = class {
  constructor() {
    this.dateDomArr = document.getElementsByClassName('post-created-time');
    this.displayDateDomArr = document.getElementsByClassName('box-header-time');
    this.profileBackground = document.getElementById('profile-info-wrapper');
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

        console.log(result);

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

  ajax() {
    const updateLikeStatus = async (contentsNumber) => {
      const url = `/contents/meta/${contentsNumber}/like`
      const response = await fetch(url, {
        method : 'PATCH'
      })
      return await response.text();
    }

    return {
      updateLikeStatus
    }
  }

  setContentTimeParams() {
    const contentTimes = document.getElementsByClassName('box-header-time');
    const contentLinks = document.getElementsByClassName('disdover-content-link');
    Array.from(contentLinks).forEach((dom, index) => {
      dom.href = `${dom.href}?time=${contentTimes[index].textContent}`
    })
  }

  addBackgroundImageEvent() {
    const images = document.getElementsByClassName('box-body-img');
    const randomNumber = Math.floor(Math.random() * ((images.length-1)+1));

    if (images) {
      this.profileBackground.style.backgroundImage = `url(${images[randomNumber].src})`;
    }
  }


  run() {
    this.displayTime();
    this.setContentTimeParams();
    this.addUpdateLikeEvent();
    this.addBackgroundImageEvent();
  }
}

window.addEventListener('load', () => {
  const profileHandler = new ProfileHandler();
  profileHandler.run();
  new Isotope( '.discover-content', {});
})