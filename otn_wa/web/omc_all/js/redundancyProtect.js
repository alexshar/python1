var cgi_path = "https://135.251.96.98:8443/cgi-bin/test.cgi";
var url_path = '/oms1350/web/eqm/omc_all/';
// var url_path ="./";
var set_time = 4000;

var postData=function(data,jsonName){
    var tempData = {
        'content':JSON.stringify(data),
        'filename':url_path + 'data/7_3_3/'+jsonName }
    $.post(cgi_path, tempData,function(resp) {
        if(resp == 'success') {
           console.log("提交成功");
        } else {
            console.log("提交失败");
        }
    }).error(function(){
    });
}

function _typeChange(tabIndex, ele) {
    var ne_option = $(ele + ' .ne select').eq(0);
    var type_option = $(ele + ' .type').eq(0);
    var ne_value = '', type_value = '';
    $.each(ne_option.find('option'), function (index, item) {
        if ($(item).eq(0).val() == ne_option.val()) {
            ne_value = $(item).eq(0).attr('name');
        }
    })
    $.each(type_option.find('option'), function (index, item) {
        if ($(item).eq(0).val() == type_option.val()) {
            type_value = $(item).eq(0).attr('name');
        }
    })
    var e = $(ele + ' .tabs-box .tab').eq(tabIndex).find('.show-data');
    var _obj = ne_data[ne_option.val()];

    if ((type_option.val() == 1 && !("matrix" in _obj)) || (type_option.val() == 2 && !("controller" in _obj)) || (type_option.val() == 3 && !("electric" in _obj))) {
        var html = "<div class='tc'><span style='line-height: 40px;'>暂无数据。</span></div>"
        $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.status').hide();
        $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.btn-box').hide();
        $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.inner').html(html);
    } else {
        //判断主用/备用
        function is_last(obj, index) {
            var objLength = 0;
            for (var js2 in obj) {
                objLength++;
            }
            var _html = '';
            if (index != 0) {
                _html = "<span style='margin-right:14px;'>备用</span>"
                return _html;
            } else {
                _html = "<span style='margin-right:14px;'>主用</span>"
                return _html;
            }
        }

        //判断为空
        function is_idle(obj, index, status) {
            var objLength = 0;
            for (var js2 in obj) {
                objLength++;
            }

            var _html = "";
            return _html
            //if (index == objLength - 1 && (obj[index - 1].hasOwnProperty("disable") && obj[index - 1].disable && obj[index - 1].disable != 'false')) {
            //    if (status) {
            //        _html = "<span style='margin-left:14px;color:#999;display:inline-block;width:90px;text-align:left;'></span>"
            //    } else {
            //        _html = "<span style='margin-left:14px;color:#999;display:inline-block;width:90px;text-align:left;'>服务中</span>"
            //    }
            //    return _html;
            //} else if (index == objLength - 1) {
            //    if (status) {
            //        _html = "<span style='margin-left:14px;color:#999;display:inline-block;width:90px;text-align:left;'>空</span>"
            //    } else {
            //        _html = "<span style='margin-left:14px;color:#999;display:inline-block;width:90px;text-align:left;'>服务中</span>"
            //    }
            //    return _html;
            //} else {
            //    if (status) {
            //        _html = "<span style='margin-left:14px;color:#999;display:inline-block;width:90px;text-align:left;'>空</span>"
            //    } else {
            //        _html = "<span style='margin-left:14px;color:#999;display:inline-block;width:90px;text-align:left;'>服务中</span>"
            //    }
            //    return _html;
            //}
        }

        //显示提示信息
        function show_status(type) {
            var _method = ne_data[ne_option.val()][type].method, _msg = '';

            //if(_method=='lockout')_msg='目前的状态是：锁定主用';
            //else if(_method=='force')_msg='目前的状态是：强制备用';
            //else if(_method=='auto'){
            //    _msg='目前的状态是：自动到主用/备用切换';
            //}
            //else if(_method=='manual'){
            //    _msg='目前的状态是：手工主用';
            //}
            //else if(_method=='')_msg='';
            //
            //$(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.status').text(_msg);
            var btns = $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.btn');
            btns.removeClass('btn-disabled').attr('disabled', false);
            $.each(btns, function (index, _btn) {
                if (_method != 'manual') {
                    if ($(_btn).attr('method') && $(_btn).attr('method') == _method) {
                        $(_btn).nextAll('.dh-btn').addClass('btn-disabled').attr('disabled', true);
                        $(_btn).addClass('btn-disabled').attr('disabled', true)
                        $(_btn).siblings('.manual-btn').removeClass('btn-disabled').attr('disabled', false)
                    }
                }
            })
        }

        $.each(ne_data[ne_option.val()], function (index, item) {
            if (index == 'matrix' && type_option.val() == 1) {
                var html = '';
                $.each(ne_data[ne_option.val()].matrix.device, function (index, subItem) {
                    if (subItem.hasOwnProperty("disable") && subItem.disable && subItem.disable != 'false') {
                        html += "<div class='tc'>" + is_last(ne_data[ne_option.val()].matrix.device, index) + "<span class='show-data' method='" + ne_data[ne_option.val()].matrix.method + "' disable='true' location=" + subItem.location + ">" + subItem.val + "</span>" + is_idle(ne_data[ne_option.val()].matrix.device, index, true) + "</div>"
                        $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.btn-box').show();
                        $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.inner').html(html);
                    } else {
                        html += "<div class='tc'>" + is_last(ne_data[ne_option.val()].matrix.device, index) + "<span class='show-data' method='" + ne_data[ne_option.val()].matrix.method + "' location=" + subItem.location + ">" + subItem.val + "</span>" + is_idle(ne_data[ne_option.val()].matrix.device, index, false) + "</div>";
                        $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.btn-box').show();
                        $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.inner').html(html);
                    }
                })
                show_status('matrix')
            } else if (index == 'controller' && type_option.val() == 2) {
                var html = '';
                $.each(ne_data[ne_option.val()].controller.device, function (index, subItem) {
                    if (subItem.hasOwnProperty("disable") && subItem.disable && subItem.disable != 'false') {
                        html += "<div class='tc'>" + is_last(ne_data[ne_option.val()].controller.device, index) + "<span class='show-data' method='" + ne_data[ne_option.val()].controller.method + "' disable='true' location=" + subItem.location + ">" + subItem.val + "</span>" + is_idle(ne_data[ne_option.val()].controller.device, index, true) + "</div>"
                        $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.btn-box').show();
                        $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.inner').html(html);
                    } else {
                        html += "<div class='tc'>" + is_last(ne_data[ne_option.val()].controller.device, index) + "<span class='show-data' method='" + ne_data[ne_option.val()].controller.method + "' location=" + subItem.location + ">" + subItem.val + "</span>" + is_idle(ne_data[ne_option.val()].controller.device, index, false) + "</div>"
                        $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.btn-box').show();
                        $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.inner').html(html);
                    }
                })
                show_status('controller')
            } else if (index == 'electric' && type_option.val() == 3) {
                var html = '';
                $.each(ne_data[ne_option.val()].electric.device, function (index, subItem) {
                    if (subItem.hasOwnProperty("disable") && subItem.disable && subItem.disable != 'false') {
                        html += "<div class='tc'>" + is_last(ne_data[ne_option.val()].electric.device, index) + "<span class='show-data' method='" + ne_data[ne_option.val()].electric.method + "' disable='true' location=" + subItem.location + ">" + subItem.val + "</span>" + is_idle(ne_data[ne_option.val()].electric.device, index, true) + "</div>"

                        $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.btn-box').show();
                        $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.inner').html(html);
                    } else {
                        html += "<div class='tc'>" + is_last(ne_data[ne_option.val()].electric.device, index) + "<span class='show-data' method='" + ne_data[ne_option.val()].electric.method + "' location=" + subItem.location + ">" + subItem.val + "</span>" + is_idle(ne_data[ne_option.val()].electric.device, index, false) + "</div>"
                        $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.btn-box').show();
                        $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.inner').html(html);
                    }
                })
                show_status('electric')
            }
        })
        //只要存在一个叉叉，就执行下面的自动程序
        var span = $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.inner .show-data'), _msg = "", can = '';
        can = true;
//         debugger;
        $.each(span, function (index, item) {
           
            if ($(item).attr("disable")) {
                can = false;
            }
            if(span.eq(0).attr('location')== "true"&&span.eq(0).attr("disable")=='true'){
                _msg = '目前的状态是：自动转换到备用';
                if ($(item).attr("disable")=='true') {
                    _msg = '目前的状态是：主用在使用';
                }
                $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.status').show();
            }else if(span.eq(0).attr('location')=='true'&&span.eq(0).attr("disable")!='false'){
                _msg = '目前的状态是：自动转换到主用';
                $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.status').show();
            }else{
                _msg = '目前的状态是：备用在使用';
            }
        })
        if (ele = '#switching') {
            if (!can) {
                $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.btn-box .btn').removeClass('btn-disabled').attr('disabled', false);
                $(ele + ' .tabs-box .tab').eq(tabIndex).find('.btn-box').find('.manual-btn').addClass('btn-disabled').attr('disabled', true);
                $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.status').text(_msg);
                //$(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.btn-box .btn').addClass('btn-disabled').attr('disabled', true);

            } else {
                var this_method = $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.show-data').attr('method');
                if (this_method == 'manual' || this_method == 'auto') {
                    $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.status').text(_msg);
                } else if (this_method == 'lockout') {
                    $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.status').text('目前的状态是：锁定主用');
                } else if (this_method == 'force') {
                    $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.status').text('目前的状态是：强制备用');
                }else{
                    $.each(span, function (index, item) {
                        if ($(item).attr("location") == "true") {
                            _msg = '目前的状态是：' + $(item).prev().text()+'在使用';
                        }
                    })
                    $(ele + ' .tabs-box .tab').eq(tabIndex).find('.content').find('.status').text(_msg);
                }
            }
        }
    }
}

