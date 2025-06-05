const authenticateToken = require('../middleware/auth');
const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        baseUrl: 'https://' + req.get('host')
    });
});

router.get('/login', function (req, res) {
    res.render('login');
});

router.get('/signin', function (req, res) {
    res.render('SIGNIN');
});

router.get('/attAm', authenticateToken, function (req, res) {
    if (req.user.flagtype !== 2) {
        return res.status(403).json({ error: 'Acesso negado: somente Amantes da Musica' });
    }

    res.render('attAM');
});

router.get('/attMusico', authenticateToken, function (req, res) {
    flagtyp = req.user.flagtype;
    if (flagtyp !== 1) {
        return res.status(403).json({ error: 'Acesso negado: somente músicos '+req.user.flagtype });
    }
    res.render('attMUSICO');

});

router.get('/attProdutor', authenticateToken, function (req, res) {
    flagtype = req.user.flagtype;
    if (flagtype !== 3) {
        return res.status(403).json({ error: 'Acesso negado: somente Produtores' });
    }
    res.render('attPRODUTOR');
});


router.get('/autenticacaoa',function(req,res){
    res.render('autenticacao');
})

router.get('/teste',function(req,res){
    res.render('upload_test');
})

router.get('/portifolio-am', authenticateToken, function (req, res) {
    if (req.user.flagtype !== 2) {
        return res.status(403).json({ error: 'Acesso negado: somente Amantes da musica' });
    }
    res.render('portifolio-AM');
});

router.get('/portifolio-musico', authenticateToken, function (req, res) {
    if (req.user.flagtype !== 1) {
        return res.status(403).json({ error: 'Acesso negado: somente músicos' });
    }
    res.render('portifolio-musico');
});

router.get('/portifolio-produtor', authenticateToken, function (req, res) {
    if (req.user.flagtype !== 3) {
        return res.status(403).json({ error: 'Acesso negado: somente Produtores' });
    }
    res.render('portifolio-produtor');
});



module.exports = router;