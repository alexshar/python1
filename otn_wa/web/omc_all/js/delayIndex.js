
var url_path = '/oms1350/web/eqm/omc_all/';
var nesForLinkPoint = []; //网元的点
var nesForLinkPoint02 = [];
var nesForLinks = []; //连接线
var createCurrDia;

// var server_path = 'https://135.251.96.54:8443';
var cgi_path = "https://135.251.96.98:8443/cgi-bin/test.cgi";
$.getJSON(url_path + 'data/10_2/delayMatrixNe.json', function(data) {
    prot = data.port;
});

$.getJSON(url_path + 'data/10_2/delayMatrixNe.json', {}, function(data) {
    //	console.log(data);
    nesForLinkPoint = data;
    nesForLinkPoint02 = data;
    nesForLinkPoint02.forEach(function(item) {
        $(".searchNe").append("<option  value=" + item.neId + ">" + item.neUserLabel + "</option>");
    });
    nesForLinkPoint02[0].neChildren.forEach(function(item02) {
        $(".searchGuangFang").append("<option  value=" + item02 + ">" + item02 + "</option>");
    });
});
$.getJSON(url_path + 'data/10_2/conn.json', {}, function(data) {
    nesForLinks = data;
    var nesForLinksNew=[];
    nesForLinks.forEach(function(obj) {
        if(obj.showLine){
            nesForLinksNew.push(obj);
        }
    });
    var nesForLinks04 = [];
    var _trs="";
    nesForLinksNew.forEach(function(item, k) {
        nesForLinks04.push(item.Apoint);
        nesForLinks04.push(item.Zpoint);
    });
    nesForLinks04.sort(function (a, b) {
        return a.neUserLabel < b.neUserLabel ? -1 : 1
    });
    nesForLinks04.forEach(function(item, j) {
        _trs += "<tr><td><input type='checkbox' checkGuanQxian='" + item.neUserLabel + "'  style='position: inherit;opacity: 1;left: 0px' /></td><td>" + getNeName(item.neId) + "</td><td>" + item.neUserLabel + "</td><td><button onclick=setChange('" + item.neUserLabel + "')>手动配置</button></td><td><button onclick=deleteOpt('" + item.neUserLabel + "') optical='" + item.neUserLabel + "'>删除</button></td></tr>";
    });
    $("#chooseAll").removeAttr("checked");
    $("#myTable tbody").empty();
    $("#myTable tbody").append(_trs);
    $("#myTable,#showSetting").css("visibility","visible");
});
// 显示对应的光放
function showGuang(k) {
    // 显示相对应的光放
    if(nesForLinkPoint02.length > 0) {
        nesForLinkPoint02.forEach(function(i, item) {
            if(i.neId == k) {
                //						console.log(k);
                $(".searchGuangFang").empty();
                i.neChildren.forEach(function(item02, j) {
                    $(".searchGuangFang").append("<option  value=" + item02 + ">" + item02 + "</option>");
                });
            }
        });
    } else {
        nesForLinkPoint.forEach(function(i, item) {
            if(i.neId == k) {
                //						console.log(k);
                $(".searchGuangFang").empty();
                i.neChildren.forEach(function(item02, j) {
                    $(".searchGuangFang").append("<option  value=" + item02 + ">" + item02 + "</option>");
                });
            }
        });
    }
}

// 显示对应的光放
function showGuang02(k) {
    // 显示相对应的光放
    nesForLinkPoint02.forEach(function(i, item) {

        if(i.neUserLabel == k) {
            //						console.log(k);
            $(".searchGuangFang").empty();
            i.neChildren.forEach(function(item02, j) {
                $(".searchGuangFang").append("<option value=" + item02 + ">" + item02 + "</option>");
            });
        }
    });
}

// 显示所有的信息
function reload() {
    var tr = ""; //添加每行的信息
    if($("#myTable").css("visibility") == "hidden") {
        $("#myTable").css("visibility", "visible");
    }
    if($("#showSetting").css("visibility") == "hidden") {
        $("#showSetting").css("visibility", "visible");
    }
    // nesForLinks.forEach(function(item, j) {
    //     tr += "<tr><td><input type='checkbox' checkGuanQxian='" + item.Apoint.neUserLabel + "'  style='position: inherit;opacity: 1;left: 0px' /></td><td>" + getNeName(item.Apoint.neId) + "</td><td>" + item.Apoint.neUserLabel + "</td><td><button onclick=setChange('" + item.Apoint.neUserLabel + "')>手动配置</button></td><td><button onclick=deleteOpt('" + item.Apoint.neUserLabel + "') optical='" + item.Apoint.neUserLabel + "'>删除</button></td></tr>";
    //     tr += "<tr><td><input type='checkbox' checkGuanQxian='" + item.Zpoint.neUserLabel + "'  style='position: inherit;opacity: 1;left: 0px' /></td><td>" + getNeName(item.Zpoint.neId) + "</td><td>" + item.Zpoint.neUserLabel + "</td><td><button onclick=setChange('" + item.Zpoint.neUserLabel + "')>手动配置</button></td><td><button onclick=deleteOpt('" + item.Zpoint.neUserLabel + "') optical='" + item.Zpoint.neUserLabel + "'>删除</button></td></tr>";
    // });
    var nesForLinks04 = [];
    nesForLinks.forEach(function(item, k) {
        nesForLinks04.push(item.Apoint);
        nesForLinks04.push(item.Zpoint);
    });
    nesForLinks04.sort(function (a, b) {
        return a.neUserLabel < b.neUserLabel ? -1 : 1
    });
    nesForLinks04.forEach(function(item, j) {
        tr += "<tr><td><input type='checkbox' checkGuanQxian='" + item.neUserLabel + "'  style='position: inherit;opacity: 1;left: 0px' /></td><td>" + getNeName(item.neId) + "</td><td>" + item.neUserLabel + "</td><td><button onclick=setChange('" + item.neUserLabel + "')>手动配置</button></td><td><button onclick=deleteOpt('" + item.neUserLabel + "') optical='" + item.neUserLabel + "'>删除</button></td></tr>";
    });
    // console.log(nesForLinks04);
    $("#chooseAll").removeAttr("checked");
    $("#myTable tbody").empty();
    $("#myTable tbody").append(tr);
    // $("#searchAllInfo").attr("disabled", "disabled");
    // $("#addSetingArea,#searchAllInfo").css("visibility", "hidden");
    nesForLinkPoint02 = []; // 添加每个选项的内容重置为空
}

// 根据ne id 获取ne名字
function getNeName(id) {
    var neName = "";
    nesForLinkPoint.forEach(function(item, j) {
        //		console.log(item.neId+" "+id);
        if(item.neId == id) {
            neName = item.neUserLabel;
        }
    });
    return neName;
}

function getNeName02(id) {
    var neName = "";
    nesForLinkPoint02.forEach(function(item, j) {

        if(item.neId == id) {

            neName = item.neUserLabel;
        }
    });
    return neName;
}

// 添加配置项目
$("#searchInfo").bind("click", function() {
    if($("#showSetting").css("visibility") == "hidden") {
        $("#showSetting").css("visibility", "visible");
    }
    if($("#myTable").css("visibility") == "hidden") {
        $("#myTable").css("visibility", "visible");
    }
    var selectNe = $(".searchNe option:selected").text();
    var selectguanQxian = $(".searchGuangFang option:selected").text();

    var _isHaveGuanQxian = false;
    // 查询 table 中是否有该项
    $("#myTable input:checkbox[id!='chooseAll']").each(function(j, item) {
        if($(item).attr("checkGuanQxian") == selectguanQxian) {
            _isHaveGuanQxian = true;
        }
    });
    if(_isHaveGuanQxian){
        alert("列表中已经有此项");
    }else {
        var ltr = "";
        ltr = "<tr><td><input type='checkbox'  checkGuanQxian='" + selectguanQxian + "' style='position: inherit;opacity: 1;left: 0px'/></td><td>" + selectNe + "</td><td>" + selectguanQxian + "</td><td><button onclick=setChange('" + selectguanQxian + "')>手动配置</button></td><td><button onclick=deleteOpt('" + selectguanQxian + "')>删除</button></td></tr>";

        $("#myTable tbody").append(ltr);
    }


    // var _index = -1,
    //     ind = -1;
    // nesForLinkPoint02.forEach(function(item, k) {
    //     if(item.neUserLabel == selectNe) {
    //         _index = k;
    //         item.neChildren.forEach(function(item02, i) {
    //             if(item02 == selectguanQxian) {
    //                 ind = i;
    //             }
    //         });
    //     }
    // });
    // 添加一项就原数据就少一项
    // nesForLinkPoint02[_index].neChildren.splice(ind, 1);
    //再查询网元对应的光放数量，如果为0，网元就删除
    // var _len = nesForLinkPoint02[_index].neChildren.length;
    //				console.log(arrs02);
    // 更新页面
    // showGuang02(selectNe);
    // if(_len == 0) {
    //     nesForLinkPoint02.splice(_index, 1);
    //     // 重置 searchNe 下拉列表中的值
    //     $(".searchNe").empty();
    //     nesForLinkPoint02.forEach(function(item) {
    //         $(".searchNe").append("<option  value=" + item.neId + ">" + item.neUserLabel + "</option>");
    //
    //     });
    //
    //     if(nesForLinkPoint02.length > 0) {
    //         nesForLinkPoint02[0].neChildren.forEach(function(item02) {
    //             $(".searchGuangFang").append("<option  value=" + item02 + ">" + item02 + "</option>");
    //         });
    //     }
    //
    //     if(nesForLinkPoint02.length == 0) {
    //         $("#addSetingArea,#searchAllInfo").css("visibility", "hidden");
    //     }
    // }
    //				console.log(nesForLinkPoint);
});

