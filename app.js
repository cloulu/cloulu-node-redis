var http = require('http');
var redis = require('redis');
 
var port = (process.env.VCAP_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');
 
function getRedisCredentials(){
  var credentials = {}
  var services = JSON.parse(process.env.VCAP_SERVICES);

  credentials = services['redis-2.6'][0]['credentials'];
  console.log(credentials);
  return credentials;
}
 
var redisCredentials = getRedisCredentials();
var redisClient = redis.createClient(redisCredentials.port, redisCredentials.host);
if(redisCredentials.password != '') redisClient.auth(redisCredentials.password);
 
http.createServer(function (req, res) {
  var out = '';
  res.writeHead(200, {'Content-Type': 'text/plain'});
  out += "Hello World! (running on "+host+":"+port+")\n";
  out += "Ping Redis server... ";
  redisClient.send_command('ping', [], function(err, reply){
    if(!err) {
      out += "PONG!\n";
    } else {
      out += "failed!\n";
    }
    res.end(out);
  })
}).listen(port,host);
