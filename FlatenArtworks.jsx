/**
* @@@BUILDINFO@@@ FlatenArtwork.jsx !Version! Mon May 27 2019 21:00:46 GMT+0200
*/
// flat layers to design layer in selected files

var progWin = createProgressWindow ();
var message = progWin.children[0];
var pbar = progWin.children[1];

function createProgressWindow () { 
    var w = new Window ("palette", "Progress Window...");
        var message = w.add('statictext {text: "Process State...", characters: 40}');
        var pbar = w.add ('progressbar', undefined, 0, 100);
        pbar.preferredSize.width = 300;
    return w;
};
function setProgWinContent (msg, min, max) {
    message.text = msg;
    pbar.minvalue = min;
    pbar.maxvalue = max;
};
function flatenArtworks () {
    var awArray = [];
    var selectedArtworks = awArray.length;
    var w = new Window ("dialog", "Flaten artworks...");
        w.alignChildren = "left";
        var p1 = w.add ('panel {text: "", borderstyle: "gray", alignChildren: "fill", alignment: "left"}');
            p1.g1 = p1.add("group");
                p1.g1.add('statictext {text: "Selected Files: ", justify: "left", characters: 10}');
                var artworkEdittext = p1.g1.add("edittext", undefined,   "", {readonly: true, justify: "left"});
                    artworkEdittext.characters = 5;
                    artworkEdittext.enabled = false;
                    artworkEdittext.text = selectedArtworks;
                var artworkBtn = p1.g1.add ("button", undefined, "Select");
                artworkBtn.onClick = function () {
                    awArray = Folder().openDlg ("Select Artwork File", "Normalized PDF: *.pdf, Adobe Illustrator: *.ai, All files: *.*", true);
                    if (awArray.length > 0) {
                        selectedArtworks = awArray.length;
                        artworkEdittext.text = selectedArtworks;
                    };
                };
        
        var buttonGroup = w.add ('group {alignment: "right"}');
            buttonGroup.add ("button", undefined, "OK");
            buttonGroup.add ("button", undefined, "Cancel");
    
    if (w.show () == 1) {
        setProgWinContent ("Flattening artworks...", 0, selectedArtworks);
        for (var i = 0; i < selectedArtworks; i++) {
            app.open(awArray[i]);
            app.doScript ("Flatten Artwork", "Pre-press", false);
            app.activeDocument.layers[0].name = "design";
            app.activeDocument.close(SaveOptions.SAVECHANGES);
            pbar.value = i; progWin.update();
        };
        alert("Flatening successfuly done...");
    };
};

//TESTING
flatenArtworks ();
