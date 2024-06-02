// Obtém os elementos do DOM
const botaoIniciar = document.getElementById("iniciar");
const cenario = document.getElementById("cenario");
const equipe = document.getElementById("equipe");
const vida = document.getElementById("vida");
const pontos = document.getElementById("pontos");
const botaoTutorial = document.getElementById("botaoTutorial");
const videoContainer = document.getElementById("video-tutorial");
const videoTutorial = document.getElementById("tutorial");
const fecharTutorial = document.getElementById("fecharTutorial");
const blurLayer = document.getElementById("blur-layer");

// Cria um novo objeto de áudio
const audioJogo = new Audio("../Jogo+Pontos/audios/audiodeFundo.mp3");

// Define as dimensões do cenário
const larguraCenario = cenario.offsetWidth;
const alturaCenario = cenario.offsetHeight;

// Define as variáveis de jogo
let ultimaAtualizacao = 0; // Variável para rastrear a última pontuação de atualização
let quantidadeProva = 1; // Variável para rastrear a quantidade de membros da prova

// Define as dimensões da equipe
const larguraEquipe = equipe.offsetWidth;
const alturaEquipe = equipe.offsetHeight;

// Define as velocidades
const velocidadeEquipe = 30;
const velocidadeTiro = 20;
const velocidadeProva = 5;

// Define o estado do tiro
let estaAtirando = false;

// Define as variáveis de jogo
let tiroAtual = 0;
let numeroDeInicios = 0;
let vidaAtual = 100;
let pontosAtual = 0;

// Define as variáveis de checagem
let checaMoveProva;
let checaProva;
let checaMoveTiros;
let checaMoveEquipe;
let checaColisao;
let checaTiros;

// Define a posição inicial da equipe
let posicaoHorizontal = larguraCenario / 2 - 50;
let posicaoVertical = alturaCenario - alturaEquipe;
let direcaoHorizontal = 0;
let direcaoVertical = 0;

// Função para lidar com a pressão de teclas e definir a direção da equipe
const teclaPressionada = (tecla) => {
  if (tecla.key === "ArrowRight") {
    direcaoHorizontal = 1;
    equipe.style.backgroundImage = "url(../Jogo+Pontos/assets/EquipeAndandoParaDireita.gif)";
  } else if (tecla.key === "ArrowLeft") {
    direcaoHorizontal = -1;
    equipe.style.backgroundImage = "url(../Jogo+Pontos/assets/EquipeAndandoParaEsquerda.gif)";
  } else if (tecla.key === "ArrowDown") {
    direcaoVertical = 1;
    equipe.style.backgroundImage = "url(../Jogo+Pontos/assets/EquipePulando.gif)";
  } else if (tecla.key === "ArrowUp") {
    direcaoVertical = -1;
    equipe.style.backgroundImage = "url(../Jogo+Pontos/assets/EquipePulando.gif)";
  }
}

// Função para lidar com a liberação de teclas e parar a equipe
const teclaSolta = (tecla) => {
  if (tecla.key === "ArrowRight" || tecla.key === "ArrowLeft") {
    direcaoHorizontal = 0;
    equipe.style.backgroundImage = "url(../Jogo+Pontos/assets/Equipe.gif)";
  } else if (tecla.key === "ArrowDown" || tecla.key === "ArrowUp") {
    direcaoVertical = 0;
    equipe.style.backgroundImage = "url(../Jogo+Pontos/assets/Equipe.gif)";
  }
}

// Função para mover a equipe
const moveEquipe = () => {
  posicaoHorizontal += direcaoHorizontal * velocidadeEquipe;
  posicaoVertical += direcaoVertical * velocidadeEquipe;
  if (posicaoHorizontal < 0) {
    posicaoHorizontal = 0;
  } else if (posicaoHorizontal + larguraEquipe > larguraCenario) {
    posicaoHorizontal = larguraCenario - larguraEquipe;
  }
  if (posicaoVertical < 0) {
    posicaoVertical = 0;
  } else if (posicaoVertical + alturaEquipe > alturaCenario) {
    posicaoVertical = alturaCenario - alturaEquipe;
  }
  equipe.style.left = posicaoHorizontal + "px";
  equipe.style.top = posicaoVertical + "px";
}

// Função para atirar
const atirar = () => {
  const delayTiro = Date.now();
  const atrasoTiro = delayTiro - tiroAtual;

  if (estaAtirando && atrasoTiro >= 100) {
    tiroAtual = Date.now();
    criaTiros(posicaoHorizontal + 45, posicaoVertical - 10);
  }
}

// Eventos para lidar com a pressão e liberação da tecla de espaço
document.addEventListener("keydown", (tecla) => {
  if (tecla.key === " ") {
    estaAtirando = true;
  }
});

document.addEventListener("keyup", (tecla) => {
  if (tecla.key === " ") {
    estaAtirando = false;
  }
})

