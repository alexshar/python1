(function(){
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
        }
    }
    var pagec = $(".page-c");
    var neList = $("#neList")
    var params = {}
    var TP = "";
    params.type = "SDH"
    var myData = [];
    var OtnType = "SM";
    var url_json = "https://135.251.96.98:8443/oms1350/web/eqm/omc_all/data/7_2_3/costManagement.json"
    // var url_json = "https://135.251.96.54:8443/oms1350/web/eqm/omc_all/data/7_2_3/costManagement.json"
    function initData() {
        $.getJSON(url_json, function (data) {
            myData = data;
            params.userLabel = data.NE[0].id;
            console.log(data);
            var tp = [];
			var SOLT=[];
            for (var t in  data.TP) {
                if (data.TP[t].type == "SDH") {
                    tp.push(data.TP[t])
                }
            }
			for(var k in data.SLOT){
				if(data.SLOT[k].neId==params.userLabel){
					SOLT.push(data.SLOT[k])
				}
			}
            if(tp.length==0){
                params.tpId="";
            }else{
                params.tpId=tp[0].id;
            }
            params.tp = tp[0].userLabel
            params.solt = data.SLOT[0].userLabel;
            TP=data.TP;
            //NE
            var domData = {
                list: data.NE,
                name: "userLabel",
                keyName: "id",
                tag: "option",
                domObj: neList
            }
            choseList.createDom(domData);
            //TP
            var domDataTp = {
                list: tp,
                name: "userLabel",
                keyName: "id",
                tag: "option",
                domObj: $("#port"),
                otherObj: data.NE,
                otherKey: "neId",
                otherVal: neList.find("option").eq(0).val()
            }
            choseList.createDom(domDataTp);
			 var domDataSolt = {
                list: SOLT,
                name: "userLabel",
                keyName: "id",
                tag: "option",
                domObj: $("#solt"),
                otherObj: data.NE,
                otherKey: "neId",
                otherVal: neList.find("option").eq(0).val()
            }
            choseList.createDom(domDataSolt);
        })
	initStyle();
    }
	function initStyle(){
	     pagec.eq(0).css("display", "block");
		 $("#servserChose").find("li").css("background","#fff");
        $("#servserChose").find("li").eq(0).css({
            "background": "#ccc"
        })
        $(".pageTp_SDH").css("display", "block");
		
	}

    initData();
    // get tp
    neList.on("change", function (event) {
        $("#port").find("option").remove()
        $("#solt").find("option").remove()
        //tp
        var tplist = []
        params.userLabel= $(this).val()
        $.getJSON(url_json, function (data) {
            TP = data.TP;
            for (var p in data.TP) {
                if (data.TP[p].type == params.type && data.TP[p].neId==params.userLabel) {
                    tplist.push(data.TP[p]);
                }
            }
            var domData = {
                list: tplist,
                name: "userLabel",
                keyName: "id",
                tag: "option",
                domObj: $("#port"),
                otherObj: data.NE,
                otherKey: "neId",
                otherVal: params.userLabel
            }
            console.log(tplist)
            choseList.createDom(domData);
            if(tplist.length==0){
                params.tpId=""
            }else{
                params.tpId=tplist[0].id
            }
        })
        //solt
        $.getJSON(url_json, function (data) {
            var domData = {
                list: data.SLOT,
                name: "userLabel",
                keyName: "id",
                tag: "option",
                domObj: $("#solt"),
                otherObj: data.NE,
                otherKey: "neId",
                otherVal: params.userLabel
            }
            choseList.createDom(domData);
        })
		
    })
    //solt
    $.getJSON(url_json, function (data) {
        var domData = {
            list: data.SLOT,
            name: "userLabel",
            keyName: "id",
            tag: "option",
            domObj: $("#solt"),
            otherObj: data.NE,
            otherKey: "neId",
            otherVal: params.userLabel
        }
        choseList.createDom(domData);
    })
    $("#servserChose").find("li").on("click", function (event) {
        var ind = $(this).index();
        OtnType = $(this).text();
        $("#servserChose>li").css("background","#fff")
		$(this).css("background","#ccc")
        pagec.css("display", "none");
        pagec.eq(ind).css("display", "block");

    })
