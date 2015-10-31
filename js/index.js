/**
 * Created by kang on 2015/10/26.
 */
;
(function ($) {

    /**
     * init
     * @type {string}
     */
    var stepsPrefix = 'step',
        totalSteps  = 5,
        originStep  = getURLParam('originStep'),
        targetStep  = getURLParam('targetStep');

    var gameContainer = $('.gameContainer');

    /**
     * 页面加载时, 根据url param指定的step, 移动到目标位置
     */
    if (originStep != -1 && targetStep != -1) {
        //gotoStep(originStep, targetStep);
    }

    // test
    $('.gotoStep').click(function () {
        var targetStep = $(this).attr('data-step');
        gameContainer.removeClass('step0 step1 step2 step3 step4 step5')
            .addClass(stepsPrefix + targetStep);
    });

    /**
     * 让pacman前进到指定的步骤
     * @param targetStep [Number] 要前进到的步骤
     */
    function gotoStep(originStep, targetStep) {
        // init
        var stepStart = stepsPrefix + originStep
            ,stepEnd = stepsPrefix + targetStep
            ,gift = gameContainer.find('.gift' + targetStep)
            ,character = gameContainer.find('.character')
            ,pacman = gameContainer.find('.character .pacman')
            ,pacman_frontface = gameContainer.find('.character .pacman-frontface');

        // process
        gameContainer.removeClass('step0 step1 step2 step3 step4 step5');
        gameContainer.addClass(stepStart);
        setTimeout(function () {
            (function () {
                character.addClass('anim');
                gameContainer.removeClass(stepStart)
                    .addClass(stepEnd);
            })();
        }, 1000);
        setTimeout(function () {
            (function () {
                if (!!gift.length) {
                    pacman.hide();
                    pacman_frontface.fadeIn();
                }
                //gift.addClass('active');
            })();
        }, 2000);
        setTimeout(function () {
            $('.formContainer').addClass('animated fadeInUp');
            $('.giftContainer').addClass('animated fadeInDown');

        }, 3000);
        $('.J_GetGift').on('click', function () {
            $('.redeemCode .noCode').hide();
            $('.redeemCode .codeGet').fadeIn();
            $('.formGetGift').hide();
            $('.formRate').fadeIn();
        });
        $('.formRate .J_RateDown, .formRate .J_RateUp').on('click', function () {
            $(this).siblings('.button').hide();
            $(this).text('感谢您的反馈!')
        });
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

})(jQuery);