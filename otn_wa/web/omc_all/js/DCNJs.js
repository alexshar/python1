var server_path = 'https://135.251.96.98:8443';
var cgi_path = "https://135.251.96.98:8443/cgi-bin/test.cgi";

$(".ipInp").on("input", function(){
    if($(this).val().length == 3){
        $(".ipInp:eq("+parseInt($(this).index()+1)+")").focus()
    }else if($(this).val().length == 0 && $(this).index() > 0){
        $(".ipInp:eq("+parseInt($(this).index()-1)+")").focus()
    }
});
$(".ipInp1").on("input", function(){
    if($(this).val().length == 3){
        $(".ipInp1:eq("+parseInt($(this).index()+1)+")").focus()
    }else if($(this).val().length == 0 && $(this).index() > 0){
        $(".ipInp1:eq("+parseInt($(this).index()-1)+")").focus()
    }
});

$(".ipInp").on("blur", function(){
	if(($this).val()){
		if(!/^[1-9][\d\s]{0,2}$/.test($(this).val())){
			openQuery('#errTip',"提示信息")
			setTimeout(function(){
				var tempdialog = dialog.getCurrent();
				if(tempdialog != undefined){
					tempdialog.close();
				}
			},1000);
		}
	}
   
});

//$('.btn').on('click', function(){
//    var ipStr = ''
//    $(".ipInp").each(function(index){
//        ipStr += $(".ipInp:eq("+index+")").val() + '.'
//    })
//    var ip = ipStr.substring(0,ipStr.length-1)
//    console.log(ip)
//});

function submitData(data,fileName){
    var tempData = {
        'content':JSON.stringify(data),
        'filename':fileName
    }
    setTimeout(function(){
        $.post(cgi_path,tempData,function(resp){
            if(resp == 'success'){
                openQuery('#success','提示信息')
                setTimeout(function(){
                    var tempdialog = dialog.getCurrent();
                    if(tempdialog != undefined){
                        tempdialog.close();
                    }
                },1500);
            }else {
                alert("保存失败")
            }
        })
    },2000);
    GCCdata = "";
    applycationState="";
}

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

$(".no").click(function(){
    var tempdialog = dialog.getCurrent();
    if(tempdialog != undefined){
        tempdialog.close();
    }
})

$('.DCNnav li').on('click',function(){
    $("#GCCcard").hide();
    $("#OSCcard").hide();
    $("#OAMPcard").hide();
    $("#"+$(this).attr('conId')).show();
    $('.DCNnav li').removeClass('choseLi');
    $(this).addClass('choseLi')
})

//GCC
$('#GCCcard').show();
$('#OAMPcard').hide();
$('#OSCcard').hide();
$('#ConfrimDlg').hide();
$('#confrimDelDlg').hide();
$('#operation').hide();
$('#GCCList').hide();
$('#success').hide();
$('#errTip').hide();


function getJSON(type,url,callback){
    $.ajax({
        type: type,
        url: url,
        dataType: "json",
        success: function(data) {
            callback(data)
        },
        error: function(data){
            console.log(data)
        }
    })
};
var initalData;
function initData(data){
    initalData = data;
    showNe(data);
};
getJSON('get',server_path+'/oms1350/web/eqm/omc_all/data/10/GCCne.json',initData);

var initalListData;
function initListData(data){
    initalListData="";
    initalListData = data;
}
getJSON('get',server_path+'/oms1350/web/eqm/omc_all/data/10/GCC.json',initListData);



function showNe(initalData){
    var str='';
    for(var a in initalData){
        var item = initalData[a];
        str += '<option value="'+item.neId+'">'+item.userLabel+'</option>';
    }
    $("#DcnNeUserlabel").append(str);
    initChannel();
}
function initChannel(){
    var neId = $('#DcnNeUserlabel').val();
    $('#AddOtu').empty();
    for(var a in initalData){
        var item = initalData[a];
        if(neId == item.neId){
            var str = '';
            for(var b in item.addChannel){
                var channelData=item.addChannel[b]
                str += '<option value="'+channelData+'">'+channelData+'</option>';
            }
            $('#AddOtu').append(str);
        }
    }
}
function changeDCNne(){
    initChannel()
}
var applycationState;
var GCCdata;
function addGccConfig(){
    function p(s) {
        return s < 10 ? '0' + s: s;
    }

    var myDate = new Date();
    var year=myDate.getFullYear();
    var month=myDate.getMonth()+1;
    var date=myDate.getDate();
    var h=myDate.getHours();
    var m=myDate.getMinutes();
    var s=myDate.getSeconds();
    var id=year+p(month)+p(date)+p(h)+p(m)+p(s);

    var neId = $('#DcnNeUserlabel').val();
    var ECCchan = $('#ECCchannel').val();
    var Otuadd = $('#AddOtu').val();
    var adminS;
	if($('#adminState').val() == "ENABLED"){
		adminS = "使能"
	}else if($('#adminState').val() == "DISABLED"){
		adminS = "禁止"
	}
    var channelName = $('#channelUserlabel').val();
    var neName;
    for(var a in initalData){
        var item = initalData[a];
        if(neId == item.neId){
            neName = item.userLabel
        }
    }
    if(neId && neName && ECCchan && Otuadd && adminS && channelName){
        GCCdata = {
            "neId":neId,
            "id":id,
            "neUserLable":neName,
            "channelName":channelName,
            "ECCchannel":ECCchan,
            "ADDchannel":Otuadd,
            "administrativeStatus":adminS,
			"channelState":"UP"
        };
        openQuery('#ConfrimDlg','是否应用')
        applycationState = "GCC";
    }else{
        alert("所有内容不能为空");
    }
}