function protect_type() {
    $('#interface .tabs-box .tab').hide();
    //$('#interface .tabs-box .tab').eq(0).show();
    $('#interface .type').change(function () {
        var index = parseInt($(this).val());
        var tabs = $('#interface .tabs-box .tab');
        switch (index) {
            case 0:
                tabs.stop().hide();
                var has = false, id = '';
                $.each(hasProtectPlate, function (index, item) {
                    if ($('#interface .ne select').find('option').eq($('#interface .ne select').val()).attr('name') == item.name) {
                        has = true;
                        id = item.id;
                    }
                })
                if (has) {
                    tabs.eq(0).show();
                } else {
                    tabs.eq(0).hide();
                }
                break;
            case 1:
                _typeChange(1, '#interface');
                tabs.stop().hide();
                tabs.eq(1).show();
                break;
            case 2:
                _typeChange(2, '#interface');
                tabs.stop().hide();
                tabs.eq(2).show();
                break;
            case 3:
                _typeChange(3, '#interface');
                tabs.stop().hide();
                tabs.eq(3).show();
                break;
            default:
                tabs.stop().hide();
                tabs.eq(0).show();
        }
        $('#interface .tab .tip').text('');
    })
}

function protect_select() {
    $('#switching .tabs-box .tab').hide();
    //$('#switching .tabs-box .tab').eq(0).show();
    $('#switching .type').change(function () {
        var index = parseInt($(this).val());
        var tabs = $('#switching .tabs-box .tab');
        switch (index) {
            case 0:
                tabs.stop().hide();
                var has = false, id = '';
                $.each(hasProtectPlate, function (index, item) {
                    //console.log($('#switching .ne select').find('option').eq($('#switching .ne select').val()).attr('name'))
                    if ($('#switching .ne select').find('option').eq($('#switching .ne select').val()).attr('name') == item.name) {
                        has = true;
                        id = item.id;
                    }
                })
                if (has) {
                    tabs.eq(0).show();
                } else {
                    tabs.eq(0).hide();
                }
                break;
            case 1:
                _typeChange(1, '#switching');
                tabs.stop().hide();
                tabs.eq(1).show();
                break;
            case 2:
                _typeChange(2, '#switching');
                tabs.stop().hide();
                tabs.eq(2).show();
                break;
            case 3:
                _typeChange(3, '#switching');
                tabs.stop().hide();
                tabs.eq(3).show();
                break;
            default:
                tabs.stop().hide();
                tabs.eq(0).show();
        }
    })
}
function setting_btn_click(e, to_ele) {
    $('#img_wait').css({'display': 'table'});
	 e.parent().find('.tip').hide();
    setTimeout(function () {
        if (to_ele) {
            submit_protect_1N(to_ele, '', '', '', 'setting');
            e.parent().find('.tip').text('设置成功').css('color', 'red');
        } else {
            e.parent().find('.tip').text('已设置').css('color', 'red');
        }
        $('#img_wait').hide();
		 e.parent().find('.tip').show();
    }, set_time);
}
//模拟数据
var submit_protect_1N_data = [];
var default_fenders_data = [];

