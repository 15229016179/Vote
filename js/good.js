/**
 * Created by WangFeng on 2017-08-18.
 */

var id;
var votedPerson = new Array();// 已推荐过得人员id数组
var selectPersonId; // 要推荐的人员id
var good; // 优秀称号
var reason; // 推荐理由

$(function () {
    initUser();
    // 界面初始化操作
    initInform();
    initTitle();
    getPerson(initPerson);
    initLongClick();
});

/**
 * 用户初始化，是否登录
 */
function initUser() {
    var loginTimeStr = localStorage.getItem("loginTime");
    if (loginTimeStr) {
        var loginTime = parseFloat(loginTimeStr);
        if (loginTime + (1000 * 60 * 2) >= new Date().getTime()) { // 检查登录是否过期
            id = localStorage.getItem("id");
            return;
        }
    }
    // 重置登录，显示登录界面
    localStorage.clear();
    var login = document.getElementById('login');
    var bg = document.getElementById('login_bg');
    var content = document.getElementById('login_content');
    bg.style.height = ($(window).height() - bg.offsetTop) + 'px';
    content.style.height = ($(window).height() - content.offsetTop) + 'px';
    login.style.height = ($(window).height() - login.offsetTop) + 'px';
    login.style.display = 'inline';

    initVote();
}

/**
 * 检查已推荐人员
 */
function initVote() {
    //$.ajax({
    //    url: "http://192.168.31.99:8040/vote/getSelected",
    //    type: "get",
    //    data: {
    //        personId: id,
    //    },
    //    dataType: "json",
    //    success: function (data, status, res) {
    //    },
    //    error: function (error) {
    //        console.log(error);
    //    }
    //});
    votedPerson.push("1002");
    var assign = localStorage.getItem("assign");
    // 更改推荐提交按钮样式及状态，已推荐完成后按钮禁用
    if (assign === "true" || votedPerson.length == 1) {
        document.getElementById("submit").innerHTML = "完成推荐";
    } else if (votedPerson.length == 2) {
        document.getElementById("submit").innerHTML = "";
        document.getElementById("submit").style.cssText = 'color: #fff;background: #e4e5e6;border: none;';
        document.getElementById("submit").disabled = "disabled";
    }
}

/**
 * 用户登录
 */
function login() {
    var name = $("#login_name").val();
    var password = $("#login_password").val();
    if (!name) {
        Toast("请输入姓名", 2000);
        return;
    }
    if (!password) {
        Toast("请输入登录密码", 2000);
        return;
    }
    //$.ajax({
    //    url: "http://192.168.31.99:8040/vote/login",
    //    type: "post",
    //    data: {
    //        name: name,
    //        password: password
    //    },
    //    dataType: "json",
    //    success: function (data, status, res) {
    //    },
    //    error: function (error) {
    //        console.log(error);
    //    }
    //});
    localStorage.setItem("id", "123456");
    localStorage.setItem("vote", "true");
    localStorage.setItem("selected", "true");
    localStorage.setItem("assign", "false");
    localStorage.setItem("admin", "true");
    localStorage.setItem("loginTime", new Date().getTime());
    $(".login").css("display", "none");

    initUser();
}

/**
 * 初始化公告信息
 */
