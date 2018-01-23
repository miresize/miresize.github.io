function pickImage(cb) {
    var input = $(document.createElement('input'));
    input.attr('type','file');
    input.attr('accept','image/jpeg, image/png');
    input.trigger('click');
    input.change(function (event) {
        var tgt = event.target || window.event.srcElement;
        var files = tgt.files;
        cb(files[0]);
    });
}