// =========================================================
// CONFIGURAÇÃO FIXA DO ALUNO
// =========================================================
const CONFIG_ALUNO = {
  turma: "9C",
  numeroChamada: 16,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// Variavel de sessão para armazenar o PIN em memória (não é salva em storage)
let pinSessao = "";

// Dados das disciplinas em memória
let dadosDisciplinas = [];

// =========================================================
// DADOS FICTÍCIOS DO 9º ANO (dados de reserva/locais)
// =========================================================
const dadosBrutos = [
  { disciplina: "Língua Portuguesa", tri1: 78, tri2: "8,2", tri3: 8.6, faltas: [2, 2, 1] },
  { disciplina: "Matemática", tri1: 55, tri2: "5,4", tri3: null, faltas: [3, 2, 2] },
  { disciplina: "Ciências", tri1: 84, tri2: 7.9, tri3: "8,3", faltas: [1, 1, 1] },
  { disciplina: "História", tri1: "7,1", tri2: 82, tri3: null, faltas: [1, 2, 1] },
  { disciplina: "Geografia", tri1: 69, tri2: "7,5", tri3: 7.8, faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 88, tri2: 8.4, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Arte", tri1: "9,2", tri2: 87, tri3: 9.0, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 96, tri2: "9,3", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 91, tri2: 8.9, tri3: "9,4", faltas: [1, 1, 0] },
  { disciplina: "Educação Financeira", tri1: 76, tri2: "7,2", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Rec. Aprend. Matemática", tri1: 58, tri2: "5,9", tri3: 6.2, faltas: [2, 2, 1] },
  { disciplina: "Leitura Rec. Aprend. Lingua Portuguesa", tri1: 72, tri2: "7,6", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 49, tri2: 5.5, tri3: "5,8", faltas: [2, 2, 2] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,0", tri2: 84, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: 64, tri2: "6,6", tri3: 7.0, faltas: [1, 1, 1] }
];

// =========================================================
// FUNÇÃO: normalizarNota(valor)
// =========================================================
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }
  if (typeof valor === "string") {
    valor = valor.replace(",", ".");
  }
  const numero = Number(valor);
  if (isNaN(numero)) {
    return null;
  }
  if (numero >= 0 && numero <= 10) {
    return numero;
  }
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }
  return null;
}

// =========================================================
// FUNÇÕES AUXILIARES DE CÁLCULO
// =========================================================
function calcularMedia(notas) {
  const notasValidas = notas.filter(function (nota) {
    return nota !== null;
  });
  if (notasValidas.length === 0) {
    return null;
  }
  let soma = 0;
  notasValidas.forEach(function (nota) {
    soma += nota;
  });
  return soma / notasValidas.length;
}

function definirSituacao(media) {
  if (media === null) {
    return "Nota ainda não disponível";
  }
  if (media >= 6.0) {
    return "Bom desempenho";
  }
  return "Atenção";
}

function somarFaltas(faltas) {
  if (!Array.isArray(faltas)) return 0;
  let total = 0;
  faltas.forEach(function (f) {
    const num = Number(f);
    if (!isNaN(num)) {
      total += num;
    }
  });
  return total;
}

function formatarNota(nota) {
  if (nota === null || nota === undefined) {
    return "—";
  }
  return Number(nota).toFixed(1).replace(".", ",");
}

// =========================================================
// ATUALIZAR A INTERFACE (TABELA E CARDS)
// =========================================================
function renderizarBoletim() {
  const corpoTabela = document.getElementById("corpoTabela");
  const areaCards = document.getElementById("cardsResumo");

  // Limpa conteúdos anteriores
  corpoTabela.innerHTML = "";
  areaCards.innerHTML = "";

  const processadas = dadosDisciplinas.map(function (item) {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const media = calcularMedia([n1, n2, n3]);

    let totalFaltas = 0;
    if (Array.isArray(item.faltas)) {
      totalFaltas = somarFaltas(item.faltas);
    } else if (typeof item.faltas === "number") {
      totalFaltas = item.faltas;
    }

    const situacao = definirSituacao(media);

    return {
      disciplina: item.disciplina,
      tri1: n1,
      tri2: n2,
      tri3: n3,
      media: media,
      faltas: totalFaltas,
      situacao: situacao
    };
  });

  // Renderiza Tabela com segurança DOM
  processadas.forEach(function (d) {
    const linha = document.createElement("tr");

    let classeSituacao = "situacao-sem-nota";
    if (d.situacao === "Bom desempenho") {
      classeSituacao = "situacao-bom";
    } else if (d.situacao === "Atenção") {
      classeSituacao = "situacao-atencao";
    }

    const tdNome = document.createElement("td");
    tdNome.textContent = d.disciplina;

    const tdTri1 = document.createElement("td");
    tdTri1.textContent = formatarNota(d.tri1);

    const tdTri2 = document.createElement("td");
    tdTri2.textContent = formatarNota(d.tri2);

    const tdTri3 = document.createElement("td");
    tdTri3.textContent = formatarNota(d.tri3);

    const tdMedia = document.createElement("td");
    tdMedia.textContent = d.media === null ? "—" : formatarNota(d.media);

    const tdFaltas = document.createElement("td");
    tdFaltas.textContent = d.faltas;

    const tdSituacao = document.createElement("td");
    tdSituacao.className = classeSituacao;
    tdSituacao.textContent = d.situacao;

    linha.appendChild(tdNome);
    linha.appendChild(tdTri1);
    linha.appendChild(tdTri2);
    linha.appendChild(tdTri3);
    linha.appendChild(tdMedia);
    linha.appendChild(tdFaltas);
    linha.appendChild(tdSituacao);

    corpoTabela.appendChild(linha);
  });

  // Cálculos para os Cards
  const mediasDisponiveis = processadas
    .filter(function (d) { return d.media !== null; })
    .map(function (d) { return d.media; });

  let mediaGeral = null;
  if (mediasDisponiveis.length > 0) {
    let somaMedias = 0;
    mediasDisponiveis.forEach(function (m) { somaMedias += m; });
    mediaGeral = somaMedias / mediasDisponiveis.length;
  }

  let totalFaltasGeral = 0;
  processadas.forEach(function (d) {
    totalFaltasGeral += d.faltas;
  });

  let qtdBomDesempenho = 0;
  let qtdAtencao = 0;
  processadas.forEach(function (d) {
    if (d.situacao === "Bom desempenho") qtdBomDesempenho++;
    if (d.situacao === "Atenção") qtdAtencao++;
  });

  const frequenciaDemonstrativa = 92;

  function criarCard(titulo, valor) {
    const card = document.createElement("div");
    card.className = "card";

    const divTitulo = document.createElement("div");
    divTitulo.className = "titulo-card";
    divTitulo.textContent = titulo;

    const divValor = document.createElement("div");
    divValor.className = "valor-card";
    divValor.textContent = valor;

    card.appendChild(divTitulo);
    card.appendChild(divValor);
    areaCards.appendChild(card);
  }

  criarCard("Média geral", mediaGeral === null ? "—" : formatarNota(mediaGeral));
  criarCard("Total de faltas", totalFaltasGeral);
  criarCard("Disciplinas com bom desempenho", qtdBomDesempenho);
  criarCard("Disciplinas que precisam de atenção", qtdAtencao);
  criarCard("Frequência demonstrativa", frequenciaDemonstrativa + "% — Frequência adequada");

  // >>> Única chamada acrescentada: atualiza os gráficos após a tela terminar <<<
  atualizarGraficos();
}

// =========================================================
// CONEXÃO COM A API - ABRIR BOLETIM
// =========================================================
const btnEntrar = document.getElementById("btnEntrar");
const inputPin = document.getElementById("inputPin");
const mensagemLogin = document.getElementById("mensagemLogin");

btnEntrar.addEventListener("click", function () {
  const pinDigitado = inputPin.value.trim();

  if (!pinDigitado) {
    mensagemLogin.className = "mensagem-status erro";
    mensagemLogin.textContent = "Por favor, digite seu PIN.";
    return;
  }

  mensagemLogin.className = "mensagem-status info";
  mensagemLogin.textContent = "Conectando...";

  fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      turma: CONFIG_ALUNO.turma,
      numero_chamada: CONFIG_ALUNO.numeroChamada,
      pin: pinDigitado
    })
  })
    .then(function (resposta) {
      if (resposta.status === 401) {
        throw new Error("Turma, chamada ou PIN inválidos.");
      }
      if (resposta.status === 429) {
        throw new Error("Muitas tentativas. Aguarde um minuto e tente novamente.");
      }
      if (!resposta.ok) {
        throw new Error("Não foi possível conectar ao servidor. Tente novamente.");
      }
      return resposta.json();
    })
    .then(function (dadosRecebidos) {
      // Guarda o PIN em memória e limpa o input
      pinSessao = pinDigitado;
      inputPin.value = "";

      // Esconde login e exibe o boletim
      document.getElementById("areaLogin").style.display = "none";
      document.getElementById("areaBoletim").style.display = "block";

      // Verifica dados da API
      if (dadosRecebidos && dadosRecebidos.dados && Array.isArray(dadosRecebidos.dados.disciplinas) && dadosRecebidos.dados.disciplinas.length > 0) {
        dadosDisciplinas = dadosRecebidos.dados.disciplinas;
      } else {
        // Usa os dados locais que já existem no script
        dadosDisciplinas = dadosBrutos;
      }

      renderizarBoletim();
    })
    .catch(function (erro) {
      mensagemLogin.className = "mensagem-status erro";
      mensagemLogin.textContent = erro.message || "Não foi possível conectar ao servidor. Tente novamente.";
    });
});

