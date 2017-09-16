/**
 * Created by WangFeng on 2017-08-18.
 */

$(function () {
    init();
});

/**
 * 初始化数据
 */
function init() {
    //$.ajax({
    //    url: "http://192.168.31.99:8040/vote/getGoods",
    //    type: "get",
    //    dataType: "json",
    //    success: function (data, status, res) {
    //        putData(goods);
    //    },
    //    error: function (error) {
    //        console.log(error);
    //    }
    //});
    var goods = [{
        id: "123456",
        name: "王小明",
        headName: "王锋.jpg",
        job: "研发部-Java工程师",
        good: "最佳男主角",
        reason: "先进个人，努力工作，爱岗敬业，神经质的程序员。人傻钱多死得早，不知道该怎么形容了",
        grade: "85.5"
    }, {
        id: "123456",
        name: "王小明",
        headName: "王锋.jpg",
        job: "研发部-Java工程师",
        good: "优秀称号",
        reason: "先进个人，努力工作，爱岗敬业，平易近人，自己的工作从来不推脱给别人，工作很有想法。",
        grade: "85.5"
    }];
    putData(goods);
}

/**
 * 设置数据到界面
 * @param goods 优秀员工数组
 */
function putData(goods) {
    var good1 = goods[0];
    if (good1) {
        getImgOfMinio(good1.headName, "head1", setImg);
        $("#name1").html(good1.name);
        $("#job1").html(good1.job);
        $("#title1").html(good1.good);
        $("#recNum1").html(good1.reason);
        $("#grade1").html("综合评分：" + good1.grade + "分");
    }
    var good2 = goods[1];
    if (good2) {
        $(".result-person").css("width", "50%");
        $("#result_person2").css("display", "inline");
        getImgOfMinio(good2.headName, "head2", setImg);
        $("#name2").html(good2.name);
        $("#job2").html(good2.job);
        $("#title2").html(good2.good);
        $("#recNum2").html(good2.reason);
        $("#grade2").html("综合评分：" + good2.grade + "分");
    } else {
        $("#result_person2").css("display", "none");
        $(".result-person").css("width", "100%");
    }
}

/**
 * 设置图片到界面 回调函数
 * @param id 图片控件的id
 * @param imgUrl 图片下载地址
 */
function setImg(id, imgUrl){
    $('#' + id).attr('src', imgUrl);
}
