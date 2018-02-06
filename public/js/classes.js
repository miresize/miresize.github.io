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

            canvas.width = 2000;
            canvas.height = 2000;
            ctx.drawImage(img,0,0,canvas.width,canvas.height);
            resolve(canvas.toDataURL());
        });
    }
}




function Downloader() {
    var zip = new JSZip();
    this.download = function (name, img_l) {
        var drawable_ldpi = zip.folder('drawable-ldpi');
        drawable_ldpi.file(name+'.png',img_l,{base64:true});
        zip.generateAsync({type:'blob'}).then(function (content) {

        });
    }
}