// =========================================================
// MODAL DE EDIÇÃO
// =========================================================
const btnEditar = document.getElementById("btnEditar");
const modalEdicao = document.getElementById("modalEdicao");
const btnCancelar = document.getElementById("btnCancelar");
const btnSalvar = document.getElementById("btnSalvar");
const corpoEdicao = document.getElementById("corpoEdicao");
const mensagemEdicao = document.getElementById("mensagemEdicao");

btnEditar.addEventListener("click", abrirEdicao);

function abrirEdicao() {
  corpoEdicao.innerHTML = "";
  mensagemEdicao.textContent = "";
  mensagemEdicao.className = "mensagem-status";

  dadosDisciplinas.forEach(function (d, idx) {
    const tr = document.createElement("tr");

    const tdNome = document.createElement("td");
    tdNome.textContent = d.disciplina;
    tr.appendChild(tdNome);

    function extrairNota(val) {
      if (val === null || val === undefined) return "";
      return String(val).replace(".", ",");
    }

    function extrairFalta(fArray, index) {
      if (Array.isArray(fArray) && fArray[index] !== undefined) {
        return fArray[index];
      }
      return 0;
    }

    const n1 = extrairNota(d.tri1);
    const n2 = extrairNota(d.tri2);
    const n3 = extrairNota(d.tri3);

    const f1 = Array.isArray(d.faltas) ? extrairFalta(d.faltas, 0) : 0;
    const f2 = Array.isArray(d.faltas) ? extrairFalta(d.faltas, 1) : 0;
    const f3 = Array.isArray(d.faltas) ? extrairFalta(d.faltas, 2) : 0;

    tr.innerHTML += `
      <td><input type="text" id="edit_n1_${idx}" value="${n1}"></td>
      <td><input type="text" id="edit_n2_${idx}" value="${n2}"></td>
      <td><input type="text" id="edit_n3_${idx}" value="${n3}"></td>
      <td><input type="text" id="edit_f1_${idx}" value="${f1}"></td>
      <td><input type="text" id="edit_f2_${idx}" value="${f2}"></td>
      <td><input type="text" id="edit_f3_${idx}" value="${f3}"></td>
    `;

    corpoEdicao.appendChild(tr);
  });

  modalEdicao.style.display = "flex";
}