// Função para criar tiros
const criaTiros = (posicaoLeftTiro, posicaoTopTiro) => {
  const tiro = document.createElement("div");
  tiro.className = "tiro";
  tiro.style.position = "absolute";
  tiro.style.width = "30px";
  tiro.style.height = "20px";
  tiro.style.backgroundImage = "url(../Jogo+Pontos/assets/+1.png)";
  tiro.style.left =  20 + posicaoLeftTiro + "px";
  tiro.style.top = posicaoTopTiro + "px";
  cenario.appendChild(tiro);
  audioTiros();
}

// Função para reproduzir o áudio dos tiros
const audioTiros = () => {
  const audioDoTiro = document.createElement("audio");
  audioDoTiro.className = "audiotiro";
  audioDoTiro.setAttribute("src", "../Jogo+Pontos/audios/tiro.mp3");
  audioDoTiro.play();
  cenario.appendChild(audioDoTiro);
  audioDoTiro.addEventListener("ended", () => {
    audioDoTiro.remove();
  });
}

// Função para mover os tiros
const moveTiros = () => {
  const tiros = document.querySelectorAll(".tiro");
  for (let i = 0; i < tiros.length; i++) {
    if (tiros[i]) {
      let posicaoTopTiro = tiros[i].offsetTop;
      posicaoTopTiro -= velocidadeTiro;
      tiros[i].style.top = posicaoTopTiro + "px";
      if (posicaoTopTiro < -10) {
        tiros[i].remove();
      }
    }
  }
}

// Função para criar prova
const criaProva = () => {
  for (let i = 0; i < quantidadeProva; i++) {
    const prova = document.createElement("div");
    prova.className = "prova";
    prova.style.position = "absolute";
    prova.setAttribute("data-vida", 5);
    prova.style.width = "70px";
    prova.style.height = "70px";
    prova.style.backgroundImage = "url(../Jogo+Pontos/assets/Prova.png)";
    prova.style.backgroundPosition = "center";
    prova.style.backgroundRepeat = "no-repeat";
    prova.style.backgroundSize = "contain";
    prova.style.left = Math.floor(Math.random() * (larguraCenario - larguraEquipe)) + "px";
    prova.style.top = "-100px";
    cenario.appendChild(prova);
  }
}

// Função para mover a prova
const moveProva = () => {
  const provas = document.querySelectorAll(".prova");
  for (let i = 0; i < provas.length; i++) {
    if (provas[i]) {
      let posicaoTopProva = provas[i].offsetTop;
      let posicaoLeftProva = provas[i].offsetLeft;
      posicaoTopProva += velocidadeProva + (Math.floor(pontosAtual / 100) * 2);
      provas[i].style.top = posicaoTopProva + "px";
      if (posicaoTopProva > alturaCenario) {
        vidaAtual -= 5;
        vida.textContent = `Vida: ${vidaAtual}`;
        explosaoProvaDestruida(posicaoLeftProva);
        if (vidaAtual <= 0) {
          gameOver();
        }
        provas[i].remove();
      } 
    }
  }
}

// Função para verificar a colisão entre os tiros e a prova
const colisao = () => {
  const todasProvas = document.querySelectorAll(".prova");
  const todosTiros = document.querySelectorAll(".tiro");
  todasProvas.forEach((prova) => {
    todosTiros.forEach((tiro) => {
      const colisaoProva = prova.getBoundingClientRect();
      const colisaoTiro = tiro.getBoundingClientRect();
      const posicaoProvaLeft = prova.offsetLeft;
      const posicaoProvaTop = prova.offsetTop;
      let vidaAtualProva = parseInt(prova.getAttribute("data-vida"));
      if (
        colisaoProva.left < colisaoTiro.right &&
        colisaoProva.right > colisaoTiro.left &&
        colisaoProva.top < colisaoTiro.bottom &&
        colisaoProva.bottom > colisaoTiro.top
      )  {
        vidaAtualProva--;
        tiro.remove();
        // Se a vida da prova chegar a 0, ele é removido e o jogador ganha pontos
        if (vidaAtualProva === 0) {
          pontosAtual += 10;
          pontos.textContent = `Pontos: ${pontosAtual}`;
          prova.remove();
          provaDestruida(posicaoProvaLeft, posicaoProvaTop);
        } else {
          prova.setAttribute("data-vida", vidaAtualProva);
        }
      }
    })
  })
}
// Função para lidar com a destruição da prova
const provaDestruida = (posicaoLeftProva, posicaoTopProva) => {
  const provaDestruida = document.createElement("div");
  provaDestruida.className = "provaDestruida";
  provaDestruida.style.position = "absolute";
  provaDestruida.style.width = "40px";
  provaDestruida.style.height = "40px";
  provaDestruida.style.backgroundImage = "url(../Jogo+Pontos/assets/+10.png)";
  provaDestruida.style.backgroundPosition = "center";
  provaDestruida.style.backgroundRepeat = "no-repeat";
  provaDestruida.style.backgroundSize = "contain";
  provaDestruida.style.left = posicaoLeftProva + "px";
  provaDestruida.style.top = posicaoTopProva + "px";
  cenario.appendChild(provaDestruida);
  audioExplosoes();
  setTimeout(() => { cenario.removeChild(provaDestruida); }, 1000);
}

