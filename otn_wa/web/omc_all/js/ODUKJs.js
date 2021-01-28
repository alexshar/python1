
var server_path = 'https://135.251.96.98:8443';
var cgi_path = "https://135.251.96.98:8443/cgi-bin/test.cgi";

$('#tip').hide();
$('#deltip').hide();
$('#success').hide();
$('#chosePort').hide();
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
	$(".selectNe2").empty()
})

function showNeUserlabel(data){
    var str = ''
    for(var a in data){
        var item = data[a];
		var optionSelected = "selected";
		if(item.neId == "1"){
			str += '<option selected='+optionSelected+' value="'+item.neId+'">'+item.userLabel+'</option>'
		}else{
			str += '<option value="'+item.neId+'">'+item.userLabel+'</option>'
		}
        
    }
    $(".selectNe1").append(str)
    $(".selectNe2").append(str)
	$(".selectNe2").val("1")
}
getJSON('get',server_path+'/oms1350/web/eqm/omc_all/data/7_2_5/NE.json',showNeUserlabel)
function showNe2Userlabel(data){
	$(".selectNe2").empty();
	 var str = ''
    for(var a in data){
        var item = data[a];
		var optionSelected = "selected";
		if(item.neId == "1"){
			str += '<option selected='+optionSelected+' value="'+item.neId+'">'+item.userLabel+'</option>'
		}else{
			str += '<option value="'+item.neId+'">'+item.userLabel+'</option>'
		}
        
    }
	$(".selectNe2").append(str);
	$(".selectNe2").val("1")
}

