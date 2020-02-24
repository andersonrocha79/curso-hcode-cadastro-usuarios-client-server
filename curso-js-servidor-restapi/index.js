/*

    npm                 
    node package manager

    package.json        
    Contém definições e dependências de um projeto Node.js

    npm init            
    inicia um novo projeto node.js, e ao final gera um arquivo package.json

    npm install express --save
    instala o pacote 'express' neste projeto 
    e utiliza '--save' para salvar esta dependência no package.json

    npm install
    ao copiar o projeto para um outro computador ou local, basta executar o 'npm install'
    que o 'npm' irá baixar todos os pacotes e manter o projeto pronto para ser executado

    nodemon
    serviço que fica rodando e faz o deploy dos arquivos alterados de forma automática para o servidor
    é utilizado no ambiente de desenvolvimento onde os arquivos são alterados a todo momento
    
    npm install nodemon -g
    instala o pacote 'nodemon' com o parâmetro '-g', que indica que será uma instalação
    global, fazendo com que este pacote fique disponível para todos os projetos

    node index
    para executar a aplicação com o 'node.js' executando o arquivo inicial, que seria o 'index.js'

    nodemon index
    para executar a aplicação com o nodemon que faz o deploy automático dos arquivos alterados

    npm install consign --save
    instalando o gerenciador de rotas
     
    npm install body-parser --save
    instalando o complemento do 'express' para interpretação do body das mensagens enviadas
    no postman, alterar o tipo de form post para x-www-form-urlencoded

    npm install nedb --save
    instalando um banco de dados 'javascript' que fica embutido no servidor

    npm install express-validator --save
    npm install express-validator@5.3.1 --save-exact
    instalando a extensão do 'express' para validação de dados passados no body
    colocando a versão 5.3.1 para que não ocorram erros no código, devido a mudança do componente

    npm install -g bower
    instala as dependências visuais do projeto (html, css)

*/


// servidor utilizando o componente 'express'

const express          = require("express");
const consign          = require("consign");
const bodyParser       = require("body-parser");  
const expressValidator = require("express-validator");

// inicia o express
let app = express();

// independente da codificação que vier, ele vai entender o conteúdo do post
app.use(bodyParser.urlencoded({extended:false, limit: '50mb'}));

// todos os dados que receber via post, converter para json
app.use(bodyParser.json({limit: '50mb'}));

// utiliza o expressValidador para que a aplicação realize validações no servidor rest
// documentação: https://express-validator.github.io/docs/
app.use(expressValidator());

/*
// código anterior, quando o consign não estava instalado
// rotas
let routesIndex     = require("./routes/index");
let routesUsers     = require("./routes/users");

// inclui as rotas existentes na aplicação
app.use(routesIndex);
app.use('/users', routesUsers);
*/

// o consign vai tratar as rotas agora
// irá incluir a rota de forma automática de
// todos os arquivos da pasta 'routes'
// incluindo a pasta 'util', indica que os arquivos 
// da pasta util, como 'error.js' poderão ser acessado pela variável 'app'
// da seguinte forma: app.utils.error.send(...)
consign().include('routes').include('utils').into(app);

// inicia o servidor na porta 3000, no servidor local
app.listen(4000, '127.0.0.1', ()=>
{
    console.log("servidor executando!");
});




/*

servidor utilizando apenas http

const http = require("http");

let server = http.createServer((req, res)=>
{

    console.log("url: "    , req.url);
    console.log("method: " , req.method);

    // res.end("finalizado");

    switch (req.url)
    {

        case '/':
            res.statusCode = 200;
            res.setHeader('Content-type', 'text/html');
            res.end('<h1>Servidor em execucao</h1>' + 
                    '<h2>Porta: 3000</h2>' );
            break;

        case '/users':
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.end(JSON.stringify(
                {
                users:[
                            {
                            name: 'HCode', 
                            email: 'contato@hcode.com.br',
                            id: 1
                            }
                        ]

                }));
            break;

        default:
            res.statusCode = 400;
            res.setHeader('Content-type', 'text/html');
            res.end('<h1>Caminho nao encontrado</h1>');
            break;

    
    }

});

server.listen(3000, '127.0.0.1', ()=>
{

    console.log("servidor executando!");

});

*/
