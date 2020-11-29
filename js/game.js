(function() {
    // 游戏介绍页面轮播图数据
    let carouselData = [{
            image: "https://game.gtimg.cn/images/lolm/m/f_1.jpg",
        },
        {
            image: "https://game.gtimg.cn/images/lolm/m/f_2.jpg",
        },
        {
            image: "https://game.gtimg.cn/images/lolm/m/f_3.jpg",
        },
        {
            image: "https://game.gtimg.cn/images/lolm/m/f_4.jpg",
        },
        {
            image: "https://game.gtimg.cn/images/lolm/m/f_5.jpg",
        },
        {
            image: "https://game.gtimg.cn/images/lolm/m/f_6.jpg",
        },
    ];
    createCarousel("gameCarousel", carouselData);

    let container = $(".game_container");
    container.ontouchstart = function(e) {
        if (container.scrollTop >= 10) {
            // 滑动的位置不在顶部
            stopBubble(e); //阻止事件冒泡
        }
    }
})();