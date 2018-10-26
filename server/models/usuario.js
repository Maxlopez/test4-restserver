const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"],
    },
    email: {
        type: String,
        required: [true, "El email es necesario"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "user",
        enum: {
            values: ['admin', 'user'],
            message: "{VALUE} no es un rol válido"
        }
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});

//Eliminamos el password del modelo usuario para no mostrarlo en la respuesta
usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

//Validador unique
usuarioSchema.plugin(uniqueValidator, {
    message: "{PATH} debe ser único"
});

module.exports = mongoose.model('Usuario', usuarioSchema);