var server_path = 'https://135.251.96.98:8443';
var cgi_path = "https://135.251.96.98:8443/cgi-bin/test.cgi";


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

var SBRInitData;
function initSBRData(data){
    SBRInitData = "";
    SBRInitData = data;
    initSBRtabel();
}
function initSBRData1(data){
    SBRInitData = "";
    SBRInitData = data;
}
getJSON('get', server_path+'/oms1350/web/eqm/omc_all/data/13_1_3/SBR.json', initSBRData);

var forInitData;
function initForData(data){
    forInitData = "";
    forInitData = data;
}
getJSON('get', server_path+'/oms1350/web/eqm/omc_all/data/13_1_3/forever1.json', initForData);


$('#success').hide();
$('#ConfrimDlg2').hide();
function submitData(data,fileName){
    var tempData = {
        'content':JSON.stringify(data),
        'filename':fileName
    }
    setTimeout(function(){
        $.post(cgi_path,tempData,function(resp){
            if(resp == 'success'){
                openQuery('#success','提示信息')
                setTimeout(function(){
                    var tempdialog = dialog.getCurrent();
                    if(tempdialog != undefined){
                        tempdialog.close();
                    }
                },1500);
            }else {
                alert("保存失败")
            }
        })
    },2000);
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
})



function initSBRtabel(){
    $('#SBRcontent').empty();
    var item = SBRInitData.SBR;
    if(item.initState == "UP" && item.recover1 == "DOWN" &&  item.recover2 == "DOWN"){
        var item1 = item.flowcharts.initFlowcharts
        var str = "";
        str += '<tr>'
            +'<td class="tableTh">'+item1.flowchartState+'</td>'
            +'<td class="tableTh">'+item1.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#SBRcontent').append(str);
    }else if(item.recover1 == "UP" && item.initState == "DOWN" && item.recover2 == "DOWN"){
        var item1 = item.flowcharts.initFlowcharts
        var str = "";
        str += '<tr>'
            +'<td class="tableTh">'+item1.flowchartState+'</td>'
            +'<td class="tableTh">'+item1.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#SBRcontent').append(str);
        var item2 = item.flowcharts.recover1Flowcharts
        var str1 = "";
        str1 += '<tr>'
            +'<td class="tableTh">'+item2.flowchartState+'</td>'
            +'<td class="tableTh">'+item2.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#SBRcontent').append(str1);
    }else if(item.recover2 == "UP"&& item.initState == "DOWN" && item.recover1 == "DOWN"){
        var item1 = item.flowcharts.initFlowcharts
        var str = "";
        str += '<tr>'
            +'<td class="tableTh">'+item1.flowchartState+'</td>'
            +'<td class="tableTh">'+item1.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#SBRcontent').append(str);
        var item3 = item.flowcharts.recover2Flowcharts
        var str3 = "";
        str3 += '<tr>'
            +'<td class="tableTh">'+item3.flowchartState+'</td>'
            +'<td class="tableTh">'+item3.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#SBRcontent').append(str3);
    }
}
//foreverCard
function initForTable(){
    $('#foreverContent').empty();
    var item = forInitData.SBR;
    if(item.initState == "UP" && item.recover1 == "UP" && item.recover2 == "DOWN" ){
        var item1 = item.flowcharts.initFlowcharts
        var str = "";
        str += '<tr>'
            +'<td class="tableTh">'+item1.flowchartState+'</td>'
            +'<td class="tableTh">'+item1.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#foreverContent').append(str);
        var item2 = item.flowcharts.recover1Flowcharts
        var str1 = "";
        str1 += '<tr>'
            +'<td class="tableTh">'+item2.flowchartState+'</td>'
            +'<td class="tableTh">'+item2.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#foreverContent').append(str1);
    }else if(item.recover2 == "UP" && item.recover1 == "DOWN" && item.initState == "UP"){
        var item1 = item.flowcharts.initFlowcharts
        var str = "";
        str += '<tr>'
            +'<td class="tableTh">'+item1.flowchartState+'</td>'
            +'<td class="tableTh">'+item1.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#foreverContent').append(str);
        var item2 = item.flowcharts.recover1Flowcharts
        var str1 = "";
        str1 += '<tr>'
            +'<td class="tableTh">'+item2.flowchartState+'</td>'
            +'<td class="tableTh">'+item2.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#foreverContent').append(str1);
        var item3 = item.flowcharts.recover2Flowcharts
        var str3 = "";
        str3 += '<tr>'
            +'<td class="tableTh">'+item3.flowchartState+'</td>'
            +'<td class="tableTh">'+item3.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#foreverContent').append(str3);
    }
}


