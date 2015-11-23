/**
 * Created by kang on 2015/10/26.
 */
;
(function ($) {

    /**
     * 变量初始化
     * @type {string}
     */
    var originStep     = getURLParam('start'),
        targetStep     = getURLParam('end'),
        OpenID         = getURLParam('OpenID'),
        activityID     = getURLParam('activityID'),
        isJoinedMember = getURLParam('isNewUser') != '' && getURLParam('isNewUser') != -1,
        gameContainer  = $('.gameContainer'),
        stepsPrefix    = 'step'/*,
         totalSteps  = 5*/;

    /**
     * 让pacman前进到指定的步骤
     * @param targetStep [Number] 要前进到的步骤
     */
    function gotoStep(originStep, targetStep) {
        // init
        var stepStart        = stepsPrefix + originStep,
            stepEnd          = stepsPrefix + targetStep,
            gift             = gameContainer.find('.gift' + targetStep),
            hasGift          = gift.length > 0,
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
            url     : "api/getActivityInfo_newUser.json",
            data    : {
                "OpenID"    : OpenID,
                "activityID": activityID
            },
            success : function (result) {
                if (originStep != -1 && targetStep != -1) {
                    gotoStep(originStep, targetStep);
                }

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