$("#myTable").delegate("input:checkbox[id!='chooseAll']", "click", function() {
    // 获取表格tr的数量
    var _trLen = $("input:checkbox[id!='chooseAll']").length;
    var _checkLen = 0; // 获取选中的网元
    // 全选、反选
    $("input:checkbox[id!='chooseAll']").each(function(k, item) {
        if($(item).prop("checked")) {
            _checkLen++;
        }
    });
    $("#chooseAll").prop("checked", (_trLen == _checkLen));
});

//全选按钮
$("#chooseAll").on("click", function() {
    var isChecked = $(this).prop("checked");
    $("input:checkbox[id!='chooseAll']").each(function(k, item) {
        $(item).prop("checked", isChecked);
    });
});

var _chooseOptSelect = []; //后退的下拉列表集合
// 删除单个光纤
function deleteOpt(k) {
    var _deleIndex = -1; //要删除的行
    $("#myTable input:checkbox[id!='chooseAll']").each(function(j, item) {
        if($(item).attr("checkGuanQxian") == k) {
            _deleIndex = j;
        }
    });
    $('#myTable tr').eq((_deleIndex + 1)).remove();
    var _trLength = $('#myTable tr').length;
    //	console.log(_trLength);
    if(_trLength == 1) {
        $("#searchAllInfo").css("visibility", "visible");
        $("#chooseAll").prop("checked", false);
    }
    //反向添加下拉列表
    var _neId = -1; //获取网元id
    // nesForLinks.forEach(function(obj) {
    //     if(obj.Apoint.neUserLabel == k) {
    //         _neId = obj.Apoint.neId;
    //     }
    //     if(obj.Zpoint.neUserLabel == k) {
    //         _neId = obj.Zpoint.neId;
    //     }
    // });
    // 吧删除的光纤退回到下拉框中
    // var _isFindNe = false; //查看数组中是否有值
    //					debugger;

    // var _isFind = false;
    //	debugger;
    // if(nesForLinkPoint02.length > 0) {
    //     nesForLinkPoint02.forEach(function(i, item) {
    //         if(i.neId == _neId) {
    //             i.neChildren.push(k);
    //             _isFind = true;
    //         }
    //     });
    //     if(!_isFind) {
    //         nesForLinkPoint02.push({
    //             "neId": _neId,
    //             "neUserLabel": getNeName(_neId),
    //             "neChildren": [k]
    //         });
    //     }
    // } else {
    //     nesForLinkPoint02.push({
    //         "neId": _neId,
    //         "neUserLabel": getNeName(_neId),
    //         "neChildren": [k]
    //     });
    // }
    //	console.log(nesForLinkPoint02);
    // var neIdArray = [];
    // nesForLinkPoint02.forEach(function(item) {
    //     neIdArray.push(item.neUserLabel);
    //     item.neChildren.sort();
    // });
    // neIdArray.sort();
    // var _newArr = [];
    // neIdArray.forEach(function(val, index) {
    //     nesForLinkPoint02.forEach(function(item) {
    //         if(val == item.neUserLabel) {
    //             _newArr.push(item);
    //         }
    //     });
    // });
    // console.log(nesForLinkPoint);
    //		console.log(_newArr);
    // nesForLinkPoint02 = _newArr;
    // $(".searchNe,.searchGuangFang").empty();
    // nesForLinkPoint02.forEach(function(item) {
    //     $(".searchNe").append("<option  value=" + item.neId + ">" + item.neUserLabel + "</option>");
    // });
    // nesForLinkPoint02[0].neChildren.forEach(function(item02) {
    //     $(".searchGuangFang").append("<option  value=" + item02 + ">" + item02 + "</option>");
    // });
    // $("#addSetingArea,#searchAllInfo").css("visibility", "visible");

}
// 加载动态图
function showLoadIng(msg) {
//	debugger;
    $('#img_wait').css({
        'display': 'table'
    });
    setTimeout(function() {
        $('#img_wait').hide();
        if(msg) {
//			ii02 = layer.msg('重置成功');
            alert("重置成功");
        } else {
//			ii02 = layer.msg('配置成功');
            alert("配置成功");
        }
        $("#showMask,#showMask02,.setInfo").css("visibility", "hidden");
    }, 4000);
//	var ii02 = "";
//	setTimeout(function() {
//		if(msg) {
//			ii02 = layer.msg('重置成功');
//		} else {
//			ii02 = layer.msg('配置成功');
//		}
//	}, 3000);
//	setTimeout(function() {
//		layer.close(ii02);
//		$("#showMask,#showMask02,.setInfo").css("visibility", "hidden");
//	}, 4010);

    //      $('#img_wait').css({'display': 'table'});
    //      setTimeout(function () {
    //        if(msg) {
    //				ii02 = layer.msg('重置成功');
    //			} else {
    //				ii02 = layer.msg('配置成功');
    //			}
    //          $('#img_wait').hide();
    //      }, 400);

}