function comfirmApplycation(){
    if(applycationState == "GCC"){
        initalListData.push(GCCdata);
        submitData(initalListData,'/oms1350/web/eqm/omc_all/data/10/GCC.json')
    }else if(applycationState == "GCCcardDel"){
        for(var a in initalListData){
            var item = initalListData[a];
            if(delListId == item.id){
                initalListData.splice(a,1)
            }
        }
        submitData(initalListData,'/oms1350/web/eqm/omc_all/data/10/GCC.json')
    }else if(applycationState == "OSC"){
        initOSCdata.push(OSCdata);
        submitData(initOSCdata,'/oms1350/web/eqm/omc_all/data/10/OSC.json')
    }else if(applycationState == "OSCcardDel"){
        for(var a in initOSCdata){
            var item = initOSCdata[a];
            if(delOSCListId == item.id){
                initOSCdata.splice(a,1)
            }
        }
        submitData(initOSCdata,'/oms1350/web/eqm/omc_all/data/10/OSC.json')
    }else if(applycationState == "OAMP"){
		submitData(initOAMPdata,'/oms1350/web/eqm/omc_all/data/10/OAMP.json')
	}else if(applycationState == "OAMPcardDel"){
		for(var a in initOAMPdata){
            var item = initOAMPdata[a];
            if(delOAMPlistId == item.neId){
                initOAMPdata.splice(a,1)
            }
        }
        submitData(initOAMPdata,'/oms1350/web/eqm/omc_all/data/10/OAMP.json')
	}
    openQuery('#operation','提示信息')
}

function showGCCcard(){
    getJSON('get',server_path+'/oms1350/web/eqm/omc_all/data/10/GCC.json',initListData);
    $('.GccListConn').empty();
    var str='';
    for(var a in initalListData){
        var item = initalListData[a];
		var channelS;
		if(item.channelState == "UP"){
			channelS = "正常"
		}else if(item.channelState == "DOWN"){
			channelS = "异常"
		}
        str += '<tr>'
            +'<td class="tableTh">'+item.neUserLable+'</td>'
            +'<td class="tableTh">'+item.channelName+'</td>'
            +'<td class="tableTh">'+item.administrativeStatus+'</td>'
            +'<td class="tableTh">'+item.ADDchannel+'</td>'
            +'<td class="tableTh">'+item.ECCchannel+'</td>'
            +'<td class="tableTh">'+channelS+'</td>'
            +'<td class="tableTh"><button class="DCNBtnStyle" onclick="GCCcardDel('+item.id+')">删除</button></td>'
            +'</tr>'
    }
    $('.GccListConn').append(str)
    openQuery('#GCCList','嵌入式信道管理表');
    $('#channelUserlabel').val("");
}
var delListId;
function GCCcardDel(id){
    console.log(id)
    openQuery('#ConfrimDlg','是否应用')
    delListId = id;
    applycationState = "GCCcardDel"
}

//OSC
$('#OSCList').hide();
$('#errNumTip').hide();

$('#portMTU').on('blur',function(){
	var portMtuVal = $('#portMTU').val();
	if(!(portMtuVal >= 576 && portMtuVal <= 1500) && portMtuVal!=""){
		openQuery('#errNumTip','错误提示');
		setTimeout(function(){
			var tempdialog = dialog.getCurrent();
			if(tempdialog != undefined){
				tempdialog.close();
			}
		},1000);
	}
})

var initOSCNedata;
function initOscNE(data){
    initOSCNedata = "";
    initOSCNedata = data;
	var str='';
    for(var a in data){
        var item = data[a];
        str += '<option value="'+item.neId+'">'+item.userLabel+'</option>';
    }
    $("#oscNeName").append(str);
	OAselect();
}
getJSON('get',server_path+'/oms1350/web/eqm/omc_all/data/10/OSCne.json',initOscNE);

