import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo'
import { env } from '../env.ts'

export const brevo = (() => {
  const api = new TransactionalEmailsApi()

  api.setApiKey(TransactionalEmailsApiApiKeys.apiKey, env.BREVO_API_KEY)
  return api
})()