// 自动配置事件
$("#autoConfig").on("click", function() {
    var _chooseGuangXian = []; //选中的光纤
    $("#myTable input:checkbox[id!='chooseAll']").each(function(k, item) {
        if($(item).prop("checked")) {
            _chooseGuangXian.push($(item).attr("checkGuanQxian"));
        }
    });
    var _autoLength = 0;
    nesForLinks.forEach(function(obj) {
        if(_chooseGuangXian.indexOf(obj.Apoint.neUserLabel) != -1) {
            if(obj.Apoint.setMode) {
                if(obj.Apoint.setMode == "自动") {
                    _autoLength++;
                }
            }
        }
        if(_chooseGuangXian.indexOf(obj.Zpoint.neUserLabel) != -1) {
            if(obj.Zpoint.setMode) {
                if(obj.Zpoint.setMode == "自动") {
                    _autoLength++;
                }
            }
        }
    });

    var canAuto = _chooseGuangXian.length - _autoLength;
    if(canAuto > 0) {
        // 查看选中的光放
        var chooseGuangFang = [];
        $("#myTable input:checkbox[id!='chooseAll']").each(function(j, item) {
            if($(item).prop("checked")) {
                chooseGuangFang.push($(item).attr("checkGuanQxian"));
            }
        });
        // 自动设置值
        chooseGuangFang.forEach(function(item) {
            nesForLinks.forEach(function(obj) {
                if(item == obj.Apoint.neUserLabel) {
                    obj.Apoint.setMode = "自动"; //connState
                    obj.Apoint.connStatus = "正常";
                    // obj.connState = "normal";
                    obj.Apoint.SAPIwatch = {
                        "SAPIsend": obj.Apoint.neUserLabel,
                        "SAPIexpect": obj.Zpoint.neUserLabel,
                        "SAPIaccept": obj.Zpoint.neUserLabel
                    }
                    obj.Apoint.DAPIwatch = {
                            "DAPIsend": obj.Apoint.neUserLabel,
                            "DAPIexpect": obj.Zpoint.neUserLabel,
                            "DAPIaccept": obj.Zpoint.neUserLabel
                    }
                        if(obj.Zpoint.SAPIwatch){
                            obj.Zpoint.SAPIwatch.SAPIaccept = obj.Apoint.neUserLabel;
                        }else{
                            obj.Zpoint.SAPIwatch={};
                            obj.Zpoint.SAPIwatch.SAPIaccept = obj.Apoint.neUserLabel;
                        }

                    if(obj.Zpoint.DAPIwatch){
                        obj.Zpoint.DAPIwatch.DAPIaccept = obj.Apoint.neUserLabel;
                    }else{
                        obj.Zpoint.DAPIwatch={};
                        obj.Zpoint.DAPIwatch.DAPIaccept = obj.Apoint.neUserLabel;
                    }
                }
                if(item == obj.Zpoint.neUserLabel) {
                    obj.Zpoint.setMode = "自动";
                    obj.Zpoint.connStatus = "正常";
                    // obj.connState = "normal";
                    obj.Zpoint.SAPIwatch = {
                        "SAPIsend": obj.Zpoint.neUserLabel,
                        "SAPIexpect": obj.Apoint.neUserLabel,
                        "SAPIaccept": obj.Apoint.neUserLabel
                    }
                    obj.Zpoint.DAPIwatch = {
                            "DAPIsend": obj.Zpoint.neUserLabel,
                            "DAPIexpect": obj.Apoint.neUserLabel,
                            "DAPIaccept": obj.Apoint.neUserLabel
                     }

                    if(obj.Apoint.SAPIwatch){
                        obj.Apoint.SAPIwatch.SAPIaccept = obj.Zpoint.neUserLabel;
                    }else{
                        obj.Apoint.SAPIwatch={};
                        obj.Apoint.SAPIwatch.SAPIaccept = obj.Zpoint.neUserLabel;
                    }

                        // obj.Apoint.SAPIwatch.SAPIaccept = obj.Zpoint.neUserLabel;
                        // obj.Apoint.DAPIwatch.DAPIaccept = obj.Zpoint.neUserLabel;
                    if(obj.Apoint.DAPIwatch){
                        obj.Apoint.DAPIwatch.DAPIaccept = obj.Zpoint.neUserLabel;
                    }else{
                        obj.Apoint.DAPIwatch={};
                        obj.Apoint.DAPIwatch.DAPIaccept = obj.Zpoint.neUserLabel;
                    }
                }
            });
        });
	        // console.log(nesForLinks);
         postData(nesForLinks);

        showLoadIng();
        $("#showMask02").css("visibility", "visible");
        $("#cancelConfig").removeAttr("disabled");
    } else {
        alert('已经都配置完成了');
        setTimeout(function() {
            $("#cancelConfig").removeAttr("disabled");
        }, 2000);
    }
    // postData(nesForLinks);
});

// 取消自动配置
$("#cancelConfig").on("click", function() {
    var _chooseGuangXian = []; //选中的光纤
    $("#myTable input:checkbox[id!='chooseAll']").each(function(k, item) {
        if($(item).prop("checked")) {
            _chooseGuangXian.push($(item).attr("checkGuanQxian"));
        }
    });
    var _autoLength = 0;
    nesForLinks.forEach(function(obj) {
        if(_chooseGuangXian.indexOf(obj.Apoint.neUserLabel) != -1) {
            if(obj.Apoint.setMode) {
                if(obj.Apoint.setMode == "自动") {
                    _autoLength++;
                }
            }
        }
        if(_chooseGuangXian.indexOf(obj.Zpoint.neUserLabel) != -1) {
            if(obj.Zpoint.setMode) {
                if(obj.Zpoint.setMode == "自动") {
                    _autoLength++;
                }
            }
        }
    });

    if(_autoLength > 0) {
        $("#cancelConfig").removeAttr("disabled");

        // 查看选中的光放
        var chooseGuangFang = [];
        $("#myTable input:checkbox[id!='chooseAll']").each(function(j, item) {
            if($(item).prop("checked")) {
                chooseGuangFang.push($(item).attr("checkGuanQxian"));
            }
        });

        // 如果有自动设置的值，就取消
        chooseGuangFang.forEach(function(item) {
            nesForLinks.forEach(function(obj) {
                if(item == obj.Apoint.neUserLabel) {
                    if(obj.Apoint.hasOwnProperty("setMode")) {
                        if(obj.Apoint.setMode == "自动") {
                            delete obj.Apoint.SAPIwatch;
                            delete obj.Apoint.DAPIwatch;
                            delete obj.Apoint.connStatus;
                            delete obj.Apoint.setMode;
                        }
                    }
                }
                if(item == obj.Zpoint.neUserLabel) {
                    if(obj.Zpoint.hasOwnProperty("setMode")) {
                        if(obj.Zpoint.setMode == "自动") {
                            delete obj.Zpoint.SAPIwatch;
                            delete obj.Zpoint.DAPIwatch;
                            delete obj.Zpoint.connStatus;
                            delete obj.Zpoint.setMode;
                        }
                    }
                }
            });
        });
        console.log(nesForLinks);

        // 吧手动设置的发送值填入到另外一端的接受值
        nesForLinks.forEach(function(obj) {
            // if(item == obj.Apoint.neUserLabel) {
                if(obj.Apoint.hasOwnProperty("setMode")) {
                    // if(obj.Apoint.setMode == "手动") {
                        if(obj.Apoint.SAPIwatch) {
                            if(obj.Apoint.SAPIwatch.SAPIsend) {
                                if(!obj.Zpoint.SAPIwatch){
                                    obj.Zpoint.SAPIwatch={};
                                }
                                obj.Zpoint.SAPIwatch.SAPIaccept=obj.Apoint.SAPIwatch.SAPIsend;
                            }
                        }
                        if(obj.Apoint.DAPIwatch) {
                            if(obj.Apoint.DAPIwatch.DAPIsend) {
                                if(!obj.Zpoint.DAPIwatch){
                                    obj.Zpoint.DAPIwatch={};
                                }
                                obj.Zpoint.DAPIwatch.DAPIaccept=obj.Apoint.DAPIwatch.DAPIsend;
                            }
                        }
                    // }
                }
            // }
            // if(item == obj.Zpoint.neUserLabel) {
                if(obj.Zpoint.hasOwnProperty("setMode")) {
                    // if(obj.Zpoint.setMode == "手动") {
                        if(obj.Zpoint.SAPIwatch) {
                            if(obj.Zpoint.SAPIwatch.SAPIsend) {
                                if(!obj.Apoint.SAPIwatch){
                                    obj.Apoint.SAPIwatch={};
                                }
                                obj.Apoint.SAPIwatch.SAPIaccept=obj.Zpoint.SAPIwatch.SAPIsend;
                            }
                        }
                        if(obj.Zpoint.DAPIwatch) {
                            if(obj.Zpoint.DAPIwatch.DAPIsend) {
                                if(!obj.Apoint.DAPIwatch){
                                    obj.Apoint.DAPIwatch={};
                                }
                                obj.Apoint.DAPIwatch.DAPIaccept=obj.Zpoint.DAPIwatch.DAPIsend;
                            }
                        }
                    // }
                }
            // }
        });

        postData(nesForLinks);
        showLoadIng("取消成功");
        $("#showMask02").css("visibility", "visible");
    } else {
        console.log(_chooseGuangXian.length);
        if(_chooseGuangXian.length == 0) {
//			var ii04 = layer.msg('请选择');
            alert("请选择");
//			setTimeout(function() {
//				layer.close(ii04);
				$("#autoConfig").removeAttr("disabled");
//			}, 2000);
        } else {
//			var ii02 = layer.msg('都已经取消配置了');
            alert("都已经取消配置了");
            setTimeout(function() {
//				layer.close(ii02);
                $("#autoConfig").removeAttr("disabled");
            }, 2000);
        }
    }

});

// 获取SAPI DAPI 或者里面属性的个数
function getPropertyCounts(obj) {
    //	return Object.getOwnPropertyNames(foo).length;

    var count = 0;
    for(var i in obj) {
        if(obj.hasOwnProperty(i)) { // 建议加上判断,如果没有扩展对象属性可以不加
            count++;
        }
    }
    return count;

}