var connData;
function getConnData(data){
	console.log(data);
    connData=[];
    connData = data.conn;
    $(".odukConnContent").empty();
	$('#filterCount').html('');
    var odu0Count = 0;
    var odu1Count = 0;
    var odu2Count = 0;
    var odu3Count = 0;
    var odu4Count = 0;
    var odu2eCount = 0;
    var allCount = 0 ;
    for(var a in connData){
        var item = connData[a];
        var str = ''
        if(item.neId == "1"){
            str += '<tr>'
                +'<td><input type="checkbox" style="position: inherit;opacity: 1;left: 0px"/></td>'
                +'<td>'+item.connType+'</td>'
                +'<td>'+item.connA.userLabel+'</td>'
                +'<td>'+item.connZ1.userLabel+'</td>'
                +'<td>'+item.connZ2.userLabel+'</td>'
                +'<td>'+item.connZ3.userLabel+'</td>'
                +'<td><button onclick="showConn(event)" class="odukBtnStyle" style="margin:10px 0 0 2px" value="'+item.connId+'">详情</button><button onclick="delConn(event)" class="odukBtnStyle" style="margin:10px 0 0 2px" value="'+item.connId+'">删除</button></td>'

                +'</tr>'
				if(item.connA.portFilter == "ODU0"){
					odu0Count++;
				}else if(item.connA.portFilter == "ODU1"){
					odu1Count++;
				}else if(item.connA.portFilter == "ODU2"){
					odu2Count++;
				}else if(item.connA.portFilter == "ODU3"){
					odu3Count++;
				}else if(item.connA.portFilter == "ODU4"){
					odu4Count++;
				}else if(item.connA.portFilter == "ODU2E"){
					odu2eCount++;
				}
				allCount++;
				$(".odukConnContent").append(str)
        }
	
		
    }
	$('#filterCount').html('<span class="odukFilterSpan" style="color:#ccc">业务总数:'
			+allCount+'</span><span class="odukFilterSpan" style="color:#ccc">ODU0颗粒业务总数:'
			+odu0Count+'</span><span class="odukFilterSpan" style="color:#ccc">ODU1颗粒业务总数:'
			+odu1Count+'</span><span class="odukFilterSpan" style="color:#ccc">ODU2颗粒业务总数:'
			+odu2Count+'</span><span class="odukFilterSpan" style="color:#ccc">ODU3颗粒业务总数:'
			+odu3Count+'</span><span class="odukFilterSpan" style="color:#ccc">ODU4颗粒业务总数:'
			+odu4Count+'</span><span class="odukFilterSpan" style="color:#ccc">ODU2E颗粒业务总数'
			+odu2eCount+'</span>')
    
}
getJSON('get',server_path+'/oms1350/web/eqm/omc_all/data/7_2_5/connection.json',getConnData)
var portData;
function getPortData(data){
    portData = [];
    portData = data;
    if(!initParmData){
        showOCXPort();
    }
}
getJSON('get',server_path+'/oms1350/web/eqm/omc_all/data/7_2_5/port.json',getPortData)
function selectConnNe(event){
    var neID = $(event.target).val();
	console.log(neID)
    $('#filterCount').empty();
	$(".odukConnContent").empty();
	var odu0Count = 0;
    var odu1Count = 0;
    var odu2Count = 0;
    var odu3Count = 0;
    var odu4Count = 0;
    var odu2eCount = 0;
    var allCount = 0 ;
    function getConnNew(data){
		var str = ''
        for(var a in data.conn){
            var item = data.conn[a];
            if(neID == item.neId){
                str += '<tr>'
                    +'<td><input type="checkbox" style="position: inherit;opacity: 1;left: 0px"/></td>'
                    +'<td>'+item.connType+'</td>'
                    +'<td>'+item.connA.userLabel+'</td>'
                    +'<td>'+item.connZ1.userLabel+'</td>'
                    +'<td>'+item.connZ2.userLabel+'</td>'
                    +'<td>'+item.connZ3.userLabel+'</td>'
                    +'<td><button onclick="showConn(event)" class="odukBtnStyle" style="margin-top:10px" value="'+item.connId+'">详情</button><button onclick="delConn(event)" class="odukBtnStyle" style="margin:10px 0 0 2px" value="'+item.connId+'">删除</button></td>'
                    +'</tr>'
					
				if(item.connA.portFilter == "ODU0"){
					odu0Count++;
				}else if(item.connA.portFilter == "ODU1"){
					odu1Count++;
				}else if(item.connA.portFilter == "ODU2"){
					odu2Count++;
				}else if(item.connA.portFilter == "ODU3"){
					odu3Count++;
				}else if(item.connA.portFilter == "ODU4"){
					odu4Count++;
				}else if(item.connA.portFilter == "ODU2E"){
					odu2eCount++;
				}
				allCount++;
				console.log(str)
				//$("#connContent").append(str);
            }
        }
		$(".odukConnContent").html(str)
		$('#filterCount').html('<span class="odukFilterSpan" style="color:#ccc">业务总数:'
			+allCount+'</span><span class="odukFilterSpan" style="color:#ccc">ODU0颗粒业务总数:'
			+odu0Count+'</span><span class="odukFilterSpan" style="color:#ccc">ODU1颗粒业务总数:'
			+odu1Count+'</span><span class="odukFilterSpan" style="color:#ccc">ODU2颗粒业务总数:'
			+odu2Count+'</span><span class="odukFilterSpan" style="color:#ccc">ODU3颗粒业务总数:'
			+odu3Count+'</span><span class="odukFilterSpan" style="color:#ccc">ODU4颗粒业务总数:'
			+odu4Count+'</span><span class="odukFilterSpan" style="color:#ccc">ODU2E颗粒业务总数'
			+odu2eCount+'</span>')
    }
    getJSON('get',server_path+'/oms1350/web/eqm/omc_all/data/7_2_5/connection.json',getConnNew)
    $('.onewayConn').hide();
    $('.bothwayConn').hide();
    $('.multipointConn').hide();
    $('.loopbackConn').hide();
    $('.loopbackConn1').hide();
}

var initParmData = false;

