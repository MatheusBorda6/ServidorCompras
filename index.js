import express from 'express';
const app = express();

app.use(express.json());

const compras = [
    { id: 1, descricao: 'Fone', preco: 10 },
    { id: 2, descricao: 'Cabo USB', preco: 15 },
    { id: 3, descricao: 'Pen drive', preco: 20 },
];

app.get('/compras', (req, res) => {
    const precoMinimo = req.query.precoMin ? parseInt(req.query.precoMin, 10) : undefined;
    if (precoMinimo !== undefined) {
        const comprasFiltradas = compras.filter(item => item.preco >= precoMinimo);
        res.status(200).send({ compras: comprasFiltradas });
    } else {
        res.status(200).send({ compras });
    }
});

app.post('/compras', (req, res) => {
    const { descricao, preco } = req.body;
    const maiorId = compras.reduce((maiorAtual, item) => item.id > maiorAtual ? item.id : maiorAtual, 0);
    const novoProduto = {
        id: maiorId + 1, // Corrigido para incrementar o maiorId
        descricao,
        preco,
    };
    compras.push(novoProduto);
    res.status(201).send('Requisição POST recebida');
});

app.delete('/compras/:id', (req, res) => {
    const idPostman = parseInt(req.params.id, 10);
    const indiceParaExcluir = compras.findIndex(item => item.id === idPostman);
    if (indiceParaExcluir === -1) {
        return res.status(404).send({ mensagem: 'Compra não localizada' });
    }
    compras.splice(indiceParaExcluir, 1);
    res.status(200).send({ mensagem: 'Compra excluída com sucesso' });
});

app.get('/compras-total', (req, res) => {
    const valorTotal = compras.reduce((soma, itemAtual) => soma + itemAtual.preco, 0);
    res.status(200).send({ mensagem: `O total do pedido é ${valorTotal}` });
});

app.get('/compras/:id', (req, res) => {
    const idPostman = parseInt(req.params.id, 10);
    const compraFiltrada = compras.find(item => item.id === idPostman);
    if (!compraFiltrada) {
        return res.status(404).send({ mensagem: 'Compra não localizada' });
    }
    res.status(200).send({ compra: compraFiltrada });
});

app.listen(3000, () => console.log('Servidor iniciado na porta 3000'));
