(function(){
    $(document).ready(function() {
        var numTest = /^(\-|\+)?\d+(\.\d+)?$/;
        var opPer_url="https://135.251.96.98:8443/oms1350/web/eqm/omc_all/data/9_3/OPowerPerformance.json";
        var myData=null;
        var neList=$("#neList");
        var port=$("#port");
        var OPformanceUp=$("#OPformanceUp");
        var OPformanceDown=$("#OPformanceDown");
        var $perUp="";
        var $perDown="";
        var errMsg=$("#erroPerformance");
        var opPer={};
        var pass=true
        //apply list
        var choseList = {
            createDom: function (obj) {
                var Tag = "";
                if (obj.otherObj != undefined && obj.otherVal != "") {
                    for (var i in obj.list) {
                        if (obj.list[i][obj.otherKey] == obj.otherVal) {
                            Tag += "<" + obj.tag + " value=" + obj.list[i][obj.keyName] + ">" + obj.list[i][obj.name] + "</" + obj.tag + ">";
                        }
                    }
                } else {
                    for (var j in obj.list) {
                        Tag += "<" + obj.tag + " value=" + obj.list[j][obj.keyName] + ">" + obj.list[j][obj.name] + "</" + obj.tag + ">";
                    }
                }
                obj.domObj.append(Tag);
            },
            getList:function(obj,attr,yKey){
                var list=[];
                for(var k in obj){
                    if(obj[k][attr]==yKey){
                        list.push(obj[k])
                    }
                }
                return list;
            }
        }
        function perInit(){
            $.getJSON(opPer_url, function (data){
                myData=data;
                var domData={
                    list:myData.NE,
                    name:"userLabel",
                    keyName:"id",
                    tag:"option",
                    domObj:neList
                }
                choseList.createDom(domData);
                //TP
                var tpList=choseList.getList(myData.TP,"neId",myData.NE[0].id);
                opPer.tpId=tpList[0].id;
                var domDataTp={
                    list:tpList,
                    name:"userLabel",
                    keyName:"id",
                    tag:"option",
                    domObj:port
                }
                choseList.createDom(domDataTp);
                OPformanceUp.val(tpList[0].perUp);
                OPformanceDown.val(tpList[0].perDown);
				$perUp=tpList[0].perUp;
				$perDown=tpList[0].perDown;
            })
        }
        perInit();
        neList.change(function(e){
            var neValue=$(this).val();
            port.find("option").remove();
            $.getJSON(opPer_url, function (data){
                var tpList=choseList.getList(myData.TP,"neId",neValue);
                opPer.tpId=tpList[0].id
                var domData={
                    list:tpList,
                    name:"userLabel",
                    keyName:"id",
                    tag:"option",
                    domObj:port
                }
                choseList.createDom(domData);
                OPformanceUp.val(tpList[0].perUp);
                OPformanceDown.val(tpList[0].perDown);
            })


        })
        //chose performanceItem
        port.change(function () {
            var itemKey = $(this).val();
            opPer.tpId=itemKey;
            $.getJSON(opPer_url, function (data){
                myData=data;
                for(var i in myData.TP){
                    if(myData.TP[i].id==itemKey){
                        OPformanceUp.val(myData.TP[i].perUp);
                        OPformanceDown.val(myData.TP[i].perDown);
                        break;
                    }
                }
            })
        });
//        //max
        var upPass=false
        var downPass=false;
        OPformanceUp.keyup(function (event) {
            $perUp = $(this).val();
            if(numTest.test($perUp)){
                $(this).css("border","1px solid #ccc");
                errMsg.css("visibility","hidden")
                if ($perDown == "") {
                    if(parseFloat($perUp)<8 && parseFloat($perUp)>-24){
                        $(this).css("border","1px solid #ccc");
                        upPass=true;
                        pass=true;
                    }else{
                        $(this).css("border","1px solid red");
                        errMsg.css("visibility","visible")
                        upPass=false
                        pass=false;
                    }
                } else {
                    if(parseFloat($perUp)<8 && parseFloat($perUp)>parseFloat($perDown)&& parseFloat($perUp)>-24){
                        $(this).css("border","1px solid #ccc");
                    upPass=true;
                    pass=true;
                   }else{
                    $(this).css("border","1px solid red");
                    errMsg.css("visibility","visible")
                    upPass=false
                    pass=false;
                }
            }
        }else{
            $(this).css("border","1px solid red");
            errMsg.css("visibility","visible")
            upPass=false;
            pass=false;
        }
    })

    //min
    OPformanceDown.keyup(function (event) {
        $perDown = $(this).val();
        if(numTest.test($perUp)){
            $(this).css("border","1px solid #ccc");
            errMsg.css("visibility","hidden")
            if ($perUp == "") {
                if(parseFloat($perDown)<-24||parseFloat($perDown)>8){
                    $(this).css("border","1px solid red");
                    errMsg.css("visibility","visible")
                    downPass=false
                    pass=false;
                }else{
                    $(this).css("border","1px solid #ccc");
                    downPass=true
                    pass=true;
                }
            } else {
                if((parseFloat($perDown)>-24) && (parseFloat($perDown)<=parseFloat($perUp))||parseFloat($perDown)>8){
                    $(this).css("border","1px solid #ccc");
                    downPass=true
                    pass=true;
                }else{
                    $(this).css("border","1px solid red");
                    errMsg.css("visibility","visible")
                    downPass=false
                    pass=false;

                }
            }
        }else{
            $(this).css("border","1px solid red");
            errMsg.css("visibility","visible")
            downPass=false
            pass=false;
        }
    })
    //dlg
    var showTItle = function (id, title) {
        var dialogId = "#" + id + "";
        var w = $(document.body).width() * 0.5;
        var d = dialog({
            title: title,
            width: w,
            content: $(dialogId)
        });
        var temp = dialog.getCurrent();
        if (temp != undefined) {
            temp.close();
        }
        d.show();
    }
//
    $("#setOPPerformance").on("click", function () {
        if((downPass && upPass)||pass){
            showTItle("ConfrimDlg", "是否设定?")
        }
    })
    $(".sure").click(function (e) {
        showTItle("operation")
        errMsg.css("visibility", "hidden")
        for (var j in myData.TP) {
            if (myData.TP[j].id == opPer.tpId) {
                myData.TP[j].perUp = OPformanceUp.val();
                myData.TP[j].perDown = OPformanceDown.val();
            }
        }

        var url = "https://135.251.96.98:8443/cgi-bin/test.cgi";
        var template = {
            "content": JSON.stringify(myData),
            "filename": "/oms1350/web/eqm/omc_all/data/9_3/OPowerPerformance.json"
        }
        $.post(url, template, function (resp) {
            if (resp == "success") {
                showTItle("DLGsuccess")
                setTimeout(function () {
                    var tempdialog = dialog.getCurrent();
                    tempdialog.close();
                }, 1000);
            }
        }).error(function () {
            alert("链接服务器失败");
        })
    })
    $(".no").click(function (e) {
        var tempdialog = dialog.getCurrent();
        tempdialog.close();
        return false;
    })
});
})()