function showOCXPort(){
    initParmData = false;
    var neID = $('.selectNe1').val();
    var ocxType = $('#ocxType').val();
    $('#onewayPort1').val("");
    $('#onewayPort2').val("");
    var str1 = '';
    var str2 = '';
    for(var a in portData){
        var item = portData[a];
        if(neID == item.neId){
            str1 += '<option value="'+item.tpId+'">'+item.userLabel+'</option>';
            str2 += '<option value="'+item.tpId+'">'+item.userLabel+'</option>';
        }
    }
    $('#onewayPort1').append(str1);
    $('#onewayPort2').append(str2);
    $('#onewayCard').show();
    $('#bothwayCard').hide();
    $('#multipointCard').hide();
    $('#loopbackCard').hide();
    $('#loopbackCard1').hide();
}

function showODUKcard(){
    initParmData = true
    getJSON('get',server_path+'/oms1350/web/eqm/omc_all/data/7_2_5/port.json',getPortData)
    var neID = $('.selectNe1').val();
    var ocxType = $('#ocxType').val();;
    if(ocxType == "单向点到点"){
        $('#onewayPort1').empty();
        $('#onewayPort2').empty();
        var str1 = '';
        for(var a in portData){
            var item = portData[a];
            if(neID == item.neId){
                str1 += '<option value="'+item.tpId+'">'+item.userLabel+'</option>';
            }
        };
        $('#onewayPort1').append(str1);
        $('#onewayPort2').append(str1);
        $('#onewayCard').show();
        $('#bothwayCard').hide();
        $('#multipointCard').hide();
        $('#loopbackCard').hide();

    } else if(ocxType == "双向点到点"){
        $('#bothwayPort1').empty();
        $('#bothwayPort2').empty();
        var str1 = '';
        for(var a in portData){
            var item = portData[a];
            if(neID == item.neId){
                str1 += '<option value="'+item.tpId+'">'+item.userLabel+'</option>';
            }
        }
        $('#bothwayPort1').append(str1);
        $('#bothwayPort2').append(str1);
        $('#onewayCard').hide();
        $('#bothwayCard').show();
        $('#multipointCard').hide();
        $('#loopbackCard').hide();
        $('#loopbackCard1').hide();
    }else if(ocxType == "点到多点"){
        $('#multipointPort1').empty();
        $('#multipointPort2').empty();
        $('#multipointPort3').empty();
        $('#multipointPort4').empty();
        var str1 = '';
        for(var a in portData){
            var item = portData[a];
            if(neID == item.neId){
                str1 += '<option value="'+item.tpId+'">'+item.userLabel+'</option>';
            }
        }
        $('#multipointPort1').append(str1);
        $('#multipointPort2').append(str1);
        $('#multipointPort3').append(str1);
        $('#multipointPort4').append(str1);
        $('#multipointPort4').val("");
        $('#onewayCard').hide();
        $('#bothwayCard').hide();
        $('#multipointCard').show();
        $('#loopbackCard').hide();
        $('#loopbackCard1').hide();
    }else if(ocxType == "内环回"){
        $('#loopbackPort').empty();
        var str1 = '';
        for(var a in portData){
            var item = portData[a];
            if(neID == item.neId){
                str1 += '<option value="'+item.tpId+'">'+item.userLabel+'</option>';
            }
        }
        $('#loopbackPort').append(str1);
        $('#onewayCard').hide();
        $('#bothwayCard').hide();
        $('#multipointCard').hide();
        $('#loopbackCard').show();
        $('#loopbackCard1').hide();
    }else if(ocxType == "外环回"){
        $('#loopbackPort1').val("");
        var str1 = '';
        for(var a in portData){
            var item = portData[a];
            if(neID == item.neId){
                str1 += '<option value="'+item.tpId+'">'+item.userLabel+'</option>';
            }
        }
        $('#loopbackPort1').append(str1);
        $('#onewayCard').hide();
        $('#bothwayCard').hide();
        $('#multipointCard').hide();
        $('#loopbackCard').hide();
        $('#loopbackCard1').show();
    }
}

