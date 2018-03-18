var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
/* #### Watson shit #### */
/* #### Watson shit #### */
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var tone_analyzer = new ToneAnalyzerV3({
    username: 'ce422312-b0d5-4c13-bf76-c2adad72c2d9',
    password: 'FL3GjFecSlcq',
    version_date: '2017-09-21'
});
var params = {
    'tone_input': {
        'text': 'Yeah but I wanna hang out with positive and successful people who are open to ideas. That are my friends and will be honest with me with feedback—and if they’re stressed they’ll let me know.'
    },
    'content_type': 'application/json'
};

function analyzeMessage(msg) {
    var messageParams = {
        'tone_input': {
            'text': msg
        },
        'content_type': 'application/json'
    };
    tone_analyzer.tone(messageParams, function (error, response) {
        if (error) {
            console.log('error:', error);
        } else {
            io.emit('chat message', response);
            console.log(JSON.stringify(response, null, 2));
            //formatTone(response);
        }
    });
}

function analyze() {
    tone_analyzer.tone(params, function (error, response) {
        if (error) {
            console.log('error:', error);
        } else {
            io.emit('chat message', response);
            console.log(JSON.stringify(response, null, 2));
            //formatTone(response);
        }
    });

}

function formatTone(input) {
    console.log(input);
    console.log("in the functoin");
    io.emit(JSON.stringify(input.document_tone.tones[1].score));
    io.emit(input.document_tone.tones[1].score);
    console.log("still in function");
}
/* #### Watson shit #### */
/* #### Watson shit #### */



app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
        io.emit('message text', msg);
        //analyze();
        analyzeMessage(msg);
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(80, function () {
    console.log('listening on *:3000');
});
