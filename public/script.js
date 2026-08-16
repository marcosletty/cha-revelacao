const STAGES = {
    CONFIGURATION: 'configuration',
    CONFIRMATION: 'confirmation',
    STAGES: 'stages',
    FINAL_REVEAL: 'finalReveal'
};

let currentStage = 0;
let audioContext = null;
let initInterval = null;
let progressTimer = null;
let lineTimer = null;
let countdownTimer = null;

function saveConfiguration(gender) {
    localStorage.setItem('babyGender', gender);
}

function loadConfiguration() {
    return localStorage.getItem('babyGender');
}

function resetConfiguration() {
    localStorage.removeItem('babyGender');
    showConfigurationScreen();
}

function setScreen(screenName) {
    const screens = Object.values(STAGES);
    screens.forEach((screenId) => {
        const element = document.getElementById(screenId);
        if (element) {
            element.classList.toggle('hidden', screenId !== screenName);
        }
    });
}

function setStageContent(html) {
    const stageContent = document.getElementById('stageContent');
    if (stageContent) {
        stageContent.innerHTML = html;
    }
}

function appendTerminalLine(elementId, text) {
    const terminal = document.getElementById(elementId);
    if (!terminal) return;

    const line = document.createElement('p');
    line.className = 'terminal-line';
    line.textContent = text;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
}

function getRandomLine(lines) {
    return lines[Math.floor(Math.random() * lines.length)];
}

function ensureAudioContext() {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;

    if (!audioContext) {
        audioContext = new AudioCtor();
    }

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    return audioContext;
}

function playTone({ frequency = 440, duration = 220, type = 'sine', volume = 0.04 }) {
    const context = ensureAudioContext();
    if (!context) return;

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + duration / 1000);
}

function playErrorTone() {
    playTone({ frequency: 180, duration: 260, type: 'square', volume: 0.06 });
    setTimeout(() => {
        playTone({ frequency: 120, duration: 260, type: 'triangle', volume: 0.05 });
    }, 120);
}

function playSuccessTone() {
    playTone({ frequency: 660, duration: 180, type: 'triangle', volume: 0.06 });
    setTimeout(() => {
        playTone({ frequency: 880, duration: 180, type: 'triangle', volume: 0.05 });
    }, 110);
}

function startReveal() {
    const gender = loadConfiguration();
    if (!gender) {
        alert('Por favor, escolha o resultado da revelação primeiro.');
        return;
    }

    currentStage = 1;
    showStage(currentStage);
}

function showConfigurationScreen() {
    setScreen(STAGES.CONFIGURATION);
    document.getElementById('boyButton').onclick = () => {
        saveConfiguration('boy');
        showConfirmationScreen();
    };
    document.getElementById('girlButton').onclick = () => {
        saveConfiguration('girl');
        showConfirmationScreen();
    };
}

function clearStageTimers() {
    if (initInterval) { clearInterval(initInterval); initInterval = null; }
    if (progressTimer) { clearInterval(progressTimer); progressTimer = null; }
    if (lineTimer) { clearInterval(lineTimer); lineTimer = null; }
    if (countdownTimer) { clearTimeout(countdownTimer); countdownTimer = null; }
}

function showConfirmationScreen() {
    setScreen(STAGES.CONFIRMATION);
    const startButton = document.getElementById('startRevealButton');
    startButton.onclick = startReveal;
}

function showStage(stage) {
    currentStage = stage;
    // limpa timers ativos antes de carregar o próximo estágio
    clearStageTimers();
    setScreen(STAGES.STAGES);

    switch (stage) {
        case 1:
            showInitialization();
            break;
        case 2:
            showBiometricScan('pai');
            break;
        case 3:
            showBiometricScan('mae');
            break;
        case 4:
            showFakeReveal();
            break;
        case 5:
            showFinalCountdown();
            break;
        case 6:
            revealBaby();
            break;
        default:
            alert('Estágio inválido.');
    }
}

function nextStage() {
    currentStage += 1;
    showStage(currentStage);
}

