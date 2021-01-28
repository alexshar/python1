
 $(document).ready(function () {
    var per_url= "https://135.251.96.98:8443/oms1350/web/eqm/omc_all/data/8_3_1/multimethodpathcalculation.json";
     var status_url= "https://135.251.96.98:8443/oms1350/web/eqm/omc_all/data/8_3_1/status/test.json";
     var srarus_filename="/oms1350/web/eqm/omc_all/data/8_3_1/status/test.json";
     var url = "https://135.251.96.98:8443/cgi-bin/test.cgi";
    var myData = {
        "id":"",
        "serverName": "",
        "serverType": "",
        "template": "",
        "protected": "",
        "serviceRate": "",
        "status":false,
        "createStatus":"",
        "isSet":true,
        "serverStatusName":"",
        "delay":"",
        "path":"",
        "pathNum":-1,
        "startTime":0,
        "stopTime":0,
        "Apoint":{
            "userLabel":"",
            "id":"",
            "x":100,
            "y":300,
            "w": 50,
            "h": 40,
            "url": "https://135.251.96.98:8443/oms1350/web/eqm/omc_all/pic/icon2.svg"
        },
        "Zpoint":{
            "userLabel":"",
            "id":"",
            "x":400,
            "y":300,
            "w": 50,
            "h": 40,
            "url": "https://135.251.96.98:8443/oms1350/web/eqm/omc_all/pic/icon2.svg"
        },
        "params": {
            "groupId": "",
            "routeStrategy":"",
            "recoverPattern": "",
            "dissServer": "",
            "sourceSlotTime": "",
            "targetSlotTime": "",
            "modulation": "",
            "phaseCode": "",
            "waveform": ""
        }
    }
    var connTp={
            "Apoint":{
                "id":"",
            },
            "Zpoint":{
                "id":"",
            },
            "mulState":false,
            "showLine":true,
            "connUserLabel":""
        }
    var routeCofMap={
        "showroute":false,
        "node":"",
        "rejectNode":"",
        "path":"",
        "rejectPath":""
    };
     var serverStatus={
         "id":"",
         "userLabel":"",
         "statusName":""
     }
    var tpConn = [];
    var $tpDom=$(".tpList");
    var pointList="";
     var $routeStrategy="最小时延";
     var $serverType="OTN";
     var $delay=[];
     var $path="";
     var $pathNum=-1;
     var serverStatusData=[];
     //get point json
     var TPDATA="",SERVER="",jsonData="",NE="",NODE="",LINK="";
     function getTP(){
         $.getJSON(per_url,function(data){
             initData(data)
         });
     }
     function getCreateStatus(){
         $.getJSON(status_url,function(data){
             serverStatusData=data;
             setCreateStatus(serverStatusData)
         })
     }
     function setCreateStatus(data){
         if(jsonData.SERVER==undefined ||jsonData.SERVER.length==0){return}
         var $SERVER_STATUS=data.SERVER_STATUS;
         var statusStr="";
         for(var s in $SERVER_STATUS){
             for(var t in jsonData.SERVER){
                 if(jsonData.SERVER[t].id==$SERVER_STATUS[s].id){
                     statusStr=$SERVER_STATUS[s].statusName;
                     if(statusStr !=""){
                         $("#serverTable").find("tr").eq(t).find("td").eq(3).html(statusStr);
                         // jsonData.SERVER[t].isSet=true;
                         jsonData.SERVER[t].serverStatusName=statusStr;
                     }

                 }
             }
         }
     }
     getTP();
     function initData(data){
         TPDATA=data["NE-TP"];
         jsonData=data;
         SERVER=data.SERVER;
         NE=data.NE;
         showRoute(data.NEtopo,data.NEconn);
         setTPList($tpDom,TPDATA);
         setSelect($(".choseNeName"),NE)
         getTpByNe(data.NE[0].id);
         NODE=data.NODE;
         LINK=data.LINK;
         routeConf.init($(".node"),NODE);
         routeConf.init($(".rejectNode"),NODE);
         routeConf.init($(".path"),LINK);
         routeConf.init($(".rejectPath"),LINK);
         serverInit($("#serverTable"),SERVER)
         // setTPList($tpDom,data.TP);
     }
     var deTime=setTimeout(function(){
         // var time =(new Date).getTime();
         // var statusStr="";
         //get create Status
         getCreateStatus();
         // for(var t in jsonData.SERVER){
         //     if(jsonData.SERVER[t].isSet){
         //         return;
         //     }
         //     if(jsonData.SERVER[t].startTime==0 || jsonData.SERVER[t].stopTime==0){
         //         if(data[t].status){
         //             statusStr="已投入服务";
         //         }else{
         //             statusStr="未投入服务";
         //         }
         //     }else{
         //         if(time<jsonData.SERVER[t].startTime){
         //             statusStr="已预约";
         //         }else if(time>jsonData.SERVER[t].startTime && time<jsonData.SERVER[t].stopTime){
         //             statusStr="已投入服务";
         //         }else{
         //             statusStr="预约结束";
         //         }
         //     }
         //     $("#serverTable").find("tr").eq(t).find("td").eq(3).html(statusStr)
         // }
         setTimeout(arguments.callee,5000)
     },5000);
     function serverInit(dom,data){
         dom.html("");
         var tr="";
         var statusStr="";
         var time=(new Date).getTime();
         //get create Status
         getCreateStatus();
         for(var t in data){
             statusStr=jsonData.SERVER[t].serverStatusName;
             tr+="<tr id='server_"+data[t].id+"'><td><input class='serverCheckBox' type='checkbox' value='"+t+"'></td>";
             tr+="<td>"+data[t].serverName+"</td>";
             tr+="<td>"+data[t].serverType+"</td>";
             tr+="<td>"+statusStr+"</td>";
             tr+="<td>"+data[t].path+"</td>";
             if(data[t].delay.length==1){
                 tr+="<td>"+data[t].delay+"</td>";
             }else{
                 tr+="<td>"+data[t].delay[0]+"<br/>"+data[t].delay[1]+"</td>";
             }
             tr+="<td>" +
                 "<button  class='activate_item' data-id='"+data[t].pathNum+"'>激活</button>" +
                 "<button  class='activateNo_item' data-id='"+data[t].pathNum+"'>去激活</button>" +
                 "<button  class='deleteServer'>删除</button>" +
                 "<button class='routeUpdate' data-id='"+data[t].pathNum+"'>调整策略</button>"+
                 "</td>";
             tr+="</tr>";
         }
         dom.append(tr);
     }
     //server ctl
     var $deleteId=null;
     var $showId=null;
     $("#serverTable").on("click","tr",function(event){
         var ev=event||window.event
         $deleteId=$(this).attr("id").substr(7)
         var $inx=$(this).index();
         var $type=$(ev.target).attr("class")
         if($type=="activate_item" ||$type== "activateNo_item" || $type=="deleteServer" ||$type=="routeUpdate"){
             ev.stopPropagation();
             serverSet();
             return;
         }
         function serverSet(){
             switch ($(ev.target).attr("class")){
                 case "activate_item":
                     $showId=$(ev.target).attr("data-id")
                     showTItle("ConfrimDlgActivate","是否激活")
                     break;
                 case "activateNo_item":
                     showTItle("ConfrimDlgActivateNo","是否去激活")
                     break;
                 case "routeUpdate":
                     showTItle("routeUpdatePanel","调整策略");
                     $(".nowRoute").html(jsonData.SERVER[$inx].params.routeStrategy)
                     $(".nowProtected").html(jsonData.SERVER[$inx].protected)
                     break;
                 case "deleteServer":
                     showTItle("ConfrimDlgRemove","是否删除");
                     break
             }
         }
     })
     $(".sureRemove").on("click",function () {
         serverCtl.deleteServer($deleteId);
         var linkData = jsonData.routeLink[$showId];
         showRoute(jsonData.NEtopo,jsonData.NEconn);
         $deleteId=null;
     });
     $(".routeUpdateOk").on("click",function () {
         serverCtl.routeUpdate($deleteId);
         // var linkData = jsonData.routeLink[$showId];
         // showRoute(jsonData.NEtopo,jsonData.NEconn);
         $deleteId=null;
     });
     $(".sureActivate").on("click",function(){
         serverCtl.serverActivate($deleteId);
         var linkData = jsonData.routeLink[$showId];
         showRoute(linkData.NE,linkData.NEconn)
         $(".topo").css("display","block");
         $(".confInfo").css("display","none");
         $deleteId=null;
     })
     $(".sureActivateNo").on("click",function(){
         serverCtl.activateNo($deleteId);
         showRoute(jsonData.NEtopo,jsonData.NEconn);
         $(".topo").css("display","block");
         $(".confInfo").css("display","none");
         $deleteId=null;
     })
     $(".removeCancel,.activateCancel,.activateNoCancel").on("click",function(){
         var tempdialog = dialog.getCurrent();
         tempdialog.close();
         $deleteId=null;
     })
     var serverCtl={
         initServerList:function(dom,data){
             serverInit(dom,data)
             var time=setTimeout(function(){
                 var tempdialog = dialog.getCurrent();
                 tempdialog.close();
                 clearTimeout(time)
             },1000);
         },
         serverActivate:function(id){
             var self=this;
             for(var s in jsonData.SERVER){
                 if(jsonData.SERVER[s].id==id){
                     jsonData.SERVER[s].status=true;
                     break
                 }
             }
             serverHttp.server_post(jsonData,function(){
                 self.initServerList($("#serverTable"),jsonData.SERVER)
             })
         },
         activateNo:function(id){
             var self=this;
             for(var s in jsonData.SERVER){
                 if(jsonData.SERVER[s].id==id){
                     jsonData.SERVER[s].status=false;
                     break
                 }
             }
             serverHttp.server_post(jsonData,function(){
                 self.initServerList($("#serverTable"),jsonData.SERVER)
             })
         },
         deleteServer:function(id){
             var self=this;
             for(var s in jsonData.SERVER){
                 if(jsonData.SERVER[s].id==id){
                     jsonData.SERVER.splice(s,1)
                 }
             }
             for(var st in serverStatusData.SERVER_STATUS){
                 if(serverStatusData.SERVER_STATUS[st].id==id){
                     serverStatusData.SERVER_STATUS.splice(st,1)
                 }
             }
             serverHttp.server_post(jsonData,function(){
                 self.initServerList($("#serverTable"),jsonData.SERVER)
             })
             serverHttp.server_post(serverStatusData,function(){
                 self.initServerList($("#serverTable"),jsonData.SERVER)
             },srarus_filename)
         },
         routeUpdate:function(id){
             var self=this;
             var routeMsg=null;
             for(var i in jsonData.SERVER){
                 if(jsonData.SERVER[i].id==id){
                     jsonData.SERVER[i].protected=$("#nowProtectedChose").val();
                     routeMsg=routePathDone(
                         jsonData.SERVER[i].serverType,
                         $("#nowRouteChose").val(),
                         jsonData.SERVER[i].protected,
                         false);

                     jsonData.SERVER[i].path=routeMsg.path;
                     jsonData.SERVER[i].delay=routeMsg.delay;
                     jsonData.SERVER[i].serverStatusName="创建中";
                     for(var ts in serverStatusData.SERVER_STATUS){
                         if(serverStatusData.SERVER_STATUS[ts].id==id){
                             serverStatusData.SERVER_STATUS[ts].statusName="创建中";
                         }
                     }
                     // debugger;
                     serverHttp.server_post(jsonData,function(){
                         serverInit($("#serverTable"),jsonData.SERVER);
                         var linkData = jsonData.routeLink["l"+$pathNum];
                         showRoute(linkData.NE,linkData.NEconn)
                         setTimeout(function(){
                             var tempdialog = dialog.getCurrent();
                             tempdialog.close();
                         },2000);
                     })
                     serverHttp.server_post(serverStatusData,function(){},srarus_filename)
                     // self.initServerList($("#serverTable"),jsonData.SERVER)
                 }
             }
         },
         cleanDomData:function (dom) {
             for(var idx in dom){
                 if(dom[idx].initValue==null){
                     $("#"+dom[idx].domKey).val("")
                 }else{
                     $("#"+dom[idx].domKey).val(dom[idx].initValue)
                 }
             }
             cleanOther();
         },
         cleanDlg:function(objarr){
             var len=0
             for(var d=0;d<objarr;d++){
                 len=$("."+objarr[d]).length;
                 if(len>1){
                     for(var dx=1;dx<len;dx++){
                         $("."+objarr[d]).eq(dx).remove();
                     }
                 }
             }
         }
     }
     var serverHttp={
         server_post:function(data,fn,path){
             var template = {
                 "content": JSON.stringify(data),
                 "filename": "/oms1350/web/eqm/omc_all/data/8_3_1/multimethodpathcalculation.json"
             }
             if(path !=undefined){
                 template.filename=path;
             }
             $.post(url, template, function (resp) {
                 if (resp == "success") {
                     fn();
                 }
             }).error(function () {
                 alert("链接服务器失败");
             })
         },
         server_get:function(path,fn){
              $.getJSON(path,function(data){
                  fn(data);
             });
         }
     }
     function cleanOther(){
         $("#pointList").html("");
         choseTpList=[];
         var trLength=$(".tpList").find("tr").length;
         for(var s=0;s<trLength;s++){
             $(".tpList").find("tr").eq(s).css({background:"#fff","color":"black"})
         }
         $('#route-showroute').attr("checked",false);
         $("#route-node").attr("checked",false);
         $("#route-rejectNode").attr("checked",false);
         $("#route-path").attr("checked",false);
         $("#route-rejectPath").attr("checked",false);
         $(".node").val("");
         $(".rejectNode").val("");
         $(".path").val("");
         $(".rejectPath").val("");
         $(".confPath").css("display","none");
         myData = {
             "id":"",
             "serverName": "",
             "serverType": "",
             "template": "",
             "protected": "",
             "serviceRate": "",
             "status":false,
             "delay":[],
             "path":"",
             "pathNum":-1,
             "startTime":"",
             "stopTime":"",
             "Apoint":{
                 "userLabel":"",
                 "id":"",
                 "x":100,
                 "y":300,
                 "w": 50,
                 "h": 40,
                 "url": "https://135.251.96.98:8443/oms1350/web/eqm/omc_all/pic/icon2.svg"
             },
             "Zpoint":{
                 "userLabel":"",
                 "id":"",
                 "x":400,
                 "y":300,
                 "w": 50,
                 "h": 40,
                 "url": "https://135.251.96.98:8443/oms1350/web/eqm/omc_all/pic/icon2.svg"
             },
             "params": {
                 "groupId": "",
                 "routeStrategy":"",
                 "recoverPattern": "",
                 "dissServer": "",
                 "sourceSlotTime": "",
                 "targetSlotTime": "",
                 "modulation": "",
                 "phaseCode": "",
                 "waveform": ""
             }
         }
         var $delay=[];
         var $path="";
         var $pathNum=-1;
         var itemLen=$(".serverProgress").length;
         for(var item=1;item<itemLen;item++){
             $(".serverProgress").eq(item).find(".serverPanel").addClass("hidenPanel");;
             $(".serverProgress").eq(item).find(".serverPanel").removeClass("showPanel");
             $(".serverProgress").eq(item).find(".done-y").css("visibility","hidden");
             $(".serverProgress").eq(item).find(".done-no").css({"display":"block","background":"#ccc"});
             $(".serverProgress").eq(item).addClass("panel-undone");
             $(".serverProgress").eq(item).find(".step").attr("disabled",true);
             $(".serverProgress").eq(item).find("#protected").attr("disabled",true);
             $(".serverProgress").eq(item).find("#serviceRate").attr("disabled",true);
             $(".serverProgress").find(".conf-titile-key").html("");
             $(".serverProgress").eq(item).find(".conf-titile-key").css("display","block")
             $(".startTime").val("");
             $(".stopTime").val("");
         }
        $(".choseNeName").val("");
         $(".choseTpName").val("");
     }
     //dlg
     var dlgList=["modal-box",
         "operation",
         "chosePoit",
         "routeConfPanel",
         "confSuccess",
         "ConfrimDlgRemove",
         "ConfrimDlgActivate",
         "ConfrimDlgActivateNo",
         "appointmentPanel",
        "routeUpdatePanel",
        "confFailed"]
     serverCtl.cleanDlg(dlgList)
    var showTItle=function(id,title,widths){
        if(widths==null){
            widths=0.5;
        }
        var dialogId ="."+id+"";
        var w = $(document.body).width() * widths;
        var d = dialog({
            title: title,
            width:w,
            content: $(dialogId).eq(0)
        });
        var temp = dialog.getCurrent();
        if(temp != undefined){
            temp.close();
        }
        d.show();
    }
    //config style controller
   $(".hideMyItem").click(function(){
       var panelState=$(this).siblings(".serverPanel").hasClass("showPanel");
       if(panelState){
           $(this).siblings(".conf-titile-key").css("display","block")
           $(this).siblings(".serverPanel").removeClass("showPanel");
           $(this).siblings(".serverPanel").addClass("hidenPanel");
       }else{
           $(this).siblings(".conf-titile-key").css("display","none")
           $(this).siblings(".serverPanel").removeClass("hidenPanel");
           $(this).siblings(".serverPanel").addClass("showPanel");
       }
   });
    function stepController(obj){
        var stepNo=obj.parents(".serverProgress").next().hasClass("panel-undone");
        var panelShow= obj.parents(".serverProgress").next().find(".serverPanel").hasClass('hidenPanel');
        obj.parents(".serverProgress").find(".done").css("display","none");
        obj.parents(".serverProgress").find(".done-y").css("visibility","visible");
        if(stepNo){
            obj.parents(".serverProgress").next().removeClass('panel-undone');
            obj.parents(".serverProgress").next().find(".serverPanel").removeClass("hidenPanel");
            obj.parents(".serverProgress").next().find(".serverPanel").addClass("showPanel")
            obj.parents(".serverProgress").next().find(".done").css("background","blue");
        }
    }
    //step 1
    var setData_stepA=[
        "serverName-info",
        "serverType-info",
        "template-info",
        "groupId-info",
        "routeStrategy-info",
        "pathSeparation-info",
        "recoverPattern-info",
        "dissServer-info",
        "sourceSlotTime-info",
        "targetSlotTime-info",
        "modulation-info",
        "phaseCode-info",
        "waveform-info"
    ];
     var setData_stepB=[
         "serverName",
         "serverType",
         "template",
         "protected",
         "serviceRate",
         "groupId",
         "sourceSlotTime",
         "targetSlotTime"
     ]
     var cleanDomItem=[
         {"domKey":"serverName","initValue":null},
         {"domKey":"serverType","initValue":"OTN"},
         {"domKey":"template","initValue":"没有创建模板"},
         {"domKey":"protected","initValue":"无保护"},
         {"domKey":"serviceRate","initValue":"1Gbe:ODU0"},
         {"domKey":"groupId","initValue":null},
         {"domKey":"routeStrategy","initValue":"最小时延"},
         {"domKey":"pathSeparation","initValue":"节点分离"},
         {"domKey":"sourceSlotTime","initValue":null},
         {"domKey":"targetSlotTime","initValue":null},
         {"domKey":"recoverPattern","initValue":"自动"},
         {"domKey":"modulation","initValue":"系统已分配"}
     ]
    $(".step-one").on("click",function(){
        if(checkServer.step_one()){
            return;
        }else{
            $(this).parents(".serverProgress").next().find(".step").attr("disabled",false);
            $(this).parents(".serverProgress").next().find("#protected").attr("disabled",false);
            $(this).parents(".serverProgress").next().find("#serviceRate").attr("disabled",false);
            // $(this).parents(".serverProgress").next().find(".conf-titile-key").css("display","none");
            stepController($(this));
            var strpA_key=$("#serverName").val()+","+$("#serverType").val()
            $(this).parents(".serverProgress").find(".conf-titile-key").html(strpA_key);
            $(".confInfo-header").find("strong").html($("#serverName").val());
            setMyData.info_set_one(setData_stepA);
            stepMsg($(this));
        };
    });
    function stepMsg(obj){
            var nextDoneState=obj.parents(".serverProgress").next().find(".serverPanel").hasClass("hidenPanel");
            if(!nextDoneState){
              obj.parents(".serverProgress").next().find(".conf-titile-key").css("display","none");
            }else{
              obj.parents(".serverProgress").next().find(".conf-titile-key").css("display","block");    
            }
    }
    var setMyData={
        info_set_one:function(strSetArr){
            var keyName=""
            for(var s=0;s<strSetArr.length;s++){
                keyName=strSetArr[s].substr(0,strSetArr[s].indexOf("-"));
                $("#"+strSetArr[s]).html($("#"+keyName).val());
                if(myData[keyName] !=undefined){
                    myData[keyName]=$("#"+keyName).val();
                }else{
                    if(myData.params[keyName] !=undefined){
                        myData.params[keyName]=$("#"+keyName).val();
                    }
                }
            }
        },
        getOtherData:function(data){
            for(var o=0;o<data.length;o++){
                myData[data[o]]=$("#"+data[o]).val();
            }
        },
        clearnData:function(data,dom){
            for(var d=0;d<dom.length;d++){
                $("#"+data[o]).val("");
                myData[data[o]]=""
            }
        },
        deepcopy:function(obj) {
            var out = [],i = 0,len = obj.length;
            for (; i < len; i++) {
                if (obj[i] instanceof Array){
                    out[i] = deepcopy(obj[i]);
                }
                else out[i] = obj[i];
            }
            return out;
        }
    }
    $(".addAttribute-ok").on("click",function(){
        setMyData.info_set_one(setData_stepA);
        $(".modal-box").css("display","none")
    })
    // step 2
    $(".step-two").on("click",function(){
        $(this).parents(".serverProgress").find(".conf-titile-key").html(choseTpList.length+"端口(s)");
        var unDoneState=$(this).parents(".serverProgress").hasClass("panel-undone");
        if(!unDoneState){
            if(choseTpList.length !=2){
                showTItle("operation","提示");
                return;
            }
            myData.Apoint.userLabel=pointList[0].userLabel;
            myData.Apoint.id=pointList[0].id
            myData.Zpoint.userLabel=pointList[1].userLabel;
            myData.Zpoint.id=pointList[1].id
            $(this).parents(".serverProgress").next().find(".step").attr("disabled",false);
            stepController($(this))
        }else{
            $(this).parents(".serverProgress").next().find(".step").attr("disabled",true);
            $(this).attr("disabled",true);
        }
      stepMsg($(this));
    });
    // step 3
    $(".step-three").on("click",function(){
        stepMsg($(this));
        var unDoneState=$(this).parents(".serverProgress").hasClass("panel-undone");
        if(!unDoneState){
            stepController($(this))
            $(this).parents(".serverProgress").next().find(".step").attr("disabled",false);
        }else{
            $(this).parents(".serverProgress").next().find(".step").attr("disabled",true);
        }
        routeConf.routeDone();
    });
     var routeConf={
         init:function(dom,data){
             dom.empty();
             dom.html("<option value=''></option>")
             var option="";
             for(var d in data){
                 option+="<option value='"+data[d].id+"'>"+data[d].userLabel+"</option>";
             }
             dom.append(option);
         },
         setData:function(dom,data,id){
             dom.empty();
             dom.html("<option value=''></option>");
             var option="";
             for(var d in data){
                 if(data[d].id!=id){
                     option+="<option value='"+data[d].id+"'>"+data[d].userLabel+"</option>";
                 }
             }
             dom.append(option);
         },
         routeDone:function(){
             routeCofMap.showroute=$(".showroute").val();
             routeCofMap.node=$(".node").val();
             routeCofMap.rejectNode=$(".routeCofMap").val();
             routeCofMap.path=$(".path").val();
             routeCofMap.rejectPath=$(".rejectPath").val();
             var tempdialog = dialog.getCurrent();
             tempdialog.close();
             pathSpeculate();
         }
     }
     $("#route-showroute").on("click",function(){
         if($("#route-showroute").is(':checked')){
             $(this).parents(".routeChoseItem").siblings().find("input[type='checkbox']").attr("disabled",false)
         }else {
             $(this).parents(".routeChoseItem").siblings().find("input[type='checkbox']").attr("disabled",true)
             $(this).parents(".routeChoseItem").siblings().find("input[type='checkbox']").attr("checked",false);
             $(".routeConfItem").find("select").attr("disabled",true)
             $(".routeConfItem").find("select").val("");
         }
     })
     $(".routeConfItemSet").find("input[type='checkbox']").on("click",function(){
        var idx=$(this).parents(".routeConfItemSet").index();
        if($(this).is(':checked')){
            $(".routeConfItem").eq(idx).find("select").attr("disabled",false)
        }else{
            $(".routeConfItem").eq(idx).find("select").attr("disabled",true)
            $(".routeConfItem").eq(idx).find("select").val("");
        }

     })
    $(".node").on("change",function(){
        if($(".rejectNode").val() =="" ||$(".rejectNode").val()==$(this).val()){
            routeConf.setData($(".rejectNode"),NODE,$(this).val())
        }
    });
     $(".rejectNode").on("change",function(){
         if($(".node").val() =="" ||$(this).val()==$(".node").val()){
             routeConf.setData($(".node"),NODE,$(this).val());
         }
     })
     $(".path").on("change",function(){
         if($(".rejectPath").val() =="" ||$(".rejectPath").val()==$(this).val()){
             routeConf.setData($(".rejectPath"),LINK,$(this).val())
         }
     });
     $(".rejectPath").on("change",function(){
         if($(".path").val() =="" ||$(this).val()==$(".path").val()){
             routeConf.setData($(".path"),LINK,$(this).val());
         }
     })
    $(".route-ok").on("click",function () {
        routeConf.routeDone();
    });
    function pathSpeculate(){
            $routeStrategy=$("#routeStrategy").val();
            $serverType=$("#serverType").val();
        var $protected=$("#protected").val();
        var $routeShowroute=$("#route-showroute").is(':checked');
        var $rejectPath=$(".rejectPath").val();
        routePathDone($serverType,$routeStrategy,$protected,$routeShowroute,"routeConf")
   }
   function routePathDone($serverType,$routeStrategy,$protected,$routeShowroute,state){
        ;
       var $dom="";
      // var $pathSeparation=$("#pathSeparation").val();
       if($serverType=="OTN"){
           if($routeStrategy=="最小跳数") {
               if (!$routeShowroute) {
                   switch ($protected) {
                       case "无保护":
                           $(".delay").css("visibility", "visible");
                           $path = "OCS1#OCS -- OCS2#OCS";
                           $delay = ["297us"];
                           $(".delay").html("296us");
                           $pathNum = 1;
                           break;
                       case "静态1+1保护":
                           $(".delay").css("visibility", "hidden");
                           $path = "OCS1#OCS – OCS2#OCS (工作)<br/>";
                           $path += " OCS1#OCS – OCS3#OCS - OCS2#OCS （保护）";
                           $dom = "<br/>OCS1#OCS – OCS2#OCS （工作）<span style='margin-left: 10px'>296us</span><br/>"
                           $dom += " OCS1#OCS – OCS3#OCS - OCS2#OCS （保护）<span style='margin-left: 10px'>216us</span>"
                           $delay = ["297us", "217us"];
                           $pathNum = 2;
                           break;
                       case "1+1重路由保护":
                           $(".delay").css("visibility", "hidden");
                           $path = "OCS1#OCS – OCS2#OCS (工作)<br/>";
                           $path += " OCS1#OCS – OCS3#OCS - OCS2#OCS （保护）";
                           $dom = "<br/>OCS1#OCS – OCS2#OCS （工作）<span style='margin-left: 10px'>296us</span><br/>"
                           $dom += " OCS1#OCS – OCS3#OCS - OCS2#OCS （保护）<span style='margin-left: 10px'>216us</span>"
                           $delay = ["297us", "217us"];
                           $pathNum = 8;
                           break;
                       case "永久1+1保护":
                           $(".delay").css("visibility", "hidden");
                           $path = "OCS1#OCS – OCS2#OCS (工作)<br/>";
                           $path += " OCS1#OCS – OCS3#OCS - OCS2#OCS （保护）";
                           $dom = "<br/>OCS1#OCS – OCS2#OCS （工作）<span style='margin-left: 10px'>296us</span><br/>"
                           $dom += " OCS1#OCS – OCS3#OCS - OCS2#OCS （保护）<span style='margin-left: 10px'>216us</span>"
                           $delay = ["297us", "217us"];
                           $pathNum = 9;
                           break;
                   }
               } else if (routeCofMap.node == "d3") {
                   $(".delay").css("visibility", "visible");
                   $path = " OCS1#OCS -- OCS4#OCS -- OCS2#OCS";
                   $delay = ["240us"];
                   $(".delay").html("238us");
                   $pathNum = 3;
               }
           }
           else if($routeStrategy=="最小链路代价"){
                 if(!$routeShowroute){
                        switch ($protected){
                            case "无保护":
                                $(".delay").css("visibility", "visible");
                                $path = " OCS1#OCS -- OCS2#OCS";
                                $delay = ["297us"];
                                $(".delay").html("296us");
                                $pathNum = 1;
                                break;
                            case "静态1+1保护":
                                $(".delay").css("visibility","hidden");
                                $path="OCS1#OCS – OCS2#OCS (工作)<br/>";
                                $path+=" OCS1#OCS – OCS3#OCS - OCS2#OCS （保护）";
                                $dom="<br/>OCS1#OCS – OCS2#OCS （工作）<span style='margin-left: 10px'>296us</span><br/>"
                                $dom+=" OCS1#OCS – OCS3#OCS - OCS2#OCS （保护）<span style='margin-left: 10px'>216us</span>"
                                $delay=["297us","217us"];
                                $pathNum=10;
                                break;
                            case "1+1重路由保护":
                                $(".delay").css("visibility","hidden");
                                $path="OCS1#OCS – OCS2#OCS (工作)<br/>";
                                $path+=" OCS1#OCS – OCS3#OCS - OCS2#OCS （保护）";
                                $dom="<br/>OCS1#OCS – OCS2#OCS （工作）<span style='margin-left: 10px'>296us</span><br/>"
                                $dom+=" OCS1#OCS – OCS3#OCS - OCS2#OCS （保护）<span style='margin-left: 10px'>216us</span>"
                                $delay=["297us","217us"];
                                $pathNum=12;
                                break;
                            case "永久1+1保护":
                                $(".delay").css("visibility","hidden");
                                $path="OCS1#OCS – OCS2#OCS (工作)<br/>";
                                $path+=" OCS1#OCS – OCS3#OCS - OCS2#OCS （保护）";
                                $dom="<br/>OCS1#OCS – OCS2#OCS （工作）<span style='margin-left: 10px'>296us</span><br/>"
                                $dom+=" OCS1#OCS – OCS3#OCS - OCS2#OCS （保护）<span style='margin-left: 10px'>216us</span>"
                                $delay=["297us","217us"];
                                $pathNum=13;
                                break;
                        }
                 }
           }
           else if($routeStrategy=="最小时延"){
               if(!$routeShowroute){
                   if($protected=="无保护"){
                       $(".delay").css("visibility","visible")
                       $path="OCS1#OCS –  OCS3#OCS - OCS2#OCS"
                       $delay=["217us"];
                       $(".delay").html("216us");
                       $pathNum=4;
                   }else if($protected=="静态1+1保护"){
                       $(".delay").css("visibility","hidden")
                       $path=" OCS1#OCS –  OCS3#OCS - OCS2#OCS(工作) <br/>";
                       $path+="OCS1#OCS – OCS4#OCS - OCS2#OCS （保护）";
                       $dom="<br/>OCS1#OCS –  OCS3#OCS - OCS2#OCS(工作) <span style='margin-left: 10px'>216us</span><br/>"
                       $dom+="OCS1#OCS – OCS4#OCS - OCS2#OCS （保护）<span style='margin-left: 10px'>238us</span>"
                       $delay=["217us","240us"];
                       $pathNum=5;
                   }else if($protected=="1+1重路由保护"){
                       $(".delay").css("visibility","hidden")
                       $path=" OCS1#OCS –  OCS3#OCS - OCS2#OCS(工作) <br/>";
                       $path+="OCS1#OCS – OCS4#OCS - OCS2#OCS （保护）";
                       $dom="<br/>OCS1#OCS –  OCS3#OCS - OCS2#OCS(工作) <span style='margin-left: 10px'>216us</span><br/>"
                       $dom+="OCS1#OCS – OCS4#OCS - OCS2#OCS （保护）<span style='margin-left: 10px'>238us</span>"
                       $delay=["217us","240us"];
                       $pathNum=14;

                   }else if($protected=="永久1+1保护"){
                       $(".delay").css("visibility","hidden")
                       $path=" OCS1#OCS –  OCS3#OCS - OCS2#OCS(工作) <br/>";
                       $path+="OCS1#OCS – OCS4#OCS - OCS2#OCS （保护）";
                       $dom="<br/>OCS1#OCS –  OCS3#OCS - OCS2#OCS(工作) <span style='margin-left: 10px'>216us</span><br/>"
                       $dom+="OCS1#OCS – OCS4#OCS - OCS2#OCS （保护）<span style='margin-left: 10px'>238us</span>"
                       $delay=["217us","240us"];
                       $pathNum=15;

                   }
               }

           }
       }
       else if($serverType=="SDH" ){
           if($routeStrategy=="最小时延" && routeCofMap.node=="d3" &&  $protected=="无保护"){
               $(".delay").css("visibility","visible");
               $path="OCS1#OCS –  OCS4#OCS - OCS2#OCS";
               $delay=["240us"];
               $(".delay").html("238us");
               $pathNum=7;
           }else if($routeStrategy=="最小时延" && $protected=="静态1+1保护" && !$routeShowroute){
               $(".delay").css("visibility","hidden")
               $path="OCS1#OCS – OCS3#OCS - OCS2#OCS （工作)<br/>";
               $path+="OCS1#OCS – OCS4#OCS - OCS2#OCS （保护）";
               $dom="<br/> OCS1#OCS – OCS3#OCS - OCS2#OCS （工作)<span style='margin-left: 10px'>212us</span><br/>"
               $dom+="OCS1#OCS – OCS4#OCS - OCS2#OCS （保护）<span style='margin-left: 10px'>239us</span>"
               $delay=["214us","240us"];
               $pathNum=6;
           }
       }
       else if($serverType=="以太网"){
           if($routeStrategy=="最小跳数") {
               if (!$routeShowroute) {
                   switch ($protected) {
                       case "无保护":
                           $(".delay").css("visibility", "visible");
                           $path = "OCS1#OCS -- OCS2#OCS";
                           $delay = ["297us"];
                           $(".delay").html("296us");
                           $pathNum = 1;
                           break;
                       case "静态1+1保护":
                           $(".delay").css("visibility", "hidden");
                           $path = "OCS1#OCS – OCS2#OCS (工作)<br/>";
                           $path += " OCS1#OCS – OCS3#OCS - OCS2#OCS （保护）";
                           $dom = "<br/>OCS1#OCS – OCS2#OCS （工作）<span style='margin-left: 10px'>296us</span><br/>"
                           $dom += " OCS1#OCS – OCS3#OCS - OCS2#OCS （保护）<span style='margin-left: 10px'>216us</span>"
                           $delay = ["297us", "217us"];
                           $pathNum = 2;
                           break;
                       case "1+1重路由保护":
                           $(".delay").css("visibility", "hidden");
                           $path = "OCS1#OCS – OCS2#OCS (工作)<br/>";
                           $path += " OCS1#OCS – OCS3#OCS - OCS2#OCS （保护）";
                           $dom = "<br/>OCS1#OCS – OCS2#OCS （工作）<span style='margin-left: 10px'>296us</span><br/>"
                           $dom += " OCS1#OCS – OCS3#OCS - OCS2#OCS （保护）<span style='margin-left: 10px'>216us</span>"
                           $delay = ["297us", "217us"];
                           $pathNum = 8;
                           break;
                   }
               }
           }
           else if($routeStrategy=="最小时延"){
               if(!$routeShowroute){
                   if($protected=="无保护"){
                       $(".delay").css("visibility","visible")
                       $path="OCS1#OCS –  OCS3#OCS - OCS2#OCS";
                       $delay=["217us"];
                       $(".delay").html("216us");
                       $pathNum=4;
                   }else if($protected=="静态1+1保护"){
                       $(".delay").css("visibility","hidden")
                       $path=" OCS1#OCS –  OCS3#OCS - OCS2#OCS(工作) <br/>";
                       $path+="OCS1#OCS – OCS4#OCS - OCS2#OCS （保护）";
                       $dom="<br/>OCS1#OCS –  OCS3#OCS - OCS2#OCS(工作) <span style='margin-left: 10px'>216us</span><br/>"
                       $dom+="OCS1#OCS – OCS4#OCS - OCS2#OCS （保护）<span style='margin-left: 10px'>238us</span>"
                       $delay=["217us","240us"];
                       $pathNum=5;
                   }else if($protected=="1+1重路由保护"){
                       $(".delay").css("visibility","hidden")
                       $path=" OCS1#OCS –  OCS3#OCS - OCS2#OCS(工作) <br/>";
                       $path+="OCS1#OCS – OCS4#OCS - OCS2#OCS （保护）";
                       $dom="<br/>OCS1#OCS –  OCS3#OCS - OCS2#OCS(工作) <span style='margin-left: 10px'>216us</span><br/>"
                       $dom+="OCS1#OCS – OCS4#OCS - OCS2#OCS （保护）<span style='margin-left: 10px'>238us</span>"
                       $delay=["217us","240us"];
                       $pathNum=14;
                   }
               }

           }
       }
       if($path !="" && state=="routeConf"){
           $(".confPath").css("display","block");
           if($dom==""){
               $(".delay").css("visibility","visible");
               $("#pathResult").html($path);
           }else{
               $("#pathResult").html($dom);
           }
       }else{
           return {"path":$path,"delay":$delay};
       }
   }
    // step 4
    $(".step-four").on("click",function(){
        var unDoneState=$(this).parents(".serverProgress").hasClass("panel-undone");
        if(!unDoneState){
            if(choseTpList.length !=2){
                showTItle("operation","提示");
                return;
            }
            setMyConf();
            var linkData = jsonData.routeLink["l"+$pathNum];
            showRoute(linkData.NE,linkData.NEconn)
            stepController($(this));
            $(".topo").css("display","block");
            $(".confInfo").css("display","none");
        }
    });
    //
     function timeChek(){
           var timePass=false;
           myData.path=$path;
          for(var t in jsonData.SERVER){
              if(myData.path !="" &&myData.path==jsonData.SERVER[t].path && myData.serverType==jsonData.SERVER[t].serverType){
                  if(myData.startTime>jsonData.SERVER[t].startTime && myData.startTime<jsonData.SERVER[t].stopTime){
                      showTItle("confFailed","失败")
                      timePass=true;
                      setTimeout(function(){
                          var tempdialog = dialog.getCurrent();
                          tempdialog.close();
                      },2000);
                  }
                  break;
              }
          }
          return timePass;
     }
    //step 5
     $(".appointment").on("click",function(){
         showTItle("appointmentPanel","预约发放");
     })
     $(".date-ok").on("click",function(){
         var $startTime=(new Date($(".startTime").val().replace("T"," "))).getTime();
         var $stopTime=(new Date($(".stopTime").val().replace("T"," "))).getTime();
         myData.startTime=$startTime;
         myData.stopTime=$stopTime;
         setTimeout(function(){
             var tempdialog = dialog.getCurrent();
             tempdialog.close();
         },1000);
     })
    // post my serverOW
    function setMyConf() {
        if(timeChek()){
            return;
        };
        showTItle("confSuccess","业务建立");
        setMyData.getOtherData(setData_stepB)
        myData.path=$path;
        myData.status=true;
        myData.delay=$delay;
        // myData.isSet=false;
        myData.id=(new Date).getTime();
        serverStatus.id=myData.id;
        serverStatus.userLabel=myData.serverName;
        serverStatus.statusName="创建中";
        myData.serverStatusName="创建中";
        var serverStatus2=  $.extend(true, {}, serverStatus);
        serverStatusData.SERVER_STATUS.push(serverStatus2);
        myData.pathNum="l"+$pathNum;
        var myData2=  $.extend(true, {}, myData)
        jsonData["TP-CONN"].push(connTp)
        jsonData.SERVER.push(myData2);

        serverHttp.server_post(jsonData,function(){
            showTItle("confSuccess","业务建立");
            serverInit($("#serverTable"),jsonData.SERVER)
            serverCtl.cleanDomData(cleanDomItem)
            setTimeout(function(){
                var tempdialog = dialog.getCurrent();
                tempdialog.close();
            },2000);
        });
        serverHttp.server_post(serverStatusData,function(){},srarus_filename)
    }
    $("#addAttributeTag").on("click",function(){
        $(".modal-box").css("display","block")
        showTItle("modal-box","附加属性?")
    })
    $(".cancel").on("click",function(){
                for(var a in myData.params){
                     myData.params[a]=""
                }
                 var tempdialog = dialog.getCurrent();
                    tempdialog.close();
    })
    $(".sure").on("click",function(){
            var tempdialog = dialog.getCurrent();
            tempdialog.close();
        setMyData.info_set_one(setData_stepA);
    })
    $("#showPoint").on("click",function(){
        var unDoneState=$(this).parents(".serverProgress").hasClass("panel-undone");
        if(!unDoneState){
        showTItle("chosePoit","选择端口")
       // $(".chosePoit").css("display","block")
        }
    })
    //check my server
    var checkRegexp={
      "notEmp":/\S/
    };
    var checkServer={
        "step_one":function () {
            var pass=false;
            if(!checkRegexp.notEmp.test($("#serverName").val())){
                 pass=true
            }else{
                pass=false
            }
            return pass
        }
    }
    //TP CHOSE
    function setSelect(dom,data){
        var option="";
        dom.empty();
        dom.html("<option value=''></option>")
        for(var i in data){
            option+="<option value="+data[i].id+">"+data[i].userLabel+"</option>"
        }
        dom.append(option);
    }
    $(".choseNeName").on("change",function(){
        var $ne=$(this).val();
        getTpByNe($ne);
        setTPList($tpDom,searchNeTp())
        choseTpStyle(choseTpList)

    })
    $(".choseTpName").on("change",function(){
         setTPList($tpDom,searchTp())
         choseTpStyle(choseTpList)
    })
    function getTpByNe(neId){
        var TP=[];
        for(var n in TPDATA){
            if(neId==TPDATA[n].neId){
                TP.push(TPDATA[n]);
            }
        }
        setSelect($(".choseTpName"),TP)
    }
     var tpListBox=[]
   function setTPList(dom,data){
       var tr="";
       tpListBox=data;
       for(var i in data){
           tr+="<tr id='"+data[i].id+"'>";
           tr+="<td>"+data[i].neName+"</td>"+"<td>"+data[i].userLabel+"</td>"+"</tr>";
       }
       dom.html(tr);
   }
    function setTPListDelete(dom,data){
        dom.html();
        var tr="";
        for(var i in data){
            tr+="<tr id='"+data[i].id+"'>";
            tr+="<td>"+data[i].neName+"-"+data[i].userLabel+"</td>"+
                "<td><a class='deleteTp' href='javascript:void (0)'>删除</a> </td>"+"</tr>";
        }
        dom.html(tr);
    }
    //tp search
    $(".setSearch").bind({
        "keyup":function(event){
            setTPList($tpDom,searchTp())
            choseTpStyle(choseTpList)
        }
    });
    function searchNeTp(){
        var searchTpList=[];
        for(var s in TPDATA){
            if($(".choseNeName").val()==TPDATA[s].neId){
                searchTpList.push(TPDATA[s])
            }else if($(".choseNeName").val()==""){
                searchTpList=TPDATA;
            }
        }
        return searchTpList;
    }
    function searchTp(){
        var searchTpList=[];
        for(var s in TPDATA){
            if($(".choseTpName").val()==""){
                if($(".choseNeName").val()==TPDATA[s].neId){
                     searchTpList.push(TPDATA[s])
                }
            }else{
                if($(".choseTpName").val()==TPDATA[s].id){
                      searchTpList.push(TPDATA[s]);
                }
            }
        }
        return searchTpList;
    }
   //chose tp
    var choseTpList=[];
    $(".tpList").on('click','tr',function(ev){
        var ind =$(this).index();
        var indId=$(this).attr("id");
        var strIndex=choseTpList.indexOf(indId);
        if(strIndex>-1){
            $(".tpList tr").eq(ind).css({background:"#fff",color:"black"});
            choseTpList.splice(strIndex,1);
        }else{
            if(choseTpList.length>1){
                return;
            }else{
                $(".tpList tr").eq(ind).css({background:"#21d271",color:"#fff"});
                choseTpList.push(indId)
            }
        }
    })
    //set choseTp Style
    function choseTpStyle(choseArr){
        $(".tpList tr").css({background:"#fff",color:"black"});
        var trLength=$(".tpList tr").length;
         for(var p in tpListBox){
            for(var ind in choseArr){
                if(tpListBox[p].id==choseArr[ind]){
                    $(".tpList tr").eq(p).css({background:"#21d271",color:"#fff"});
                      // $(".tpList tr").eq(choseArr[ind].substr(1)).css({background:"#21d271",color:"#fff"});
                }
            }
        }
    }
    $("#pointList").on('click',".deleteTp",function(ev){
        var ind =$(this).parents("tr").index();
        var indId=$("#pointList tr").eq(ind).attr("id");
        var strIndex=choseTpList.indexOf(indId);
        choseTpList.splice(strIndex,1);
        for(var i in pointList){
                if(pointList[i].id==indId){
                    pointList.splice(i,1);
                    setPointIfo($("#pointListInfo"),pointList);
                    setTPListDelete($("#pointList"),pointList);
                    break
                }
        }

        choseTpStyle(choseTpList);
    });
    $(".choseTpDone").on("click",function(){
        pointList=[];
         for(var i in TPDATA){
             for(var j in choseTpList){
                 if(TPDATA[i].id==choseTpList[j]){
                     pointList.push(TPDATA[i])
                 }
             }
         }
        setTPListDelete($("#pointList"),pointList);
        //hide this dom
        var tempdialog = dialog.getCurrent();
          tempdialog.close();
        //set point info
        setPointIfo($("#pointListInfo"),pointList)
   })
    function setPointIfo(dom,data){
        dom.find("li").remove();
        var li="";
        for(var p in data){
            li+="<li>"+data[p].neName+"-"+data[p].userLabel+"</li>"
        }
        dom.append(li);
    }
    $("#addPoint").on("click",function(){
        var unDoneState=$(this).parents(".serverProgress").hasClass("panel-undone");
        if(!unDoneState){
             showTItle("chosePoit","选择端口")
        }
    })
    $("#showPoint").on("click",function(){
        var unDoneState=$(this).parents(".serverProgress").hasClass("panel-undone");
        if(!unDoneState){
            showTItle("chosePoit","选择端口")
        }
    })

    //show  route
    $(".showRoute").on("click",function(){
        var unDoneState=$(this).parents(".serverProgress").hasClass("panel-undone");
        if(!unDoneState){
            if(choseTpList.length !=2){
                showTItle("operation","提示");
                return;
            }
            showTItle("routeConfPanel","显示路由")
            // var point=[myData.Apoint,myData.Zpoint]
            // connTp.Apoint=myData.Apoint;
            // connTp.Zpoint=myData.Zpoint;
            // connTp.connUserLabel=myData.serverName;
            // tpConn.push(connTp)
            // showRoute(point,tpConn);
        }
    })
    function showRoute(topodata,connData){
        $(".topo").css("display","block");
        $(".confInfo").css("display","none");
        //此处刷新路由图
        Pro.init(topodata,connData)
    }
    //show config
    $(".lookConf").on("click",function(){
        var unDoneState=$(this).parents(".serverProgress").hasClass("panel-undone");
         if(!unDoneState){
             $(".topo").css("display","none");
             $(".confInfo").css("display","block");
         }
    })
    $(".routeShow").on("click",function(){
        $(".topo").css("display","block");
        $(".confInfo").css("display","none");
    })
    //topo
    var Canvas = document.getElementById("canvas")
    var ctx = Canvas.getContext("2d") 
    var CanvasWidth = Canvas.getBoundingClientRect().width
    var CanvasHeight = Canvas.getBoundingClientRect().height
    var Pro = {
        init: function(topodata,connData){
            this.clear()
            this.data(topodata,connData)
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
        data: function(topodata,connData){
            this.port = topodata // 端口数据
            this.line = connData // 线的数据
        },
        drawPort: function(){
            for(var index in this.port){
                var portItem = this.port[index]
                var port = new drawPort(portItem.x,portItem.y,portItem.w,portItem.h,portItem.url,portItem.userLabel)
                this.PortList.push(port)
            }
        },
        drawLine: function(){
            for(var index in this.line){
                var lineItem = this.line[index]
                var qd;
                this.port.forEach(function(item){
                    if(item.id == lineItem.Apoint.id){
                        qd = item;
                        return 
                    }
                })
                var zd;
                this.port.forEach(function(item){
                    if(item.id == lineItem.Zpoint.id){
                        zd = item;
                        return 
                    }
                })
                if(lineItem.showLine){
                    var line = new drawLine(qd, zd, lineItem.mulState, lineItem.connUserLabel,lineItem.connState,lineItem.muls)
                    this.LineList.push(line)
                }
                
            }
        }
    }
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
    function drawLine(qd, zd, type,text,alarmState,muls){
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
                if(muls){
                    centerX = (aPointX + zPointX)/2
                    centerY = qd.y - 20
                }else{
                    centerX = (aPointX + zPointX)/2 // 曲线的拐点
                    centerY = qd.y + 50
                }
            }else if(qd.x == zd.x){
                if(muls){
                    centerX = qd.x -20 
                    centerY = (aPointY + zPointY)/2
                }else{
                    centerX = qd.x +20 
                    centerY = (aPointY + zPointY)/2
                }
                
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
        }
        else if(aPointY == zPointY){
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
        }
        else if(aPointX != zPointX && aPointY != zPointY){
            if(aPointX>zPointX){
                textX = (aPointX - zPointX)/2 + zPointX;
                if(aPointY > zPointY){
                    textY = (aPointY-zPointY)/2 + zPointY-20;
                }else{
                    textY = (zPointY-aPointY)/2 + aPointY +10;
                }
            }else{
                textX = (zPointX - aPointX)/2 + aPointX;
                if(aPointY > zPointY){
                    textY = (aPointY-zPointY)/2 + zPointY - 20;
                }else{
                    textY = (zPointY-aPointY)/2 + aPointY +10;
                }
            }
        }
        if(alarmState == "cleared"){
            ctx.strokeStyle = "gray";
        }else if(alarmState == "critical"){
            ctx.strokeStyle = "red";
        }else if(alarmState == "INDETERMINATE"){
            ctx.strokeStyle = "blue";
        }else if(alarmState == "minor"){
            ctx.strokeStyle = "yellow";
        }
        ctx.lineWidth=1;
        ctx.stroke()
        ctx.closePath()
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(text, textX, textY);
    }
})