var _manualVal = ""; // 手动的光纤
var _isAtuoMode = false; //判断是自动还是手动
var _acceptVal = ""; //应该的期望值
var _isSetting = false; //检查是否配置过
// 手动设置值
function setChange(val) {
    //	debugger;
    _manualVal = val;
    _isSetting = false;
    // $("#showMask,.setInfo").css("visibility", "visible");
    $("#setInfo").css("visibility", "visible");
    // openQuery('#setInfo','手动设置');
    showTItle("setInfo",'手动设置');
    $('#SAPIexpect,#SAPIaccept,#SAPIsend,#DAPIsend,#DAPIexpect,#SAPIaccept,#DAPIaccept,#SAPIaccept').val("").attr("disabled", "disabled");
    $("#SAPIaccept,#DAPIaccept").attr("disabled", "disabled");
    //	debugger;
    $("#SAPICheck,#DAPICheck").prop("checked", false);
    $("#SAPstatus,#DAPIStatus").empty();
    var isSAPICheck = false; // 数据库中是否有SAPI选项
    var isDAPICheck = false; // 数据库中是否有DAPI选项
    //	console.log(nesForLinks);
    nesForLinks.forEach(function(obj) {
        if(obj.Apoint.neUserLabel == _manualVal) {
            //			_acceptVal = obj.Zpoint.neUserLabel;
            if(obj.Apoint.setMode) {
                _isSetting = true;
                if(obj.Apoint.setMode == "自动") {
                    _isAtuoMode = true;
                }
            }
            if(obj.Apoint.SAPIwatch && getPropertyCounts(obj.Apoint.SAPIwatch) > 1) {
                //			if(obj.Apoint.SAPIwatch) {
                $("#SAPIsend").val(obj.Apoint.SAPIwatch.SAPIsend);
                $("#SAPIexpect").val(obj.Apoint.SAPIwatch.SAPIexpect);
                $("#SAPICheck").prop("checked", "checked");
                isSAPICheck = true;
                $("#SAPIsend,#SAPIexpect").prop("disabled", false);
                if(obj.Apoint.SAPIwatch.SAPIaccept) {
                    $("#SAPIaccept").val(obj.Apoint.SAPIwatch.SAPIaccept);
                }
                setSAPstatus();
                //					console.log(obj.Apoint.SAPIwatch.connStatus);
            }
            if(obj.Apoint.DAPIwatch && getPropertyCounts(obj.Apoint.DAPIwatch) > 1) {
                //			if(obj.Apoint.DAPIwatch) {debugger;
                //				console.log(obj.Apoint.DAPIwatch);
                $("#DAPIsend").val(obj.Apoint.DAPIwatch.DAPIsend);
                $("#DAPIexpect").val(obj.Apoint.DAPIwatch.DAPIexpect);
                $("#DAPICheck").prop("checked", "checked");
                isDAPICheck = true;

                $("#DAPIsend,#DAPIexpect").prop("disabled", false);
                if(obj.Apoint.DAPIwatch.DAPIaccept) {
                    //					console.log(obj.Apoint.DAPIwatch.DAPIaccept);
                    $("#DAPIaccept").val(obj.Apoint.DAPIwatch.DAPIaccept);
                }
                setDAPstatus();
            }
        }
        if(obj.Zpoint.neUserLabel == _manualVal) {
            if(obj.Zpoint.setMode) {
                _isSetting = true;
                if(obj.Zpoint.setMode == "自动") {
                    _isAtuoMode = true;
                }
            }
            if(obj.Zpoint.SAPIwatch && getPropertyCounts(obj.Zpoint.SAPIwatch) > 1) {
                //			if(obj.Zpoint.SAPIwatch) {
                //				console.log(obj.Zpoint.SAPIwatch);
                $("#SAPIsend").val(obj.Zpoint.SAPIwatch.SAPIsend);
                $("#SAPIexpect").val(obj.Zpoint.SAPIwatch.SAPIexpect);
                $("#SAPICheck").prop("checked", "checked");
                isSAPICheck = true;
                $("#SAPIsend,#SAPIexpect").attr("disabled", false);
                if(obj.Zpoint.SAPIwatch.SAPIaccept) {
                    $("#SAPIaccept").val(obj.Zpoint.SAPIwatch.SAPIaccept);
                }
                setSAPstatus();
                //					console.log(obj.Zpoint.SAPIwatch.connStatus);
            }
            if(obj.Zpoint.DAPIwatch && getPropertyCounts(obj.Zpoint.DAPIwatch) > 1) {
                $("#DAPIsend").val(obj.Zpoint.DAPIwatch.DAPIsend);
                $("#DAPIexpect").val(obj.Zpoint.DAPIwatch.DAPIexpect);

                $("#DAPICheck").prop("checked", "checked");
                $("#DAPIsend,#DAPIexpect").attr("disabled", false);
                isDAPICheck = true;
                if(obj.Zpoint.DAPIwatch.DAPIaccept) {
                    $("#DAPIaccept").val(obj.Zpoint.DAPIwatch.DAPIaccept);
                }
                setDAPstatus();
            }
        }
    });

    if(!_isSetting) {
        $("#DAPICheck,#SAPICheck").prop("checked", false);
        $('#SAPIexpect,#SAPIexpect,#SAPIsend,#DAPIsend,#DAPIexpect').val("").attr("disabled", "disabled");
        $("#SAPIaccept,#DAPIaccept").val("");
    }

}
// 设置 SAPI 状态
function setSAPstatus() {
    if($("#SAPIexpect").val() == $("#SAPIaccept").val()) {
        $("#SAPstatus").text("正常").css("color", "#000000");
    } else {
        $("#SAPstatus").text("异常").css("color", "#FF0000");
    }
}

// 设置 DAPI 状态
function setDAPstatus() {
    if($("#DAPIexpect").val() == $("#DAPIaccept").val()) {
        $("#DAPIStatus").text("正常").css("color", "#000000");
    } else {
        $("#DAPIStatus").text("异常").css("color", "#FF0000");
    }
}

// 期望值的改变事件,判断API状态是否正
$('#SAPIexpect,#DAPIexpect').bind('input propertychange', function() {
    var _acceptId = $(this).attr("id") == "SAPIexpect" ? "#SAPIaccept" : "#DAPIaccept";
    var acceptValLen = $(_acceptId).val().length;
    if(_isSetting || acceptValLen > 0) {

        if(_isSetting && (acceptValLen == 0)) {

        } else {

            var _val = $(this).val();
            var SAPISet = false;
            var DAPISet = false;
            nesForLinks.forEach(function(obj) {
                if(obj.Apoint.neUserLabel == _manualVal) {

                    if(obj.Apoint.SAPIwatch) {
                        SAPISet = true;
                    }
                    if(obj.Apoint.DAPIwatch) {
                        DAPISet = true;
                    }
                }
                if(obj.Zpoint.neUserLabel == _manualVal) {

                    if(obj.Zpoint.SAPIwatch) {
                        SAPISet = true;
                    }
                    if(obj.Zpoint.DAPIwatch) {
                        DAPISet = true;
                    }
                }
            });
            var isChange = false;
            if(_acceptId == "#SAPIaccept") {
                if(SAPISet) {
                    isChange = true;
                }
            } else {
                if(DAPISet) {
                    isChange = true;
                }
            }
            // 如果之前设置了 accept的值才比较
            if(isChange) {
                var _acceptStatus = $(this).attr("id") == "SAPIexpect" ? "#SAPstatus" : "#DAPIStatus";
                var __acceptVal = $(_acceptId).val();
                _val == __acceptVal ? $(_acceptStatus).text("正常").css("color", "#000") : $(_acceptStatus).text("异常").css("color", "red");

            }

        }
    }
});

// 关闭添加阴影层
$("#showMask,.closeWindow,#closeLinkDetail").bind("click", function() {
    $("#showMask").css("visibility", "hidden");
    $(".setInfo,.showOpticalInfo,.showOpticalInfo,.showTopologyInfo").css("visibility", "hidden");
});

