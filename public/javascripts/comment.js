const CommentHandler = class {
  constructor() {
    this.removeIcons = document.getElementsByClassName('reply-remove-icon');
    this.updateIcons = document.getElementsByClassName('reply-update-icon');
    this.infoModal = document.getElementById('content-modal');
    this.closeModal = document.getElementById('modal-btn-no');
    this.excuteDeleteBtn = document.getElementById('modal-btn-yes');
    this.commentInputArea = document.getElementById('content-comment-area');
    this.contentId = document.getElementById('hidden-content-id').value;

    this.commentCount = document.getElementsByClassName('box-comment-count')[0];
    this.replyArea = document.getElementsByClassName('contnet-reply-box')[0];
  }

  async removeEvent(event) {
    const result = await this.ajax().removeCommentAjax(event.target.id);
    if (result === 'success') {
      const removeTarget = document.getElementById(`content-reply-${event.target.id}`);
      const replyLine = document.getElementById(`reply-line-${event.target.id}`);
      this.replyArea.removeChild(removeTarget);
      this.replyArea.removeChild(replyLine);
      this.infoModal.style.display = "none";
      this.commentCount.textContent = this.commentCount.textContent*1 - 1; 
      }
  }

  addRemoveEvent() {
    Array.from(this.removeIcons).forEach((icon) => {
      icon.addEventListener('click', (event) => {
        this.infoModal.style.display = "block";
        this.commentInputArea.value = '';
        this.addRemoveCommentEvent(event);
      })
    })
  }

  addCloseModalEvent() {
    this.closeModal.addEventListener('click', () => {
      this.infoModal.style.display = "none";
    })
  }

  addRemoveCommentEvent(event) {
    this.excuteDeleteBtn.addEventListener('click', () => {
      this.removeEvent(event);
    })
  }

  addSubmitCommentEvent() {
    const commentBtn = document.getElementById('btn-comment-submit');
    commentBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      const comment = document.getElementById('content-comment-area').value;
      const contentId = document.getElementById('hidden-content-id').value;
      const formData = {
        comment: comment,
        contentId : contentId
      }
      const result = await this.ajax().addComment(JSON.stringify(formData));

      if (result === 'notLoggedIn') {
        alert('로그인이 필요한 서비스입니다');
        return;
      }

      const replyId = JSON.parse(result)._id;
      const commentJsonData = JSON.parse(result);
      const htmlForm = this.getHtmlForm(commentJsonData);

      this.replyArea.appendChild(htmlForm.contentReply);
      this.replyArea.appendChild(this.getupdateForm(replyId));
      this.replyArea.appendChild(htmlForm.replyLine);
      this.commentInputArea.value='';
      this.commentCount.textContent = this.commentCount.textContent*1 + 1; 
      this.addRemoveEvent();
      this.addUpdateCommentEvent();
    })
  }

  getHtmlForm(comment) {
    const htmlForm =
    `
      <div class="content-reply-avatar">
        <img src="${comment.userAvatar}" />
      </div>
      <div class="content-reply-comment">
        <div class="content-reply-comment-id">
          <p>@${comment.username}</p>
        </div>
        <div class="content-reply-comment-text">
          <p>${comment.content}</p>
          </div>
      </div>
      <div class="content-reply-icon-update">
        <img class="reply-update-icon" src="/images/content/modify.png" id='update-${comment._id}'>
      </div>
      <div class="content-reply-icon-remove">
        <img class="reply-remove-icon" src="/images/content/delete.png" id=${comment._id}>
      </div>
      <div class="content-reply-time">
        ${this.calcDate(comment.createdDate)}
      </div>
    `

    const contentReply = document.createElement('div');
    contentReply.className = 'content-reply';
    contentReply.id = `content-reply-${comment._id}`;
    contentReply.innerHTML = htmlForm;

    const replyLine = document.createElement('hr');
    replyLine.className = 'reply-line';
    replyLine.id = `reply-line-${comment._id}`;
    
    return {
      contentReply,
      replyLine
    }
  }

  getupdateForm(replyId) {

    const htmlForm = 
    `
    <textarea class="content-update-text-area" id="content-update-form-${replyId}" name="content" placeholder="Texting here" autofocus="" value=''></textarea>
    <div class="btn-comment-update-cancel" id="btn-comment-update-cancel-${replyId}">cancel</div>
    <button class="btn btn-comment-update" id="btn-comment-update-${replyId}">update</button>
    `

    const updateForm = document.createElement('div');
    updateForm.className = 'content-update-text-area-wrapper';
    updateForm.id = `content-update-text-area-${replyId}`;
    updateForm.innerHTML = htmlForm;
    return updateForm;
  }

  makeUpdateReplyForm(replyId) {
    const replyText = document.getElementById(`content-reply-text-${replyId}`).textContent;
    const upadatedForm = document.createElement('div');
    upadatedForm.className = 'content-update-text-area-wrapper';
    upadatedForm.id = `content-update-text-area-${replyId}`;

    const htmlForm = 
    `
      <textarea class="content-update-text-area" name="content" placeholder="Texting here" autofocus="" value=''>${replyText}</textarea>
      <div class="btn-comment-update-cancel" id="btn-comment-update-cancel-${replyId}">cancel</div>
      <button class="btn btn-comment-update">update</button>
    `

    upadatedForm.innerHTML = htmlForm;

    return upadatedForm;

  }

  addUpdateCommentEvent() {
    Array.from(this.updateIcons).forEach((icon) => {
      icon.addEventListener('click', (event) => {
        const replyId = event.target.id.split('-')[1];
        const originReply = document.getElementById(`content-reply-${replyId}`);
        const updateForm = document.getElementById(`content-update-text-area-${replyId}`);
        originReply.style.display = 'none';
        updateForm.style.display = 'block';
        this.addCancelUpdateCommentEvent(replyId, originReply, updateForm);
        this.updateExecuteCommentEvent(replyId, originReply, updateForm);
      })
    })    
  }

  addCancelUpdateCommentEvent(replyId, originReply, updateForm) {
    const cancelBtn = document.getElementById(`btn-comment-update-cancel-${replyId}`);
    cancelBtn.addEventListener('click', (event) => {
      originReply.style.display = 'grid';
      updateForm.style.display = 'none';
    })
  }

  updateExecuteCommentEvent(replyId, originReply, updateForm) {
     const submitBtn = document.getElementById(`btn-comment-update-${replyId}`);
     const updatedForm = document.getElementById(`content-update-form-${replyId}`);
     submitBtn.addEventListener('click', async (event) => {
       const result = await this.ajax().updateCommentAjax(replyId, updatedForm.value);
       if (result === 'success') {
         const originText = originReply.getElementsByClassName('content-reply-comment-text')[0]
         console.log(updatedForm.value)
         originText.innerHTML = updatedForm.value
         updateForm.style.display = 'none';
         originReply.style.display = 'grid';
       }
     })
  }

  ajax() {
    const removeCommentAjax = async (id) => {
      const url = `/comments/${id}`;
      const response = await fetch(url, {
        method : 'DELETE'
      })
      return await response.json();
    }

    const updateCommentAjax = async (id, updatedReply) => {
      const url = `/comments/${id}`;
      const response = await fetch(url, {
        method : 'PATCH',
        body : JSON.stringify({
          id,
          updatedReply,
          contentId : this.contentId
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      return await response.text();
    }

    const addComment = async (formData) => {
      const url = '/comments';
      const response = await fetch(url, {
        method : 'POST',
        body : formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

      })
      return await response.text();
    }

    return {
      removeCommentAjax,
      addComment,
      updateCommentAjax
    }
  }

  calcDate(postDate) {
    const nowDate = Date.now();
    const parsedDate = Date.parse(postDate);
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

  run() {
    this.addRemoveEvent();
    this.addSubmitCommentEvent();
    this.addUpdateCommentEvent();
  }
}

window.addEventListener('load', () => {
  const commentHandler = new CommentHandler();
  commentHandler.run();
})