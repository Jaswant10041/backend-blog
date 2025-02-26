const http=require('http');

const server=http.createServer(function(req,res){
    if(req.url==='/ate'){
        res.end('yes');
    }
    res.end("no");
});
server.listen(3000);