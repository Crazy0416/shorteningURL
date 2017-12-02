BASE = 62;
// 62진수로 표현하기 위해 필요한 table
const table = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// DB id값을 62진수로 전환
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

// 62진수 문자열을 id 값으로(10진수) 바꿈
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