
// exporta uma função que recebe a
// variável 'app' como parâmetro

let NeDB = require('nedb');

let db = new NeDB(
    {
        filename:'users.db',
        autoload:true
    }
);

// exporta as funcionalidades deste 
// arquivo 'js', recebendo como parâmetro
// uma variável 'app'
module.exports = (app) =>
{

    let route = app.route('/users');

    route.get((req, res) =>
    {

        // busca todos no banco de dados, ordenando por 'name'
        db.find({}).sort({name:1}).exec((err, users)=>
        {
            if (err)
            {
                app.utils.error.send(err, req, res);
            }
            else
            {

                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(
                    {
                       users:users
                    });                
            }
        });

    });

    app.post('/users', (req, res) =>
    {

        // função de validação do expressValidator        
        if (!app.utils.validator.user(app, req, res)) return false;

        // mostra o registro que esta sendo incluído
        console.log('dados registro inclusão: ' + JSON.stringify(req.body));
        
        db.insert(req.body, (err, user) =>
        {
            if (err)
            {
                app.utils.error.send(err, req, res);
            }
            else
            {
                res.status(200).json(user);                
            }
        });

    });    

    let routeId = app.route('/users/:id');

    routeId.get((req, res) =>
    {

        // busca todos no banco de dados, ordenando por 'name'
        db.findOne({_id:req.params.id}).exec((err, user)=>
        {
            if (err)
            {
                app.utils.error.send(err, req, res);
            }
            else
            {
                res.status(200).json(user);
            }
        });

    });

    routeId.put((req, res) =>
    {

        // função de validação do expressValidator        
        if (!app.utils.validator.user(app, req, res)) return false;        

        // mostra o registro que esta sendo incluído
        console.log('dados registro alteração: ' + JSON.stringify(req.body));        

        // atualiza o registro passado como parametro
        db.update({_id:req.params.id}, req.body, err =>
        {
            if (err)
            {
                app.utils.error.send(err, req, res);
            }
            else
            {
                res.status(200).json(Object.assign(req.params, req.body));
            }
        });

    });    

    routeId.delete((req, res) =>
    {

        // exclui o registro passado como parametro
        db.remove({_id:req.params.id}, {}, err =>
        {
            if (err)
            {
                app.utils.error.send(err, req, res);
            }
            else
            {
                res.status(200).json(req.params);
            }
        });

    });    

};


// código anterior, quando não tinha o consign
/*
let express = require('express');
let routes = express.Router();

routes.get('/', (req, res) =>
{

    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.json(
        {
        users:[
                {
                   name: 'HCode', 
                   email: 'contato@hcode.com.br',
                   id: 1
                }
              ]

        });
});

routes.get('/admin', (req, res) =>
{

    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.json(
        {
           users:[]
        });
});

// exporta o objeto routes para ser acessado em outro arquivo
module.exports = routes;
*/