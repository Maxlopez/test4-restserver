const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');

app.get('/usuario', function (req, res) {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 0;

    let query = Usuario.find({estado: true},'nombre email role estado google img -_id').limit(limite).skip(desde);
    query.exec((err, usuarios) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err,
            });
        }

        Usuario.countDocuments({estado: true}, (err, total) => {
            res.json({
                ok: true,
                total,
                usuarios
            });
        })

    });

});

app.post('/usuario', function (req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err,
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});
app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let cambioEstado = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, cambioEstado, {new: true}, (err, usuarioDB) => {
        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB,
        });
    })
    //Eliminación física
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if( err ){
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     if( ! usuarioBorrado ){
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     })
    // });
});

module.exports = app;