function showInitialization() {
    setStageContent(`
        <div class="phrase-box">
            <p id="initPhrase" class="phrase-text"></p>
        </div>
        <div class="progress-bar">
            <div id="initProgress" class="progress"></div>
        </div>
        <div class="controls"><button id="initContinue" class="action-button hidden">CONTINUAR</button></div>
    `);

    const phraseEl = document.getElementById('initPhrase');
    const progressBar = document.getElementById('initProgress');
    const continueBtn = document.getElementById('initContinue');
    let progress = 0;
    const messages = [
        'Bem-vindos! Preparando este momento especial...',
        'Aquecendo corações e expectativas positivas...',
        'Sincronizando sorrisos da família...',
        'Carregando confetes virtuais e boas vibrações...',
        'Pronto para revelar com muito amor!'
    ];

    let msgIndex = 0;
    // cada frase dura 3 segundos
    initInterval = setInterval(() => {
        progress = Math.min(progress + 20, 100);
        progressBar.style.width = `${progress}%`;
        phraseEl.textContent = messages[msgIndex] || 'Preparando...';
        msgIndex = Math.min(msgIndex + 1, messages.length - 1);

        if (progress >= 100) {
            clearInterval(initInterval);
            initInterval = null;
            // mostra o botão continuar
            phraseEl.textContent = '✓ Sistema inicializado com sucesso.';
            continueBtn.classList.remove('hidden');
            continueBtn.onclick = () => nextStage();
        }
    }, 3000);
}

function showBiometricScan(parentType) {
    const parentName = parentType === 'pai' ? 'PAI' : 'MÃE';
    const title = parentType === 'pai' ? 'CALIBRAÇÃO DE DNA DO PAI' : 'CALIBRAÇÃO DE DNA DA MÃE';

    setStageContent(`
            <h2 id="scanTitle" class="scan-title"></h2>
            <div class="phrase-box">
                <p id="scanPhrase" class="phrase-text"></p>
            </div>
            <div class="scan-panel">
                <div class="scan-progress">
                    <div id="scanProgress" class="scan-progress-fill"></div>
                </div>
                <div class="scan-button-wrapper">
                    <button id="scanButton" class="scan-button" type="button">SEGURE A IMPRESSÃO DIGITAL</button>
                </div>
                <p class="scan-caption">Segure continuamente por cerca de 20 segundos sem soltar.</p>
            </div>
    `);

    const scanButton = document.getElementById('scanButton');
    const progressBar = document.getElementById('scanProgress');
    const scanTitle = document.getElementById('scanTitle');
    if (scanTitle) {
        if (parentType === 'pai') {
            scanTitle.textContent = 'Etapa 1 de 2 — Escanear a digital do papai Luis';
        } else {
            scanTitle.textContent = 'Etapa 2 de 2 — Escanear a digital da mamãe Larissa';
        }
    }
    let progress = 0;
    let isHolding = false;
    let holdTimer = null;
    let lineIndex = 0;

    const lines = {
        pai: [
            'Detectado gene da soneca no sofá: 92%',
            'Probabilidade de dominar a churrasqueira: 88%',
            'Chance de aprender a cantar o hino do time: 73%',
            'Fazer piadas de tiozão nas reuniões: 99%',
            'Estimando improviso com fita adesiva: 67%'
        ],
        mae: [
            'Probabilidade de resolver com jeitinho: 95%',
            'Chance de lembrar aniversários de todo mundo: 99%',
            'Especialidade: transformar fralda em obra de arte rápida',
            'Habilidade detectada: acalmar com uma canção em 2 minutos',
            'Determinada a organizar a festa mais bonita da família'
        ]
    };

    const addLine = (text) => {
        const el = document.getElementById('scanPhrase');
        if (el) el.textContent = text;
    };

    function updateProgress() {
        progressBar.style.width = `${progress}%`;
    }

    function startHold() {
        if (isHolding) return;
        isHolding = true;
        scanButton.disabled = true;
        addLine(`Iniciando varredura de DNA do ${parentName.toLowerCase()}...`);

        // Progresso: 1% a cada 200ms => ~20 segundos até 100%
        progressTimer = setInterval(() => {
            progress = Math.min(progress + 1, 100);
            updateProgress();

            if (navigator.vibrate) {
                navigator.vibrate(40);
            }

            if (progress >= 100) {
                finishScan();
            }
        }, 200);

        // Mostrar linhas humorísticas uma por vez, cada 3s (duração solicitada)
        lineIndex = 0;
        lineTimer = setInterval(() => {
            if (lineIndex < lines[parentType].length) {
                addLine(lines[parentType][lineIndex]);
                lineIndex += 1;
            } else {
                addLine(getRandomLine(lines[parentType]));
            }
        }, 3000);
    }

    function finishScan() {
        if (progressTimer) {
            clearInterval(progressTimer);
            progressTimer = null;
        }
        if (lineTimer) {
            clearInterval(lineTimer);
            lineTimer = null;
        }

        isHolding = false;
        scanButton.disabled = false;
        scanButton.textContent = 'CALIBRAÇÃO CONCLUÍDA';
        updateProgress();
        addLine(`✓ Calibração genética do ${parentName.toLowerCase()} concluída.`);
        playSuccessTone();

        setTimeout(() => nextStage(), 1200);
    }

    function failScan() {
        if (progressTimer) {
            clearInterval(progressTimer);
            progressTimer = null;
        }
        if (lineTimer) {
            clearInterval(lineTimer);
            lineTimer = null;
        }

        isHolding = false;
        progress = 0;
        updateProgress();
        scanButton.disabled = false;
        scanButton.textContent = 'SEGURE A IMPRESSÃO DIGITAL PARA VARREDURA';
        addLine('Falha na varredura. A mão foi removida antes da conclusão.');
        addLine('Reiniciando processo de calibração...');
        playErrorTone();

        if (navigator.vibrate) {
            navigator.vibrate([90, 40, 120]);
        }
    }

    scanButton.addEventListener('touchstart', (event) => {
        event.preventDefault();
        startHold();
    }, { passive: false });

    scanButton.addEventListener('touchend', () => {
        if (progress >= 100) return;
        failScan();
    });

    scanButton.addEventListener('touchcancel', () => {
        if (progress >= 100) return;
        failScan();
    });

    scanButton.addEventListener('mousedown', (event) => {
        event.preventDefault();
        startHold();
    });

    scanButton.addEventListener('mouseup', () => {
        if (progress >= 100) return;
        failScan();
    });

    scanButton.addEventListener('mouseleave', () => {
        if (isHolding && progress < 100) {
            failScan();
        }
    });

    addLine('Preparando bancada genética para conferência parental...');
    addLine('Aguarde a leitura do padrão digital.');
}

