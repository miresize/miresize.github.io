function pickImage(cb) {
    var input = $(document.createElement('input'));
    input.attr('type','file');
    input.attr('accept','image/jpeg,image/jpg,image/png');
    input.trigger('click');
    input.change(function (event) {
        var tgt = event.target || window.event.srcElement;
        var files = tgt.files;
        cb(files[0],input.val());
    });
}



function getWidthAndHeight(aspectRatio,userWidth,userHeight,screenType) {
    userWidth = userWidth.replace('dp','');
    userHeight= userHeight.replace('dp','');

    function getWidthHeight(aspectRatio,uWidth,uHeight,factor,matchParentToDp) {
        function convertToWidthHeightObject(width,height) {
            return {
                'width':width,
                'height':height
            };
        }
        function isDimensionInDp(dimen) {
            // noinspection EqualityComparisonWithCoercionJS
            return  dimen == parseFloat(dimen);
        }

        if (uWidth === 'match_parent')
            uWidth = matchParentToDp/factor;
        else if(uHeight === 'match_parent')
            uHeight = matchParentToDp/factor;

        if(isDimensionInDp(uWidth) && isDimensionInDp(uHeight))
            return convertToWidthHeightObject(uWidth*factor,uHeight*factor);
        else if(isDimensionInDp(uWidth) && uHeight === 'wrap_content')
            return convertToWidthHeightObject(uWidth*factor,(uWidth*factor)/aspectRatio);
        else if(isDimensionInDp(uHeight) && uWidth === 'wrap_content')
            return convertToWidthHeightObject(uHeight*factor*aspectRatio,uHeight*factor);
        else
            throw new Error('width and height validation missed');
    }


    switch (screenType) {
        case 'drawable-ldpi':
            return getWidthHeight(aspectRatio,userWidth,userHeight,0.5,120*2.5);
        case 'drawable-hdpi':
            return getWidthHeight(aspectRatio,userWidth,userHeight,1,160*2.5);
        case 'drawable-mdpi':
            return getWidthHeight(aspectRatio,userWidth,userHeight,1.5,240*2.5);
        case 'drawable-xhdpi':
            return getWidthHeight(aspectRatio,userWidth,userHeight,2,320*2.5);
        case 'drawable-xxhdpi':
            return getWidthHeight(aspectRatio,userWidth,userHeight,3,480*2.5);
        case 'drawable-xxxhdpi':
            return getWidthHeight(aspectRatio,userWidth,userHeight,4,640*2.5);
        default:
            throw new Error('invalid screen type: ' + screenType);
    }
}


