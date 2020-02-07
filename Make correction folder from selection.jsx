#include stdlib.js

if (app.documents.length > 0) {
  var docRef = app.activeDocument;
  var docPath = docRef.path
  var docName = docRef.name.match(/(.*)\.[^\.]+$/)[1];

  main();
}

function main() {

  var selection = docRef.selection;
  var layername = "";

  if (selection.bounds) {

    layerName = prompt("Name of the correction layer:", "");

    //if (layerName = null || layerName == 'undefined') return;
    alert (layerName);

  } else {

    alert("Selection needed to create a mask!");
    return;
  }

  //undo();
  var correctionsLayerSet = findLayerSet(docRef.layerSets, "CORRECTIONS");

  if (typeof correctionsLayerSet !== 'undefined') {
    var newLayerSet = correctionsLayerSet.layerSets.add();

    Stdlib.createLayerMask(docRef, newLayerSet, true);
    newLayerSet.name = layerName;
    //createNewMaskedLayerSet(newLayer, correctionsLayerSet);
  } else {
    var newGroup = docRef.layerSets.add();
    newGroup.name = "CORRECTIONS";
    newGroup.move(docRef.layerSets.getByName("RENDERING"), ElementPlacement.PLACEBEFORE);
    var newLayerSet = newGroup.layerSets.add();

    Stdlib.createLayerMask(docRef, newLayerSet, true);
    newLayerSet.name = layerName;
  }

}

function findLayerSet(layerSets, name) {
  var temp;
  for (var i = 0; i < layerSets.length; i++) {
    var layer = layerSets[i];
    if (layer.name === name) {
      return layer;
    }
    if (layer instanceof LayerSet) {
      temp = findLayerSet(layer.layerSets, name);
      if (temp) return temp;
    }
  }
}

Selection.prototype.active = function()
{
    try      { return (selection.bounds) ? true : false; }
    catch(e) { return false; }
}

function undo() {
  executeAction(cTID("undo", undefined, DialogModes.NO));
};
