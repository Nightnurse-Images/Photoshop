#include stdlib.js

if (app.documents.length > 0) {

  var docRef = app.activeDocument;
  var theName = docRef.name.match(/(.*)\.[^\.]+$/)[1];

  main();
}

function main() {
  var masksLayerSet = findLayerSet(docRef.layerSets, 'MASKS');

  if (masksLayerSet instanceof LayerSet) {
    try {
      var folder = Stdlib.selectFolder('Select the folder with render passes:');
    } catch (e) {
      return;
    }

    if (folder !== 'undefined' || folder != 'null') {
      Stdlib.zoomFitOnScreen();
      iterateFiles(folder, masksLayerSet);
    } else {
      return;
    }
  } else {
    alert("MASKS folder not found !");
    return;
  }
  Stdlib.deselectAllLayers(docRef);
  docRef.selection.deselect();
}

//Go through the render passes

function iterateFiles(folder, layerSet) {
  var newLayersAdded = [];
  var selectedLayers = layerSet.artLayers; //get only the artlayers and not the layersets !!
  var files = Stdlib.getFiles(folder, "*.png")
  var selectedLayerNames = [];

  for (var i = 0; i < selectedLayers.length; i++) {
    docRef.activeLayer = selectedLayers[i];
    Change_Layer_Icon_Color(0, 0, 'none'); //Set the color of all the passes in the document to None. So we start from clean masks
    selectedLayerNames.push(selectedLayers[i].name);
  }

  for (var i = 0; i < files.length; i++) {
    var pass = decodeURIComponent(files[i].name.replace(".png", ''));
    if (selectedLayerNames.contains(pass)) { //if the pass is among the layers, replace it
      var layerToReplace = layerSet.artLayers.getByName(pass);
      Stdlib.replaceSmartLayerContents(docRef, layerToReplace, files[i]);

      if (pass.contains("Mask") && pass != "Background Mask") { //if its a mask, also replace the layer mask inside corrections
        var correctionsLayerSet = findLayerSet(docRef.layerSets, "CORRECTIONS");
        if (typeof correctionsLayerSet !== 'undefined') {
          var maskedLayerSet = findLayerSet(correctionsLayerSet.layers, pass);
          if (typeof maskedLayerSet !== 'undefined') {
            replaceLayerSetMask(maskedLayerSet, layerToReplace);
          } else {
            //if the corrections layer to be replaced does not exist inside 'CORRECTIONS' folder
          }
        } else {
          alert("Could not find CORRECTIONS folder to replace the mask!");
        }
      }
      selectedLayerNames.splice(selectedLayerNames.indexOf(pass), 1); //remove the found layer from the layer name list
    } else { //if the pass is not among the layers, add a new smart object

      var newLayer = addNewLayer(docRef, layerSet, files[i]);

      if (pass.contains("Mask") && pass != "Background Mask") {
        var correctionsLayerSet = findLayerSet(docRef.layerSets, "CORRECTIONS");
        if (typeof correctionsLayerSet !== 'undefined') {
          createNewMaskedLayerSet(newLayer, correctionsLayerSet);
        } else {
          var newGroup = docRef.layerSets.add();
          newGroup.name = "CORRECTIONS";
          newGroup.move(docRef.layerSets.getByName("RENDERING"), ElementPlacement.PLACEBEFORE);
          createNewMaskedLayerSet(newLayer, newGroup);
        }
      }
      newLayer.visible = false;
      newLayersAdded.push(newLayer.name);
    }
  }
  //undo();
  //change the color of the passes not found in the new set to red
  for (var i = 0; i < selectedLayerNames.length; i++) {
    docRef.activeLayer = layerSet.artLayers.getByName(selectedLayerNames[i]);
    Change_Layer_Icon_Color(1, 0, "Red");
    docRef.activeLayer.visible = false;
  }
  //change the color of  newly added passes to green
  for (var i = 0; i < newLayersAdded.length; i++) {
    docRef.activeLayer = layerSet.artLayers.getByName(newLayersAdded[i]);
    Change_Layer_Icon_Color(1, 0, "Green");
    docRef.activeLayer.visible = false;
  }

  //alertbox to notify the end of the script
  var missingMsg = (selectedLayerNames.length == 0) ? "All existing passes found!" : "Couldn't find the files for: " + selectedLayerNames.join(" , ");
  var newLayerMsg = (newLayersAdded.length == 0) ? "No new passes added." : "New passes added : " + newLayersAdded.join(" , ");
  alert(missingMsg + "\n" + newLayerMsg);
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

function cTID(s) {
  return app.charIDToTypeID(s);
};

function sTID(s) {
  return app.stringIDToTypeID(s);
};

function newGroupFromLayers(doc) {
  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putClass(sTID('layerSection'));
  desc.putReference(cTID('null'), ref);
  var lref = new ActionReference();
  lref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
  desc.putReference(cTID('From'), lref);
  executeAction(cTID('Mk  '), desc, DialogModes.NO);
};

function undo() {
  executeAction(cTID("undo", undefined, DialogModes.NO));
};

function getSelectedLayers(doc) {
  var selLayers = [];
  newGroupFromLayers();

  var group = doc.activeLayer;
  var layers = group.layers;

  for (var i = 0; i < layers.length; i++) {
    selLayers.push(layers[i]);
  }

  undo();

  return selLayers;
};

cTID = function(s) {
  return app.charIDToTypeID(s);
};
sTID = function(s) {
  return app.stringIDToTypeID(s);
};

function addNewLayer(doc, layerSet, file) {

  layer = Stdlib.placeImage(doc, layerSet, file);
  //Stdlib.convertToSmartLayer(document, layer);
  layer.move(layerSet, ElementPlacement.INSIDE);
  return layer;

}

function createNewMaskedLayerSet(layer, layerSet) {

  layer.copy()
  var newGroup = layerSet.layerSets.add()
  newGroup.name = layer.name
  Stdlib.createLayerMask(docRef, newGroup, false)
  Stdlib.selectLayerMaskEdit(docRef, newGroup)
  _paste()
  Stdlib.deselectLayer(docRef, docRef.activeLayer)

}

function replaceLayerSetMask(layerSet, layer) {

  layer.copy();
  layer.visible = false;
  docRef.activeLayer = layerSet;
  //Stdlib.createLayerMask (doc, layerSet, false)
  Stdlib.selectLayerMaskEdit(docRef, layerSet);
  _paste();
  //Stdlib.deselectLayer(doc, doc.activeLayer);
}

function _paste() {
  var idpast = charIDToTypeID("past");
  var desc321 = new ActionDescriptor();
  var idinPlace = stringIDToTypeID("inPlace");
  desc321.putBoolean(idinPlace, true);
  var idAntA = charIDToTypeID("AntA");
  var idAnnt = charIDToTypeID("Annt");
  var idAnno = charIDToTypeID("Anno");
  desc321.putEnumerated(idAntA, idAnnt, idAnno);
  var idAs = charIDToTypeID("As  ");
  var idPxel = charIDToTypeID("Pxel");
  desc321.putClass(idAs, idPxel);
  executeAction(idpast, desc321, DialogModes.NO);

}

function Change_Layer_Icon_Color(enabled, withDialog, color) {
  var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
  var desc1 = new ActionDescriptor();
  var ref1 = new ActionReference();
  ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
  desc1.putReference(cTID('null'), ref1);
  var desc2 = new ActionDescriptor();
  colorcode = 'None';
  if (color == 'none' || color == 'None' || color == 'no' || color == '') {
    colorcode = 'None';
  }
  if (color == 'Red' || color == 'red') {
    colorcode = 'Rd  ';
  }
  if (color == 'Orange' || color == 'orange') {
    colorcode = 'Orng';
  }
  if (color == 'Yellow' || color == 'yellow') {
    colorcode = 'Ylw ';
  }
  if (color == 'Green' || color == 'green') {
    colorcode = 'Grn ';
  }
  if (color == 'Blue' || color == 'blue') {
    colorcode = 'Bl  ';
  }
  if (color == 'Violet' || color == 'violet' || color == 'purple' || color == 'Purple') {
    colorcode = 'Vlt ';
  }
  if (color == 'Gray' || color == 'gray' || color == 'Grey' || color == 'grey') {
    colorcode = 'Gry ';
  }
  desc2.putEnumerated(cTID('Clr '), cTID('Clr '), cTID(colorcode));
  desc1.putObject(cTID('T   '), cTID('Lyr '), desc2);
  executeAction(cTID('setd'), desc1, dialogMode);
};
