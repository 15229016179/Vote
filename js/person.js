/**
 * Created by WENGFENG on 2017-08-17.
 */

window.onload = function () {
    getPerson(initPerson);
};

var personnel;
var updatePersonId;

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
            '<button class="item-person-edit" onclick="showEdit(' + i + ')">编&nbsp;&nbsp;辑</button>' +
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
function setImg(id, imgUrl) {
    $('#' + id).attr('src', imgUrl);
}

/**
 * 显示人员信息编辑窗口
 * @param position
 */
function showEdit(position) {
    var edit = document.getElementById('person_edit');
    var bg = document.getElementById('person_edit_bg');
    var content = document.getElementById('person_edit_content');
    bg.style.height = ($(window).height() - bg.offsetTop) + 'px';
    content.style.height = ($(window).height() - content.offsetTop) + 'px';
    edit.style.height = ($(window).height() - edit.offsetTop) + 'px';
    edit.style.display = 'inline';
    document.getElementById("person_edit_title").innerText = '添加员工';
    if (position >= 0) { // 点击的是编辑按钮，会传一个position，新增时position是-1
        document.getElementById("person_edit_title").innerText = '编辑员工信息';
        var person = personnel[position];
        var header = person.header;
        if (!header) {
            header = "../img/ic_head_def.png";
        }
        var name = person.name;
        var job = person.job;
        var password = person.password;
        $("#person_edit_head").attr("src", header);
        $('#person_edit_name').val(name);
        $('#person_edit_job').val(job);
        $('#person_edit_password').val(password);
        changeSelect(document.getElementById("select_vote"), !person.vote + '');
        changeSelect(document.getElementById("select_selected"), !person.selected + '');
        changeSelect(document.getElementById("select_assign"), !person.assign + '');
        changeSelect(document.getElementById("select_admin"), !person.admin + '');
        updatePersonId = person.id;
    } else {
        updatePersonId = '';
    }
}

/**
 * 改变单选按钮的选择状态
 * @param ctrx 上下文
 */
function selectChange(ctrx) {
    var selected = ctrx.getAttribute('select');
    changeSelect(ctrx, selected);
}

/**
 * 改变单选按钮的选择状态
 * @param ctrx 上下文
 * @param selected  当前是否选中，改变后取非
 */
function changeSelect(ctrx, selected) {
    if (selected == 'true') {
        ctrx.setAttribute('select', 'false');
        ctrx.style.cssText = 'background: url("../img/ic_cb_def.png") center left no-repeat;background-size: 1.111rem 0.889rem;';
    } else {
        ctrx.setAttribute('select', 'true');
        ctrx.style.cssText = 'background: url("../img/ic_cb_checked.png") center left no-repeat;background-size: 1.111rem 0.889rem;';
    }
}

/**
 * 提交编辑后的信息，检查是否上传头像
 */
function submit() {
    var name = $('#person_edit_name').val();
    if (name == '') {
        Toast('请输入员工姓名', 2000);
        return;
    }
    var isChange = document.getElementById('person_edit_head').getAttribute("isChange");
    if (isChange == "true") {
        $.ajax({
            url: "http://192.168.31.99:8040/oss/posturl",
            type: "get",
            data: {
                bucket: 'vote',
                objectname: name + '.jpg'
            },
            dataType: "json",
            success: function (data, status, res) {
                putImg(data);
            },
            error: function (error) {
                console.log(error)
            }
        })
    }
    submitPerson(name)
}

/**
 * 上传头像
 * @param result
 */
function putImg(result) {
    var imgBase64 = document.getElementById('person_edit_head').getAttribute('src');
    var form = new FormData();
    form.append('bucket', result['bucket']);
    form.append('key', result['key']);
    form.append('policy', result['policy']);
    form.append('x-amz-algorithm', result['x-amz-algorithm']);
    form.append('x-amz-credential', result['x-amz-credential']);
    form.append('x-amz-date', result['x-amz-date']);
    form.append('x-amz-signature', result['x-amz-signature']);
    form.append('file', convertBase64UrlToBlob(imgBase64));
    $.ajax({
        url: result['url'],
        type: 'POST',
        data: form,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (res) {
        },
        error: function (error) {
            Toast("头像上传出错，请稍后重试")
        }
    });

}

/**
 * 提交人员信息
 * @param name 人员姓名
 */
