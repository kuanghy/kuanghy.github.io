/*
 *  回到顶部、底部按钮代码
 */
$(function ()
{
    $("#updown").css("top", window.screen.availHeight / 2 - 100 + "px");
    $(window).scroll(function ()
    {
        if ($(window).scrollTop() >= 100)
        {
            $('#updown').fadeIn(300);
        } else
        {
            $('#updown').fadeOut(300);
        }
    });
    $('#updown .up').click(function () { $('html,body').animate({ scrollTop: '0px' }, 800); });
    $('#updown .down').click(function () { $('html,body').animate({ scrollTop: document.body.clientHeight + 'px' }, 800); });
});

