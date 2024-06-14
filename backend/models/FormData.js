// models/FormData.js
const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
    _id: String,
    name: String,
    email: String,
    password: String,
    created_at: Date
});

const FormDataModel = mongoose.model('FormData', formDataSchema);

module.exports = FormDataModel;
