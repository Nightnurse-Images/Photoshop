#target photoshop
#include stdlib.js


var docRef  = app.activeDocument;
var Name = app.activeDocument.name.replace(/\.[^\.]+$/, '');
var passes = docRef.artLayers;
var layersetNames = new File("W:/SOFTWARE/Scripts/Photoshop/layers.txt");

layersetNames.open('r');
layersetNames.encoding = 'UTF8'; // set to 'UTF8' or 'UTF-8'

var str = "";

while(!layersetNames.eof)
    str += layersetNames.readln()
layersetNames.close();

var layerList = str.split(",")
var i = 0;

for (i  = 0; i<layerList.length; i++){

        docRef.layerSets.add();

    }

for (i = 0 ; i<docRef.layerSets.length; i++){


    docRef.layerSets[i].name = layerList[i];

    }


for (i =0; i<passes.length; i++){

//~     if (passes[i].name.contains("Background")){
//~
//~         if (passes[i].isBackgroundLayer) {
//~             passes[i].isBackgroundLayer = false
//~             passes[i].visible = true
//~             passes[i].name = "Background"
//~
//~         }
//~     }

    Stdlib.convertToSmartLayer(docRef,passes[i])
    passes[i].blendMode = BlendMode.NORMAL


    if ((passes[i].name.contains("Alpha") && passes[i].name != "Extra_Alpha") || passes[i].name == "Background Mask") {
        passes[i].blendMode = BlendMode.MULTIPLY
        passes[i].duplicate(docRef.layerSets[docRef.layerSets.length-3],ElementPlacement.PLACEATEND)
        .invert()

        }else if (passes[i].name.contains("Background") || passes[i].name.contains("Layer 0") || passes[i].name.contains("Render (SL")){
            if (passes[i].name.contains("Layer 0")) passes[i].name = "Background"
            if (passes[i].name.contains("Render (SL")) passes[i].name = "Render"
            passes[i].blendMode = BlendMode.LINEARDODGE
            passes[i].duplicate(docRef.layerSets[docRef.layerSets.length-3],ElementPlacement.INSIDE)

        }else if((passes[i].name.contains("Mask") || passes[i].name.contains("mask")) && passes[i].name != "Background Mask"){

            passes[i].copy()
            var newGroup = docRef.layerSets[docRef.layerSets.length-4].layerSets.add()
            newGroup.name = passes[i].name
            Stdlib.createLayerMask (docRef, newGroup, false)
            Stdlib.selectLayerMaskEdit(docRef,newGroup)
            _paste()
            Stdlib.deselectLayer(docRef, docRef.activeLayer)
        }
    passes[i].visible = false
    }

Stdlib.selectLayers(docRef,passes)
Stdlib.newGroupFromLayers(docRef).name = "MASKS"
docRef.activeLayer.move(docRef.layerSets[0],ElementPlacement.PLACEAFTER)
docRef.activeLayer.visible = false

setCopyright()

addHueSat(false,90,"Color",BlendMode.COLORBLEND)
addHueSat(false,-100,"Black&White",BlendMode.COLORBLEND)
addHueSat(true, 20,"Saturation",BlendMode.HUE)



function _paste(){
    var idpast = charIDToTypeID( "past" );
    var desc321 = new ActionDescriptor();
    var idinPlace = stringIDToTypeID( "inPlace" );
    desc321.putBoolean( idinPlace, true );
    var idAntA = charIDToTypeID( "AntA" );
    var idAnnt = charIDToTypeID( "Annt" );
    var idAnno = charIDToTypeID( "Anno" );
    desc321.putEnumerated( idAntA, idAnnt, idAnno );
    var idAs = charIDToTypeID( "As  " );
    var idPxel = charIDToTypeID( "Pxel" );
    desc321.putClass( idAs, idPxel );
executeAction( idpast, desc321, DialogModes.NO );

    }

