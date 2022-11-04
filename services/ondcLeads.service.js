const { OndcLeads } = require("../models");

/**
 * @param {object} event
 * @returns {Promise}
 * */

const createLead = async (event) => await OndcLeads.create(event);


module.exports = {createLead};