function submitPerson(name) {
    var job = $('#person_edit_job').val();
    var password = $('#person_edit_password').val();
    if (job == '') {
        Toast('请输入员工所属部门及职务', 2000);
        return;
    }
    if (password == '') {
        Toast('请输入员工登录密码', 2000);
        return;
    }
    var vote = document.getElementById("select_vote").getAttribute('select');
    var selected = document.getElementById("select_selected").getAttribute('select');
    var assign = document.getElementById("select_assign").getAttribute('select');
    var admin = document.getElementById("select_admin").getAttribute('select');

    $.ajax({
        url: "http://192.168.31.99:8040/vote/updatePerson",
        type: "post",
        data: {
            id: updatePersonId,
            name: name,
            headName: name + '.jpg',
            job: job,
            password: password,
            vote: vote,
            selected: selected,
            assign: assign,
            admin: admin
        },
        dataType: "json",
        success: function (data, status, res) {
            closeEdit();
        },
        error: function (error) {
            console.log(error)
        }
    });

}

/**
 * 将以base64的图片url数据转换为Blob
 * @param urlData
 *            用url方式表示的base64图片数据
 */
function convertBase64UrlToBlob(urlData) {

    var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte

    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }

    return new Blob([ab], {type: '"image/jpeg"'});
}

/**
 * 关闭编辑窗口
 */
function closeEdit() {
    document.getElementById('person_edit').style.display = 'none';
    $("#person_edit_head").attr("src", '../img/ic_head_def.png');
    $('#person_edit_name').val('');
    $('#person_edit_job').val('');
    $('#person_edit_password').val('');

    changeSelect(document.getElementById("select_vote"), 'true');
    changeSelect(document.getElementById("select_selected"), 'true');
    changeSelect(document.getElementById("select_assign"), 'true');
    changeSelect(document.getElementById("select_admin"), 'true');
}

/*头像裁剪部分*/
/**
 * 点击头像后先给输入框置空
 */
function headOnClick() {
    document.getElementById("head_input").value = '';
}

/**
 * 头像文件改变后的操作
 */
function headOnChange() {
    var imgFile = document.getElementById("head_input").files;
    console.log(imgFile);
    if (imgFile != null && imgFile.length > 0 && isImageFile(imgFile[0])) {
        document.getElementById("clip").style.display = 'inline';
        var wrapper = document.getElementById("clip_wrapper");
        wrapper.style.height = ($(window).height() - wrapper.offsetTop) + 'px';
        startClip(imgFile[0]);
    }
}

/**
 * 判断是否为图片文件
 * @param file 文件
 * @returns {boolean} 是否为图片 true是
 */
function isImageFile(file) {
    if (file.type) {
        return /^image\/\w+$/.test(file.type);
    } else {
        return /\.(jpg|jpeg|png|gif)$/.test(file);
    }
}

var img; // 头像控件
var imgJsonResult;

/**
 * 头像裁剪
 * @param file
 */
function startClip(file) {
    document.getElementById("clip_wrapper").innerHTML = '<img id="clip_img"/>';
    img = $("#clip_img");
    var reader = new FileReader();
    reader.onload = function (e) {
        var imgFile = e.target.result;
        img.attr('src', imgFile);
        img.cropper({
            checkImageOrigin: true,
            aspectRatio: 1,
            autoCropArea: 0.6,
            strict: false,
            //crop: function (data) {
            //    imgJsonResult = [
            //        '{"x":' + data.x,
            //        '"y":' + data.y,
            //        '"height":' + data.height,
            //        '"width":' + data.width,
            //        '"rotate":' + data.rotate + '}'
            //    ].join();
            //},
            //built: function () {
            //    var canvas = img.cropper('getCroppedCanvas', {
            //        width: 50,
            //        height: 50
            //    });
            //    console.log(canvas.toDataURL);
            //}
        });
    };
    reader.readAsDataURL(file);
}

/**
 * 完成裁剪
 */
function submitClip() {
    if (img != null) {
        var canvas = img.cropper('getCroppedCanvas');
        var imgBase64 = canvas.toDataURL("image/jpeg", 1);
        $("#person_edit_head").attr("src", imgBase64).attr("isChange", "true");
    }
    stopClip();
    document.getElementById('clip').style.display = 'none';
}

/**
 * 重置裁剪工具
 */
function stopClip() {
    img.cropper('destroy');
    img.remove();
    img = null;
}
/*头像裁剪部分 end*/