$('#contuin').hide();
function comfirmApplycation2(){
    openQuery('#contuin',"提示信息");
    var new1 = SBRInitData
    var item = new1.SBR;
    var item1 = item.flowcharts.initFlowcharts;
    $('#SBRcontent').html('<tr>'
        +'<td class="tableTh">'+item1.flowchartState+'</td>'
        +'<td class="tableTh">'+item1.connection[0].userLabel+'</td>'
        +'</tr>')

    new1.SBR.initState = "UP"
    new1.SBR.recover1 = "DOWN"
    new1.SBR.recover2 = "DOWN"
    submitData(new1,'/oms1350/web/eqm/omc_all/data/13_1_3/SBR.json')
}
function resetFlowchart(){
    $('#content').hide();
    openQuery('#ConfrimDlg2',"重置路由");
}

//GRcard

function initGRtabel(){
    $('#GRcontent').empty();
    var item = SBRInitData.SBR;
    if(item.initState == "UP" && item.recover1 == "DOWN"){
        var item1 = item.flowcharts.initFlowcharts
        var str = "";
        str += '<tr>'
            +'<td class="tableTh">'+item1.flowchartState+'</td>'
            +'<td class="tableTh">'+item1.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#GRcontent').append(str);
    }else if(item.recover1 == "UP" && item.initState == "DOWN"){
        var item1 = item.flowcharts.initFlowcharts
        var str = "";
        str += '<tr>'
            +'<td class="tableTh">'+item1.flowchartState+'</td>'
            +'<td class="tableTh">'+item1.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#GRcontent').append(str);
        var item2 = item.flowcharts.recover1Flowcharts
        var str1 = "";
        str1 += '<tr>'
            +'<td class="tableTh">'+item2.flowchartState+'</td>'
            +'<td class="tableTh">'+item2.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#GRcontent').append(str1);
    }else if(item.recover1 == "UP" && item.initState == "UP"){
        var item1 = item.flowcharts.initFlowcharts
        var str = "";
        str += '<tr>'
            +'<td class="tableTh">'+item1.flowchartState+'</td>'
            +'<td class="tableTh">'+item1.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#GRcontent').append(str);
        var item2 = item.flowcharts.recover1Flowcharts
        var str1 = "";
        str1 += '<tr>'
            +'<td class="tableTh">'+item2.flowchartState+'</td>'
            +'<td class="tableTh">'+item2.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#GRcontent').append(str1);
    }
}

//SNCPcard

function initSNCPtable(){
    $('#SNCPcontent').empty();
    var item = SBRInitData.SBR;
    if(item.recover1 == "UP" && item.initState == "UP"){
        var item1 = item.flowcharts.initFlowcharts
        var str = "";
        str += '<tr>'
            +'<td class="tableTh">主用路由</td>'
            +'<td class="tableTh">'+item1.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#SNCPcontent').append(str);
        var item2 = item.flowcharts.recover1Flowcharts
        var str1 = "";
        str1 += '<tr>'
            +'<td class="tableTh">备用路由</td>'
            +'<td class="tableTh">'+item2.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#SNCPcontent').append(str1);
    }
}

//SNCPporRecard
function initSNCPporReTable(){
    $('#SNCPporRecontent').empty();
    var item = SBRInitData.SBR;
    if(item.recover1 == "UP" && item.initState == "UP"){
        var item1 = item.flowcharts.initFlowcharts
        var str = "";
        str += '<tr>'
            +'<td class="tableTh">主用路由</td>'
            +'<td class="tableTh">'+item1.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#SNCPporRecontent').append(str);
        var item2 = item.flowcharts.recover1Flowcharts
        var str1 = "";
        str1 += '<tr>'
            +'<td class="tableTh">备用路由</td>'
            +'<td class="tableTh">'+item2.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#SNCPporRecontent').append(str1);
    }
	if(item.recover1 == "UP" && item.initState == "DOWN"){
        var item1 = item.flowcharts.initFlowcharts
        var str = "";
        str += '<tr>'
            +'<td class="tableTh">主用路由</td>'
            +'<td class="tableTh">'+item1.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#SNCPporRecontent').append(str);
        var item2 = item.flowcharts.recover1Flowcharts
        var str1 = "";
        str1 += '<tr>'
            +'<td class="tableTh">备用路由</td>'
            +'<td class="tableTh">'+item2.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#SNCPporRecontent').append(str1);
    }
	if(item.recover2 == "UP" && item.initState == "DOWN"){
        var item1 = item.flowcharts.initFlowcharts
        var str = "";
        str += '<tr>'
            +'<td class="tableTh">主用路由</td>'
            +'<td class="tableTh">'+item1.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#SNCPporRecontent').append(str);
        var item2 = item.flowcharts.recover1Flowcharts
        var str1 = "";
        str1 += '<tr>'
            +'<td class="tableTh">备用路由</td>'
            +'<td class="tableTh">'+item2.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#SNCPporRecontent').append(str1);
		 var item2 = item.flowcharts.recover2Flowcharts
        var str1 = "";
        str1 += '<tr>'
            +'<td class="tableTh">恢复路由</td>'
            +'<td class="tableTh">'+item2.connection[0].userLabel+'</td>'
            +'</tr>'
        $('#SNCPporRecontent').append(str1);
    }
}

