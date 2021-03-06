var imageResizer = new ImageResizer();
var zipper = new Zipper();
$(function () {
    setDeviceSelectionDropDown();
    setSizeAutoCompleteField();
    setImagePicker();
    setSizeAutoCompleteFieldFocusValidation();
    setOrientationRadioButtons();
    setDoneButton();
});


function setDeviceSelectionDropDown() {
    $("#dropdown_trigger_select_device").dropdown({hover:false});
    $('#a-device-android').click(function () {
        $('#s_dropdown_selected_item').text($('#a-device-android').text())
    });
    $('#a-device-ios').click(function () {
        $('#s_dropdown_selected_item').text($('#a-device-ios').text())
    });
}

function setSizeAutoCompleteField() {
    function getAtcSizeDataObject() {
        obj =  {
            match_parent: null,
            wrap_content: null
        };

        for(var i=2 ; i<=9999 ; i++) {
            obj[i+'dp'] = null;
        }

        return {
            data: obj,
            limit: 5,
            onAutocomplete: null,
            minLength: 0,
            sortFunction:function (a, b) {
                var iA = a.replace('dp','');
                var iB = b.replace('dp','');
                if(iA === 'match_parent')
                    return -1;
                if(iB === 'match_parent')
                    return 1;

                if(iA === 'wrap_content')
                    return -1;
                if(iB === 'wrap_content')
                    return 1;
                if(iA < iB)
                    return -1;
                else
                    return 1;
            }
        };
    }

    var atcSizeData = getAtcSizeDataObject();
    $('#atc_width').autocomplete(atcSizeData);
    $('#atc_height').autocomplete(atcSizeData);
}


function setImagePicker() {
    var aPickImage = $('#a_pick_image');
    aPickImage.click(function () {
        pickImage(function (file) {
            aPickImage.removeClass("pulse");
            $('#a_done').addClass("pulse");
            imageResizer.load(file)
                .then(function (base64) {
                    $('#img_source_img').attr('src',base64);
                    $('#t_name').val('ic_'+imageResizer.getFileNameWithOutExtension());

                })
                .catch(function (err) {
                    console.log(err);
                    M.toast({html:err.toString(),displayLength:3000, classes:'toast-container'});
                })
        });
    });
}

var infoFormIsValid = false;
function setSizeAutoCompleteFieldFocusValidation() {

    var atcWidth = $('#atc_width');
    var atcHeight = $('#atc_height');
    var tName = $('#t_name');

    var sAtcWidth = $('#s_atc_width');
    var sAtcHeight = $('#s_atc_height');
    var sTName = $('#s_t_name');

    function onFocusOut(atc, s) {
        return function () {
            infoFormIsValid = false;
            if(!isSizeValid(atc.val())) {
                s.text('Only match_parent, wrap_content or [NUMBER]dp is allowed');
            }
            else {
                s.text(null);

                if(isSizeValid(atcWidth.val()) && isSizeValid(atcHeight.val())) {
                    var validate = validateBothSize(atcWidth.val(),atcHeight.val());
                    if( validate !== true) {
                        sAtcWidth.text(validate);
                        sAtcHeight.text(validate);
                    }
                    else {
                        infoFormIsValid = true;
                        sAtcWidth.text(null);
                        sAtcHeight.text(null);
                    }
                }
            }
        }
    }

    atcWidth.focusout(onFocusOut(atcWidth,sAtcWidth));
    atcHeight.focusout(onFocusOut(atcHeight,sAtcHeight));
}

function setOrientationRadioButtons() {
    var rbPortrait = $('#rb_orientation_portrait');
    var rbLandscape = $('#rb_orientation_landscape');
    var rbBoth = $('#rb_orientation_both');
    var cbShowOrientation = $('#cb_show_orientation');
    function changeRb() {
        var isBothChecked = rbBoth.prop("checked");
        cbShowOrientation.prop('checked',isBothChecked);
        if(isBothChecked)
            cbShowOrientation.prop('disabled','disabled');
        else
            cbShowOrientation.removeAttr('disabled');
    }
    rbPortrait.change(changeRb);
    rbLandscape.change(changeRb);
    rbBoth.change(changeRb);
    cbShowOrientation.change(function () {
    });
}


function setDoneButton() {
    var aDone = $('#a_done');
    var atcWidth = $('#atc_width');
    var atcHeight = $('#atc_height');
    aDone.click(function () {
        if(!imageResizer.isLoaded()) {
            M.toast({html:'',displayLength:3000, classes:'toast-container'});
            return;
        }

        if(!infoFormIsValid) {
            M.toast({html:'Enter required fields',displayLength:3000, classes:'toast-container'});
            return;
        }

        {
            var ldpi,mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi;
            var nameFromField = $('#t_name').val();
            var name = nameFromField?nameFromField:imageResizer.getFileNameWithOutExtension();
            var extension = 'png';

            imageResizer.resize(imageResizer.getDpi(atcWidth.val(),atcHeight.val(),screenTypes.drawable_ldpi))
                .then(function (result) {
                    ldpi = result;
                    return imageResizer.resize(imageResizer.getDpi(atcWidth.val(),atcHeight.val(),screenTypes.drawable_mdpi))
                })
                .then(function (result) {
                    mdpi = result;
                    return imageResizer.resize(imageResizer.getDpi(atcWidth.val(),atcHeight.val(),screenTypes.drawable_hdpi))
                })
                .then(function (result) {
                    hdpi = result;
                    return imageResizer.resize(imageResizer.getDpi(atcWidth.val(),atcHeight.val(),screenTypes.drawable_xhdpi))
                })
                .then(function (result) {
                    xhdpi = result;
                    return imageResizer.resize(imageResizer.getDpi(atcWidth.val(),atcHeight.val(),screenTypes.drawable_xxhdpi))
                })
                .then(function (result) {
                    xxhdpi = result;
                    return imageResizer.resize(imageResizer.getDpi(atcWidth.val(),atcHeight.val(),screenTypes.drawable_xxxhdpi))
                })
                .then(function (result) {
                    xxxhdpi = result;
                    return zipper.zip(name,extension,ldpi,mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi)})
                .then(function (zippedContent) {
                    return Promise.resolve(saveAs(zippedContent,name+'.zip'))
                })
                .then(function () {
                    aDone.removeClass("pulse");
                    M.toast({html:'Images resized and downloaded',displayLength:3000, classes:'toast-container'});
                })
                .catch(function (err) {
                    console.log(err);
                    M.toast({html:err.toString(),displayLength:3000, classes:'toast-container'});
                });
        }

    });
}
