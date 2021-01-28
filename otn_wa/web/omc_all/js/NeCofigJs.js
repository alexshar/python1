/**
 * Created by lenovo on 2017/10/17.
 */
var configNe={};
var fixID='';
var pageStaus="";

var server_path = 'https://135.251.96.98:8443';
var cgi_path = "https://135.251.96.98:8443/cgi-bin/test.cgi";

$("#NEconfigDlg").hide();
$("#ConfrimDlg").hide();
$("#operation").hide();
$("#DLGsuccess").hide();
$("#NEconfigDlgs").hide();
$("#tabULs").hide();
$("#handSet").hide();


var getlist=function(){
    $.getJSON(server_path+'/oms1350/web/eqm/omc_all/data/7_13_1/Neconfig.json',function(data){
        /* $.getJSON(server_path+'/oms1350/web/eqm/omc_all/data/7_13_1/pg.json',function(data){*/
        configNe=data;
        data=data.neCofig;
        var html="";
        for(var i in data){
            if(data[i].ip!=""){
                html+="<tr><td ><a href='javascript:void(0);' onclick='checkCard(event)' value='"+data[i].id+"' ip='"+data[i].name+"'  status='"+data[i].name+"'>"+data[i].name+"</a></td>" +
                    "<td>"+data[i].ip+"</td>" +
                    "<td>"+data[i].Resource+"</td>" +
                    "<td><button list='"+data[i].name+"'  ip='"+data[i].ip+"'  status='"+data[i].Resource+"'  onclick='fixNeCofing(event)' class='PGBtnStyle'>配置</button></td>" +
                    "</tr>"
            }
        }
        $(".ProList").html(html)
        var html="";
        for(var i in data){
            if(data[i].ip==""){
                html+="<tr><td ><a href='javascript:void(0);' onclick='checkCard(event)' value='"+data[i].id+"' ip='"+data[i].name+"'  status='"+data[i].name+"'>"+data[i].name+"</a></td>" +
                    "<td>"+data[i].ip+"</td>" +
                    "<td>"+data[i].Resource+"</td>" +
                    "</tr>"
            }
        }
        $(".ProLists").html(html)

        var htmls="";
        for(var i in data){
            htmls+="<option value='"+data[i].name+"'>"+data[i].name+"</option>"
        }

        $(".NEconfignames").html(htmls)
        $(".TENe").change();

        /*checkCard("",configNe.neCofig[0].id);*/
    });
    ODInt();
}
getlist();