//type chose
//show dlg
    var showTItle = function (id, title) {
        var dialogId = "#" + id + "";
        var w = $(document.body).width() * 0.7;
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

    function openQuery(dom) {
        var title = '开销管理';
        var dialogId = '#'+dom;
        var w = $(document.body).width() * 0.7;
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
//search
    $("#search").on("click", function (e) {
        var tpType = $("#portType").val();
		initVal(params.tpId);
        openQuery("dlg");
		initStyle();
        $(".pageTp").css("display", "none")
        $(".pageTp_" + tpType).css("display", "block");
        
    })
//tp
    $("#portType").on("change", function (e) {
        $("#port").find("option").remove();
        var pt = $(this).val();
        params.type = pt
        var tpontype = []
        for (var i in TP) {
            if (TP[i].type == pt && TP[i].neId == params.userLabel) {
                tpontype.push(TP[i])
            }
        }
        if(tpontype.length==0){
            params.tpId=""
        }else{
            params.tpId=tpontype[0].id
        }
        var domData = {
            list: tpontype,
            name: "userLabel",
            keyName: "id",
            tag: "option",
            domObj: $("#port")
        }
        console.log(tpontype)
        choseList.createDom(domData);
    })
//port chose
    $("#port").on("change",function(e){
        params.tpId=$(this).val();

    })
    function initVal(id){
		clearData();
        if(params.tpId!=""){
            if (params.type == "SDH") {
                for (var j in myData.JO) {
                    if (myData.JO[j].tpId == id) {
                        $("#qxw").val(myData.JO[j].JOexpectNum);
                        $("#jjsz").val(myData.JO[j].JONum);
                        break;
                    }
                }
            } else {
                SMInit()
                PMInit();
                TCMInit();
                OPUInit();
            }
            function SMInit(){
                for (var s in myData.SM) {
                    if (myData.SM[s].tpId == id) {
                        $("#sm_sz").val(myData.SM[s].smNum);
                        $("#sm_qw").val(myData.SM[s].expectNum)
                        $("#sm_js").val(myData.SM[s].receiveNum)
						debugger;
                        break;
                    }
                }
            }
            function PMInit(){
                for (var s in myData.PM) {
                    if (myData.PM[s].tpId == id) {
                        $("#pm_qw").val(myData.PM[s].expectNumTTL);
                        $("#pm_js").val(myData.PM[s].receiveNumTTL)
                        $("#costTest").val(myData.PM[s].state)
                        break
                    }
                }
            }
            function TCMInit(){
                for (var s in myData.TCM) {
                    if (myData.TCM[s].tpId ==id) {
                        $("#TCM_sz").val(myData.TCM[s]["tcmNumTCM-TT1"]);
                        $("#TCM_qw").val(myData.TCM[s]["expectNumTCM-TT1"]);
                        $("#TCM_js").val(myData.TCM[s]["receiveNumTCM-TT1"]);
                        break;
                    }
                }
            }
            function  OPUInit(){
                for (var s in myData.OPU) {
                    if (myData.OPU[s].tpId ==id) {
                        $("#numPt").val(myData.OPU[s]["numPt"]);
                        break;
                    }
                }
            }
        }
    }
    function clearData(){
        $("#numPt").val("");
         $("#TCM_js").val("");
        $("#TCM_qw").val("");
        $("#TCM_sz").val("");
         $("#costTest").val("");
        $("#pm_js").val("term");
        $("#pm_qw").val("");
        $("#sm_js").val("");
        $("#sm_qw").val("");
		$("#sm_sz").val("");
		$("#jjsz").val("");
        $("#qxw").val("");
    }
//post data
    $("#use").on("click", function (e) {
		showTItle("ConfrimDlg","是否应用?")
       // var use = window.confirm("确认要保存吗？");
        if (params.type == "SDH") {
            for (var j in myData.JO) {
                if (myData.JO[j].tpId == params.tpId) {
                    myData.JO[j].JOexpectNum = $("#qxw").val();
                    myData.JO[j].JONum = $("#jjsz").val();
                }
            }
        } else {
            switch (OtnType) {
                case"SM":
                    SM()
                    break;
                case"PM":
                    PM()
                    break;
                case"TCM":
                    TCM()
                    break;
                case"OPU":
                    OPU();
                    break;
            }
        }
        function SM() {
            for (var s in myData.SM) {
                if (myData.SM[s].tpId == params.tpId) {
                    myData.SM[s].smNum = $("#sm_sz").val();
                    myData.SM[s].expectNum = $("#sm_qw").val();
                }
            }
        }
        function PM() {
            for (var s in myData.PM) {
                if (myData.PM[s].tpId == params.tpId) {
                    myData.PM[s].expectNumTTL = $("#pm_qw").val();
                    myData.PM[s].receiveNumTTL = $("#pm_js").val();
                    myData.PM[s].state=$("#costTest").val()

                }
            }
        }
        function TCM() {
            for (var s in myData.TCM) {
                if (myData.TCM[s].tpId == params.tpId) {
                    myData.TCM[s]["tcmNumTCM-TT1"] = $("#TCM_sz").val();
                    myData.TCM[s]["expectNumTCM-TT1"] = $("#TCM_qw").val();
                }
            }
        }
    })
	$(".sure").click(function(e){
		  showTItle("operation")
		var url = "https://135.251.96.98:8443/cgi-bin/test.cgi";
        // var url = "https://135.251.96.54:8443/cgi-bin/test.cgi";
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
	})
	$(".no").click(function(e){
		 var tempdialog = dialog.getCurrent();
			tempdialog.close();
		return false;
	})
	
})()