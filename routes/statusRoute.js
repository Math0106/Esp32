const express = require('express');
const router = express.Router();
const path = require('path');

// 1. Importar o Modelo
const LedLog = require('../models/LedLog');

router.use(express.json());

// Rota para mostrar o site
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../view/index.html'));
});

// Rota POST: Site manda salvar 'ligar' ou 'desligar'
router.post('/mudar-led', async (req, res) => {
    try {
        const acaoRecebida = req.body.acao;
        
        const novoLog = new LedLog({
            acao: acaoRecebida
        });

        await novoLog.save();

        console.log(`💾 Salvo no banco: LED ${acaoRecebida}`);

        res.json({ 
            sucesso: true, 
            mensagem: `Comando ${acaoRecebida} salvo no histórico!` 
        });

    } catch (erro) {
        console.error("Erro ao salvar no banco:", erro);
        res.status(500).json({ erro: "Erro interno ao salvar dados" });
    }
});

// Rota GET: O ESP32 acessa aqui para saber o último status
router.get('/esp32/status', async (req, res) => {
    try {
        // CORREÇÃO: Usando 'LedLog' em vez de 'LedModel'
        const ultimoRegistro = await LedLog.findOne().sort({ _id: -1 });

        if (ultimoRegistro) {
            console.log("🔍 DADOS ENCONTRADOS:", ultimoRegistro);

            // Como você salvou como 'acao' no POST, pegamos 'acao' aqui
            // E enviamos como 'status' para o ESP32 entender
            const valorReal = ultimoRegistro.acao || "desligar";

            res.json({ status: valorReal });
        } else {
            console.log("📭 Banco vazio.");
            res.json({ status: "desligado" });
        }

    } catch (error) {
        console.error("Erro no GET:", error);
        res.status(500).send("Erro interno");
    }
});

module.exports = router;