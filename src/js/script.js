  // 1. ESTADO DOS PERSONAGENS
    let crono = { hp: 999, maxHp: 999, mp: 99, maxMp: 99, atk: 120, magic: 250 };
    let magus = { hp: 3000, maxHp: 3000, atk: 150 };
    let isPlayerTurn = true;

    // Elementos do DOM
    const log = document.getElementById('battle-log');
    const cronoSprite = document.getElementById('crono');
    const magusSprite = document.getElementById('magus');
    const botoes = document.querySelectorAll('.actions-box button');


    // 2. FUNÇÃO DE ATUALIZAÇÃO DA UI
    function updateUI() {
        document.getElementById('crono-hp-text').innerText = crono.hp;
        document.getElementById('crono-hp-bar').style.width = (crono.hp / crono.maxHp) * 100 + '%';
        
        document.getElementById('crono-mp-text').innerText = crono.mp;
        document.getElementById('crono-mp-bar').style.width = (crono.mp / crono.maxMp) * 100 + '%';

        // Desabilita botões se não for o turno do jogador
        botoes.forEach(btn => btn.disabled = !isPlayerTurn);
    }

    // 3. AÇÕES DO JOGADOR
    function playerAction(acao) {
        if (!isPlayerTurn) return;
        isPlayerTurn = false;
        updateUI();

        if (acao === 'atacar') {
            log.innerText = "Crono ataca com a Masamune!";
            cronoSprite.classList.add('anim-atk-crono'); // Dispara animação
            
            setTimeout(() => {
                let dano = Math.floor(Math.random() * 50) + crono.atk;
                magus.hp -= dano;
                magusSprite.classList.add('anim-damage');
                log.innerText = `Magus recebeu ${dano} de dano!`;
                checkWinCondition();
            }, 300); // Aplica o dano no meio da animação
        } 
        else if (acao === 'magia') {
            if (crono.mp >= 15) {
                crono.mp -= 15;
                log.innerText = "Crono usou Luminaire!!";
                setTimeout(() => {
                    let dano = crono.magic + Math.floor(Math.random() * 100);
                    magus.hp -= dano;
                    magusSprite.classList.add('anim-damage');
                    log.innerText = `Dano crítico! Magus recebeu ${dano}!`;
                    checkWinCondition();
                }, 500);
            } else {
                log.innerText = "MP Insuficiente!";
                isPlayerTurn = true;
                updateUI();
                return;
            }
        }
        else if (acao === 'item') {
            crono.hp = Math.min(crono.hp + 500, crono.maxHp);
            log.innerText = "Crono usou uma Mid Potion. Curou 500 HP!";
        }

        // Limpa animações e passa o turno para o chefe
        setTimeout(() => {
            cronoSprite.classList.remove('anim-atk-crono');
            magusSprite.classList.remove('anim-damage');
            if (magus.hp > 0) enemyTurn();
        }, 1500);
    }

    // 4. TURNO DO INIMIGO (MAGUS AI)
    function enemyTurn() {
        log.innerText = "Turno de Magus...";
        
        setTimeout(() => {
            magusSprite.classList.add('anim-atk-magus');
            log.innerText = "Magus lança Dark Matter!";
            
            setTimeout(() => {
                let dano = Math.floor(Math.random() * 80) + magus.atk;
                crono.hp = Math.max(crono.hp - dano, 0);
                cronoSprite.classList.add('anim-damage');
                log.innerText = `Crono recebeu ${dano} de dano!`;
                
                setTimeout(() => {
                    magusSprite.classList.remove('anim-atk-magus');
                    cronoSprite.classList.remove('anim-damage');
                    if (crono.hp === 0) {
                        log.innerText = "GAME OVER... O futuro se recusa a mudar.";
                    } else {
                        isPlayerTurn = true;
                        updateUI();
                        log.innerText = "Turno do Crono!";
                    }
                }, 1000);
            }, 400); // Dano calculado no meio da investida
        }, 1500); // Pausa dramática antes do ataque
    }

    // Verifica se a batalha acabou
    function checkWinCondition() {
        if (magus.hp <= 0) {
            magus.hp = 0;
            setTimeout(() => {
                log.innerText = "Magus foi derrotado! Você ganhou 3000 EXP.";
                magusSprite.style.opacity = 0; // Inimigo some
            }, 1000);
            isPlayerTurn = false; // Trava o jogo
        }
    }
