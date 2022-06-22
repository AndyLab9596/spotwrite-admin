$(function () {
    const apiPath = getEnvironment();
    
    if(window.location.pathname.indexOf('contact.html') != -1){
        let mode = getUrlParameter('mode');
        if(mode != undefined && mode == 'demo'){
            $('input#radio01').prop('checked', true);
        } else {
            $('input#radio02').prop('checked', true);
        }
    }

    $('.mailForm .formDl .require').blur(function()
    {
        if(!$.trim(this.value).length){
            $(this).addClass('error');
        } else {
            $(this).removeClass('error');
        }
    });

    let allFilledFlag = false;
    $('.mailForm input, .mailForm textarea').on('change focus blur',function(){
        const phonePattern = new RegExp("^0[1-9][0-9]{0,4}-[0-9]{1,5}-[0-9]{1,5}$");
        if(this.name === 'telephone' && this.value != '' && !phonePattern.test(this.value)){
            if(!$(this).parent().find('p').length) {
                $(this).parent().append('<p style="color: red;">電話番号を正しい形式で入力してください。<br>（例）090-0000-0000）</p>');
            } 
            $(this).addClass('phone_error');
        } else {
            if($(this).parent().find('p').length) {
                $(this).parent().find('p').remove();
            }
            if($(this).hasClass('phone_error')){
                $(this).removeClass('phone_error');
            }
        }
        $('.mailForm .formDl .require, .mailForm .formDl .phone_error').each(function(){
            if($(this).hasClass('error') || $(this).hasClass('phone_error') || !$.trim(this.value).length){
                allFilledFlag = false;
                return false;
            } else {
                allFilledFlag = true;
            }
        });
        if(allFilledFlag && $('.mailForm #agree').is(":checked")){
            $('.mailForm :submit').attr("disabled", false);
        } else{
            $('.mailForm :submit').attr("disabled", true);
        }
    });
    $( ".mailForm form" ).submit(function( event ) {
        event.preventDefault();
        if(window.location.pathname.indexOf('contact.html') != -1){
            sendMail('contact');
        }
        if(window.location.pathname.indexOf('agent.html') != -1){
            sendMail('agent');
        }
        if(window.location.pathname.indexOf('download.html') != -1){
            sendMail('download');
        }
    });
    function sendMail(mode) {
        let domain = apiPath;
        let redirectPage = '';
        let formData = $( ".mailForm form" ).serializeArray().map((value) => {
            return {[value.name]: value.value};
        });
        switch(mode) {
            case 'contact':
                domain += 'landing-contact-send-mail';
                redirectPage = './contact-complete.html';
                break;
            case 'agent':
                domain += 'landing-agent-send-mail';
                redirectPage = './agent-complete.html';
                break;
            case 'download':
                domain += 'landing-download-send-mail';
                redirectPage = './download-complete.html';
                break;
            default:
        }

        $.ajax({
            type: 'POST',
            url: domain,
            data: Object.assign({}, ...formData),
            dataType: 'json',
            statusCode: {
                204: function(responseObject, textStatus, jqXHR) {
                    window.location.replace(redirectPage);
                },
                200: function(responseObject, textStatus, jqXHR) {
                  window.location.replace(redirectPage);
                }
            },
        }).fail(function(jqXHR, textStatus){
            console.log('問題が発生しました: ' + textStatus);
        });
    }
});
