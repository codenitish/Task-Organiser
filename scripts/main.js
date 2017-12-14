window.onload = function() {
    var boxID = 1;
    var cellID = 0;
    document.querySelector("#addBox").addEventListener('click', function(e) {
        e.preventDefault();
        var dom = document.createElement("div");
        dom.classList.add("d_box");
        var anchor = document.createElement("a");
        anchor.setAttribute("href", "#");
        anchor.innerHTML = "Add a Card...";
        anchor.classList.add("d_cell");
        dom.appendChild(anchor);
        dom.setAttribute("id", "dbox_" + boxID);
        var close = document.createElement("a");
        close.classList.add('close_card');
        close.setAttribute("id", "remove_card");
        close.setAttribute("onClick", "removeCard(event)");
        dom.appendChild(close);
        boxID++;
        dom.setAttribute("draggable", "true");
        dom.setAttribute("ondragstart", "dragBox(event)");
        dom.setAttribute("ondrop", "dropBox(event)");
        dom.setAttribute("ondragover", "allowDrop(event)");
        document.getElementById("main_wrapper").insertBefore(dom, document.getElementById("addBox"));
    });
    document.addEventListener('click', function(e) {
        if (e && e.target && e.target.classList.contains("d_cell")) {
            var dom = document.createElement("div");
            dom.classList.add("d_cell");
            var input = document.createElement("div");
            input.classList.add('d_input');
            input.setAttribute('contenteditable', 'true');
            dom.appendChild(input);
            dom.setAttribute("draggable", "true");
            dom.setAttribute("id", "dcell_" + cellID);
            cellID++;
            dom.setAttribute("ondragstart", "dragCell(event)");
            e.target.parentNode.prepend(dom);
        }
    })
}

function removeCard(ev) {
    ev.target.parentNode.remove();
}

function dragCell(ev) {
    ev.dataTransfer.setData("id", ev.target.id);
}

function dropBox(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("id");
    var dataBox = ev.dataTransfer.getData("parid");
    if (document.getElementById(data) && document.getElementById(data).classList.contains('d_cell')) {
        var dom = document.getElementById(data).outerHTML;
        var target = ev.target.classList.contains("d_box") ? ev.target : ev.target.closest(".d_box");
        if (!document.querySelectorAll("#" + target.getAttribute("id") + " div.d_cell").length) {
            target.prepend(document.getElementById(data));
        } else {
            var Obj = checkDistance(target.id, ev);
            if (target.id != Obj.id) {
                if (Obj.postion == "top") {
                    document.querySelector("#" + Obj.id).parentNode.insertBefore(document.getElementById(data), document.querySelector("#" + Obj.id));
                } else {
                    document.querySelector("#" + Obj.id).parentNode.insertBefore(document.getElementById(data), document.querySelector("#" + Obj.id).nextSibling);
                }
            }
        }
    }
    if (document.getElementById(dataBox) && document.getElementById(dataBox).classList.contains('d_box')) {
        var source = dataBox;
        var target = ev.target.classList.contains("d_box") ? ev.target.id : ev.target.closest(".d_box").id;
        var sourceHTML = document.querySelector("#" + source).innerHTML;
        var targetHTML = document.querySelector("#" + target).innerHTML;
        document.querySelector("#" + source).innerHTML = targetHTML;
        document.querySelector("#" + target).innerHTML = sourceHTML;
    }
}

function dragBox(ev) {
    ev.dataTransfer.setData("parid", ev.target.id);
}

function findNearestBox(el, container, ev) {
    var totalEl = document.querySelectorAll("#" + container + " .d_box");
    var clientx = ev.clientX;
    var clienty = ev.clientY;
    var distanceBt = 0;
    var postion = "left";
    var elemID = totalEl[0];
    var returnObj = {};
    return returnObj;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function allowDropContainer(ev) {
    ev.preventDefault();
}

function checkDistance(el, pos) {
    var clientx = pos.clientX;
    var clienty = pos.clientY;
    var elems = document.querySelectorAll("#" + el + " div.d_cell");
    var distanceBt = 0;
    var elemID = elems[0];
    var postion = "top";
    var returnObj = {};
    for (var i = 0; i < elems.length; i++) {
        var distance = new Point(clientx, clienty, elems[i].getBoundingClientRect().x, elems[i].getBoundingClientRect().y);
        if (distanceBt == 0 || distanceBt > distance.distanceTo()) {
            distanceBt = distance.distanceTo();
            elemID = elems[i];
        }
    }
    if (clienty > elemID.getBoundingClientRect().y) {
        postion = "bottom";
    }
    returnObj.postion = postion;
    returnObj.id = elemID.getAttribute("id");
    return returnObj;
}

function Point(x, y, x1, y1) {
    this.x = x;
    this.y = y;
    this.x1 = x1;
    this.y1 = y1;
    this.distanceTo = function() {
        return Math.sqrt((Math.pow(this.x1 - this.x, 2)) + (Math.pow(this.y1 - this.y, 2)))
    };
}