// 监视使能启用状态
function checkmonitoring(moId) {
    var childId = "";
    var _acceptID = ""; //接受值
    var lockMoid = ""; //锁定哪一个
    var satusId = ""; //状态id
    if(moId == "#SAPICheck") {
        childId = "#SAPIsend,#SAPIexpect";
        _acceptID = "#SAPIaccept";
        satusId = "#SAPstatus";
    } else {
        childId = "#DAPIsend,#DAPIexpect";
        _acceptID = "#DAPIaccept";
        satusId = "#DAPIStatus";
    }
    var isCheck = $(moId).prop("checked");
    if(isCheck) {
        $(childId).removeAttr("disabled");
        var childIds = childId.split(",");
        // 如果选中了，就设置值
        //		$("#DAPIStatus,#SAPstatus").text(""); //状态值清空
        var _isHaveAPI = false; // 查看是否有 API值
        nesForLinks.forEach(function(obj) {
            if(obj.Apoint.neUserLabel == _manualVal) {
                if(_acceptID != "#DAPIaccept") {
                    if(obj.Apoint.SAPIwatch) {
                        _isHaveAPI = true;
                        $(childIds[0]).val(obj.Apoint.SAPIwatch.SAPIsend);
                        $(childIds[1]).val(obj.Apoint.SAPIwatch.SAPIexpect);
                        $(_acceptID).val(obj.Apoint.SAPIwatch.SAPIaccept);
						setSAPstatus();
                    }
                } else {
                    if(obj.Apoint.DAPIwatch) {
                        _isHaveAPI = true;
                        $(childIds[0]).val(obj.Apoint.DAPIwatch.DAPIsend);
                        $(childIds[1]).val(obj.Apoint.DAPIwatch.DAPIexpect);
                        $(_acceptID).val(obj.Apoint.DAPIwatch.DAPIaccept);
                        setDAPstatus();
                    }
                }

            }
            if(obj.Zpoint.neUserLabel == _manualVal) {

                if(_acceptID != "#DAPIaccept") {
                    if(obj.Zpoint.SAPIwatch) {
                        _isHaveAPI = true;
                        $(childIds[0]).val(obj.Zpoint.SAPIwatch.SAPIsend);
                        $(childIds[1]).val(obj.Zpoint.SAPIwatch.SAPIexpect);
                        $(_acceptID).val(obj.Zpoint.SAPIwatch.SAPIaccept);
						setSAPstatus();
                    }
                } else {
                    if(obj.Zpoint.DAPIwatch) {
                        _isHaveAPI = true;
                        $(childIds[0]).val(obj.Zpoint.DAPIwatch.DAPIsend);
                        $(childIds[1]).val(obj.Zpoint.DAPIwatch.DAPIexpect);
                        $(_acceptID).val(obj.Zpoint.DAPIwatch.DAPIaccept);
						setDAPstatus();
                    }
                }

            }
        });
        // 如果没有就只设置期望值
        if(!_isHaveAPI) {
        }

    } else {
        $(childId).prop("disabled", "disabled").val("");
        $(_acceptID).val("");
        $(satusId).text(" ");
    }
}
$.ajaxSetup({
    async: false
});
var postData=function(data){
	 createCurrDia = dialog.getCurrent();
    var tempData = {
        'content':JSON.stringify(data),
        'filename':url_path + 'data/10_2/conn.json'}
    $.post(cgi_path, tempData,function(resp) {
        $('#wait_save_eth').hide();
        if(resp == 'success') {
            // showTItle("DLGsuccess","提示");

            // setTimeout(function(){
                var tempdialog = dialog.getCurrent();
                // console.log(tempdialog);

                if(tempdialog != undefined){
                    tempdialog.close();
                }
            // },2000)
        } else {
            // alert('保存失败');
        }
//                window.location.reload();
    }).error(function(){
        $('#wait_save_eth').hide();
        // alert("连接服务器失败!");
    });
}

