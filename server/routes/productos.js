const express = require("express");
const { verificaToken } = require("../middlewares/autenticacion");
const Producto = require("../models/producto");

const app = express();

app.get("/productos", verificaToken, (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  Producto.find({ disponible: true })
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        productos,
      });
    });
});

app.get("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  Producto.findById(id)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "El id del producto no existe",
          },
        });
      }

      res.json({
        ok: true,
        producto: productoDB,
      });
    });
});

app.get("/productos/buscar/:termino", verificaToken, (req, res) => {
  let termino = req.params.termino;
  let regExp = new RegExp(termino, "ig");

  Producto.find({ nombre: regExp })
    .populate("categoria", "descripcion")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        productos,
      });
    });
});

app.post("/productos", verificaToken, (req, res) => {
  const body = req.body;
  const producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario._id,
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      producto: productoDB,
    });
  });
});

app.put("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  let body = req.body;
  let productoCambios = {
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
  };

  Producto.findByIdAndUpdate(id, productoCambios, { new: true, runValidators: true }, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El ID no es valido",
        },
      });
    }

    res.json({
      ok: true,
      producto: productoDB,
    });
  });
});

app.delete("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let cambiaDisponible = {
    disponible: false,
  };

  Producto.findByIdAndUpdate(id, cambiaDisponible, { new: true }, (err, productoBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoBorrado) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Producto no existe",
        },
      });
    }

    res.json({
      ok: true,
      producto: productoBorrado,
      message: "Producto eliminado exitosamente",
    });
  });
});

module.exports = app;
