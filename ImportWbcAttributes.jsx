/**
* @@@BUILDINFO@@@ ImportWbcAttributes.jsx !Version! Fri Jan 18 2019 19:04:02 GMT+0100
*/
//  loading WebCenter attributes from JDF file and save them to document XMP metadata

var myAiFile = app.activeDocument.fullName;
try {
    var myXmlFile = myAiFile.parent.getFiles("*_attrs.jdf")[0];
    //$.writeln(myXmlFile.name);
} catch (e) {
    alert('Unable to find JDF file!');
};

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



if (myXmlFile.open("r")) {
    var fileContent = myXmlFile.read();
    //$.writeln(fileContent);
    myXmlFile.close();
    var myXML = new XML (fileContent);
    default xml namespace = "http://www.CIP4.org/JDFSchema_1_1";
    var eg = new Namespace ("http://www.esko-graphics.com/EGschema1_0");
    $.writeln('DescriptiveName: ' + myXML.@DescriptiveName);
  
    $.writeln('JobDescription: ' + myXML.Comment.(@Name == "JobDescription"));
    $.writeln('Description: ' + myXML.Comment.(@Name == "Description"));
        
    $.writeln('CustomerID: ' + myXML.CustomerInfo.@CustomerID);    
    
    $.writeln('ResourcePool/Component@Class: ' + myXML.ResourcePool.Component.@Class);
    //$.writeln(myXML.ResourcePool.eg::SmartNames.SmartName.(@Name=="Product Category").@Value);
    $.writeln(myXML.ResourcePool.eg::SmartNames);
    
    //$.writeln(myXML.@File);
    //$.writeln(myXML.Inks.elements().length());
    //$.writeln(myXML.Inks.children().length());
    //$.writeln(myXML.Inks.Ink[0].@Name);
    //$.writeln(myXML.Inks.Ink[0].CoveragePerc.@Value);
    /*var inksCount = myXML.Inks.children().length();
    for (var i = 0; i < inksCount ; i++ ) {
        $.writeln(myXML.Inks.Ink[i].@Name + "\t" + myXML.Inks.Ink[i].CoveragePerc.@Value + "\t %");
    };*/
    if (loadXMPLibrary()) { // read xml packet
        xmpFile = new XMPFile(myAiFile.fsName, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_UPDATE);
        var myXmp = xmpFile.getXMP();
//~         if(myXmp){
//~             var xmpInksCount = myXmp.countArrayItems("http://ns.esko-graphics.com/grinfo/1.0/", "inks");
//~             //$.writeln("Inks Count: " + xmpInksCount);
//~             if (!myXmp.doesPropertyExist("http://my.prepressSchema.namespace/", "artworkAngle")) { // set default artworkAngle
//~                     myXmp.setProperty("http://my.prepressSchema.namespace/", "artworkAngle", 0);
//~             };
//~             if (!myXmp.doesPropertyExist("http://my.prepressSchema.namespace/", "punchNumAngle")) { // set default punchNumAngle
//~                     myXmp.setProperty("http://my.prepressSchema.namespace/", "punchNumAngle", 0);
//~             };
//~             if (!myXmp.doesPropertyExist("http://my.prepressSchema.namespace/", "punchNumPrint")) { // set default punchNumPrint
//~                     myXmp.setProperty("http://my.prepressSchema.namespace/", "punchNumPrint", true);
//~             };
//~             /*if (!myXmp.doesPropertyExist("http://my.prepressSchema.namespace/", "logoAngle")) { // set default logoAngle
//~                     myXmp.setProperty("http://my.prepressSchema.namespace/", "logoAngle", 135);
//~             };
//~             if (!myXmp.doesPropertyExist("http://my.prepressSchema.namespace/", "logoPrint")) { // set default logoPrint
//~                     myXmp.setProperty("http://my.prepressSchema.namespace/", "logoPrint", true);
//~             };*/
//~             if (!myXmp.doesPropertyExist("http://my.prepressSchema.namespace/", "smartInks")) { // set smartInks
//~                     myXmp.setProperty("http://my.prepressSchema.namespace/", "smartInks", null, XMPConst.PROP_IS_ARRAY);
//~                     XMPMeta.registerNamespace ("http://my.prepressSchema.namespace/smartink#", "smartInk");
//~             };
//~             for (var i = 1; i <= xmpInksCount ; i++ ) { //  fill in smartInks from XML
//~                 myXmp.setStructField("http://my.prepressSchema.namespace/", "smartInks[" + i + "]", "http://my.prepressSchema.namespace/smartink#", "name", myXML.Inks.Ink[i - 1].@Name); // meno Prepress XMP <-- XML
//~                 //myXmp.setStructField("http://my.prepressSchema.namespace/", "smartInks[" + i + "]", "http://my.prepressSchema.namespace/smartink#", "name", myXmp.getProperty("http://ns.esko-graphics.com/grinfo/1.0/", "inks[" + i + "]/egInk:" + "name")); // meno Prepress XMP <-- Esko
//~                 
//~                 myXmp.setProperty("http://ns.esko-graphics.com/grinfo/1.0/", "inks[" + i + "]/egInk:" + "frequency", myXML.Inks.Ink[i - 1].CoveragePerc.@Value); // frequency  Esko XMP <-- XML
//~                 myXmp.setStructField("http://my.prepressSchema.namespace/", "smartInks[" + i + "]", "http://my.prepressSchema.namespace/smartink#", "coverage", myXML.Inks.Ink[i - 1].CoveragePerc.@Value); // coverage Prepress XMP <-- XML 
//~                 myXmp.setStructField("http://my.prepressSchema.namespace/", "smartInks[" + i + "]", "http://my.prepressSchema.namespace/smartink#", "overprint", "unknown"); // overprint default setting 
//~                 
//~                 /*$.writeln(
//~                     myXmp.getProperty("http://ns.esko-graphics.com/grinfo/1.0/", "inks[" + i + "]/egInk:" + "name") + "\t" +
//~                     myXmp.getProperty("http://ns.esko-graphics.com/grinfo/1.0/", "inks[" + i + "]/egInk:" + "frequency") + "\t %");*/
//~             };
//~         };
        // put XMP into file
        //app.activeDocument.save();
        app.activeDocument.close();
        if (xmpFile.canPutXMP(myXmp)) {
            xmpFile.putXMP(myXmp);
        } else {
            alert("Error storing XMP");
        };
        // close file
        xmpFile.closeFile(XMPConst.CLOSE_UPDATE_SAFELY);
        unloadXMPLibrary();
        app.open(myAiFile);
    };
    //alert ("WebCenter attributes was uploaded successfully !", "WBC Attributes");
} else {
    alert (myXmlFile.name.replace(/%20/g, " ") + "\nin the same location does not exist !", "XML file missing", true);
};