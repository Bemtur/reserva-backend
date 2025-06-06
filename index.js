import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const app = express()
app.use(cors())
app.use(express.json())

// Configurações do Supabase
const supabase = createClient(
  'https://uvxkheofkpsvtodenvbw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2eGtoZW9ma3BzdnRvZGVudmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMTgwMzEsImV4cCI6MjA2NDc5NDAzMX0.aReiOmiPNfxegPsDqAM13r5WqZxmuSwnSDow-KSBPCs'
)

// Configuração do NodeMailer com seu Gmail e senha de app
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'adm@bemtur.com.br',         // seu e-mail
    pass: 'hwwxblolrtwdsltw'           // sua senha de app
  }
})

// Função para gerar número de solicitação
function gerarNumero() {
  const data = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const aleatorio = Math.random().toString(16).substring(2, 6).toUpperCase()
  return `RES-${data}-${aleatorio}`
}

// Função para enviar e-mail com dados da reserva
async function enviarEmail(dados, numeroSolicitacao) {
  const mailOptions = {
    from: 'adm@bemtur.com.br',
    to: 'adm@bemtur.com.br', // pode enviar para outros e-mails se quiser
    subject: `Nova Reserva - ${numeroSolicitacao}`,
    text: JSON.stringify(dados, null, 2)
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Email enviado com sucesso!')
  } catch (error) {
    console.error('Erro ao enviar email:', error)
  }
}

// Rota para receber reservas
app.post('/reservar', async (req, res) => {
  const dados = req.body
  const numero = gerarNumero()

  // Salva no Supabase
  const { error } = await supabase
    .from('reservas')
    .insert({
      numero_solicitacao: numero,
      json_dados: dados,
      status: 'PENDENTE'
    })

  if (error) {
    console.error(error)
    return res.status(500).json({ erro: 'Erro ao salvar reserva' })
  }

  // Envia e-mail com os dados da reserva
  enviarEmail(dados, numero)

  // Retorna número da solicitação
  res.json({ ok: true, numero })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
