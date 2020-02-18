//8 文章列表页面
$(function () {
    //  8.1 发送ajax获取文章分类
    $.ajax({
        type: 'get',
        url: BigNews.category_list,
        success: function (backData) {
            // console.log(backData);
            if (backData.code == 200) {
                var resHtml = template('temp_cat', backData);
                $('#selCategory').html(resHtml);
            }
        }
    });

    /*  $.ajax({
         type: 'get',
         url: BigNews.article_query,
         data: {
             type: $('#selCategory').val(),
             state: $('#selCategory').val(),
             page: 1,
             perpage: 6
         },
         success: function (backData) {
             // console.log(backData);
             if (backData.code == 200) {
                 var resHtml = template('temp_aclist', backData);
                 $('table tbody').html(resHtml);
                 // 8.3 分页插件
                 $('#pagination').twbsPagination({
                     totalPages: backData.data.totalPage,
                     visiblePages: 7,
                     first: '首页',
                     prev: "上一页",
                     next: '下一页',
                     last: '尾页',
                     onPageClick: function (event, page) {
                         $('#page-content').text('Page' + page);
                         // 发送ajax请求获取文章
                         $.ajax({
                             type: 'get',
                             url: BigNews.article_query,
                             data: {
                                 type: $('#selCategory').val(),
                                 state: $('#s#selStatus').val(),
                                 page: page,
                                 perpage: 6
                             },
                             success: function (backData) {
                                 if (backData.code == 200) {
                                     var resHtml = template('temp_aclist', backData);
                                     $('table tbody').html(resHtml);
                                 }
                             }
                         });
                     }
                 })
             }
         }
     });
     // 8.2 点击筛选按钮 获取符合要求的文章
     $('#btnSearch').on('click', function (e) {
         e.preventDefault();
         $.ajax({
             type: 'get',
             url: BigNews.article_query,
             data: {
                 type: $('#selCategory').val(),
                 state: $('#selStatus').val(),
                 page: 1,
                 perpage: 6
             },
             success: function (backData) {
                 // console.log(backData);
                 if (backData.code == 200) {
                     var resHtml = template('temp_aclist', backData);
                     $('table tbody').html(resHtml);
                     // 根据筛选按钮重新生成页面结构(第一个参数：事件名字，第二个参数：改变后的总页码，第三个参数：当前显示的页码)
                     $('#pagination').twbsPagination('changeTotalPages', backData.data.totalPage, 1);
                 }
             }
         })
     }); */
    // 封装版----------------------------------------------------------------
    // 声明一个全局变量保存当前页码
    var myPage = 1;
    // 一 封装发送ajax请求获取文章列表
    function getData(myPage, callback) {
        $.ajax({
            type: 'get',
            url: BigNews.article_query,
            data: {
                type: $('#selCategory').val(),
                state: $('#selStatus').val(),
                page: myPage,
                perpage: 3
            },
            success: function (backData) {
                if (backData.code == 200) {
                    var resHtml = template('temp_aclist', backData);
                    $('table tbody').html(resHtml);
                    // 针对删除做的判断
                    if (backData.data.data.length != 0 && callback != null) {
                        //有数据
                        $('#pagination').show().next().hide();
                        callback(backData);
                    } else if (backData.data.data.length == 0 && myPage == 1) {
                        // 没有数据
                        $('#pagination').hide().next().show();
                    } else if (backData.data.totalPage == myPage - 1 && backData.data.data.length == 0) {
                        // 删到这一页没有数据时 当前点击页码比总页数多1
                        myPage -= 1;
                        $('#pagination').twbsPagination('changeTotalPages', backData.data.totalPage, myPage);
                    }

                }
            }
        });
    };
    // 二. 一进入页加载文章列表和分页插件
    getData(1, function (backData) {
        $('#pagination').twbsPagination({
            totalPages: backData.data.totalPage,
            visiblePages: 7,
            first: '首页',
            prev: "上一页",
            next: '下一页',
            last: '尾页',
            onPageClick: function (event, page) {
                // $('#page-content').text('Page' + page);
                // 发送ajax请求获取文章
                myPage = page;
                getData(page, null);
            }
        })
    });
    // 三. 点击筛选按钮获取符合要求的文章 重新生成页面结构 
    $('#btnSearch').on('click', function (e) {
        e.preventDefault();
        getData(1, function (backData) {
            //                   (第一个参数：事件名字，第二个参数：改变后的总页码，第三个参数：当前显示的页码)
            $('#pagination').twbsPagination('changeTotalPages', backData.data.totalPage, 1);
        });
    });
    //  四. 删除文章
    $('tbody').on('click', '.delete', function () {
        if (confirm('你确定要删除吗？')) {
            var articleId = $(this).attr('data-id');
            $.ajax({
                type: 'post',
                url: BigNews.article_delete,
                data: {
                    id: articleId
                },
                success: function (backData) {
                    // console.log(backData);
                    if (backData.code == 204) {
                        // 重新加载  删除数据时总页数可能发生改变 根据新的总页数生成页码结构
                        getData(myPage, function (backData) {
                            $('#pagination').twbsPagination('changeTotalPages', backData.data.totalPage, myPage);
                            // // 判断删除的是最后一页或者第一页
                            /*  if (backData.data.totalPage == myPage|| myPage== 1) {
                             $('#pagination').twbsPagination('changeTotalPages', backData.data.totalPage, myPage);
                         } else{
                             $('#pagination').twbsPagination('changeTotalPages', backData.data.totalPage, myPage-1);
                         } */
                        })
                    }
                }
            })
        }

    })


})