const knex = require('knex');
const knexConfig = require('../../knexfile');

// Pega configuração baseada no ambiente
const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

// Cria instância de conexão
const database = knex(config);

module.exports = database;
