import { GoogleGenAI } from '@google/genai'
import { env } from '../env.ts'
import { ClientError } from '../http/_errors/client-error.ts'

const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
})

const model = 'gemini-2.5-flash'

export async function transcribeAudio(audioAsBase64: string, mimeType: string) {
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: 'Transcreva o áudio para poortuguês do Brasil. Seja preciso e natural na transcrição. Mantenha a pontuação adequada e divida o texto em parágrafos quando for apropriado.',
      },
      {
        inlineData: {
          mimeType,
          data: audioAsBase64
        }
      }
    ]
  })

  if (!response.text) {
    throw new ClientError('Não foi possível transcrever o áudio')
  }

  return response.text
}

export async function generateEmbeddings(text: string) {
  const response = await gemini.models.embedContent({
    model: 'text-embedding-004',
    contents: [{ text }],
    config: {
      taskType: 'RETRIEVAL_DOCUMENT'
    }
  })

  if (!response.embeddings?.[0].values) {
    throw new ClientError('Não foi possível gerar os embeddings')
  }

  return response.embeddings[0].values
}

export async function generateAnswer(question: string, transcription: string[]) {
  const context = transcription.join('\n\n')

  const prompt = `
  Com base no texto fornecido abaixo pelo contexto, responda à pergunta de forma clara e precisa em português do Brasil.

  CONTEXTO:
  ${context}

  PERGUNTA:
  ${question}

  INSTRUÇÕES:
  - Use apenas informações contidas no contexto.
  - Se a resposta não puder ser encontrada no contexto, responda que não tem informações suficientes para responder.
  - Seja claro e direto na resposta.
  - Mantenha um tom educativo e profissional.
  - Cite trechos relevantes do contexto, se necessário, para apoiar sua resposta.
  - Se for citar o contexto, utilize o termo: "conteúdo da aula"
  `.trim()

  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: prompt
      }
    ]
  })

  if (!response.text) {
    throw new ClientError('Falha ao gerar a resposta pelo Gemini.')
  }

  return response.text
}