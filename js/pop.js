 let showPop = (function() {
     /**
      *  弹出窗口
      * @param {*} id
      */
     function showPop(id) {
         let container = $("#" + id);
         container.style.display = "";
         //  点击页面1的播放图标时，视频自动播放
         if (id === "popVideo") {
             let vdo = container.querySelector("video");
             vdo.play();
         }
     }

     // 获取所有的关闭按钮
     let closes = $$(".pop_close");
     for (let i = 0; i < closes.length; i++) {
         closes[i].onclick = function() {
             let container = this.parentElement.parentElement;
             container.style.display = "none";
         };
     }


     // 实现预约平台选中效果
     let popWx = $(".pop_wx");
     let popQq = $(".pop_qq");
     popWx.onclick = function() {
         popWx.classList.add("selected");
         popQq.classList.remove("selected");
     };

     popQq.onclick = function() {
         popWx.classList.remove("selected");
         popQq.classList.add("selected");
     };

     //  当关闭视频弹窗时，暂停视频
     let closeBtn = $("#popVideo .pop_close");
     closeBtn.addEventListener("click", function() {
         $("#popVideo video").pause();
     });

     return showPop;
 })();