function sureDelClick(){
    for(var a in connData){
        var item = connData[a];
        if(connDelId == item.connId){
            connData.splice(a,1)
        }
    }
    submitData(connData,'delete');
    $('#confrimDelDlg').hide();
    openQuery('#operation','提示信息');

}

var connDelId;
function delConn(event){
    openQuery('#confrimDelDlg','确认删除');
    connDelId = $(event.target).val();
    $('.onewayConn').hide()
    $('.bothwayConn').hide()
    $('.multipointConn').hide()
    $('.loopbackConn').hide()
    $('.loopbackConn1').hide()
}


function showConn(event){
    console.log($(event.target).val())
    var connId = $(event.target).val();
    var connDetail;
    for(var a in connData){
        var item = connData[a];
        if(connId == item.connId){
            connDetail = item;
        }
    }
    if(connDetail.connType == "单向点到点"){
        $('.onewayConnPort1').val(connDetail.connA.userLabel)
        $('.onewayConnPort2').val(connDetail.connZ1.userLabel)
        $('.onewayConn').show();
        $('.bothwayConn').hide();
        $('.multipointConn').hide();
        $('.loopbackConn').hide();
        $('.loopbackConn1').hide();
    }else if(connDetail.connType == "双向点到点"){
        $('.bothwayConnPort1').val(connDetail.connA.userLabel)
        $('.bothwayConnPort2').val(connDetail.connZ1.userLabel)
        $('.onewayConn').hide();
        $('.bothwayConn').show();
        $('.multipointConn').hide();
        $('.loopbackConn').hide();
        $('.loopbackConn1').hide();
    }else if(connDetail.connType == "点到多点"){
        if(connDetail.connZ3.userLabel){
            $('.twoPoint').hide();
            $('.threePoint').show();
            $('.multipointConnPort1').val(connDetail.connA.userLabel)
            $('.multipointConnPort2').val(connDetail.connZ1.userLabel)
            $('.multipointConnPort3').val(connDetail.connZ2.userLabel)
            $('.multipointConnPort4').val(connDetail.connZ3.userLabel)
        }else{
            $('.twoPoint').show();
            $('.threePoint').hide();
            $('.multipointConnPortA1').val(connDetail.connA.userLabel)
            $('.multipointConnPortA2').val(connDetail.connZ1.userLabel)
            $('.multipointConnPortA3').val(connDetail.connZ2.userLabel)
        }
        $('.onewayConn').hide();
        $('.bothwayConn').hide();
        $('.multipointConn').show();
        $('.loopbackConn').hide();
        $('.loopbackConn1').hide();
    }else if(connDetail.connType == "内环回"){
        $('#loopbackConnPort').val(connDetail.connA.userLabel)
        $('.onewayConn').hide();
        $('.bothwayConn').hide();
        $('.multipointConn').hide();
        $('.loopbackConn').show();
        $('.loopbackConn1').hide();
    }else if(connDetail.connType == "外环回"){
        $('#loopbackConnPort1').val(connDetail.connA.userLabel)
        $('.onewayConn').hide();
        $('.bothwayConn').hide();
        $('.multipointConn').hide();
        $('.loopbackConn').hide();
        $('.loopbackConn1').show();
    }
}

function submitData(data,tipState){
	console.log(data);
    var connData = {
        conn:data
    }
    var tempData = {
        'content':JSON.stringify(connData),
        'filename':'/oms1350/web/eqm/omc_all/data/7_2_5/connection.json'
    }
    setTimeout(function(){
        $.post(cgi_path,tempData,function(resp){
            if(resp == 'success'){
               
                openQuery('#success','提示信息');
				setTimeout(function(){
					var tempdialog = dialog.getCurrent();
					if(tempdialog != undefined){
						tempdialog.close();
					}
					if(tipState == "create"){
						$('#tip').show();
					}else if(tipState == "delete"){
						$('#deltip').show();
					}
					setTimeout(function(){
						$('#tip').hide();
						$('#deltip').hide();
					},10000)
				},1000)
				
            }else {
                alert("保存失败")
            }
        })
    },2000)
}

