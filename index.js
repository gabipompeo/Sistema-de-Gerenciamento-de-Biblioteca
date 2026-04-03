import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';


const host ='0.0.0.0'; 
const porta = process.env.PORT || 3000; 

const app = express();
    var listaLivros=[];
    var listaLeitores=[];

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'segredo',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false, 
        httpOnly: true,
        maxAge: 1000 * 60 * 30}
}));

app.get("/", (req, res) => {
    res.redirect("/login")
});

app.get('/menu',veri,(req,res)=>{
    const ultimo = req.cookies?.ultimo || "Nunca acessou";
    
    res.write(`<html lang="pt-br">
        <head>
            <meta charset="UTF-8">

            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <title>Menu</title>

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>

            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        </head>
        <body>  `);
   res.write(`

<style>
    .bg-rosa {
        background-color: #ffb6c1 !important;
    }

    .bg-rosa-claro {
        background-color: #ffc0cb !important;
    }

    .navbar a, .navbar-brand {
        color: white !important;
        font-weight: bold;
    }

    .dropdown-menu {
        background-color: #ffe4e1;
    }

    .dropdown-item:hover {
        background-color: #ffb6c1;
        color: white;
    }
</style>

<div class="pos-f-t">
  <div class="collapse" id="menuCollapse">
    <div class="bg-rosa p-4 text-center">
      <h5 class="text-white h4">Sistema Biblioteca</h5>
      <span class="text-white">Menu rápido do sistema</span>
    </div>
  </div>

  <nav class="navbar navbar-expand-lg navbar-dark bg-rosa">
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuCollapse">
      <span class="navbar-toggler-icon"></span>
    </button>

    <a class="navbar-brand ms-3" href="/menu">Biblioteca</a>

    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav ms-3">

        <li class="nav-item">
          <a class="nav-link" href="/menu">Home</a>
        </li>

        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
            Cadastro
          </a>

          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="/livro">Livro</a></li>
            <li><a class="dropdown-item" href="/listaLivros"> Listar Livros</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="/leitor"> Leitor</a></li>
            <li><a class="dropdown-item" href="/listaLeitores">📄 Listar Leitores</a></li>
          </ul>
        </li>

        <li class="nav-item">
          <a class="nav-link" href="/logout">Sair</a>
        </li>

      </ul>
    </div>
  </nav>
</div>

`);
    
        res.write(`
    <div class="container mt-4">
        <div class="alert alert-info" role="alert">
            Último acesso: ${ultimo}
        </div>
    </div>
`)
    res.write(` 
        </body> 
        `)

    res.end();
})

app.get("/livro",veri,(requisicao,resposta)=>{
    resposta.write(`
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">

            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <title>Cadastro de Livros</title>

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>

            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        </head>

        <body>
            <div class="container mt-5">
                <form method="POST" action="/livro" class="row  gy-2 gx-3 align-items-center border p-3  ">
                <legend>
                    <h3>Cadastre os Livros</h3>
                </legend>

                <div class="row mb-3">
                    <label class="sr-only" for="titulo"
                    >Título do Livro</label>
                    <input type="text" class="form-control mb-2 mr-sm-2" id="titulo" name="titulo" >
                </div> 
                
                <div class="row mb-3">
                    <label class="sr-only" for="autor"
                    >Nome do Autor</label>
                    <input type="text" class="form-control mb-2 mr-sm-2" id="autor" name="autor" >
                </div>

                <div class="row mb-3">
                    <label class="sr-only" for="isbn"
                    >Código ISBN</label>
                    <input type="text" class="form-control mb-2 mr-sm-2" 
                    id="isbn" name="isbn">
                </div>

                <div class="row mb-3">
                    <button type="submit" class="btn btn-primary mb-2">Cadastrar Livro</button>
                </div>
                </form>
            </div>
        </body>
        </html>
        `);
    resposta.end()
})