btnCancelar.addEventListener("click", function () {
  modalEdicao.style.display = "none";
});

// =========================================================
// VALIDAÇÃO E SALVAMENTO NA API
// =========================================================
function validarNotaDigitada(texto) {
  const limpo = texto.trim();
  if (limpo === "") {
    return { valido: true, valor: null };
  }
  const comPonto = limpo.replace(",", ".");
  const num = Number(comPonto);

  if (isNaN(num) || num < 0 || num > 10) {
    return { valido: false };
  }
  return { valido: true, valor: num };
}

function validarFaltaDigitada(texto) {
  const limpo = texto.trim();
  if (limpo === "") {
    return { valido: false };
  }
  const num = Number(limpo);
  if (isNaN(num) || !Number.isInteger(num) || num < 0) {
    return { valido: false };
  }
  return { valido: true, valor: num };
}

btnSalvar.addEventListener("click", function () {
  let houverErro = false;
  const novasDisciplinas = [];

  // Limpa validações visuais anteriores
  const inputs = corpoEdicao.querySelectorAll("input");
  inputs.forEach(function (inp) { inp.classList.remove("invalido"); });

  dadosDisciplinas.forEach(function (d, idx) {
    const inputN1 = document.getElementById(`edit_n1_${idx}`);
    const inputN2 = document.getElementById(`edit_n2_${idx}`);
    const inputN3 = document.getElementById(`edit_n3_${idx}`);
    const inputF1 = document.getElementById(`edit_f1_${idx}`);
    const inputF2 = document.getElementById(`edit_f2_${idx}`);
    const inputF3 = document.getElementById(`edit_f3_${idx}`);

    const resN1 = validarNotaDigitada(inputN1.value);
    const resN2 = validarNotaDigitada(inputN2.value);
    const resN3 = validarNotaDigitada(inputN3.value);

    const resF1 = validarFaltaDigitada(inputF1.value);
    const resF2 = validarFaltaDigitada(inputF2.value);
    const resF3 = validarFaltaDigitada(inputF3.value);

    if (!resN1.valido) { inputN1.classList.add("invalido"); houverErro = true; }
    if (!resN2.valido) { inputN2.classList.add("invalido"); houverErro = true; }
    if (!resN3.valido) { inputN3.classList.add("invalido"); houverErro = true; }

    if (!resF1.valido) { inputF1.classList.add("invalido"); houverErro = true; }
    if (!resF2.valido) { inputF2.classList.add("invalido"); houverErro = true; }
    if (!resF3.valido) { inputF3.classList.add("invalido"); houverErro = true; }

    if (!houverErro) {
      novasDisciplinas.push({
        disciplina: d.disciplina,
        tri1: resN1.valor,
        tri2: resN2.valor,
        tri3: resN3.valor,
        faltas: [resF1.valor, resF2.valor, resF3.valor]
      });
    }
  });

  if (houverErro) {
    mensagemEdicao.className = "mensagem-status erro";
    mensagemEdicao.textContent = "Existem valores inválidos nos campos destacados. Verifique e tente novamente.";
    return;
  }

  mensagemEdicao.className = "mensagem-status info";
  mensagemEdicao.textContent = "Salvando...";

  fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      turma: CONFIG_ALUNO.turma,
      numero_chamada: CONFIG_ALUNO.numeroChamada,
      pin: pinSessao,
      dados: {
        disciplinas: novasDisciplinas
      }
    })
  })
    .then(function (resposta) {
      if (!resposta.ok) {
        throw new Error("Não foi possível salvar as alterações no servidor.");
      }
      return resposta.json();
    })
    .then(function () {
      dadosDisciplinas = novasDisciplinas;
      renderizarBoletim();
      modalEdicao.style.display = "none";
      alert("Dados salvos com sucesso.");
    })
    .catch(function (erro) {
      mensagemEdicao.className = "mensagem-status erro";
      mensagemEdicao.textContent = erro.message || "Falha ao salvar os dados. Tente novamente.";
    });
});

