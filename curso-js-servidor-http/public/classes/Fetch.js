class Fetch
{

    // classe Fetch substitui os comandos
    // padrão da classe HttpRequest, que utilizava Ajax

    static get(url, params = {})
    {
        // cria uma chamada específica para a função GET
        return Fetch.request('GET', url, params);
    }

    static delete(url, params = {})
    {
        // cria uma chamada específica para a função DELETE
        return Fetch.request('DELETE', url, params);
    }

    static put(url, params = {})
    {
        // cria uma chamada específica para a função PUT
        return Fetch.request('PUT', url, params);
    }    

    static post(url, params = {})
    {
        // cria uma chamada específica para a função POST
        return Fetch.request('POST', url, params);
    }       

    static request(method, url, params = {})
    {

        return new Promise((resolve, reject) =>
        {

            let request;

            switch (method.toLowerCase())
            {

                // para 'get' é necessário apenas a url
                case 'get':
                    request = url;
                    break;

                // para os outros 'métodos', vamos utilizar a classe Request, passando parâmetros
                default:

                    request = new Request(
                        url,
                        {
                            method,
                            body    : JSON.stringify(params),
                            headers : new Headers({'Content-type':'application/json'})
                        }
                    );                                    

            }

            fetch(request).then(response =>
            {

                response.json().then(json =>
                {                
                    resolve(json);
                }).catch(e =>
                {
                    reject(e);
                });

            }).catch(e =>
            {
                reject(e);
            });

        });        


        // códio anterior, utilizando o AJAX
        /*
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
        */     

    }

}