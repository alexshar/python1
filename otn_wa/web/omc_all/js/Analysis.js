/*-----------------------------------------------------*/

/**
 * Created by lenovo on 2017/10/17.
 */


/*
var server_path = 'https://135.251.96.54:8443';
var cgi_path = "https://135.251.96.54:8443/cgi-bin/test.cgi";

/!*-----------------------------------------------------------*!/
$("#bandfixed").hide();
$("#DLGsuccess").hide();
$("#fixeds").hide();

var dandWidth=null;
var fixBandId=null;
var checkID=0;
var hrefConent=window.location.href;
var getbandWidth=function(){
    $.getJSON(server_path+'/oms1350/web/eqm/omc_all/data/7_13_1/bandwidth.json',function(data){
        /!* $.getJSON(server_path+'/oms1350/web/eqm/omc_all/data/7_13_1/pg.json',function(data){*!/
        dandWidth=data;
        data=data;
        var html="";
        for(var i in data){
            html+="<tr class='trName'><td ><a href='javascript:void(0);' onclick='checkCards(event)' value='"+data[i].id+"' ip='"+data[i].name+"'  status='"+data[i].name+"'>"+data[i].name+"</a></td>" +
                "<td>"+data[i].type+"</td>" +
                "<td>已修改</td>" +
                "<td>"+data[i].sourceNode+"</td>" +
                "<td>"+data[i].sinkNode+"</td>" +
                "<td><button value='"+data[i].ODU+"' band='"+data[i].name+"' bandId='"+data[i].id+"' onclick='fixNeCofings(event)' class='PGBtnStyle'>实时修改</button>" +
                "<button style='margin-left: 10px' value='"+data[i].ODU+"' band='"+data[i].name+"' bandId='"+data[i].id+"' onclick='fixNeCofingtwo(event)' class='PGBtnStyle'>预约修改</button>"+
                "</td>" +
                "</tr>"
        }
        $(".conn").html(html)

        if(checkID==0){
            checkCards(false,dandWidth[checkID].id)
        }else {
            checkCards(false,dandWidth[checkID-1].id)
        }
    });
}
var checkCards=function (event,value){
    var val="";
    if(event){
        $(".trName").css("background-color","");
        var tr=$(event.target).parent().parent();
        $(tr).css("background-color","#d3f0e9");
        console.log($(tr))
        val=$(event.target).attr("value");
    }else {
        val=value;
    }
    checkID=val;
    var chekdata="";
    for(var i in dandWidth){
        if(dandWidth[i].id==val){
            chekdata=dandWidth[i];
        }
    }
    $('.bussin').html(chekdata.ODU+'G')
    var html='';

    if(chekdata.ODU==6 || chekdata.ODU==7 || chekdata.ODU==8){
        for(var i=1;i<=chekdata.ODU-1;i++){
            if(i!=null && i!='' && i<9){
                html+='<p>ODU0#'+i+'</p>'
            }
        }
    }else {
        for(var i=1;i<=chekdata.ODU;i++){
            if(i!=null && i!='' && i<9){
                html+='<p>ODU0#'+i+'</p>'
            }
        }
    }

    $(".bussinName").html(chekdata.name);
    $('.bussinBand').html(html)
    console.log(chekdata)
}
var clicks=1;
var fixNeCofings=function (event) {
    var val=null;
    var band=null;
    val=$(event.target).attr("value");
    band=$(event.target).attr("band");
    fixBandId=$(event.target).attr("bandId");
    clicks=1;
    showTItle("bandfixed","带宽修改")
    $(".select-band").val(val)
    $(".band-name").val(band)
}

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function crtTimeFtt(){
    var crtTime = new Date();
    return top.dateFtt("yyyy-MM-dd hh:mm:ss",crtTime);//直接调用公共JS里面的时间类处理的办法
}
var fixNeCofingtwo=function (event) {
    var times = new Date().Format("yyyy-MM-dd HH:mm:ss");
    var time1=  times.split(' ')
    $('.timeInput').val(time1[0]+'T'+time1[1]);

    var val=null;
    var band=null;
    val=$(event.target).attr("value");
    band=$(event.target).attr("band");
    fixBandId=$(event.target).attr("bandId");
    clicks=1;

    showTItle("fixeds","预约修改")
    $(".select-band").val(val)
    $(".band-name").val(band)
}


getbandWidth();
var showTItle=function(id,title,widths){
    if(widths==null){
        widths=0.5;
    }
    var dialogId ="#"+id+"";
    var w = $(document.body).width() * widths;
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
$(".btnConfrim").click(function(event){
    if(clicks!=1){
        return;
    }
    clicks++;
    showTItle("ConfrimDlg","提示");
    console.log($(event.target).parent())
    var op=$(event.target).parent().parent().find(".select-band").val();
    for(var i in dandWidth){
        console.log(dandWidth[i].id+"=="+parseInt(fixBandId))
        if(dandWidth[i].id==parseInt(fixBandId)){
            dandWidth[i].ODU=parseInt(op);
            dandWidth[i].time='0';
        }
    }
    postData(dandWidth);
})

$(".btnConfrims").click(function(event){
    if(clicks!=1){
        return;
    }
    clicks++;
    showTItle("ConfrimDlg","提示");
    var op=$(event.target).parent().parent().find(".select-band").val();
    var time=$(event.target).parent().parent().find(".timeInput").val();
    var timeStamp = new Date(time).getTime();
    var myDate = new Date();

    for(var i in dandWidth){
        console.log(dandWidth[i].id+"=="+parseInt(fixBandId))
        if(dandWidth[i].id==parseInt(fixBandId)){
            if(myDate.getTime()<timeStamp){
                dandWidth[i].ODUtime=parseInt(op);
                dandWidth[i].time=timeStamp;
            }
        }
    }
    postData(dandWidth);
})
*/
var hrefConent=window.location.href;

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
var postData=function(data){
    showTItle("operation","提示");
    var tempData = {
        'content':JSON.stringify(data),
        'filename':'/oms1350/web/eqm/omc_all/data/14_14/AnalysisNetwork.json'}
    $.post(cgi_path, tempData, function(resp) {
        $('#wait_save_eth').hide();
        if(resp == 'success') {
            setTimeout(function(){
                var tempdialog = dialog.getCurrent();
                if(tempdialog != undefined){
                    tempdialog.close();
                }
                showTItle("DLGsuccess","提示");
            },2000)
        } else {
            alert('保存失败');
        }
//                window.location.reload();
    }).error(function(){
        $('#wait_save_eth').hide();
        alert("连接服务器失败!");
    });
}
var postDatas=function(data){
    var tempData = {
        'content':JSON.stringify(data),
        'filename':'/oms1350/web/eqm/omc_all/data/14_14/AnalysisNetwork.json'}
    $.post(cgi_path, tempData, function(resp) {
        $('#wait_save_eth').hide();
        if(resp == 'success') {
            setTimeout(function(){
                var tempdialog = dialog.getCurrent();
                if(tempdialog != undefined){
                    tempdialog.close();
                }
            },2000)
            setTimeout(function(){
                getcircuitList();
            },500)
        } else {
            alert('保存失败');
        }
//                window.location.reload();
    }).error(function(){
        $('#wait_save_eth').hide();
        alert("连接服务器失败!");
    });
}
var postSumbit=function(data){
    var tempData = {
        'content':JSON.stringify(data),
        'filename':'/oms1350/web/eqm/omc_all/data/14_14/AnalysisNetwork.json'}
    $.post(cgi_path, tempData, function(resp) {
        $('#wait_save_eth').hide();
        if(resp == 'success') {
            setTimeout(function(){
                var tempdialog = dialog.getCurrent();
                if(tempdialog != undefined){
                    tempdialog.close();
                }
            },2000)
            $(".timeUPOut").html( circuit.ODUtime);
        } else {
            alert('保存失败');
        }
//                window.location.reload();
    }).error(function(){
        $('#wait_save_eth').hide();
        alert("连接服务器失败!");
    });
}

