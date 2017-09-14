export const str2base64 = function(str) {
    return new Buffer(str).toString('base64');
}
