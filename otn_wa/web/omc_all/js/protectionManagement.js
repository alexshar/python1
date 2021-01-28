/**
 * Created by lenovo on 2017/10/15.
 */
//init
$("#CreateDlg").hide();
$("#ConfrimDlg").hide();
$("#operation").hide();
$("#DLGsuccess").hide();
var Coformstatus="";
var arrycheck=[];
var  PgList={};
var server_path = 'https://135.251.96.98:8443';
var cgi_path = "https://135.251.96.98:8443/cgi-bin/test.cgi";
var fixID="";
/*获取json*/
var getPGurl=function(){
    var prot="";


    $.getJSON(server_path+'/oms1350/web/eqm/omc_all/data/7_3_1/pg.json',function(data){
        prot=data.port;
    });


    $.getJSON(server_path+'/oms1350/web/eqm/omc_all/data/7_3_1/pg.json',function(data){
        PgList=data;
        console.log(PgList)
        var datas=data;
        data=data.ne
        var htmlstr="";
        for(var i in data){
            htmlstr+="<option value='"+data[i].name+"'>"+data[i].name+"</option>"
        }
        $(".Sourcenode").html(htmlstr)
        $(".SinkNode").html(htmlstr)

        $(".Sourcenode").change(function(){
            var neid=$(this).val();
            var protData=[];
            for(var j in prot){
                if(neid==prot[j].neName  && prot[j].pgId==""){
                    protData.push(prot[j]);
                }
            }
            var protHtml="";
            for(var k in protData){
                protHtml+="<option value='"+protData[k].name+"'>"+protData[k].name+"</option>"
            }
            $(".SourcePort").html(protHtml)
        })
        $(".SinkNode").change(function(){
            var neid=$(this).val();
            var protData=[];
            for(var j in prot){
                if(neid==prot[j].neName && prot[j].pgId==""){
                    protData.push(prot[j]);
                }
            }
            var protHtml="";
            for(var k in protData){
                protHtml+="<option value='"+protData[k].name+"'>"+protData[k].name+"</option>"
            }
            $(".SinkPort").html(protHtml)
        })


        $(".Sourcenode").change();
        $(".SinkNode").change()


        var route=datas.routes
        console.log(route)
        var routeHtml="";
        for(var i in route){
            if(route[i].pgId==""){
                routeHtml+="<option value='"+route[i].name+"'>"+route[i].name+"</option>"
            }
        }


        var mains=datas.routes
        var mianHtml="";
        for(var i in mains){
            if(mains[i].pgId==""){
                mianHtml+="<option value='"+mains[i].name+"'>"+mains[i].name+"</option>"
            }
        }
        $(".mainrouts").html(routeHtml)
        $(".Sparerouts").html(mianHtml)



        $(".Sparerouts").change(function(){
        })
        $(".mainrouts").change(function(){
         /*   switch (val){
                case " ODU4ODU0-1-1-71-2-17":
                    $(".Sparerouts").val("ODU4ODU0-1-1-71-1-17")
                    break;
                case "ODU4ODU0-1-1-71-1-17":
                    $(".Sparerouts").val("ODU4ODU0-1-1-71-2-17")
                    break;
                case "ODU4ODU1-1-1-71-2-18":
                    $(".Sparerouts").val("ODU4ODU1-1-1-71-1-18")
                    break;
                case "ODU4ODU1-1-1-71-1-18":
                    $(".Sparerouts").val("ODU4ODU1-1-1-71-2-18")
                    break;
                case "ODU4ODU2-1-1-71-2-1":
                    $(".Sparerouts").val("ODU4ODU2-1-1-71-1-1")
                    break;
                case "ODU4ODU2-1-1-71-1-1":
                    $(".Sparerouts").val("ODU4ODU2-1-1-71-2-1")
                    break;
                case "ODU4ODU2-1-1-71-2-9":
                    $(".Sparerouts").val("ODU4ODU2-1-1-71-1-9")
                    break;
                case "ODU4ODU2-1-1-71-1-9":
                    $(".Sparerouts").val("ODU4ODU2-1-1-71-2-9")
                    break;
                case "11QPA4-1-8-L1":
                    $(".Sparerouts").val("11QPA4-1-8-L3")
                    break;
                case "11QPA4-1-8-L3":
                    $(".Sparerouts").val("11QPA4-1-8-L1")
                    break;
            }*/
            var minaROute=$(this).val()
            $.getJSON(server_path+'/oms1350/web/eqm/omc_all/data/7_3_1/pg.json',function(data){
                var mains=data.routes
                var mianHtml="";
                for(var i in mains){
                    if(mains[i].name==minaROute){
                        mains.splice(i,1)
                    }
                }
                console.log(mains)
                for(var i in mains){
                    if(mains[i].pgId==""){
                        mianHtml+="<option value='"+mains[i].name+"'>"+mains[i].name+"</option>"
                    }
                }
                $(".Sparerouts").html(mianHtml)
            })
        })
        $(".mainrouts").change();
        setTimeout(function(){
          $(".Sparerouts").change()
         },1000)
    });


    $.getJSON(server_path+'/oms1350/web/eqm/omc_all/data/7_3_1/pg.json',function(data){
        PgList=data;
        data=PgList.pg
        var html="";
        for(var i in data){
            var Sparers=data[i].SparerSource.split("-");
            var OPer=Sparers[0].substring(4)
            html+="<tr><td><input type='checkbox' style='position: inherit;opacity: 1;left: 0px' value='"+data[i].id+"' onclick='tdcheck(event)'></td>" +
                "<td><a href='javascript:void(0);' onclick='checkCard(event)' value='"+data[i].id+"'>"+data[i].name+"</a></td>" +
                "<td>"+data[i].type+"</td>" +
                "<td>"+data[i].back+"</td>" +
                "<td>"+data[i].time+"</td>" +
                "<td>"+data[i].Sourcenode+"</td>" +
                "<td>"+data[i].SourcePort+"</td>" +
                "<td>"+data[i].SinkNode+"</td>" +
                "<td>"+data[i].SinkPort+"</td> " +
                "<td>"+data[i].SNpro+"</td> " +
                "<td>Normal</td>" +
                "<td>"+data[i].status+"</td>" +
               /* "<td>"+data[i].Locking+"</td>" +*/
                "<td>"+data[i].SparerSource+"</td>" +
                "<td>"+data[i].EWYW+"</td>" +
                "<td>"+OPer+"</td>" +
                "    <td><button list='"+data[i].id+"' onclick='fixPg(event)' class='PGBtnStyle'>修改</button></td></tr>"
        }
        $(".ProList").html(html)
        localStorage.setItem("pg",JSON.stringify(data));
        checkCard();
    });
   /* $.get(
        "./7_3_1/pg.json",
        function(data){
            data=data.pg
            var html="";
            for(var i in data){
                html+="<tr><td><input type='checkbox' value='"+data[i].id+"' onclick='tdcheck(event)'></td>" +
                    "<td><a href='javascript:void(0);' onclick='checkCard(event)' value='"+data[i].id+"'>"+data[i].name+"</a></td>" +
                    "<td>"+data[i].type+"></td>" +
                    "<td>"+data[i].back+"</td>" +
                    "<td>"+data[i].time+"</td>" +
                    "<td>"+data[i].Sourcenode+"</td>" +
                    "<td>"+data[i].SourcePort+"</td>" +
                    "<td>"+data[i].SinkNode+"</td>" +
                    "<td>"+data[i].SinkPort+"</td> " +
                    "<td>使能</td> " +
                    "<td>normarl</td>" +
                    "<td>"+data[i].status+"</td>" +
                    "<td>"+data[i].Locking+"</td>" +
                    "    <td><button list='"+data[i].id+"' onclick='fixPg(event)'>修改</button></td></tr>"
            }
            $(".ProList").html(html)
            localStorage.setItem("pg",JSON.stringify(data));
        })*/

}
getPGurl();
var checkCard=function(event,id){
    /*  var neId=""
     if(id==null){
     neId=$(event.target).attr("value");
     }else {
     neId=id;
     }

     var data=PgList.pg;
     var route=[];
     /!* for(var i in data){
     if(neId==data[i].neId){
     route.push(data[i])
     }
     }

     var datas=data.Sparerouts;
     var routes=[];
     for(var i in datas){
     if(neId==datas[i].id){
     routes.push(datas[i])
     }
     }*!/
     for(var i in data){
     if(neId==data[i].id){
     route.push(data[i])
     }
     }
     console.log(route)*/
    var route=PgList.pg;
    var html="";
    for(var i in route){
        var Sparers=route[i].SparerSource.split("-");
        var OPer=Sparers[0].substring(4)
        html+="<tr>" +
            "<td>"+route[i].name+"</td>"+
            "<td>"+route[i].mainroutsId+"</td>" +
            "<td>"+route[i].SpareroutsId+"</td>" +
            "<td>"+route[i].SparerSource+"</td>" +
            "<td>"+OPer+"</td></tr>"
    }
    $(".routeList").html(html);
    /* var html="";
     for(var i in route){
     html+="<tr><td>"+route[i].name+"</td></tr>"
     }

     $(".routesList").html(html);*/

}


