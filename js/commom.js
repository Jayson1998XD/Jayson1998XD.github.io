// 这里可以封装一些全局使用的函数代码

// 封装单个CSS选择器(仿Jquery)
function $(selector) {
    return document.querySelector(selector);
}

// 封装选中全部元素
function $$(selector) {
    return document.querySelectorAll(selector);
}

// 封装获取视窗宽高
function width() {
    return document.documentElement.clientWidth;
}

function height() {
    return document.documentElement.clientHeight;
}

// 阻止浏览器默认行为
document.addEventListener("touchmove", function(e) {
    if (e.cancelable) { // 如果事件可以取消
        cancelHandler(e); // 取消事件 - 阻止默认行为
    }
}, {
    passive: false // 指示浏览器：我的事件处理函数中有可能要取消默认行为
})

// 轮播图功能封装
function createCarousel(carouselId, datas) {
    // 获取各种dom元素
    let container = document.getElementById(carouselId);
    let carouselList = container.querySelector(".g_carousel-list");
    let indicator = container.querySelector(".g_carousel-indicator");
    let prev = container.querySelector(".g_carousel-prev");
    let next = container.querySelector(".g_carousel-next");

    let curIndex = 0; //当前显示的图片索引

    function createCarouselElements() {
        let listHtml = ""; //轮播图列表内部html
        let indHTML = ""; //指示器的内部html
        for (let i = 0; i < datas.length; i++) {
            let data = datas[i];
            if (data.link) {
                // 这里分辨后台给的图片是否有超链接
                listHtml += `<li>
            <a href="${data.link}" target="_blank">
              <img src="${data.image}">
            </a>
            </li>`;
            } else {
                listHtml += `<li>
        <img src="${data.image}">
        </li>`;
            }
            indHTML += "<li></li>";
        }
        carouselList.style.width = `${datas.length}00%`;
        carouselList.innerHTML = listHtml;
        indicator.innerHTML = indHTML;
    }
    createCarouselElements();

    // 根据目前的索引，设置正确的状态
    function setStatus() {
        carouselList.style.marginLeft = -curIndex * width() + "px";
        // 设置轮播图指示器的状态
        // 取消之前的selected
        let beforeSelected = indicator.querySelector(".selected");
        if (beforeSelected) {
            beforeSelected.classList.remove("selected");
        }
        indicator.children[curIndex].classList.add("selected");

        // 处理前和后的切换
        if (prev) {
            if (curIndex === 0) {
                // 目前是第一张图
                prev.classList.add("disabled"); //切换成不可用样式
            } else {
                prev.classList.remove("disabled"); //移除不可用样式
            }
        }

        if (next) {
            if (curIndex === datas.length - 1) {
                // 目前是最后一张图
                next.classList.add("disabled"); //切换成不可用样式
            } else {
                next.classList.remove("disabled"); //移除不可用样式
            }
        }
    }
    setStatus();

    // 上一个
    function toPrev() {
        if (curIndex === 0 /* 如果在第一张 */ ) {
            return; //则没有上一个
        }
        curIndex--;
        setStatus();
    }

    // 下一个
    function toNext() {
        if (curIndex === datas.length - 1 /* 如果在最后一张 */ ) {
            return; //则没有下一个
        }
        curIndex++;
        setStatus();
    }

    let timer = null; //创建一个自动切换的计时器
    // 自动切换开始
    function start() {
        if (timer) {
            // 已经在切换了
            return;
        }
        timer = setInterval(function() {
            curIndex++;
            if (curIndex === datas.length) {
                curIndex = 0;
            }
            setStatus();
        }, 5000);
    }
    start();

    //自动切换停止
    function stop() {
        clearInterval(timer);
        timer = null;
    }

    // 事件

    // 两侧箭头按钮
    if (prev) {
        prev.onclick = toPrev;
    }
    if (next) {
        next.onclick = toNext;
    }

    // 拖动
    container.ontouchstart = function(e) {
        stopBubble(e); // 阻止事件冒泡
        let x = e.touches[0].clientX; //记录按下的横坐标
        // 停止自动播放
        stop();
        // 去掉动画效果
        carouselList.style.transition = "none";
        let pressTime = Date.now(); //手指按下的时间
        // 监听移动事件
        container.ontouchmove = function(e) {
            let dis = e.touches[0].clientX - x;
            carouselList.style.marginLeft = -curIndex * width() +
                dis + "px";
        };

        // 放手
        container.ontouchend = function(e) {
            let dis = e.changedTouches[0].clientX - x; //计算拖动的距离
            start();
            // 加上过渡效果
            carouselList.style.transition = "";
            // 不再监听
            container.ontouchmove = null;
            let duration = Date.now() - pressTime; //滑动的时间
            // 300毫秒内
            if (duration < 300) {
                if (dis > 20 && curIndex > 0) {
                    // 300毫秒内快速向右滑动至少20像素
                    toPrev();
                } else if (dis < -20 && curIndex < datas.length - 1) {
                    // 300毫秒内快速向左滑动至少20像素
                    toNext();
                } else {
                    setStatus();
                }
            } else {
                // 改动curIndex
                if (dis < -width() / 2 && curIndex < datas.length - 1) {
                    toNext();
                } else if (dis > width() / 2 && curIndex > 0) {
                    toPrev();
                } else {
                    setStatus();
                }
            }
        };
    };
}

// ajax请求
async function ajax(url) {
    var reg = /http[s]?:\/\/[^/]+/;
    var matches = url.match(reg);
    if (matches.length === 0) {
        throw new Error("invalid url");
    }
    var target = matches[0];
    var path = url.replace(reg, "");
    return await fetch(`https://proxy.yuanjin.tech${path}`, {
        headers: {
            target,
        },
    }).then((r) => r.json());
}