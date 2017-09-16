/**
 * Created by WangFeng on 2017-08-15.
 */
$(function () {

});

function Toast(msg, duration) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText = "background: rgb(0, 0, 0);\
                     opacity: 0.6;\
                     color: rgb(255, 255, 255);\
                     text-align: center;\
                     border-radius: 2rem;\
                     position: fixed;\
                     bottom: 20%;\
                     z-index: 999999;\
                     font-weight: 500;\
                     display: inline;\
                     padding-left: 0.556rem;\
                   	 padding-right: 0.556rem;\
					 padding-top: 0.278rem;\
					 padding-bottom: 0.278rem;\
                     font-family: 'Lucida Grande', 'Helvetica', sans-serif;  \
                     font-size: 0.722rem;";
    document.body.appendChild(m);
    m.style.left = ((document.body.clientWidth - m.offsetWidth) / 2) + 'px';
    setTimeout(function () {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d
            + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function () {
            document.body.removeChild(m)
        }, d * 1000);
    }, duration);
}

/* 获取上一个月
 *
 * @date 格式为yyyy年mm月dd日的日期，如：2017年08月18日
 */
function getPreMonth(date) {
    var year = date.getFullYear(); //获取当前日期的年份
    var month = date.getMonth() + 1; //获取当前日期的月份
    var day = date.getDate(); //获取当前日期的日
    var year2 = year;
    var month2 = parseInt(month) - 1;
    if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    return new Date(year2, month2, day2);
}

/**
 * 获取下一个月
 *
 * @date 格式为yyyy年mm月dd日的日期，如：2017年08月18日
 */
function getNextMonth(date) {
    var year = date.getFullYear(); //获取当前日期的年份
    var month = date.getMonth() + 1; //获取当前日期的月份
    var day = date.getDate(); //获取当前日期的日
    var year2 = year;
    var month2 = parseInt(month) + 1;
    if (month2 == 13) {
        year2 = parseInt(year2) + 1;
        month2 = 1;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }

    return new Date(year2, month2, day2);
}

/**
 * 获取人员信息
 * @param callback 结果回调函数
 */
function getPerson(callback) {
    //$.ajax({
    //    url: "http://192.168.31.99:8040/vote/getPerson",
    //    type: "get",
    //    dataType: "json",
    //    success: function (data, status, res) {
    //    },
    //    error: function (error) {
    //        console.log(error);
    //    }
    //});
    var jsonData = '[{' +
        '"id":"1001",' + // 人员id
        '"header":"王锋.jpg",' + // 头像
        '"name":"王锋",' + // 姓名
        '"job":"研发部-安卓工程师",' + // 所属部门-职务
        '"password":"123456",' + // 登录密码
        '"vote":true,' + // 选举权
        '"selected":true,' + // 被选举权
        '"assign":false,' + // 指定权
        '"admin":false' + // 管理员权限
        '},{' +
        '"id":"1002",' +
        '"header":"王锋.jpg",' +
        '"name":"王小明",' +
        '"job":"研发部-java工程师",' +
        '"password":"123456",' +
        '"vote":true,' +
        '"selected":true,' +
        '"assign":false,' +
        '"admin":false' +
        '},{' +
        '"id":"1003",' +
        '"header":"王锋.jpg",' +
        '"name":"吴成龙",' +
        '"job":"技术部-技术支持",' +
        '"password":"123456",' +
        '"vote":true,' +
        '"selected":true,' +
        '"assign":false,' +
        '"admin":false' +
        '},{' +
        '"id":"1004",' +
        '"header":"王锋.jpg",' +
        '"name":"张蕊洁",' +
        '"job":"研发部-测试工程师",' +
        '"password":"123456",' +
        '"vote":true,' +
        '"selected":true,' +
        '"assign":false,' +
        '"admin":false' +
        '},{' +
        '"id":"1005",' +
        '"header":"王锋.jpg",' +
        '"name":"田旭东",' +
        '"job":"技术部-技术支持",' +
        '"password":"123456",' +
        '"vote":true,' +
        '"selected":true,' +
        '"assign":false,' +
        '"admin":false' +
        '},{' +
        '"id":"1006",' +
        '"header":"王锋.jpg",' +
        '"name":"王小花",' +
        '"job":"研发部-前端工程师",' +
        '"password":"123456",' +
        '"vote":true,' +
        '"selected":true,' +
        '"assign":false,' +
        '"admin":false' +
        '},{' +
        '"id":"1007",' +
        '"header":"王锋.jpg",' +
        '"name":"赵越",' +
        '"job":"人事部-行政助理",' +
        '"password":"123456",' +
        '"vote":true,' +
        '"selected":true,' +
        '"assign":false,' +
        '"admin":false' +
        '},{' +
        '"id":"1008",' +
        '"header":"王锋.jpg",' +
        '"name":"大帅哥",' +
        '"job":"研发部-GO工程师",' +
        '"password":"123456",' +
        '"vote":true,' +
        '"selected":true,' +
        '"assign":false,' +
        '"admin":false' +
        '}]';
    callback.call(this, jsonData);
}

/**
 * 获取minio上的图片下载地址
 * @param name 文件名称
 * @param callback 回调函数
 */
function getImgOfMinio(name, id, callback) {
    $.ajax({
        url: "http://192.168.31.99:8040/oss/geturl",
        type: "get",
        data: {
            bucket: 'vote',
            objectname: name
        },
        dataType: "json",
        success: function (data, status, res) {
            var imgUrl = data.url;
            if (imgUrl) {
                callback.call(this, id, imgUrl);
            }
        },
        error: function (error) {
            console.log(error)
        }
    })
}
