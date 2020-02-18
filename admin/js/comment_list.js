$(function () {
    //封装
    var myPage = 1;
    function getCom(myPage, callback) {
      $.ajax({
        type: 'get',
        url: BigNews.comment_list,
        data: {
          page: myPage,
          perpage: 3
        },
        success: function (backData) {
          // console.log(backData);
          if (backData.code == 200) {
            var resHtml = template('temp_comment', backData);
            $('tbody').html(resHtml);
            if (backData.data.data.length != 0 && callback != null) {
              callback(backData);
            } else if (backData.data.data.length == 0 && backData.data.totalPage == myPage - 1) {
              //最后一页 最后一个数据删除时 页面有变化
              $('#pagination').twbsPagination('changeTotalPages', backData.data.totalPage, myPage - 1);
            }
          }
        }
      })
    };
    // 一. 一进入页面获取评论列表 加载分页插件
    getCom(1, function (backData) {
      $('#pagination').twbsPagination({
        totalPages: backData.data.totalPage,
        visiblePages: 7,
        first: '首页',
        prev: "上一页",
        next: '下一页',
        last: '尾页',
        onPageClick: function (event, page) {
          $('#page-content').text('Page ' + page);
          // 点击哪个页码获取该页面评论
          myPage = page;
          getCom(page, null)
        }
      })
    });

    // 二. 批准
    $('tbody').on('click', '.btn-approve', function () {
      var commId = $(this).attr('data-id');
      $.ajax({
        type: 'post',
        url: BigNews.comment_pass,
        data: {
          id: commId
        },
        success: function (backData) {
          // console.log(backData);
          if (backData.code == 200) {
            alert('评论已通过');
            getCom(myPage, null);
          }
        }
      })
    });

    // 三.拒绝
    $('tbody').on('click', '.btn-reject', function () {
      var commId = $(this).attr('data-id');
      $.ajax({
        type: 'post',
        url: BigNews.comment_reject,
        data: {
          id: commId
        },
        success: function (backData) {
          if (backData.code == 200) {
            alert('评论已拒绝');
            getCom(myPage, null);
          }
        }
      })
    });
    // 四.删除
    $('tbody').on('click', '.btn-delete', function () {
      if ('你确定要删除吗?') {
        var commId = $(this).attr('data-id');
        $.ajax({
          type: 'post',
          url: BigNews.comment_delete,
          data: {
            id: commId
          },
          success: function (backData) {
            if (backData.code == 200) {
              alert(backData.msg);
              getCom(myPage, function (backData) {
                // 删除可能导致总页数变少
                $('#pagination').twbsPagination('changeTotalPages', backData.data.totalPage, myPage);
              });
            }
          }
        })
      }
    });
  })