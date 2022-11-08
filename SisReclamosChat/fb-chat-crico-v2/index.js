var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var { Client } = require('pg')
const { client_encoding } = require('pg/lib/defaults')

const client = new Client({
    user: 'oigbbzzucgzquo',
    host: 'ec2-18-204-36-213.compute-1.amazonaws.com',
    database: 'datluuu57evb9p',
    password: '7d8b7774966ab7aa3e69d77997760f7c6477c1eed31c9d32bd4bd0c1c2c6603a',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
})

client.connect(function(err){
    if (err) throw err;
    console.log("DB Connected!!");
});
var app = express()

let users = {}
let clientes = [];

(async function(){
    clientes = await client.query({
        rowMode: 'array',
        text: 'select "numeroCliente" from cliente'
    });
})()


console.log("ESTOS SON LOS CLIENTES", clientes.rows);
const estados = {
    pregunta1: 'pregunta1',
    pregunta2: 'pregunta2',
    fin: 'fin',
    error: 'error'
}

const mensajes = {
    [estados.pregunta1]: 'Hola, cual es tu número de cliente?',
    [estados.pregunta2]: 'Cual es la descripción de tu reclamo?',
    [estados.fin]: 'Muchas gracias por registrar tu reclamo',
    [estados.error]: 'Lo siento, no estas registrado dentro del sistema. Intenta con otro numero de Cliente'

}

const estadosSiguientes = {
    [estados.pregunta1]: estados.pregunta2,
    [estados.pregunta2]: estados.fin
}

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hola mundo soy un chat')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'EAAF8mTTA32sBACJVEWOSckBOZBG4kLHngoj1HZBAq6UMItatZC4KQKJZCx4ZC8HbpP7ZBp5jbXrB5uakpRD2ZAx5bSVf1AlxaeMzUZAX0dJUWEifVJ7EwGGcFpFKNh5EuXnvZALe4bpoPCHrBPQAiZBZBqIaivaflmtrpxxWp4ZBZAMmh8NwKzBPsDkZA6') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})


// API End Point - added by Stefan

app.post('/webhook/', function (req, res) {
    // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the body of the webhook event
        let webhook_event = entry.messaging[0];
        console.log(webhook_event.message.text);

        revisarEstadoActual(webhook_event);

    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
})
function revisarEstadoActual(event) {
    const senderId = event.sender.id;
    if(!users[senderId]){
        //Setea el estado inicial
        users[senderId] = {};
        users[senderId].estadoActual = estados.pregunta1;
    } else{
        console.log("Estado actual", users[senderId].estadoActual);
        users[senderId][users[senderId].estadoActual] = event.message.text;
        console.log("Mensaje actual", users[senderId][users[senderId].estadoActual]);
        users[senderId].estadoActual = estadosSiguientes[users[senderId].estadoActual];
        console.log("Estado nuevo", users[senderId].estadoActual);
        if(users[senderId].estadoActual == estados.fin){
            sendTextMessage(senderId, "Puedes visitar el siguiente link para ver tu reclamo: http://localhost:3000/");
            guardarBDRegistroReclamo(users[senderId]);
        }
    }
    console.log("ESTOS SON LOS CLIENTES", clientes.rows)
    let clienteValidado = 1
    if(users[senderId].estadoActual == estados.pregunta2){
        let encontrado = false;
        clientes.rows.forEach(row => {
            if(row[0] == String(users[senderId][estados.pregunta1])){
                encontrado = true; 
            }
        })
        if(!encontrado) {
            sendTextMessage(senderId, mensajes[estados.error]);
            clienteValidado = 0;
            users = {};
            return; 
        } 
    }
    if(!clienteValidado) return;

    sendTextMessage(senderId, mensajes[users[senderId].estadoActual]);
    if(users[senderId].estadoActual == estados.fin){
        users[senderId] = null;
    }
}
async function validarDNI(usuario) {
    const getIdClienteQuery = 'select "idCliente" from cliente where "numeroCliente" = $1';
    const valuesGetIdCliente = [usuario[estados.pregunta1]];

    let validacionCliente = null;
    try{
        validacionCliente = await client.query(getIdClienteQuery, valuesGetIdCliente)
    }
    catch (err){
        console.log("Error base de datos", err);
    }
    console.log("Number of rows", validacionCliente.rows.length != 0);
    return validacionCliente.rows.length != 0;
}
function guardarBDRegistroReclamo(usuario) {
    const getIdClienteQuery = 'select "idCliente" from cliente where "numeroCliente"= $1';
    const valuesGetIdCliente = [usuario[estados.pregunta1]];
    client.query(getIdClienteQuery,valuesGetIdCliente, (err, res) => {
        if(err) {
            console.log(err.stack);
        }
        else {
            let idCliente = res.rows[0].idCliente;
            let estado = 'REGISTRADO';
            const textInsert = "insert into \"reclamoCanalAtencion\"(\"idCliente\", \"descripcion\", \"fechaRegistro\", \"idCanalAtencion\", \"estado\") values ($1, $2, $3, 2, 'REGISTRADO') RETURNING *"
            const valuesInsert = [idCliente, usuario[estados.pregunta2], new Date()];

            client.query(textInsert, valuesInsert, (err, res)=> {
                if (err) {
                    console.log(err.stack);
                }        
                else {
                    console.log(res.rows[0]);
                }
            });
        }
    });
    
}
var token = "EAAF8mTTA32sBACJVEWOSckBOZBG4kLHngoj1HZBAq6UMItatZC4KQKJZCx4ZC8HbpP7ZBp5jbXrB5uakpRD2ZAx5bSVf1AlxaeMzUZAX0dJUWEifVJ7EwGGcFpFKNh5EuXnvZALe4bpoPCHrBPQAiZBZBqIaivaflmtrpxxWp4ZBZAMmh8NwKzBPsDkZA6"