//nav
$("#SBRcard").show();
$("#GRcard").hide();
$("#SNCPcard").hide();
$("#SNCPporRecard").hide();
$("#foreverCard").hide();

$('.znConnToponav li').on('click',function(){
    $("#SBRcard").hide();
    $("#GRcard").hide();
    $("#SNCPcard").hide();
    $("#SNCPporRecard").hide();
    $("#foreverCard").hide();
    $("#content").hide();
    if($(this).attr('conId') == "GRcard"){
        getJSON('get', server_path+'/oms1350/web/eqm/omc_all/data/13_1_3/SBR.json', initSBRData1);
        initGRtabel();
        $("#"+$(this).attr('conId')).show();
    }else if($(this).attr('conId') == "SNCPcard"){
        getJSON('get', server_path+'/oms1350/web/eqm/omc_all/data/13_1_3/SBR.json', initSBRData1);
        initSNCPtable();
        $("#"+$(this).attr('conId')).show();
    }else if($(this).attr('conId') == "SNCPporRecard"){
        getJSON('get', server_path+'/oms1350/web/eqm/omc_all/data/13_1_3/SBR.json', initSBRData1);
        initSNCPporReTable();
        $("#"+$(this).attr('conId')).show();
    }else if($(this).attr('conId') == "foreverCard"){
        getJSON('get', server_path+'/oms1350/web/eqm/omc_all/data/13_1_3/forever1.json', initForData);
        initForTable();
        $("#"+$(this).attr('conId')).show();
    }else{
        getJSON('get', server_path+'/oms1350/web/eqm/omc_all/data/13_1_3/SBR.json', initSBRData);
        $("#"+$(this).attr('conId')).show();
    }

    $('.znConnToponav li').removeClass('choseLi');
    $(this).addClass('choseLi')
})

//topo
var canvas = document.getElementById("rockCanvas");
var content = document.getElementById("rockContent");
var ctx = canvas.getContext("2d");
var divEle = document.getElementById('rockView');
var divEleW = divEle.offsetWidth;
var divEleH = $(window).width();
var drawNEList = [];
var drawConnectionList = [];

canvas.width = divEleW*0.7;
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
        if(this.data.SBR.initState == "UP"){
            for (var a in this.data.SBR.flowcharts.initFlowcharts.connection) {
                var item = this.data.SBR.flowcharts.initFlowcharts.connection[a];
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
                var lineColor = "#2DA7E0"
                var darwConnEle = new drawConnection(connA.x, connA.y, connA.w, connA.h, connZ.x, connZ.y, connZ.w, connZ.h, item.alarmState, item.userLabel, item.connType, item.id,lineColor);
                drawConnectionList.push(darwConnEle);
            }
        }
        if(this.data.SBR.recover1 == "UP"){
            for (var a in this.data.SBR.flowcharts.recover1Flowcharts.connection) {
                var item = this.data.SBR.flowcharts.recover1Flowcharts.connection[a];
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
                var lineColor="#FF00FF"
                var darwConnEle = new drawConnection(connA.x, connA.y, connA.w, connA.h, connZ.x, connZ.y, connZ.w, connZ.h, item.alarmState, item.userLabel, item.connType, item.id,lineColor);
                drawConnectionList.push(darwConnEle);
            }
        }
        if(this.data.SBR.recover2 == "UP"){
            for (var a in this.data.SBR.flowcharts.recover2Flowcharts.connection) {
                var item = this.data.SBR.flowcharts.recover2Flowcharts.connection[a];
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
                var lineColor="#FF00FF"
                var darwConnEle = new drawConnection(connA.x, connA.y, connA.w, connA.h, connZ.x, connZ.y, connZ.w, connZ.h, item.alarmState, item.userLabel, item.connType, item.id,lineColor);
                drawConnectionList.push(darwConnEle);
            }
        }
        if(this.data.SBR.phyConn == "UP"){
            for (var a in this.data.SBR.flowcharts.phyFlowcharts.connection) {
                var item = this.data.SBR.flowcharts.phyFlowcharts.connection[a];
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
                var lineColor="black"
                var darwConnEle = new drawConnection(connA.x, connA.y, connA.w, connA.h, connZ.x, connZ.y, connZ.w, connZ.h, item.alarmState, item.userLabel, item.connType, item.id,lineColor);
                drawConnectionList.push(darwConnEle);
            }
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
                console.log("1")
            }
        }
        ctx.drawImage(image, this.x, this.y, this.w, this.h);
    };
}

