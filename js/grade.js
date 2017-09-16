/**
 * Created by WangFeng on 2017-08-18.
 */
window.onload = function () {
    initData();
};

var personnel; // 人员信息列表

/**
 * 显示编辑窗口
 * @param position 当前点击的列表位置
 */
function showEdit(position) {
    var edit = document.getElementById('grade_edit');
    var bg = document.getElementById('grade_edit_bg');
    var content = document.getElementById('grade_edit_content');
    bg.style.height = ($(window).height() - bg.offsetTop) + 'px';
    content.style.height = ($(window).height() - content.offsetTop) + 'px';
    edit.style.height = ($(window).height() - edit.offsetTop) + 'px';
    edit.style.display = 'inline';

    var person = personnel[position];
    document.getElementById("grade_edit_name").innerHTML = person.name;
    document.getElementById("grade_edit_job").innerHTML = person.job;
    $("#grade_edit_submit").attr("personId", person.id);
}

/**
 * 获取人员信息
 */
function initData() {
    getPerson(initPerson);
}

/**
 * 初始化人员信息
 */
function initPerson(jsonData) {
    personnel = JSON.parse(jsonData);
    console.log(personnel);
    var personnelView = document.getElementById("personnel");
    var personnelHtml = '';
    for (var i = 0; i < personnel.length; i++) {
        var person = personnel[i];
        var header = person.header;
        var headId = 'index_head_' + i;
        var name = person.name;
        var job = person.job;
        personnelHtml = personnelHtml +
            '<li class="person-item">' +
            '<div class="item-person">' +
            '<img id="' + headId + '" onerror="javascript:this.src=\'../img/ic_head_def.png\'"/>' +
            '<div class="item-person-title">' +
            '<p class="person-p1" id="person_name">' + name + '</p>' +
            '<p class="person-p2" id="person_title">' + job + '</p>' +
            '</div>' +
            '<button class="item-person-edit" onclick="showEdit(' + i + ')">评&nbsp;&nbsp;分</button>' +
            '</div>' +
            '</li>';
        getImgOfMinio(header, headId, setImg);
    }
    personnelView.innerHTML = personnelHtml;
}

/**
 * 设置图片到界面 回调函数
 * @param id 图片控件的id
 * @param imgUrl 图片下载地址
 */
function setImg(id, imgUrl){
    $('#' + id).attr('src', imgUrl);
}

/**
 * 提交评分
 */
function submitGrade(ctrx) {
    var personId = ctrx.getAttribute("personId");
    var grade = $('#grade_edit_number').val();
    if(!personId || !grade){
        Toast("请输入该员工本月绩效评分", 2000);
        return;
    }
    //$.ajax({
    //    url: "http://192.168.31.99:8040/oss/posturl",
    //    type: "post",
    //    data: {
    //        personId: personId,
    //        grade: grade
    //    },
    //    dataType: "json",
    //    success: function (data, status, res) {
    //    },
    //    error: function (error) {
    //        console.log(error);
    //    }
    //});
    closeEdit();
}

/**
 * 关闭编辑窗口
 */
function closeEdit() {
    document.getElementById('grade_edit').style.display = 'none';
    $('#grade_edit_number').val('');
}