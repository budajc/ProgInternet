var ObjetoPessoa = {nome: "", nota: "", cpf: "", email: ""};

var index = 0;

let db = openDatabase("banco","2.o","banco de dados",4048);

db.transaction(function(criar){
    criar.executeSql("CREATE TABLE IF NOT EXISTS pessoa(codigo_pes INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, nota TEXT, cpf TEXT, email TEXT)");
    criar.executeSql("CREATE TABLE IF NOT EXISTS usuario(codigo_usu INTEGER PRIMARY KEY AUTOINCREMENT, login TEXT, senha Text)");
});

db.transaction(function(insert){
    insert.executeSql("insert into pesoa(nome, nota, cpf, email) values('João','10','123456789','");
});

db.transaction(function(minimo){
    minimo.executeSql("select coalesce(min(codigo_pes),0) as min from pessoa",[],function(minimo,resultado){
        index = resultado.rows.item(0).min;
    });
});


function voltar(){
    window.location.href = "TelaSelecao.html";
}

function atualiza(){
    var nome = document.getElementById("nomelista").value;
    var nota = document.getElementById("notalista").value;
    var cpf = document.getElementById("cpflista").value;
    var email = document.getElementById("emaillista").value;

    db.transaction(function(atualiza){
        atualiza.executeSql("UPDATE pessoa SET nome = ?, nota = ?, cpf = ?, email = ? WHERE cpf = ?",[nome, nota, cpf, email, cpf]);
    });
}

function entrar() {
    
    let login = document.getElementById("login").value;
    let senha = document.getElementById("senha").value;
    
    db.transaction(function(buscar){
        buscar.executeSql("select * from usuario where login = ? and senha = ?",[login, senha],function(buscar,resultado){
            if(resultado.rows.length == 0){
                alert("Login ou senha incorretos");
            }else{
                limpalogin();
                window.location.href = "TelaSelecao.html";
            }
        });
    });
}

function excluir(){
    localStorage.removeItem(index);
    alert("Excluido com sucesso");
}

function cadastrar() {
    let nome = document.getElementById("nome").value;
    let nota = document.getElementById("nota").value;
    let cpf = document.getElementById("cpf").value;
    let email = document.getElementById("email").value;

    if(nome == "" || nota == "" || cpf == "" || email == ""){
        alert("Preencha todos os campos");
    }else{
        
        db.transaction(function(criar){
            criar.executeSql("select * from pessoa where cpf = ?",[cpf],function(criar,resultado){
                if(resultado.rows.length == 0){
                    criar.executeSql("INSERT INTO pessoa(nome, nota, cpf, email) VALUES(?,?,?,?)",[nome, nota, cpf, email]);
                }else{
                    alert("CPF já cadastrado");
                }
            });
        });

        alert("Cadastro realizado com sucesso");
        limpaCadastro();
    }    
}

function cadastrarLogin() {
    let login = document.getElementById("login").value;
    let senha = document.getElementById("senha").value;

    if(login == "" || senha == ""){
        alert("Preencha todos os campos");
    }else{
        
        db.transaction(function(criar){
            criar.executeSql("select * from usuario ",[],function(criar,resultado){
                if(resultado.rows.length == 0){
                    criar.executeSql("INSERT INTO usuario(login, senha) VALUES(?,?)",[login, senha]);
                }else{
                    alert("Usuario ja cadastrado");
                }
            });
        });
        alert("Cadastro realizado com sucesso");
        limpaCadastro();
    }
}

function limpaCadastro(){
    document.getElementById("nome").value = "";
    document.getElementById("nota").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("email").value = "";
}

function limpalogin(){
    document.getElementById("login").value = "";
    document.getElementById("senha").value = "";
} 

function modoEscuro(){
   
    document.body.style.backgroundColor = "gray";
    document.body.style.color = "white";
}

function modoClaro(){
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
}


document.getElementById("listaNota").onload = function(){
    
    let nome = document.getElementById("nomelista");
    let nota = document.getElementById("notalista");
    let cpf = document.getElementById("cpflista");
    let email = document.getElementById("emaillista");

    var objeto = JSON.parse(localStorage.getItem(index));

    nome.value = objeto.nome;
    nota.value = objeto.nota;
    cpf.value = objeto.cpf;
    email.value = objeto.email;
};

function proximo(){
    let nome = document.getElementById("nomelista");
    let nota = document.getElementById("notalista");
    let cpf = document.getElementById("cpflista");
    let email = document.getElementById("emaillista");

    let bPodebuscar = false;
    index++;
    db.transaction(function(limite){
        limite.executeSql("select max(codigo_pes) as maximo,min(codigo_pes) as minimo from pessoa",function(buscar,resultado){
            if(resultado.rows.length > 0){
                if(resultado.rows.item(0).maximo >= index && resultado.rows.item(0).minimo <= index){
                    bPodebuscar = true;
                }
            }
        });
    });
   
    if(bPodebuscar){
        db.transaction(function(buscar){
            buscar.executeSql("select * from pessoa where codigo_pes = ?",[index],function(buscar,resultado){
                if(resultado.rows.length == 0){
                    alert("Não existe registros");
                }else{
                    ObjetoPessoa.nome = resultado.rows.item(0).nome;
                    ObjetoPessoa.nota = resultado.rows.item(0).nota;
                    ObjetoPessoa.cpf = resultado.rows.item(0).cpf;
                    ObjetoPessoa.email = resultado.rows.item(0).email;
                }
            });
        });
    }
}

function anterior(){
    let nome = document.getElementById("nomelista");
    let nota = document.getElementById("notalista");
    let cpf = document.getElementById("cpflista");
    let email = document.getElementById("emaillista");
    
    

    if(index > 1){
        index--;
    }

    var objeto = JSON.parse(localStorage.getItem(index));
    
    nome.value = objeto.nome;
    nota.value = objeto.nota;
    cpf.value = objeto.cpf;
    email.value = objeto.email;
}
