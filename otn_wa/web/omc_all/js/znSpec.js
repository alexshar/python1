/**
 * Created by lenovo on 2017/10/20.
 */
/**
 * Created by lenovo on 2017/10/17.
 */
var configNe={};
var configNes={};
var fixID='';
var pageStaus="";
var conNelist=$("#conNelist");
var server_path = 'https://135.251.96.98:8443';
var cgi_path = "https://135.251.96.98:8443/cgi-bin/test.cgi";
var conTable=[];
var NENAME=""
var PORTCLEAR=[];
var NAME=""
$("#NEconfigDlg").hide();
$("#ConfrimDlg").hide();
$("#operation").hide();
$("#DLGsuccess").hide();
$("#NEconfigDlgs").hide();
$("#handSet").hide();
var inName=""

var getlist=function(){
    $.getJSON(server_path+'/oms1350/web/eqm/omc_all/data/7_13_1/Neconfig.json',function(data){
        /* $.getJSON(server_path+'/oms1350/web/eqm/omc_all/data/7_13_1/pg.json',function(data){*/
        configNe=data;
        data=data.neCofig;
        conTable=configNe.TPCONTROLLER
        var htmls="";
        var chtmls=""
        var portItem={};
        inName=configNe.neCofig[0].name;
        for(var i in data){
            htmls+="<option value='"+data[i].id+"'>"+data[i].name+"</option>"
            chtmls+="<option value='"+data[i].name+"'>"+data[i].name+"</option>"
        }
        createTbody(configNe.neCofig[0].prot,"traditionalGraphic")
        NENAME=0
        $("#conNelist").append(chtmls)
        crateTableController("controllerGraphic")
    });
}
getlist();




var getlistName=function(){
    $.getJSON(server_path+'/oms1350/web/eqm/omc_all/data/7_13_1/Neconfig.json',function(data){

        configNes=data;
        data=configNes.neCofig;
        var htmls="";
        console.log(data)
        $.each(configNes.neCofig,function(i,n){
            htmls+="<option value='"+n.id+"'>"+n.name+"</option>"
        })
        $("#tabULSelct").html(htmls)



        var  dataMangs=configNes.neCofig

        var loops="";
        var sum=0;
        var Ysum=0;
        for(var p in dataMangs){
            try{
                $.each(dataMangs[p].TE.connList,function(i,n){
                    if(n.name!='0'){
                        loops+="<tr>" +
                            "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+dataMangs[p].name+"</td>" +
                            "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+ n.name+"</td>" +
                            "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+n.llsum+"</td>" +
                            "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+n.laberDK+"</td>" +
                            "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+n.YSreous+"</td>" +
                            "</tr>"
                        sum+=parseInt(n.laberDK);
                        Ysum+=parseInt(n.YSreous);
                    }
                })
            }catch (e){}
        }

        var koops="<tr >" +
            "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>已使用:</td>" +
            "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable' colspan='5'>"+Ysum+"G</td>" +
            "</tr>"
        var koop="<tr >" +
            "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>总计:</td>" +
            "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable' colspan='5'>"+sum+"G</td>" +
            "</tr>"
        $(".reousBOady").html(loops+koops+koop);
        $("#tabULSelct").change();
    });
}
getlistName();

var checkCard=function(event,id){
    var val="";
    if(id!=null){
        val=id;
    }else {
        val=$(event.target).attr("value");
    }

    var chekdata="";
    for(var i in configNes.neCofig){
        if(configNes.neCofig[i].id==val){
            chekdata=configNes.neCofig[i];
        }
    }
    console.log(chekdata)
/*    debugger;*/
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
                    /*                "<td><button list='"+Connk.connList[p].name+"' neid='"+chekdata.name+"'  onclick='DELectConn(event)' class='PGBtnStyle' disabled='disabled'>删除</button>" +
                     "<button list='"+Connk.connList[p].name+"' neid='"+chekdata.name+"'  onclick='STOPconn(event)' class='PGBtnStyle'>禁止</button>"+*/
                "</td>" +
                "</tr>"
        }
    }
    $("#TEcheck").html(loops);


    var loops="";
    for(var p in chekdata.laber){
        loops+="<tr>" +
            "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.laber[p].name+"</td>" +
            "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+chekdata.laber[p].ip+"</td>" +
            "</tr>"
    }
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

    /* showTItle("tabULs","提示",0.8);*/
    $("#tabULs ul li").eq(0).click();
}

