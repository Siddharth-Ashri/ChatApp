//setting up express
let express = require('express');
let bodyParser = require('body-parser');
//setting up an instance of express
let app = express();

let http = require('http').Server(app);
let io = require('socket.io')(http); //will give a 404 since socket.io requires http server to work underneath it
let mongoose = require('mongoose');
let dbUrl = "mongodb+srv://nitin:nitin@cluster0-e4vnz.mongodb.net/test?retryWrites=true";
//listening for the server and changes
app.use(express.static(__dirname))//to serve static content we use express.static()

app.use(bodyParser.json()); //lets the server know that we are sending json files

app.use(bodyParser.urlencoded({ extended: false }));

let Message = mongoose.model('Message', {
    name: String,
    message: String
});

//sample message array

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    })
});

//getting a message for a specific user
app.get('/messages/:user', (req, res) => {
    let name = req.params.user;
    Message.find({name:name}, (err, messages) => {
        res.send(messages);
    })
});


io.on('connection', (socket) => {
    console.log('a user connected');
});

app.post('/messages', async (req, res) => {

    try {
        let message = new Message(req.body);

        let savedMessage = await message.save();

        console.log('saved');

        let censored = await Message.findOne({ message: 'badword' });

        //only if a censored word is found delete it
        if (censored)
            await Message.deleteOne({ _id: censored._id });
        else
            await io.emit('message', req.body);

        res.sendStatus(200);

    } catch (error) {
        res.sendStatus(500);
        return console.error(error);

    }finally{
        console.log('message sent');
    }
})

//connecting to the database

mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => {
    console.log('connection', err);
})

let server = http.listen(3001, () => {
    console.log("Server is listening on port:", server.address().port);
});