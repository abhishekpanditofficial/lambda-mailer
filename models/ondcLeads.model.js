const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const { modelNameConst } = require("../constants");


const ondcLeadSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    status: {
        type: Boolean,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
});

ondcLeadSchema.plugin(toJSON);
ondcLeadSchema.plugin(paginate);


const ondcLeadModel = mongoose.model(modelNameConst.ondcLeads, ondcLeadSchema);

module.exports = ondcLeadModel;