$("#tabULSelct").click(function(e){
    e.stopPropagation();
})
$("#tabULSelct").change(function(event){
    event.stopPropagation();
    var vals=$(event.target).val();
    checkCard("",vals);
})


conNelist.change(function(event){
    inName=$(this).val();
    var port=[]
    for(var i in configNe.neCofig){
        if(configNe.neCofig[i].name==inName){
            port=configNe.neCofig[i].prot;
            NENAME=i;
            break;
        }
    }
    createTbody(port,"traditionalGraphic")
    crateTableController("controllerGraphic")
})

function createTbody(obj,dom){
    $("#"+dom).find("tbody").html("");
    var tbody=""
    for(var t in obj){
        if(obj[t].status!="cleared"){
            tbody+="<tr><td>"+obj[t].name+"</td><td>"+obj[t].type+"</td><td onclick='startContr("+obj[t].tid+")'><button>启用</button></td></tr>"
        }
    }
    $("#"+dom).find("tbody").append(tbody)
}
function crateTableController(dom){
    $("#"+dom).find("tbody").html("");
    var tbody=""
    var obj=conTable;
    for(var t in obj){
        if(obj[t].king==inName){
            tbody+="<tr><td>"+obj[t].name+"</td><td>"+obj[t].type+"</td><td><button value="+obj[t].status+" onclick='statusContr(event,"+obj[t].id+")'>"+obj[t].status+"<button></td><td><button onclick='removeContrItem("+obj[t].id+")'>删除</button></td></tr>"
        }
    }
    $("#"+dom).find("tbody").append(tbody)
}
var Kclick=""
function  startContr(tid){
    NAME=tid;
    Kclick=tid
    showTItle("ConfrimDlgCon","是否启用控制平面？");
}
$(".sureCon").click(function(){
    for(var j in configNe.neCofig[NENAME].prot){
        if(configNe.neCofig[NENAME].prot[j].tid==Kclick){
            var type="OCH";
            if(configNe.neCofig[NENAME].prot[j].name=="1-1-14-L1"){
                type="OCH";
            }else{
                type="INNI";
            }
            for(var k in configNe.neCofig[NENAME].TE.connList){
                if(configNe.neCofig[NENAME].TE.connList[k].port==configNe.neCofig[NENAME].prot[j].name){
                    var Nam=configNe.neCofig[NENAME].prot[j].connList[0].name;
                    configNe.neCofig[NENAME].TE.connList[k].name=Nam;
                }
            }
			for(var d in configNe.neCofig[NENAME].prot){
					if(NAME==configNe.neCofig[NENAME].prot[d].tid){
						configNe.neCofig[NENAME].prot[d].status="cleared";
						break;
					}
			}
			 conTable.push({"name":configNe.neCofig[NENAME].prot[j].connList[0].name,"id":Kclick,"type":type,"status":"up","king":inName})
            break;
        }
    }
    configNe.TPCONTROLLER=conTable;
    postMyData();
    createTbody(configNe.neCofig[NENAME].prot,"traditionalGraphic")
    crateTableController("controllerGraphic")
    var tempdialog = dialog.getCurrent();
    tempdialog.close();

});
$(".noCon").click(function(){})
//status tab
var TabName="";
var statu=""
function statusContr(event,sta){
    statu=$(event.target).attr("value")
    TabName=sta
    showTItle("ConfrimDlgChange","是否切换状态？");
}
$(".sureChang").click(function(){
    for(var i in configNe.TPCONTROLLER){
        if(configNe.TPCONTROLLER[i].id==TabName){
            if(statu=="up"){
                configNe.TPCONTROLLER[i].status="down";
            }else{
                configNe.TPCONTROLLER[i].status="up";
            }
        }
    }
    postMyData();
    crateTableController("controllerGraphic")
})
//set
var ItemIndex=""
function removeContrItem(name){
    for(var i in configNe.TPCONTROLLER){
        if(configNe.TPCONTROLLER[i].id==name){
            if(configNe.TPCONTROLLER[i].status=="up"){
                showTItle("tabCheck");
                setTimeout(function(){
                    var tempdialog = dialog.getCurrent();
                    if(tempdialog != undefined){
                        tempdialog.close();
                    }
                },2000)
            }else{
                var tempdialog = dialog.getCurrent();
                if(tempdialog != undefined){
                    tempdialog.close();
                }
                showTItle("ConfrimDlgRemove","是否删除");
                ItemIndex=i
            }
        }
    }
}

