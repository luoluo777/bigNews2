 // 6 个人中心模块
 $(function () {
    // 6.1 一进入页面发送ajax获取用户详情
    $.ajax({
        type: 'get',
        url: BigNews.user_detail,
        success: function (backData) {
            // console.log(backData);
            if (backData.code == 200) {
                for (var key in backData.data) {
                    $('input.' + key).val(backData.data[key]);
                };
                //图片改变
                $('img.user_pic').attr('src', backData.data.userPic);
            }
        }
    });
    // 6.2 修改按钮添加点击事件发送ajax编辑个人信息
    $('.btn-edit').on('click', function (e) {
        e.preventDefault();
        var fd = new FormData($('#form')[0]);
        $.ajax({
            type: 'post',
            url: BigNews.user_edit,
            data: fd,
            contentType: false,
            processData: false,
            success: function (backData) {
                // console.log(backData);
                if (backData.code == 200) {
                    //第一种方法改变顶部栏的个人信息： 刷新父窗口
                    // parent.window.location.reload();
                    //第二种方法 再次发送ajax请求重新获取用户信息
                    $.ajax({
                        type: 'get',
                        url: BigNews.user_info,
                        success: function (backData) {
                            parent.$('.user_info').find('img').attr('src', backData.data.userPic).next().text('欢迎  ' + backData.data.nickname);
                            parent.$('.user_center_link').find('img').attr('src', backData.data.userPic);
                        }
                    });

                }
            }
        })
    })
})