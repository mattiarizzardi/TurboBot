/*globals require, console, process */
const express = require('express');
const apiai = require('apiai')('b3a1ea5e0755426499dfeacd76830962');
const app = express();

app.use('/', express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images

const server = app.listen(process.env.PORT || 5000, function () {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const io = require('socket.io')(server);
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('chat message', function (text) {
        

        // Get a reply from API.ai

        var apiaiReq = apiai.textRequest(text, {
            sessionId: 'hkjhkjh'
        });

        apiaiReq.on('response', function (response) {
            var aiText = response.result.fulfillment.messages[0].speech;
            //aiText = aiText.replace(/\n/g,'\n')
            socket.emit('bot reply', aiText);
        });

        apiaiReq.on('error', function (error) {
            console.log(error);
        });

        apiaiReq.end();

    });
});
