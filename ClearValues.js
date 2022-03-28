// Clear Value = Clear All Fields.js

function clearValues() {
    $w("#uploadPhoto").reset();
    $w("#iptTitle").value = "";
    $w("#iptTitle").resetValidityIndication()
    $w("#iptComment").value = "";
    $w("#hashtags").options = [];
    $w("#preview").hide()
    $w('#btnAddPhoto').disable()
    $w("#txtMessage").hide()
    

}