// 手动设置确认事件
function manualSetting() {
    var SAPIwatch = {};
    var DAPIwatch = {};
    if($("#SAPICheck").prop("checked")) {
        SAPIwatch = {
            "SAPIsend": $("#SAPIsend").val(),
            "SAPIexpect": $("#SAPIexpect").val(),
            "SAPIaccept": $("#SAPIaccept").val().length == 0 ? _acceptVal : $("#SAPIaccept").val()
        }
    }
    if($("#DAPICheck").prop("checked")) {
        DAPIwatch = {
            "DAPIsend": $("#DAPIsend").val(),
            "DAPIexpect": $("#DAPIexpect").val(),
            "DAPIaccept": $("#DAPIaccept").val().length == 0 ? _acceptVal : $("#DAPIaccept").val()
        }
    }

    var data = {};
    var _SAPIwatchIsHave = Object.keys(SAPIwatch).length > 0 ? true : false; // 是否有 SAPIwatch 值
    var _DAPIwatchIsHave = Object.keys(DAPIwatch).length > 0 ? true : false; // 是否有 DAPIwatch 值
    var _connState = ""; //设置后的状态
    var isHavestatus = ($("#SAPstatus").text().length > 0) || ($("#DAPIStatus").text().length > 0);
    showLoadIng();

    if(_isSetting || isHavestatus) {
        //		debugger;
        var _isSAPICheck = false;
        var _isDAPICheck = false;
        nesForLinks.forEach(function(obj) {
            if(obj.Apoint.neUserLabel == _manualVal) {
                if(obj.Apoint.SAPIwatch) {
                    _isSAPICheck = true;
                }
                if(obj.Apoint.DAPIwatch) {
                    _isDAPICheck = true;
                }
            }
            if(obj.Zpoint.neUserLabel == _manualVal) {
                if(obj.Zpoint.SAPIwatch) {
                    _isSAPICheck = true;
                }
                if(obj.Zpoint.DAPIwatch) {
                    _isDAPICheck = true;
                }
            }
        });

        if($("#SAPICheck").prop("checked")) {
            if(!_isSAPICheck) {
                window.setTimeout(function() {
                    setSAPstatus();
                }, 2000);
            }
        }

        if($("#DAPICheck").prop("checked")) {
            if(!_isDAPICheck) {
                window.setTimeout(function() {
                    setDAPstatus();
                }, 2000);
            }
        }

        if($("#DAPICheck").prop("checked") || $("#SAPICheck").prop("checked")) {
            if(($("#SAPstatus").text() == "异常") || ($("#DAPIStatus").text() == "异常")) {
                _connState = "异常";
            } else {
                _connState = "正常";
            }

            // 放到数据库中
            nesForLinks.forEach(function(obj) {
                if(obj.Apoint.neUserLabel == _manualVal) {
                    obj.Apoint.connStatus = _connState;
                    obj.Apoint.setMode = "手动";
                    if(!$("#DAPICheck").prop("checked")) {
                        delete obj.Apoint.DAPIwatch;
                        if(obj.Zpoint) {
                            if(obj.Zpoint.DAPIwatch) {
                                delete obj.Zpoint.DAPIwatch.DAPIaccept;
                                if(obj.Zpoint.DAPIwatch.DAPIexpect){
                                    obj.Zpoint.connStatus="异常";
                                }else{
                                    // console.log(obj.Zpoint.DAPIwatch.DAPIsend);
                                    if(obj.Zpoint.DAPIwatch.DAPIsend && obj.Zpoint.DAPIwatch.DAPIsend.length>0){
                                    }else{
                                        delete  obj.Zpoint.DAPIwatch;
                                    }
                                }

                            }
                        }
                    } else {
                        obj.Apoint.DAPIwatch = DAPIwatch;
                        if(!obj.Zpoint.DAPIwatch) {
                            obj.Zpoint.DAPIwatch = {};
                        }
                        obj.Zpoint.DAPIwatch.DAPIaccept = obj.Apoint.DAPIwatch.DAPIsend;
                    }
                    if(!$("#SAPICheck").prop("checked")) {
                        delete obj.Apoint.SAPIwatch;
                        if(obj.Zpoint) {
                            if(obj.Zpoint.SAPIwatch) {
                                delete obj.Zpoint.SAPIwatch.SAPIaccept;
                                // obj.Zpoint.connStatus="异常";
                                if(obj.Zpoint.SAPIwatch.SAPIexpect){
                                    obj.Zpoint.connStatus="异常";
                                }else{
                                    if(obj.Zpoint.SAPIwatch.SAPIsend && obj.Zpoint.SAPIwatch.SAPIsend.length>0){

                                    }else{
                                        delete obj.Zpoint.SAPIwatch;
                                    }
                                }
                            }
                        }
                        //				 obj.Apoint.removeAttr("SAPIwatch");
                    } else {
                        obj.Apoint.SAPIwatch = SAPIwatch;
                        if(!obj.Zpoint.SAPIwatch) {
                            obj.Zpoint.SAPIwatch = {};
                        }
                        obj.Zpoint.SAPIwatch.SAPIaccept = obj.Apoint.SAPIwatch.SAPIsend;
                    }
                    //			}

                }
                if(obj.Zpoint.neUserLabel == _manualVal) {
                    obj.Zpoint.connStatus = _connState;
                    obj.Zpoint.setMode = "手动";
                    if($("#DAPICheck").prop("checked") == false) {
                        delete obj.Zpoint.DAPIwatch;
                        if(obj.Apoint) {
                            if(obj.Apoint.DAPIwatch) {
                                delete obj.Apoint.DAPIwatch.DAPIaccept;
                                // obj.Apoint.connStatus="异常";
                                if(obj.Apoint.DAPIwatch.DAPIexpect){
                                    obj.Apoint.connStatus="异常";
                                }else{
                                    if(obj.Apoint.DAPIwatch.DAPIsend && obj.Apoint.DAPIwatch.DAPIsend.length>0){

                                    }else{
                                        delete obj.Apoint.DAPIwatch;
                                    }
                                }
                            }
                        }
                    } else {
                        obj.Zpoint.DAPIwatch = DAPIwatch;
                        if(!obj.Apoint.DAPIwatch) {
                            obj.Apoint.DAPIwatch = {};
                        }
                        obj.Apoint.DAPIwatch.DAPIaccept = obj.Zpoint.DAPIwatch.DAPIsend;
                    }
                    if($("#SAPICheck").prop("checked") == false) {
                        delete obj.Zpoint.SAPIwatch;
                        if(obj.Apoint) {
                            if(obj.Apoint.SAPIwatch) {
                                delete obj.Apoint.SAPIwatch.SAPIaccept;
                                // obj.Apoint.connStatus="异常";
                                if(obj.Apoint.SAPIwatch.SAPIexpect){
                                    obj.Apoint.connStatus="异常";
                                }else{
                                    if(obj.Apoint.SAPIwatch.SAPIsend && obj.Apoint.SAPIwatch.SAPIsend.length>0){

                                    }else {
                                        delete obj.Apoint.SAPIwatch;
                                    }
                                }
                            }
                        }
                    } else {
                        obj.Zpoint.SAPIwatch = SAPIwatch;
                        if(!obj.Apoint.SAPIwatch) {
                            obj.Apoint.SAPIwatch = {};
                        }
                        obj.Apoint.SAPIwatch.SAPIaccept = obj.Zpoint.SAPIwatch.SAPIsend;
                    }

                }
            });

        } else {
            //debugger;
            // 放到数据库中
            nesForLinks.forEach(function(obj) {
                if(obj.Apoint.neUserLabel == _manualVal) {
                    delete obj.Apoint.connStatus;
                    delete obj.Apoint.setMode;
                    if(!$("#DAPICheck").prop("checked")) {

                        if(obj.Apoint.DAPIwatch) {
                            delete obj.Apoint.DAPIwatch;
                        }
                        if(obj.Zpoint) {
                            if(obj.Zpoint.DAPIwatch) {
                                delete obj.Zpoint.DAPIwatch.DAPIaccept;
                                if(obj.Zpoint.DAPIwatch.DAPIexpect){
                                    obj.Zpoint.connStatus="异常";
                                }else{
                                    if(!obj.Zpoint.DAPIwatch.DAPIsend && obj.Zpoint.DAPIwatch.DAPIsend.length>0){

                                    }else {
                                        delete obj.Zpoint.DAPIwatch;
                                    }
                                }
                            }
                        }
                    }
                    if(!$("#SAPICheck").prop("checked")) {

                        if(obj.Apoint.SAPIwatch) {
                            delete obj.Apoint.SAPIwatch;

                        }
                        if(obj.Zpoint) {
                            if(obj.Zpoint.SAPIwatch) {
                                delete obj.Zpoint.SAPIwatch.SAPIaccept;
                                // obj.Zpoint.connStatus="异常";
                                if(obj.Zpoint.DAPIwatch.DAPIexpect){
                                    obj.Zpoint.connStatus="异常";
                                }else{
                                    if(obj.Zpoint.DAPIwatch.DAPIsend && obj.Zpoint.DAPIwatch.DAPIsend.length>0){

                                    }else {
                                        delete obj.Zpoint.DAPIwatch;
                                    }
                                }
                            }
                        }
                    }

                }
                if(obj.Zpoint.neUserLabel == _manualVal) {
                    delete obj.Zpoint.connStatus;
                    delete obj.Zpoint.setMode;
                    if($("#DAPICheck").prop("checked") == false) {

                        if(obj.Zpoint.DAPIwatch) {
                            delete obj.Zpoint.DAPIwatch;
                        }
                        if(obj.Apoint) {
                            if(obj.Apoint.DAPIwatch) {
                                // console.log(obj.Apoint.DAPIwatch);
                                delete obj.Apoint.DAPIwatch.DAPIaccept;
                                // obj.Apoint.connStatus="异常";
                                if(obj.Apoint.DAPIwatch.DAPIexpect){
                                    obj.Apoint.connStatus="异常";
                                }else{
                                    if(obj.Apoint.DAPIwatch.DAPIsend && obj.Apoint.DAPIwatch.DAPIsend.length>0){

                                    }else {
                                        delete obj.Apoint.DAPIwatch;
                                    }
                                }
                            }
                        }
                    }
                    if($("#SAPICheck").prop("checked") == false) {

                        if(obj.Zpoint.SAPIwatch) {
                            delete obj.Zpoint.SAPIwatch;
                        }
                        if(obj.Apoint) {
                            if(obj.Apoint.SAPIwatch) {
                                delete obj.Apoint.SAPIwatch.SAPIaccept;
                                // obj.Apoint.connStatus="异常";
                                if(obj.Apoint.SAPIwatch.SAPIexpect){
                                    obj.Apoint.connStatus="异常";
                                }else{
                                    if(obj.Apoint.SAPIwatch.SAPIsend && obj.Apoint.SAPIwatch.SAPIsend.length>0){

                                    }else {
                                        delete obj.Apoint.SAPIwatch;
                                    }
                                }
                            }
                        }
                    }
                }
            });

        }

    }

    if(!_isSetting && !isHavestatus) {
        var SAPIwatch02 = {};
        var DAPIwatch02 = {};
        var SAPIval = ""; //SAPI对端的接受值
        var DAPIval = ""; //DAPI对端的接受值
        if($("#SAPICheck").prop("checked")) {
            SAPIval = $("#SAPIsend").val();
            SAPIwatch02 = {
                "SAPIsend": $("#SAPIsend").val(),
                "SAPIexpect": $("#SAPIexpect").val(),
                "SAPstatus": "异常"
            }

        }
        if($("#DAPICheck").prop("checked")) {
            DAPIval = $("#DAPIsend").val();
            DAPIwatch02 = {
                "DAPIsend": $("#DAPIsend").val(),
                "DAPIexpect": $("#DAPIexpect").val(),
                "DAPIStatus": "异常"
            }

        }

        if($("#SAPstatus").text().length > 0 || ($("#DAPIStatus").text().length > 0)) {

            var _connState02 = "";
            if(($("#SAPstatus").text() == "异常") || ($("#DAPIStatus").text() == "异常")) {
                _connState02 = "异常";
            } else {
                _connState02 = "正常";
            }

            // 放到数据库中
            nesForLinks.forEach(function(obj) {
                if(obj.Apoint.neUserLabel == _manualVal) {
                    obj.Apoint.connStatus = _connState;
                    obj.Apoint.setMode = "手动";

                    if($("#DAPICheck").prop("checked") == false) {
                        if(obj.Apoint.DAPIwatch) {
                            delete obj.Apoint.DAPIwatch;
                        }
                    } else {
                        obj.Apoint.DAPIwatch = DAPIwatch02;

                    }
                    if($("#SAPICheck").prop("checked") == false) {
                        if(obj.Apoint.SAPIwatch) {
                            delete obj.Apoint.SAPIwatch;
                        }
                    } else {
                        obj.Apoint.SAPIwatch = SAPIwatch02;
                    }
                    //			}

                }
                if(obj.Zpoint.neUserLabel == _manualVal) {
                    obj.Zpoint.connStatus = _connState;
                    obj.Zpoint.setMode = "手动";

                    //	debugger;
                    if($("#DAPICheck").prop("checked") == false) {

                        if(obj.Zpoint.DAPIwatch) {
                            delete obj.Zpoint.DAPIwatch;
                        }
                    } else {
                        obj.Zpoint.DAPIwatch = DAPIwatch02;
                    }
                    if($("#SAPICheck").prop("checked") == false) {
                        //						delete obj.Zpoint.SAPIwatch;
                        if(obj.Zpoint.SAPIwatch) {
                            delete obj.Zpoint.SAPIwatch;
                        }
                    } else {
                        obj.Zpoint.SAPIwatch = SAPIwatch02;
                    }

                }
            });
        } else {
            if(!isHavestatus) {

                if(($("#SAPICheck").prop("checked")) || ($("#DAPICheck").prop("checked"))) {
                    // 放到数据库中
                    nesForLinks.forEach(function(obj) {
                        if(obj.Apoint.neUserLabel == _manualVal) {
                            if($("#DAPICheck").prop("checked") == false) {
                                if(obj.Apoint.DAPIwatch) {
                                    delete obj.Apoint.DAPIwatch;
                                }
                            } else {
                                obj.Apoint.DAPIwatch = DAPIwatch02;
                                obj.Apoint.setMode = "手动";
                                if(DAPIval.length > 0) {
                                    if(!obj.Zpoint.DAPIwatch) {
                                        obj.Zpoint.DAPIwatch = {};
                                        obj.Zpoint.DAPIwatch.DAPIaccept = DAPIval;
                                    }
                                }

                            }
                            if($("#SAPICheck").prop("checked") == false) {
                                if(obj.Apoint.SAPIwatch) {
                                    delete obj.Apoint.SAPIwatch;
                                }
                            } else {
                                obj.Apoint.SAPIwatch = SAPIwatch02;
                                obj.Apoint.setMode = "手动";
                                if(SAPIval.length > 0) {

                                    if(!obj.Zpoint.SAPIwatch) {
                                        obj.Zpoint.SAPIwatch = {};
                                        obj.Zpoint.SAPIwatch.SAPIaccept = SAPIval;
                                    }
                                }
                            }
                            //			}

                        }
                        if(obj.Zpoint.neUserLabel == _manualVal) {
                            //	debugger;
                            if($("#DAPICheck").prop("checked") == false) {

                                if(obj.Zpoint.DAPIwatch) {
                                    delete obj.Zpoint.DAPIwatch;
                                }
                            } else {
                                obj.Zpoint.DAPIwatch = DAPIwatch02;
                                obj.Zpoint.setMode = "手动";
                                if(DAPIval.length > 0) {
                                    if(!obj.Apoint.DAPIwatch) {
                                        obj.Apoint.DAPIwatch = {};
                                        obj.Apoint.DAPIwatch.DAPIaccept = DAPIval;
                                    }
                                }
                            }
                            if($("#SAPICheck").prop("checked") == false) {
                                //						delete obj.Zpoint.SAPIwatch;
                                if(obj.Zpoint.SAPIwatch) {
                                    delete obj.Zpoint.SAPIwatch;
                                }
                            } else {
                                obj.Zpoint.SAPIwatch = SAPIwatch02;
                                obj.Zpoint.setMode = "手动";
                                if(SAPIval.length > 0) {

                                    if(!obj.Apoint.SAPIwatch) {
                                        obj.Apoint.SAPIwatch = {};
                                        obj.Apoint.SAPIwatch.SAPIaccept = SAPIval;
                                    }
                                }
                            }

                        }

                    });
                }
            }
        }

        $("#showMask02").css("visibility", "visible");
    }
    postData(nesForLinks);

    // setTimeout(function () {
    //     openQuery("setSuccess",'配置提示');
    // },20000);
//	console.log(nesForLinks);
}

