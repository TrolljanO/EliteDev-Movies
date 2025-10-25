const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Rota para testar conexão com banco
router.get('/db-test', async (req, res) => {
  try {
    // Tenta consultar tabela users
    const users = await db('users').select('*').limit(5);
    
    res.json({
      success: true,
      message: '✅ Conexão com banco OK!',
      userCount: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Erro ao conectar com banco',
      error: error.message
    });
  }
});

// Rota para testar se tabelas existem
router.get('/db-tables', async (req, res) => {
  try {
    const tables = await db.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    res.json({
      success: true,
      tables: tables.rows.map(t => t.table_name)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
