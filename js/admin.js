/**
 * Created by WangFeng on 2017-08-18.
 */

/**
 * 显示编辑窗口
 */
function showEdit() {
    var edit = document.getElementById('title_edit');
    var bg = document.getElementById('title_edit_bg');
    var content = document.getElementById('title_edit_content');
    bg.style.height = ($(window).height() - bg.offsetTop) + 'px';
    content.style.height = ($(window).height() - content.offsetTop) + 'px';
    edit.style.height = ($(window).height() - edit.offsetTop) + 'px';
    edit.style.display = 'inline';
}

/**
 * 关闭编辑框
 */
function closeEdit() {
    document.getElementById('title_edit').style.display = 'none';
    $('#title_edit_recommend').val('');
    $('#title_edit_assign').val('');
}

/**
 * 提交公告信息
 */
function submitInform() {
    var inform = $("#admin_inform").val();
    $.ajax({
        url: "http://192.168.31.99:8040/vote/inform",
        type: "post",
        data: {
            inform: inform
        },
        dataType: "json",
        success: function (data, status, res) {
        },
        error: function (error) {
            console.log(error);
        }
    });
}

/**
 * 提交优秀员工称号
 */
function submitTitle() {
    var title1 = $("#title_edit_recommend").val();
    var reason1 = $("#title_edit_recommend_reason").val();
    var title2 = $("#title_edit_assign").val();
    var reason2 = $("#title_edit_assign_reason").val();
    if(!title1){
        Toast("请输入获选者优秀称号");
        return;
    }
    if(!reason1){
        Toast("请输入获选者推荐理由");
        return;
    }
    $.ajax({
        url: "http://192.168.31.99:8040/vote/title",
        type: "post",
        data: {
            title: title1,
            reason: reason1,
            title2: title2,
            reason2: reason2
        },
        dataType: "json",
        success: function (data, status, res) {
        },
        error: function (error) {
            console.log(error);
        }
    });
}