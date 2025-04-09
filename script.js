// Lista de emojis para os reels
const emojis = ["🍒", "🍋", "🍊", "🍇", "🍀", "⭐", "💎"];

let wins = 0;
let losses = 0;
let balance = 0;

const reelElements = [
  document.getElementById("reel1"),
  document.getElementById("reel2"),
  document.getElementById("reel3")
];

const spinButton = document.getElementById("spinButton");
const resultDiv = document.getElementById("result");

// Função para pegar um emoji aleatório
function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// Função para iniciar o giro dos reels
function spinReels() {
  // Desabilita o botão durante a jogada
  spinButton.disabled = true;
  resultDiv.textContent = "";

  // Cria intervalos para atualizar os reels
  const intervals = reelElements.map((el) => {
    return setInterval(() => {
      el.textContent = getRandomEmoji();
    }, 100);
  });

  // Tempo total de giro: 20 segundos (20000ms)
  setTimeout(() => {
    // Parar os reels com pequenas diferenças no tempo para efeito de parada
    intervals.forEach((interval, index) => {
      // Cada reel para com um delay adicional de 500ms
      setTimeout(() => {
        clearInterval(interval);
        // Após o último reel parar, verificar resultado
        if (index === intervals.length - 1) {
          verificarResultado();
          spinButton.disabled = false;
        }
      }, index * 500);
    });
  }, 10000);
}

// Função para verificar se os 3 emojis são iguais
function verificarResultado() {
  const resultEmojis = reelElements.map(el => el.textContent);
  
  if (resultEmojis[0] === resultEmojis[1] && resultEmojis[1] === resultEmojis[2]) {
    // Vitória: soma 100 ao saldo
    wins++;
    balance += 100;
    resultDiv.textContent = "vc faturou 100zao malandro 💸";
  } else {
    // Derrota: incrementa a contagem de perdas e exibe quantas vezes perdeu
    losses++;
    resultDiv.textContent = `Se fudeu : :${losses} vezes 😬`;
  }
  
  // Atualiza os stats
  document.getElementById("wins").textContent = wins;
  document.getElementById("losses").textContent = losses;
  document.getElementById("balance").textContent = balance;
}

spinButton.addEventListener("click", spinReels);
