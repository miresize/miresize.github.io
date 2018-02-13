var screenTypes = {
    drawable_ldpi:'drawable-ldpi',
    drawable_hdpi:'drawable-hdpi',
    drawable_mdpi:'drawable-mdpi',
    drawable_xhdpi:'drawable-xhdpi',
    drawable_xxhdpi:'drawable-xxhdpi',
    drawable_xxxhdpi:'drawable-xxxhdpi'
};


function ImageResizer() {
    var img = new Image();
    var loaded = false;


    this.load = function (file) {
        img.src = file;
    };

    this.isLoaded = function () {
        return loaded;
    };

    img.onload = function () {
        loaded = true;
    };

    function validateIfImageIsLoaded() {
        if(loaded)
            return true;
        else
            throw new Error("Image is not loaded");
    }


    this.getDpi = function (userWidth, userHeight,screenType) {
        validateIfImageIsLoaded();
        var aspectRation = img.width/img.height;
        return getWidthAndHeight(aspectRation,userWidth.toLowerCase(),userHeight.toLowerCase(),screenType);
    };


    this.resize = function (wh) {
        return new Promise(function (resolve, reject) {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext("2d");

            canvas.width = wh.width;
            canvas.height = wh.height;
            ctx.drawImage(img,0,0,canvas.width,canvas.height);
            var dataurl = canvas.toDataURL('image/png','base64');
            dataurl = dataurl.split(',')[1];
            resolve(dataurl);
        });
    }
}




function Zipper() {
    var zip = new JSZip();
    this.zip = function (name,extension, ldpi,mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi) {
        zip.folder(screenTypes.drawable_ldpi)   .file(name+'.'+extension,ldpi,{base64:true});
        zip.folder(screenTypes.drawable_mdpi)   .file(name+'.'+extension,mdpi,{base64:true});
        zip.folder(screenTypes.drawable_hdpi)   .file(name+'.'+extension,hdpi,{base64:true});
        zip.folder(screenTypes.drawable_xhdpi)  .file(name+'.'+extension,xhdpi,{base64:true});
        zip.folder(screenTypes.drawable_xxhdpi) .file(name+'.'+extension,xxhdpi,{base64:true});
        zip.folder(screenTypes.drawable_xxxhdpi).file(name+'.'+extension,xxxhdpi,{base64:true});
        return zip.generateAsync({type:'blob'});
    }
}