/**
 * Created by kang on 2015/10/26.
 */
;
(function ($) {

    /**
     * 全局变量初始化
     * @type {Object}
     */
    console.warn('初始化全局变量 window.pacman:');
    var pacman = {};
    window.pacman = {
        APIPrefix : 'http://123.56.8.204/',
        openID    : getURLParam('openID'),
        activityID: getURLParam('activityID'),
        merchantID: getURLParam('merchantID')
    };
    pacman = window.pacman;
    console.log('pacman =>', pacman);

    /**
     * 根据提供的礼物数据, 初始化活动
     * TODO: [延后] 每行步骤不一定是5个, 有可能是2/3/4个, 需要考虑 => "根据返回的json动态填充礼物层"
     * @param objResult {Object} 构建pacman所需的信息
     * data: Object
     * currentAction: Object
     * giftList: Array[5]
     * user: Object
     */
    function initGiftInfo(objResult) {
        // init
        var gameContainer              = $('.gameContainer'),
            giftNumberPerLayer         = 5,
            giftList                   = objResult.data.giftList,
            totalGiftNumber            = giftList.length,
            totalGiftLayerNumber       = totalGiftNumber % giftNumberPerLayer != 0 ? totalGiftNumber / giftNumberPerLayer + 1 : totalGiftNumber / 5,
            giftLayerClassName         = 'giftLayer',
            giftListContainerClassName = 'giftListContainer',
            giftItemClassName          = 'gift',
            nodeContainerClassName     = 'nodeContainer',
            nodeItemClassName          = 'node',
            numberContainerClassName   = 'numberContainer',
            numberItemClassName        = 'number';

        // 添加礼物层
        for (var currentGiftLayerIndex = 0; currentGiftLayerIndex < totalGiftLayerNumber; currentGiftLayerIndex++) {

            var uniqueGiftLayerSelector = giftLayerClassName + (Number(currentGiftLayerIndex) + 1);

            var giftLayerTemplate = ['<div class="', giftLayerClassName, ' ', uniqueGiftLayerSelector, '">',
                    '<div class="', giftListContainerClassName, '"></div>',
                    '<div class="pathContainer">',
                    '<div class="path"></div>',
                    '<div class="', nodeContainerClassName, '"></div>',
                    '<div class="', numberContainerClassName, '"></div>',
                    '</div>',
                    '</div>'].join(''),
                // pacman模板
                pacmanTemplate    = '<div class="character"> <div class="pacman"> <div class="head"></div> <div class="forehead forehead-animation"></div> <div class="jaw jaw-animation"></div> </div> <div class="pacman-frontface"> </div> </div>';

            // 礼物层模板
            gameContainer.append(giftLayerTemplate);
            console.log('礼物层模板 giftLayerTemplate =>', gameContainer.children().last());

            // 添加礼物(gift), 节点(node), 数字(number)列表
            console.warn('开始向当前礼物层<%d>, 循环填充礼物:', currentGiftLayerIndex + 1);
            for (var i = 0; i < giftNumberPerLayer; i++) {
                var currentGiftItemIndex  = currentGiftLayerIndex * giftNumberPerLayer + i,
                    currentGiftItemNumber = currentGiftLayerIndex * giftNumberPerLayer + i + 1,
                    currentGiftLayer      = $('.' + uniqueGiftLayerSelector),
                    isCurrentPlaceAvailable = typeof giftList[currentGiftItemIndex] !== "undefined",
                    isCurrentPlaceHasGift;

                // 判断是否已经渲染到最后一步了
                if (isCurrentPlaceAvailable){
                    isCurrentPlaceHasGift = giftList[currentGiftItemIndex].giftName != '';
                } else {
                    return false;
                }

                // 如果当前位置上有礼物, 就添加礼物层
                if (isCurrentPlaceHasGift) {

                    console.log('%c第%d个礼物 => ', 'font-weight:bold;', currentGiftItemNumber, giftList[currentGiftItemIndex]);

                    $('<div class="' + giftItemClassName + ' ' + giftItemClassName + Number(i + 1) + '" data-gift-number="' + currentGiftItemNumber + '"></div>')
                        .appendTo(currentGiftLayer.find('.' + giftListContainerClassName))
                        .css({
                            'background-image': 'url(' + giftList[currentGiftItemIndex].giftLogo + ')'
                        }).attr({
                            'data-name': giftList[currentGiftItemIndex]['GiftName'],
                            'data-logo': giftList[currentGiftItemIndex]['GiftLogo'],
                            'data-desc': giftList[currentGiftItemIndex]['GiftDes']
                        });
                }

                // 添加当前节点必备的元素: 小圆点, 数字
                $('<div class="' +
                    nodeItemClassName +
                    ' ' +
                    nodeItemClassName +
                    Number(i + 1) +
                    '"></div>').appendTo(currentGiftLayer.find('.' + nodeContainerClassName));
                $('<div class="' +
                    numberItemClassName +
                    ' ' +
                    numberItemClassName +
                    Number(i + 1) +
                    '">' + currentGiftItemNumber +
                    '</div>').appendTo(currentGiftLayer.find('.' + numberContainerClassName));

                // 如果pacman动画的终点是这里, 那么就提前把pacman先放在这一层的最左侧开始位置, 为之后的动画作准备
                if (objResult.data.currentAction.end == currentGiftItemNumber) {
                    console.warn('pacman动画将在第 %d 层礼物层播放', currentGiftItemNumber);
                    $(pacmanTemplate).appendTo(currentGiftLayer.find('.pathContainer'));
                }

            }

        }
    }

    /**
     * 让pacman前进到指定的步骤
     * @param objResult 每一步所包含的礼物等相关信息
     */
    function gotoStep(objResult) {
        // init
        var gameContainer      = $('.gameContainer'),
            giftNumberPerLayer = 5,
            stepStart          = 'step' + objResult.data.currentAction.start % giftNumberPerLayer,
            stepEnd            = 'step' + objResult.data.currentAction.end % giftNumberPerLayer,
            currentGiftIndex   = objResult.data.currentAction.end - 1,
            giftList           = objResult.data.giftList,
            currentGift        = giftList[currentGiftIndex],
            hasGift            = objResult.data.currentAction.hasGift,
            character          = gameContainer.find('.character'),
            pacman             = gameContainer.find('.character .pacman'),
            pacman_frontface   = gameContainer.find('.character .pacman-frontface');

        var nextGift;
        if (!hasGift) {
            $.each(giftList, function (index, item) {
                if (index > currentGiftIndex && index < giftList.length) {
                    nextGift = giftList[index];
                    nextGift['needSteps'] = index - currentGiftIndex;
                    return false;
                }
            });
        }

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

        // 显示礼物弹窗 & 表单弹窗 (如果当前位置没有礼物, 则礼物弹窗显示下一个即将获得的礼物, 并提醒还需要几步)
        setTimeout(function () {
            (function () {

                // 表单弹窗
                $('.formContainer').addClass('animated fadeInUp');

                // 礼物弹窗
                var giftContainer = $('.giftContainer');

                if (hasGift) { // 当前步骤上有礼物
                    giftContainer.find('.giftPhoto').css('background-image', 'url(' + currentGift.giftLogo + ')');
                    giftContainer.find('.giftName').text(currentGift.giftName);
                    giftContainer.find('.giftDesc').text(currentGift.giftDes);
                    giftContainer.addClass('animated fadeInDown');
                } else {
                    giftContainer.find('.redeemCode').empty();
                    if (nextGift && nextGift.giftName != "") { // 当前步骤上没有礼物, 距离下一个礼物还有 x 步, 显示下一个即将获得的礼物的信息
                        giftContainer.find('.giftTitle').text('还差 ' + nextGift.needSteps + ' 步就可以获得下一个礼物啦!');
                        giftContainer.find('.giftPhoto').css('background-image', 'url(' + nextGift.giftLogo + ')');
                        giftContainer.find('.giftName').text(nextGift.giftName);
                        giftContainer.find('.giftDesc').text(nextGift.giftDes);
                        giftContainer.addClass('animated fadeInDown');
                    } else { // 后面已经没有礼物了 (没有实际意义, 暂时不考虑这种可能性)
                        console.warn('后面已经没有礼物了 (没有实际意义, 暂时不考虑这种可能性)');
                    }
                }

                // 如果是新用户, 则表单弹窗里的内容为填写姓名手机号;
                // 如果是老用户, 则直接给用户评价选项(满意/不满意).
                if (objResult.data.user.isNewUser) {
                    $('.formGetGift').show();
                } else {

                    // 显示兑换码
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

                    $('.formRate').show();
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
            url     : pacman.APIPrefix + "Customer/GetCustomerRegDetail",
            type    : "post",
            data    : {
                "openID"    : pacman.openID,
                "activityID": pacman.activityID,
                "merchantID": pacman.merchantID
            },
            success : function (result) {

                var objResult = typeof result == "string" ? JSON.parse(result) : result;

                console.warn('页面加载时, 拿到的初始化数据:');
                console.log('objResult =>', objResult);

                if(objResult.code != 200){
                    alert('啊哦, 好像出了点问题, 请稍后再试~ \n\tcode: ' + objResult.code + '\n\tmsg: ' + objResult.msg + '\n\tdata: ' + objResult.data);
                    console.warn('啊哦, 好像出了点问题, 请稍后再试~ \n状态码: ' + objResult);
                    return false;
                }

                // TODO: 老顾客 => 从第10步到第11步 => 这个活动一共只有5步, 这里循环应该做一下限制(最后一次礼物获得之后, 可以考虑让start = end = 最大步数5;
                // TODO: %c老顾客 => 从第%s步到第%d步 => objResult.data.currentAction.start为什么是字符串, 而end是数字类型
                objResult.data.user.isNewUser
                    ? console.log('%c新顾客 => 从第%d步到第%d步 => 当前位置上是否有礼物:%s => 木有兑换码', 'font-family:"Microsoft Yahei";font-size:1.5em;color:#c00;', objResult.data.currentAction.start, objResult.data.currentAction.end, objResult.data.currentAction.hasGift)
                    : console.log('%c老顾客 => 从第%d步到第%d步 => 当前位置上是否有礼物:%s => 兑换码为%s', 'font-family:"Microsoft Yahei";font-size:1.5em;color:#c00;', objResult.data.currentAction.start, objResult.data.currentAction.end, objResult.data.currentAction.hasGift, objResult.data.currentAction.redeemCode);

                // 初始化礼物信息
                initGiftInfo(objResult);

                // 判断用户是否已经走到最后一步, 领取完所有奖品了
                if (objResult.data.currentAction.start == objResult.data.currentAction.end) {
                    console.warn('之前已经拿到终极礼物了');
                    alert('您已经获得了终极礼物, 请关注并支持我们后续的活动哟!');
                    // 表单弹窗
                    $('.formContainer').addClass('animated fadeInUp');
                    $('.formGetGift').hide();
                    $('.formRate').fadeIn();
                    return false;
                }

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
            if ($.trim(userName) == "") {
                alert('请输入您的名字~');
                inputUserName.focus();
                return false;
            } else if ($.trim(userName).replace(/[^\x00-\xff]/g, '  ').length > 10) {
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
            }

            // 与后端通信之前, 禁用领取按钮, 避免重复提交
            $('.J_GetGift').text('请稍候...').prop('disabled', 'disabled');

            // 向后端发送用户输入的信息, 获取后端返回的兑换码
            $.ajax({
                url     : pacman.APIPrefix + "Customer/CreateCustmoerDetail",
                type    : "post",
                data    : {
                    "cname"     : userName,
                    "phone"     : userMobile,
                    "openID"    : pacman.openID,
                    "activityID": pacman.activityID,
                    "merchantID": pacman.merchantID
                },
                success : function (result) {

                    var objResult = typeof result == "string" ? JSON.parse(result) : result;

                    var btnGetGift = $('.J_GetGift');

                    // 与后端通信出现错误, 提醒用户并重新启用领取按钮
                    if (objResult.code != "200") {
                        btnGetGift.text('重新领取').removeProp('disabled');
                        alert('啊哦, 好像出了点问题, 请稍后再试~ \n状态码: ' + objResult);
                        console.warn('啊哦, 好像出了点问题, 请稍后再试~ \n状态码: ' + objResult);
                        return false;
                    }

                    // 获取兑换码成功, 显示兑换码
                    console.log('获取兑换码成功 => ', objResult.data.redeemCode);
                    btnGetGift.text('恭喜! 获得礼品兑换码成功! :)');
                    $('.redeemCode .noCode').hide();
                    $('.redeemCode .codeGet .code').text(objResult.data.redeemCode).css('color', 'red');
                    $('.redeemCode .codeGet').show().addClass('animated bounceIn');
                    setTimeout(function () {
                        $('.redeemCode .codeGet').removeClass('bounceIn').addClass('flash');
                    }, 2000);
                    setTimeout(function () {
                        $('.formGetGift').hide();
                        $('.formRate').fadeIn();
                    }, 3000);

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
                url     : pacman.APIPrefix + "Customer/Rate",
                type    : "post",
                data    : {
                    "feedbackID"     : "123",
                    "feedbackOption ": "1"
                },
                success : function (result) {

                    var objResult = typeof result == "string" ? JSON.parse(result) : result;

                    var btnRateUp = $('.formRate .J_RateUp');

                    btnRateUp.parent().siblings('p').css('visibility', 'hidden');
                    btnRateUp.siblings('.button').hide();
                    btnRateUp.text('查看更多精彩');
                    btnRateUp.off('click');
                    btnRateUp.on('click', function () {
                        if (objResult.data.customLink) {
                            location.href = objResult.data.customLink;
                        } else {
                            console.error('错误代码 => ', objResult.code, objResult.msg, objResult.data);
                            return false;
                        }
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