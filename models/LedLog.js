const mongoose = require('mongoose');

// Define a estrutura do dado no banco
const LedLogSchema = new mongoose.Schema({
    acao: {
        type: String,
        required: true // É obrigatório dizer se é 'ligar' ou 'desligar'
    },
    dataHora: {
        type: Date,
        default: Date.now // Pega a data e hora atual automaticamente
    }
});

module.exports = mongoose.model('LedLog', LedLogSchema);