// 显示光纤连接阴影层
$("#searchOptical").bind("click", function() {
    var _tr = ""; // 每行的信息
    var nesForLinks02=[]; //排序的数组
    nesForLinks.forEach(function(obj) {
        if(obj.Apoint) {
            if(obj.Apoint.setMode){
                var _reson = "无";
                if(obj.Apoint.connStatus) {
                    if (obj.Apoint.connStatus == "异常") {
                        _reson = "光纤错连";
                    }
                }else {
                    obj.Apoint.connStatus="正常";
                }
                var pointObj={
                    "neName":getNeName(obj.Apoint.neId),
                    "neUserLabel":obj.Apoint.neUserLabel,
                    "zNeName":getNeName(obj.Zpoint.neId),
                    "zneUserLabel":obj.Zpoint.neUserLabel,
                    "connStatus":obj.Apoint.connStatus,
                    "reson":_reson
                }
                nesForLinks02.push(pointObj);
            }
        }
        if(obj.Zpoint) {
            if(obj.Zpoint.setMode) {
                var _reson02 = "无";
                if (obj.Zpoint.connStatus) {
                    if (obj.Zpoint.connStatus == "异常") {
                        _reson02 = "光纤错连";
                    }
                } else {
                    obj.Zpoint.connStatus = "正常";
                }
                var pointObj={
                    "neName":getNeName(obj.Zpoint.neId),
                    "neUserLabel":obj.Zpoint.neUserLabel,
                    "zNeName":getNeName(obj.Apoint.neId),
                    "zneUserLabel":obj.Apoint.neUserLabel,
                    "connStatus":obj.Zpoint.connStatus,
                    "reson":_reson02
                }
                nesForLinks02.push(pointObj);
            }
        }
    });
    nesForLinks02.sort(function (a, b) {
        return a.neName < b.neName ? -1 : 1
    });
    nesForLinks02.sort(function(a,b){
        var value1 = a.neName,
            value2 = b.neName;
        if(value1 === value2){
            return a.neUserLabel < b.neUserLabel? -1 : 1
        }
        return  value1 < value2? -1 : 1;
    });
    nesForLinks02.forEach(function(item, k) {
        _tr += "<tr><td>" +item.neName + "</td><td>" + item.neUserLabel + "</td><td>" + item.zNeName + "</td><td>" + item.zneUserLabel + "</td><td>" + item.connStatus + "</td><td>" + item.reson + "</td></tr>";
    });

    // var nesForLinks03 = [];
    // nesForLinks.forEach(function(item, k) {
    //     nesForLinks03.push(item.Apoint);
    //     nesForLinks03.push(item.Zpoint);
    // });
    // nesForLinks03.sort(function (a, b) {
    //     return a.neUserLabel < b.neUserLabel ? -1 : 1
    // });
    // nesForLinks03.forEach(function(obj) {
    //     var _reson02 = "无";
    //     if(obj.setMode){
    //         if(obj.connStatus) {
    //             if(obj.connStatus == "异常") {
    //                 _reson02 = "光纤错连";
    //             }
    //         }else {
    //             obj.connStatus="正常";
    //         }
    //     _tr += "<tr><td>" + getNeName(obj.neId) + "</td><td>" + obj.neUserLabel + "</td><td>" + getNeName(obj.neId) + "</td><td>" + obj.neUserLabel + "</td><td>" + obj.connStatus + "</td><td>" + _reson02 + "</td></tr>";
    //     }
    // });

    if(_tr == "") {
        alert("暂时没有配置光纤连接");
    } else {
        $(".opticalLinkTable tbody").empty();
        $(".opticalLinkTable tbody").append(_tr);
        // $("#showMask,.showOpticalInfo").css("visibility", "visible");
        openQuery('.opticalLinkTable','光纤连接详情')
    }
});

// 确认勾选的内容里面有没有可以自动配置的选项
$("#myTable").delegate("input:checkbox", "click", function() {
    var _chooseGuangXian = []; //选中的光纤
    $("#myTable input:checkbox[id!='chooseAll']").each(function(k, item) {
        if($(item).prop("checked")) {
            _chooseGuangXian.push($(item).attr("checkGuanQxian"));
        }
    });
    var _autoLength = 0;
    nesForLinks.forEach(function(obj) {
        if(_chooseGuangXian.indexOf(obj.Apoint.neUserLabel) != -1) {
            if(obj.Apoint.setMode) {
                if(obj.Apoint.setMode == "自动") {
                    _autoLength++;
                }
            }
        }
        if(_chooseGuangXian.indexOf(obj.Zpoint.neUserLabel) != -1) {
            if(obj.Zpoint.setMode) {
                if(obj.Zpoint.setMode == "自动") {
                    _autoLength++;
                }
            }
        }
    });
    if(_autoLength > 0) {
        $("#cancelConfig").removeAttr("disabled");
    } else {
      //  $("#cancelConfig").attr("disabled", "disabled");
    }
    var canAuto = _chooseGuangXian.length - _autoLength;
    if(canAuto > 0) {
        $("#autoConfig").removeAttr("disabled");
    } else {
      // $("#autoConfig").attr("disabled", "disabled");
    }
});