function showFakeReveal() {
    setStageContent(`
        <div class="phrase-box">
            <p id="fakePhrase" class="phrase-text"></p>
        </div>
    `);

    const phraseEl = document.getElementById('fakePhrase');
    const addLine = (text) => { if (phraseEl) phraseEl.textContent = text; };

    addLine('RESULTADO OBTIDO: É UM...');
    // cada frase dura 3s para leitura
    setTimeout(() => {
        addLine('👶 ...HUMANO SAUDÁVEL COM DOIS OLHOS!');

        setTimeout(() => {
            addLine('Ops, carregando o banco genético correto...');
            playErrorTone();
            if (navigator.vibrate) navigator.vibrate([120,50,160]);
            setTimeout(() => nextStage(), 3000);
        }, 3000);
    }, 3000);
}

function showFinalCountdown() {
    setStageContent(`
        <div class="terminal-window">
            <div class="terminal-header">Contagem final</div>
            <div class="terminal-body countdown-panel">
                <p class="terminal-line">Carregando banco genético oficial...</p>
                <div id="countdownValue" class="countdown">3</div>
            </div>
        </div>
    `);

    const countdownValue = document.getElementById('countdownValue');
    const sequence = [3, 2, 1];
    let index = 0;
    // executa com intervalo controlado e cancela se necessário
    countdownTimer = setInterval(() => {
        if (index >= sequence.length) {
            clearInterval(countdownTimer);
            countdownTimer = null;
            // Após a contagem, exige 5 cliques para revelar e exibe frases motivacionais
            setScreen(STAGES.FINAL_REVEAL);
            const revealMessage = document.getElementById('revealMessage');
            const revealButton = document.getElementById('revealButton');
            if (revealMessage) revealMessage.textContent = 'PRONTO PARA REVELAR';

            // Esconder botão de revelação tradicional
            if (revealButton) {
                revealButton.style.display = 'none';
                revealButton.disabled = true;
            }

            // Cria área de clique que exige 5 cliques
            let clickArea = document.getElementById('revealClickArea');
            if (!clickArea) {
                clickArea = document.createElement('button');
                clickArea.id = 'revealClickArea';
                clickArea.className = 'action-button';
                clickArea.textContent = 'CLIQUE AQUI PARA REVELAR (5x)';
                const container = document.getElementById('finalReveal');
                if (container) container.insertBefore(clickArea, container.firstChild);
            } else {
                clickArea.style.display = '';
            }

            const prompts = [
                'Clique com vontade!',
                'Dá pra melhorar — mais força!',
                'Isso! Só mais um pouquinho...',
                'Quase lá — mais cliques!',
                'Último clique pra grande revelação!'
            ];

            let clickCount = 0;
            function onRevealClick() {
                // mostra frase correspondente (limitado ao array)
                const prompt = prompts[Math.min(clickCount, prompts.length - 1)];
                if (revealMessage) revealMessage.textContent = prompt;
                playTone({ frequency: 520 + clickCount * 40, duration: 120, volume: 0.05 });
                if (navigator.vibrate) navigator.vibrate(60);
                clickCount += 1;
                if (clickCount >= 5) {
                    clickArea.removeEventListener('click', onRevealClick);
                    clickArea.disabled = true;
                    clickArea.style.display = 'none';
                    // finaliza com pequena pausa e revela
                    setTimeout(() => revealBaby(), 400);
                } else {
                    // atualiza texto do botão para refletir progresso
                    clickArea.textContent = `CLIQUE AQUI PARA REVELAR (${5 - clickCount}x)`;
                }
            }

            clickArea.removeEventListener && clickArea.removeEventListener('click', onRevealClick);
            clickArea.addEventListener('click', onRevealClick);
            return;
        }

        countdownValue.textContent = sequence[index];
        playTone({ frequency: 520 + index * 90, duration: 180, type: 'sine', volume: 0.05 });
        index += 1;
    }, 800);
}