function drawConnection(connAx, connAy, connAw, connAh, connZx, connZy, connZw, connZh, alarmState, userLabel, connType, id,lineColor) {
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
    this.lineColor = lineColor;
    this.id = id;
    var X = 0, Y = 0;
    var newConnAx = 0, newConnAy = 0, newConnZx = 0, newConnZy = 0;
    if (this.connAx == this.connZx && this.connAy != this.connZy) {
        if (this.connAx < 200) {
            if (this.connAy < this.connZy) {
                newConnAx = this.connAx + this.connAw
                newConnAy = this.connAy + this.connAh
                newConnZx = this.connZx + this.connZw
                newConnZy = this.connZy
            } else {
                newConnAx = this.connAx + this.connAw
                newConnAy = this.connAy
                newConnZx = this.connZx + this.connZw
                newConnZy = this.connZy + this.connZh
            }
        } else {
            if (this.connAy < this.connZy) {
                newConnAx = this.connAx
                newConnAy = this.connAy + this.connAh
                newConnZx = this.connZx
                newConnZy = this.connZy
            } else {
                newConnAx = this.connAx
                newConnAy = this.connAy
                newConnZx = this.connZx
                newConnZy = this.connZy + this.connZh
            }
        }
        X = newConnAx
        Y = Math.abs(newConnAy - newConnZy) / 2 + (this.connAy < this.connZy ? this.connAy + this.connAh : this.connZy + this.connZh)
    }
    if (this.connAy == this.connZy && this.connAx != this.connZx) {
        if (this.connAy < 100) {
            if (this.connAx < this.connZx) {
                newConnAx = this.connAx + this.connAw
                newConnAy = this.connAy + this.connAh
                newConnZx = this.connZx
                newConnZy = this.connZy + this.connAh
            } else {
                newConnAx = this.connAx
                newConnAy = this.connAy + this.connAh
                newConnZx = this.connZx + this.connAw
                newConnZy = this.connZy + this.connAh
            }
        } else {
            if (this.connAx < this.connZx) {
                newConnAx = this.connAx + this.connAw
                newConnAy = this.connAy
                newConnZx = this.connZx
                newConnZy = this.connZy
            } else {
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
        X = Math.abs(newConnAx - newConnZx) / 2 + this.connAx + this.connAw + Math.abs(newConnAx - newConnZx) * 0.2
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
        ctx.lineWidth = 3
        ctx.strokeStyle = this.lineColor;
        ctx.stroke();
        ctx.closePath();
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
        ctx.lineWidth = 3
        ctx.strokeStyle = this.lineColor;
        ctx.stroke();
        ctx.closePath();
	
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
                    //ctx.beginPath();
                    //ctx.moveTo(newConnAx, newConnAy);
                    //ctx.lineTo(newConnZx, newConnZy);
                    //if (ctx.isPointInPath(X, Y) == 1 || ctx.isPointInPath(X, Y) == true || ctx.isPointInPath(X, Y)) {
                    //ctx.strokeStyle = "#2DA7E0";
                    //ctx.stroke();
                    //return true
                    //}
                    // ctx.closePath();
                } else if (this.connType == "noopsycheConnection") {
                    //ctx.beginPath();
                    //ctx.moveTo(newConnAx, newConnAy);
                    //ctx.quadraticCurveTo(centerX, centerY, newConnZx, newConnZy);
                    //if (ctx.isPointInPath(X, Y) == 1 || ctx.isPointInPath(X, Y) == true || ctx.isPointInPath(X, Y)) {
                    //    ctx.strokeStyle = "#2DA7E0";
                    //    ctx.stroke();
                    //    return true
                    //}
                    //ctx.closePath();
                }
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
//topoData
function showTopo() {
	getJSON('get', server_path + '/oms1350/web/eqm/omc_all/data/13_1_3/SBR.json', initSBRData);
	renderShow.init(SBRInitData)
	$('#content').show();
}

function showTopo2() {
	getJSON('get', server_path + '/oms1350/web/eqm/omc_all/data/13_1_3/SBR.json', initSBRData1);
	initSNCPtable();
	renderShow.init(SBRInitData)
	$('#content').show();
}

function showTopo3() {
	getJSON('get', server_path + '/oms1350/web/eqm/omc_all/data/13_1_3/SBR.json', initSBRData1);
	initSNCPporReTable();
	renderShow.init(SBRInitData)
	$('#content').show();
}

function showTopo4() {
	getJSON('get', server_path + '/oms1350/web/eqm/omc_all/data/13_1_3/forever1.json', initForData);
	initForTable();
	renderShow.init(forInitData)
	$('#content').show();
}

$('#errTip').hide();
function showTopo1() {
	getJSON('get', server_path + '/oms1350/web/eqm/omc_all/data/13_1_3/SBR.json', initSBRData1);
	initGRtabel();
	renderShow.init(SBRInitData)
	$('#content').show();

}