var initCreate=function(){
    var prot="";
    $.getJSON(server_path+'/oms1350/web/eqm/omc_all/data/7_3_1/pg.json',function(data){
        prot=data.port;
    });
    $.getJSON(server_path+'/oms1350/web/eqm/omc_all/data/7_3_1/pg.json',function(data){
        PgList=data;
        console.log(PgList)
        var datas=data;
        data=data.ne
        var htmlstr="";
        for(var i in data){
            htmlstr+="<option value='"+data[i].name+"'>"+data[i].name+"</option>"
        }
        $(".Sourcenode").html(htmlstr)
        $(".SinkNode").html(htmlstr)

        $(".Sourcenode").change(function(){
            var neid=$(this).val();
            var protData=[];
            for(var j in prot){
                if(neid==prot[j].neName  && prot[j].pgId==""){
                    protData.push(prot[j]);
                }
            }
            var protHtml="";
            for(var k in protData){
                protHtml+="<option value='"+protData[k].name+"'>"+protData[k].name+"</option>"
            }
            $(".SourcePort").html(protHtml)
        })
        $(".SinkNode").change(function(){
            var neid=$(this).val();
            var protData=[];
            for(var j in prot){
                if(neid==prot[j].neName && prot[j].pgId==""){
                    protData.push(prot[j]);
                }
            }
            var protHtml="";
            for(var k in protData){
                protHtml+="<option value='"+protData[k].name+"'>"+protData[k].name+"</option>"
            }
            $(".SinkPort").html(protHtml)
        })


        $(".Sourcenode").change();
        $(".SinkNode").change()


        var route=datas.routes
        console.log(route)
        var routeHtml="";
        for(var i in route){
            if(route[i].pgId==""){
                routeHtml+="<option value='"+route[i].name+"'>"+route[i].name+"</option>"
            }
        }


        var mains=datas.routes
        var mianHtml="";
        for(var i in mains){
            if(mains[i].pgId==""){
                mianHtml+="<option value='"+mains[i].name+"'>"+mains[i].name+"</option>"
            }
        }
        $(".mainrouts").html(routeHtml)
        $(".Sparerouts").html(mianHtml)



        $(".Sparerouts").change(function(){
        })
        $(".mainrouts").change(function(){
            /*   switch (val){
             case " ODU4ODU0-1-1-71-2-17":
             $(".Sparerouts").val("ODU4ODU0-1-1-71-1-17")
             break;
             case "ODU4ODU0-1-1-71-1-17":
             $(".Sparerouts").val("ODU4ODU0-1-1-71-2-17")
             break;
             case "ODU4ODU1-1-1-71-2-18":
             $(".Sparerouts").val("ODU4ODU1-1-1-71-1-18")
             break;
             case "ODU4ODU1-1-1-71-1-18":
             $(".Sparerouts").val("ODU4ODU1-1-1-71-2-18")
             break;
             case "ODU4ODU2-1-1-71-2-1":
             $(".Sparerouts").val("ODU4ODU2-1-1-71-1-1")
             break;
             case "ODU4ODU2-1-1-71-1-1":
             $(".Sparerouts").val("ODU4ODU2-1-1-71-2-1")
             break;
             case "ODU4ODU2-1-1-71-2-9":
             $(".Sparerouts").val("ODU4ODU2-1-1-71-1-9")
             break;
             case "ODU4ODU2-1-1-71-1-9":
             $(".Sparerouts").val("ODU4ODU2-1-1-71-2-9")
             break;
             case "11QPA4-1-8-L1":
             $(".Sparerouts").val("11QPA4-1-8-L3")
             break;
             case "11QPA4-1-8-L3":
             $(".Sparerouts").val("11QPA4-1-8-L1")
             break;
             }*/
            var minaROute=$(this).val()
            $.getJSON(server_path+'/oms1350/web/eqm/omc_all/data/7_3_1/pg.json',function(data){
                var mains=data.routes
                var mianHtml="";
                for(var i in mains){
                    if(mains[i].name==minaROute){
                        mains.splice(i,1)
                    }
                }
                console.log(mains)
                for(var i in mains){
                    if(mains[i].pgId==""){
                        mianHtml+="<option value='"+mains[i].name+"'>"+mains[i].name+"</option>"
                    }
                }
                $(".Sparerouts").html(mianHtml)
            })
        })
        $(".mainrouts").change();
        setTimeout(function(){
            $(".Sparerouts").change()
        },1000)
    });
}
var initfixPanel=function(){
    var prot="";
    $.getJSON(server_path+'/oms1350/web/eqm/omc_all/data/7_3_1/pg.json',function(data){
        prot=data.port;
    });
    $.getJSON(server_path+'/oms1350/web/eqm/omc_all/data/7_3_1/pg.json',function(data){
        PgList=data;
        console.log(PgList)
        var datas=data;
        data=data.ne
        var htmlstr="";
        for(var i in data){
            htmlstr+="<option value='"+data[i].name+"'>"+data[i].name+"</option>"
        }
        $(".Sourcenode").html(htmlstr)
        $(".SinkNode").html(htmlstr)

        $(".Sourcenode").change(function(){
            var neid=$(this).val();
            var protData=[];
            for(var j in prot){
                if((neid==prot[j].neName  && prot[j].pgId=="") || prot[j].pgId==fixID){
                    protData.push(prot[j]);
                }
            }
            var protHtml="";
            for(var k in protData){
                protHtml+="<option value='"+protData[k].name+"'>"+protData[k].name+"</option>"
            }
            $(".SourcePort").html(protHtml)
        })
        $(".SinkNode").change(function(){
            var neid=$(this).val();
            var protData=[];
            for(var j in prot){
                if((neid==prot[j].neName && prot[j].pgId=="") || prot[j].pgId==fixID){
                    protData.push(prot[j]);
                }
            }
            var protHtml="";
            for(var k in protData){
                protHtml+="<option value='"+protData[k].name+"'>"+protData[k].name+"</option>"
            }
            $(".SinkPort").html(protHtml)
        })


        $(".Sourcenode").change();
        $(".SinkNode").change()

        var route=datas.routes
        console.log(route)
        var routeHtml="";
        for(var i in route){
            if(route[i].pgId=="" || route[i].pgId==fixID){
                routeHtml+="<option value='"+route[i].name+"'>"+route[i].name+"</option>"
            }

        }



        var mains=datas.routes
        var mianHtml="";
        for(var i in mains){
            if(mains[i].pgId=="" || mains[i].pgId==fixID){
                mianHtml+="<option value='"+mains[i].name+"'>"+mains[i].name+"</option>"
            }
        }
        $(".mainrouts").html(routeHtml)
        $(".Sparerouts").html(mianHtml)



        $(".Sparerouts").change(function(){
        })
        $(".mainrouts").change(function(){
            /*   switch (val){
             case " ODU4ODU0-1-1-71-2-17":
             $(".Sparerouts").val("ODU4ODU0-1-1-71-1-17")
             break;
             case "ODU4ODU0-1-1-71-1-17":
             $(".Sparerouts").val("ODU4ODU0-1-1-71-2-17")
             break;
             case "ODU4ODU1-1-1-71-2-18":
             $(".Sparerouts").val("ODU4ODU1-1-1-71-1-18")
             break;
             case "ODU4ODU1-1-1-71-1-18":
             $(".Sparerouts").val("ODU4ODU1-1-1-71-2-18")
             break;
             case "ODU4ODU2-1-1-71-2-1":
             $(".Sparerouts").val("ODU4ODU2-1-1-71-1-1")
             break;
             case "ODU4ODU2-1-1-71-1-1":
             $(".Sparerouts").val("ODU4ODU2-1-1-71-2-1")
             break;
             case "ODU4ODU2-1-1-71-2-9":
             $(".Sparerouts").val("ODU4ODU2-1-1-71-1-9")
             break;
             case "ODU4ODU2-1-1-71-1-9":
             $(".Sparerouts").val("ODU4ODU2-1-1-71-2-9")
             break;
             case "11QPA4-1-8-L1":
             $(".Sparerouts").val("11QPA4-1-8-L3")
             break;
             case "11QPA4-1-8-L3":
             $(".Sparerouts").val("11QPA4-1-8-L1")
             break;
             }*/
            var minaROute=$(this).val()
            $.getJSON(server_path+'/oms1350/web/eqm/omc_all/data/7_3_1/pg.json',function(data){
                var mains=data.routes;
                var mianHtml="";
                for(var i in mains){
                    if(mains[i].name==minaROute){
                        mains.splice(i,1)
                    }
                }
                console.log(mains)
                for(var i in mains){
                    if(mains[i].pgId=="" || mains[i].pgId==fixID){
                        mianHtml+="<option value='"+mains[i].name+"'>"+mains[i].name+"</option>"
                    }
                }
                $(".Sparerouts").html(mianHtml)
            })
        })
/*        $(".mainrouts").change();*/
        setTimeout(function(){
            $(".Sparerouts").change()
        },1000)
    })
}

