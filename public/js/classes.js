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
    var _file;


    this.load = function (file) {
        _file = file;
        _self = this;
        return new Promise(function (resolve, reject) {
            var ext = _self.getFileExtension();
            var fileName = _self.getFileNameWithOutExtension();
            if(ext !== "jpg" && ext !== "jpeg" && ext !== "png")
                throw new Error('Invalid image format');
            if (fileName === "")
                throw new Error('Empty file name');

            var fr = new FileReader();
            fr.onload = function () {
                img.src = fr.result;
                resolve(fr.result)
            };
            fr.onerror = function (err) {
                reject(err)
            };
            fr.onabort = function () {
                reject(new Error('Unexpected error. Try again.'))
            };
            fr.readAsDataURL(file);
        });
    };

    this.isLoaded = function () {
        return loaded;
    };

    this.getFileNameWithOutExtension = function () {
        var splitFileName = _file.name.split('.');
        if(splitFileName.length>1)
        {   var fileName = null;
            for(i=0 ;i<splitFileName.length-1 ; i++) {
                if(fileName===null)
                    fileName = splitFileName[i];
                else
                    fileName+='.'+splitFileName[i];
            }
            return fileName.toLowerCase().replace(/[^0-9a-z]{1,}/g,"_");
        }
        else return _file.name;
    };

    this.getFileExtension = function () {
        var splitFileName = _file.name.split('.');
        if(splitFileName.length>1)
            return splitFileName[splitFileName.length-1];
        else
            return "";
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
        var _self = this;
        return new Promise(function (resolve, reject) {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext("2d");

            canvas.width = wh.width;
            canvas.height = wh.height;
            ctx.drawImage(img,0,0,canvas.width,canvas.height);
            var dataurl = canvas.toDataURL();
            console.log(dataurl);
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