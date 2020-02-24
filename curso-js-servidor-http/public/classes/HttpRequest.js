class HttpRequest
{

    static get(url, params = {})
    {
        // cria uma chamada específica para a função GET
        return HttpRequest.request('GET', url, params);
    }

    static delete(url, params = {})
    {
        // cria uma chamada específica para a função DELETE
        return HttpRequest.request('DELETE', url, params);
    }

    static put(url, params = {})
    {
        // cria uma chamada específica para a função PUT
        return HttpRequest.request('PUT', url, params);
    }    

    static post(url, params = {})
    {
        // cria uma chamada específica para a função POST
        return HttpRequest.request('POST', url, params);
    }       

    static request(method, url, params = {})
    {

        // cria uma promessa de execução da função
        // se der certo, executa o resolver, caso contrário, executa o reject
        return new Promise((resolve, reject) =>
        {

            // cria uma chamada 'ajax'
            // fazendo uma chamada ao servidor para retornar os usuários cadastrados
            let ajax = new XMLHttpRequest();

            // configura o método e a url a ser executada
            ajax.open(method.toUpperCase(), url);

            // configura o evento a ser executado caso ocorra erro
            ajax.onerror = event =>
            {
                reject(e);
            }

            // event o evento a ser executado
            ajax.onload = event =>
            {

                // inicializa a variável como 'vazio'
                let obj = {};

                try
                {
                   // retorna o array json e armazena em 'obj'
                   obj = JSON.parse(ajax.responseText);
                }
                catch(e)
                {
                    // falha na execução
                    reject(e);
                    console.error(e);
                }

                // sucesso na execução
                resolve(obj);

            }

            // executa a chamada a função 'ajax'
            ajax.setRequestHeader('Content-Type', 'application/json');
            ajax.send(JSON.stringify(params));                

        });        

    }

}