/*获取Loction*/
var getLOcation=function(){
    var pgs=localStorage.getItem("pg");
    var data=JSON.parse(pgs);

    var html="";
    for(var i in data){
        html+="<tr><td><input type='checkbox' value='"+data[i].id+"' onclick='tdcheck(event)'></td><td>"+data[i].name+"</td>" +
            "<td>"+data[i].type+"</td>" +
            "<td>"+data[i].back+"</td>" +
            "<td>"+data[i].time+"</td>" +
            "<td>"+data[i].Sourcenode+"</td>" +
            "<td>"+data[i].SourcePort+"</td>" +
            "<td>"+data[i].SinkNode+"</td>" +
            "<td>"+data[i].SinkPort+"</td> " +
            "<td>使能</td> " +
            "<td>Normarl</td>" +
            "<td>"+data[i].status+"</td>" +
            "    <td><button list='"+data[i].id+"' onclick='fixPg(event)'>修改</button></td></tr>"
    }
    $(".ProList").html(html)
}
var getRefreshs=function(data){
    var datamoop=data;
    var html="";
    for(var i in data){
        var Sparers=data[i].SparerSource.split("-");
        var OPer=Sparers[0].substring(4)
        html+="<tr><td><input type='checkbox' style='position: inherit;opacity: 1;left: 0px'  value='"+data[i].id+"' onclick='tdcheck(event)'></td>" +
            "<td><a href='javascript:void(0);' onclick='checkCard(event)' value='"+data[i].id+"'>"+data[i].name+"</a></td>" +
            "<td>"+data[i].type+"</td>" +
            "<td>"+data[i].back+"</td>" +
            "<td>"+data[i].time+"</td>" +
            "<td>"+data[i].Sourcenode+"</td>" +
            "<td>"+data[i].SourcePort+"</td>" +
            "<td>"+data[i].SinkNode+"</td>" +
            "<td>"+data[i].SinkPort+"</td> " +
            "<td>"+data[i].SNpro+"</td> " +
            "<td>Normal</td>" +
            "<td>"+data[i].status+"</td>" +
                /* "<td>"+data[i].Locking+"</td>" +*/
            "<td>"+data[i].SparerSource+"</td>" +
            "<td>"+data[i].EWYW+"</td>" +
            "<td>"+OPer+"</td>" +
            "    <td><button list='"+data[i].id+"' onclick='fixPg(event)' class='PGBtnStyle'>修改</button></td></tr>"
    }
    $(".ProList").html(html)
    try {
        checkCard(data[0].id);
    }catch (e){}
    $(".thcheck").removeAttr("checked");
    checkCard();
}
var displayDom=function(){
    setTimeout(function(){
        $("#CreateDlg").hide();
        $("#ConfrimDlg").hide();
        $("#operation").hide();
    },2000)
}

