$(function () {
    var atcSizeData = getAtcSizeDataObject();
    var aPickImage = $('#a_pick_image');
    var dropDownSelectDevice = $("#dropdown_trigger_select_device");

    //for dropdown
    dropDownSelectDevice.dropdown({hover:false});


    //for auto complete text width
    $('#atc_width').autocomplete(atcSizeData);
    //for auto complete text height
    $('#atc_height').autocomplete(atcSizeData);

    $('#a-device-android').click(function () {
        dropDownSelectDevice.val('aa')
    });

    aPickImage.click(function () {
        pickImage(function (file) {
            console.log(file);
            aPickImage.removeClass("pulse");
            var fr = new FileReader();
            fr.onload = function () {
                console.log('loaded');
                $('#img_source_img').attr('src',fr.result);
            };
            fr.readAsDataURL(file);
        });
    });
});





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