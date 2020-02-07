#include stdlib.js

if (app.documents.length > 0) {
  var docRef = app.activeDocument;
  var docPath = docRef.path
  var docName = docRef.name.match(/(.*)\.[^\.]+$/)[1];

  main();
}

function main(){
  jpgSaveOptions = new JPEGSaveOptions();
  jpgSaveOptions.formatOptions = FormatOptions.OPTIMIZEDBASELINE;
  jpgSaveOptions.embedColorProfile = true;
  jpgSaveOptions.matte = MatteType.NONE;
  jpgSaveOptions.quality = 12;

  var date = new Date();
  var dateSuffix = ('0' + date.getFullYear()).slice(-2)
             + ('0' + (date.getMonth()+1)).slice(-2)
             + ('0' + date.getDate()).slice(-2);

  var path  = docPath.toString().split('/');
  path.splice(path.length-1,1);
  var outputFolder = new Folder(path.join('/') + "/6 output/" + dateSuffix);
  var saveFile = Stdlib.convertFptr(path.join('/') + "/6 output/" + dateSuffix + "/" + docName);
  if (!outputFolder.exists) outputFolder.create();
  var jpgFile = new File(saveFile);
  var saveFile = Stdlib.convertFptr(path.join('/') + "/6 output/" + dateSuffix + "/" + docName);
  activeDocument.saveAs(jpgFile, jpgSaveOptions, true, Extension.LOWERCASE);

}
