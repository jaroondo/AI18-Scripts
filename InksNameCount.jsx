/**
* @@@BUILDINFO@@@ InksNameCount.jsx !Version! Wed Sep 11 2019 07:04:18 GMT+0200
*/
// counting in inks names

var myAiFile = new File (app.activeDocument.fullName);
var inkName, oldName = "";
var mySwatch = {};

function loadXMPLibrary() { // load the XMPScript library
    if ( !ExternalObject.AdobeXMPScript ){
        try{
            ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
        } catch (e) {
            alert('Unable to load the AdobeXMPScript library!'); 
            return false;
        };
    };
    return true;
};

function unloadXMPLibrary() { // unload the XMPScript library
    if ( ExternalObject.AdobeXMPScript ) {
        try {
            ExternalObject.AdobeXMPScript.unload(); 
            ExternalObject.AdobeXMPScript = undefined;
        } catch (e) {
            alert('Unable to unload the AdobeXMPScript library!');
        };
    };
};
function getSwatch (subStr) {
    var list = app.activeDocument.swatches;
    var result = {};
    var cutSubStr = "";
    if (subStr.toString().charAt (2) == String.fromCharCode(94)) {
        cutSubStr = subStr.toString().substr(3);
        subStr = cutSubStr;
    };
    for (var i = 0; i < list.length; i++) {
        if (RegExp(subStr).test(list[i].name)) {
            list[i].name = subStr;
            result = list[i];
            break;
        };
    };
    return result;
};
if (loadXMPLibrary()) { // read xml packet
    xmpFile = new XMPFile(myAiFile.fsName, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_UPDATE);
    var myXmp = xmpFile.getXMP();
    if(myXmp){
        var xmpInksCount = myXmp.countArrayItems("http://ns.esko-graphics.com/grinfo/1.0/", "inks");
        //$.writeln("Inks Count: " + xmpInksCount);
        for (var i = 1; i <= xmpInksCount ; i++ ) { //  fill in smartInks from XML
             inkName = myXmp.getProperty("http://ns.esko-graphics.com/grinfo/1.0/", "inks[" + i + "]/egInk:" + "name");
             mySwatch = getSwatch(inkName);
             oldName = mySwatch.name;
             mySwatch.name = "0"+ i + String.fromCharCode(94) + oldName;
             $.writeln(inkName + " -> " + mySwatch.name);
        };
    };
    xmpFile.closeFile(XMPConst.CLOSE_UPDATE_SAFELY);
    unloadXMPLibrary();
};