/**
 * Created by kang on 2015/10/26.
 */
;
(function ($) {

    /**
     * 变量初始化
     * @type {string}
     */
    var OpenID     = getURLParam('OpenID'),
        activityID = getURLParam('activityID');

    /**
     * 让pacman前进到指定的步骤
     * @param mockData
     */
    function gotoStep(mockData) {
        // init
        var gameContainer    = $('.gameContainer'),
            stepStart        = 'step' + mockData.data.currentAction.start,
            stepEnd          = 'step' + mockData.data.currentAction.end,
            hasGift          = mockData.data.currentAction.hasGift,
            character        = gameContainer.find('.character'),
            pacman           = gameContainer.find('.character .pacman'),
            pacman_frontface = gameContainer.find('.character .pacman-frontface');

        // reset pacman到初始位置
        gameContainer.removeClass('step0 step1 step2 step3 step4 step5');
        gameContainer.addClass(stepStart);

        // 将pacman移动到目标位置
        setTimeout(function () {
            (function () {
                character.addClass('animated');
                gameContainer.removeClass(stepStart)
                    .addClass(stepEnd);
            })();
        }, 1000);

        // 如果当前位置有礼物, 则pacman切换到笑脸
        setTimeout(function () {
            (function () {
                if (hasGift) {
                    pacman.hide();
                    pacman_frontface.show();
                }
                //gift.addClass('active');
            })();
        }, 2500);

        // 显示礼物弹窗 & 表单弹窗 (如果当前位置没有礼物, 则显示下一个即将获得的礼物, 并提醒还需要几步)
        setTimeout(function () {
            (function () {
                $('.formContainer').addClass('animated fadeInUp');
                if (hasGift) {
                    $('.giftContainer').addClass('animated fadeInDown');
                }
                if (isJoinedMember) {
                    $('.formRate').show();
                } else {
                    $('.formGetGift').show();
                }
            })();
        }, 3600);

    }

    /**
     * 从url上获取URL上指定的参数
     * @returns {*} 如果存在此参数, 则返回参数对应的值; 如果找不到
     */
    function getURLParam(strParamName) {
        var strSearch = location.search.substring(1);
        if (strSearch.indexOf(strParamName + '=') != -1) {
            return strSearch.split(strParamName + '=')[1].split('&')[0]
        } else {
            return -1;
        }
    }

    $(function () {

        /**
         * 页面加载时, 根据url param指定的step, 移动到目标位置
         */
            // 向后端发送用户输入的信息, 获取后端返回的兑换码
        $.ajax({
            /*url     : "api/getActivityInfo_newUser.json",*/
            url     : "http://123.56.8.204/Customer/GetActivityDetail",
            data    : {
                "OpenID"    : OpenID,
                "activityID": activityID
            },
            success : function (result) {

                var mockData = {
                    "code"   : "0",
                    "message": "",
                    "data"   : {
                        "user"         : {
                            "isNewUser" : true,
                            "OpenID"    : "o6_bmjrPTlm6_2sgVt7hMZOPfL2M",
                            "nickname"  : "Band",
                            "sex"       : 1,
                            "headimgurl": "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0"
                        },
                        "currentAction": {
                            "start"  : 0,
                            "end"    : 1,
                            "hasGift": true
                        },
                        "giftList"     : [
                            {
                                "giftInfo": {
                                    "name"       : "橙汁",
                                    "description": "柑橘类果汁，特别是橙汁中的黄酮能有效抑制乳腺癌、肺癌等细胞的增生。经常饮用橙汁也可以有效预防某些慢性疾病、维持心肌功能以及降低血压。研究显示，每天喝3杯橙汁可以增加体内高密度脂蛋白（HDL）的含量，从而降低患心脏病的可能。此外，在服药期间吃一些橙子或饮橙汁，可增加机体对药物的吸收量，从而使药效加倍。",
                                    "photo"      : "http://p0.55tuanimg.com/static/goods/ckeditor/2013/02/04/17/ckeditor_1359971186_8668_wm.jpg"
                                }
                            },
                            {},
                            {
                                "giftInfo": {
                                    "name"       : "蓝莓汁",
                                    "description": "蓝莓被联合国粮农组织列为人类五大健康食品之一，被誉为“21世纪功能性保健浆果”，蓝莓果汁含有丰富的维生素和氨基酸，蓝莓果汁含有丰富的花青素，具有清除氧自由基、保护视力、延缓脑神经衰老、提高记忆力的作用。由于蓝莓对保护和增强视力的独到效果，蓝莓又被称为“飞行员的早餐”，是英、美空军指定的飞行员指定早餐食品。",
                                    "photo"      : "http://p1.meituan.net/deal/fbd19498af14fa6f63aa4be2c54995e653001.jpg"
                                }
                            },
                            {},
                            {
                                "giftInfo": {
                                    "name"       : "卡布奇诺",
                                    "description": "20世纪初期，意大利人阿奇布夏发明蒸汽压力咖啡机的同时，也发展出了卡布奇诺咖啡。卡布奇诺是一种加入以同量的意大利特浓咖啡和蒸汽泡沫牛奶相混合的意大利咖啡。此时咖啡的颜色，就像卡布奇诺教会的修士在深褐色的外衣上覆上一条头巾一样，咖啡因此得名。",
                                    "photo"      : "http://c.hiphotos.baidu.com/baike/w%3D268/sign=11a04d3eccfc1e17fdbf8b377290f67c/0b7b02087bf40ad130d03dcb542c11dfa9eccee6.jpg"
                                }
                            }
                        ]
                    }
                };

                gotoStep(mockData);

            },
            error   : function (XMLHttpRequest, textStatus, errorThrown) {
                // 与后端通信出现错误, 重新启用领取按钮
                $('.J_GetGift').text('重新领取').removeProp('disabled');
                alert('啊哦, 出现错误了, 请稍后再试~ \n错误代码: ' + textStatus)
            },
            complete: function () {

            }
        });

        // 点击 "领取礼物" 按钮时获得兑换码, 同时切换显示用户反馈提示框
        $('.J_GetGift').on('click', function () {

            // 非空判断
            var inputUserName   = $('.formGetGift .userName'),
                inputUserMobile = $('.formGetGift .userMobile'),
                userName        = inputUserName.val(),
                userMobile      = inputUserMobile.val();
            /*if ($.trim(userName) == "") {
             alert('请输入您的名字~');
             inputUserName.focus();
             return false;
             } else if ($.trim(userMobile).length > 5) {
             alert('您输入的内容过长~');
             inputUserMobile.focus();
             return false;
             } else if ($.trim(userMobile) == "") {
             alert('请输入您的手机号码, 方便领取礼品~');
             inputUserMobile.focus();
             return false;
             } else if ($.trim(userMobile).length != 11) {
             alert('请输入正确的11位手机号~');
             inputUserMobile.focus();
             return false;
             }*/

            // 与后端通信之前, 禁用领取按钮, 避免重复提交
            $('.J_GetGift').text('请稍候...').prop('disabled', 'disabled');

            // 向后端发送用户输入的信息, 获取后端返回的兑换码
            $.ajax({
                url     : "api/getRedeemCode_newUser.json",
                data    : {
                    "userName"  : userName,
                    "userMobile": userMobile
                },
                success : function (result) {
                    debugger;
                    var btnGetGift = $('.J_GetGift');

                    // 与后端通信出现错误, 提醒用户并重新启用领取按钮
                    if (result.error != "0") {
                        btnGetGift.text('重新领取').removeProp('disabled');
                        alert('啊哦, 好像出了点问题, 请稍后再试~ \n代码: ' + result.error);
                    }

                    // 获取兑换码成功
                    btnGetGift.text('恭喜! 获得礼品兑换码成功! :)');
                    $('.redeemCode .noCode').hide();
                    $('.redeemCode .codeGet .code').text(result.data.redeemCode).css('color', 'red');
                    $('.redeemCode .codeGet').show().addClass('animated bounceIn');
                    setTimeout(function () {
                        $('.redeemCode .codeGet').removeClass('bounceIn').addClass('flash');
                    }, 1000);
                    setTimeout(function () {
                        $('.formGetGift').hide();
                        $('.formRate').fadeIn();
                    }, 2000);

                },
                error   : function (XMLHttpRequest, textStatus, errorThrown) {
                    // 与后端通信出现错误, 重新启用领取按钮
                    $('.J_GetGift').text('重新领取').removeProp('disabled');
                    alert('啊哦, 出现错误了, 请稍后再试~ \n错误代码: ' + textStatus)
                },
                complete: function () {

                }
            });

        });

        // 用户反馈成功后, 显示"查看更多"按钮
        $('.formRate .J_RateDown, .formRate .J_RateUp').on('click', function () {
            $(this).parent().siblings('p').css('visibility', 'hidden');
            $(this).siblings('.button').hide();
            $(this).text('查看更多精彩')
        });

    });

})(jQuery);