// =========================================================
// ============ CAMADA DE GRÁFICOS (somente leitura) =======
// =========================================================
// Esta seção apenas LÊ dadosDisciplinas. Não escreve em notas,
// faltas, disciplinas, nem altera o payload da API.
// =========================================================

let graficoMedias = null;
let graficoEvolucao = null;
let graficoFaltas = null;

// Referência interna de risco (NÃO exibir na interface)
const REFERENCIA_INTERNA_FALTAS = 350;

// Paleta compatível com o tema do projeto
const CORES_GRAFICOS = {
  primaria: "#4da6ff",
  primariaFraca: "rgba(77, 166, 255, 0.35)",
  verde: "#4dff88",
  verdeFraca: "rgba(77, 255, 136, 0.30)",
  laranja: "#ffb84d",
  alerta: "#ff6b6b",
  alertaFraca: "rgba(255, 107, 107, 0.30)",
  texto: "#e6f0ff",
  textoSecundario: "#9cc4ff",
  grade: "rgba(156, 196, 255, 0.15)"
};

// ---------------------------------------------------------
// GRÁFICO 1 — MÉDIA POR DISCIPLINA (barras horizontais)
// ---------------------------------------------------------
function atualizarGraficoMedias() {
  const canvas = document.getElementById("graficoMediasDisciplinas");
  if (!canvas) return;

  if (graficoMedias) {
    graficoMedias.destroy();
    graficoMedias = null;
  }

  // Cópia apenas para leitura (não muta o estado original)
  const lista = dadosDisciplinas.map(function (item) {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);
    return {
      disciplina: item.disciplina,
      media: calcularMedia([n1, n2, n3])
    };
  });

  const labels = lista.map(function (d) { return d.disciplina; });
  const valores = lista.map(function (d) { return d.media; });

  graficoMedias = new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Média",
        data: valores,
        backgroundColor: CORES_GRAFICOS.primariaFraca,
        borderColor: CORES_GRAFICOS.primaria,
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.8,
        categoryPercentage: 0.85
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#12264a",
          titleColor: CORES_GRAFICOS.texto,
          bodyColor: CORES_GRAFICOS.texto,
          borderColor: CORES_GRAFICOS.primaria,
          borderWidth: 1,
          callbacks: {
            label: function (ctx) {
              const v = ctx.parsed.x;
              if (v === null || v === undefined) {
                return "Sem nota";
              }
              return "Média: " + Number(v).toFixed(1).replace(".", ",");
            }
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 10,
          ticks: {
            color: CORES_GRAFICOS.textoSecundario,
            stepSize: 2
          },
          grid: { color: CORES_GRAFICOS.grade }
        },
        y: {
          ticks: {
            color: CORES_GRAFICOS.texto,
            font: { size: 11 }
          },
          grid: { color: CORES_GRAFICOS.grade }
        }
      }
    }
  });
}

