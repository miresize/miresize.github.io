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

    this.resize = function () {
        return new Promise(function (resolve, reject) {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext("2d");

            canvas.width = 200;
            canvas.height = 200;
            ctx.drawImage(img,0,0,canvas.width,canvas.height);
            var dataurl = canvas.toDataURL('image/png','base64');
            dataurl = dataurl.split(',')[1];
            resolve(dataurl);
        });
    }
}




function Zipper() {
    var zip = new JSZip();
    this.zip = function (name, img_l) {
        var drawable_ldpi = zip.folder('drawable-ldpi');
        drawable_ldpi.file(name+'.png',img_l,{base64:true});
        return zip.generateAsync({type:'blob'});
    }
}