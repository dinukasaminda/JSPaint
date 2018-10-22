var win_width = undefined;
var win_height = undefined;
var bg_path = "./hand.png";
var bg_image = new Image();

var mouse = {
  x: undefined,
  y: undefined
};

var lastx = 0;
var lasty = 0;

var canvas,
  ctx,
  flag = false,
  prevX = 0,
  currX = 0,
  prevY = 0,
  currY = 0,
  dot_flag = false,
  aspectRatio = 1;

var canvasOffsetTop = 0;
var canvasOffsetLeft = 0;
var drawStyle = "black";
var drawPointWidth = 2;

var BgimageResolution = 0;
var img_draw_width = 0;
var img_draw_heigth = 0;

function init() {
  canvas = document.getElementById("main_canv");
  ctx = canvas.getContext("2d");
  console.log("canvas intitiate.");

  // w = canvas.width;
  //h = canvas.height;

  var canvElm = $("#main_canv");
  w = canvElm.width();
  h = canvElm.height();
  canvas.width = w;
  canvas.height = h;
  console.log([w, h]);

  aspectRatio = h / w;
  console.log(aspectRatio);

  BgimageResolution = bg_image.height / bg_image.width;
  console.log(BgimageResolution);

  img_draw_width = w - 100;
  img_draw_heigth = img_draw_width * BgimageResolution;
  console.log([img_draw_width, img_draw_heigth]);
  console.log(canvElm.offset());

  canvasOffsetTop = canvElm.offset().top;
  canvasOffsetLeft = canvElm.offset().left;

  loadData();

  canvas.addEventListener(
    "mousemove",
    function(e) {
      //console.log(e.clientY - canvasOffsetTop);
      findxy("move", e);
    },
    false
  );
  canvas.addEventListener(
    "mousedown",
    function(e) {
      findxy("down", e);
    },
    false
  );
  canvas.addEventListener(
    "mouseup",
    function(e) {
      findxy("up", e);
    },
    false
  );
  canvas.addEventListener(
    "mouseout",
    function(e) {
      findxy("out", e);
    },
    false
  );
}

var canvasData = {
  drawLines: [],
  textList: []
};

var fontSize = $("#fontSizeRange").val();

$("#fontSizeRange").change(el => {
  fontSize = $("#fontSizeRange").val();
  $("#fontSizeRangeLbl").html(fontSize);
});
function addNewText() {
  var text = $("#textInput1").val();

  console.log(text);
  canvasData.textList.push({
    location: [200, 250],
    text: text,
    fontSize: fontSize,
    color: "red",
    id: "" + Date.now()
  });

  var textListcombElmnt = $("#textListcomb");
  textListcombElmnt.empty();

  canvasData.textList.forEach(el => {
    console.log(el.id);
    textListcombElmnt.append(new Option(el.text, el.id));
  });

  draw();
}
function draw() {
  clearCanvas();
  /*
  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText("Hello World", canvas.width/2, canvas.height/2); 

  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(currX, currY);

  ctx.strokeStyle = drawStyle;
  ctx.lineWidth = drawPointWidth;

  canvasData.drawLines.push({
    startPoint: [prevX, prevY],
    endPoint: [currX, currY],
    strokeStyle: drawStyle,
    lineWidth: drawPointWidth
  });*/

  if (bg_image != undefined) {
    ctx.drawImage(bg_image, 50, 50, img_draw_width, img_draw_heigth);
  }
  canvasData.drawLines.forEach(line => {
    ctx.beginPath();
    ctx.moveTo(line.startPoint[0], line.startPoint[1]);
    ctx.lineTo(line.endPoint[0], line.endPoint[1]);

    ctx.strokeStyle = line.strokeStyle;
    ctx.lineWidth = line.lineWidth;
    ctx.stroke();
    ctx.closePath();
  });
  canvasData.textList.forEach(textObj => {
    ctx.fillStyle = textObj.color;
    ctx.font = textObj.fontSize + "px Comic Sans MS";
    ctx.textAlign = "center";
    ctx.fillText(textObj.text, textObj.location[0], textObj.location[1]);

    var textWidth = ctx.measureText(textObj.text).width;
    var textHeight = ctx.measureText("M").width;
    ctx.rect(
      textObj.location[0] - textWidth / 2,
      textObj.location[1] - textHeight,
      textWidth,
      textHeight
    );
    ctx.stroke();
  });

  //console.log(drawLines.length);
}

function clearCanvas() {
  ctx.clearRect(0, 0, w, h);
}
function saveToJson() {
  var exportData = JSON.stringify(canvasData);
  //console.log(exportData);
  // var encodedUri = encodeURI(exportData);
  // var newWindow = window.open(encodedUri);
  $.ajax({
    method: "POST",
    url: "/save",
    dataType: "json",
    contentType: "application/json",
    data: exportData
  }).done(function(msg) {
    console.log("Data Saved: " + msg);
  });
}
function loadData() {
  $.ajax({
    method: "get",
    url: "/restore"
  }).done(function(data) {
    canvasData = data.canvasData;
    draw();
  });
}

function save() {
  document.getElementById("canvasimg").style.border = "2px solid";
  var dataURL = canvas.toDataURL();
  document.getElementById("canvasimg").src = dataURL;
  document.getElementById("canvasimg").style.display = "inline";
}

function findxy(res, e) {
  if (res == "down") {
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvasOffsetLeft;
    currY = e.clientY - canvasOffsetTop;

    flag = true;
    dot_flag = true;
    if (dot_flag) {
      ctx.beginPath();
      ctx.fillStyle = drawStyle;
      ctx.fillRect(currX, currY, 2, 2);
      ctx.closePath();
      dot_flag = false;
    }
  }
  if (res == "up" || res == "out") {
    flag = false;
  }
  if (res == "move") {
    if (flag) {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvasOffsetLeft;
      currY = e.clientY - canvasOffsetTop;

      canvasData.drawLines.push({
        startPoint: [prevX, prevY],
        endPoint: [currX, currY],
        strokeStyle: drawStyle,
        lineWidth: drawPointWidth
      });
      draw();
    }
  }
}

bg_image.onload = function() {
  init();
};
bg_image.src = bg_path;
