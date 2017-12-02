BASE = 62;
const table = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

exports.toBase62 = function(id, base62Alg, callback){
    var arr = base62Alg;
    do{
        var mod = Number(id % BASE);
        arr.push(mod);
        id = Math.floor(id / BASE);
        if(id === 0)
            callback();
    }while(id)
}

exports.fromBase62 = function(shorturl, callback){
    var result = 0;
    var pos = 0;
    var mul = 1;
    for(var i = 0; i < shorturl.length; i++)
    {
        pos = table.indexOf(shorturl[i]);
        result += (pos * mul);
        mul *= BASE;
        if(i === (shorturl.length - 1)){
            callback(result);
        }
    }
    return -1;
}