var checkCard=function(event,id){
    var val="";
    if(id!=null){
        val=id;
    }else {
        val=$(event.target).attr("value");
    }

    var chekdata="";
    for(var i in configNe.neCofig){
        if(configNe.neCofig[i].id==val){
            chekdata=configNe.neCofig[i];
        }
    }
    console.log(configNe)
    console.log(chekdata)
/*    var htmlStr="<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>名称:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.name+"</td>" +
        "</tr><tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>状态:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.RSVP.status+"</td></tr>" +
        "<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>地址:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.RSVP.IP+"</td></tr>"+
        "<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>协议ID:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.RSVP.httpID+"</td></tr>"+
        "<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>封装方式:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.RSVP.packageStyle+"</td></tr>"*/

/*    var htmlStr="<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>名称:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.name+"</td>" +
        "</tr><tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>状态:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.RSVP.status+"</td></tr>" +
        "<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>地址:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.RSVP.IP+"</td></tr>"+
        "<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>协议ID:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.RSVP.httpID+"</td></tr>"+
        "<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>封装方式:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.RSVP.packageStyle+"</td></tr>"*/
    var htmlStr="";
    $.each(chekdata.TE.connList,function(i,n){
        if(n.name!="0") {
            htmlStr += "<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.name + "</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.llsum + "</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.laberDK + "</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.type + "</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.LOact + "</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.Yloca + "</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.RSVP.status + "</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.RSVP.IP + "</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.RSVP.httpID + "</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.RSVP.packageStyle + "</td></tr>"
        }
    })

    $(".psvp").html(htmlStr);
/*
    var htmlStr="<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>名称:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.name+"</td>" +
        "</tr><tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>状态:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.OSPF.status+"</td></tr>" +
        "</tr><tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>地址:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.OSPF.IP+"</td></tr>" +
        "<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>协议ID:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.OSPF.httpID+"</td></tr>"+
        "<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>封装方式:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.OSPF.packageStyle+"</td></tr>"+
        "<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>约束条件:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.OSPF.constraint+"</td></tr>"
*/


    var htmlStr="";
    $.each(chekdata.TE.connList,function(i,n){
        if(n.name!="0") {
            htmlStr += "<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.name + "</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.llsum + "</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.laberDK + "</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.type + "</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.LOact + "</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.Yloca + "</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.OSPF.status + "</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.OSPF.IP + "</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.OSPF.httpID + "</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.OSPF.packageStyle + "</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>" + n.OSPF.constraint + "</td>" +
                "</tr>"
        }
    })

    $(".OSPF").html(htmlStr);

    console.log(chekdata.TE)
    var htmlStr="<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>名称:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.TE.name+"</td></tr>" +
        "<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>使能状态:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.TE.SHStaus+"</td></tr>" +
        "<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>端口:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.TE.prot+"</td>"+
        "</tr>"
    console.log("-----------------------------------")
    console.log(htmlStr)
       $(".TE").html(htmlStr);




    var htmlStr="<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>状态:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.Resource+"</td>" +
        "</tr>"
    $(".tabdiscovery").html(htmlStr);

    var Connk=chekdata.TE
    var loops="";
    for(var p in Connk.connList){
        if(Connk.connList[p].name!="0" && Connk.connList[p].name!=""){
            loops+="<tr>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+Connk.connList[p].name+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+Connk.connList[p].llsum+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+Connk.connList[p].laberDK+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+Connk.connList[p].type+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+Connk.connList[p].LOact+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+Connk.connList[p].Yloca+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+Connk.connList[p].port+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+Connk.connList[p].BOC+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+Connk.connList[p].staus+"</td>"+
                "<td><button list='"+Connk.connList[p].name+"' neid='"+chekdata.name+"'  onclick='DELectConn(event)' class='PGBtnStyle' disabled='disabled'>删除</button>" +
                "<button list='"+Connk.connList[p].name+"' neid='"+chekdata.name+"'  onclick='STOPconn(event)' class='PGBtnStyle'>禁止</button>"+
                "</td>" +
                "</tr>"
        }
    }
    console.log(loops);
    $("#TEcheck").html(loops);


    var loops="";
    for(var p in chekdata.laber){
        loops+="<tr>" +
            "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.laber[p].name+"</td>" +
            "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.laber[p].ip+"</td>" +
            "</tr>"
    }
    console.log(loops);
    $("#lbelerBody").html(loops);


 /*   var htmlStr="<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>名称:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.name+"</td>" +
        "<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>协议ID:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.LMP.httpID+"</td></tr>"+
        "<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>UDP端口:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.LMP.port+"</td></tr>"+
        "<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>发现方式:</td>" +
        "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.LMP.findStatus+"</td></tr>"
*/

    var htmlStr="";
    $.each(chekdata.TE.connList,function(i,n){
        if(n.name!="0"){
            htmlStr+="<tr><td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+n.name+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+n.llsum+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+ n.laberDK+"</td>"+
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+n.type+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+n.LOact+"</td>"+
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+n.Yloca+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+n.LMP.httpID+"</td>"+
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+n.LMP.port+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+n.LMP.findStatus+"</td>"+
                "</tr>"
        }

    })


    $(".LMP").html(htmlStr);


    $("#TEStauscheck").val(chekdata.TE.TEStaus)
    $("#SHStauscheck").val(chekdata.TE.SHStaus)

    showTItle("tabULs","提示",0.8);
    $("#tabULs ul li").eq(0).click();
}




$(".btnConfrim").click(function(){
    showTItle("ConfrimDlg","提示");

})