function submit_protect_1N(e, hasLock, lockBtn, status, func) {
    hasLock = hasLock ? hasLock : false;
    status = status ? status : false;
    var $ele = e ? e : $('#interface');
    if (e && e.hasClass('btn-default')) {

    } else {
        var data = {};
        var obj = $ele.find('select');

        data.ne_id = $ele.find('.ne select').val();
        data.plates = [];
        var platesItem = {};
        if ($ele.find('.type').val() == 0) {
            var options = $ele.find('.protect-plate select option');
            $.each(options, function (index, _option) {
                if (index == $ele.find('.protect-plate select').val()) {
                    platesItem.id = index;
                    platesItem.fender = $(_option).attr('name');
                }
            })
            //data.protectPlate = $ele.find('.protect-plate select').val();
        }

        //data.protectedPlate=$ele.find('.protect-plate select').val();
        var checkArr = [];
        var location=0;
        if (lockBtn) {
            var lis = lockBtn.parent().parent().find('.show-data');
            $.each(lis, function (index, item) {
                var oItem = {};
                oItem.id = $(item).attr('id');
                oItem.value = true;
                oItem.fenderName = $(item).attr('value');
                checkArr.push(oItem);
            })
        } else {
            var checkbox = $('#protectedFenders input[type=checkbox]');
            location=$('#protectedFenders input[type=checkbox]:checked').attr('id');
            $.each(checkbox, function (index, item) {
                var oItem = {};
                if ($(item).attr('checked') == 'checked') {
                    oItem.id = $(item).attr('id');
                    oItem.value = true;
                    oItem.fenderName = $(item).attr('value');
                    checkArr.push(oItem);
                } else {
                    oItem.id = $(item).attr('id');
                    oItem.value = false;
                    oItem.fenderName = $(item).attr('value');
                    checkArr.push(oItem);
                }
            })
        }

        //console.log(platesItem)
        platesItem.protectedPlate = checkArr;
        data.plates.push(platesItem);
        //console.log(JSON.stringify(data))
        if (submit_protect_1N_data.length > 0) {
            var has = '';
            $.each(submit_protect_1N_data, function (submit_data_index, submit_data_item) {
                if (submit_data_item.ne_id == data.ne_id) {
                    has = true;
                    var submit_data_item_has = '';
                    $.each(submit_data_item.plates, function (plates_index, plates_item) {
                        if (plates_item.id == $ele.find('.protect-plate select').val()) {
                            plates_item.protectedPlate = checkArr;
                            plates_item.location = location;
                            submit_data_item_has = true;
                        }
                    })
                    if (!submit_data_item_has) {
                        submit_data_item.plates.push(platesItem)
                    }
                }
            })
            if (!has) {
                submit_protect_1N_data.push(data);
            }
        } else {
            submit_protect_1N_data.push(data);
        }
        if (status) {
            $('.dh-btn').addClass('btn-disabled').attr('disabled', status);
            $('.lock-btn').attr('clocked', status);
            if (hasLock) {
                if (lockBtn) {
                    lockBtn.removeClass('btn-disabled').addClass('btn-disabled-blue').css({'cursor': 'not-allowed'});
                }
                $('.lock-btn').attr('clocked', true);
            }
        } else {
            $('.dh-btn').removeClass('btn-disabled').attr('disabled', status);
            $('.lock-btn').attr('clocked', status);
        }
        // localStorage.setItem("configSetting", JSON.stringify(submit_protect_1N_data));
        postData(submit_protect_1N_data,"protectFenders.json");

    }
}
function protectFendersClocked(e, status) {
    var btns = $('.dh-btn');

    if (status) {
        //锁定
        $('.lock-btn').attr('clocked', true);
        submit_protect_1N($('#switching'), true, '', status);
    } else {
        //清除
        $('.lock-btn').attr('clocked', false);
        submit_protect_1N($('#switching'), false, '', status);
        $('.dh-btn').removeClass('btn-disabled-blue');
    }
}
function change_main_tab() {
    var oLi = $('.main-tab-top li');
    oLi.eq(0).addClass('active');
    $('.main-tab').eq(0).show();
    oLi.each(function (i) {
        oLi.eq(i).click(function () {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            $('.main-tab').stop().hide().eq(i).show();
            if (i == 1) {
                protect_fenders_status();
                load_configSetting('#switching');

            } else {
                load_configSetting();
                $('#interface .content .tip').text('')

                var has = false, id = '';
                $.each(hasProtectPlate, function (index, item) {
                    if ($('#interface .ne select').find('option').eq($('#interface .ne select').val()).attr('name') == item.name) {
                        has = true;
                        id = item.id;
                    }
                })
                if (has) {
                    load_protectCheckbox(id)
                }
            }
            protect_lockout_btn_history_init();
            change_fender_history_init();
        })
    })

}
function runAjax(url, params, callback) {
    $.ajax({
        url: url,
        data: params,
        method: 'get',
        dataType: 'json',
        timeout: 5000,
        success: function (ret) {
            return callback(ret);
        },
        error: function () {
            console.log('network wrong!')
        }
    })
}
var ne_data = '';
var defaultProtectNE='';
var protectNE  =[];
function load_ne() {
    // var protectNE = localStorage.getItem('protectNE') ? JSON.parse(localStorage.getItem('protectNE')) : [];
    $.getJSON(url_path + 'data/7_3_3/ne.json', {}, function(data) {
         protectNE  = data;
        defaultProtectNE  = data;
    });
    // defaultProtectNE = localStorage.getItem('defaultProtectNE') ? JSON.parse(localStorage.getItem('defaultProtectNE')) : [];

    if (protectNE.length > 0) {
        ne_data = protectNE;
        var html = '';
        $.each(ne_data, function (index, item) {
            html += '<option value="' + item.id + '" name="' + item.name + '">' + item.name + '</option>';
            $('.ne select').html(html);
        })
    } else {
        var url = url_path + 'data/7_3_3/ne.json',
            params = '';
        runAjax(url, params, function (ret) {
            // localStorage.setItem('protectNE', JSON.stringify(ret));
            postData(ret,"ne.json");
            // localStorage.setItem('defaultProtectNE', JSON.stringify(ret));
            postData(ret,"ne.json");
            ne_data = ret;
            var html = '';
            $.each(ne_data, function (index, item) {
                html += '<option value="' + item.id + '" name="' + item.name + '">' + item.name + '</option>';
                $('.ne select').html(html);
            })
        })
    }
}
$.ajaxSetup({
    async: false
});
var protectCheckboxArr = [];
function load_protectCheckbox(id, select_value) {
    var protectFenders ='';
    // protectFenders = localStorage.getItem('configSetting') ? JSON.parse(localStorage.getItem('configSetting')) : [];
    $.getJSON(url_path + 'data/7_3_3/protectFenders.json', {}, function(data) {
         protectFenders = data;
    });
    if (id == '' || id == null || id == 'undefined') {
        $.each(hasProtectPlate, function (index, item) {
            if ($('#interface .ne select').find('option').eq($('#interface .ne select').val()).attr('name') == item.name) {
                id = item.id;
            }
        })
    }
    //select_value?select_value:0;
    if (protectFenders.length > 0) {
        protectCheckboxArr = protectFenders;
        $.each(protectCheckboxArr, function (index, item) {
            if (id && id == index) {
                var html = '';
                var html2 = '';
                $.each(item.plates, function (_platesIndex, _plates) {
                    //console.log(_plates)
                    html += '<option value="' + _plates.id + '" method="' + _plates.method + '" name="' + _plates.fender + '" status="' + _plates.status + '">' + _plates.fender + '</option>';
                    if (_plates.id == 0) {
                        $.each(_plates.protectedPlate, function (_protectedPlateIndex, _protectedPlate) {
                            if (_protectedPlate.value) {
                                html2 += '<div class="item"><input type="checkbox" onclick="change_check($(this));" id="' + _protectedPlate.id + '" value="' + _protectedPlate.fenderName + '" checked="checked"><span>' + _protectedPlate.fenderName + '</span></div>';
                            } else {
                                html2 += '<div class="item"><input type="checkbox" onclick="change_check($(this));" id="' + _protectedPlate.id + '" value="' + _protectedPlate.fenderName + '"><span>' + _protectedPlate.fenderName + '</span></div>';
                            }
                        })
                    }
                })
                $('#switching .protect-plate select').html(html);
                $('#switching .protect-plate select').val(select_value);
                setTimeout(function () {
                    $('#interface .protect-plate select').html(html);
                    $('#protectedFenders').html(html2);
                }, 0)
            }
        })
    } else {
        var url = url_path + 'data/7_3_3/protectFenders.json',
            params = '';
        runAjax(url, params, function (ret) {
            // localStorage.setItem('configSetting', JSON.stringify(ret));
            postData(ret,"protectFenders.json");
            // localStorage.setItem('defaultFenders', JSON.stringify(ret));
            postData(ret,"protectFenders.json");
            protectCheckboxArr = ret;
            $.each(protectCheckboxArr, function (index, item) {
                if (id && id == index) {
                    var html = '';
                    var html2 = '';
                    $.each(item.plates, function (_platesIndex, _plates) {
                        console.log(_plates)
                        html += '<option value="' + _plates.id + '" method="' + _plates.method + '" name="' + _plates.fender + '" status="' + _plates.status + '">' + _plates.fender + '</option>';
                        if (_plates.id == 0) {
                            $.each(_plates.protectedPlate, function (_protectedPlateIndex, _protectedPlate) {
                                if (_protectedPlate.value) {
                                    html2 += '<div class="item"><input type="checkbox" onclick="change_check($(this));" id="' + _protectedPlate.id + '" value="' + _protectedPlate.fenderName + '" checked="checked"><span>' + _protectedPlate.fenderName + '</span></div>';
                                } else {
                                    html2 += '<div class="item"><input type="checkbox" onclick="change_check($(this));" id="' + _protectedPlate.id + '" value="' + _protectedPlate.fenderName + '"><span>' + _protectedPlate.fenderName + '</span></div>';
                                }
                            })
                        }
                    })
                    $('#switching .protect-plate select').html(html);
                    $('#switching .protect-plate select').val(select_value);
                    setTimeout(function () {
                        $('#interface .protect-plate select').html(html);
                        $('#protectedFenders').html(html2);
                    }, 0)
                }
            })
        })
    }
}

