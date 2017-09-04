/*
 *
 * 配置数据：
 * 经纬度坐标, 地点名称, 地点图片, 地点详情（介绍）, 地图展示图标, 图标缩放展现级别
 * 
 * 经纬度坐标使用 http://api.map.baidu.com/lbsapi/getpoint/index.html 进行坐标拾取
 * 图标缩放展现级别为当地图缩放级别超过该值时展现图标，否则为红点：0最大（永久展现）, 16默认缩放级别，21最小（地图放至最大时展现）
 * 
 */

var pois = [
    [118.89663,31.891554, "钟楼", "http://img01.cuctv.com/M02/56/F8/dNXNClarDAf2ZAS9AAQahOEyrPU847_1002X4000.jpg", "钟楼","./icons/m.png", 18],
    
];

document.getElementById("allmap").style.height = document.body.clientHeight - 52 + 'px';
// 百度地图API功能	风格：googlelite
map = new BMap.Map("allmap", { minZoom: 15, maxZoom: 21 });
// map.setMapStyle({ style: 'googlelite' });
map.setMapStyle({ styleJson: [
          {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": {
                              "lightness": 20
                    }
          },
          {
                    "featureType": "highway",
                    "elementType": "geometry",
                    "stylers": {
                              "color": "#f49935"
                    }
          },
          {
                    "featureType": "railway",
                    "elementType": "all",
                    "stylers": {
                              "visibility": "off"
                    }
          },
          {
                    "featureType": "local",
                    "elementType": "labels",
                    "stylers": {
                              "visibility": "off"
                    }
          },
          {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": {
                              "color": "#d1e5ff"
                    }
          },
          {
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": {
                              "visibility": "off"
                    }
          },
          {
                    "featureType": "administrative",
                    "elementType": "all",
                    "stylers": {
                              "visibility": "off"
                    }
          },
          {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": {}
          }
]});
map.centerAndZoom(new BMap.Point(118.896581,31.891477), 17);
map.addEventListener("zoomend", showInfo);
map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

var data_info = [];
var item = [];
for (n in pois) {
    item = [pois[n][0], pois[n][1], "<div>" +
        "<img style='float:right;margin:4px' id='imgDemo' src='" + pois[n][3] + "' width='120' height='105' title='" + pois[n][2] + "'/>" +
        "<p style='margin:0;line-height:1.5;font-size:13px;'><h4 style='margin:0 0 5px 0;padding:0.2em 0'>" + pois[n][2] + "</h4>" + pois[n][4] + "</p>" +
        "</div>", pois[n][5], pois[n][6]];
    data_info.push(item);
}
var opts = {
    width: 300,     // 信息窗口宽度
    height: 200,     // 信息窗口高度
    title: "", // 信息窗口标题
    enableMessage: true//设置允许信息窗发送短息
};

showInfo();

function showInfo() {
    map.clearOverlays();
    var zoom = map.getZoom();
    for (var i = 0; i < data_info.length; i++) {
        if (data_info[i][3] != null && data_info[i][4] <= zoom) {
            myIcon = new BMap.Icon(data_info[i][3], new BMap.Size(60, 60));
            var marker = new BMap.Marker(new BMap.Point(data_info[i][0], data_info[i][1]), { icon: myIcon });  // 创建标注
        } else {
            var marker = new BMap.Marker(new BMap.Point(data_info[i][0], data_info[i][1]));  // 创建标注
        }
        var content = data_info[i][2];
        map.addOverlay(marker);               // 将标注添加到地图中
        addClickHandler(content, marker);
    }
}

function addClickHandler(content, marker) {
    marker.addEventListener("click", function (e) {
        openInfo(content, e)
    }
    );
}
function openInfo(content, e) {
    var p = e.target;
    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象 
    map.openInfoWindow(infoWindow, point); //开启信息窗口
}
// 添加带有定位的导航控件
var navigationControl = new BMap.NavigationControl({
    // 靠右下角位置
    anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
    // LARGE类型
    type: BMAP_NAVIGATION_CONTROL_LARGE,
    // 启用显示定位
    enableGeolocation: true
});
map.addControl(navigationControl);
// 添加定位控件
var geolocationControl = new BMap.GeolocationControl();
geolocationControl.addEventListener("locationSuccess", function (e) {
    // 定位成功事件
});
geolocationControl.addEventListener("locationError", function (e) {
    // 定位失败事件
    alert(e.message);
});
map.addControl(geolocationControl);

//搜索建议
function getContent(obj) {
    var kw = jQuery.trim($(obj).val());
    if (kw == "") {
        $("#append").hide().html("");
        return false;
    }
    var html = "";
    for (var i = 0; i < pois.length; i++) {
        if (pois[i][2].indexOf(kw) >= 0) {
            html = html + "<div class='item' onmouseenter='getFocus(this)' onClick='getCon(this);'>" + pois[i][2] + "</div>"
        }
    }
    if (html != "") {
        $("#append").show().html(html);
    } else {
        $("#append").hide().html("");
    }
}
function getFocus(obj) {
    $(".item").removeClass("addbg");
    $(obj).addClass("addbg");
}
function getCon(obj) {
    var value = $(obj).text();

    for (var i = 0; i < pois.length; i++) {
        if (pois[i][2] == value) {
            map.setCenter(pois[i][0], pois[i][1]);
            var pointNew = new BMap.Point(pois[i][0], pois[i][1]);
            var infoWindowNew = new BMap.InfoWindow(data_info[i][2], opts);  // 创建信息窗口对象 
            map.openInfoWindow(infoWindowNew, pointNew); //开启信息窗口
        }
    }
    $("#kw").val(value);
    $("#append").hide().html("");
}
