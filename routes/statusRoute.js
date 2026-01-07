// // Arquivo: routes/statusRoute.js
// const express = require('express');
// const router = express.Router();
// const path = require('path'); 

// router.get('/', (req, res) => {
//     // __dirname aqui é a pasta 'routes'. Voltamos um (..) para a raiz e entramos em 'view'
//     res.sendFile(path.join(__dirname, '../view/index.html'));
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const path = require('path');

// 1. Importar o Modelo que criamos no passo 1
const LedLog = require('../models/LedLog');

router.use(express.json());

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../view/index.html'));
});

// IMPORTANTE: Adicione 'async' aqui para poder esperar o banco salvar
router.post('/mudar-led', async (req, res) => {
    try {
        const acaoRecebida = req.body.acao;
        
        // 2. Criar o registro para salvar
        const novoLog = new LedLog({
            acao: acaoRecebida
        });

        // 3. Salvar no banco de dados (o await espera salvar antes de continuar)
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

router.get('/esp32/status', async (req, res) => {
    try {
        // Pega o último registro (ordenado pelo ID, que contém a data)
        const ultimoRegistro = await LedModel.findOne().sort({ _id: -1 });

        if (ultimoRegistro) {
            console.log("🔍 DADOS ENCONTRADOS:", ultimoRegistro);

            // Tenta pegar o valor seja ele 'status', 'acao' ou 'command'
            // O '_doc' é usado as vezes quando o mongoose traz metadados juntos
            const dados = ultimoRegistro._doc || ultimoRegistro;
            
            const valorReal = dados.status || dados.acao || dados.comando || "campo_desconhecido";

            res.json({ status: valorReal });
        } else {
            console.log("📭 A coleção 'ledlogs' está vazia.");
            res.json({ status: "desligado" });
        }

    } catch (error) {
        console.error("Erro:", error);
        res.status(500).send("Erro interno");
    }
});

module.exports = router;