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
         * @param objActivity
         */
        function gotoStep(objActivity) {
            // init
            var gameContainer    = $('.gameContainer'),
                stepStart        = 'step' + objActivity.data.currentAction.start,
                stepEnd          = 'step' + objActivity.data.currentAction.end,
                hasGift          = objActivity.data.currentAction.hasGift,
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
            if (hasGift) {
                setTimeout(function () {
                    (function () {
                        pacman.hide();
                        pacman_frontface.show();
                        //gift.addClass('active');
                    })();
                }, 2500);
            }

            // 显示礼物弹窗 & 表单弹窗 (如果当前位置没有礼物, 则显示下一个即将获得的礼物, 并提醒还需要几步)
            setTimeout(function () {
                (function () {
                    // 表单弹窗
                    $('.formContainer').addClass('animated fadeInUp');
                    // 礼物弹窗
                    if (hasGift) {
                        $('.giftContainer').addClass('animated fadeInDown');
                    }
                    // 如果是新用户, 则表单弹窗里的内容为填写姓名手机号;
                    // 如果是老用户, 则直接给用户评价选项(满意/不满意).
                    if (objActivity.data.user.isNewUser) {
                        $('.formGetGift').show();
                    } else {
                        $('.formRate').show();
                    }
                })();
            }, 3600);

        }

        /**
         * 根据提供的礼物数据, 初始化活动
         * TODO: GiftDes desc少了个c
         * TODO: 步骤一行5个, 有可能一行2步/3步/4步望着天吗?
         * TODO: 如果每行步骤不一定是5个, 那么就需要考虑 根据返回的json动态填充.separateGiftLayer
         * @param giftList {Array} 礼物列表
         */
        var initGiftInfo = function (giftList) {
            // init
            var gameContainer = $('.gameContainer');

            $.each(gameContainer.find('.gift'), function(index, giftNode){
                var currentGiftItem = $(giftNode);
                debugger;
                if (giftList[index].GiftName == '') {
                    currentGiftItem.hide();
                } else {
                    currentGiftItem.css('background-image', 'url(' + giftList[index]['GiftLogo'] + ')');
                    // 把拿到的数据存放在node节点上
                    // 当前第几步
                    currentGiftItem.attr('data-step', giftList[index]['RegCount']);
                    // 礼物名称
                    currentGiftItem.attr('data-name', giftList[index]['GiftName']);
                    // 礼物图片
                    currentGiftItem.attr('data-logo', giftList[index]['GiftLogo']);
                    // 礼物简介
                    currentGiftItem.attr('data-desc', giftList[index]['GiftDes']);
                    /*var json = {
                     ActivityID: "53",
                     GiftDes: "柑橘类果汁，特别是橙汁中的黄酮能有效抑制乳腺癌、肺癌等细胞的增生。经常饮用橙汁也可以有效预防某些慢性疾病、维持心肌功能以及降低血压。研究显示，每天喝3杯橙汁可以增加体内高密度脂蛋白（HDL）的含量，从而降低患心脏病的可能。此外，在服药期间吃一些橙子或饮橙汁，可增加机体对药物的吸收量，从而使药效加倍。",
                     GiftLogo: "http://p0.55tuanimg.com/static/goods/ckeditor/2013/02/04/17/ckeditor_1359971186_8668_wm.jpg",
                     GiftName: "橙汁",
                     ID: "137",
                     RegCount: "1"
                     };*/
                }
            });
        };

        /**
         * 从url上获取URL上指定的参数
         * @returns {*} 如果存在此参数, 则返回参数对应的值; 如果找不到
         */
        function getURLParam(strParamName) {
            var strSearch = location.search.substring(1);
            if (strSearch.indexOf(strParamName + '=') != -1) {
                return strSearch.split(strParamName + '=')[1].split('&')[0]
            } else {
                console.warn('没有在urlParam上找到: ' + strParamName);
                return -1;
            }
        }

        /**
         * main入口
         */
        $(function () {

            /**
             * 页面加载时, 获取礼物列表和用户信息
             */
            $.ajax({
                /*url     : "api/getActivityInfo_newUser.json",*/
                url     : "http://123.56.8.204/Customer/GetCustomerRegDetail",
                type    : "post",
                data    : {
                    "openID"    : OpenID,
                    "activityID": activityID
                },
                success : function (result) {

                    var objResult = typeof result == "string" ? JSON.parse(result) : result;

                    console.log(objResult);
                    debugger;

                    // 模拟数据
                    /*var objResult = {
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
                     };*/

                    // 初始化礼物信息
                    initGiftInfo(objResult.data.giftList);

                    // 移动pacman到指定步骤
                    gotoStep(objResult);

                },
                error   : function (XMLHttpRequest, textStatus, errorThrown) {
                    // 与后端通信出现错误, 重新启用领取按钮
                    $('.J_GetGift').text('重新领取').removeProp('disabled');
                    console.warn('啊哦, 出现错误了, 请稍后再试~ \n错误代码: ' + textStatus)
                },
                complete: function () {

                }
            });

            /**
             * 点击 "领取礼物" 按钮时获得兑换码, 同时切换显示用户反馈提示框
             */
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
                    url     : "http://123.56.8.204/Customer/CreateCustmoerDetail",
                    type    : "post",
                    data    : {
                        "userName"  : userName,
                        "userMobile": userMobile
                    },
                    success : function (result) {

                        var objResult = typeof result == "string" ? JSON.parse(result) : result;

                        debugger;

                        var btnGetGift = $('.J_GetGift');

                        // 与后端通信出现错误, 提醒用户并重新启用领取按钮
                        if (objResult.code != "0") {
                            btnGetGift.text('重新领取').removeProp('disabled');
                            console.warn('啊哦, 好像出了点问题, 请稍后再试~ \n代码: ' + objResult);
                        }

                        // 获取兑换码成功
                        btnGetGift.text('恭喜! 获得礼品兑换码成功! :)');
                        $('.redeemCode .noCode').hide();
                        $('.redeemCode .codeGet .code').text(objResult.data.redeemCode).css('color', 'red');
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

            /**
             * 用户反馈成功后, 显示"查看更多"按钮
             */
            $('.formRate .J_RateDown, .formRate .J_RateUp').on('click', function () {
                $.ajax({
                    url     : baseDomain + "/Customer/Rate",
                    type    : "post",
                    data    : {
                        "feedbackID"     : "123",
                        "feedbackOption ": "1"
                    },
                    success : function (result) {

                        var objResult = typeof result == "string" ? JSON.parse(result) : result;

                        debugger;

                        $(this).parent().siblings('p').css('visibility', 'hidden');
                        $(this).siblings('.button').hide();
                        $(this).text('查看更多精彩');
                        $(this).on('click', function () {
                            location.href = objResult.data.link;
                        });

                    },
                    error   : function (XMLHttpRequest, textStatus, errorThrown) {
                        // 与后端通信出现错误
                        alert('啊哦, 出现错误了, 请稍后再试~ \n错误代码: ' + textStatus)
                    },
                    complete: function () {

                    }
                });
            });

        });

    })
(jQuery);