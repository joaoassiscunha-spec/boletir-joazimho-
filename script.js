// =========================================================
// DADOS FICTÍCIOS DO 9º ANO (não mexa nesses valores)
// Isso é um ARRAY de OBJETOS.
// Cada OBJETO representa uma disciplina com suas notas e faltas.
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
// Converte qualquer formato de nota para a escala 0–10.
// - vazio, null ou undefined  -> null (nota ainda não lançada)
// - 0 a 10                    -> mantém igual
// - maior que 10 e até 100    -> divide por 10
// - aceita ponto ou vírgula
// - valores fora das regras   -> null (inválido, não entra na média)
// =========================================================
function normalizarNota(valor) {
  // Se estiver vazio, nulo ou indefinido, a nota não foi lançada
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se for texto, troca vírgula por ponto para poder converter em número
  if (typeof valor === "string") {
    valor = valor.replace(",", ".");
  }

  // Converte para número
  const numero = Number(valor);

  // Se não for um número válido, retorna null
  if (isNaN(numero)) {
    return null;
  }

  // Se está entre 0 e 10, mantém
  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  // Se é maior que 10 e até 100, divide por 10
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Qualquer outro valor é inválido
  return null;
}

// =========================================================
// FUNÇÃO: calcularMedia(notas)
// Recebe um array com as notas já normalizadas (ou null)
// e calcula a média usando SOMENTE as notas disponíveis.
// Nota ausente NUNCA vira zero.
// =========================================================
function calcularMedia(notas) {
  // Filtra só as notas válidas (diferentes de null)
  const notasValidas = notas.filter(function (nota) {
    return nota !== null;
  });

  // Se não houver nenhuma nota válida, não há média
  if (notasValidas.length === 0) {
    return null;
  }

  // Soma todas as notas válidas
  let soma = 0;
  notasValidas.forEach(function (nota) {
    soma += nota;
  });

  // Divide pela quantidade de notas válidas
  return soma / notasValidas.length;
}

// =========================================================
// FUNÇÃO: definirSituacao(media)
// Decide a situação da disciplina com base na média.
// - média >= 6,0  -> "Bom desempenho"
// - média < 6,0   -> "Atenção"
// - sem média     -> "Nota ainda não disponível"
// =========================================================
function definirSituacao(media) {
  if (media === null) {
    return "Nota ainda não disponível";
  }
  if (media >= 6.0) {
    return "Bom desempenho";
  }
  return "Atenção";
}

// =========================================================
// FUNÇÃO: somarFaltas(faltas)
// Soma os números inteiros de faltas dos trimestres.
// =========================================================
function somarFaltas(faltas) {
  let total = 0;
  faltas.forEach(function (f) {
    total += f;
  });
  return total;
}

// =========================================================
// FUNÇÃO: formatarNota(nota)
// Mostra a nota com uma casa decimal (ex.: 8.0 -> "8.0")
// ou "—" quando não houver nota.
// =========================================================
function formatarNota(nota) {
  if (nota === null) {
    return "—";
  }
  return nota.toFixed(1).replace(".", ",");
}

// =========================================================
// PROCESSAMENTO DOS DADOS
// Aqui transformamos os dados brutos em dados já calculados.
// =========================================================
const disciplinasProcessadas = dadosBrutos.map(function (item) {
  // Normaliza cada trimestre
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  // Calcula a média somente com as notas disponíveis
  const media = calcularMedia([n1, n2, n3]);

  // Soma as faltas
  const totalFaltas = somarFaltas(item.faltas);

  // Define a situação
  const situacao = definirSituacao(media);

  // Retorna um novo objeto já pronto para exibir
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

// =========================================================
// MONTAGEM DA TABELA NO DOM
// =========================================================
const corpoTabela = document.getElementById("corpoTabela");

disciplinasProcessadas.forEach(function (d) {
  // Cria uma linha da tabela
  const linha = document.createElement("tr");

  // Define a classe da situação para colorir
  let classeSituacao = "situacao-sem-nota";
  if (d.situacao === "Bom desempenho") {
    classeSituacao = "situacao-bom";
  } else if (d.situacao === "Atenção") {
    classeSituacao = "situacao-atencao";
  }

  // Monta o HTML interno da linha
  linha.innerHTML = `
    <td>${d.disciplina}</td>
    <td>${formatarNota(d.tri1)}</td>
    <td>${formatarNota(d.tri2)}</td>
    <td>${formatarNota(d.tri3)}</td>
    <td>${d.media === null ? "—" : formatarNota(d.media)}</td>
    <td>${d.faltas}</td>
    <td class="${classeSituacao}">${d.situacao}</td>
  `;

  // Adiciona a linha ao corpo da tabela
  corpoTabela.appendChild(linha);
});

// =========================================================
// CARDS DE RESUMO
// =========================================================

// Média geral: média das médias disponíveis
const mediasDisponiveis = disciplinasProcessadas
  .filter(function (d) { return d.media !== null; })
  .map(function (d) { return d.media; });

let mediaGeral = null;
if (mediasDisponiveis.length > 0) {
  let somaMedias = 0;
  mediasDisponiveis.forEach(function (m) { somaMedias += m; });
  mediaGeral = somaMedias / mediasDisponiveis.length;
}

// Total de faltas de todas as disciplinas
let totalFaltasGeral = 0;
disciplinasProcessadas.forEach(function (d) {
  totalFaltasGeral += d.faltas;
});

// Quantidade de disciplinas com bom desempenho
let qtdBomDesempenho = 0;
disciplinasProcessadas.forEach(function (d) {
  if (d.situacao === "Bom desempenho") qtdBomDesempenho++;
});

// Quantidade de disciplinas que precisam de atenção
let qtdAtencao = 0;
disciplinasProcessadas.forEach(function (d) {
  if (d.situacao === "Atenção") qtdAtencao++;
});

// Frequência DEMONSTRATIVA (fictícia, só para esta etapa)
// Em versões futuras, esse valor será calculado de outra forma.
const frequenciaDemonstrativa = 92; // <-- apenas demonstrativo

// =========================================================
// CRIAÇÃO DOS CARDS NO DOM
// =========================================================
const areaCards = document.getElementById("cardsResumo");

// Função auxiliar para criar um card
function criarCard(titulo, valor) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="titulo-card">${titulo}</div>
    <div class="valor-card">${valor}</div>
  `;
  areaCards.appendChild(card);
}

// Cria os 5 cards de resumo
criarCard("Média geral", mediaGeral === null ? "—" : formatarNota(mediaGeral));
criarCard("Total de faltas", totalFaltasGeral);
criarCard("Disciplinas com bom desempenho", qtdBomDesempenho);
criarCard("Disciplinas que precisam de atenção", qtdAtencao);
criarCard("Frequência demonstrativa", frequenciaDemonstrativa + "% — Frequência adequada");