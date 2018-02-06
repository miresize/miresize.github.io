function pickImage(cb) {
    var input = $(document.createElement('input'));
    input.attr('type','file');
    input.attr('accept','image/jpeg,image/jpg,image/png');
    input.trigger('click');
    input.change(function (event) {
        console.log(input.val());
        var tgt = event.target || window.event.srcElement;
        var files = tgt.files;
        cb(files[0],input.val());
    });
}