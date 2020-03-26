/*注册的js/*登录的js*/

$(function () {

    // 密码显示和隐藏
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

    /*注册表单验证 和提交表单控制*/
    $("#form-regist").validate({
        rules: {
            username: {
                required: true,
                // rangelength: [5, 20],
                email: true,
                remote: {
                    url: "/user/username",                   //后台处理程序
                    type: "GET",               //数据发送方式
                    dataType: "json",           //接受数据格式
                },
            },
            phone: {
                required: true,
                number: true,
                minlength: 11,
                maxlength: 11
            },
            validCode: {
                required: true
            },
            password: {
                required: true,
                minlength: 6
            },
            password2: {
                required: true,
                equalTo: "#password"
            },
            name: {
                required: true,
            }
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
            username: {remote: "该账号已存在"},
            phoneNum: {
                minlength: "请输入11位手机号码",
                maxlength: "请输入11位手机号码",
                number: "请输入合法手机号"
            },

        },
        submitHandler: function (form) {
            //检查并提交表单
            checkUserRead()
        }

    })

    /*检查是否勾选了阅读协议 并ajax提交表单*/
    var myUrl = $("#myUrl").val().split("#"); //获取访问的url
    function checkUserRead() {
        var isTure = $("#UserReadSure").prop('checked') //选中了位true 未选中为 false
        if (!isTure) {
            $("#UserReadSure").hide(50)
            $("#UserReadSure").show(50)
        }

        var publicKey = $("#pk").val();
        var encrypt = new JSEncrypt();
        //设置公钥
        encrypt.setPublicKey(publicKey);
        //加密
        var username = encodeURI(encrypt.encrypt($("#username").val())).replace(/\+/g, '%2B');
        var name = encodeURI(encrypt.encrypt($("#name").val())).replace(/\+/g, '%2B');
        var phone = encodeURI(encrypt.encrypt($("#phone").val())).replace(/\+/g, '%2B');
        var password = encodeURI(encrypt.encrypt($("#password").val())).replace(/\+/g, '%2B');

        var formDatas = "username=" + username + "&" + "name=" + name + "&" + "phone=" + phone + "&" + "password=" + password
            + "&urlName=" + myUrl[0] + "&urlId=" + myUrl[1]
        // console.log(formDatas)
        if (isTure) {
            $.ajax({
                url: "/user",
                type: "POST",
                dataType: "json",
                data: formDatas,
                success: function (data) {
                    if (data == "1") {
                        alert("注册成功 请前往邮箱激活账号 ！")
                        if (myUrl.length > 0) {
                            window.location.href = myUrl[0]
                        } else {
                            window.location.href = 'index'
                        }
                    }  else if (data == "0") {
                        $("#userNameLabel").empty()
                        $("#userNameLabel").append("<span id=\"username-error\" class=\"error\">注册失败 请重试</span>")
                    }else {
                        window.location.reload();
                        $('.verify-code').click();
                        alert("该网址未授权 请联系管理员");
                    }
                },
                error: function () {
                    console.log("服务器错误 请联系管理员呀！！")
                }
            })
        }
        return false
    }

    /*切换点击登录按钮时*/
    $("#login-btn").on("click", function () {
        window.location.href = "/login?urlName=" + myUrl[0] + "&urlId=" + myUrl[1]
    })

    /*模拟随机获得验证码*/
    function getRandom() {
        var ws = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
        var validCode = ws[Math.floor(Math.random() * 100) % 28 + 1] + ws[Math.floor(Math.random() * 100) % 28 + 1]
            + ws[Math.floor(Math.random() * 100) % 28 + 1] + ws[Math.floor(Math.random() * 100) % 28 + 1]
        return validCode
    }

    /*手机号登录 获取验证码*/
    $("#validCodeImg").click(function () {
        var validCode = getRandom()
        alert("验证码随机模拟:  " + validCode)
    })

    // 获取系统时间
    console.log($('#nowTime').html())
    setInterval(function () {
        $('#nowTime').html(new Date().toLocaleString())
    }, 1000);

    /*最后了*/
})