// Função que cria uma explosão quando  uma prova é destruída
const explosaoProvaDestruida = (posicaoLeftProva) => {
  const explosaoProva = document.createElement("div");
  explosaoProva.className = "explosaoProva";
  explosaoProva.style.position = "absolute";
  explosaoProva.style.width = "40px";
  explosaoProva.style.height = "40px";
  explosaoProva.style.backgroundImage = "url(../Jogo+Pontos/assets/-5.png)";
  explosaoProva.style.backgroundPosition = "center";
  explosaoProva.style.backgroundRepeat = "no-repeat";
  explosaoProva.style.backgroundSize = "contain";
  explosaoProva.style.left = posicaoLeftProva + "px";
  explosaoProva.style.top = (alturaCenario - 100) + "px";
  cenario.appendChild(explosaoProva);
  audioExplosoes();
  setTimeout(() => { cenario.removeChild(explosaoProva); }, 1000);
}

// Função que toca o áudio das explosões
const audioExplosoes = () => {
  const audioExplosaoProva = document.createElement("audio");
  audioExplosaoProva.className = "audioexplosoes";
  audioExplosaoProva.setAttribute("src", "../Jogo+Pontos/audios/somProva.mp3");
  audioExplosaoProva.play();

  cenario.appendChild(audioExplosaoProva);
  audioExplosaoProva.addEventListener("ended", () => {
    audioExplosaoProva.remove();
  });
}

// Função que inicia o jogo e que tira de pausa
const iniciarJogo = () => {
  audioJogo.play();
  audioJogo.loop = true; 
  clearInterval(checaMoveEquipe);
  clearInterval(checaMoveTiros);
  clearInterval(checaMoveProva);
  clearInterval(checaColisao);
  clearInterval(checaProva);
  clearInterval(checaTiros);
  const menu = document.querySelector('.navbar .menu');
  menu.style.display = 'none';
  document.addEventListener("keydown", teclaPressionada);
  document.addEventListener("keyup", teclaSolta);
  checaMoveEquipe = setInterval(moveEquipe, 50);
  checaMoveTiros = setInterval(moveTiros, 50);
  checaMoveProva = setInterval(moveProva, 50);
  checaColisao = setInterval(colisao, 10);
  checaProva = setInterval(criaProva, 3000);
  checaTiros = setInterval(atirar, 10);
  checaAtualizacaoJogo = setInterval(atualizarJogo, 1000); // Checa a atualização do jogo a cada segundo 
  botaoIniciar.style.display = "none";
  cenario.style.animation = "animarCenario 10s infinite linear"; 
}

// Função que Reinicia o jogo
function reiniciarJogo() {
  // Limpa o estado do jogo
  numeroDeInicios = 0; 
  vidaAtual = 100; 
  pontosAtual = 0; 
  estaAtirando = false; 
  posicaoHorizontal = larguraCenario / 2 - 50; 
  posicaoVertical = alturaCenario - alturaEquipe; 
  direcaoHorizontal = 0;
  direcaoVertical = 0; 
  equipe.style.backgroundImage = "url(../Jogo+Pontos/assets/Equipe.gif)";
  // Remove todas as provas e tiros existentes
  const provas = document.querySelectorAll(".prova");
  provas.forEach(prova => prova.remove());
  const tiros = document.querySelectorAll(".tiro");
  tiros.forEach(tiro => tiro.remove());
  // Atualiza a exibição de vida e pontos
  vida.textContent = `Vida: ${vidaAtual}`;
  pontos.textContent = `Pontos: ${pontosAtual}`;

  iniciarJogo();
}
// Função que Pausa o jogo
function pausarJogo() {
  document.removeEventListener("keydown", teclaPressionada);
  document.removeEventListener("keyup", teclaSolta);
  clearInterval(checaMoveEquipe);
  clearInterval(checaMoveTiros);
  clearInterval(checaMoveProva);
  clearInterval(checaColisao);
  clearInterval(checaProva);
  clearInterval(checaTiros);
  botaoIniciar.style.display = "block";
  cenario.style.animation = "";
  audioJogo.pause();
}
// Função do menu hamburguer
function toggleMenu() {
  const menu = document.querySelector('.navbar .menu');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}
// Função para iniciar o vídeo tutorial
const iniciarTutorial = () => {
  blurLayer.style.display = "block";
  videoContainer.style.display = "block";
  videoTutorial.play();
  pausarJogo()
}

// Função para fechar o vídeo tutorial
const fecharVideoTutorial = () => {
  videoTutorial.pause();
  videoTutorial.currentTime = 0; // Reinicia o vídeo para o início
  videoContainer.style.display = "none";
  blurLayer.style.display = "none";
}

// Evento para o botão fechar tutorial
fecharTutorial.addEventListener("click", fecharVideoTutorial);

