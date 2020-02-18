$(function () {
    // 1 给登录按钮设计点击事件
    $('.input_sub').on('click', function (e) {
      // 1.1 阻断默认跳转
      e.preventDefault();
      // 1.2 获取用户名和密码
      var username = $('.input_txt').val().trim();
      var password = $('.input_pass').val().trim();
      //  1.3 非空判断
      if (username == "" || password == "") {
        // alert('用户名密码不能为空');
        $('.modal-body').text('用户名密码不能为空');
        $('#myModal').modal();
        return;
      };
      //  1.4 发送ajax请求登录
      $.ajax({
        type: 'post',
        url: BigNews.user_login,
        data: {
          username: username,
          password: password
        },
        success: function (backData) {
          console.log(backData);
          $('.modal-body').text(backData.msg);
          $('#myModal').modal();
          if (backData.code == 200) {
            //  储存token
            localStorage.setItem('token', backData.token);
            // alert(backData.msg);            
            $('#myModal').on('hidden.bs.modal', function (e) {
              window.location.href = "./index.html";
            })
          }
        }
      })
    })
  })