function setCopyright(){


// =======================================================
var idsetd = charIDToTypeID( "setd" );
    var desc387 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref328 = new ActionReference();
        var idPrpr = charIDToTypeID( "Prpr" );
        var idFlIn = charIDToTypeID( "FlIn" );
        ref328.putProperty( idPrpr, idFlIn );
        var idDcmn = charIDToTypeID( "Dcmn" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref328.putEnumerated( idDcmn, idOrdn, idTrgt );
    desc387.putReference( idnull, ref328 );
    var idT = charIDToTypeID( "T   " );
        var desc388 = new ActionDescriptor();
        var idCptn = charIDToTypeID( "Cptn" );
        desc388.putString( idCptn, """www.nightnurse.ch""" );
        var idByln = charIDToTypeID( "Byln" );
        desc388.putString( idByln, """nightnurse images GmbH""" );
        var idCrdt = charIDToTypeID( "Crdt" );
        desc388.putString( idCrdt, """© 2019 nightnurse images, Zürich""" );
        var idSrce = charIDToTypeID( "Srce" );
        desc388.putString( idSrce, """nightnurse images GmbH""" );
        var idObjN = charIDToTypeID( "ObjN" );
        desc388.putString( idObjN, """nightnurse images Visualisierung""" );
        var idcopyrightStatus = stringIDToTypeID( "copyrightStatus" );
        var idcopyrightStatus = stringIDToTypeID( "copyrightStatus" );
        var idcopyrightedWork = stringIDToTypeID( "copyrightedWork" );
        desc388.putEnumerated( idcopyrightStatus, idcopyrightStatus, idcopyrightedWork );
        var idCprN = charIDToTypeID( "CprN" );
        desc388.putString( idCprN, """© 2019 nightnurse images, Zürich""" );
        var idCrad = charIDToTypeID( "Crad" );
        desc388.putString( idCrad, """Limmatstrasse 291""" );
        var idCrci = charIDToTypeID( "Crci" );
        desc388.putString( idCrci, """Zürich""" );
        var idCrar = charIDToTypeID( "Crar" );
        desc388.putString( idCrar, """ZH""" );
        var idCrpc = charIDToTypeID( "Crpc" );
        desc388.putString( idCrpc, """8055""" );
        var idCrco = charIDToTypeID( "Crco" );
        desc388.putString( idCrco, """Schweiz""" );
        var idCrph = charIDToTypeID( "Crph" );
        desc388.putString( idCrph, """+41 44 533 68 00""" );
        var idCrem = charIDToTypeID( "Crem" );
        desc388.putString( idCrem, """beeper(at)nightnurse.ch""" );
        var idCrur = charIDToTypeID( "Crur" );
        desc388.putString( idCrur, """www.nightnurse.ch""" );
        var idRiUs = charIDToTypeID( "RiUs" );
        desc388.putString( idRiUs, """Der Auftraggeber erhält die Lizenz zur Nutzung der Visualisierungen für den jeweiligen Zweck.\r
Jede Veröffentlichung (Print, Web, etc.) muss mit der Urheberangabe '© nightnurse images, Zürich' bezeichnet werden (am Bild oder im Impressum). Bei Wettbewerben ist nightnurse images auf dem Verfassernachweis als Urheber der Visualisierungen aufzuführen. Der Auftraggeber ist berechtigt, die Visualisierungen für Veröffentlichungen weiterzugeben, mit dem ausdrücklichen Hinweis, dass das Copyright bei nightnurse images liegt.\r
Visualiserungen dürfen ohne ausdrückliche Einwilligung des Autors nicht verändert publiziert werden, abgesehen von der üblichen Aufbereitung für Druck und Web.""" );
    var idFlIn = charIDToTypeID( "FlIn" );
    desc387.putObject( idT, idFlIn, desc388 );
executeAction( idsetd, desc387, DialogModes.NO );

}

function addHueSat(col, val, name,bMode){

// =======================================================
var idMk = charIDToTypeID( "Mk  " );
    var desc107 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref73 = new ActionReference();
        var idAdjL = charIDToTypeID( "AdjL" );
        ref73.putClass( idAdjL );
    desc107.putReference( idnull, ref73 );
    var idUsng = charIDToTypeID( "Usng" );
        var desc108 = new ActionDescriptor();
        var idType = charIDToTypeID( "Type" );
            var desc109 = new ActionDescriptor();
            var idpresetKind = stringIDToTypeID( "presetKind" );
            var idpresetKindType = stringIDToTypeID( "presetKindType" );
            var idpresetKindDefault = stringIDToTypeID( "presetKindDefault" );
            desc109.putEnumerated( idpresetKind, idpresetKindType, idpresetKindDefault );
            var idClrz = charIDToTypeID( "Clrz" );
            desc109.putBoolean( idClrz, col );
        var idHStr = charIDToTypeID( "HStr" );
        desc108.putObject( idType, idHStr, desc109 );
    var idAdjL = charIDToTypeID( "AdjL" );
    desc107.putObject( idUsng, idAdjL, desc108 );
executeAction( idMk, desc107, DialogModes.NO );

// =======================================================
var idsetd = charIDToTypeID( "setd" );
    var desc110 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref74 = new ActionReference();
        var idAdjL = charIDToTypeID( "AdjL" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref74.putEnumerated( idAdjL, idOrdn, idTrgt );
    desc110.putReference( idnull, ref74 );
    var idT = charIDToTypeID( "T   " );
        var desc111 = new ActionDescriptor();
        var idpresetKind = stringIDToTypeID( "presetKind" );
        var idpresetKindType = stringIDToTypeID( "presetKindType" );
        var idpresetKindCustom = stringIDToTypeID( "presetKindCustom" );
        desc111.putEnumerated( idpresetKind, idpresetKindType, idpresetKindCustom );
        var idAdjs = charIDToTypeID( "Adjs" );
            var list61 = new ActionList();
                var desc112 = new ActionDescriptor();
                var idH = charIDToTypeID( "H   " );
                desc112.putInteger( idH, 0 );
                var idStrt = charIDToTypeID( "Strt" );
                desc112.putInteger( idStrt, val);
                var idLght = charIDToTypeID( "Lght" );
                desc112.putInteger( idLght, 0 );
            var idHsttwo = charIDToTypeID( "Hst2" );
            list61.putObject( idHsttwo, desc112 );
        desc111.putList( idAdjs, list61 );
    var idHStr = charIDToTypeID( "HStr" );
    desc110.putObject( idT, idHStr, desc111 );
executeAction( idsetd, desc110, DialogModes.NO );

docRef.activeLayer.move(docRef.layerSets[0],ElementPlacement.INSIDE)
docRef.activeLayer.name =name
docRef.activeLayer.blendMode = bMode
docRef.activeLayer.visible = false

    }