var parmState;
function submitConn(data){
    openQuery('#ConfrimDlg','提示信息');
    parmState = data;
}

function sureClick(){
    function p(s) {
        return s < 10 ? '0' + s: s;
    }

    var myDate = new Date();
    //获取当前年
    var year=myDate.getFullYear();
    //获取当前月
    var month=myDate.getMonth()+1;
    //获取当前日
    var date=myDate.getDate();
    var h=myDate.getHours();       //获取当前小时数(0-23)
    var m=myDate.getMinutes();     //获取当前分钟数(0-59)
    var s=myDate.getSeconds();

    var now=year+'-'+p(month)+"-"+p(date)+" "+p(h)+':'+p(m)+":"+p(s);
    if(parmState == "oneway"){
        var port1Data;
        var port2Data;
        var neID;
        var portName1 = $('#onewayPort1').val()
        var portName2 = $('#onewayPort2').val();
		debugger;
		for(var a in portData){
			var item = portData[a];
			if(portName1 == item.tpId){
				port1Data = item;
				neID = item.neId
			}
			if(portName2 == item.tpId){
				port2Data = item
			}
		}
		if(port1Data&&port2Data){
			var addConnData = {
				"neId":neID,
				"connId":now,
				"connA":port1Data,
				"connZ1":port2Data,
				"connZ2":{
					"neId":"",
					"tpId":"",
					"userLabel":"",
					"portFilter":""
				},
				"connZ3":{
					"neId":"",
					"tpId":"",
					"userLabel":"",
					"portFilter":""
				},
				"type":"ocx",
				"connType":"单向点到点"
			}
			connData.push(addConnData)
			submitData(connData,'create')
		}else{
			openQuery('#chosePort','提示信息');
		}
			
		
			
		
        
        
    }else if(parmState == "bothway"){
        var port1Data;
        var port2Data;
        var neID;
        var portName1 = $('#bothwayPort1').val()
        var portName2 = $('#bothwayPort2').val()
		
			for(var a in portData){
				var item = portData[a];
				if(portName1 == item.tpId){
					port1Data = item;
					neID = item.neId
				}
				if(portName2 == item.tpId){
					port2Data = item
				}
			}
			if(port1Data&&port2Data){
				var addConnData = {
					"neId":neID,
					"connId":now,
					"connA":port1Data,
					"connZ1":port2Data,
					"connZ2":{
						"neId":"",
						"tpId":"",
						"userLabel":"",
						"portFilter":""
					},
					"connZ3":{
						"neId":"",
						"tpId":"",
						"userLabel":"",
						"portFilter":""
					},
					"type":"ocx",
					"connType":"双向点到点"
				}
				connData.push(addConnData)
				submitData(connData,'create')
			}else{
				openQuery('#chosePort','提示信息');
			}
		
        
    }else if(parmState == "multipoint"){
        var port1Data;
        var port2Data;
        var port3Data;
        var port4Data;
        var neID;
        var portName1 = $('#multipointPort1').val()
        var portName2 = $('#multipointPort2').val()
        var portName3 = $('#multipointPort3').val()
        var portName4 = $('#multipointPort4').val()
        if(portName4){
            for(var a in portData){
                var item = portData[a];
                if(portName1 == item.tpId){
                    port1Data = item;
                    neID = item.neId
                }
				if(portName2 == item.tpId){
                    port2Data = item
                }
				if(portName3 == item.tpId){
                    port3Data = item
                }
				if(portName4 == item.tpId){
                    port4Data = item
                }
            }
			if(port1Data&&port2Data&&port3Data&&port4Data){
				var addConnData = {
					"neId":neID,
					"connId":now,
					"connA":port1Data,
					"connZ1":port2Data,
					"connZ2":port3Data,
					"connZ3":port4Data,
					"type":"ocx",
					"connType":"点到多点"
				}
			}else{
				openQuery('#chosePort','提示信息');
			}
            
        }else{
            for(var a in portData){
                var item = portData[a];
                if(portName1 == item.tpId){
                    port1Data = item;
                    neID = item.neId
                }
				if(portName2 == item.tpId){
                    port2Data = item
                }
				if(portName3 == item.tpId){
                    port3Data = item
                }
            }
			if(port1Data&&port2Data&&port3Data){
				 var addConnData = {
					"neId":neID,
					"connId":now,
					"connA":port1Data,
					"connZ1":port2Data,
					"connZ2":port3Data,
					"connZ3":{
						"neId":"",
						"tpId":"",
						"userLabel":"",
						"portFilter":""
					},
					"type":"ocx",
					"connType":"点到多点"
				}
			}else{
				openQuery('#chosePort','提示信息');
			}
           
        }

        connData.push(addConnData)
        submitData(connData,'create')
    }else if(parmState == "loopback"){
        var port1Data;
        var neID;
        var portName1 = $('#loopbackPort').val()
			for(var a in portData){
				var item = portData[a];
				if(portName1 == item.tpId){
					port1Data = item;
					neID = item.neId
				}
			}
			if(port1Data){
				var addConnData = {
					"neId":neID,
					"connId":now,
					"connA":port1Data,
					"connZ1":{
						"neId":"",
						"tpId":"",
						"userLabel":"",
						"portFilter":""
					},
					"connZ2":{
						"neId":"",
						"tpId":"",
						"userLabel":"",
						"portFilter":""
					},
					"connZ3":{
						"neId":"",
						"tpId":"",
						"userLabel":"",
						"portFilter":""
					},
					"type":"ocx",
					"connType":"内环回"
				}
				connData.push(addConnData)
				submitData(connData,'create')
			}else{
				openQuery('#chosePort','提示信息');
			}
    }else if(parmState == "loopback1"){
        var port1Data;
        var neID;
        var portName1 = $('#loopbackPort1').val();
			for(var a in portData){
				var item = portData[a];
				if(portName1 == item.tpId){
					port1Data = item;
					neID = item.neId
				}
			}
			
			if(port1Data){
				var addConnData = {
					"neId":neID,
					"connId":now,
					"connA":port1Data,
					"connZ1":{
						"neId":"",
						"tpId":"",
						"userLabel":"",
						"portFilter":""
					},
					"connZ2":{
						"neId":"",
						"tpId":"",
						"userLabel":"",
						"portFilter":""
					},
					"connZ3":{
						"neId":"",
						"tpId":"",
						"userLabel":"",
						"portFilter":""
					},
					"type":"ocx",
					"connType":"外环回"
				}
				connData.push(addConnData)
				submitData(connData,'create')
			}else{
				openQuery('#chosePort','提示信息');
			}
			
	
			
	
        
    }
    openQuery('#operation','提示信息');
    setTimeout(function(){
        $('#ConfrimDlg').hide();
    },1000)
}

var showdlgSerach = function(){
	getJSON('get',server_path+'/oms1350/web/eqm/omc_all/data/7_2_5/NE.json',showNe2Userlabel)
    getJSON('get',server_path+'/oms1350/web/eqm/omc_all/data/7_2_5/connection.json',getConnData)
    openQuery('#ODUKQuery','查询界面');
}

$('#ConfrimDlg').hide();
$('#operation').hide();
$('#confrimDelDlg').hide();
$('.twoPoint').hide();
$('.threePoint').hide();
$('.onewayConn').hide();
$('.bothwayConn').hide();
$('.multipointConn').hide();
$('.loopbackConn').hide();
$('.loopbackConn1').hide();
	
   
