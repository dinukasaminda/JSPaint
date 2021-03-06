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

  setInterval(() => {
    timeValue += 1;
    draw();
  }, 500);
}
var timeValue = 0;
var canvasData = {
  drawLines: [],
  textList: []
};

function getDrawTemplateString(indexi, drawId) {
  return `<div class="col-md-12" id="${drawId}">
          <label>Layer ${indexi}</label><br>
          <button type="button" onclick="selectDrawLine('${drawId}')" class="btn btn-primary mb-2">select</button>
          <button type="button" onclick="deleteDrawLine('${drawId}')" class="btn btn-primary mb-2">delete</button>
          <hr>
          </div>`;
}
var SelectedColor = "#000000";
$("#colorSelect").change(() => {
  SelectedColor = "" + $("#colorSelect").val();

  if (lastSelectedText != null) {
    for (var i = 0; i < canvasData.textList.length; i++) {
      if (canvasData.textList[i].id == lastSelectedText) {
        canvasData.textList[i].color = SelectedColor;
        break;
      }
    }
    draw();
  }
});
var fontSize = $("#fontSizeRange").val();

$("#fontSizeRange").change(el => {
  fontSize = $("#fontSizeRange").val();
  $("#fontSizeRangeLbl").html(fontSize);
  if (lastSelectedText != null) {
    for (var i = 0; i < canvasData.textList.length; i++) {
      if (canvasData.textList[i].id == lastSelectedText) {
        canvasData.textList[i].fontSize = fontSize;
        break;
      }
    }
    draw();
  }
});
$("#textInput1").keyup(el => {
  var text = $("#textInput1").val();

  if (lastSelectedText != null) {
    for (var i = 0; i < canvasData.textList.length; i++) {
      if (canvasData.textList[i].id == lastSelectedText) {
        canvasData.textList[i].text = text;
        break;
      }
    }
    draw();
  }
});