//确认弹窗
$(".btnConfrim").click(function(){
    /*$("#ConfrimDlg").show();*/
    showTItle("ConfrimDlg","确认操作?")
})
//创建弹窗
$(".createPro").click(function(){
  /*  $("#CreateDlg").show();*/
    initCreate();
    Coformstatus="create"
    $(".userlabel").val("");
    showTItle("CreateDlg","保护组创建")
    $(".SinkPort").removeAttr("disabled");
})

/*Refresh*/
$(".Refresh").click(function(){
    getPGurl();
})

//---------------------------------
$(".sure").click(function(){
   /* $("#operation").show();*/
    showTItle("operation","提示")
    setTimeout(function(){
        if(Coformstatus=="create"){
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
            var datas={
                id:now,
                status:"未倒换",
                name:$(".userlabel").val(),
                type:$(".type").val(),
                back:$(".back").val(),
                time:$(".time").val(),
                Sourcenode:$(".Sourcenode").val(),
                SourcePort:$(".SourcePort").val(),
                SinkNode:$(".SinkNode").val(),
                SinkPort:$(".SinkPort").val(),
                mainroutsId:$(".mainrouts").val(),
                SpareroutsId:$(".Sparerouts").val(),
                "SparerSource":$(".mainrouts").val(),
                "SNpro":$(".SNpro").val(),
                "EWYW":$(".EWYW").val(),
                 Locking:"否"
            }
            for(var i in PgList.port){
                if(PgList.port[i].name==datas.SourcePort){
                    PgList.port[i].pgId=now;
                }
                if(PgList.port[i].name==datas.SinkPort){
                    PgList.port[i].pgId=now;
                }
            }

            for(var i in PgList.routes){
                if(PgList.routes[i].name==datas.mainroutsId){
                    PgList.routes[i].pgId=now;
                }
                if(PgList.routes[i].name==datas.SpareroutsId){
                    PgList.routes[i].pgId=now;
                }
            }

            console.log(PgList.port);


            /* var pgs=localStorage.getItem("pg");*/
            var data=PgList.pg;
            data.push(datas);
            /* var str=JSON.stringify(data)
             localStorage.setItem("pg",str);*/
            PgList.pg=data;
            setTimeout(function(){
                initCreate();
                $("#CreateDlg").hide();
                $("#ConfrimDlg").hide();
                $("#operation").hide();
            },2000)
            getRefreshs(data);
            postData(PgList)
            /*   getLOcation();*/



        }
        else if( Coformstatus=="Switching"){
            /*  var pgs=localStorage.getItem("pg");
             var data=JSON.parse(pgs);*/
            var data=PgList.pg;
            var arry=[];
            $('input:checkbox').each(function() {
                if ($(this).attr('checked')=="checked" && $(this).val()!="on") {
                    arry.push($(this).val())
                }
            });

            var pgname="";
            var pgnames="";
            var hoop=""
            for(var i in  data){
                for(var j in arry ){
                    if(data[i].id==arry[j] && data[i].status=="锁定到主"){
                        pgname+="<span>"+data[i].name+"</span>   "
                    }
                    if(data[i].id==arry[j] && data[i].status=="自动倒换到备"){
                        pgnames+="<span>"+data[i].name+"</span>   "
                    }

                    if(data[i].id==arry[j] && data[i].status=="强制到备路由"){
                        hoop+="<span>"+data[i].name+"</span>   "
                    }

                    if(data[i].id==arry[j]  && data[i].status!="锁定到主" && data[i].status!="自动倒换到备" && data[i].status!="强制到备路由"){
                        if(data[i].status=="人工到备"){
                            data[i].status="人工到主";
                            data[i].SparerSource=data[i].mainroutsId;
                        }else {
                            data[i].status="人工到备";
                            data[i].SparerSource=data[i].SpareroutsId
                        }
                     /*   var mainroutsId= data[i].mainroutsId;
                        var SpareroutsId= data[i].SpareroutsId;
                        data[i].mainroutsId=SpareroutsId;
                        data[i].SpareroutsId=mainroutsId;*/
                    }
                }
            }

            if(pgname!=""){
                $("#titleNE").html(pgname+"禁止人工倒换")
                showTItle("titleNE","提示");
                var pg="pg";
            }
            if(pgnames!=""){
                $("#titleNE").html(pgnames+"禁止人工倒换")
                showTItle("titleNE","提示");
                var pg="pg";
            }
            if(hoop!=""){
                $("#titleNE").html(hoop+"禁止人工倒换")
                showTItle("titleNE","提示");
                var pg="pg";
            }

            PgList.pg=data;
            console.log(data)
            /*   var str=JSON.stringify(data)
             localStorage.setItem("pg",str);*/
            setTimeout(function(){
                $("#CreateDlg").hide();
                $("#ConfrimDlg").hide();
                $("#operation").hide();
            },2000)
            getRefreshs(data);
            postData(PgList,pg);
            checkCard("",PgList.pg[0].id)
            /*     getLOcation();*/
        }
        else if(Coformstatus=="Switchings"){
            setTimeout(function(){
                $("#CreateDlg").hide();
                $("#ConfrimDlg").hide();
                $("#operation").hide();
            },2000)
        }
        else if(Coformstatus=="fix"){
            var datas={
                id:"",
                status:"未倒换",
                name:$(".userlabel").val(),
                type:$(".type").val(),
                back:$(".back").val(),
                time:$(".time").val(),
                Sourcenode:$(".Sourcenode").val(),
                SourcePort:$(".SourcePort").val(),
                SinkNode:$(".SinkNode").val(),
                SinkPort:$(".SinkPort").val(),
                mainroutsId:$(".mainrouts").val(),
                SpareroutsId:$(".Sparerouts").val(),
                "SparerSource":$(".mainrouts").val(),
                "SNpro":$(".SNpro").val(),
                "EWYW":$(".EWYW").val(),
                Locking:"否"
            }
            var data=PgList.pg;
            for(var i in data){
                if(data[i].id==$("#ids").val()){
                    datas.id=$("#ids").val();
                    data[i]=datas;
                }
            }
            for(var i in PgList.routes){
                if(PgList.routes[i].pgId==fixID){
                    PgList.routes[i].pgId="";
                }
            }

            for(var i in PgList.routes){
                if(PgList.routes[i].name==datas.mainroutsId){
                    PgList.routes[i].pgId=fixID;
                }
                if(PgList.routes[i].name==datas.SpareroutsId){
                    PgList.routes[i].pgId=fixID;
                }
            }
            //---------------------------
            for(var i in PgList.port){
                if(PgList.port[i].name==datas.SourcePort){
                    PgList.port[i].pgId="";
                }
                if(PgList.port[i].name==datas.SinkPort){
                    PgList.port[i].pgId="";
                }
            }




            PgList.pg=data;
            console.log( PgList.pg)
            getRefreshs(PgList.pg)
            postData(PgList)
            displayDom();
        }
        else if(Coformstatus=="working"){
            var arry=[];
            $('input:checkbox').each(function() {
                if ($(this).attr('checked')=="checked" && $(this).val()!="on") {
                    arry.push($(this).val())
                }
            });
            var data=PgList.pg;
            for(var j in arry){
                for(var i in data){
                    if(data[i].id==arry[j]){
                        data[i].Locking="是";
                        data[i].status="锁定到主";
                        data[i].SparerSource=data[i].mainroutsId;
                    }
                }
            }


            PgList.pg=data;
            getRefreshs(PgList.pg)
            displayDom();
            postData(PgList)
            checkCard("",PgList.pg[0].id)
        }
        else if(Coformstatus=="release"){
            var arry=[];
            $('input:checkbox').each(function() {
                if ($(this).attr('checked')=="checked" && $(this).val()!="on") {
                    arry.push($(this).val())
                }
            });
            var data=PgList.pg;
            for(var j in arry){
                for(var i in data){
                    if(data[i].id==arry[j]){
                        data[i].Locking="否";
                        data[i].status="未倒换";
                        data[i].SparerSource=data[i].mainroutsId;
                    }
                }
            }
            console.log(data)

            PgList.pg=data;
            getRefreshs(PgList.pg)
            displayDom();
            postData(PgList)
            checkCard("",PgList.pg[0].id)
        }
        else if(Coformstatus=="delect"){
            var arry=[];
            $('input:checkbox').each(function() {
                /*alert($(this).attr('checked'))*/
                if ($(this).attr('checked')=="checked" && $(this).val()!="on") {
                    arry.push($(this).val())
                }
            });
            console.log(arry);
            /*    var pgs=localStorage.getItem("pg");*/
            var data=PgList.pg;

            for(var g in arry){
                for(var t in data){
                    if(arry[g]==data[t].id){
                        for(var k in PgList.port){
                            if(PgList.port[k].name==data[t].SourcePort){
                                PgList.port[k].pgId="";
                            }
                            if(PgList.port[k].name==data[t].SinkPort){
                                PgList.port[k].pgId="";
                            }
                        }



                        for(var i in PgList.routes){
                            if(PgList.routes[i].name==data[t].mainroutsId){
                                PgList.routes[i].pgId="";
                            }
                            if(PgList.routes[i].name==data[t].SpareroutsId){
                                PgList.routes[i].pgId="";
                            }
                        }

                        data.splice(t,1)
                    }
                }
            }
            console.log(data)
            PgList.pg=data;
            /*    var str=JSON.stringify(data)
             localStorage.setItem("pg",str);*/
            getRefreshs(PgList.pg)
            postData(PgList)
            setTimeout(function(){
                initCreate();
            },2000)
            $(".routeList").html("")
        }
        else if(Coformstatus=="qzSwitching"){
            /*  var pgs=localStorage.getItem("pg");
             var data=JSON.parse(pgs);*/
            var data=PgList.pg;
            var arry=[];
            $('input:checkbox').each(function() {
                if ($(this).attr('checked')=="checked" && $(this).val()!="on") {
                    arry.push($(this).val())
                }
            });

            var pgname=""
            for(var i in  data){
                for(var j in arry ){
                    if(data[i].id==arry[j] && data[i].status=="锁定到主"){
                        pgname+="<span>"+data[i].name+"</span>   "
                    }
                    if(data[i].id==arry[j] && data[i].status!="锁定到主"){
                        data[i].status="强制到备路由";
                        data[i].SparerSource=data[i].SpareroutsId
                       /* if(data[i].status=="已倒换"){
                            data[i].status="未倒换";
                            data[i].SparerSource=data[i].mainroutsId;
                        }else {
                            data[i].status="强制到副";
                            data[i].SparerSource=data[i].SpareroutsId
                        }*/
                    }
                }
            }

            if(pgname!=""){
                $("#titleNE").html(pgname+"禁止强制倒换")
                showTItle("titleNE","提示");
                var pg="pg";
            }

            PgList.pg=data;
            console.log(data)
            /*   var str=JSON.stringify(data)
             localStorage.setItem("pg",str);*/
            setTimeout(function(){
                $("#CreateDlg").hide();
                $("#ConfrimDlg").hide();
                $("#operation").hide();
            },2000)
            getRefreshs(data);
            postData(PgList,pg);
            checkCard("",PgList.pg[0].id)
        }
    },2000)

})
$(".no").click(function(){
    var tempdialog = dialog.getCurrent();
    if(tempdialog != undefined){
        tempdialog.close();
    }
})