function OAselect(){
	$("#oscNe").empty();
	var neId = $('#oscNeName').val();
	for(var a in initOSCNedata){
		var item = initOSCNedata[a];
		var str1='';
		if(neId == item.neId){
			for(var c in item.OA){
				var item1=item.OA[c]
				str1 += '<option value="'+item1+'">'+item1+'</option>';
			}
			$("#oscNe").append(str1);
		}
	}
}

function changeOAselect(){
	OAselect();
}

var initOSCdata;
function initOscData(data){
    initOSCdata = "";
    initOSCdata = data;
}
getJSON('get',server_path+'/oms1350/web/eqm/omc_all/data/10/OSC.json',initOscData);

var OSCdata;
function addOscConfig(){
    function p(s) {
        return s < 10 ? '0' + s: s;
    }

    var myDate = new Date();
    var year=myDate.getFullYear();
    var month=myDate.getMonth()+1;
    var date=myDate.getDate();
    var h=myDate.getHours();
    var m=myDate.getMinutes();
    var s=myDate.getSeconds();
    var id=year+p(month)+p(date)+p(h)+p(m)+p(s);;

    var neId = $('#oscNeName').val();
    var OA = $('#oscNe').val();
    var portMTU = $('#portMTU').val();
	var adminState;
	if($('#adminOscState').val() == "ENABLED"){
		adminState = "使能"
	}else if($('#adminOscState').val() == "DISABLED"){
		adminState = "禁止"
	}
    var oscMode = $('#oscMode').val();
    var neName;
    for(var a in initOSCNedata){
        var item = initOSCNedata[a];
        if(neId == item.neId){
            neName = item.userLabel
        }
    }
    if(neId&&OA&&portMTU&&adminState&&oscMode&&neName){
        OSCdata = {
            "neId":neId,
            "id":id,
            "neUserLable":neName,
            "OA":OA,
            "provisionedMTU":portMTU,
            "oscMode":oscMode,
            "administrativeStatus":adminState,
			"channelState":"UP"
        }
        openQuery('#ConfrimDlg','是否应用')
        applycationState = "OSC";
    }else{
        alert("所有内容不能为空");
    }

}

function showOSCcard(){
    getJSON('get',server_path+'/oms1350/web/eqm/omc_all/data/10/OSC.json',initOscData);
    $('.OscListConn').empty();
    var str='';
    for(var a in initOSCdata){
        var item = initOSCdata[a];
		var channelS;
		if(item.channelState == "UP"){
			channelS = "正常"
		}else if(item.channelState == "DOWN"){
			channelS = "异常"
		}
        str += '<tr>'
            +'<td class="tableTh">'+item.neUserLable+'</td>'
            +'<td class="tableTh">'+item.OA+'</td>'
            +'<td class="tableTh">'+item.provisionedMTU+'</td>'
            +'<td class="tableTh">'+item.oscMode+'</td>'
            +'<td class="tableTh">'+item.administrativeStatus+'</td>'
            +'<td class="tableTh">'+channelS+'</td>'
            +'<td class="tableTh"><button class="DCNBtnStyle" onclick="OSCcardDel('+item.id+')">删除</button></td>'
            +'</tr>'
    }
    $('.OscListConn').append(str)
    openQuery('#OSCList','OSC监控信道管理表');
    $('#OA').val("");
    $('#portMTU').val("");
}

var delOSCListId;
function OSCcardDel(id){
    console.log(id)
    openQuery('#ConfrimDlg','是否应用')
    delOSCListId = id;
    applycationState = "OSCcardDel"
}

//OAMP
var OAMPneData;
function initOAMPne(data){
    OAMPneData = data;
	var str='';
    for(var a in data){
        var item = data[a];
        str += '<option value="'+item.neId+'">'+item.userLabel+'</option>';
    }
    $("#OAMPneName").append(str);
};
getJSON('get',server_path+'/oms1350/web/eqm/omc_all/data/10/OAMPne.json',initOAMPne);

var initOAMPdata;
function initOAMP(data){
    initOAMPdata = "";;
    initOAMPdata = data;
	showOAMPInitData(data,"0");
}
getJSON('get',server_path+'/oms1350/web/eqm/omc_all/data/10/OAMP.json',initOAMP);