$(".sureRemove").click(function(e){
    for(var m in configNe.neCofig){
        for(var n in configNe.neCofig[m].prot){
            if(configNe.neCofig[m].prot[n].tid==configNe.TPCONTROLLER[ItemIndex].id){
                configNe.neCofig[m].prot[n].status="";
                postMyData();
                for(var na in configNe.neCofig[m].TE.connList){
                    if(configNe.neCofig[m].TE.connList[na].name==configNe.TPCONTROLLER[ItemIndex].name){
                        configNe.neCofig[m].TE.connList[na].name=0;
                        break;
                    }
                }
                console.log(configNe.neCofig[m].TE);
                createTbody(configNe.neCofig[m].prot,"traditionalGraphic")
            }
        }
    }
    configNe.TPCONTROLLER.splice(ItemIndex,1);
    postMyData();
    var tempdialog = dialog.getCurrent();
    if(tempdialog != undefined){
        tempdialog.close();
    }
    crateTableController("controllerGraphic")

})
function postMyData(){
    var tempData = {
        'content':JSON.stringify(configNe),
        'filename':'/oms1350/web/eqm/omc_all/data/7_13_1/Neconfig.json'}
    $.post(cgi_path, tempData, function(resp) {
        $('#wait_save_eth').hide();
        if(resp == 'success') {
            // showTItle("DLGsuccess","提示");
            setTimeout(function(){
                var tempdialog = dialog.getCurrent();
                if(tempdialog != undefined){
                    tempdialog.close();
                }
                getlistName();
            },1000)

        } else {
            alert('保存失败');
        }
//                window.location.reload();
    }).error(function(){
        $('#wait_save_eth').hide();
        alert("连接服务器失败!");
    });


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
                "prot":""
            }
            console.log(data)

            for(var i in configNe.neCofig){
                if(configNe.neCofig[i].name==data.name){
                    data.RSVP=configNe.neCofig[i].RSVP
                    data.OSPF=configNe.neCofig[i].OSPF
                    data.TE=configNe.neCofig[i].TE
                    data.LMP=configNe.neCofig[i].LMP
                    data.prot=configNe.neCofig[i].prot;

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
            console.log(data)
            for(var i in configNe.neCofig){
                if(configNe.neCofig[i].name==fixID){
                    data.RSVP=configNe.neCofig[i].RSVP
                    data.OSPF=configNe.neCofig[i].OSPF
                    data.TE=configNe.neCofig[i].TE
                    data.LMP=configNe.neCofig[i].LMP
                    data.prot=configNe.neCofig[i].prot;
                    configNe.neCofig[i]=data;
                }
            }
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
        'filename':'/oms1350/web/eqm/omc_all/data/13_2/znSPCE.json'}
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


$(".Config>li").eq(0).find("div").css("display","block")
$(".Config>li").eq(0).addClass("actives")
$(".Config>li").click(function(e) {
    $(".Config>li").each(function(){
        $(this).find(".tablop").css("display","none")
        $(this).removeClass("actives")
    })
    $(this).find("div").css("display","block")
    $(this).addClass("actives")
    $(".Configs>li").find("div").css("display","none");
    $(".Configs>li").eq(0).find("div").css("display","block")
    /*$('#rockContent').css("display","none");*/
})

$(".Configs>li").find("div").css("display","none");
$(".Configs>li").eq(0).find("div").css("display","block")
$(".Configs>li").eq(0).addClass("actives")
$(".Configs>li").click(function(e) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    $(".Configs>li").each(function(){
        $(this).find("div").css("display","none")
        $(this).removeClass("actives")
    })
    $(this).find("div").css("display","block")
    $(this).addClass("actives");
    $('#rockContent').css("display","none");
})



