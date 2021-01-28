$(document).ready(function(){
    var performance={};
    var numTest= /(^[0-9]+.?[0-9]*[E]?[-+]?)/;;
    var up=false;
    var down=false;
    var myData="";
    var per_url= "https://135.251.96.98:8443/oms1350/web/eqm/omc_all/data/9_2/performanceManagment.json";
    var perUpDom=$("#performanceUp")
    var perDownDom=$("#performanceDown");
    var performanceItem=$("#performanceTestItem");
    var errMsg=$("#erroPerformance");
    var $perUp="";
    var $perDown="";
	var pass=false;
	var keychange=true;
    //apply list
    var choseList={
        createDom:function(obj){
            var Tag="";
            if(obj.otherObj!=undefined && obj.otherVal !=""){
                for(var i in obj.list){
                    if(obj.list[i][obj.otherKey]==obj.otherVal){
                        Tag+="<"+obj.tag+" value="+obj.list[i][obj.keyName]+">"+obj.list[i][obj.name]+"</"+obj.tag+">";
                    }
                }
            }else{
                for(var j in obj.list){
                    Tag+="<"+obj.tag+" value="+obj.list[j][obj.keyName]+">"+obj.list[j][obj.name]+"</"+obj.tag+">";
                }
            }
            obj.domObj.append(Tag);
        }
    }
    function perInit(){
        $("#performanceTest").val();
        $.getJSON(per_url, function (data){
			console.log(data)
			debugger;
            myData=data;
            performance.id=myData[0].id;
			setUpOrDown(0)
            var domData={
                list:data,
                name:"userLabel",
                keyName:"id",
                tag:"option",
                domObj:$("#performanceTestItem")
            }
            choseList.createDom(domData);
            
        })
    }
    function setUpOrDown(ind){
        perUpDom.val(myData[ind].perUp)
        perDownDom.val(myData[ind].perDown)
		$perDown=myData[ind].perDown;
		$perUp=myData[ind].perUp;
    }
    perInit();
    //chose performanceItem
    performanceItem.change(function(){
       var itemKey=$(this).val();
        for(var i in myData){
            if(myData[i].id==itemKey){
                setUpOrDown(i);
                performance.id=i;
                break;
            }
        }
		perUpDom.css("border","1px solid #ccc");
		perUpDom.css("border","1px solid #ccc");
		pass=false;
		 errMsg.css("visibility","hidden")
    })
    //max
    perUpDom.keyup(function(event){
        $perUp=$(this).val();
        if($perDown==""){
            if(numTest.test($perUp) &&  parseFloat($perUp)<=100){
                $(this).css("border","1px solid #ccc");
                errMsg.css("visibility","hidden")
                up=true
            }else{
                $(this).css("border","1px solid red");
                errMsg.css("visibility","visible")
                up=false
            }
        }else{
            if((numTest.test($perUp) &&  parseFloat($perUp)<=100) && parseFloat($perUp)>parseFloat($perDown)){
                $(this).css("border","1px solid #ccc");
                perDownDom.css("border","1px solid #ccc");
                errMsg.css("visibility","hidden")
                up=true
            }else{
                $(this).css("border","1px solid red");
                errMsg.css("visibility","visible")
                up=false
            }
        }
    })
    //min
    perDownDom.keyup(function(event){
        $perDown=$(this).val();
        if($perUp==""){
            if(!numTest.test($perDown) || parseFloat($perDown)<0){
                $(this).css("border","1px solid red");
                errMsg.css("visibility","visible")
                down=false
            }else{
                $(this).css("border","1px solid #ccc");
                errMsg.css("visibility","hidden")
                down=true;
            }
        }else{
            if(!numTest.test($perDown) || parseFloat($perDown)<0 || parseFloat($perDown)> parseFloat($perUp)){
                $(this).css("border","1px solid red");
                errMsg.css("visibility","visible")
                down=false
            }else{
                $(this).css("border","1px solid #ccc");
                perUpDom.css("border","1px solid #ccc");
                errMsg.css("visibility","hidden")
                down=true;
            }
        }

    })
	//dlg
	var showTItle=function(id,title){
		var dialogId ="#"+id+"";
		var w = $(document.body).width() * 0.5;
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
    $("#setPerformance").on("click",function(){
		if(keychange|| pass){
			showTItle("ConfrimDlg","是否设定?")
		}
		
    })
	$(".sure").click(function(e){
		for(var j in myData){
               if(myData[j].id=="p"+(parseInt(performance.id)+1){
                   myData[j].perUp=perUpDom.val();
                   myData[j].perDown=perDownDom.val();
               }
           }
		   showTItle("operation")
			errMsg.css("visibility","hidden")
                var url = "https://135.251.96.98:8443/cgi-bin/test.cgi";
                var template = {
                    "content": JSON.stringify(myData)
                }
                $.post(url, template, function (resp) {
                    if (resp == "success") {
						 showTItle("DLGsuccess")
						 setTimeout(function(){
							 var tempdialog = dialog.getCurrent();
							 tempdialog.close();
						 },1000);	
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
});
