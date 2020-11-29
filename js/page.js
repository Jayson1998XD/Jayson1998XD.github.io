let showPage = (function() {
    let pageIndex = 0; //当前页面索引
    let pages = $$(".page_container .page"); //拿到所有页面元素
    let nextIndex = null; //下一页的页面索引

    function setStatic() {
        /* 设置静止状态下的样式 */
        nextIndex = null; //在静止状态下没有下一个页面
        for (let i = 0; i < pages.length; i++) {
            let page = pages[i]; //将页面一个一个设置
            if (i == pageIndex) {
                // 这个页面就是当前显示的页面
                page.style.zIndex = 1;
            } else {
                page.style.zIndex = 10;
            }
            // 位置调整
            page.style.top = (i - pageIndex) * height() + "px";
        }
    }

    setStatic();

    /**
     * 移动中
     * @param {*} dis 移动的偏移量（相对正确位置）
     */
    function moving(dis) {
        for (let i = 0; i < pages.length; i++) {
            let page = pages[i];
            if (i !== pageIndex) {
                page.style.top = (i - pageIndex) * height() + dis + "px";
            }
        }
        // 设置下一个页面
        if (dis > 0 && pageIndex > 0) {
            // 往下移动同时， 目前已经不再是第一页
            nextIndex = pageIndex - 1;
        } else if (dis < 0 && pageIndex < pages.length - 1) {
            // 往上移动，同时已经不再是最后一页
            nextIndex = pageIndex + 1;
        } else {
            nextIndex = null;
        }
    }

    /**
     * 移动完成
     */
    function finishMove() {
        if (nextIndex === null) {
            // 没有下一个，因为没有移动
            setStatic();
            return;
        }
        let nextPage = pages[nextIndex]; //下一个页面
        nextPage.style.transition = "0.5s" //0.5秒动画过渡
        nextPage.style.top = 0;

        setTimeout(function() {
            // 当前页面变了
            pageIndex = nextIndex;
            // 动画完了
            nextPage.style.transition = "";
            setStatic();
        }, 500);
    }

    // 事件
    let pageContainer = $(".page_container");
    pageContainer.ontouchstart = function(e) {
        // 类似于mousedown   表示手指按下
        let y = e.touches[0].clientY;
        // 手指按下，监听移动
        pageContainer.ontouchmove = function(e) {
            let dis = e.touches[0].clientY - y;
            if (Math.abs(dis) < 50 /* 误触值 */ ) {
                // 防误触
                dis = 0; //相当于手指没动
            }
            moving(dis);
        };

        // 手指松开，完成移动
        pageContainer.ontouchend = function() {
            finishMove();
            pageContainer.ontouchmove = null; // 手指离开了，不用监听移动了
        };
    };

    // 自动切换到某个板块
    // index: 页面索引
    function showPage(index) {
        let nextPage = pages[index]; //下一个页面元素
        if (index < pageIndex) {
            // 下一页面就在当前页面的上面
            nextPage.style.top = -height() + "px";
        } else if (index > pageIndex) {
            // 下一页面就在当前页面的下面
            nextPage.style.top = height() + "px";
        } else {
            // 下一页面就是当前页面
            if (pageIndex === 0) {
                pageIndex++;
            } else {
                pageIndex--;
            }
            setStatic();
        }
        // 强行让浏览器渲染
        nextPage.clientHeight; // 读取dom的尺寸和位置，会导致浏览器强行渲染
        nextIndex = index; //设置下一个页面索引
        finishMove();
    }

    return showPage;
})();