$(".creatCofig").click(function(){
    showTItle("NEconfigDlgs","平面配置")
    pageStaus="create";
    $(".NEcofigIPs").val("")
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
    $(this).siblings().addClass("defaultTab");
    $(this).removeClass("defaultTab").addClass("activeTab")
    childDom.css("display","none");
    childDom.eq(ind).css("display","block");
})
function ODInt(){
    $(".tabCount").eq(0).css("display","block");
    $("#handSetTab>li").eq(0).addClass("activeTab")
}
ODInt();
$(".IPtest").focus(function(){
    $(this).css("border-bottom","1px solid #ccc");
})
//user
$(".use").on("click", function (e) {
    var neObj=null
    showTItle("ConfrimDlg","是否应用?")
    for(var i in configNe.neCofig){
        if(configNe.neCofig[i].name==$(".neList").val()){
            neObj=configNe.neCofig[i];
            break;
        }
    }
    var ipTest=/^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/;
    switch(autoType){
        case"RSVP":
            pageStaus="RSVP"
            RSVP();
            break;
        case "OSPF":OSPF();
            pageStaus="OSPF"
            break;
        case"LMP":LMP();
            pageStaus="LMP"
            break;
        case"TE":TE();
            pageStaus="TE"
            break;
    }
    function RSVP(){
        if(ipTest.test($("#rsvp_address").val())){
            $("input#rsvp_address").css("border-bottom","1px solid #ccc")
            neObj.name=$(".neList").val()
            neObj.RSVP.IP=$("#rsvp_address").val();
            neObj.RSVP.httpID=$("#rsvp_treaty").val();
            neObj.RSVP.packageStyle=$("#rsvp_encapsulation").val()
            neObj.RSVP.status=$("#revp_state").val();
            console.log(neObj)
            configNe=getDatas(neObj);
        }else{
            $("input#rsvp_address").css("border-bottom","1px solid red")
        }
    }
    function OSPF(){
        if(ipTest.test($("#ospf_address").val())){
            $("input#ospf_address").css("border-bottom","1px solid #ccc")
            neObj.name=$(".neList").val()
            neObj.OSPF.IP=$("#ospf_address").val();
            neObj.OSPF.httpID=$("#ospf_treaty").val();
            neObj.OSPF.packageStyle=$("#ospf_encapsulation").val()
            neObj.OSPF.status=$("#ospf_state").val()
            neObj.OSPF.constraint=$("#ospf_constraint").val()
            configNe=getDatas(neObj);
        }else{
            $("input#ospf_address").css("border-bottom","1px solid red")
        }
    }
    function LMP(){
        neObj.name=$(".neList").val()
        neObj.LMP.httpID=$("#lmp_treaty").val();
        neObj.LMP.port=$("#lmp_port").val();
        neObj.LMP.findStatus=$("#autoFind").val();
        console.log("neObj")
        console.log(neObj)
        configNe=getDatas(neObj);
    }
    function TE(){
        var arry=[];
        $('input:checkbox').each(function() {
            if ($(this).attr('checked')=="checked" && $(this).val()!="on") {
                arry.push($(this).val())
            }
        });

        neObj.TE.name=$(".TENe").val();
        neObj.TE.prot=$("#TEPROT").val();
        for(var i in arry){
            var data={
                name:arry[i]
            }
            neObj.TE.connList.push(data)
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
    showTItle("handSet","自动配置",0.7);
    var htmls="";
    for(var i in configNe.neCofig){
        htmls+="<option value='"+configNe.neCofig[i].name+"'>"+configNe.neCofig[i].name+"</option>"
    }
    $(".neList").html(htmls)
    $(".TENe").html(htmls);
    $(".TENe").change();
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

    for(var t in configNe.neCofig){
        if(configNe.neCofig[t].name==neID){
            var connArry=configNe.neCofig[t].TE.connList;;
            for(var r in connArry){
                if(connArry[r].name==ConnName){
                    connArry.splice(r,1);
                    configNe.neCofig[t].TE.connList=connArry;
                }
            }
        }
    }
    console.log(configNe)
    postData(configNe);

    var Connk="";
    for(var t in configNe.neCofig){
        if(configNe.neCofig[t].name==neID){
            Connk=configNe.neCofig[t].TE
        }
    }



    var loops="";
    for(var p in Connk.connList){
        loops+="<tr>" +
            "<td style='width: 100px;border: 1px solid #cac1c1' class='leftTable'>"+Connk.connList[p].name+"</td>" +
            "<td><button list='"+Connk.connList[p].name+"' neid='"+Connk.id+"'  onclick='DELectConn(event)' class='PGBtnStyle'>删除</button></td>" +
            "</tr>"
    }
    console.log(loops);
    $("#TEcheck").html(loops);
}

var showTP=function(event){
    var val=$(event.target).attr("vals")
    alert(val);
}


//topo
function getJSON(type, url, callback) {
    $.ajax({
        type: type,
        url: url,
        dataType: "json",
        success: function (data) {
            callback(data)
        },
        error: function (data) {
            console.log(data)
        }
    })
}
var topoData;
function initTopo(data){
    topoData ="";
    topoData = data;
    renderShow.init(topoData)
}
getJSON('get', server_path+'/oms1350/web/eqm/omc_all/data/13_2/cp1.json', initTopo);
//TOPO RENDER
var canvas = document.getElementById("rockCanvas");
var content = document.getElementById("rockContent");
var ctx = canvas.getContext("2d");
var divEle = document.getElementById('rockView');
var divEleW = divEle.offsetWidth;
var divEleH = $(window).width();
var drawNEList = [];
var drawConnectionList = [];

canvas.width = divEleW*0.9;
canvas.height = divEleH* 0.40;

var renderShow = {
    init: function (msg) {
        this.clearCanvas();
        this.getData(msg);
        this.drawNe();
        this.drawConnection();
    },
    clearCanvas: function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    getData: function (msg) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.data = msg;
    },
    drawNe: function () {
        for (var a in this.data.NE) {
            var item = this.data.NE[a];
            var drawNeEle = new drawNE(item.x, item.y, item.w, item.h, item.neIcon, item.userLabel, item.alarmState)
            drawNEList.push(drawNeEle)
        }
    },
    drawConnection: function () {
        for (var a in this.data.connection) {
            var item = this.data.connection[a];
            var connA;
            var connZ;
            for (var b in this.data.NE) {
                var neItem = this.data.NE[b];
                if (item.connA.neId == neItem.neId) {
                    connA = neItem;
                } else if (item.connZ.neId == neItem.neId) {
                    connZ = neItem;
                }
            }
            var darwConnEle = new drawConnection(connA.x, connA.y, connA.w, connA.h, connZ.x, connZ.y, connZ.w, connZ.h, item.alarmState, item.userLabel, item.connType, item.id);
            drawConnectionList.push(darwConnEle);
        }
    }

}
function drawNE(x, y, w, h, img, userLabel, alarmState) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.userLabel = userLabel;
    this.alarmState = alarmState;

    this.image = new Image();
    this.image.src = img;
    var image = this.image;
    this.image.onload = function () {
        ctx.drawImage(image, x, y, w, h);
    };
    var alarmX = x + w / 2;
    var alarmY = y - h / 2 + 30;
    var x1 = alarmX;
    var y1 = alarmY - 12;
    var x2 = alarmX - 14;
    var y2 = alarmY + 12;
    var x3 = alarmX + 14;
    var y3 = alarmY + 12;
    var draw = function (alarmColor) {
        ctx.clearRect(alarmX - 14, alarmY - 12, 28, 24);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.fillStyle = alarmColor;
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.font = "6px Arial";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText("!", alarmX, alarmY - 4);
    }
    if (alarmState == "CRITICAL") {
        draw("#D9534F")
    } else if (alarmState == "MAJOR") {
        draw("#F0AD4E")
    } else if (alarmState == "MINOR") {
        draw("#E5DF0A")
    } else if (alarmState == "WARNING") {
        draw("#DF09B1")
    } else if (alarmState == "INDETERMINATE") {
        draw("#31B0D5")
    } else if (alarmState == "CLEARED") {
        draw("#009139")
    }
    ;

    var textX = x + w / 2;
    var textY = y + h + 10;
    ctx.fillStyle = "black";
    ctx.font = "4px Arial";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(userLabel, textX, textY);
    this.handleClick = function (X, Y, eventType) {
        if (eventType === 'click') {
            if (X > x && X < x + w && Y > y && Y < y + h) {
                alert(1)
            }
        }
        ctx.drawImage(image, this.x, this.y, this.w, this.h);
    };
}

function drawConnection(connAx, connAy, connAw, connAh, connZx, connZy, connZw, connZh, alarmState, userLabel, connType, id) {
    this.connAx = connAx;
    this.connAy = connAy;
    this.connZx = connZx;
    this.connZy = connZy;
    this.connAw = connAw;
    this.connAh = connAh;
    this.connZw = connZw;
    this.connZh = connZh;
    this.alarmState = alarmState;
    this.userLabel = userLabel;
    this.connType = connType;
    this.id = id;
    var X = 0, Y = 0;
    var newConnAx = 0, newConnAy = 0, newConnZx = 0, newConnZy = 0;
    if (this.connAx == this.connZx && this.connAy != this.connZy) {
        if(this.connAx < 200){
            if(this.connAy < this.connZy){
                newConnAx = this.connAx + this.connAw
                newConnAy = this.connAy + this.connAh
                newConnZx = this.connZx + this.connZw
                newConnZy = this.connZy
            }else{
                newConnAx = this.connAx + this.connAw
                newConnAy = this.connAy
                newConnZx = this.connZx + this.connZw
                newConnZy = this.connZy + this.connZh
            }
        }else{
            if(this.connAy < this.connZy){
                newConnAx = this.connAx
                newConnAy = this.connAy + this.connAh
                newConnZx = this.connZx
                newConnZy = this.connZy
            }else{
                newConnAx = this.connAx
                newConnAy = this.connAy
                newConnZx = this.connZx
                newConnZy = this.connZy +  this.connZh
            }
        }
        X = newConnAx
        Y = Math.abs(newConnAy - newConnZy) / 2 + (this.connAy < this.connZy ? this.connAy + this.connAh : this.connZy + this.connZh)
    }
    if (this.connAy == this.connZy && this.connAx != this.connZx) {
        if(this.connAy < 100){
            if(this.connAx < this.connZx){
                newConnAx = this.connAx + this.connAw
                newConnAy = this.connAy + this.connAh
                newConnZx = this.connZx
                newConnZy = this.connZy + this.connAh
            }else{
                newConnAx = this.connAx
                newConnAy = this.connAy + this.connAh
                newConnZx = this.connZx + this.connAw
                newConnZy = this.connZy + this.connAh
            }
        }else{
            if(this.connAx < this.connZx){
                newConnAx = this.connAx + this.connAw
                newConnAy = this.connAy
                newConnZx = this.connZx
                newConnZy = this.connZy
            }else{
                newConnAx = this.connAx
                newConnAy = this.connAy
                newConnZx = this.connZx + this.connZw
                newConnZy = this.connZy
            }

        }

        X = Math.abs(newConnAx - newConnZx) / 2 + (this.connAx < this.connZx ? this.connAx + this.connAw : this.connZx + this.connZw)
        Y = newConnAy
    }
    if (this.connAx > this.connZx && this.connAy > this.connZy) {
        newConnAx = this.connAx
        newConnAy = this.connAy
        newConnZx = this.connZx + this.connZw
        newConnZy = this.connZy + this.connZh
        X = Math.abs(this.connAx - this.connZx - this.connZw) / 2 + this.connZx + this.connZw - Math.abs(this.connAx - this.connZx - this.connZw) * 0.2
        Y = Math.abs(this.connAy - this.connZy - this.connZh) / 2 + this.connZy + this.connZh - Math.abs(this.connAy - this.connZy - this.connZh) * 0.2
    }
    if (this.connAx < this.connZx && this.connAy < this.connZy) {
        newConnAx = this.connAx + this.connAw
        newConnAy = this.connAy + this.connAh
        newConnZx = this.connZx
        newConnZy = this.connZy
        X = Math.abs(this.connZx - this.connAx - this.connAw) / 2 + this.connAx + this.connAw - Math.abs(this.connZx - this.connAx - this.connAw) * 0.2
        Y = Math.abs(this.connZy - this.connAy - this.connAh) / 2 + this.connAy + this.connAh - Math.abs(this.connZy - this.connAy - this.connAh) * 0.2
    }
    if (this.connAx < this.connZx && this.connAy > this.connZy) {
        newConnAx = this.connAx + this.connAw
        newConnAy = this.connAy
        newConnZx = this.connZx
        newConnZy = this.connZy + this.connZh
        X = Math.abs(newConnAx - newConnZx) / 2 + this.connAx + this.connAw  + Math.abs(newConnAx - newConnZx) * 0.2
        Y = Math.abs(newConnAy - newConnZy) / 2 + this.connZy + this.connZh - Math.abs(newConnAy - newConnZy) * 0.2
    }
    if (this.connAx > this.connZx && this.connAy < this.connZy) {
        newConnAx = this.connAx
        newConnAy = this.connAy + this.connAh
        newConnZx = this.connZx + this.connZw
        newConnZy = this.connZy
        X = Math.abs(this.connAx - this.connZx - this.connZw) / 2 + this.connZx + this.connZw + Math.abs(this.connAx - this.connZx - this.connZw) * 0.2
        Y = Math.abs(this.connZy - this.connAy - this.connAh) / 2 + this.connAy + this.connAh - Math.abs(this.connZy - this.connAy - this.connAh) * 0.2
    }
    if (this.connType == "noopsycheConfig") {
        ctx.beginPath();
        ctx.moveTo(newConnAx, newConnAy);
        ctx.lineTo(newConnZx, newConnZy);
        ctx.lineWidth=3;
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();
    } else if (this.connType == "noopsycheConnection") {
        var centerX = 0, centerY = 0
        if (this.connAy == this.connZy && this.connAx != this.connZx) {
            centerX = Math.abs(newConnAx - newConnZx) / 2 + (this.connAx > this.connZx ? -this.connZx : this.connAx + this.connAw)
            centerY = newConnAy + 100
            X = centerX
            Y = centerY - 50
        }
        if (this.connAx == this.connZx && this.connAy != this.connZy) {
            centerX = newConnAx + 100
            centerY = Math.abs(newConnAy - newConnZy) / 2 + (this.connAy < this.connZy ? this.connAy + this.connAh : this.connZy + this.connZh)
            X = centerX - 50
            Y = centerY
        }
        if (this.connAx < this.connZx && this.connAy < this.connZy) {
            centerX = Math.abs(newConnAx - newConnZx) / 2 + 100 + this.connAx + this.connAw
            centerY = Math.abs(newConnAy - newConnZy) / 2 - 100 + this.connAy + this.connAh
            X = centerX - 50
            Y = centerY + 50
        }
        if (this.connAx > this.connZx && this.connAy > this.connZy) {
            centerX = Math.abs(newConnAx - newConnZx) / 2 + 100 + this.connZx + this.connZw
            centerY = Math.abs(newConnAy - newConnZy) / 2 - 100 + this.connZy + this.connZh
            X = centerX - 50
            Y = centerY + 50
        }
        if (this.connAx > this.connZx && this.connAy < this.connZy) {
            centerX = Math.abs(newConnAx - newConnZx) / 2 - 100 + this.connZx + this.connZw
            centerY = Math.abs(newConnAy - newConnZy) / 2 + 100 + this.connAy + this.connAh
            X = centerX + 50
            Y = centerY - 50
        }
        if (this.connAx < this.connZx && this.connAy > this.connZy) {
            centerX = Math.abs(newConnAx - newConnZx) / 2 - 100 + this.connAx + this.connAw
            centerY = Math.abs(newConnAy - newConnZy) / 2 - 100 + this.connZy + this.connZh
            X = centerX + 50
            Y = centerY + 50
        }
        ctx.beginPath();
        ctx.moveTo(newConnAx, newConnAy);
        ctx.quadraticCurveTo(centerX, centerY, newConnZx, newConnZy);
        ctx.lineWidth=3;
        ctx.strokeStyle = "#124191";
        ctx.stroke();
        ctx.closePath();
    }
    if (alarmState == "CRITICAL") {
        drawX(X, Y, "#D9534F")
    } else if (alarmState == "MAJOR") {
        drawX(X, Y, "#F0AD4E")
    } else if (alarmState == "MINOR") {
        drawX(X, Y, "#E5DF0A")
    } else if (alarmState == "WARNING") {
        drawX(X, Y, "#DF09B1")
    } else if (alarmState == "INDETERMINATE") {
        drawX(X, Y, "#31B0D5")
    }


    this.handleClick = function (X, Y, eventType) {
        if (eventType == "click") {
            if (this.connType == "noopsycheConfig") {
                ctx.beginPath();
                ctx.moveTo(newConnAx, newConnAy);
                ctx.lineTo(newConnZx, newConnZy);
                if (ctx.isPointInPath(X, Y) == 1 || ctx.isPointInPath(X, Y) == true || ctx.isPointInPath(X, Y)) {
                    ctx.strokeStyle = "red";
                    ctx.stroke();
                    return true
                }
                ctx.closePath();
            } else if (this.connType == "noopsycheConnection") {
                ctx.beginPath();
                ctx.moveTo(newConnAx, newConnAy);
                ctx.quadraticCurveTo(centerX, centerY, newConnZx, newConnZy);
                if (ctx.isPointInPath(X, Y) == 1 || ctx.isPointInPath(X, Y) == true || ctx.isPointInPath(X, Y)) {
                    ctx.strokeStyle = "red";
                    ctx.stroke();
                    return true
                }
                ctx.closePath();
            }
        }
    }
}
function drawX(X, Y, alarmColor) {
    var x1 = X - 10;
    var y1 = Y - 10;
    var x2 = X + 10;
    var y2 = Y - 10;
    var x3 = X - 10;
    var y3 = Y + 10;
    var x4 = X + 10;
    var y4 = Y + 10;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x4, y4);
    ctx.strokeStyle = alarmColor;
    ctx.stroke();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.strokeStyle = alarmColor;
    ctx.stroke();
    ctx.closePath();
}

canvas.addEventListener("click", function () {
    var X = event.clientX - canvas.getBoundingClientRect().left;
    var Y = event.clientY - canvas.getBoundingClientRect().top;
    for (var i = 0; i < drawNEList.length; ++i) {
        if (drawNEList[i].handleClick(X, Y, "click")) {
            return;
        }
    }
})
canvas.addEventListener("click", function () {
    var X = event.clientX - canvas.getBoundingClientRect().left;
    var Y = event.clientY - canvas.getBoundingClientRect().top;
    console.log(X)
    console.log(Y)
    for (var i = 0; i < drawConnectionList.length; ++i) {
        if (drawConnectionList[i].handleClick(X, Y, "click")) {
            return;
        }
    }

})


function showTopo(){
    $("#rockContent").css("display","block")
    getJSON('get', server_path+'/oms1350/web/eqm/omc_all/data/13_2/cp1.json', initTopo);
    /*   $('#content').show();*/
    showTItle("content","",0.9)
}


$(".colstop").click(function(){
    var tempdialog = dialog.getCurrent();
    if(tempdialog != undefined){
        tempdialog.close();
    }
})

