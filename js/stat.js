/**
 * Created by WangFeng on 2017-08-18.
 */
window.onload = function () {
    $("#current").click();
};

var selected = '';

/**
 * 初始化
 * @param ctrx 当前点击或者选择的上下文
 */
function initStat(ctrx) {
    ctrx.childNodes[0].style.cssText = 'color: #49a3ef;';
    if (ctrx.id === selected)
        return;
    selected = ctrx.id;
    if (ctrx.id == "current") {
        document.getElementById("previous").childNodes[0].style.cssText = 'color: #9aa1a7;';
        getStatData("1");
    } else {
        document.getElementById("current").childNodes[0].style.cssText = 'color: #9aa1a7;';
        getStatData("2");
    }
}

/**
 * 从服务器获取实时推荐/历史推荐数据
 */
function getStatData(current) {
    //$.ajax({
    //    url: "http://192.168.31.99:8040/vote/getVote",
    //    type: "get",
    //    data: {
    //        current: current
    //    },
    //    dataType: "json",
    //    success: function (data, status, res) {
    //        putData(data);
    //    },
    //    error: function (error) {
    //        console.log(error);
    //    }
    //});

    var votePersons = [{
        id: "123456",
        name: "王小明",
        headName: "王锋.jpg",
        job: "研发部-WEB工程师",
        number: "4",
        votes: [{
            good: "最佳男主角",
            reason: "就是个超级笑星，惹得导演想笑"
        }, {
            good: "最佳推荐",
            reason: "推荐的很多个技术人才来公司上班，但全跑了"
        }, {
            good: "最佳笨蛋",
            reason: "笨的，不知道怎么开门，还把等搞坏了"
        }, {
            good: "优秀员工",
            reason: "获得本期优秀员工，不为别的"
        }]
    }, {
        id: "123457",
        name: "成小龙",
        headName: "王锋.jpg",
        job: "技术部-技术支持",
        number: "2",
        votes: [{
            good: "最佳支持",
            reason: "勤勤恳恳工作，累成狗，考试100分"
        }, {
            good: "最佳运维",
            reason: "各种运维问题，统统搞定，无所不能"
        }]
    }, {
        id: "123458",
        name: "成小龙",
        headName: "王锋.jpg",
        job: "技术部-技术支持",
        number: "2",
        votes: [{
            good: "最佳支持",
            reason: "勤勤恳恳工作，累成狗，考试100分"
        }, {
            good: "最佳运维",
            reason: "各种运维问题，统统搞定，无所不能"
        }]
    }];

    putViewData(votePersons);
}

/**
 * 设置界面数据
 * @param votes 数据
 */
function putViewData(votePersons) {
    console.log(votePersons);
    var list = document.getElementById("stat_list");
    var listHtml = '';
    for (var i = 0; i < votePersons.length; i++) {
        var votePerson = votePersons[i];
        var personId = votePerson.id;
        var name = votePerson.name;
        var headName = votePerson.headName;
        var headId = 'stat_head_' + i;
        var job = votePerson.job;
        var number = votePerson.number;
        var votes = votePerson.votes;
        var voteListHtml = '';
        if (votes) {
            for (var j = 0; j < votes.length; j++) {
                var vote = votes[j];
                var good = vote.good;
                var reason = vote.reason;
                voteListHtml = voteListHtml +
                    '<li>' +
                    '<div class="stat-item-info">' +
                    '<div class="info-title">' +
                    '<img src="../img/ic_title.png"/>' +
                    '<p>' + good + '</p>' +
                    '</div>' +
                    '<div class="info-describe">' +
                    '<p>' + reason + '</p>' +
                    '</div>' +
                    '</div>' +
                    '</li>';
            }
        }
        listHtml = listHtml + '<li class="stat-item">' +
            '<div class="stat-item-person">' +
            '<img id="' + headId + '" onerror="javascript:this.src=\'../img/ic_head_def.png\'"/>' +
            '<div class="stat-item-person-title">' +
            '<p class="person-p1">' + name + '</p>' +
            '<p class="person-p2">' + job + '</p>' +
            '</div>' +
            '<p class="stat-item-person-num">总票数：' + number + '票</p>' +
            '</div>' +
            '<div class="stat-line"></div>' +
            '<ul class="stat-info-list">' + voteListHtml + '</ul>' +
            '</li>';
        getImgOfMinio(headName, headId, setImg);
    }
    list.innerHTML = listHtml;
}

/**
 * 设置图片到界面 回调函数
 * @param id 图片控件的id
 * @param imgUrl 图片下载地址
 */
function setImg(id, imgUrl) {
    $('#' + id).attr('src', imgUrl);
}
