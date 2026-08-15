// script.js

// Funções para gerenciar a configuração do sexo do bebê
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

// Função para iniciar a revelação
function startReveal() {
    const gender = loadConfiguration();
    if (!gender) {
        alert("Por favor, escolha o resultado da revelação primeiro.");
        return;
    }
    currentStage = 1;
    showStage(currentStage);
}

// Função para mostrar a tela de configuração
function showConfigurationScreen() {
    document.body.innerHTML = `
        <div class="container">
            <h1>CONFIGURAÇÃO DA REVELAÇÃO</h1>
            <p>Escolha o resultado da revelação</p>
            <button onclick="saveConfiguration('boy'); showConfirmationScreen()">👦 MENINO</button>
            <button onclick="saveConfiguration('girl'); showConfirmationScreen()">👧 MENINA</button>
        </div>
    `;
}

// Função para mostrar a tela de confirmação
function showConfirmationScreen() {
    document.body.innerHTML = `
        <div class="container">
            <h1>Configuração completa.</h1>
            <button onclick="startReveal()">INICIAR REVELAÇÃO</button>
        </div>
    `;
}

// Função para mostrar cada estágio da revelação
let currentStage = 0;

function showStage(stage) {
    switch (stage) {
        case 1:
            showInitialization();
            break;
        case 2:
            showIdentification();
            break;
        case 3:
            showProcessing();
            break;
        case 4:
            showError404();
            break;
        case 5:
            showAnalysis();
            break;
        case 6:
            showConfirmation();
            break;
        case 7:
            showFinalVerification();
            break;
        case 8:
            revealBaby();
            break;
        default:
            alert("Estágio inválido.");
    }
}

// Funções para cada estágio
function showInitialization() {
    document.body.innerHTML = `
        <div class="container">
            <h1>SISTEMA DE REVELAÇÃO</h1>
            <p>Inicializando sistema...</p>
            <div class="progress-bar" style="width: 0%;" id="progressBar"></div>
        </div>
    `;
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        document.getElementById('progressBar').style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                document.body.innerHTML = `
                    <div class="container">
                        <h1>✓ Sistema inicializado</h1>
                        <button onclick="nextStage()">CONTINUAR</button>
                    </div>
                `;
            }, 1000);
        }
    }, 100);
}

function nextStage() {
    currentStage++;
    showStage(currentStage);
}

// Outras funções de estágio omitidas para brevidade...

function revealBaby() {
    const gender = loadConfiguration();
    document.body.innerHTML = `
        <div class="container">
            <h1>PROCESSANDO...</h1>
            <p>RESULTADO CONFIRMADO</p>
            <h2>3</h2>
            <h2>2</h2>
            <h2>1</h2>
            <h1>${gender === 'boy' ? '💙 É UM MENINO! 💙' : '💗 É UMA MENINA! 💗'}</h1>
            <p>PARABÉNS, FAMÍLIA!</p>
            <p>Um novo membro da família está a caminho! 👶</p>
        </div>
    `;
}

// Inicializa a tela de configuração ao carregar
window.onload = showConfigurationScreen;