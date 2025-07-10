import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { env } from '../../env.ts'

type SendAuthenticationCodeTemplateProps = {
  email: string
  code: string
}

export function SendAuthenticationCodeTemplate(props: SendAuthenticationCodeTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Código de confirmação</Preview>

      <Tailwind>
        <Body className='bg-white my-auto mx-auto font-sans'>
          <Container className='border border-solid border-zinc-300 rounded-lg my-10 mx-auto p-5 w-md'>
            <Heading className='text-zinc-900 font-bold text-2xl text-center p-0 my-7 mx-0'>
              Código de confirmação
            </Heading>

            <Text className='text-zinc-700 text-sm leading-[24px] text-center mx-4'>
              Você solicitou um código para autenticação no {' '}
              <Link href={env.FRONTEND_URL} className="text-sky-500 no-underline">
                letmeask
              </Link>
              {' '} através do e-mail {props.email}
            </Text>

            <Section className='text-center my-8'>
              <span className='text-lg font-semibold no-underline text-center'>{props.code}</span>
            </Section>

            <Hr className='border border-solid border-zinc-500 my-6 mx-0 w-full' />

            <Text className='text-zinc-600 text-xs leading-[24px] ml-4'>
              O código é válido por 10 minutos.
            </Text>

            <Text className='text-[#666666] text-xs leading-[24px] ml-4'>
              Se você não solicitou esse código, apenas descarte este e-mail.
            </Text>
          </Container>
        </Body>
      </Tailwind>

    </Html>
  )
}