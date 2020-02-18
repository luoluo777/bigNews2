// 7 文章类别管理
$(function () {
    // 7.1 发送Ajax请求获取所有文章类别
    getData();
    function getData() {
        $.ajax({
            type: 'get',
            url: BigNews.category_list,
            success: function (backData) {
                var resHtml = template('temp_ac', backData);
                $('tbody').html(resHtml);
            }
        })
    };
    //7.2 模态框
    //7.2.1 确定模态框是编辑按钮点出还是新增分类点出  用到show.bs.modal事件
    $('#myModal').on('show.bs.modal', function (e) {
        var target = e.relatedTarget;
        if (target == $('#xinzengfenlei')[0]) {
            //新增按钮点出模态框逻辑
            $('#myModalLabel').text('文章类别');
            $('#AddOrEdit').text('新增').addClass('btn-primary').removeClass('btn-success');
        } else {
            //编辑按钮点出模态框逻辑
            $('#myModalLabel').text('修改类别');
            $('#AddOrEdit').text('编辑').addClass('btn-success').removeClass('btn-primary');
            $('#recipient-name').val($(target).parent().prev().prev().text());
            $('#message-text').val($(target).parent().prev().text());
            // 利用隐藏域保存 文章id
            $('#categoryId').val($(target).attr('data-id'));
        }
    });
    //7.2.2 给模态框中新增/编辑按钮设置点击事件
    $('#AddOrEdit').on('click', function (e) {
        if ($(this).hasClass('btn-primary')) {
            // 新增按钮
            var categoryName = $('#recipient-name').val().trim();
            var categorySlug = $('#message-text').val().trim();
            $.ajax({
                type: 'post',
                url: BigNews.category_add,
                data: {
                    name: categoryName,
                    slug: categorySlug
                },
                success: function (backData) {
                    if (backData.code == 201) {
                        //第一种方法 模态框隐藏 重新获取文章列表 清空输入框
                        $('#myModal').modal('hide');
                        getData();
                        $('#recipient-name').val("");
                        $('#message-text').val('');
                        //第二种方法 直接刷新
                        // window.location.reload();
                    }
                }
            })
        } else {
            // 编辑按钮
            /* var id = $('#categoryId').val();
            var categoryName = $('#recipient-name').val().trim();
            var categorySlug = $('#message-text').val().trim(); */
            // 优化 serialize
            var data = $("#myModal form").serialize();
            $.ajax({
                type: 'post',
                url: BigNews.category_edit,
                /*  data: {
                     id: id,
                     name: categoryName,
                     slug: categorySlug
                 }, */
                data: data,
                success: function (backData) {
                    // console.log(backData);
                    if (backData.code == 200) {
                        window.location.reload();
                    }
                }
            })
        }
    });
    //7.2.3  给模态框取消按钮添加事件
    $('.btn-cancel').on('click', function () {
        // 表单的重置方法
        $('#myModal form')[0].reset();
        $('#myModal').modal('hide');
    });
    //7.3 删除按钮添加点击事件
    $('tbody').on('click', '.btn-delete', function () {
        if (confirm('您确定要删除吗？')) {
            var id = $(this).attr('data-id');
            $.ajax({
                type: 'post',
                url: BigNews.category_delete,
                data: {
                    id: id
                },
                success: function (backData) {
                    console.log(backData);
                    if (backData.code == 204) {
                        alert('删除成功');
                        window.location.reload()
                    }
                }
            })
        }
    })
})
