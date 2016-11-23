//bộ đếm số lần lấy hình ảnh captcha
var captchaCounter = 0;

$(document).ready(function () {
    //thiết lập menu khi trang load thành công, thay đổi kích thước và cuộn
    setHeader();
    $(window).resize(setHeader);
    $(window).scroll(setHeader);
    
    //thiết lập css cho các tooltip
    $('[data-toggle="tooltip"]').tooltip();
    
    //thiết lập kiểm tra tính hợp lệ của form YÊU CẦU TÀI LIỆU - BÁO GIÁ
    $('form[name="frmRequestForm"]').validate({
        success: function (error, element) {
            if (element.toString() != '[object HTMLInputElement]') return;
            var span = $('form[name="frmRequestForm"] label[for="' + element.getAttribute('name') + '"] span.error');
            span.html('');
            span.hide();
        },
        errorPlacement: function (error, element) {
            var span = $('form[name="frmRequestForm"] label[for="' + element.attr('name') + '"] span.error');
            if (error.text().length > 0) {
                span.html('[' + error.text() + ']');
                span.show();
            } else {
                span.html('');
                span.hide();
            }
        },
        rules: {
            txtFullname: 'required',
            txtEmail: {
                required: true,
                email: true
            },
            txtMobile: {
                required: true,
                minlength: 6,
                maxlength: 20
            },
            txtAddress: 'required',
            txtMessage: 'required',
            txtCaptcha: {
                required: true,
                remote: {
                    url: '/Home/_CheckCaptcha/RequestForm',
                    type: 'post',
                    data: {
                        value: function () {
                            return document.frmRequestForm.txtCaptcha.value;
                        }
                    }
                }
            }
        },
        messages: {
            txtFullname: this_field_is_requered,
            txtEmail: {
                required: this_field_is_requered,
                email: email_is_invalid
            },
            txtMobile: {
                required: this_field_is_requered,
                minlength: mobile_length_is_invalid,
                maxlength: mobile_length_is_invalid
            },
            txtAddress: this_field_is_requered,
            txtMessage: this_field_is_requered,
            txtCaptcha: {
                required: this_field_is_requered,
                remote: captcha_is_wrong
            }
        }
    });
});

//thiết lập class cho menu chính
function setHeader() {
    if ($(window).width() >= 768 && $(window).scrollTop() > 90)
        $('#header').removeClass('top');
    else
        $('#header').addClass('top');
}

//hiển thị modal YÊU CẦU TÀI LIỆU - BÁO GIÁ
function showRequestFormModal() {
    document.frmRequestForm.txtFullname.value = document.frmRequestForm.txtEmail.value = document.frmRequestForm.txtMobile.value = document.frmRequestForm.txtAddress.value = document.frmRequestForm.txtMessage.value = document.frmRequestForm.txtCaptcha.value = '';
    var spans = $('form[name="frmRequestForm"] label span.error');
    spans.hide();
    spans.html();
    loadRequestFormCaptcha();
    $('#modalRequestForm').modal('show');
}

//tải captcha cho form YÊU CẦU TÀI LIỆU - BÁO GIÁ
function loadRequestFormCaptcha() {
    captchaCounter++;
    $('.captcha > span > span').css('background-image', "url('/Home/CaptchaImage/RequestForm?v=" + captchaCounter + "')");
}

//gửi dữ liệu form YÊU CẦU TÀI LIỆU - BÁO GIÁ lên mày chủ
function onRequestFormSubmit() {
    if ($('form[name="frmRequestForm"]').valid() == false) return false;
    var span = $('#modalRequestForm button:first-child span');
    if (span.hasClass('fa-check-circle') == false) return false;
    span.removeClass('fa-check-circle');
    span.addClass('fa-spinner fa-pulse');
    $.post('/Home/_SendRequest', { fullname: document.frmRequestForm.txtFullname.value, email: document.frmRequestForm.txtEmail.value, mobile: document.frmRequestForm.txtMobile.value, address: document.frmRequestForm.txtAddress.value, message: document.frmRequestForm.txtMessage.value, captcha: document.frmRequestForm.txtCaptcha.value }, 'json').done(function (result) {
        span.removeClass('fa-spinner fa-pulse');
        span.addClass('fa-check-circle');
        if (result.IsSuccess)
            $('#modalRequestForm').modal('hide');
        else
            loadRequestFormCaptcha();
        alert(result.Message);
        return false;
    }).fail(function () {
        span.removeClass('fa-spinner fa-pulse');
        span.addClass('fa-check-circle');
        loadRequestFormCaptcha();
        alert(error_in_processing);
        return false;
    });

    return false;
}

//ẩn hiện menu chia sẻ với mạng xã hội với giao diện xs
function toggleSocialSharedButtons() {
    $('.social-shared-buttons').toggleClass('active');
}


function scrollToTop() {
    $('body,html').animate({ scrollTop: 0 }, 800);
}

function openPopup(url, title, w, h) {
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    popup = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if (window.focus) {
        popup.focus();
    }
}

function showShareUrlPopup(url, title, w, h) {
    openPopup(url + location.href, title, w, h);
}