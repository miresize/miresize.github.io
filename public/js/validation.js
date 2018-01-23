
function isSizeValid(size) {
    var regex = new RegExp('[0-9]dp');
    console.log(regex.test(size));
    return size === 'match_parent' || size === 'wrap_content' || regex.test(size);
}

function validateBothSize(width, height) {
    if(width === 'match_parent' && height === 'match_parent')
        return "width and height can't be match_parent at a time";
    else if(width === 'wrap_content' && height === 'wrap_content')
        return "width and height can't be wrap_content at a time";
    else
        return true;
}