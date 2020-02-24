module.exports = 
{

    // método 'send'
    send: (err, req, res, code = 400)=>
    {
        console.log(`erro: ${err}`);
        res.status(code).json(
        {
            error: err
        });
    }

}