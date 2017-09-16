/**
 * Created by WENGFENG on 2017-08-03.
 */

/*
 //在页面未加载完毕之前显示的loading Html自定义内容
 var _LoadingHtml = '<div id="loadingDiv">页面加载中，请等待...</div>';

 //呈现loading效果
 document.write(_LoadingHtml);

 //监听加载状态改变
 document.onreadystatechange = completeLoading;

 //加载状态为complete时移除loading效果
 function completeLoading() {
 if (document.readyState == "complete") {
 $("#loadingDiv").remove();
 }
 }
 */

var selected = 0;

$(document).ready(function () {
    //添加图片
    $("div .nav-menu>img").each(function () {
        var name = $(this).attr("data-name");
        var src = "../img/ic_nav_" + name + ".png"
        //设置img的属性和值。
        $(this).attr("src", src);
    });

    //点击事件
    $("div .nav-menu").click(function () {
        var index = $(this).attr("index");
        if (index === '2') {
            var admin = localStorage.getItem("admin");
            if (admin && admin === "true") {
            } else {
                Toast("您没有管理员权限！", 3000);
                return;
            }
        }
        // 取消当前激活状态
        var $img = $(".active>img");
        //返回被选元素的属性值
        var name = $img.attr("data-name");
        var src = "../img/ic_nav_" + name + ".png";
        $img.attr("src", src);
        $(".active").removeClass("active");

        // 添加新状态
        $(this).addClass("active");
        //找到所有 div(subMenu) 的子元素(img)
        $img = $(this).children("img");
        name = $img.attr("data-name");
        src = "../img/ic_nav_" + name + "_selected.png";
        //设置img的属性和值。
        $img.attr("src", src);

        //content根据点击按钮加载不同的html
        var page = $(this).attr("data-src");
        if (page) {
            $("#content").load(page)
        }

        selected = $(this).attr("index");
    });

    // 自动点击第一个菜单
    $("div .nav-menu")[selected].click();
});