//修改pg
var fixPg=function(event){

   /* $("#CreateDlg").show();*/
    showTItle("CreateDlg","保护组修改")
    Coformstatus="fix";
    var data=PgList.pg;
    console.log(data)
        //---------------------------------------
        var pgcard={};
        var id=$(event.target).attr("list")
        fixID=id;
        initfixPanel();
    setTimeout(function(){
        console.log(id)
        for(var i in data){
            if(data[i].id==id){
                pgcard=data[i];
            }
        }
        $("#ids").val(pgcard.id)
        $(".userlabel").val(pgcard.name)
        $(".type").val(pgcard.type)
        $(".back").val(pgcard.back)
        $(".time").val(pgcard.time)
        $(".Sourcenode").val(pgcard.Sourcenode)
        $(".SourcePort").val(pgcard.SourcePort)
        $(".SinkNode").val(pgcard.SinkNode)
        $(".SinkPort").val(pgcard.SinkPort)
        $(".mainrouts").val(pgcard.mainroutsId)
        $(".Sparerouts").val(pgcard.SpareroutsId)
        $(".SNpro").val(pgcard.SNpro)
        $(".EWYW").val(pgcard.EWYW)
    },300)

}

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


//delect
$(".delect").click(function(){
    Coformstatus="delect"
    showTItle("ConfrimDlg","删除")
})

