const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
const geoCoder = require('../utils/geocoder');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true,'Inserte el nombre del trabajo'],
        trim: true,
        text: true,
        maxLentgh: [100, 'No puede exceder de 100 caracteres']
    },
    slug: String,
    description: {
        type: String,
        required: [true,'Inserte la descripcion del trabajo'],
        maxLentgh: [1000, 'No puede exceder de 1000 caracteres']
    },
    email: {
        type: String,
        validate: [validator.isEmail, 'Inserta un correo válido']
    },
    address: {
        type: String,
        required: [true,'Inserte la calle del trabajo'],
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    company: {
        type: String,
        required: [true,'Inserte el nombre de la Empresa'],
    },
    industry : {
        type: [String], // puede elehir mas de uno
        required: true,
        enum : {
            values: ['Negocios', 'IT', 'Banca', 'Educación/Cursos', 'Otros'],
            message: 'Elije opciones válidas de la Industria'
        }
    },
    jobType: {
        type: String, // solo uno
        required: true,
        enum: {
            values:['Permanente', 'Temporal', 'Becario'],
            message: 'Elije opciones válidas del tipo de trabajo'

        }
    },
    minEducation : {
        type: String, // solo uno
        required: true,
        enum: {
            values:['Preparatoria', 'Licenciatura', 'Maestría'],
            message: 'Elije opciones válidas de escolaridad'

        }
    },
    positions: {
        type: Number,
        default: 1
    },
    experience: {
        type: String,
        required: true,
        enum:{ 
            values: ['Sin experiencia', '1 a 2 años', '2 o mas años'],
            message: 'Elije la experiencia requerida'
        }
    },
    salary: {
        type: Number,
        required:[true, 'Indica el salario para este trabajo']
    },
    postingDate: {
        type: Date,
        default: Date.now
    },
    lastDate: {
        type: Date,
        default: new Date().setDate(new Date().getDate() + 7)
    },
    applicantsApplied: {
        type:[Object],
        select: false
    }
});

//Crear slug before saving

jobSchema.pre('save', function(next){
    this.slug = slugify(this.title, { lower: true});
    next();
});

//Setting up location

jobSchema.pre('save', async function(next){
    const loc = await geoCoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    };
    next();
});


module.exports = mongoose.model('Job', jobSchema);