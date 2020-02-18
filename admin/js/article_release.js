$(function () {
    // 10 发表文章页面
    //10.1 图片预览
    $('#inputCover').on('change', function () {
        var file = this.files[0];
        var url = URL.createObjectURL(file);
        $(this).prev().attr('src', url);
    });
    // 10.2 获取文章分类
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
    // 10.3 时间控件
    jeDate("#testico", {
        format: "YYYY-MM-DD",
        isTime: false,
        zIndex: 20999,
        isinitVal: true,                            //是否初始化时间，默认不初始化时间
        minDate: "2014-09-19 00:00:00"
    });
    // 10.4 编辑器插件
    var E = window.wangEditor;
    var editor = new E('#editor');
    // 或者 var editor = new E( document.getElementById('editor') )
    editor.create();

    // 10.5 发布文章
    $('.btn-release').on('click', function (e) {
        e.preventDefault();
        var fd = new FormData($('#form')[0]);
        fd.append('content', editor.txt.html());
        fd.append('state', '已发布');
        $.ajax({
            type: 'post',
            url: BigNews.article_publish,
            data: fd,
            contentType: false,
            processData: false,
            success: function (backData) {
                // console.log(backData);
                if (backData.code == 200) {
                    window.history.back();
                }
            }
        })
    });
    // 10.6 存为草稿按钮
    $('.btn-draft').on('click', function (e) {
        e.preventDefault();
        var fd = new FormData(document.querySelector('#form'));
        fd.append('content', editor.txt.html());
        $.ajax({
            type: 'post',
            url: BigNews.article_publish,
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