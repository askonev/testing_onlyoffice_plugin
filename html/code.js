// function TrackRevisionON() {
//     connector.callCommand(function () {
//         let odoc = Api.GetDocument();
//         odoc.SetTrackRevisions(true);
//         console.log('on track')
//     })
// }

// function TrackRevisionOFF() {
//     connector.callCommand(function () {
//         let odoc = Api.GetDocument();
//         odoc.SetTrackRevisions(false);
//         console.log('off track')
//     })
// }

function returnText() {
    connector.callCommand(function () {
        let odoc = Api.GetDocument();
        let opar = odoc.GetElement(0);
        // opar.AddText('test');
        console.log('source: ', opar.GetText())
        return opar.GetText();
    }, false, true, function (retValue) {
        console.log(retValue);
    })
}

function getReviewReport() {
    connector.callCommand(function () {
        let odoc = Api.GetDocument();
        odoc.SetTrackRevisions(true);
        let opar1 = odoc.GetElement(0);
        opar1.AddText("Reviewing documents");
        opar1.SetJc("center");
        opar1.SetFontSize(24);
        opar1.SetBold(true);
        let opar2 = Api.CreateParagraph();
        opar2.AddText("If you need to get review report, you can use Document Builder. The steps below will show how to do it.");
        odoc.Push(opar2);
        let report = odoc.GetReviewReport();
        odoc.SetTrackRevisions(false);
        console.log(report)
        console.log(typeof report["Anonymous"] === "object")
    });
}

function insertAndReplaceProps() {
    window.connector.executeMethod("GetAllContentControls", null, function (cc_list) {
        console.log("content control list", cc_list);

        let sIternalId = cc_list[0].InternalId.toString(); // first LvlSdt

        let arrDocuments = [{
            Props: {
                InternalId: sIternalId,
                Id: 100,
                Tag: "Tag",
                Lock: 3,
                Alias: "alias",
                PlaceHolderText: "custom_placeholder",
                Appearance: 1,
                Color: {R: 100, G: 100, B: 100},
            }, // Script:
            //   "let oParagraph = Api.CreateParagraph();oParagraph.AddText('Updated container');Api.GetDocument().InsertContent([oParagraph]);",
        },];

        window.connector.executeMethod("InsertAndReplaceContentControls", [arrDocuments,]);
    });
}

function getAllComments() {
    console.log("GetAllComments");
    connector.executeMethod("GetAllComments", [], (callback_arg) => {
        console.log(callback_arg);
    });
}

function addHello() {
    connector.callCommand(function () {
        let oDocument = Api.GetDocument();
        let oParagraph = Api.CreateParagraph();
        oParagraph.AddText("Hello");
        oDocument.InsertContent([oParagraph]);
        Api.AddComment(oParagraph, "text", "author");
    }, function (callback_arg) {
        console.log("test:", callback_arg);
    });
}

function addBlockLvlSdt() {
    // console.log(uniqueId)

    let config = {
        type: 1, //  1 (block), 2 (inline)
        property: {
            Appearance: 1, Id: 123, Lock: 3, Tag: "{TAG}", PlaceHolderText: "BlockLvlSdt",
        },
    };

    connector.executeMethod("AddContentControl", [config.type, config.property], (callback_arg) => {
        // console.log(callback_arg);
    });
}

function addInlineLvlSdt() {
    let config = {
        type: 2, // 1 (block), 2 (inline)
        property: {
            Appearance: 1, Id: 321, Lock: 3, Tag: "{TAG}", PlaceHolderText: "InlineLvlSdt",
        },
    };

    connector.executeMethod("AddContentControl", [config.type, config.property], (callback_arg) => {
        // console.log(callback_arg);
    });
}

function attachOnChangeContentControl() {
    connector.attachEvent("onChangeContentControl", function () {
        console.log("event: onChangeContentControl");
    });
}

function getAllContentControls() {
    connector.executeMethod("GetAllContentControls", [], (callback_arg) => {
        if (typeof callback_arg[0] != "undefined") {
            // console.log(callback_arg[0].Tag);
            for (let i = 0; i < callback_arg.length; i++) {
                // console.log(i)
                console.log(callback_arg[i], `Tag: ${callback_arg[i].Tag}`);
            }
        } else {
            console.log('content controls not found')
        }
    });
}

function removeAllElements() {
    connector.callCommand(() => {
            let odoc = Api.GetDocument();
            odoc.RemoveAllElements();
        }
    )
}