$("#fixeds").hide();
$("#DLGsuccess").hide();
$("#operation").hide();

var server_path = 'https://135.251.96.98:8443';
var cgi_path = "https://135.251.96.98:8443/cgi-bin/test.cgi";
var circuit=null;
var clicks=1;
var reshList=null;
var bandTime=null;
var showTItle=function(id,title,widths){
    if(widths==null){
        widths=0.5;
    }
    var dialogId ="#"+id+"";
    var w = $(document.body).width() * widths;
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
var getList=function(){

    $.getJSON(server_path+'/oms1350/web/eqm/omc_all/data/14_14/AnalysisNetwork.json',function(data){
        /* $.getJSON(server_path+'/oms1350/web/eqm/omc_all/data/7_13_1/pg.json',function(data){*/
        circuit=data;
        data=data;
        /*      var html=null;
              for(var i in data){
                  html+="<tr class='trName'><td ><a href='javascript:void(0);' onclick='checkCards(event)' value='"+data[i].id+"' ip='"+data[i].name+"'  status='"+data[i].name+"'>"+data[i].name+"</a></td>" +
                      "<td>"+data[i].type+"</td>" +
                      "<td>"+data[i].state+"</td>" +
                      "<td>"+data[i].sourceNode+"</td>" +
                      "<td>"+data[i].sinkNode+"</td>" +
                      "<td><button value='"+data[i].ODU+"' band='"+data[i].name+"' bandId='"+data[i].id+"' onclick='fixNeCofings(event)' class='PGBtnStyle'>实时修改</button>" +
                      "<button style='margin-left: 10px' value='"+data[i].ODU+"' band='"+data[i].name+"' bandId='"+data[i].id+"' onclick='fixNeCofingtwo(event)' class='PGBtnStyle'>预约修改</button>"+
                      "</td>" +
                      "</tr>"
              }
              $(".conn").html(html)*/

        var selectHtml=null;
        selectHtml="<option value=' '>请选择</option>";
        for(var i in data.ne){
            selectHtml+="<option value='"+data.ne[i].name+"'>"+data.ne[i].name+"</option>"
        }
        $(".select-ne").html(selectHtml)

        var connHtml=null;
        connHtml="<option value=' '>请选择</option>";
        for(var i in data.conn){
            connHtml+="<option value='"+data.conn[i].name+"'>"+data.conn[i].name+"</option>"
        }
        $(".select-conn").html(connHtml)

        $(".node-band").html(data.ne[0])
        if(circuit.ODUtime!=" "){
            var times = new Date(circuit.ODUtime).Format("yyyy-MM-dd HH:mm:ss");
            $(".timeUPOut").html(times);
        }
    });
}

$(".start-btn").click(function () {
    showTItle("operation","提示");
    setTimeout(function () {
        showTItle("DLGsuccess","提示");
        var data=null
        for(var o in circuit[reshList]){
            if(circuit[reshList][o].name==$(".node-band").html()){
                data=circuit[reshList][o].list;
            }
        }
        /* var data=circuit.circuitList;*/
        var html=null;
        for(var i in data){
            html+="<tr class='trName'>" +
                "<td>"+data[i].name+"</td>" +
                "<td>"+data[i].Result+"</td>" +
                "<td>"+data[i].route+"</td>" +
                "</tr>"
        }
        $(".conn").html(html)
    },2000)

})

$(".time-btn").click(function () {
    clicks=1;
    showTItle("fixeds","定时执行")
    var times = new Date().Format("yyyy-MM-dd HH:mm:ss");
    var time1=  times.split(' ')
    $('.timeInput').val(time1[0]+'T'+time1[1]);
})
$(".select-ne").change(function (){
    circuit.ODUtime=" ";
    postSumbit(circuit);
    $(".select-conn").val(' ');
    reshList="ne";
    $(this).val();
    $(".node-band").html($(this).val())
})
$(".select-conn").change(function (){
    circuit.ODUtime=" ";
    postSumbit(circuit);
    reshList="conn";
    $(this).val();
    $(".node-band").html($(this).val())
})


$(".btnConfrims").click(function(event){
    if(clicks!=1){
        return;
    }
    clicks++;
    showTItle("ConfrimDlg","提示");
    var time=$(event.target).parent().parent().find(".timeInput").val();
    var timeStamp = new Date(time).getTime();
    var times = new Date(timeStamp).Format("yyyy-MM-dd HH:mm:ss");
    var myDate = new Date();
    if(myDate.getTime()<timeStamp){
        circuit.ODUtime=timeStamp;
        postData(circuit);
        $(".timeUPOut").html(times);
    }
})

getList();


var getcircuitList=function () {
    var data=null
    for(var o in circuit[reshList]){
        if(circuit[reshList][o].name==$(".node-band").html()){
            data=circuit[reshList][o].list;
        }
    }
    /*   var data=circuit.circuitList;*/
    var html=null;
    for(var i in data){
        html+="<tr class='trName'>" +
            "<td>"+data[i].name+"</td>" +
            "<td>"+data[i].Result+"</td>" +
            "<td>"+data[i].route+"</td>" +
            "</tr>"
    }
    $(".conn").html(html)
}

var bandTime=setInterval(function () {

    var eventHref=window.location.href;
    if(hrefConent!=eventHref){
        clearInterval(bandTime);
    }
    var myDate = new Date();
    var timeStamp =new Date(circuit.time).getTime();
    if(circuit.ODUtime<myDate.getTime() && circuit.ODUtime!=" " && circuit.ODUtime!=circuit.time){
        circuit.time=circuit.ODUtime;
        postDatas(circuit)
    }

},1000)