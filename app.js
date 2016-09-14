var restify = require('restify');
var https = require('https');
var builder = require('botbuilder');


var connector = new builder.ChatConnector({
    appId: process.env.MY_APP_ID,
    appPassword: process.env.MY_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
var iFound = 0;
var clauseTitleFound = [];

var server = restify.createServer();
server.post('/api/messages', connector.listen());
server.port = process.env.port || process.env.PORT || 80;
server.host = process.env.port || '0.0.0.0';
server.listen(server.port,server.host, function () {
       console.log('%s FDICbotmbf listening to %s', server.name, server.url);
});

function getData(key) {
clauseTitleFound = [];
var data = {"0":"","1.1":"CT1111","1.2":"CT122222","1.3":"CT13333"};
var clausesAry = [];
for (var i in data)
    {clausesAry.push([i, data [i]]);
    console.log("clausesAry = " + clausesAry[0][i]);}
var iFound = 0;
for (var i = 0; i < clausesAry.length; i++) {
  if (clausesAry[i][0] == key) {
    iFound = i;
    break;}
}

if (iFound != 0){clauseTitleFound[0] = clausesAry[iFound][1];}
     else {clauseTitleFound[0] = clausesAry[0][1];}
console.log("iFound = " + iFound + "; clauseTitleFound = " + clauseTitleFound); 
}


//var intents = new builder.IntentDialog();  
//bot.dialog('/', intents); 

bot.dialog('/', new builder.IntentDialog()
    .matches(/^Hi/i, '/start')
    .matches(/^change/i, '/changeTask')
    .matches(/^delete/i, '/deleteTask')
    .onDefault(builder.DialogAction.send("Sorry. Not understood."))
);

//intents.matches(/^Hi/i, [ 

bot.dialog('/start', [
    
    function (session) {
        builder.Prompts.text(session, "Search Construction (say c) or Plant (say p)?");
                     },
    
    function(session, results) {  
        builder.Prompts.text(session, 'Clause number?');  
                      }, 
    
    function(session, results) {  
        getData(results.response); 
        var book = clauseTitleFound[0];
        console.log("clauseTitleFound = " + book);
        if (book == "")
            {session.send('Try again');}
            else
            {session.send('Clause title is :' + book);} 
    }  
  
]);  
  
server.get('/', restify.serveStatic({
    directory: __dirname,
    default: '/index.html'
}));