function load_protectPlate() {

}
function load_protectType() {
    var url = url_path + 'data/7_3_3/protectType.json',
        params = '';
    runAjax(url, params, function (ret) {
        var html = '';
        $.each(ret, function (index, item) {
            html += '<option value="' + item.id + '" name="' + item.name + '">' + item.name + '</option>';
            $('.select-panel .type').html(html);
        })
    })
}
var hasProtectPlate = []
function load_has_protect_plate() {
    // hasProtectPlate=localStorage.getItem('hasProtectPlate')?JSON.parse(localStorage.getItem('hasProtectPlate')):[];
    // if (hasProtectPlate.length <= 0) {
    //     var url = url_path + 'data/7_3_3/hasProtectPlate.json',
    //         params = '';
    //     runAjax(url, params, function (ret) {
    //         hasProtectPlate = ret;
    //     })
    // }
    $.getJSON(url_path + 'data/7_3_3/hasProtectPlate.json', {}, function(data) {
        hasProtectPlate = data;
    });
}
function change_check(e) {

    //console.log(e.attr('checked'))
    if (e.attr('checked') == 'checked') {
        e.attr('checked', false)
    } else {
        e.attr('checked', true)
    }
}
function protect_fenders_status() {
    setTimeout(function () {
        $('#switching .content .btn-box .dh-btn').removeClass('btn-disabled').attr('disabled', false);
        var select = $('#switching .protect-plate select');
        var status = select.find('option').eq(select.val()).attr('status');
        if (status == 0) {
            $('#switching .content .status').text('目前的状态是：主用在使用')
        } else if (status == 1) {
            $('#switching .content .status').text('目前的状态是：锁定主用')
        } else if (status == 2) {
            $('#switching .content .status').text('目前的状态是：强制备用')
        } else if (status == 3) {
            $('#switching .content .status').text('目前的状态是：备用在使用')
        }
    }, 0)
}
function load_select_setting() {
    $("#protectedFendersChecked").parent().hide();

    $('#interface .ne select').change(function () {
        var _this = $(this);
        $('#interface .tab').eq(0).find('.tip').text('')
        if ($('#interface .type').val() == 0) {
            submit_protect_1N_data = [];
            load_configSetting();
            var has = false, id = '';
            $.each(hasProtectPlate, function (index, item) {
                if (_this.find('option').eq(_this.val()).attr('name') == item.name) {
                    has = true;
                    id = item.id;
                }
            })
            if (has) {
                load_protectCheckbox(id)
                $('#interface .tab').eq(0).show();
            } else {
                $('#interface .tab').eq(0).hide();
            }
        } else {
            _typeChange($('#interface .type').val(), '#interface');
        }
        $('#interface .tip').text('');
    })
    $('#interface .protect-plate select').change(function () {

        $('#interface .tab').eq(0).find('.tip').text('')
        submit_protect_1N_data = [];
        load_configSetting();
        var _this = $(this);
        $.each(protectCheckboxArr, function (itemIndex, topItem) {
            if (topItem.ne_id == $('#interface .ne select').val() && $('#interface .ne select').find('option').eq($('#interface .ne select').val()).attr('name') == topItem.ne_name) {
                //console.log(topItem);
                var html = '';
                var html2 = '';
                $.each(topItem.plates, function (_platesIndex, _plates) {
                    if (_this.val() == _platesIndex) {
                        $.each(_plates.protectedPlate, function (_protectedPlateIndex, _protectedPlate) {
                            if (_protectedPlate.value) {
                                html2 += '<div class="item"><input type="checkbox" onclick="change_check($(this));" id="' + _protectedPlate.id + '" value="' + _protectedPlate.fenderName + '" checked="checked"><span>' + _protectedPlate.fenderName + '</span></div>';
                            } else {
                                html2 += '<div class="item"><input type="checkbox" onclick="change_check($(this));" id="' + _protectedPlate.id + '" value="' + _protectedPlate.fenderName + '"><span>' + _protectedPlate.fenderName + '</span></div>';
                            }
                        })
                    }
                })
                setTimeout(function () {
                    $('#protectedFenders').html(html2);
                }, 0)
            }
        })
    })
    $('#switching .ne select').change(function () {
        var _this = $(this);
        if ($('#switching .type').val() == 0) {
            submit_protect_1N_data = [];
            protect_fenders_status()
            load_configSetting('#switching');
            var has = false, id = '';
            $.each(hasProtectPlate, function (index, item) {
                if (_this.find('option').eq(_this.val()).attr('name') == item.name) {
                    has = true;
                    id = item.id;
                }
            })
            if (has) {
                load_protectCheckbox(id, 0)
                $('#switching .tab').eq(0).show();
            } else {
                $('#switching .tab').eq(0).hide();
            }
        } else {
            _typeChange($('#switching .type').val(), '#switching');
        }
        protect_lockout_btn_history_init();
        change_fender_history_init();
    })
    $('#switching .type').change(function () {
        if ($('#switching .type').val() != 0) {
            _typeChange($('#switching .type').val(), '#switching');
        }
        protect_lockout_btn_history_init();
        change_fender_history_init();
    })
    $('#switching .protect-plate select').change(function () {
        submit_protect_1N_data = [];
        change_fender_history_init();
        protect_fenders_status()
        load_configSetting('#switching');
        var _this=$(this);
        setTimeout(function(){_this.parent().parent().find('.dh-btn').removeClass('btn-disabled').attr('disabled', false)},0)
    })
}
function load_configSetting(ele) {
    load_has_protect_plate();

    var $ele = ele ? $(ele) : $('#interface');
    //模拟读取配置 开始
    setTimeout(function () {
        // default_fenders_data= localStorage.getItem('defaultFenders') ? JSON.parse(localStorage.getItem('defaultFenders')) : [];
        $.getJSON(url_path + 'data/7_3_3/protectFenders.json', {}, function(data) {
            default_fenders_data = data;
            submit_protect_1N_data = data;
        });

        // submit_protect_1N_data = localStorage.getItem('configSetting') ? JSON.parse(localStorage.getItem('configSetting')) : [];
        _do();
    }, 0)

    //模拟读取配置 结束


    function _do() {
        if (submit_protect_1N_data.length > 0) {

            $.each(submit_protect_1N_data, function (index, item) {
                //改变数据

                if (item.ne_id == $ele.find('.ne select').val()) {

                    if (item.plates.length > 0) {

                        $.each(item.plates, function (_platesIndex, _plates) {

                            if (_plates.id == $ele.find('.protect-plate select').val()) {


                                var html = '';
                                var _input = $('#protectedFenders input');
                                var _method='';
                                $.each(_plates.protectedPlate, function (protectedPlateIndex, _protectedPlate) {
                                    if (_protectedPlate.value) {
                                        if(_plates.location==_protectedPlate.id){
                                            html += "<div class='item'><input type='radio' id='" + _protectedPlate.id + "' checked name='protectedPlate' onclick='chooseProtectedPlate($(this))' style='width:16px!important;height:30px!important;display: inline-block!important;margin:6px!important;float:left;!important;position:static!important;opacity: 1!important;'><span class='show-data' id='" + _protectedPlate.id + "' selected='selected'>" + _protectedPlate.fenderName + "</span></div>";
                                        }else{
                                            html += "<div class='item'><input type='radio' id='" + _protectedPlate.id + "' name='protectedPlate' onclick='chooseProtectedPlate($(this))' style='width:16px!important;height:30px!important;display: inline-block!important;margin:6px!important;float:left;!important;position:static!important;opacity: 1!important;'><span class='show-data' id='" + _protectedPlate.id + "'>" + _protectedPlate.fenderName + "</span></div>";
                                        }
                                        _method=_plates.method;

                                    }
                                })
                                if (html == '') {
                                    $("#protectedFendersChecked").parent().parent().siblings('.no-data').show();
                                    $("#protectedFendersChecked").parent().parent().siblings('.status').hide();
                                    $("#protectedFendersChecked").parent().parent().siblings('.btn-box').hide();
                                    $("#protectedFendersChecked").parent().hide();
                                } else {
                                    $('#protectedFendersChecked').html(html).parent().show();
                                    if(_method=='lockout'){
                                        $("#protectedFendersChecked").parent().parent().parent().find('.btn-box .dh-btn').addClass('btn-disabled').prop('disabled',true)
                                    }else if(_method=='force'){
                                        $("#protectedFendersChecked").parent().parent().parent().find('.btn-box .dh-btn').eq(1).addClass('btn-disabled').prop('disabled',true)
                                        $("#protectedFendersChecked").parent().parent().parent().find('.btn-box .dh-btn').eq(2).addClass('btn-disabled').prop('disabled',true)
                                    }
                                    $("#protectedFendersChecked").parent().parent().siblings('.no-data').hide();
                                    $("#protectedFendersChecked").parent().parent().siblings('.status').show();
                                    $("#protectedFendersChecked").parent().parent().siblings('.btn-box').show();
                                }
                            }
                        })
                    }
                }
            })
        } else {
            $("#protectedFendersChecked").parent().parent().siblings('.no-data').show();
            $("#protectedFendersChecked").parent().parent().siblings('.status').hide();
            $("#protectedFendersChecked").parent().parent().siblings('.btn-box').hide();
            $("#protectedFendersChecked").parent().hide();
        }
    }
}
function MN_dh(e, hasLock, lockBtn, status) {
    if (status) {
        $('.dh-btn').addClass('btn-disabled').attr('disabled', status);
        $('.lock-btn').attr('clocked', status);
        if (hasLock) {
            if (lockBtn) {
                lockBtn.removeClass('btn-disabled').addClass('btn-disabled-blue').css({'cursor': 'not-allowed'});
            }
            $('.lock-btn').attr('clocked', true);
        }
    } else {
        $('.dh-btn').removeClass('btn-disabled').attr('disabled', status);
        $('.lock-btn').attr('clocked', status);
    }
}