// 删除全部
function deleteAllOpt() {
    nesForLinkPoint02 = nesForLinkPoint;
    $(".searchNe,.searchGuangFang").empty();
    nesForLinkPoint02.forEach(function(item) {
        $(".searchNe").append("<option  value=" + item.neId + ">" + item.neUserLabel + "</option>");
    });
    nesForLinkPoint02[0].neChildren.forEach(function(item02) {
        $(".searchGuangFang").append("<option  value=" + item02 + ">" + item02 + "</option>");
    });
    $("#addSetingArea,#searchAllInfo").css("visibility", "visible");
    $("#myTable tr:gt(0)").remove();
    $("#chooseAll").removeAttr("checked");
}


// 查看拓扑图
var topoNe = [];
$.getJSON(url_path + 'data/10_2/delayMatrixNe.json', {}, function(data) {
    topoNe = data;
});


//var topoNe;
var topoConn;
var Pro = {};
$("#showTopology").on("click", function() {
    $("#canvas").css("visibility","visible");
    showTopology();
    $(this).css("display","none");
});

//显示拓扑图
function showTopology(){

    nesForLinks.forEach(function(obj) {
            if(obj.Apoint.connStatus ||  obj.Zpoint.connStatus ){
                obj.showLine=true;
                if(obj.Apoint.connStatus == "异常" ||  obj.Zpoint.connStatus == "异常") {
                    obj.connState = "critical";
                }else {
                    obj.connState = "cleared";
                }
            }else{
                obj.showLine=false;
            }
    });
    console.log(nesForLinks);

    postData(nesForLinks);
    $("#showTuoPut").css("visibility","visible");
    topoConn = [];
    topoConn = nesForLinks;
    // Pro.init(topoNe,topoConn);
    var Canvas = document.getElementById("canvas")
    var ctx = Canvas.getContext("2d")
    var CanvasWidth = Canvas.getBoundingClientRect().width;
    var CanvasHeight = Canvas.getBoundingClientRect().height;
    $.getJSON(url_path + 'data/10_2/conn.json', {}, function(data) {
        topoConn = data;
        console.log(data);
        Pro = {
            init: function(topoNe,topoConn){
                this.clear()
                this.data(topoNe,topoConn)
                this.drawLine()
                this.drawPort()
            },
            Canvas: null,
            ctx: null,
            CanvasWidth: '',
            CanvasHeight: '',
            PortList: [],
            LineList: [],
            port: [],
            line: [],
            clear: function(){
                ctx.clearRect(0,0,CanvasWidth,CanvasHeight)
            },
            data: function(topoNe,topoConn){
                this.port = topoNe // 端口数据
                this.line = topoConn // 线的数据
            },
            drawPort: function(){
                for(var index in this.port){
                    var portItem = this.port[index]
                    var port = new drawPort(portItem.x,portItem.y,portItem.w,portItem.h,portItem.url,portItem.neUserLabel)
                    this.PortList.push(port)
                }
            },
            drawLine: function(){
                for(var index in this.line){
                    var lineItem = this.line[index]
                    var qd;
                    this.port.forEach(function(item){
                        if(item.neId == lineItem.Apoint.neId){
                            qd = item;
                            return
                        }
                    })
                    var zd;
                    this.port.forEach(function(item){
                        if(item.neId == lineItem.Zpoint.neId){
                            zd = item;
                            return
                        }
                    })
                    if(lineItem.showLine){
                        // debugger;
                        // var line = new drawLine(qd, zd, lineItem.mulState, lineItem.connUserLabel,lineItem.connState)
                        var line = new drawLine(qd, zd, lineItem.mulState,"",lineItem.connState)
                        this.LineList.push(line)
                    }

                }
            }
        }
            Pro.init(topoNe,topoConn)
    });
    // 画端口
    function drawPort(x, y, w, h, img, name) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.name = name;
        this.image = new Image();
        this.image.src = img;
        var image = this.image;
        this.image.onload = function () {
            ctx.drawImage(image, x, y, w, h);
        };
        var textX = x + w / 2; // 名字的坐标
        var textY = y + h + 10;
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(name, textX, textY);
    }
    // 画线
    function drawLine(qd, zd, type,text,alarmState){
        this.qd = qd // 起点
        this.zd = zd // 终点
        this.type = type // 曲线还是直线
        this.text = text // 线上面的文字
        var aPointX = qd.x+qd.w/2;
        var aPointY = qd.y + qd.h/2;
        var zPointX = zd.x+zd.w/2;
        var zPointY = zd.y+zd.h/2;
        ctx.beginPath()
        ctx.moveTo(aPointX,aPointY)
        var centerX;
        var centerY;
        if(type){ // 直线还是曲线
            if(qd.y == zd.y){
                centerX = (qd.x + zd.x)/2 // 曲线的拐点
                centerY = (qd.y + zd.y)/6
            }else if(qd.x == zd.x){
                centerX = (qd.x + zd.x)/6
                centerY = (qd.y + zd.y)/2
            }

            ctx.quadraticCurveTo(centerX,centerY,zd.x+zd.w/2, zd.y+zd.h/2)
        } else {
            ctx.lineTo(zPointX, zPointY)
        }
        var textX;
        var textY;
        if(aPointX == zPointX){
            if(aPointY>zPointY){
                if(type){
                    textY = (aPointY-zPointY)/2 + zPointY + 20;
                    textX = aPointX ;
                }else{
                    textY = (aPointY-zPointY)/2 + zPointY;
                    textX = aPointX;
                }
            }else{
                if(type){
                    textY = (zPointY-aPointY)/2 + aPointY + 20;
                    textX = aPointX;
                }else{
                    textY = (zPointY-aPointY)/2 + aPointY;
                    textX = aPointX;
                }

            }
        }else if(aPointY == zPointY){
            if(aPointX>zPointX){
                if(type){
                    textX = (aPointX - zPointX)/2 + zPointX
                    textY = aPointY - centerY*2.5;
                }else{
                    textX = (aPointX - zPointX)/2 + zPointX;
                    textY = aPointY - 15;
                }

            }else{
                if(type){
                    textX = (zPointX - aPointX)/2 + aPointX;
                    textY = aPointY - centerY*2.5;
                }else{
                    textX = (zPointX - aPointX)/2 + aPointX;
                    textY = aPointY - 15;
                }

            }
        }else if(aPointX != zPointX && aPointY != zPointY){
            if(aPointX>zPointX){
                textX = (aPointX - zPointX)/2 + zPointX;
                if(aPointY > zPointY){
                    textY = (aPointY-zPointY)/2 + zPointY-15;
                }else{
                    textY = (zPointY-aPointY)/2 + aPointY -15;
                }
            }else{
                textX = (zPointX - aPointX)/2 + aPointX;
                if(aPointY > zPointY){
                    textY = (aPointY-zPointY)/2 + zPointY - 15;
                }else{
                    textY = (zPointY-aPointY)/2 + aPointY -15;
                }
            }
        }
        if(alarmState == "cleared"){
            ctx.strokeStyle = "green";
        }else if(alarmState == "critical"){
            ctx.strokeStyle = "red";
        }
        ctx.lineWidth=2;
        ctx.stroke();
        ctx.closePath();
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(text, textX, textY);
    }

}
// 关闭拓扑图
function closeVisDist(){
    var thisVal = document.getElementById("closeOne").innerHTML;
    $("#canvas").css("visibility") == "visible"?($("#canvas").css("visibility","hidden")):($("#canvas").css("visibility","visible"));
    thisVal=="关闭拓扑图"?document.getElementById("closeOne").innerHTML="显示拓扑图":document.getElementById("closeOne").innerHTML="关闭拓扑图";
    thisVal=="关闭拓扑图"?$("#reloadPicture").css("visibility","hidden"):$("#reloadPicture").css("visibility","visible");
}
// 刷新拓扑图
function reloadVisDist(){
    showTopology();
}
// 打开窗口
function openQuery(id,titleData) {
    var title = titleData;
    var dialogId = id;
    var w = $(document.body).width() * 0.7;
    var d = dialog({
        title: title,
        width:w,
        content: $(dialogId)
    });
    var temp = dialog.getCurrent();
    if(temp != undefined){
        temp.close();
    }
    d.show();
}

var showTItle = function (id, title) {
    var dialogId = "#" + id + "";
    var w = $(document.body).width() * 0.4;
    var d = dialog({
        title: title,
        width: w,
        content: $(dialogId)
    });
    var temp = dialog.getCurrent();
    // console.log(temp);
    if (temp != undefined) {
        temp.close();
    }
    d.show();
}

function closeWindow() {
	 createCurrDia = dialog.getCurrent();
    createCurrDia.close();
}