app.post("/livro",veri,(requisicao,resposta)=>{

    const titulo = requisicao.body.titulo;
    const autor = requisicao.body.autor;
    const isbn = requisicao.body.isbn;

    if (!titulo || !autor || !isbn) {
        let html = `
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Livros</title>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        </head>

        <body>
            <div class="container mt-5">
                <form method="POST" action="/livro" class="row  gy-2 gx-3 align-items-center border p-3  ">
                <legend>
                    <h3>Cadastre os Livros</h3>
                </legend>

                <div class="row mb-3">
                    <label class="sr-only" for="titulo">Título do Livro</label>
                    <input type="text" class="form-control " id="titulo" name="titulo" value="${titulo|| ""}" > `;
                if (!titulo){
                    html +=`
                        <div class="alert alert-danger mt-2" role="alert">
                        Por favor informe o título do livro
                        </div>
                    `;
                }
                html += ` 
                </div> 
                

                <div class="row mb-3">
                    <label class="sr-only" for="autor">Nome do Autor</label>
                    <input type="text" class="form-control " id="autor" name="autor" value="${autor|| ""}">`;
                if (!autor){
                    html +=`
                        <div class="alert alert-danger mt-2" role="alert">
                        Por favor informe o nome do autor.
                        </div>
                    `;
                }
                html +=`
                </div>

                <div class="row mb-3">
                    <label class="sr-only" for="isbn"
                    >Código ISBN</label>
                    <input type="text" class="form-control" 
                    id="isbn" name="isbn" value="${isbn || ""}">`;
                
                if (!isbn){
                    html +=`
                        <div class="alert alert-danger mt-2" role="alert">
                        Por favor informe o código ISBN.
                        </div>
                    `;
                }
                html +=`
                </div>

                <div class="row mb-3">
                    <button type="submit" class="btn btn-primary mb-2">Cadastrar Livro</button>
                </div>
                </form>
            </div>
        </body>
        </html>`;

        resposta.write(html);
        resposta.end();
    }
    else {

    listaLivros.push({
        "titulo":titulo,
        "autor":autor,
        "isbn":isbn,
    })
    resposta.redirect("/listaLivros");
    }
});

app.get("/listaLivros",veri,(requisicao,resposta)=>{
         
        resposta.write(`<html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Livros</title>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        </head>

        <body>
            
            <div class="container mt-5">
                <table class="table table-stripe table-hover">
                    <thead>
                                    <th scope="col">Nº</th>
                                    <th scope="col">Título</th>
                                    <th scope="col">Autor</th>
                                    <th scope="col">ISBN</th>
                    </thead>
                    <tbody>
            `);

            for(let i = 0;i<listaLivros.length;i++)
            {
                const livro = listaLivros[i];
                resposta.write(`
                        <tr>
                            <td>${i+1}</td>
                            <td>${livro.titulo}</td>
                            <td>${livro.autor}</td>
                            <td>${livro.isbn}</td>
                        </tr>
                    `)
            }

            resposta.write(`
                        </tbody>
                    </table>
                </div>
                    <a href="/livro" class="btn btn-primary mt-3">Continuar cadastrando</a>
                </body>
                </html>
                `);
        resposta.end();
    })

app.get("/leitor",veri,(requisicao,resposta)=>{
    let opcoesLivros = ``;

    for(let i = 0; i < listaLivros.length; i++){
        opcoesLivros += `<option value="${listaLivros[i].titulo}">${listaLivros[i].titulo}</option>`;
    }

    resposta.write(`
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">

            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <title>Cadastro de Leitores</title>

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>

            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        </head>

        <body>
            <div class="container mt-5">
                <form method="POST" action="/leitor" class="row  gy-2 gx-3 align-items-center border p-3  ">
                <legend>
                    <h3>Cadastre os Leitores</h3>
                </legend>

                <div class="row mb-3">
                    <label class="sr-only" for="nome"
                    >Nome do Leitor</label>
                    <input type="text" class="form-control mb-2 mr-sm-2" id="nome" name="nome" >
                </div> 
                
                <div class="row mb-3">
                    <label class="sr-only" for="cpf"
                    >CPF ou Identificação</label>
                    <input type="text" class="form-control mb-2 mr-sm-2" id="cpf" name="cpf" >
                </div>

                <div class="row mb-3">
                    <label class="sr-only" for="telefone"
                    >Telefone para Contato</label>
                    <input type="text" class="form-control mb-2 mr-sm-2" 
                    id="telefone" name="telefone">
                </div>

                <div class="row mb-3">
                    <label class="sr-only" for="dataEmprestimo"
                    >Data de Empréstimo</label>
                    <input type="date" class="form-control mb-2 mr-sm-2" 
                    id="dataEmprestimo" name="dataEmprestimo">
                </div>

                <div class="row mb-3">
                    <label class="sr-only" for="dataDevolucao"
                    >Data de Devolução</label>
                    <input type="date" class="form-control mb-2 mr-sm-2" 
                    id="dataDevolucao" name="dataDevolucao">
                </div>

                <div class="row mb-3">
                    <label class="sr-only" for="livro"
                    >Nome do Livro</label>
                    <select class="form-control" id="livro" name="livro">
                        <option value="">Selecione um livro</option>
                        ${opcoesLivros}
                    </select>
                </div>

                <div class="row mb-3">
                    <button type="submit" class="btn btn-primary mb-2">Cadastrar Leitor</button>
                </div>
                </form>
            </div>
        </body>
        </html>
        `);
    resposta.end()
})

