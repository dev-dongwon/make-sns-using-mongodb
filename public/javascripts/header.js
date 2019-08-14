const HeaderHandler = class {
  constructor() {
    this.postBox = document.getElementById('post-box');
  }
  
  addOpenDrawerMenuEvent() {
    const drawerMenu = document.getElementById('user-drawer-menu');
    const profileDom = document.getElementById('user-profile');

    if (profileDom) {
      profileDom.addEventListener('mouseover', (event) => {
        drawerMenu.style.display = 'block';
      })
  
      profileDom.addEventListener('mouseout', (event) => {
        drawerMenu.style.display = 'none';
      })
    }

    if (profileDom) {
      drawerMenu.addEventListener('mouseover', (event) => {
        drawerMenu.style.display = 'block';
      })
  
      drawerMenu.addEventListener('mouseout', (event) => {
        drawerMenu.style.display = 'none';
      })
    }
  }
  
  ajaxEvent() {
    const logoutAjax = async () => {
      const url = `/auth/logout`;
      const response = await fetch(url, {
        method : 'POST',
      });
      const ajaxText = await response.text(); 
      return ajaxText;
    }
    
    return {
     logoutAjax
    }
  }
  
  addEventLogout() {
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (event) => {
        await this.ajaxEvent().logoutAjax();
        location.href = "/";
      })
    }
  }

  addOpenPostEvent() {
    const postBtn = document.getElementById('btn-post');
    if (postBtn) {
      postBtn.addEventListener('click', (event) => {
        if (this.postBox.style.display === 'block') {
          this.postBox.style.display = 'none';
          event.target.firstChild.textContent = 'Post';
          return;
        } 
          this.postBox.style.display = 'block';
          event.target.firstChild.textContent = 'Close';
      })
    }
  }
  
  run() {
    this.addEventLogout();
    this.addOpenDrawerMenuEvent();
    this.addOpenPostEvent();
  }
}

window.addEventListener('load', () => {
  const headerHandler = new HeaderHandler();
  headerHandler.run();
})