var tdcheck=function(event){
    if($(event.target).attr("checked")==undefined){
        $(event.target).attr("checked",'checked');
    }else {
        $(event.target).removeAttr("checked");
    }

}
$(".Switching").click(function(){
    Coformstatus="Switching"
  /*  $("#ConfrimDlg").show();*/
    showTItle("ConfrimDlg","倒换")
})
$(".Switchings").click(function(){
    Coformstatus="Switchings"
  /*  $("#ConfrimDlg").show();*/
    showTItle("ConfrimDlg","倒换")
})
$(".working").click(function(){
    Coformstatus="working"
/*    $("#ConfrimDlg").show();*/
    showTItle("ConfrimDlg","锁定")
})
$(".release").click(function(){
    Coformstatus="release"
    $("#ConfrimDlg").show();
    showTItle("ConfrimDlg","释放")
})
$(".qzSwitching").click(function(){
    Coformstatus="qzSwitching"
    /*  $("#ConfrimDlg").show();*/
    showTItle("ConfrimDlg","倒换")
})

var postData=function(data,pg){
    var tempData = {
        'content':JSON.stringify(data),
        'filename':'/oms1350/web/eqm/omc_all/data/7_3_1/pg.json'}
    $.post(cgi_path, tempData, function(resp) {
        $('#wait_save_eth').hide();
        if(resp == 'success') {
            if(pg!="pg"){
                showTItle("DLGsuccess","提示");
            }
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
