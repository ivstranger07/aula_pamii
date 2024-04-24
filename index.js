const express = require('express');
const mysql = require('mysql2/promise');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();
app.disable("x-powered-by");

app.use(express.json());
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'crudapi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Configuração do Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de CRUD de usuários',
      version: '1.0.0',
      description: 'API para criar, ler, atualizar e deletar usuários'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ]
  },
  apis: ['index.js']
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna todos os usuários
 *     responses:
 *       '200':
 *         description: OK
 *   post:
 *     summary: Cria um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NOME:
 *                 type: string
 *                 description: Nome do usuário
 *               IDADE:
 *                 type: integer
 *                 description: Idade do usuário
 *             example:
 *               NOME: João da Silva
 *               IDADE: 30
 *     responses:
 *       '200':
 *         description: OK
 *
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NOME:
 *                 type: string
 *                 description: Novo nome do usuário
 *               IDADE:
 *                 type: integer
 *                 description: Nova idade do usuário
 *             example:
 *               NOME: José da Silva
 *               IDADE: 35
 *     responses:
 *       '204':
 *         description: No Content
 *   delete:
 *     summary: Deleta um usuário existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           description: ID do usuário a ser deletado
 *     responses:
 *       '204':
 *         description: No Content
 */

app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuario');
    res.json(rows);
  } catch (error) {
    console.error("Erro ao recuperar usuários:", error);
    res.status(500).send("Erro ao recuperar usuários");
  }
});

app.post('/users', async (req, res) => {
  try {
    const { NOME, IDADE } = req.body;
    const [result] = await pool.query('INSERT INTO usuario (NOME, IDADE) VALUES (?, ?)', [NOME, IDADE]);
    res.json({ id: result.insertId, NOME:NOME, IDADE:IDADE});
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).send("Erro ao criar usuário");
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const { NOME, IDADE } = req.body;
    const { id } = req.params;
    await pool.query('UPDATE usuario SET NOME = ?, IDADE = ? WHERE id = ?', [NOME, IDADE, id]);
    res.status(200).json({ id: id, NOME: NOME, IDADE: IDADE });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).send("Erro ao atualizar usuário");
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM usuario WHERE id = ?', [id]);
    res.status(200).json({ id: Number(id) });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).send("Erro ao deletar usuário");
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM usuario WHERE id = ?', [id]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).send("Erro ao buscar usuário");
  }
});

//exemplo: /users?nome=tom

app.get('/users', async (req, res) => {
  try {
    const { nome } = req.query;
    let query = 'SELECT * FROM usuario';
    let params = [];

    if (nome) {
      query += ' WHERE NOME NOT LIKE ?';
      params.push(`%${nome}%`);
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).send("Erro ao buscar usuário");
  }
});

// GET all products
app.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM produto');
    res.json(rows);
  } catch (error) {
    console.error("Erro ao recuperar produtos:", error);
    res.status(500).send("Erro ao recuperar produtos");
  }
});

// POST a new product
app.post('/products', async (req, res) => {
  try {
    const { nome, preco, descricao } = req.body;
    const [result] = await pool.query('INSERT INTO produto (nome, preco, descricao) VALUES (?, ?, ?)', [nome, preco, descricao]);
    res.json({ id: result.insertId, nome, preco, descricao });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).send("Erro ao criar produto");
  }
});

// PUT update a product
app.put('/products/:id', async (req, res) => {
  try {
    const { nome, preco, descricao } = req.body;
    const { id } = req.params;
    await pool.query('UPDATE produto SET nome = ?, preco = ?, descricao = ? WHERE id = ?', [nome, preco, descricao, id]);
    res.status(200).json({ id, nome, preco, descricao });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).send("Erro ao atualizar produto");
  }
});

// DELETE a product
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM produto WHERE id = ?', [id]);
    res.status(200).json({ id: Number(id) });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    res.status(500).send("Erro ao deletar produto");
  }
});

// GET a specific product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM produto WHERE id = ?', [id]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    res.status(500).send("Erro ao buscar produto");
  }
});

// GET products filtering by name
app.get('/products', async (req, res) => {
  try {
    const { nome } = req.query;
    let query = 'SELECT * FROM produto';
    let params = [];

    if (nome) {
      query += ' WHERE nome NOT LIKE ?';
      params.push(`%${nome}%`);
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    res.status(500).send("Erro ao buscar produto");
  }
});

const server = app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

// Mantém o servidor rodando mesmo se ocorrer um erro
process.on('uncaughtException', (err) => {
  console.error('Erro não tratado:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Rejeição não tratada:', err);
});

// Rota para buscar todos os produtos
app.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM produto');
    res.json(rows);
  } catch (error) {
    console.error("Erro ao recuperar produtos:", error);
    res.status(500).send("Erro ao recuperar produtos");
  }
});

// Rota para buscar um produto específico por ID
app.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM produto WHERE id = ?', [id]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    res.status(500).send("Erro ao buscar produto");
  }
});

// Rota para adicionar um novo produto
app.post('/products', async (req, res) => {
  try {
    const { nome, preco, descricao } = req.body;
    const [result] = await pool.query('INSERT INTO produto (nome, preco, descricao) VALUES (?, ?, ?)', [nome, preco, descricao]);
    res.json({ id: result.insertId, nome, preco, descricao });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).send("Erro ao criar produto");
  }
});

// Rota para atualizar um produto existente
app.put('/products/:id', async (req, res) => {
  try {
    const { nome, preco, descricao } = req.body;
    const { id } = req.params;
    await pool.query('UPDATE produto SET nome = ?, preco = ?, descricao = ? WHERE id = ?', [nome, preco, descricao, id]);
    res.status(200).json({ id, nome, preco, descricao });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).send("Erro ao atualizar produto");
  }
});

// Rota para deletar um produto
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM produto WHERE id = ?', [id]);
    res.status(200).json({ id: Number(id) });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    res.status(500).send("Erro ao deletar produto");
  }
});

// Rota para buscar produtos filtrados por nome
app.get('/products', async (req, res) => {
  try {
    const { nome } = req.query;
    let query = 'SELECT * FROM produto';
    let params = [];

    if (nome) {
      query += ' WHERE nome LIKE ?';
      params.push(`%${nome}%`);
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    res.status(500).send("Erro ao buscar produto");
  }
});