import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'

const app = express()
app.use(cors())
app.use(express.json())

// Configurações do Supabase
const supabase = createClient(
  'https://uvxkheofkpsvtodenvbw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2eGtoZW9ma3BzdnRvZGVudmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMTgwMzEsImV4cCI6MjA2NDc5NDAzMX0.aReiOmiPNfxegPsDqAM13r5WqZxmuSwnSDow-KSBPCs'
)

// Função para gerar número de solicitação
function gerarNumero() {
  const data = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const aleatorio = Math.random().toString(16).substring(2, 6).toUpperCase()
  return `RES-${data}-${aleatorio}`
}

// Rota principal para receber reservas
app.post('/reservar', async (req, res) => {
  const dados = req.body
  const numero = gerarNumero()

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

  // Retorna número da solicitação
  res.json({ ok: true, numero })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