app.post("/leitor",veri,(requisicao,resposta)=>{

    const nome = requisicao.body.nome;
    const cpf = requisicao.body.cpf;
    const telefone = requisicao.body.telefone;
    const dataEmprestimo = requisicao.body.dataEmprestimo;
    const dataDevolucao = requisicao.body.dataDevolucao;
    const livro = requisicao.body.livro;

    let opcoesLivros = ``;

    for(let i = 0; i < listaLivros.length; i++){
        if(livro == listaLivros[i].titulo){
            opcoesLivros += `<option value="${listaLivros[i].titulo}" selected>${listaLivros[i].titulo}</option>`;
        }
        else{
            opcoesLivros += `<option value="${listaLivros[i].titulo}">${listaLivros[i].titulo}</option>`;
        }
    }

    if (!nome || !cpf || !telefone || !dataEmprestimo || !dataDevolucao || !livro) {
        let html = `
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Leitores</title>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        </head>

        <body>
            <div class="container mt-5">
                <form method="POST" action="/leitor" class="row  gy-2 gx-3 align-items-center border p-3  ">
                <legend>
                    <h3>Cadastre os Leitores</h3>
                </legend>

                <div class="row mb-3">
                    <label class="sr-only" for="nome">Nome do Leitor</label>
                    <input type="text" class="form-control " id="nome" name="nome" value="${nome|| ""}" > `;
                if (!nome){
                    html +=`
                        <div class="alert alert-danger mt-2" role="alert">
                        Por favor informe o nome do leitor
                        </div>
                    `;
                }
                html += ` 
                </div> 
                

                <div class="row mb-3">
                    <label class="sr-only" for="cpf">CPF ou Identificação</label>
                    <input type="text" class="form-control " id="cpf" name="cpf" value="${cpf|| ""}">`;
                if (!cpf){
                    html +=`
                        <div class="alert alert-danger mt-2" role="alert">
                        Por favor informe o CPF ou identificação.
                        </div>
                    `;
                }
                html +=`
                </div>

                <div class="row mb-3">
                    <label class="sr-only" for="telefone">Telefone para Contato</label>
                    <input type="text" class="form-control " id="telefone" name="telefone" value="${telefone|| ""}">`;
                if (!telefone){
                    html +=`
                        <div class="alert alert-danger mt-2" role="alert">
                        Por favor informe o telefone.
                        </div>
                    `;
                }
                html +=`
                </div>

                <div class="row mb-3">
                    <label class="sr-only" for="dataEmprestimo">Data de Empréstimo</label>
                    <input type="date" class="form-control " id="dataEmprestimo" name="dataEmprestimo" value="${dataEmprestimo|| ""}">`;
                if (!dataEmprestimo){
                    html +=`
                        <div class="alert alert-danger mt-2" role="alert">
                        Por favor informe a data de empréstimo.
                        </div>
                    `;
                }
                html +=`
                </div>

                <div class="row mb-3">
                    <label class="sr-only" for="dataDevolucao">Data de Devolução</label>
                    <input type="date" class="form-control " id="dataDevolucao" name="dataDevolucao" value="${dataDevolucao|| ""}">`;
                if (!dataDevolucao){
                    html +=`
                        <div class="alert alert-danger mt-2" role="alert">
                        Por favor informe a data de devolução.
                        </div>
                    `;
                }
                html +=`
                </div>

                <div class="row mb-3">
                    <label class="sr-only" for="livro">Nome do Livro</label>
                    <select class="form-control" id="livro" name="livro">
                        <option value="">Selecione um livro</option>
                        ${opcoesLivros}
                    </select>`;
                if (!livro){
                    html +=`
                        <div class="alert alert-danger mt-2" role="alert">
                        Por favor selecione o livro.
                        </div>
                    `;
                }
                html +=`
                </div>

                <div class="row mb-3">
                    <button type="submit" class="btn btn-primary mb-2">Cadastrar Leitor</button>
                </div>
                </form>
            </div>
        </body>
        </html>`;

        resposta.write(html);
        resposta.end();
    }
    else {

    listaLeitores.push({
        "nome":nome,
        "cpf":cpf,
        "telefone":telefone,
        "dataEmprestimo":dataEmprestimo,
        "dataDevolucao":dataDevolucao,
        "livro":livro,
    })
    resposta.redirect("/listaLeitores");
    }
});

