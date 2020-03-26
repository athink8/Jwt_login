/*登录的js*/

$(function () {
    /*密码登录表单中密码框旁的图标#eye转换 设置密码显示转换*/
    var $registEye = $(".eyes") /*包换两个按钮的div*/
    $registEye.click(function () {
        //密码登录表单中密码框旁的图标#eye转换 设置密码显示转换
        var $registpsd = $(this).siblings("input")  /*密码框*/
        var $registEyeOpen = $(this).children(":first") /*开眼*/
        var $registEyeClose = $(this).children(":last") /*闭眼*/
        $registEyeOpen.toggle()
        $registEyeClose.toggle()
        if ($registEyeClose.css("display") == "none") {
            //开眼
            $registpsd.attr("type", "text")
        } else if ($registEyeOpen.css("display") == "none") {
            //闭眼
            $registpsd.attr("type", "password")
        } else {
        }
    })

    var $formButts = $("#form-butts")   //获取切换的两个按钮
    var $psdLoginButt = $("#form-butts-psdLogin")   //密码登录按钮
    var $phoneLoginButt = $("#form-butts-phoneLogin")   //手机号登录按钮
    var $formPsdLogin = $("#form-login")     //密码登录表单
    var $formPhoneLogin = $("#form-phoneLogin")     //手机号登录表单
    var loginfbtn = $("#form-login-fbtn")   //忘记密码按钮
    var $loginrbtn = $("#form-login-rbtn")  //注册按钮
    var curindex = 0    /*当前下标 0为第一页  1为第二页*/
    var tarindex        /*目标下标 0为第一个按钮  1为第二个按钮*/

    /* 密码登录和手机号登录面板的切换
       按钮选择前颜色 color: #85B0F2; 表单隐藏
*      按钮选择后颜色 color: white; 表单选择*/
    $formButts.on("click", "a", null, function () {
        tarindex = $(this).index()
        if (tarindex != curindex) {
            alert("手机登录未开启 请使用密码登录 谢谢！")
            return
            $(this).css("color", "white")
            $(this).siblings("a").css("color", "#85B0F2")
            // 对于手机号登录下隐藏忘记密码按钮
            if (tarindex == 1) {
                $loginrbtn.css("margin-left", "77%")
                loginfbtn.hide()
            } else {
                $loginrbtn.css("margin-left", "52%")
                loginfbtn.show()
                // margin-left: 52%;
            }
            $formPsdLogin.toggle()
            $formPhoneLogin.toggle()
            curindex = tarindex;
        }
    })

    /*密码登录表单验证*/
    $("#form-login").validate({
        rules: {
            username: {
                required: true,
                minlength: 5
            },
            password: "required",
            validCode: "required",

        },
        errorPlacement: function (error, element) {
            // Append error within linked label
            $(element)
                .closest("form")
                .find("label[for='" + element.attr("id") + "']")
                .append(error);
        },
        errorElement: "span",
        submitHandler: function (form) {
            //登录表单
            loginUser()
        }
    })
    /*手机号登录表单验证*/
    $("#form-phoneLogin").validate({
        rules: {
            phoneNumber: {
                required: true,
                number: true,
                minlength: 11,
                maxlength: 11
            },
            PvalidCode: "required",
        },
        errorPlacement: function (error, element) {
            // Append error within linked label
            $(element)
                .closest("form")
                .find("label[for='" + element.attr("id") + "']")
                .append(error);
        },
        errorElement: "span",
        messages: {
            phoneNumber: {
                minlength: "请输入11位手机号",
                maxlength: "请输入11位手机号"
            }
        }
    })

    var myUrl = $("#myUrl").val().split("#"); //获取访问的url
    //ajax方式提交表单
    function loginUser() {
        var publicKey = $("#pk").val();
        var encrypt = new JSEncrypt();
        //设置公钥
        encrypt.setPublicKey(publicKey);
        // console.log(publicKey)
        //加密
        var username = encodeURI(encrypt.encrypt($("#username").val())).replace(/\+/g, '%2B');
        var password = encodeURI(encrypt.encrypt($("#password").val())).replace(/\+/g, '%2B');
        var loginAuto = $("#loginAuto").get(0).checked;
        // console.log(loginAuto)
        var formDatas = "username=" + username + "&" + "password=" + password + "&loginAuto=" + loginAuto
            + "&urlName=" + myUrl[0] + "&urlId=" + myUrl[1];
        // console.log(""+formDatas)
        console.log("myurl=" + myUrl)
        $.ajax({
            url: "/user/pd?" + formDatas,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if (data == "1") {
                    alert("登录成功！")
                    //console.log("le: " + myUrl.length)
                    if (myUrl.length > 0) {
                        window.location.href = myUrl[0]
                    } else {
                        window.location.href = 'index'
                    }
                } else if (data == "0") {
                    $('.verify-code').click();
                    $("#userNameLabel").empty();
                    $("#userNameLabel").append("<span id=\"username-error\" class=\"error\">账号或密码错误 请重新输入</span>")
                } else {
                    window.location.reload();
                    $('.verify-code').click();
                    alert("该网址未授权 请联系管理员");
                }
            },
            error: function () {
                alert("服务器错误 请联系管理员呀！！")
            }
        })
    }

    /*切换点击注册按钮时*/
    $("#form-login-rbtn").on("click", function () {
        window.location.href = "/regist?urlName=" + myUrl[0] + "&urlId=" + myUrl[1]
    })

    /*密码登录 验证码 调用插件 直接修改了源文件65 74行*/
    $('#validCodeImg').codeVerify({
        // 类型为数字运算验证码
        type: 2,
        figure: 100,	//位数，仅在type=2时生效
        arith: 0,	//算法，支持加减乘，不填为随机，仅在type=2时生效
        width: '100px',
        height: '35px',
        fontSize: '15px',
        btnId: '',
        ready: function () {
        },
        success: function () {
            // console.log("验证匹配！")
        },
        error: function () {
            $("#form-login1-validCode").siblings("label")
                .empty()
                .append('<span id="validCode-error" class="error">验证码错误</span>')
                .focus()
        }
    });

    //模拟随机获得验证码
    function getRandom() {
        var ws = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
        var validCode = ws[Math.floor(Math.random() * 100) % 28 + 1] + ws[Math.floor(Math.random() * 100) % 28 + 1]
            + ws[Math.floor(Math.random() * 100) % 28 + 1] + ws[Math.floor(Math.random() * 100) % 28 + 1]
        return validCode
    }

    /*手机号登录 获取验证码模拟*/
    $("#getvalidCodeImg").click(function () {
        var validCode = getRandom()
        alert("验证码随机模拟:  " + validCode)
    });
    /*第一次刷新页面也开始加载验证码*/
    /*$("#validCodeImg>img").hide()
    $("#validCodeImg>span").html(getRandom())*/
    /*密码登录 验证码模拟*/
    /*$("#validCodeImg").click(function () {
        var validCode = getRandom()
        $("#validCodeImg>img").hide()
        $("#validCodeImg>span").html(validCode)
    })*/

    /*第三方登录*/
    $("#other-login-btns").on("click", "a", null, function () {
        // 开启弹框
        if ($(document).width() < 700) {
            alert("@..@！该接口未连接！")
        } else {
            $("#myFrameDiv").show("fast")
            $("#back").show()
        }
    });

    /*图片验证码 修改源码280行等等 ../img */
    $('#myFrameDiv').slideVerify({
        type: 2,		//类型
        vOffset: 3,	//误差量，根据需求自行调整
        vSpace: 5,	//间隔
        imgName: ["10.jpg", "11.jpeg", "1.jpeg", "2.jpeg", "3.jpg"],
        imgSize: {
            width: '400px',
            height: '250px',
        },
        blockSize: {
            width: '50px',
            height: '50px',
        },
        barSize: {
            width: '400px',
            height: '40px',
        },
        ready: function () {
        },
        success: function () {
            alert('恭喜你验证通过 棒棒哦！');
            $("#myFrameDiv").hide("fast")
            $("#back").hide()
            location.reload()
            //......后续操作
        },
        error: function () {
        }

    });

    /*关闭弹框*/
    $("#closeMyFrameDiv").on("click", function () {
        $("#myFrameDiv").hide("fast")
        $("#back").hide()
    })


    /*获取系统时间*/
    // console.log($('#nowTime').html())
    setInterval(function () {
        $('#nowTime').html(new Date().toLocaleString())
    }, 1000);

    /*最后了*/
});