// ---------------------------------------------------------
// GRÁFICO 2 — EVOLUÇÃO DA MÉDIA GERAL (linha)
// ---------------------------------------------------------
function atualizarGraficoEvolucao() {
  const canvas = document.getElementById("graficoEvolucaoTrimestres");
  if (!canvas) return;

  if (graficoEvolucao) {
    graficoEvolucao.destroy();
    graficoEvolucao = null;
  }

  // Coleta notas válidas de cada trimestre (não muta o estado)
  const tri1Validos = [];
  const tri2Validos = [];
  const tri3Validos = [];

  dadosDisciplinas.forEach(function (item) {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);
    if (n1 !== null) tri1Validos.push(n1);
    if (n2 !== null) tri2Validos.push(n2);
    if (n3 !== null) tri3Validos.push(n3);
  });

  function mediaDe(arr) {
    if (arr.length === 0) return null;
    let soma = 0;
    arr.forEach(function (v) { soma += v; });
    return soma / arr.length;
  }

  const medias = [
    mediaDe(tri1Validos),
    mediaDe(tri2Validos),
    mediaDe(tri3Validos)
  ];

  graficoEvolucao = new Chart(canvas.getContext("2d"), {
    type: "line",
    data: {
      labels: ["1º Tri", "2º Tri", "3º Tri"],
      datasets: [{
        label: "Média geral",
        data: medias,
        borderColor: CORES_GRAFICOS.verde,
        backgroundColor: CORES_GRAFICOS.verdeFraca,
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: CORES_GRAFICOS.verde,
        pointBorderColor: "#0b1a33",
        pointBorderWidth: 2,
        tension: 0.3,
        spanGaps: false,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#12264a",
          titleColor: CORES_GRAFICOS.texto,
          bodyColor: CORES_GRAFICOS.texto,
          borderColor: CORES_GRAFICOS.verde,
          borderWidth: 1,
          callbacks: {
            label: function (ctx) {
              const v = ctx.parsed.y;
              if (v === null || v === undefined) {
                return "Sem notas";
              }
              return "Média: " + Number(v).toFixed(1).replace(".", ",");
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 10,
          ticks: {
            color: CORES_GRAFICOS.textoSecundario,
            stepSize: 2
          },
          grid: { color: CORES_GRAFICOS.grade }
        },
        x: {
          ticks: { color: CORES_GRAFICOS.texto },
          grid: { color: CORES_GRAFICOS.grade }
        }
      }
    }
  });
}

// ---------------------------------------------------------
// GRÁFICO 3 — FALTAS POR TRIMESTRE (3 barras verticais)
// ---------------------------------------------------------
function atualizarGraficoFaltas() {
  const canvas = document.getElementById("graficoFaltasTrimestres");
  const estadoEl = document.getElementById("estadoFaltas");
  const cardEl = document.getElementById("cardGraficoFaltas");
  if (!canvas) return;

  if (graficoFaltas) {
    graficoFaltas.destroy();
    graficoFaltas = null;
  }

  // Soma faltas de cada trimestre sem tocar no estado original
  let f1 = 0;
  let f2 = 0;
  let f3 = 0;

  dadosDisciplinas.forEach(function (item) {
    const arr = Array.isArray(item.faltas) ? item.faltas : [];
    const a = Number(arr[0]);
    const b = Number(arr[1]);
    const c = Number(arr[2]);
    if (!isNaN(a)) f1 += a;
    if (!isNaN(b)) f2 += b;
    if (!isNaN(c)) f3 += c;
  });

  const totalInterno = f1 + f2 + f3;

  // Estado de perigo (badge apenas, referência NÃO exibida)
  if (estadoEl) {
    estadoEl.innerHTML = "";
    if (totalInterno >= REFERENCIA_INTERNA_FALTAS) {
      const badge = document.createElement("span");
      badge.className = "badge-perigo";
      badge.textContent = "Perigo";
      estadoEl.appendChild(badge);
      if (cardEl) cardEl.classList.add("em-perigo");
    } else {
      if (cardEl) cardEl.classList.remove("em-perigo");
    }
  }

  graficoFaltas = new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: ["1º Tri", "2º Tri", "3º Tri"],
      datasets: [{
        label: "Faltas",
        data: [f1, f2, f3],
        backgroundColor: [
          CORES_GRAFICOS.primariaFraca,
          CORES_GRAFICOS.laranja + "66",
          CORES_GRAFICOS.alertaFraca
        ],
        borderColor: [
          CORES_GRAFICOS.primaria,
          CORES_GRAFICOS.laranja,
          CORES_GRAFICOS.alerta
        ],
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#12264a",
          titleColor: CORES_GRAFICOS.texto,
          bodyColor: CORES_GRAFICOS.texto,
          borderColor: CORES_GRAFICOS.primaria,
          borderWidth: 1,
          callbacks: {
            label: function (ctx) {
              const v = ctx.parsed.y;
              return v + (v === 1 ? " falta" : " faltas");
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: CORES_GRAFICOS.textoSecundario,
            precision: 0
          },
          grid: { color: CORES_GRAFICOS.grade }
        },
        x: {
          ticks: { color: CORES_GRAFICOS.texto },
          grid: { display: false }
        }
      }
    }
  });
}

// ---------------------------------------------------------
// ATUALIZADOR CENTRAL DOS GRÁFICOS
// ---------------------------------------------------------
function atualizarGraficos() {
  if (typeof Chart === "undefined") {
    return; // Chart.js ainda não carregou — não quebra o fluxo
  }
  atualizarGraficoMedias();
  atualizarGraficoEvolucao();
  atualizarGraficoFaltas();
}