// Find the elements that JavaScript will update on the page.
const formulario = document.getElementById("form-pesquisa");
const inputPesquisa = document.getElementById("corpo-celeste");
const botaoPesquisar = document.getElementById("botao-pesquisar");
const blocoResultado = document.getElementById("resultado");
const mensagem = document.getElementById("mensagem");
const imagemPlaneta = document.getElementById("imagem-planeta");
const imagemIndisponivel = document.getElementById("imagem-indisponivel");

// Each item points to an image file inside the img folder.
// Add the image files there if you want to show local pictures.
const imagensPlanetas = {
    mercury: "img/img-mercurio.jpg",
    mercurio: "img/img-mercurio.jpg",
    venus: "img/img-venus.jpg",
    earth: "img/img-terra.jpg",
    terra: "img/img-terra.jpg",
    mars: "img/img-marte.jpg",
    marte: "img/img-marte.jpg",
    jupiter: "img/img-jupiter.jpg",
    saturn: "img/img-saturno.jpg",
    saturno: "img/img-saturno.jpg",
    uranus: "img/img-urano.jpg",
    urano: "img/img-urano.jpg",
    neptune: "img/img-netuno.jpg",
    netuno: "img/img-netuno.jpg",
    pluto: "img/img-plutao.jpg",
    plutao: "img/img-plutao.jpg",
    moon: "img/img-lua.jpg",
    lua: "img/img-lua.jpg",
    sun: "img/img-sol.jpg",
    sol: "img/img-sol.jpg"
};

// These are the fields where the information from PHP will appear.
const campos = {
    nome: document.getElementById("nome-planeta"),
    categoria: document.getElementById("categoria"),
    massa: document.getElementById("massa"),
    raio: document.getElementById("raio"),
    gravidade: document.getElementById("gravidade"),
    temperatura: document.getElementById("temperatura"),
    distancia: document.getElementById("distancia"),
    translacao: document.getElementById("translacao"),
    rotacao: document.getElementById("rotacao"),
    satelites: document.getElementById("satelites")
};

// Display a number using Brazilian formatting.
function formatarNumero(valor, casas = 2) {
    if (valor === null || valor === undefined || valor === "") {
        return "Not available";
    }

    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return String(valor);
    }

    return numero.toLocaleString("en-US", {
        maximumFractionDigits: casas
    });
}

// Some API values store mass as a number multiplied by a power of ten.
function formatarMassa(massa) {
    if (!massa || massa.massValue == null || massa.massExponent == null) {
        return "Not available";
    }

    return `${formatarNumero(massa.massValue, 3)} × 10^${massa.massExponent} kg`;
}

// Convert the API's average temperature from Kelvin to Celsius when available.
function formatarTemperatura(kelvin) {
    if (kelvin === null || kelvin === undefined || kelvin === "") {
        return "Not available";
    }

    const celsius = Number(kelvin) - 273.15;
    return `${formatarNumero(celsius)} °C (${formatarNumero(kelvin)} K)`;
}

// Clear old information so the previous result does not remain during a new search.
function limparFicha() {
    Object.values(campos).forEach((campo) => {
        campo.textContent = "";
    });

    imagemPlaneta.hidden = true;
    imagemPlaneta.removeAttribute("src");
    imagemIndisponivel.hidden = false;
}

// Show the image if the corresponding file exists in the img folder.
function exibirImagem(nomeEmIngles, termoBusca) {
    const chaves = [nomeEmIngles, termoBusca].map((nome) =>
        String(nome || "")
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
    );
    const caminho = chaves.map((chave) => imagensPlanetas[chave]).find(Boolean);

    imagemPlaneta.hidden = true;
    imagemIndisponivel.hidden = false;
    imagemPlaneta.removeAttribute("src");

    if (!caminho) return;

    imagemPlaneta.onload = () => {
        imagemPlaneta.hidden = false;
        imagemIndisponivel.hidden = true;
    };

    imagemPlaneta.onerror = () => {
        imagemPlaneta.hidden = true;
        imagemIndisponivel.hidden = false;
    };

    imagemPlaneta.alt = `Image of ${nomeEmIngles || termoBusca}`;
    imagemPlaneta.src = caminho;
}

// Fill the result panel with the fields returned by the PHP file.
function exibirResultado(corpo, termoBusca) {
    campos.nome.textContent = corpo.englishName || corpo.name || "Not available";
    campos.categoria.textContent = corpo.bodyType || (corpo.isPlanet ? "Planet" : "Celestial body");
    campos.massa.textContent = formatarMassa(corpo.mass);
    campos.raio.textContent = corpo.meanRadius != null
        ? `${formatarNumero(corpo.meanRadius)} km`
        : "Not available";
    campos.gravidade.textContent = corpo.gravity != null
        ? `${formatarNumero(corpo.gravity)} m/s²`
        : "Not available";
    campos.temperatura.textContent = formatarTemperatura(corpo.avgTemp);
    campos.distancia.textContent = corpo.semimajorAxis != null
        ? `${formatarNumero(corpo.semimajorAxis, 0)} km`
        : "Not available";
    campos.translacao.textContent = corpo.sideralOrbit != null
        ? `${formatarNumero(corpo.sideralOrbit)} days`
        : "Not available";
    campos.rotacao.textContent = corpo.sideralRotation != null
        ? `${formatarNumero(corpo.sideralRotation)} hours`
        : "Not available";

    if (Array.isArray(corpo.moons)) {
        campos.satelites.textContent = `${corpo.moons.length} listed moon(s)`;
    } else if (Number.isInteger(corpo.moonCount)) {
        campos.satelites.textContent = `${corpo.moonCount} listed moon(s)`;
    } else {
        campos.satelites.textContent = "Not available in reference data";
    }

    exibirImagem(corpo.englishName || corpo.name, termoBusca);
}

// Ask PHP to query the public API. The API request itself happens on the server.
formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const termo = inputPesquisa.value.trim();

    if (!termo) {
        blocoResultado.hidden = true;
        return;
    }

    blocoResultado.hidden = false;
    limparFicha();
    campos.nome.textContent = termo;
    exibirImagem(termo, termo);
    mensagem.textContent = "Searching for information...";
    botaoPesquisar.disabled = true;

    try {
        const parametros = new URLSearchParams({ corpo: termo });
        const resposta = await fetch(`consultar.php?${parametros.toString()}`, {
            headers: { Accept: "application/json" }
        });
        const textoResposta = await resposta.text();
        let resultado;

        try {
            resultado = JSON.parse(textoResposta);
        } catch {
            if (textoResposta.trimStart().startsWith("<?php")) {
                throw new Error(
                    "PHP não está sendo executado. Inicie o Apache no XAMPP e abra http://localhost/API_Sistema_Solar/site/ (não use o Live Server)."
                );
            }

            throw new Error("O servidor não retornou uma resposta JSON válida.");
        }

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Could not complete the search.");
        }

        exibirResultado(resultado.body, termo);
        mensagem.textContent = resultado.source === "api"
            ? "Information loaded from Solar System OpenData."
            : "Showing bundled reference data. Configure an API key on the server for live data.";
    } catch (erro) {
        mensagem.textContent = erro.message || "Something went wrong. Please try again.";
    } finally {
        botaoPesquisar.disabled = false;
    }
});