function initInform() {
    $.ajax({
        url: "http://192.168.31.99:8040/vote/getInform",
        type: "get",
        dataType: "json",
        success: function (data, status, res) {
            var inform = data.inform;
            if (inform) {
                $(".index-top-inform").css("display", "inline");
                document.getElementById("marquee_inform").innerHTML = inform;
            } else {
                $(".index-top-inform").css("display", "none");
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

/**
 * 初始化头部信息
 */
function initTitle() {
    var todayLast = getPreMonth(new Date());
    var yyyyL = todayLast.getFullYear();
    var MML = todayLast.getMonth();
    var date = new Date();
    var MM = date.getMonth() + 1;
    document.getElementById('periods').innerHTML = (yyyyL + '年' + MML + '月优秀员工评选');
    document.getElementById('endDate').innerHTML = '本期评选起止日期：' + MM + '月1日-' + MM + '月3日';
}

/**
 * 初始化人员信息
 */
function initPerson(jsonData) {
    var personnel = JSON.parse(jsonData);
    console.log(personnel);
    var personnelView = document.getElementById("personnel");
    var personnelHtml = '';
    for (var i = 0; i < personnel.length; i++) {
        var person = personnel[i];
        var id = person.id;
        var header = person.header;
        var headId = 'index_head_' + i;
        var name = person.name;
        var job = person.job;
        var button = "推&nbsp;&nbsp;荐";
        var style = "";
        var disabled = '';
        if (votedPerson) {
            // 检查这个人是不是已经被推荐过
            for (var j = 0; j < votedPerson.length; j++) {
                if (votedPerson[j] == id) {
                    button = "已&nbsp;推&nbsp;荐";
                    style = "color: #fff;background: #e4e5e6;border: none;";
                    disabled = 'disabled="disabled"';
                }
            }
        }
        personnelHtml = personnelHtml +
            '<li class="persons-item">' +
            '<div class="persons-item-content">' +
            '<img id="' + headId + '" onerror="javascript:this.src=\'../img/ic_head_def.png\'"/>' +
            '<div class="persons-item-content-person">' +
            '<p class="person-p1" id="person_name">' + name + '</p>' +
            '<p class="person-p2" id="person_title">' + job + '</p>' +
            '</div>' +
            '<button class="persons-item-content-select" onclick="changePersonSelect(this)" id="' + id + '" style="' + style + '" ' + disabled + '>' + button + '</button>' +
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
 * 改变人员推荐按钮选择状态
 * @param ctrx 被点击的按钮
 */
function changePersonSelect(ctrx) {
    $(".persons-item-content-select").css('color', '#49a3ef').css('background', '#fff').css('border', '1px solid #49a3ef');
    if (votedPerson) {
        // 检查这个人是不是已经被推荐过
        for (var i = 0; i < votedPerson.length; i++) {
            document.getElementById(votedPerson[i]).style.cssText = "color: #fff;background: #e4e5e6;border: none;";
        }
    }
    ctrx.style.cssText = 'color: #fff;background: #49a3ef;border: none';
    selectPersonId = ctrx.id;
}

/**
 *
 * @type {number}
 */
var timeOutEvent = 0;
/**
 * 初始化优秀称号按钮点击及长按事件
 */
function initLongClick() {
    $(".goods-select-button").on({
        touchstart: function (e) {
            var _this = $(this);
            $(".goods-other").attr('style', 'display: none');
            $(".goods-select-button").css('color', '#606468').css('background', '#e4e5e6');
            _this.attr('style', 'color: #fff;background: #49a3ef;');
            good = _this.text();
            if (_this.text() == '其它称号') {
                $(".goods-other").attr('style', 'display: inline');
                good = '';
            }
            timeOutEvent = setTimeout(function () {
                longPress(_this)
            }, 500);
            e.preventDefault();
        },
        touchmove: function () {
            clearTimeout(timeOutEvent);
            timeOutEvent = 0;
        },
        touchend: function () {
            clearTimeout(timeOutEvent);
            return false;
        }
    })
}

/**
 * 优秀称号按钮长按
 * @param ctrx
 */
function longPress(ctrx) {
    timeOutEvent = 0;

    var title = ctrx.text();
    var content = '';
    switch (title) {
        case '最佳进步':
            content = '积极研究改善工作方法，提高工作效率或减低成本确有成效者';
            break;
        case '最佳科技':
            content = '申报各类知识产权、版权及科技类奖项者';
            break;
        case '最佳工程':
            content = '工程质量满足客户要求并能将相关资料整理归档为完整的优秀项目案例者';
            break;
        case '最佳销售':
            content = '超额完成销售目标者';
            break;
        case '最佳协作':
            content = '沟通能力强，能主动帮助其他员工改善工作或在精神上予以积极疏导者';
            break;
        case '最佳节约':
            content = '工作时，能带头节约，降低部门、公司成本，节约能源者';
            break;
        case '好人好事':
            content = '有见义勇为、热心公益、志愿服务或弘扬美德和正能量者';
            break;
        case '最佳主人翁':
            content = '对违反制度员工提出指正或主动维护公司环境卫生者';
            break;
        case '最佳宣传':
            content = '通过各种渠道主动宣传公司，提高公司名誉度者';
            break;
        case '最佳内推':
            content = '通过各种渠道推荐合适人才通过公司选拔成功入职者';
            break;
        default:
            return;
    }
    showWindow(title, content);
}

/**
 * 显示月度优秀员工评选制度窗口
 */
function showWord() {
    var title = '《月度优秀员工评选制度(试行)》';
    var content = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;通过评选工作，旨在突出先进，激励公司全员的工作积极性和创新创造，鼓励员工快速成长，肯定成长业绩和贡献，在活跃工作氛围的基础上，更好的推动公司目标的实现。' +
        '<br/>一、评选原则' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;从工作业绩、协作能力、客户服务、先进事迹、节流增效、创新创造等方面综合评选。' +
        '<br/>二、评选对象' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在本公司工作满2个月以上（含2个月）的正式员工。' +
        '<br/>三、评选名额' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;每月公司评选2名先进员工。' +
        '<br/>四、评选方式' +
        '<br/>&nbsp;&nbsp;&nbsp;1、由高层管理者推荐1名员工作为优秀员工；' +
        '<br/>&nbsp;&nbsp;&nbsp;2、由每位员工填写《西安圣点世纪科技有限公司月度优秀员工评选表》 ，根据月绩效考核得分、综合考核得分，经人事部统计总分最高的员工获选。' +
        '<br/>五、评选标准及方法' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;员工月评分=月绩效考核评分+综合考核评分；' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;员工月评分最高者获选为月度优秀员工。' +
        '<br/>&nbsp;&nbsp;&nbsp;1、	月绩效考核评分：50分' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;月绩效得分为96-100分，本项评选得分为50分；' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;月绩效得分为91-95分，本项评选得分为45分；' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;月绩效得分为86-90，本项评选得分为40分；' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;月绩效得分为81-85，本项评选得分为35分；' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;月绩效得分为80（含）以下，为绩效不达标，不参与该月优秀员工评选。' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;公司每月或每季度会组织绩效面谈，及时和员工沟通绩效结果，帮助员工提升绩效，改进工作效果。' +
        '<br/>&nbsp;&nbsp;&nbsp;2、	综合考核评分：50分（评分标准详见附表1）' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;每位员工根据评分标准及工作表现推选2名符合标准的候选人，标明其所符合的优秀称号并简要描述评选原因，人事部按得票率×该项评分统计选出前两名；' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;优秀称号（包括但不限于）：' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;最佳进步：积极研究改善工作方法，提高工作效率或减低成本确有成效者；' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;最佳科技：申报各类知识产权、版权及科技类奖项者；' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;最佳工程：工程质量满足客户要求并能将相关资料整理归档为完整的优秀项目案例者；' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;最佳销售：超额完成销售目标者；' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;最佳协作：沟通能力强，能主动帮助其他员工改善工作或在精神上予以积极疏导者；' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;最佳节约：工作时，能带头节约，降低部门、公司成本，节约能源者；' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;好人好事：有见义勇为、热心公益、志愿服务或弘扬美德和正能量者；' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;最佳主人翁：对违反制度员工提出指正或主动维护公司环境卫生者；' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;最佳宣传：通过各种渠道主动宣传公司，提高公司名誉度者；' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;最佳内推：通过各种渠道推荐合适人才通过公司选拔成功入职者。' +
        '<br/>六、奖励办法' +
        '<br/>&nbsp;&nbsp;&nbsp;1、忙时：获优秀员工称号的员工，给予500元奖励；' +
        '<br/>&nbsp;&nbsp;&nbsp;2、非忙时：获优秀员工称号的员工，给予300元奖励；' +
        '<br/>&nbsp;&nbsp;&nbsp;3、该奖励将作为个人晋升的依据。' +
        '<br/>七、注意事项' +
        '<br/>&nbsp;&nbsp;&nbsp;1、每月3日前请各位职工将上月优秀员工评选表报送至人事部，15日前将结果进行公布；' +
        '<br/>&nbsp;&nbsp;&nbsp;2、评选表会以邮件形式发送，禁止乱填写表格或查看他人评分等扰乱公平评选现象，如有违反一经发现则当事人参与的活动数据均无效并且两个月内停止参与本活动；' +
        '<br/>&nbsp;&nbsp;&nbsp;3、月绩效得分为80（含）以下，为绩效不达标，不参与该月优秀员工评选；' +
        '<br/>&nbsp;&nbsp;&nbsp;4、所有绩效奖金仅属个人所有，本部门工作人员不得以任何形式要求分享；' +
        '<br/>&nbsp;&nbsp;&nbsp;5、希望所有员工能够热爱本职工作、努力创新、与时俱进，为公司发展做出贡献。' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本管理制度自2017年7月1日起执行。' +
        '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本制度解释权属西安圣点世纪科技有限公司。';
    showWindow(title, content);
}

/**
 * 显示信息窗口
 * @param title
 * @param content
 */
function showWindow(title, content) {
    var text = document.getElementById('text');
    var text_bg = document.getElementById('text_bg');
    var text_content = document.getElementById('text_content');
    var text_window = document.getElementById('text_window');
    var info = document.getElementById('text_content_info');
    text_bg.style.height = ($(window).height() - text_bg.offsetTop) + 'px';
    text_content.style.height = ($(window).height() - text_content.offsetTop) + 'px';
    text_window.style.maxHeight = ($(window).height() - 40) + 'px';
    info.style.maxHeight = ($(window).height() - (4 * 36)) + 'px';
    text.style.height = ($(window).height() - text.offsetTop) + 'px';
    text.style.display = 'inline';

    document.getElementById("text_title").innerHTML = title;
    info.innerHTML = content;
}

/**
 * 关闭弹窗
 */
function closeWindow() {
    document.getElementById('text').style.display = 'none';
}

/**
 * 提交推荐
 */
function submitVote() {
    var vote = localStorage.getItem("vote");
    if(vote === "false"){
        Toast("您没有推荐权！")
        return;
    }
    if (!selectPersonId) {
        Toast("请选择要推荐的人", 2000);
        return;
    }
    if (!good) {
        good = $("#goods_other").val();
        if (!good) {
            Toast("请选择或填写优秀称号", 2000);
            return;
        }
    }
    reason = $("#goods_reason").val();
    if (!reason) {
        Toast("请填写推荐理由", 2000);
        return;
    }
    //$.ajax({
    //    url: "http://192.168.31.99:8040/vote/vote",
    //    type: "post",
    //    data: {
    //        personId: userId,
    //        selectPersonId: selectPersonId,
    //        good: good,
    //        reason: reason
    //    },
    //    dataType: "json",
    //    success: function (data, status, res) {
    //    },
    //    error: function (error) {
    //        console.log(error);
    //    }
    //});
    votedPerson.push(selectPersonId);
}