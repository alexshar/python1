
    //控制平面故障与性能管理;
    //dlg
    var server_path = 'https://135.251.96.98:8443';
    var cgi_path = "https://135.251.96.98:8443/cgi-bin/test.cgi";

    var box=$(".communicationItemBox");
    var title=$(".communicationItemTitle")
    var nodeTitle=$(".nodeItemTitle");
    var nodeBox=$(".nodeItemBox");
    var contionType=$("#communicationTypeCon")
    var Type="OSPF";
    var alarmList={};
    var node={};
    var per_url= "https://135.251.96.98:8443/oms1350/web/eqm/omc_all/data/13_3/cpFaultPerfMng.json";
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
    function toTime(TIME){
        var d = new Date(TIME);
        var time=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
        return time
    }
    function timeInterval(TIME){
        var tmNow=(new Date()).getTime()
        var inter=tmNow-TIME
        var t=parseInt(inter/ (1000 * 60 * 60 * 24))+" day "
            +parseInt((inter % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))+" hour "
            +parseInt((inter % (1000 * 60 * 60)) / (1000 * 60));
        if(parseInt(inter % (1000 * 60) / 1000)<10){
            return t+":0"+parseInt(inter % (1000 * 60) / 1000)
        }else{
            return t+":"+parseInt(inter % (1000 * 60) / 1000)
        }
		console.log(t);
		debugger;

    }
    function cpInit(){
        box.removeClass("itemBoxActive")
        box.eq(0).addClass("itemBoxActive");
        $(".communicationTypeCon>li").eq(0).css("background","#fff");
        alarmList.OSPF=[];
        alarmList.RSVP=[];
        alarmList.LMP=[];
        $.getJSON(per_url, function (data){
            myData=data;
            node.NE=myData.NE;
            node.STARTTIME=myData.STARTTIME;
            node.BUSINESS=myData.BUSINESS;
            for(var i in myData.ALARM){
                if(myData.ALARM[i].type==Type){
                    alarmList.OSPF.push(myData.ALARM[i])
                }else if(myData.ALARM[i].type=="RSVP"){
                    alarmList.RSVP.push(myData.ALARM[i])
                }else{
                    alarmList.LMP.push(myData.ALARM[i])
                }
            }
            createTd(alarmList.OSPF,"OSPF")
            createTd(alarmList.RSVP,"RSVP")
            createTd(alarmList.LMP,"LMP")
            //NE
            var ne=""
            for(var n in node.NE){
                ne+="<tr><td>"+node.NE[n].userLabel+"</td><td>"+node.NE[n].ipAddress+"</td><td>"+toTime(node.NE[n].startTime)+"</td><td>"+node.NE[n].CrankBack+"</td><td>"+node.NE[n].status+"</td></tr>"
            }
            $("#node").find("tbody").append(ne)
            //node Info
            var neInfo=""
            for(var e in node.STARTTIME){
                neInfo+="<tr><td>"+node.STARTTIME[e].userLabel+"</td><td>"+node.STARTTIME[e].type+"</td><td>"+toTime(node.STARTTIME[e].startTime)+"</td><td>"+node.STARTTIME[e].CrankBack+"</td></tr>"
            }
            $("#nodeInfo").find("tbody").append(neInfo)
            //BUSINESS
            var business=""
            for(var b in node.BUSINESS){
                business+="<tr><td>"+node.BUSINESS[b].userLabel+"</td><td>"+node.BUSINESS[b].type+"</td><td>"+toTime(node.BUSINESS[b].startTime)+"</td><td class='timeCoun'>"+timeInterval(parseInt(node.BUSINESS[b].startTime))+"</td><td>"+node.BUSINESS[b].rotateCount+"</td><td>"+node.BUSINESS[b].routeCount+"</td></tr>"
            }
            $("#businessInfo").find("tbody").append(business)
            //TE
            var te=""
            for(var t in myData.ALARM){
                if(myData.ALARM[t].conType !=""){
                    te+="<tr><td>"+myData.ALARM[t].userLabel+"</td><td>"+myData.ALARM[t].conType+"</td><td>"+myData.ALARM[t].cause+"</td><td>"+myData.ALARM[t].status+"</td></tr>"
                }

            }
            $("#TE").find("tbody").append(te)

        })

    }
    cpInit();
    setInterval(function (){
        for(var ti in myData.BUSINESS){
            $(".timeCoun").eq(ti).html(timeInterval(node.BUSINESS[ti].startTime))
        }
    },10000)
    function createTd(obj,dom){
        var html=""
        for(var j in obj){
            html+="<tr><td>"+obj[j].userLabel+"</td><td>"+obj[j].httpId+"</td><td>"+obj[j].cause+"</td><td>"+obj[j].status+"</td></tr>"
        }
        $("#"+dom).find("tbody").append(html)
    }
    title.click(function(e){
        var ind =$(this).index();
        box.removeClass("itemBoxActive")
        $(title).removeClass("domFocus")
        box.eq(ind).addClass("itemBoxActive ");
        $(title).eq(ind).addClass("domFocus")
    })
    nodeTitle.click(function(e){
        var ind =$(this).index();
        nodeBox.removeClass("itemBoxActive")
        nodeTitle.removeClass("domFocus");
        nodeBox.eq(ind).addClass("itemBoxActive");
        nodeTitle.eq(ind).addClass("domFocus");
    })
    contionType.find("li").click(function(e){
        var ind=$(this).index();
        $(this).siblings().removeClass("domFocus")
        $(this).addClass("domFocus");
        $(".communicationList").removeClass("itemBoxActive");
        $(".communicationList").eq(ind).addClass("itemBoxActive");
    })

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
    }
    getJSON('get', server_path+'/oms1350/web/eqm/omc_all/data/13_2/cp1.json', initTopo);
    //TOPO RENDER
    var canvas = document.getElementById("rockCanvas");
    var content = document.getElementById("rockContent");
    var ctx = canvas.getContext("2d");
    var divEle = document.getElementById('rockView');
    var divEleW = divEle.clientWidth;
    var divEleH = $(window).width();
    var drawNEList = [];
    var drawConnectionList = [];

    canvas.width = divEleW*0.9;
    canvas.height = divEleH* 0.35;

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
            draw("#009139")
        } else if (alarmState == "CLEARED") {
            draw("#009139")
        }

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


    $('#content').hide();
    function showTopo(){
        getJSON('get', server_path+'/oms1350/web/eqm/omc_all/data/13_2/cp1.json', initTopo);
		renderShow.init(topoData)
        $('#content').show();
    }