function revealBaby() {
    const gender = loadConfiguration();
    const revealMessage = document.getElementById('revealMessage');
    const revealButton = document.getElementById('revealButton');

    const pais = { pai: 'Luis', mae: 'Larissa' };

    if (gender === 'boy') {
        const nome = 'Davi';
        const text = `💙 É UM MENINO! — ${nome}\nHerdeiro de sorrisos do ${pais.pai} e da ${pais.mae}. Preparar as comemorações!`;
        if (revealMessage) revealMessage.textContent = text;
    } else {
        const nome = 'Alice';
        const text = `💗 É UMA MENINA! — ${nome}\nFilha do ${pais.pai} e da ${pais.mae}, já cercada de amor.`;
        if (revealMessage) revealMessage.textContent = text;
    }

    if (revealButton) {
        revealButton.textContent = 'PARABÉNS!';
        revealButton.disabled = true;
    }
    playSuccessTone();
    // adiciona uma linha extra com detalhe criativo
    const finalText = document.createElement('p');
    finalText.className = 'final-subtitle';
    if (gender === 'boy') finalText.textContent = 'Davi — já reservado o primeiro colo do Luis e da Larissa.';
    else finalText.textContent = 'Alice — já tem o novo time de fãs: Larissa e Luis.';
    const revealContainer = document.getElementById('finalReveal');
    if (revealContainer) revealContainer.appendChild(finalText);
}

function initApp() {
    showConfigurationScreen();
    const finalReveal = document.getElementById('finalReveal');
    if (finalReveal) {
        finalReveal.classList.add('hidden');
    }
    const continueButton = document.getElementById('continueButton');
    if (continueButton) {
        continueButton.classList.add('hidden');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}