function clearSelect() {
  lastSelectedText = null;
}
function addNewText() {
  var text = $("#textInput1").val();

  console.log(text);
  canvasData.textList.push({
    location: [200, 250],
    text: text,
    fontSize: fontSize,
    color: "" + SelectedColor,
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
function selectDrawLine(id) {
  for (var i = 0; i < canvasData.drawLines.length; i++) {
    if (canvasData.drawLines[i].id == id) {
      canvasData.drawLines[i].selected = true;
    } else {
      canvasData.drawLines[i].selected = false;
    }
  }
}
function deleteDrawLine(id) {
  for (var i = 0; i < canvasData.drawLines.length; i++) {
    if (canvasData.drawLines[i].id == id) {
      canvasData.drawLines.splice(i, 1);

      $("#" + id).remove();
      break;
    }
  }
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
  canvasData.drawLines.forEach(lineCluster => {
    if (lineCluster.selected) {
      if (timeValue % 2 == 0) {
        ctx.strokeStyle = "#000000";
      } else {
        ctx.strokeStyle = "#fefefe";
      }
    } else {
      ctx.strokeStyle = lineCluster.strokeStyle;
    }

    ctx.lineWidth = lineCluster.lineWidth;

    lineCluster.lines.forEach(line => {
      ctx.beginPath();
      ctx.moveTo(line.startPoint[0], line.startPoint[1]);
      ctx.lineTo(line.endPoint[0], line.endPoint[1]);

      ctx.stroke();
      ctx.closePath();
    });
  });

  drawCluster.forEach(line => {
    ctx.strokeStyle = SelectedColor;
    ctx.lineWidth = drawPointWidth;
    ctx.beginPath();
    ctx.moveTo(line.startPoint[0], line.startPoint[1]);
    ctx.lineTo(line.endPoint[0], line.endPoint[1]);

    ctx.stroke();
    ctx.closePath();
  });

  canvasData.textList.forEach(textObj => {
    ctx.fillStyle = textObj.color;
    ctx.font = textObj.fontSize + "px Comic Sans MS";
    ctx.textAlign = "center";
    ctx.fillText(textObj.text, textObj.location[0], textObj.location[1]);

    if (textObj.hover || textObj.id == lastSelectedText) {
      var textWidth = ctx.measureText(textObj.text).width;
      var textHeight = ctx.measureText("M").width;

      ctx.rect(
        textObj.location[0] - textWidth / 2,
        textObj.location[1] - textHeight,
        textWidth,
        textHeight
      );
      ctx.stroke();
    }
  });

  //console.log(drawLines.length);
}
function deleteSelected() {
  console.log(lastSelectedText);
  console.log(canvasData.textList.length);
  if (lastSelectedText != null) {
    for (var i = 0; i < canvasData.textList.length; i++) {
      console.log(canvasData.textList[i].id == lastSelectedText);
      if (canvasData.textList[i].id == lastSelectedText) {
        canvasData.textList.splice(i, 1);
        break;
      }
    }
  }
  console.log(canvasData.textList.length);
  lastSelectedText = null;
  $("#textInput1").val("");
  draw();
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

    indexItem = 0;
    canvasData.drawLines.forEach(lineCluster => {
      indexItem += 1;
      $("#drawItems").append(getDrawTemplateString(indexItem, lineCluster.id));
    });

    draw();
  });
}

function save() {
  document.getElementById("canvasimg").style.border = "2px solid";
  var dataURL = canvas.toDataURL();
  document.getElementById("canvasimg").src = dataURL;
  document.getElementById("canvasimg").style.display = "inline";
}
var selectedText = null;
var hoverText = null;
var mouseDown = [0, 0];
var lastSelectedText = null;

var drawCluster = [];
function findxy(res, e) {
  var mousex = e.clientX - canvasOffsetLeft;
  var mousey = e.clientY - canvasOffsetTop;
  hoverText = null;
  canvasData.textList.forEach(textObj => {
    ctx.font = textObj.fontSize + "px Comic Sans MS";
    ctx.textAlign = "center";

    var textWidth = ctx.measureText(textObj.text).width;
    var textHeight = ctx.measureText("M").width;
    if (
      textObj.location[0] - textWidth / 2 < mousex &&
      mousex < textObj.location[0] - textWidth / 2 + textWidth &&
      textObj.location[1] - textHeight < mousey &&
      mousey < textObj.location[1]
    ) {
      textObj.hover = true;
      if (res == "down") {
        textObj.downLocation = [textObj.location[0], textObj.location[1]];

        console.log(textObj.color);
        $("#colorSelect").val(textObj.color);
        $("#fontSizeRange").val(textObj.fontSize);
        $("#textInput1").val(textObj.text);
      }
      hoverText = textObj.id;
    } else {
      textObj.hover = false;
    }
  });

  if (res == "down") {
    drawCluster = [];
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvasOffsetLeft;
    currY = e.clientY - canvasOffsetTop;
    mouseDown = [currX, currY];
    if (hoverText != null) {
      selectedText = "" + hoverText;
    }
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
    if (selectedText != null) {
      console.log("lastSelectedText" + lastSelectedText);
      lastSelectedText = "" + selectedText;
    }

    var newId = Date.now();
    if (drawCluster.length > 0) {
      canvasData.drawLines.push({
        lines: JSON.parse(JSON.stringify(drawCluster)),
        strokeStyle: SelectedColor,
        lineWidth: drawPointWidth,
        id: newId
      });
      indexItem += 1;
      console.log(getDrawTemplateString(indexItem, newId));
      $("#drawItems").append(getDrawTemplateString(indexItem, newId));

      drawCluster = [];
    }
    hoverText = null;
    selectedText = null;
  }
  if (res == "move") {
    if (selectedText != null) {
      console.log("hover:" + selectedText);
      for (var i = 0; i < canvasData.textList.length; i++) {
        if (canvasData.textList[i].id == selectedText) {
          canvasData.textList[i].location = [
            canvasData.textList[i].downLocation[0] + (mousex - mouseDown[0]),
            canvasData.textList[i].downLocation[1] + (mousey - mouseDown[1])
          ];

          break;
        }
      }
    }
    if (flag && selectedText == null) {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvasOffsetLeft;
      currY = e.clientY - canvasOffsetTop;

      drawCluster.push({
        startPoint: [prevX, prevY],
        endPoint: [currX, currY]
      });
    }
  }
  draw();
}
var indexItem = 0;
bg_image.onload = function() {
  init();
};
bg_image.src = bg_path;
