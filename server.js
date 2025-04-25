import fs from "fs";

import https from "https";

import next from "next";

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    https.createServer(
        {
            key: fs.readFileSync('./ssl/localhost-key.pem'),
            cert: fs.readFileSync('./ssl/localhost.pem')
        },
        (req, res) => {
            handle(req, res);
        }
    ).listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on https://localhost:3000');
    });
});
