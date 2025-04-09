// Configurações do jogo
const CONFIG = {
    INITIAL_BALANCE: 1000,
    BET_AMOUNT: 50,
    SPIN_DURATION: 1000,
    REEL_DELAY: 300,
    EMOJIS: ["🍒", "🍋", "🍊", "🍇", "🍀", "⭐", "💎"],
    PAYOUTS: {
      '💎': { '3': 1000, '2': 200 },
      '🍇': { '3': 500, '2': 100 },
      '⭐': { '3': 300, '2': 50 },
      '🍀': { '3': 200, '2': 30 },
      '🍊': { '3': 100, '2': 20 },
      '🍋': { '3': 80, '2': 15 },
      '🍒': { '3': 50, '2': 10 }
    }
  };
  
  // Elementos do DOM
  const reelElements = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3")
  ];
  const spinButton = document.getElementById("spinButton");
  const resultDiv = document.getElementById("result");
  
  // Estado do jogo
  let gameState = {
    wins: 0,
    losses: 0,
    balance: CONFIG.INITIAL_BALANCE,
    isSpinning: false
  };
  
  // Efeitos sonoros (substitua por arquivos reais)
  const playSound = {
    spin: () => new Audio('song/spin.mp3').play(),
    win: () => new Audio('song/win.mp3').play(),
    lose: () => new Audio('song/lose.mp3').play()
  };
  
  // Inicialização do jogo
  function initGame() {
    updateStats();
    spinButton.addEventListener("click", startSpin);
  }
  
  // Atualizar estatísticas na UI
  function updateStats() {
    document.getElementById("wins").textContent = gameState.wins;
    document.getElementById("losses").textContent = gameState.losses;
    document.getElementById("balance").textContent = `R$ ${gameState.balance}`;
  }
  
  // Gerar resultado aleatório
  function getRandomEmoji() {
    return CONFIG.EMOJIS[Math.floor(Math.random() * CONFIG.EMOJIS.length)];
  }
  
  // Animação do reel
  async function animateReel(reelElement, duration) {
    return new Promise(resolve => {
      const start = Date.now();
      
      const frame = () => {
        reelElement.textContent = getRandomEmoji();
        
        if (Date.now() - start < duration) {
          requestAnimationFrame(frame);
        } else {
          resolve();
        }
      };
      
      requestAnimationFrame(frame);
    });
  }
  
  // Verificar combinações e calcular prêmio
  function checkResults(results) {
    const counts = {};
    results.forEach(emoji => counts[emoji] = (counts[emoji] || 0) + 1);
  
    let winAmount = 0;
    for (const [emoji, count] of Object.entries(counts)) {
      const payout = CONFIG.PAYOUTS[emoji]?.[count.toString()] || 0;
      winAmount += payout;
    }
  
    return winAmount;
  }
  
  // Executar uma jogada completa
  async function startSpin() {
    if (gameState.isSpinning || gameState.balance < CONFIG.BET_AMOUNT) return;
  
    gameState.isSpinning = true;
    spinButton.disabled = true;
    gameState.balance -= CONFIG.BET_AMOUNT;
    updateStats();
    
    playSound.spin();
    resultDiv.textContent = "🎰 Girando...";
    
    try {
      const results = [];
      
      // Girar reels sequencialmente
      for (const [index, reel] of reelElements.entries()) {
        reel.classList.add('spinning');
        await animateReel(reel, CONFIG.SPIN_DURATION + (index * CONFIG.REEL_DELAY));
        reel.classList.remove('spinning');
        
        const finalEmoji = getRandomEmoji();
        reel.textContent = finalEmoji;
        results.push(finalEmoji);
        
        // Delay entre reels
        await new Promise(resolve => setTimeout(resolve, CONFIG.REEL_DELAY));
      }
  
      // Calcular resultados
      const winAmount = checkResults(results);
      
      if (winAmount > 0) {
        gameState.wins++;
        gameState.balance += winAmount;
        resultDiv.innerHTML = `🎉 JACKPOT! +R$${winAmount} 💰<div class="confetti"></div>`;
        playSound.win();
      } else {
        gameState.losses++;
        resultDiv.textContent = "😢 Tente novamente!";
        playSound.lose();
      }
      
    } catch (error) {
      console.error("Erro na rotação:", error);
      resultDiv.textContent = "⚠️ Erro no sistema!";
    } finally {
      gameState.isSpinning = false;
      spinButton.disabled = false;
      updateStats();
      
      // Game over
      if (gameState.balance < CONFIG.BET_AMOUNT) {
        resultDiv.textContent = "💸 FICOU BROKE! Recarregue!";
      }
    }
  }
  
  // Iniciar o jogo quando o DOM carregar
  document.addEventListener('DOMContentLoaded', initGame);