app.get("/listaLeitores",veri,(requisicao,resposta)=>{
         
        resposta.write(`<html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Leitores</title>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        </head>

        <body>
            
            <div class="container mt-5">
                <table class="table table-stripe table-hover">
                    <thead>
                                    <th scope="col">Nº</th>
                                    <th scope="col">Nome</th>
                                    <th scope="col">CPF</th>
                                    <th scope="col">Telefone</th>
                                    <th scope="col">Data de Empréstimo</th>
                                    <th scope="col">Data de Devolução</th>
                                    <th scope="col">Livro</th>
                    </thead>
                    <tbody>
            `);

            for(let i = 0;i<listaLeitores.length;i++)
            {
                const leitor = listaLeitores[i];
                resposta.write(`
                        <tr>
                            <td>${i+1}</td>
                            <td>${leitor.nome}</td>
                            <td>${leitor.cpf}</td>
                            <td>${leitor.telefone}</td>
                            <td>${leitor.dataEmprestimo}</td>
                            <td>${leitor.dataDevolucao}</td>
                            <td>${leitor.livro}</td>
                        </tr>
                    `)
            }

            resposta.write(`
                        </tbody>
                    </table>
                </div>
                    <a href="/leitor" class="btn btn-primary mt-3">Continuar cadastrando</a>
                </body>
                </html>
                `);
        resposta.end();
    })

app.get("/login", (requisicao, resposta) => {

    resposta.write(`
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

        <style>
            body {
                margin: 0;
                padding: 0;
                height: 100vh;
            }

            .gradient-custom {
                background: linear-gradient(to right, #ff9a9e, #fecfef);
            }

            .card {
                border-radius: 1rem;
            }
        </style>
    </head>

    <body class="gradient-custom">

    <section class="vh-100">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">

                <div class="col-12 col-md-8 col-lg-6 col-xl-5">

                    <div class="card bg-dark text-white">
                        <div class="card-body p-5 text-center">

                            <form action="/login" method="POST">

                                <div class="mb-md-5 mt-md-4 pb-5">

                                    <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
                                    <p class="text-white-50 mb-5">Entre com seu usuário e senha</p>

                                    <div class="mb-4">
                                        <input type="text" name="usuario" class="form-control form-control-lg" placeholder="Usuário">
                                    </div>

                                    <div class="mb-4">
                                        <input type="password" name="senha" class="form-control form-control-lg" placeholder="Senha">
                                    </div>

                                    <button class="btn btn-outline-light btn-lg px-5" type="submit">
                                        Entrar
                                    </button>

                                </div>

                            </form>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    </section>

    </body>
    </html>
    `);

    resposta.end();
});

app.post("/login", (requisicao, resposta) => 
{
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;

       if (usuario == "admin@teste.com.br" &&  senha == "123"){
        requisicao.session.logado = true;

        const dataultimo = new Date();
        resposta.cookie("ultimo", dataultimo.toLocaleString(),{maxAge: 1000* 60* 60* 24* 30, httpOnly: true});

        resposta.redirect("/menu")}

        else 
        {
        resposta.write(`
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login</title>

            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

            <style>
                body {
                    margin: 0;
                    padding: 0;
                    height: 100vh;
                }

                .gradient-custom {
                    background: linear-gradient(to right, #ff9a9e, #fecfef);
                }

                .card {
                    border-radius: 1rem;
                }
            </style>
        </head>

        <body class="gradient-custom">

        <section class="vh-100">
            <div class="container py-5 h-100">
                <div class="row d-flex justify-content-center align-items-center h-100">

                    <div class="col-12 col-md-8 col-lg-6 col-xl-5">

                    <div class="card bg-dark text-white">
                        <div class="card-body p-5 text-center">

                            <form action="/login" method="POST">

                             <div class="mb-md-5 mt-md-4 pb-5">

                             <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
                            <p class="text-white-50 mb-5">Entre com seu usuário e senha</p>

                             <div class="mb-4">
                                 <input type="text" name="usuario" value="${usuario || ""}" class="form-control form-control-lg">
                             </div>

                             <div class="mb-4">
                                    <input type="password" name="senha" class="form-control form-control-lg" placeholder="Senha">
                             </div>

                                    <div class="alert alert-danger" role="alert">
                                            Usuário ou senha inválidos!
                                    </div>

                                    <button class="btn btn-outline-light btn-lg px-5" type="submit">
                                            Entrar
                                    </button>

                                    </div>

                                </form>

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>

        </body>
        </html>
        `);
    resposta.end();
        }
 });

 app.get("/logout",( requisicao, resposta) => {
    requisicao.session.logado = false;
    resposta.redirect("/login");
 })

function veri(requisicao, resposta, proximo){
    if (requisicao.session?.logado){
        proximo();
     }
    else{
        resposta.redirect("/login")
}
}
export default app;
//app.listen(porta,host,()=>{
    console.log(`Servidor rodando em http://${host}:${porta}`);
