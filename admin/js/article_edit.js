$(function () {
    // 9 编辑文章页面
    //9.1 图片预览
    $('#inputCover').on('change', function () {
        var file = this.files[0];
        var url = URL.createObjectURL(file);
        $(this).prev().attr('src', url);
    });
    // 9.2 时间控件
    jeDate("#testico", {
        format: "YYYY-MM-DD",
        isTime: false,
        zIndex: 20999,
        // isinitVal: true,                            //是否初始化时间，默认不初始化时间
        minDate: "2014-09-19 00:00:00"
    });
    // 9.3 编辑器插件
    var E = window.wangEditor;
    var editor = new E('#editor');
    // 或者 var editor = new E( document.getElementById('editor') )
    editor.create();
    // 9.4 获取文章分类
    $.ajax({
        type: 'get',
        url: BigNews.category_list,
        success: function (backData) {
            // console.log(backData);
            if (backData.code == 200) {
                var resHtml = template('temp_cat', backData);
                $('.category').html(resHtml);
            }
        }
    });
    //9.5 编辑文章
    var articleId = window.location.search.split('=')[1];
    setTimeout(function () {
        $.ajax({
            type: 'get',
            url: BigNews.article_search,
            data: {
                id: articleId
            },
            success: function (backData) {
                if (backData.code == 200) {
                    $('#inputTitle').val(backData.data.title);
                    $('img.article_cover').attr('src', backData.data.cover);
                    $('select.category').val(backData.data.categoryId); //文章类别
                    $('#testico').val(backData.data.date);
                    editor.txt.html(backData.data.content)
                }
            }
        })
    }, 0);
    // 9.6 修改按钮
    $('.btn-edit').on('click', function (e) {
        e.preventDefault();
        var fd = new FormData(document.querySelector('#form'));
        fd.append('id', articleId);
        fd.append('content', editor.txt.html());
        fd.append('state', '已发布');
        $.ajax({
            type: 'post',
            url: BigNews.article_edit,
            data: fd,
            contentType: false,
            processData: false,
            success: function (backData) {
                // console.log(backData);
                if (backData.code == 200) {
                    alert(backData.msg);
                    window.history.back();
                }
            }
        })
    });
    // 9.7 存为草稿按钮
    $('.btn-draft').on('click', function (e) {
        e.preventDefault();
        var fd = new FormData(document.querySelector('#form'));
        fd.append('id', articleId);
        fd.append('content', editor.txt.html());
        $.ajax({
            type: 'post',
            url: BigNews.article_edit,
            data: fd,
            contentType: false,
            processData: false,
            success: function (backData) {
                if (backData.code == 200) {
                    window.history.back();
                }
            }
        })
    })
})
