#target photoshop


String.prototype.endsWith = function( str ) {

    return this.substring( this.length - str.length, this.length ) === str;
  }

var mylayers = app.activeDocument.artLayers;

var Path = app.activeDocument.path; 

var Name = app.activeDocument.name.replace(/\.[^\.]+$/, '');  

var saveFile = File(Path + "/" + Name + ".psd"); 

for(var i=0 ; i<mylayers.length ; i++){

    if (mylayers[i].name.endsWith('.A')){
        mylayers[i].remove()
        }
}

//~ if (activeDocument.bitsPerChannel != BitsPerChannelType.SIXTEEN || activeDocument.bitsPerChannel != BitsPerChannelType.THIRTYTWO) activeDocument.bitsPerChannel = BitsPerChannelType.EIGHT;

//~ SavePSD(saveFile, 8); 

function SavePSD(saveFile){

          psdSaveOptions = new PhotoshopSaveOptions();

          psdSaveOptions.embedColorProfile = true;

         psdSaveOptions.alphaChannels = true;

         activeDocument.saveAs(saveFile, psdSaveOptions, false,

Extension.LOWERCASE);

}