// function to echo back messages - added by Stefan

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


// Send an test message back as two cards.

function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Ai Chat Bot Communities",
                    "subtitle": "Communities to Follow",
                    "image_url": "http://1u88jj3r4db2x4txp44yqfj1.wpengine.netdna-cdn.com/wp-content/uploads/2016/04/chatbot-930x659.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.facebook.com/groups/aichatbots/",
                        "title": "FB Chatbot Group"
                    }, {
                        "type": "web_url",
                        "url": "https://www.reddit.com/r/Chat_Bots/",
                        "title": "Chatbots on Reddit"
                    },{
                        "type": "web_url",
                        "url": "https://twitter.com/aichatbots",
                        "title": "Chatbots on Twitter"
                    }],
                }, {
                    "title": "Chatbots FAQ",
                    "subtitle": "Aking the Deep Questions",
                    "image_url": "https://tctechcrunch2011.files.wordpress.com/2016/04/facebook-chatbots.png?w=738",
                    "buttons": [{
                        "type": "postback",
                        "title": "What's the benefit?",
                        "payload": "Chatbots make content interactive instead of static",
                    },{
                        "type": "postback",
                        "title": "What can Chatbots do",
                        "payload": "One day Chatbots will control the Internet of Things! You will be able to control your homes temperature with a text",
                    }, {
                        "type": "postback",
                        "title": "The Future",
                        "payload": "Chatbots are fun! One day your BFF might be a Chatbot",
                    }],
                },  {
                    "title": "Learning More",
                    "subtitle": "Aking the Deep Questions",
                    "image_url": "http://www.brandknewmag.com/wp-content/uploads/2015/12/cortana.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "AIML",
                        "payload": "Checkout Artificial Intelligence Mark Up Language. Its easier than you think!",
                    },{
                        "type": "postback",
                        "title": "Machine Learning",
                        "payload": "Use python to teach your maching in 16D space in 15min",
                    }, {
                        "type": "postback",
                        "title": "Communities",
                        "payload": "Online communities & Meetups are the best way to stay ahead of the curve!",
                    }],
                }]  
            } 
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

