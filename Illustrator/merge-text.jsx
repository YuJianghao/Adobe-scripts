// Adobe Illustrator Script developed by Jianghao.Yu
// 
// Work well on:
// Adobe Illustrator 21.0.0(64 - bit) Windows Edition
// Windows 10 professional build 10.0.16299 x64
// 
// Feature:
// Merge TextFrames to a single one.
// 
// Useage:
// Select TextFrames that you want to merge, then run the script. You can select other object too, like path, the script will just ignore them.
// 
// Logic:
// 1. Select all TextFrames from your selection.
// 2. Create a Area TextFrame.
// 3. Set height of the new TextFrame the same as the heightest TextFrame.
// 4. Set width of the new TextFrame as total width of the TextFrames that you have selected.
// 5. Move all text into the new TextFrame from the old.
// 6. Delete the old TextFrames.
; (function () {
    if (app.documents.length == 0) {
        return;
    }
    var doc = app.activeDocument;
    var tfs = getTfs(doc.selection);
    if (tfs.length < 2) {
        alert("Please select at least two TextFrame!\nFor more information please read notes inside the source code");
        return;
    }
    sort();
    process();
    function getTfs(selected) {
        var tfs = new Array();
        var j = 0;
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].typename == "TextFrame") {
                tfs[j] = selected[i];
                j++;
            }
        }
        return tfs;
    }
    function sort() {
        var arr = new Array();
        var sortedArr = new Array();
        for (var i = 0; i < tfs.length; i++) {
            arr[i] = tfs[i].left;
            sortedArr[i] = tfs[i].left;
        }
        sortedArr = quickSort(sortedArr);
        var maskArr = new Array();
        for (var i = 0; i < arr.length; i++) {
            maskArr[i] = true;
        }
        var newTfs = new Array();
        var idx;
        for (var i = 0; i < arr.length; i++) {
            idx = indexOfArr(arr, maskArr, sortedArr[i]);
            newTfs[i] = tfs[idx];
            maskArr[idx] = false;
        }
        tfs = newTfs;
    }
    function indexOfArr(arr, maskArr, item) {
        for (var i = 0; i < arr.length; i++)
            if (arr[i] == item && maskArr[i])
                return i;
    }
    function process() {
        var top = tfs[0].top,
            left = tfs[0].left,
            height = tfs[0].height,
            width = tfs[0].width;
        for (var i = 1; i < tfs.length; i++) {
            top = tfs[i].top > top ? tfs[i].top : top;
            left = tfs[i].left < left ? tfs[i].left : left;
            height = tfs[i].height > height ? tfs[i].height : height;
            width += tfs[i].width;
        }
        var rectRef = tfs[0].parent.pathItems.rectangle(top, left, width, height);
        var areaTextRef = tfs[0].parent.textFrames.areaText(rectRef);
        for (var i = 0; i < tfs.length; i++) {
            var tt = tfs;
            tfs[i].textRange.move(areaTextRef, ElementPlacement.PLACEATEND);
            tfs[i].remove();
        }
        redraw();
        doc.selection = [areaTextRef];
    }
    function quickSort(arr) {
        if (arr.length <= 1) { return arr; }
        var pivotIndex = Math.floor(arr.length / 2);
        var pivot = arr.splice(pivotIndex, 1)[0];
        var left = [];
        var right = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] < pivot) {
                left.push(arr[i]);
            } else {
                right.push(arr[i]);
            }
        }
        return quickSort(left).concat([pivot], quickSort(right));
    };
})();