$(".sure").click(function(){
    showTItle("operation","提示");
    setTimeout(function(){
        var data={};
        if(pageStaus=="create"){
            fixID=$(".NEconfignames").val();
            data={
                "id":getTime(),
                "name":$(".NEconfignames").val(),
                "ip":$(".NEcofigIPs").val(),
                "Resource":$(".parsmerss").val(),
                "RSVP":"",
                "OSPF":"",
                "TE":"",
                "LMP":"",
                "prot":"",
                "laber":""
            }
            console.log(data)

            for(var i in configNe.neCofig){
                if(configNe.neCofig[i].name==data.name){
                    data.RSVP=configNe.neCofig[i].RSVP
                    data.OSPF=configNe.neCofig[i].OSPF
                    data.TE=configNe.neCofig[i].TE
                    data.LMP=configNe.neCofig[i].LMP
                    data.prot=configNe.neCofig[i].prot;
                    data.laber=configNe.neCofig[i].laber;

                    configNe.neCofig[i]=data;
                }
            }
            console.log(configNe)
            postData(configNe);
            getRefreshs(configNe.neCofig);
        }
     /*   else if(pageStaus="Automatic"){
            var url = "https://135.251.96.98:8443/cgi-bin/test.cgi";
            var template = {
                "content": JSON.stringify(myData),
                "filename": "/oms1350/web/eqm/omc_all/data/7_2_3/costManagement.json"
            }
            $.post(url, template, function (resp) {
                if (resp == "success") {
                    showTItle("DLGsuccess")
                    setTimeout(function(){
                        var tempdialog = dialog.getCurrent();
                        tempdialog.close();
                    },1000);
                } else {
                    alert("保存失败")
                }
            }).error(function () {
                alert("链接服务器失败");
            })
        }*/
        else if(pageStaus=="RSVP"){
            postData(configNe)
        }
        else if(pageStaus=="OSPF"){
            postData(configNe)
        }
        else if(pageStaus=="LMP"){
            postData(configNe)
        }
        else if(pageStaus=="TE"){
            postData(configNe)
        }
        else if(pageStaus=="fix"){
            data={
                "id":getTime(),
                "name":$(".NEconfigname").val(),
                "ip":$(".NEcofigIP").val(),
                "Resource":$(".parsmers").val(),
                "psvp":"",
                "ospf":"",
                "TE":"",
                "prot":""
            }
            $.each(configNe.neCofig,function(i,n){
                if(n.name==fixID){
                    n.id=getTime();
                    n.name=$(".NEconfigname").val();
                    n.ip=$(".NEcofigIP").val();
                    n.Resource=$(".parsmers").val();
                    if(n.ip==""){
                        $.each(n.TE.connList,function(h,s){
                            s.name=0;
                            for(var i in s.RSVP){
                                s.RSVP[i]="";
                            }
                            for(var i in s.OSPF){
                                s.OSPF[i]="";
                            }
                            for(var i in s.LMP){
                                s.LMP[i]="";
                            }
                        })
                    }
                }
            })

            console.log(data)
        /*    for(var i in configNe.neCofig){
                if(configNe.neCofig[i].name==fixID){
                    data.RSVP=configNe.neCofig[i].RSVP
                    data.OSPF=configNe.neCofig[i].OSPF
                    data.TE=configNe.neCofig[i].TE
                    data.LMP=configNe.neCofig[i].LMP
                    data.prot=configNe.neCofig[i].prot;
                    configNe.neCofig[i]=data;
                }
            }*/
            console.log(configNe)
            postData(configNe);
            showTItle("DLGsuccess","提示");
            getRefreshs(configNe.neCofig);
        }

    },2000)
})


//-----------------------------------------
var fixNeCofing=function(event){
    var neName=$(event.target).attr("list");
    var ip=$(event.target).attr("ip");
    var status=$(event.target).attr("status");
    fixID=neName;
    $(".NEconfigname").val(neName);
    $(".NEcofigIP").val(ip);
    $(".parsmers").val(status);
    showTItle("NEconfigDlg","配置操作")
    pageStaus="fix"
}

