module.exports =
{

    user: (app, req, res) =>
    {

        // função de validação do expressValidator        
        req.assert('_name' , 'O nome deve ser informado.').notEmpty();
        req.assert('_email', 'O e-mail deve ser informado.').notEmpty();
        req.assert('_email', 'O e-mail informado é inválido.').isEmail();

        let erros = req.validationErrors();

        if (erros)
        {
            app.utils.error.send(erros, req, res);
            return false;
        }
        else
        {
            return true;
        }

    }
}