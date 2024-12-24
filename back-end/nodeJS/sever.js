const WebSocket = require('ws');
const axios = require('axios');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
    console.log('Arduino connecté');

    ws.on('message', message => {
        console.log(`Carte RFID reçue : ${message}`);

        axios.post('http://localhost:8000/api/rfid', {
            rfid: message
        })
        .then(response => {
            ws.send(JSON.stringify({
                status: 'success',
                access: response.data.access,
                user: response.data.user
            }));
        })
        .catch(error => {
            ws.send(JSON.stringify({
                status: 'error',
                message: 'Accès refusé'
            }));
        });
    });

    ws.on('close', () => {
        console.log('Arduino déconnecté');
    });
});
