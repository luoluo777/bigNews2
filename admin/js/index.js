$(function () {
    // 2 发送ajax请求获取用户信息
    $.ajax({
        type: 'get',
        url: BigNews.user_info,
        success: function (backData) {
            // console.log(backData);
            $('.user_info').find('img').attr('src', backData.data.userPic).next().text('欢迎  ' + backData.data.nickname);
            $('.user_center_link').find('img').attr('src', backData.data.userPic);
        }
    });
    //  3 退出按钮点击事件
    $('.logout').on('click', function () {
        // 3.1 点击后删除token
        localStorage.removeItem('token');
        window.location.href='./login.html';
    });
    // 4 左侧导航栏事件
    $('.menu>div.level01').on('click',function(){
        // 4.1 一级菜单点击高亮
        $(this).addClass('active').siblings('div').removeClass('active');
        // 4.2 文章管理点击事件
        if($(this).index()==1){
            // 二级菜单划入滑出
            $('ul.level02').slideToggle();
            // 小箭头旋转
            $(this).find('b').toggleClass('rotate0');
            // 第一个选项高亮 通过触发器触发
            $('.level02>li:eq(0)').trigger('click');
        };
    });
    //  5 二级菜单点击事件
    $('ul.level02>li').on('click',function(){
        $(this).addClass('active').siblings('li').removeClass('active');
    })
})