function showOAMPInitData(data,a){
	$('#MACaddress').val("");
	$('#oIp1').val("")
	$('#oIp2').val("")
	$('#oIp3').val("")
	$('#oIp4').val("")
	$('#oIp5').val("")
	$('#oIp6').val("")
	$('#oIp7').val("")
	$('#oIp8').val("")
	var item = data[a];
	if(item.MACAddress){
		$('#MACaddress').val(item.MACAddress)
	}
	if(item.IPv4Address){
		var data1 = item.IPv4Address.split(".");
		$('#oIp1').val(data1[0])
		$('#oIp2').val(data1[1])
		$('#oIp3').val(data1[2])
		$('#oIp4').val(data1[3])
	}
	if(item.IPv4SubnetMask){
		var data2 = item.IPv4SubnetMask.split(".");
		$('#oIp5').val(data2[0])
		$('#oIp6').val(data2[1])
		$('#oIp7').val(data2[2])
		$('#oIp8').val(data2[3])
	}
}

function OAMPchangeNe(){
	var neId = $('#OAMPneName').val();
	for(var a in initOAMPdata){
		var item = initOAMPdata[a];
		if(neId == item.neId){
			showOAMPInitData(initOAMPdata,a);
		}
	}
}
var newOAMPData
function updateOAMPdata(){
	var neId = $('#OAMPneName').val();
	var neName;
	for(var a in OAMPneData){
		var item = OAMPneData[a];
		if(neId == item.neId){
			neName = item.userLabel
		}
	}
	var MACAddress = $('#MACaddress').val();
	var ip1 = $('#oIp1').val();
	var ip2 = $('#oIp2').val();
	var ip3 = $('#oIp3').val();
	var ip4 = $('#oIp4').val();
	var IPv4Address = ip1+"."+ip2+"."+ip3+"."+ip4;
	var ip5 = $('#oIp5').val();
	var ip6 = $('#oIp6').val();
	var ip7 = $('#oIp7').val();
	var ip8 = $('#oIp8').val();
	var IPv4SubnetMask = ip5+"."+ip6+"."+ip7+"."+ip8;
	
	var portEnable;
	if($('#portEnable').val() == "UP"){
		portEnable = "使能"
	}else if($('#portEnable').val() == "DOWN"){
		portEnable = "禁止"
	}
	var proLinkSpeed = $('#proLinkSpeed').val();
	var duplexMode = $('#duplexMode').val();
	newOAMPData = {
		"neId": neId,
        "neUserLable": neName,
        "MACAddress": MACAddress,
        "IPv4Address": IPv4Address,
        "IPv4SubnetMask": IPv4SubnetMask,
        "portEnabled": portEnable,
        "provisionedLinkSpeed": proLinkSpeed,
        "duplexMode": duplexMode,
		"channelState":"UP"
	}
	for(var a in initOAMPdata){
		if(neId == initOAMPdata[a].neId){
			initOAMPdata[a] = newOAMPData;
		}
	}
	openQuery('#ConfrimDlg','是否应用')
	applycationState = "OAMP";
}
$('#OAMPList').hide();
function showOAMPcard(){
	getJSON('get',server_path+'/oms1350/web/eqm/omc_all/data/10/OAMP.json',initOAMP);
    $('.OAMPListConn').empty();
    var str='';
    for(var a in initOAMPdata){
        var item = initOAMPdata[a];
		var channelS;
		if(item.channelState == "UP"){
			channelS = "正常"
		}else if(item.channelState == "DOWN"){
			channelS = "异常"
		}
        str += '<tr>'
            +'<td class="tableTh">'+item.neUserLable+'</td>'
            +'<td class="tableTh">'+item.MACAddress+'</td>'
            +'<td class="tableTh">'+item.IPv4Address+'</td>'
            +'<td class="tableTh">'+item.IPv4SubnetMask+'</td>'
            +'<td class="tableTh">'+item.portEnabled+'</td>'
            +'<td class="tableTh">'+item.provisionedLinkSpeed+'</td>'
            +'<td class="tableTh">'+item.duplexMode+'</td>'
            +'<td class="tableTh">'+channelS+'</td>'
            +'<td class="tableTh"><button class="DCNBtnStyle" onclick="OAMPcardDel('+item.neId+')">删除</button></td>'
            +'</tr>'
    }
    $('.OAMPListConn').append(str)
    openQuery('#OAMPList','带外通信网络管理表');
    $('#oIp1').val("");
    $('#oIp2').val("");
    $('#oIp3').val("");
    $('#oIp4').val("");
    $('#oIp5').val("");
    $('#oIp6').val("");
    $('#oIp7').val("");
    $('#oIp8').val("");
}

var delOAMPlistId;
function OAMPcardDel(id){
	openQuery('#ConfrimDlg','是否应用')
	delOAMPlistId = id;
	applycationState = "OAMPcardDel"
}