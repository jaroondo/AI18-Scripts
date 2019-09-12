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

function getSmartNameAttrValueByName(xmlElement, attrName) {
    var attrValue = "";
    for(var i = 0; i < xmlElement.length(); i++) {
        if (attrName == xmlElement[i].@eg::Name) {
            attrValue = xmlElement[i].@eg::Value;
            break;
        };
    };
    return attrValue;
};

if (myXmlFile.open("r")) {
    var fileContent = myXmlFile.read();
    //$.writeln(fileContent);
    myXmlFile.close();
    var myXML = new XML (fileContent);
    default xml namespace = "http://www.CIP4.org/JDFSchema_1_1";
    var eg = new Namespace ("http://www.esko-graphics.com/EGschema1_0");
    /*
    $.writeln('DescriptiveName: ' + myXML.@DescriptiveName);
    $.writeln('JobDescription: ' + myXML.Comment.(@Name == "JobDescription"));
    $.writeln('Description: ' + myXML.Comment.(@Name == "Description"));
    $.writeln('CustomerID: ' + myXML.CustomerInfo.@CustomerID);    
    $.writeln('ResourcePool/Component@Class: ' + myXML.ResourcePool.Component.@Class);
    $.writeln('ResourcePool/eg:SmartNames@Class: ' + myXML.ResourcePool.eg::SmartNames.@eg::Class);
    $.writeln('ResourcePool/eg:SmartNames/eg:SmartName[0]@eg:Name: ' + myXML.ResourcePool.eg::SmartNames.eg::SmartName[0].@eg::Name);
    */
        
    if (loadXMPLibrary()) { // read xml packet
        xmpFile = new XMPFile(myAiFile.fsName, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_UPDATE);
        var myXmp = xmpFile.getXMP();
        /*
        $.writeln(getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "PROJECT NAME"));
        $.writeln(myXmp.getProperty("http://my.wbcSchema.namespace/", "projectName"));
        
        $.writeln(getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "CUSTOMER ID"));
        $.writeln(myXmp.getProperty("http://my.wbcSchema.namespace/", "customerID"));
        
        $.writeln(getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "Litography"));
        $.writeln(myXmp.getProperty("http://my.wbcSchema.namespace/", "projectNumber"));
        
        $.writeln(getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "STBMC"));
        $.writeln(myXmp.getProperty("http://my.wbcSchema.namespace/", "stbCode"));
        
        $.writeln(getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "Primer FIP MCC")); // No | Clear | White | Gold
        $.writeln(myXmp.getProperty("http://my.wbcSchema.namespace/", "primer"));
        
        $.writeln(getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "Finishing FIP"));
        $.writeln(myXmp.getProperty("http://my.wbcSchema.namespace/", "finishing"));
        
        $.writeln(getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "Znak Produktowy")); // Yes / No
        $.writeln(myXmp.getProperty("http://my.wbcSchema.namespace/", "logo"));
        
        $.writeln(getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "INTERNAL PLANT CODE"));
        $.writeln(myXmp.getProperty("http://my.wbcSchema.namespace/", "sapDescription"));
        */
        if(myXmp){
            // identification
            myXmp.setProperty("http://my.wbcSchema.namespace/", "projectName", getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "PROJECT NAME"));
            myXmp.setProperty("http://my.wbcSchema.namespace/", "customersCode", getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "CUSTOMER NO"));
            myXmp.setProperty("http://my.wbcSchema.namespace/", "customerID", getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "CUSTOMER ID"));
            myXmp.setProperty("http://my.wbcSchema.namespace/", "projectNumber", getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "Litography"));
            // material
            var stbCode = getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "STBMC");
            if (stbCode == "") {
                stbCode = getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "SAP_INDEX_CPMC");
            };
            myXmp.setProperty("http://my.wbcSchema.namespace/", "stbCode", stbCode);
            
            var baseCoat = getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "Primer FIP MCC");
            if (baseCoat == "") {
                baseCoat = getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "CPMC_BASE VARNISH");
            };
            myXmp.setProperty("http://my.wbcSchema.namespace/", "primer", baseCoat);
            
            var coverVarnish = getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "Finishing FIP");
            if (coverVarnish == "") {
                coverVarnish = getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "CPMC_OVERPRINT VARNISH");
            }; 
            myXmp.setProperty("http://my.wbcSchema.namespace/", "finishing", coverVarnish);
            
            var logoAngle = "0";
               if (getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "Znak Produktowy") != "Yes") {
                   logoAngle = "-0"
               };
            myXmp.setProperty("http://my.wbcSchema.namespace/", "logo", logoAngle);
            myXmp.setProperty("http://my.wbcSchema.namespace/", "internalPlantCode", getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "INTERNAL PLANT CODE"));
            myXmp.setProperty("http://my.wbcSchema.namespace/", "sapDescription", getSmartNameAttrValueByName (myXML.ResourcePool.eg::SmartNames.eg::SmartName, "SAP_Description")); 
        };
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
    alert ("WebCenter attributes was uploaded successfully !", "WBC Attributes");
} else {
    alert (myXmlFile.name.replace(/%20/g, " ") + "\nin the same location does not exist !", "XML file missing", true);
};