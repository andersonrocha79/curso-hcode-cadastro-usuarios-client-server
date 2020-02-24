class UserControler
{

    // template utilizado: https://adminlte.io/

    constructor(formIdCreate, formIdUpdate, tableId)
    {

        this.formEl        = document.getElementById(formIdCreate);
        this.formUpdateEl  = document.getElementById(formIdUpdate);
        this.tableEl       = document.getElementById(tableId);

        // configura o evento do clique do salvar usuário
        // definindo o que será feito quando o usuário clicarem 'gravar'
        this.onSubmit();      
        
        // configura o evento para o botão 'cancelar'
        // do formulário de edição
        this.onEdit();

        // busca os registros já armazenados na Storage
        this.selectAll();
        
    }

    onEdit()
    {

        // pesquisa o box com o formulário de edição
        // dentro deste formulário, pesquisa o botão com a classe 'btn-cancel'
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>
        {
            // quando clica em 'cancelar'
            // exibe novamente a div com o form de criar usuário
            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener("submit", event=>
        {

            // desativa o envio do formulário
            event.preventDefault();

            // busca o botão de gravar, que é o único botão com tipo submit do formulário
            let btn = this.formUpdateEl.querySelector("[type=submit]");
            
            // desativa o botão durante o processamento
            btn.disabled = true;        
            
            // busca os valores do formulário
            let values = this.getValues(this.formUpdateEl);   
            
            // busca o índice da linha da tabela que está sendo editada
            let index = this.formUpdateEl.dataset.trIndex;

            // faz referencia a linha da tabela que está sendo alterada
            let tr = this.tableEl.rows[index];

            // armazena os dados que estavam na linha antes da edição
            let userOld = JSON.parse(tr.dataset.user);

            // copia os atributos de um objeto
            // cria um novo objeto 'result'
            // utilizando os dados da userOld, substituindo
            // os valores que existem em values
            // values > userOld > result
            // os campos que existem em values irão substituir
            // os campos da userOld, mas caso não existam em values, serão mantidos
            // os que já existiam em userOld, como a foto, que não foi redefinda, então mantem-se a anterior
            let result = Object.assign({}, userOld, values);

            // faz a chamada para o método getPhoto
            // este método retorna uma Promise
            // que tem dois métodos como parâmetro
            // um a ser executado o método tenha sucesso e outro
            // caso ocorra alguma falha
            this.getPhoto(this.formUpdateEl).then(

                (content) =>                // function(content)
                {

                    // se não tiver informado uma nova foto, mantém a foto anterior
                    if (!values.photo) 
                    {
                        // se não for definida uma novo foto, utiliza a anterior
                        result._photo = userOld._photo;                                    
                    }
                    else
                    {
                        // foi informada uma nova foto, utiliza a nova foto informada
                        result._photo = content;
                    }

                    // cria o objeto 'user' e recupera os dados do json
                    let user = new User();
                    user.loadFromJSON(result);

                    // grava o registro alterado no localStorage
                    user.save().then(user=>
                    {                        

                        // atualiza a 'tr' na tabela que já existe
                        this.getTr(user, tr);                       

                        // atualiza a contagem de usuários e administradores
                        this.updateCount();           
                        
                        // após a inclusão, limpa todos os campos do formulário
                        this.formUpdateEl.reset();

                        // ativa o botão novamente
                        btn.disabled = false;   
                        
                        // mostra o formulário de inclusão
                        this.showPanelCreate();        

                    });
            
                }, 
                (e) =>                      // function(e)
                {
                    // *** método REJECT
                    console.error(e);
                }

            );            

        });

    }

    onSubmit()
    {

        // let _this = this; (não precisa mais porque passou a utilizar a arrowfunction)

        // utiliza arrowfunction. desta forma o this continua sendo o objeto corrente
        this.formEl.addEventListener("submit", (event) =>
        {
        
            // cancela o comportamento padrão deste evento
            event.preventDefault();

            // busca o botão de gravar, que é o único botão com tipo submit do formulário
            let btn = this.formEl.querySelector("[type=submit]");
            
            // desativa o botão durante o processamento
            btn.disabled = true;
        
            // busca os valores do formulário
            let values = this.getValues(this.formEl);

            // se retornar false, os dados não são válidos
            if (!values)
            {
                btn.disabled = false;
                return false;
            } 

            // faz a chamada para o método getPhoto
            // este método retorna uma Promise
            // que tem dois métodos como parâmetro
            // um a ser executado o método tenha sucesso e outro
            // caso ocorra alguma falha
            this.getPhoto(this.formEl).then(

                (content) =>                // function(content)
                {
                    // *** método RESOLVE
                    // após a chamada da função, o callback será chamado
                    // armazena o caminho da foto e chama a função
                    // para incluir o usuário na lista
                    values.photo = content;

                    // inclui o registro na Storage para que não se perca
                    values.save().then(user=>
                    {
                        
                        // executa a função para gravar o usuário
                        this.addLine(user);         
                        
                        // após a inclusão, limpa todos os campos do formulário
                        this.formEl.reset();

                        // ativa o botão novamente
                        btn.disabled = false;   

                    });                

                }, 
                (e) =>                      // function(e)
                {
                    // *** método REJECT
                    console.error(e);
                }

            );
            
        });


    }

    getPhoto(formEl)
    {

        // ao invés de chamar uma função 'callback'
        // passou-se a utilizar Promise
        // que executa o processamento e executa o método resolve
        // caso tenha sucesso, ou o reject, caso aconteça alguma falha
        // no processamento
        return new Promise((resolve, reject)=>
        {

            let fileReader = new FileReader();

            let elements = [...formEl.elements].filter(item =>
            {
                if (item.name === 'photo')
                {
                    return item;
                }
                
            });
    
            let file = elements[0].files[0];
    
            fileReader.onload = () =>
            {
                resolve(fileReader.result);
            }

            fileReader.onerror = (e) =>
            {
                reject(e);
            }
                
            // verifica se o arquivo foi retornado
            if (file)   
            {

                // selecionou a imagem, retorna o caminho
                fileReader.readAsDataURL(file);

            }
            else
            {

                // se não informar a foto, inclui normalmente
                // sem incluir foto, então mostra uma imagem padrão
                resolve('dist/img/boxed-bg.jpg');

            }
    
    
        });

    }

    getValues(formEl)
    {

        // let: a variável só vai existir dentro deste escopo
        let user = {};

        // verifica se o formulário está válido
        let isValid = true;

        // para pegar este 'elements' usar no console
        // dir(document.getElementById("form-user-create"))

        // 'elements' é um objeto (coleção) e não um array de objetos
        // será necessário utilizaro  'Spread' para converter
        // a coleção em array, para executar o forEach

        [...formEl.elements].forEach(function(field,index)
        {

            // verifica se os campos obrigatórios foram informados
            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value)
            {
                // acessa o objeto pai, e inclui uma classe que identifica 'erro' no campo
                // para visualizar a estrutura dos campos
                // console.dir(field.parentElement)
                // os campos ficarão 'vermelho'
                field.parentElement.classList.add('has-error');
                // indica que o formulário não está válido
                isValid = false;
            }

            if (field.name == "gender")
            {
                if (field.checked)
                {
                    user[field.name] = field.value;            
                }
            }
            else if (field.name == "admin")
            {
               user[field.name] = field.checked;            
            }            
            else
            {
                user[field.name] = field.value;
            }

        });    

        if (isValid)
        {

            return new User(user.name, 
                            user.gender, 
                            user.birth, 
                            user.country, 
                            user.email, 
                            user.password, 
                            user.photo, 
                            user.admin);
        }
        else
        {
            // o formulário não pode ser enviado
            return false;
        }

    }



    selectAll()
    {

        // busca a lista de usuários já armazenada
        // let users = User.getUsersStorage();

        User.getUsersStorage().then(data =>
        {
            data.users.forEach(dataUser =>
            {
                let user = new User();
                user.loadFromJSON(dataUser);
                this.addLine(user);
            });            
        });

        // para ver os dados gravados no localStorage
        // no console digitar: JSON.parse(localStore.users);
  
    }

    addLine(dataUser)
    {

        // gera uma nova linha 'tr' com os dados do usuário
        let tr = this.getTr(dataUser);

        // inclui a nova 'tr' na tabela existente
        this.tableEl.appendChild(tr);

        // atualiza o número de usuários 
        this.updateCount();

    }    

    getTr(dataUser, tr = null)
    {

        if (tr === null)
        {
           tr = document.createElement("tr");
        }

        // armazena em cada linha os dados do usuário
        // para que possa ser recuperado quando for necessário
        // serializa o objeto em uma string json
        tr.dataset.user = JSON.stringify(dataUser);        

        // define o html da tr
        tr.innerHTML = 

            `<td>
            <img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm">
            </td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>`;

        this.addEventsTr(tr);

        return tr;

    }

    showPanelCreate()
    {
        // exibe a div com o form para inclusão
        document.querySelector("#box-user-create").style.display = "block";
        // oculta a div com o forma para edição
        document.querySelector("#box-user-update").style.display = "none";   
    }

    showPanelUpdate()
    {
        // oculta a div com o forma para inclusão
        document.querySelector("#box-user-create").style.display = "none";        
        // exibe a div com o form para editar
        document.querySelector("#box-user-update").style.display = "block";        
    }


    updateCount()
    {

        let numberUsers = 0;
        let numberAdmin = 0;

        // console.dir(this.tableEl);

        // converte a coleção em array com o 'spread' para percorrer os itens com 'forEach'
        [...this.tableEl.children].forEach(tr=>
        {

            // incrementa o número de usuários
            numberUsers++;

            // retorna a string json em objeto
            // que foi armazenada em cada linha da tabela
            let user = JSON.parse(tr.dataset.user);

            // se for administrador, incrementa o número de administradores
            if (user._admin) numberAdmin++;

        });

        // atualiza a tela
        document.querySelector("#number-users"      ).innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;

    }

    addEventsTr(tr)
    {

        // evento de clique do botão 'excluir' que fica em cada
        // registro da tabela

        // localiza o botão com a classe 'btn-delete' e define o evento de clique
        tr.querySelector(".btn-delete").addEventListener("click", e=>
        {

            if (confirm("Deseja realmente excluir ?"))
            {

                let user = new User();
                user.loadFromJSON(JSON.parse(tr.dataset.user));
                user.remove().then(data =>
                {
                    tr.remove();
                    this.updateCount();                    
                });

            }

        });   

        // evento de clique do botão 'editar' que fica em cada
        // registro da tabela

        // localiza o botão com a classe 'btn-edit' e define o evento de clique
        tr.querySelector(".btn-edit").addEventListener("click", e=>
        {

            // console.log(tr);
            let json = JSON.parse(tr.dataset.user);

            // armazena na propriedade data do formulário o índice da linha alterada            
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            // percorre os registros do json
            for (let name in json)
            {

                // pesquisa no form, o componente que tem o mesmo nome do campo do json
                // o replace troca o _ por vazio, porque ao gravar o objeto em string, os campos privados ficam com _
                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");

                // verifica se o campo existe
                if (field)
                {

                    // verifica o tipo de cada campo
                    switch (field.type)
                    {

                        case 'file':
                            continue;
                            break;
                        
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");             
                            field.checked = true;
                            break;

                        case 'checkbox':
                            field.checked = json[name];
                            break;

                        default:
                            // preenche o campo do formulário com o valor do json
                            field.value = json[name]; 

                    }



                }
                
            }

            // localiza no form de alteração, 
            // a tag que tenha a classe 'photo' class="photo"
            this.formUpdateEl.querySelector(".photo").src = json._photo;

            // exibe a div com o form para editar
            this.showPanelUpdate();

        });


    }
    
}