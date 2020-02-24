
module.exports = (app) =>
{

    app.get('/', (req, res) =>
    {
    
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        res.end('<h1>Servidor em execucao</h1>' + 
                '<h2>Porta: 4000</h2>' );    
    });

};








/*

// código antes da implantação do consign (exemplo)
let express = require('express');
let routes = express.Router();

routes.get('/', (req, res) =>
{

    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.end('<h1>Servidor em execucao</h1>' + 
            '<h2>Porta: 3000</h2>' );    
});

// exporta o objeto routes para ser acessado em outro arquivo
module.exports = routes;

*/