var fixtabcheck=function(event){
    $(event.target).attr()

    neObj.name=$(".neList").val()
    neObj.RSVP.IP=$("#rsvp_address").val();
    neObj.RSVP.httpID=$("#rsvp_treaty").val();
    neObj.RSVP.packageStyle=$("#rsvp_encapsulation").val()
    neObj.RSVP.status=$("#revp_state").val();
}

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
var getTime=function(){
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
    return now;
}
var postData=function(data){
    var tempData = {
        'content':JSON.stringify(data),
        'filename':'/oms1350/web/eqm/omc_all/data/7_13_1/Neconfig.json'}
    $.post(cgi_path, tempData, function(resp) {
        $('#wait_save_eth').hide();
        if(resp == 'success') {
            showTItle("DLGsuccess","提示");
            setTimeout(function(){
                var tempdialog = dialog.getCurrent();
                if(tempdialog != undefined){
                    tempdialog.close();
                }
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
var delepostData=function(data){
    var tempData = {
        'content':JSON.stringify(data),
        'filename':'/oms1350/web/eqm/omc_all/data/7_13_1/Neconfig.json'}
    $.post(cgi_path, tempData, function(resp) {
        $('#wait_save_eth').hide();
        if(resp == 'success') {
         /*   showTItle("DLGsuccess","提示");*/
        } else {
            alert('保存失败');
        }
//                window.location.reload();
    }).error(function(){
        $('#wait_save_eth').hide();
        alert("连接服务器失败!");
    });
}


$(".Config li").eq(0).find("div").css("display","block")
$(".Config li").eq(0).addClass("actives")
$(".Config li").click(function() {
    $(".Config li").each(function(){
        $(this).find("div").css("display","none")
        $(this).removeClass("actives")
    })
    $(this).find("div").css("display","block")
    $(this).addClass("actives")
})


$(".creatCofig").click(function(){
    showTItle("NEconfigDlgs","自动配置")
    pageStaus="create";
    $(".NEcofigIPs").val("");
})

var getRefreshs=function(data){
    var html="";
    for(var i in data){
        if(data[i].ip!=""){
            html+="<tr><td><a href='javascript:void(0);' onclick='checkCard(event)' value='"+data[i].id+"' ip='"+data[i].name+"'  status='"+data[i].name+"'>"+data[i].name+"</a></td>" +
                "<td>"+data[i].ip+"</td>" +
                "<td>"+data[i].Resource+"</td>" +
                "    <td><button list='"+data[i].name+"'  ip='"+data[i].ip+"'  status='"+data[i].Resource+"'  onclick='fixNeCofing(event)' class='PGBtnStyle'>配置</button></td></tr>"
        }
    }
    $(".ProList").html(html)

    var html="";
    for(var i in data){
        if(data[i].ip==""){
            html+="<tr><td ><a href='javascript:void(0);' onclick='checkCard(event)' value='"+data[i].id+"' ip='"+data[i].name+"'  status='"+data[i].name+"'>"+data[i].name+"</a></td>" +
                "<td>"+data[i].ip+"</td>" +
                "<td>"+data[i].Resource+"</td>" +
                "</tr>"
        }
    }
    $(".ProLists").html(html)
    /*   checkCard("",configNe.neCofig[0].id);*/
}


//controlConfig---------------------------------
//tab check
var autoType="RSVP";
$("#handSetTab").find("li").click(function(){
    var childDom=$(".tabCount");
    var ind=$(this).index();
    autoType=$(this).text();
    childDom.css("display","none");
    childDom.eq(ind).css("display","block");
    $(this).siblings().addClass("defaultTab").removeClass("activeTab");
    $(this).removeClass("defaultTab").addClass("activeTab");
});
function ODInt(){
    //$("#handSet>div").eq(0).css("display","block");
    //$("#RSVP").css("display","block");
    $(".tabCount").css("display","none")
    $(".tabCount").eq(0).css("display","block");
    $("#handSetTab>li").eq(0).addClass("activeTab")
}

$(".IPtest").focus(function(){
    $(this).css("border-bottom","1px solid #ccc");
})
//user
$(".use").on("click", function (e) {
    var neObj=null
     showTItle("ConfrimDlg","是否应用?")
    console.log($(".neList"))

    var ipTest=/^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/;
    switch(autoType){
        case"RSVP":
            pageStaus="RSVP"
            neObj=getData($(".RSVPneList").val())
            RSVP();
            break;
        case "OSPF":
            neObj=getData($(".OSPFneList").val())
            OSPF();
            pageStaus="OSPF"

            break;
        case"LMP":
            neObj=getData($(".LMPneList").val())
            LMP();
            pageStaus="LMP"
            break;
        case"TE":
            neObj=getData($("#TENe").val())
            TE();
            pageStaus="TE"
            break;
    }
    function RSVP(){
        if(ipTest.test($("#rsvp_address").val())){
            $("input#rsvp_address").css("border-bottom","1px solid #ccc")
          /*  neObj.name=$(".neList").val()*/
            neObj.RSVP.IP=$("#rsvp_address").val();
            neObj.RSVP.httpID=$("#rsvp_treaty").val();
            neObj.RSVP.packageStyle=$("#rsvp_encapsulation").val()
            neObj.RSVP.status=$("#revp_state").val();

            $.each(neObj.TE.connList,function(i,n){
                if($(".reoustr").val()==n.name){
                    n.RSVP.IP=$("#rsvp_address").val();
                    n.RSVP.httpID=$("#rsvp_treaty").val();
                    n.RSVP.packageStyle=$("#rsvp_encapsulation").val()
                    n.RSVP.status=$("#revp_state").val();
                }
            })

            console.log(neObj)
            configNe=getDatas(neObj);
        }else{
            $("input#rsvp_address").css("border-bottom","1px solid red")
        }
    }
    function OSPF(){
        if(ipTest.test($("#ospf_address").val())){
            $("input#ospf_address").css("border-bottom","1px solid #ccc")
          /*  neObj.name=$(".neList").val()*/
            neObj.OSPF.IP=$("#ospf_address").val();
            neObj.OSPF.httpID=$("#ospf_treaty").val();
            neObj.OSPF.packageStyle=$("#ospf_encapsulation").val()
            neObj.OSPF.status=$("#ospf_state").val()
            neObj.OSPF.constraint=$("#ospf_constraint").val()


            $.each(neObj.TE.connList,function(i,n){
                if(n.name==$(".OSPFreoustr").val()){
                    n.OSPF.IP=$("#ospf_address").val();
                    n.OSPF.httpID=$("#ospf_treaty").val();
                    n.OSPF.packageStyle=$("#ospf_encapsulation").val()
                    n.OSPF.status=$("#ospf_state").val()
                    n.OSPF.constraint=$("#ospf_constraint").val()
                }
            })
            console.log(neObj)
            configNe=getDatas(neObj);
        }else{
            $("input#ospf_address").css("border-bottom","1px solid red")
        }
    }
    function LMP(){
       /* neObj.name=$(".neList").val()*/
        neObj.LMP.httpID=$("#lmp_treaty").val();
        neObj.LMP.port=$("#lmp_port").val();
        neObj.LMP.findStatus=$("#autoFind").val();


        $.each(neObj.TE.connList,function(i,n){ 
            console.log(n.name+"=="+$(".LMPFreoustr").val())
            if(n.name==$(".LMPFreoustr").val()){
                n.LMP.httpID=$("#lmp_treaty").val();
                n.LMP.port=$("#lmp_port").val();
                n.LMP.findStatus=$("#autoFind").val();
            }
        })

        configNe=getDatas(neObj);
    }
    function TE(){
        var arry=[];
        $('input:checkbox').each(function() {
            if ($(this).attr('checked')=="checked" && $(this).val()!="on") {
                arry.push($(this).val())
            }
        });

        neObj.TE.name=$("#TENe").val();
        neObj.TE.prot=$("#TEPROT").val();
        console.log($(".TEStaus"))
        console.log($(".TEStaus").val())
        neObj.TE.TEStaus=$("#TEStaus").val();
        neObj.TE.SHStaus=$("#SHStaus").val();
        /*neObj.TE.connList=[];*/
        console.log(arry);
        for(var i in arry){

            $.each(neObj.TE.connList,function(j,n){
                console.log(n.port+"=="+neObj.TE.prot);
                if(n.port== neObj.TE.prot){
                    n.name=arry[i];
                    n.staus="激活";
                }
            })
            console.log(neObj.TE.connList)
       /*     var data={
                name:arry[i],
                port:$("#TEPROT").val(),
            }*/
      /*      $.each(neObj.TE.connList,function(){
                if(){

                }

            })*/
/*            neObj.TE.connList.push(data);*/
        }

        console.log("neObj")
        console.log(neObj)
        configNe=getDatas(neObj);
    }

    function getDatas(data){
        var str="";
        for(var i in configNe.neCofig){
            if(data.name==configNe.neCofig[i].name){
                configNe.neCofig[i]=data;
            }
        }
        return configNe;
    }

    function getData(val){
        var neObj="";
        $.each(configNe.neCofig,function(i,n){
            if(n.name==val){
                neObj=n;
            }
        })
        return neObj;
     /* for(var i in configNe.neCofig){
          if(configNe.neCofig[i].name==val){
              neObj=configNe.neCofig[i];
              break;
          }
      }*/

    }

})

//post
/*$(".sure").click(function(e){
 showTItle("operation")
 var url = "https://135.251.96.98:8443/cgi-bin/test.cgi";
 var template = {
 "content": JSON.stringify(myData),
 "filename": "/oms1350/web/eqm/omc_all/data/7_2_3/costManagement.json"
 }
 $.post(url, template, function (resp) {
 if (resp == "success") {
 showTItle("DLGsuccess")
 setTimeout(function(){
 var tempdialog = dialog.getCurrent();
 tempdialog.close();
 },1000);
 } else {
 alert("保存失败")
 }
 }).error(function () {
 alert("链接服务器失败");
 })
 })*/
$(".no").click(function(e){
    var tempdialog = dialog.getCurrent();
    tempdialog.close();
    return false;
})

$(".TENe").change(function(event){
    var val=$(event.target).val();

    var htmls="";
    for(var i in configNe.neCofig){
        if(configNe.neCofig[i].name==val){
            console.log(configNe.neCofig[i])
            for(var j in configNe.neCofig[i].prot){
                console.log(configNe.neCofig[i].prot[j])
                htmls+="<option value='"+configNe.neCofig[i].prot[j].name+"'>"+configNe.neCofig[i].prot[j].name+"</option>"
            }
        }
    }
    $("#TEPROT").html(htmls)
    $("#TEPROT").change();
})

$("#TEPROT").change(function(event){
    var vals=$(".TENe").val();
    var val=$(event.target).val();

    var htmls="";
     var portTable="";
    for(var i in configNe.neCofig){
        if(configNe.neCofig[i].name==vals){

            console.log(configNe.neCofig[i])
            for(var j in configNe.neCofig[i].prot){
                if(configNe.neCofig[i].prot[j].name==val){
                    portTable=configNe.neCofig[i].prot[j]
                    console.log(portTable)
                }
            }
        }
    }

    for(var k in portTable.connList){
        htmls+="<tr>" +
            "<td><input type='checkbox' style='position: inherit;opacity: 1;left: 0px'  value='"+portTable.connList[k].name+"' onclick='tdcheck(event)'></td>" +
            "<td>"+portTable.connList[k].name+"</td></tr>"
    }

    console.log(htmls)

    $(".TEConn").html(htmls)


})

$(".configBTN").click(function(){

    pageStaus="Automatic"
    showTItle("handSet","手动配置",0.7);
    var htmls="";
    for(var i in configNe.neCofig){
        htmls+="<option value='"+configNe.neCofig[i].name+"'>"+configNe.neCofig[i].name+"</option>"
    }
    $(".RSVPneList").html(htmls)

    $(".OSPFneList").html(htmls)
    $(".LMPneList").html(htmls)

    $(".OSPFneList").html(htmls)
    $(".LMPneList").html(htmls)
    $(".neList").html(htmls)
    $(".TENe").html(htmls);
    $(".TENe").change();

    $(".RSVPneList").change();
    $(".OSPFneList").change()
    $(".LMPneList").change()
    $("#handSetTab").find("li")[0].click()
    $(".thcheck").removeAttr("checked");


    $("#RSVP input").val("");
    $("#OSPF input").val("");
    $("#LMP input").val("");
})

$(".thcheck").click(function(){
    /*alert($(".thcheck").prop("checked"))*/
    if($(".thcheck").attr("checked")==undefined){
        $('input:checkbox').attr("checked","checked") ;
        $('input:checkbox').prop("checked","checked") ;
    }else {
        $('input:checkbox').each(function() {
            $(this).removeAttr("checked");
        });
    }
})

var tdcheck=function(event){
    if($(event.target).attr("checked")==undefined){
        $(event.target).attr("checked",'checked');
    }else {
        $(event.target).removeAttr("checked");
    }

}

var DELectConn=function(event){
    var  ConnName=$(event.target).attr("list");
    var  neID=$(event.target).attr("neid");



 /*   $.each(configNe.neCofig,function(i,n){
        if(n.name==neID) {
            var connArry = n.TE.connList;
            $.each(connArry, function (j, k) {
                if(k.name==ConnName){
                    connArry.splice(j,1);
                    configNe.neCofig[i].TE.connList=k;
                }
            })
        }
    })*/

    console.log(configNe.neCofig)
    for(var t in configNe.neCofig){
        if(configNe.neCofig[t].name==neID){
            var connArry=configNe.neCofig[t].TE.connList;
            console.log(connArry)
            for(var r in connArry){
                if(connArry[r].name==ConnName){
              /*      connArry.splice(r,1);*/
                    connArry[r].name=0;
                    console.log(connArry)
                    configNe.neCofig[t].TE.connList=connArry;
                }
            }
        }
    }
    console.log(configNe)
    delepostData(configNe)




    var Connk="";
    var chekdata="";
    for(var t in configNe.neCofig){
        console.log("Connk");
        console.log(configNe.neCofig[t].name+"===="+ConnName);
        if(configNe.neCofig[t].name==neID){
            Connk=configNe.neCofig[t].TE
            chekdata=configNe.neCofig[t];
        }
    }

   console.log("Connk");
   console.log(Connk);

    var loops="";
    for(var p in Connk.connList){
        if(Connk.connList[p].name!="0" && Connk.connList[p].name!=""){
            loops+="<tr>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+Connk.connList[p].name+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+Connk.connList[p].llsum+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+Connk.connList[p].laberDK+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+Connk.connList[p].type+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+Connk.connList[p].LOact+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+Connk.connList[p].Yloca+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+Connk.connList[p].port+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+Connk.connList[p].BOC+"</td>" +
                "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+Connk.connList[p].staus+"</td>" +
                "<td><button list='"+Connk.connList[p].name+"' neid='"+chekdata.name+"'  onclick='DELectConn(event)' class='PGBtnStyle' disabled='disabled'>删除</button>" +
                "<button list='"+Connk.connList[p].name+"' neid='"+chekdata.name+"'  onclick='STOPconn(event)' class='PGBtnStyle'>禁止</button>"+
                "</td>" +
                "</tr>"
        }
    }
    console.log(loops);
    $("#TEcheck").html(loops);


}

var STOPconn=function(event){
    var btn=$(event.target).prev();

    var connName=$(event.target).attr("list");
    var neid=$(event.target).attr("neid");
    $.each(configNe.neCofig,function(i,n){
        console.log(n.name+"=="+neid);
        console.log(n)
        if(n.name==neid){
            $.each(n.TE.connList,function(P,K){
                console.log(K.name+"=="+connName);
                console.log(K);
                if(K.name==connName){
                    K.staus="停止"
                    console.log(K);
                }
            })
        }

    });
    console.log(configNe)
    StopData(configNe);
    btn.removeAttr("disabled");
    var tds=btn.parents("td").prev();
    tds.html("停止");
}



var StopData=function(data){
    var tempData = {
        'content':JSON.stringify(data),
        'filename':'/oms1350/web/eqm/omc_all/data/7_13_1/Neconfig.json'}
    $.post(cgi_path, tempData, function(resp) {
        $('#wait_save_eth').hide();
        if(resp == 'success') {
        } else {
            alert('保存失败');
        }
//                window.location.reload();
    }).error(function(){
        $('#wait_save_eth').hide();
        alert("连接服务器失败!");
    });
}

var arry=[{
    "name":"zhaozq",
    "sum":"56"
},{
    "name":"zhaozq",
    "sum":"56"
}]
$.each(arry,function(i,n){
    console.log("测试")
    console.log(arry[i])
    console.log(this)
    console.log(n)
})


$(".RSVPneList").change(function(event){
    var val=$(event.target).val();

    var htmls="";
    for(var i in configNe.neCofig){
        if(configNe.neCofig[i].name==val){
            console.log(configNe.neCofig[i])

            $.each(configNe.neCofig[i].TE.connList,function(i,n){
                console.log(n)
                if(n.name!="0") {
                    htmls += "<option value='" + n.name + "'>" + n.name + "</option>"
                }
            })
        }
    }

    $(".reoustr").html(htmls)
})
$(".OSPFneList").change(function(event){
    var val=$(event.target).val();

    var htmls="";
    for(var i in configNe.neCofig){
        if(configNe.neCofig[i].name==val){
            console.log(configNe.neCofig[i])

            $.each(configNe.neCofig[i].TE.connList,function(i,n){
                console.log(n)
                if(n.name!="0") {
                    htmls += "<option value='" + n.name + "'>" + n.name + "</option>"
                }
            })
        }
    }

    $(".OSPFreoustr").html(htmls)
})
$(".LMPneList").change(function(event){
    var val=$(event.target).val();

    var htmls="";
    for(var i in configNe.neCofig){
        if(configNe.neCofig[i].name==val){
            console.log(configNe.neCofig[i])

            $.each(configNe.neCofig[i].TE.connList,function(i,n){
                if(n.name!="0"){
                    console.log(n)
                    htmls+="<option value='"+n.name+"'>"+n.name+"</option>"
                }
            })
        }
    }

    $(".LMPFreoustr").html(htmls)
})