var change_fender_history = [];
function change_fender_history_init() {
    change_fender_history = [];
}
function chooseProtectedPlate(e) {
    e.parent().parent().find('.show-data').removeAttr("selected");
    e.siblings().attr('selected', true);
}
function changeFender(e, method) {
    if ($('#protectedFendersChecked').find('input[name="protectedPlate"]:checked').length > 0) {
        function confirm_change(params) {
            var options = $('#switching .protect-plate select option');
            var _options = $('#interface .protect-plate select option');
            var selected_val = $('#switching .protect-plate select').val();
            var show_data_change_to = options.eq(selected_val).attr('name');
            var select_change_to_text = '';
            var spans = $('#protectedFendersChecked').find('.show-data');

            if (params.change) {
                $.each(spans, function (_spanIndex, _span) {
                    //console.log(_span)
                    if ($(_span).attr('selected')) {
                        select_change_to_text = $(_span).text();
                        //console.log(select_change_to_text)
                        $(_span).text(show_data_change_to);
                        $.each($('#protectedFenders .item input'), function (_inputIndex, _inputItem) {
                            if ($(_inputItem).attr('id') == $(_span).attr('id')) {
                                $(_inputItem).attr('value', show_data_change_to);
                                $(_inputItem).siblings().text(show_data_change_to);
                            }
                        })
                    }
                })
                options.eq(selected_val).attr('name', select_change_to_text).text(select_change_to_text);
                _options.eq(selected_val).attr('name', select_change_to_text).text(select_change_to_text);
            }

            var neVal = $('#switching .ne select').val();
            var protectPlateVal = $('#switching .protect-plate select').val();
            var new_name = $('#switching .protect-plate select option').eq(protectPlateVal).attr('name');

            var new_status = $('#switching .protect-plate select option').eq(protectPlateVal).attr('status');
            $.each(submit_protect_1N_data, function (index, item) {
                if (neVal == item.ne_id) {
                    $.each(item.plates, function (_plateIndex, _plate) {
                        if (protectPlateVal == _plate.id) {
                            _plate.status = new_status;
                        }
                        if(params.method=='lockout'){
                            _plate.method = params.method;
                        }
                        if (protectPlateVal == _plate.id && params.change) {
                            var beforeFender = _plate.fender;
                            _plate.fender = new_name;
                            _plate.location = location;
                            _plate.method = params.method;
                            var select_id = $('#switching #protectedFendersChecked input[name="protectedPlate"]:checked').siblings('.show-data').attr('id');
                            $.each(_plate.protectedPlate, function (_protectedPlateIndex, _protectedPlate) {
                                if (_protectedPlate.id == select_id) {
                                    _protectedPlate.fenderName = beforeFender;
                                }
                            })
                        }
                    })
                }
            })
            // localStorage.setItem('configSetting', JSON.stringify(submit_protect_1N_data));
            postData(submit_protect_1N_data,"protectFenders.json");
            load_protectCheckbox(neVal, selected_val);
            //倒换的数据已经做好。只差判定按钮状态   一级按钮状态流程

            if (params.method && params.method != 'manual') {
                params.ele.nextAll('.dh-btn').addClass('btn-disabled').attr('disabled', true);
                params.ele.addClass('btn-disabled').attr('disabled', true)
            } else if (params.method && params.method == 'manual'||params.method == 'clear') {

            } else {
                params.ele.siblings('.dh-btn').removeClass('btn-disabled').attr('disabled', false);
                params.ele.removeClass('btn-disabled').attr('disabled', false)
            }
        }

        var _method='';

        var btns = e.parent().find('.btn');
        var items = $('#protectedFendersChecked .item');
        var cache = {};
        cache.method = method;
        cache.selected = '';
        cache.btns = [];
        cache.status=$('#switching .protect-plate select option').eq($('#switching .protect-plate select').val()).attr('status');
        cache.protectFender=$('#switching .protect-plate select option').eq($('#switching .protect-plate select').val()).attr('name');
        cache.plateIndex=$('#switching .protect-plate select').val();
        cache.statusText = e.parent().parent().find('.status').text();
        $.each(btns, function (index, _btn) {
            if ($(_btn).attr('disabled')) {
                cache.btns.push(true)
            } else {
                cache.btns.push(false)
            }
        })
        $.each(items, function (_index, _items) {
            if ($(_items).find('.show-data').attr('selected')) {
                cache.selected=_index;
                cache.protectedPlate=$(_items).find('.show-data').text();
            }
        })
        change_fender_history.push(cache)
        if(change_fender_history.length>3){
            change_fender_history.splice(0,1);
        }

        var location=$('#switching #protectedFendersChecked input[name="protectedPlate"]:checked').attr('id');
        if (method == 'lockout') {
            $('#img_wait').css({'display': 'table'});
            setTimeout(function () {
                var select = $('#switching .protect-plate select');
                select.find('option').eq(select.val()).attr('status', 1);
                e.parent().parent().find('input:radio').prop("disabled", true);
                e.parent().parent().find('.status').text('目前的状态是：锁定主用')
                $('#switching .protect-plate select option').eq($('#switching .protect-plate select').val()).attr('method','lockout')
                confirm_change({
                    ele: e,
                    method: 'lockout',
                    change: false,
                })
                $('#img_wait').hide();
            }, set_time);
        } else if (method == 'force') {
            $('#img_wait').css({'display': 'table'});
            setTimeout(function () {
                var select = $('#switching .protect-plate select');
                select.find('option').eq(select.val()).attr('status', 2);
                e.parent().parent().find('input:radio').prop("disabled", true);
                e.parent().parent().find('.status').text('目前的状态是：强制备用')
                $('#switching .protect-plate select option').eq($('#switching .protect-plate select').val()).attr('method','force')
                confirm_change({
                    ele: e,
                    method: 'force',
                    change: true,
                })
                $('#img_wait').hide();
            }, set_time);
        } else if (method == 'manual') {
            $('#img_wait').css({'display': 'table'});
            setTimeout(function () {
                var select = $('#switching .protect-plate select');
                var status = select.find('option').eq(select.val()).attr('status');
                if (status == 0) {
                    e.parent().parent().find('.status').text('目前的状态是：备用在使用')
                    select.find('option').eq(select.val()).attr('status', 3);
                } else if (status == 1) {
                    e.parent().parent().find('.status').text('目前的状态是：备用在使用')
                    select.find('option').eq(select.val()).attr('status', 3);
                } else if (status == 2) {
                    e.parent().parent().find('.status').text('目前的状态是：主用在使用')
                    select.find('option').eq(select.val()).attr('status', 0);
                } else if (status == 3) {
                    e.parent().parent().find('.status').text('目前的状态是：主用在使用')
                    select.find('option').eq(select.val()).attr('status', 0);
                }
                e.parent().parent().find('input:radio').prop("disabled", true);
                $('#switching .protect-plate select option').eq($('#switching .protect-plate select').val()).attr('method','manual')
                confirm_change({
                    ele: e,
                    method: 'manual',
                    change: true,
                })
                $('#img_wait').hide();
            }, set_time);
        } else {
            $('#img_wait').css({'display': 'table'});
            setTimeout(function () {
                var neVal = $('#switching .ne select').val();
                var protectPlateVal = $('#switching .protect-plate select').val();
                var default_plate='';
                $.each(default_fenders_data, function (index, item) {
                    if (neVal == item.ne_id) {
                        $.each(item.plates, function (_plateIndex, _plate) {
                            if (protectPlateVal == _plate.id) {
                                default_plate=_plate;
                            }
                        })
                    }
                })
                var before_location='';
                $.each(submit_protect_1N_data, function (index, item) {
                    if (neVal == item.ne_id) {
                        $.each(item.plates, function (_plateIndex, _plate) {
                            if (protectPlateVal == _plate.id) {
                                before_location=item.plates[_plateIndex].location;
                                item.plates[_plateIndex]=default_plate;
                                item.plates[_plateIndex].location=before_location;
                                item.plates[_plateIndex].method=_method;
                            }
                        })
                    }
                })
                // localStorage.setItem('configSetting', JSON.stringify(submit_protect_1N_data))
                postData(submit_protect_1N_data,"protectFenders.json");
                load_configSetting($('#switching'));
                var has = false, id = '';
                $.each(hasProtectPlate, function (index, item) {
                    has = true;
                    if ($('#switching .ne select').find('option').eq($('#switching .ne select').val()).attr('name') == item.name) {
                        id = item.id;
                    }
                })
                if (has) {
                    load_protectCheckbox(id,protectPlateVal)
                }
                _method=change_fender_history[0].method;
                e.siblings('.dh-btn').removeClass('btn-disabled').attr('disabled', false);
                e.removeClass('btn-disabled').attr('disabled', false)
                if(change_fender_history.length>3){
                    if(change_fender_history[0].method=='force'&&change_fender_history[1].method!='lockout'){
                        e.siblings('.dh-btn').eq(0).removeClass('btn-disabled').attr('disabled', false);
                    }else if(change_fender_history[1].method=='lockout'&&change_fender_history[0].method=='force'){

                        e.siblings('.dh-btn').eq(0).removeClass('btn-disabled').attr('disabled', false);
                        e.siblings('.dh-btn').eq(1).addClass('btn-disabled').attr('disabled', true);
                        e.siblings('.dh-btn').eq(2).addClass('btn-disabled').attr('disabled', true);
                    }
                }

                $('#img_wait').hide();
            }, set_time);

            function go_back(){
                ////返回上一操作
                var btns = e.parent().find('.btn');
                var history_length = change_fender_history.length;
                if (history_length >= 2 && change_fender_history[history_length - 2].method != 'clear') {

                }
            }
        }
    }
}
var protect_lockout_btn_history = [];
function protect_lockout_btn_history_init() {
    protect_lockout_btn_history = [];
    var tabIndex = '';
    if ($('#switching .type').val() != 0) {
        tabIndex = $('#switching .type').val();
    }
    var span = $('#switching .tab').eq(tabIndex).find('.inner .tc .show-data');
    var cache = {};
    cache.locations = [];
    $.each(span, function (index, item) {
        if ($(item).attr('location') == 'true') {
            cache.locations.push(true)
        } else {
            cache.locations.push(false)
        }
        cache.method = $(item).attr('method');
    })
}
function protect_lockout_btn(e, method) {
    var span = e.parent().parent().find('.inner .tc .show-data');
    var btns = e.parent().find('.btn');
    var can = '';
    can = true;
    var cache = {};
    cache.method = method;
    cache.locations = [];
    cache.btns = [];
    cache.status = e.parent().parent().find('.status').text();
    $.each(btns, function (index, _btn) {
        if ($(_btn).attr('disabled')) {
            cache.btns.push(true)
        } else {
            cache.btns.push(false)
        }
    })
    $.each(span, function (index, item) {
        if ($(item).attr('location') == 'true') {
            cache.locations.push(true)
        } else {
            cache.locations.push(false)
        }
        $(item).attr('method', method);
        if ($(item).attr("disable")) {
            can = false;
        }
    })
    protect_lockout_btn_history.push(cache);
    function submit_location(params) {
        var neVal = $('#switching .ne select').val();
        var typeVel = '';
        if ($('#switching .type').val() == 1) {
            typeVel = 'matrix'
        } else if ($('#switching .type').val() == 2) {
            typeVel = 'controller'
        } else if ($('#switching .type').val() == 3) {
            typeVel = 'electric'
        }
        var locationArr = [];
        if (params.change) {
            $.each(params.ele.parent().parent().find('.show-data'), function (index, _e) {
                if ($(_e).attr('location') == 'true') {
                    $(_e).attr('location', false)
                    locationArr.push(false)
                } else {
                    if (params.method == 'manual') {
                        params.msg = $(_e).prev().text() + '在使用';
                    }
                    $(_e).attr('location', true)
                    locationArr.push(true)
                }
            })
        } else {
            $.each(params.ele.parent().parent().find('.show-data'), function (index, _e) {
                if ($(_e).attr('location') == 'true') {
                    locationArr.push(true)
                } else {
                    locationArr.push(false)
                }
            })
        }
        if (params.method == 'lockout') {
            params.ele.parent().parent().find('.show-data').attr('location', false)
            params.ele.parent().parent().find('.show-data').eq(0).attr('location', true)
            locationArr = [true, false];
        }
        $.each(ne_data[neVal][typeVel].device, function (index, item) {
            item.location = locationArr[index];
        })
        ne_data[neVal][typeVel].method = params.method;

        // localStorage.setItem('protectNE', JSON.stringify(ne_data))
        postData(ne_data,"ne.json");
        if (params.method && params.method != 'manual') {
            params.ele.nextAll('.dh-btn').addClass('btn-disabled').attr('disabled', true);
            params.ele.addClass('btn-disabled').attr('disabled', true)
            params.ele.parent().siblings('.status').text('目前的状态是：' + params.msg);
        } else if (params.method && params.method == 'manual') {
            params.ele.parent().siblings('.status').text('目前的状态是：' + params.msg);
        } else {
            params.ele.parent().siblings('.status').text('');
            params.ele.siblings('.dh-btn').removeClass('btn-disabled').attr('disabled', false);
            params.ele.removeClass('btn-disabled').attr('disabled', false)
        }
    }

    if (method == 'lockout') {
        $('#img_wait').css({'display': 'table'});
        setTimeout(function () {
            submit_location({
                ele: e,
                method: 'lockout',
                change: false,
                msg: '锁定主用'
            })
            $('#img_wait').hide();
        }, set_time);
    }
    else if (method == 'force') {
        $('#img_wait').css({'display': 'table'});
        setTimeout(function () {
            submit_location({
                ele: e,
                method: 'force',
                change: true,
                msg: '强制备用'
            })
            $('#img_wait').hide();
        }, set_time);

    }
    else if (method == 'auto') {
        $('#img_wait').css({'display': 'table'});
        setTimeout(function () {
            submit_location({
                ele: e,
                method: 'auto',
                change: false,
                msg: '自动主用/备用切换'
            })
            $('#img_wait').hide();
        }, set_time);
    }
    else if (method == 'manual') {
        $('#img_wait').css({'display': 'table'});
        setTimeout(function () {
            submit_location({
                ele: e,
                method: 'manual',
                change: true,
                msg: '手工主用'
            })
            $('#img_wait').hide();
        }, set_time);
    }
    else {
        $('#img_wait').css({'display': 'table'});
        setTimeout(function () {
            var neVal = $('#switching .ne select').val();
            var typeVel = '';
            if ($('#switching .type').val() == 1) {
                typeVel = 'matrix'
            } else if ($('#switching .type').val() == 2) {
                typeVel = 'controller'
            } else if ($('#switching .type').val() == 3) {
                typeVel = 'electric'
            }

            e.siblings().removeClass('btn-disabled').attr('disabled', false);
            // defaultProtectNE = localStorage.getItem('defaultProtectNE') ? JSON.parse(localStorage.getItem('defaultProtectNE')) : [];
            $.getJSON(url_path + 'data/7_3_3/ne.json', {}, function(data) {
                defaultProtectNE = data;
            });
            var default_type_data='';
            $.each(defaultProtectNE, function (_index, _item) {
                if (neVal == _item.id) {
                    default_type_data=_item[typeVel];
                }
            })
            $.each(ne_data, function (index, item) {
                if (neVal == item.id) {
                    item[typeVel]=default_type_data;
                }
            })
            // localStorage.setItem('protectNE', JSON.stringify(ne_data));
            postData(ne_data,"ne.json");
            _typeChange($('#switching .type').val(), '#switching')
            $('#img_wait').hide();
        }, set_time);

    }
}
function loadDefault() {
    load_ne();
    load_protectCheckbox();
    load_protectType();
    load_protectPlate();

    //加载默认设置
    load_configSetting();
    load_select_setting();

}


$(function () {
	localStorage.clear();
 // sessionStorage.clear();
    loadDefault();
    setTimeout(function () {
        protect_type();
        protect_select();
        change_main_tab();
        //$('#interface .tab').eq(0).hide();
    }, 0);
})