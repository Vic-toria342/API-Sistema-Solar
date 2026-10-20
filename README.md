# 🌌 Solar System Consult

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/e68175dc-971f-4e87-9e16-e4f9633d6ada" />
<img width="1898" height="1077" alt="image" src="https://github.com/user-attachments/assets/b07733d9-df55-4fa1-84d3-22d52867323c" />


## 📖 Sobre o projeto

O **Solar System Consult** é um site desenvolvido para consultar informações sobre planetas e outros corpos celestes por meio de uma API pública.

O usuário pode pesquisar o nome de um corpo celeste e visualizar informações como massa, raio, temperatura, distância, período orbital e outras características disponibilizadas pela API.

O projeto tem como objetivo praticar o desenvolvimento web, a realização de requisições HTTP, o processamento de dados em formato JSON e a apresentação dinâmica de informações.

## 🚀 Funcionalidades

- 🔎 Pesquisa de corpos celestes pelo nome.
- 🌎 Suporte à pesquisa por nomes em português e inglês para os planetas mapeados.
- 🪐 Exibição de informações astronômicas retornadas pela API.
- 🖼️ Apresentação de imagens locais dos corpos celestes.
- 📱 Interface adaptável a diferentes tamanhos de tela.
- ⚠️ Exibição de mensagens quando não há resultados ou ocorre um erro na consulta.

## 🛠️ Tecnologias utilizadas

- **HTML5:** estrutura da página.
- **CSS3:** estilização, cores e organização dos elementos.
- **JavaScript:** interação com o usuário e manipulação dos dados no navegador.
- **PHP:** realização da consulta à API e processamento da resposta, na versão adaptada para PHP.
- **API Ninjas:** fornecimento dos dados astronômicos em formato JSON.

## 🌐 API utilizada

O projeto utiliza a API Ninjas, por meio do endpoint de planetas:

`https://api.api-ninjas.com/v1/planets`

A consulta é realizada utilizando o nome do corpo celeste e uma chave de autenticação fornecida pela API.

A resposta é recebida em JSON e os dados disponíveis são utilizados para preencher a ficha técnica apresentada no site.

## 📂 Estrutura do projeto

```text
Solar-System-Consult/
├── img/
│   ├── img-mercurio.jpg
│   ├── img-venus.jpg
│   ├── img-terra.jpg
│   ├── img-marte.jpg
│   ├── img-jupiter.jpg
│   ├── img-saturno.jpg
│   ├── img-urano.jpg
│   ├── img-netuno.jpg
│   ├── img-plutao.jpg
│   ├── img-lua.jpg
│   └── img-sol.jpg
├── index.php
├── consulta.php
├── interface.css
└── README.md
```

*Observação: a estrutura acima representa a versão adaptada para PHP. Os nomes das imagens devem corresponder aos arquivos existentes na pasta `img`.*

## ⚙️ Como executar o projeto

1. Instale o [XAMPP](https://www.apachefriends.org/).
2. Copie a pasta do projeto para o diretório `htdocs` do XAMPP.
3. Configure uma chave válida da API Ninjas no arquivo PHP responsável pela consulta.
4. Verifique se o Apache está ativo e se a extensão cURL do PHP está habilitada.
5. Abra o navegador e acesse:

```text
http://localhost/Solar-System-Consult/index.php
```

6. Digite o nome de um planeta no campo de pesquisa e clique em **Search**.
7. Confira as informações apresentadas na página.

*O endereço local deve ser ajustado caso o nome da pasta do projeto seja diferente.*

## 🔐 Segurança

A chave de autenticação da API deve ser mantida no servidor, preferencialmente em uma variável de ambiente ou arquivo de configuração fora do repositório público.

Não publique chaves de API no GitHub. Caso uma chave seja exposta, gere outra e substitua a anterior.

## 👩‍💻 Autoria

Projeto acadêmico desenvolvido para praticar integração com APIs públicas e desenvolvimento de aplicações web.

## 📄 Licença

Projeto desenvolvido para fins educacionais.
