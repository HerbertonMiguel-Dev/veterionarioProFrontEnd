import { useContext, useState } from 'react'
import Head from 'next/head'
import {
  Flex,
  Text,
  Heading,
  Box,
  Input,
  Button
} from '@chakra-ui/react'
import { Sidebar } from '../../components/sidebar'

import Link from 'next/link'
import { canSSRAuth } from '../../utils/canSSRAuth'
import { AuthContext } from '../../context/AuthContext'
import { configurarClienteAPI } from '../../services/api'

interface UsuarioProps {
  id: string;
  nome: string;
  email: string;
  endereco: string | null;
}

interface ProfileProps {
  usuario: UsuarioProps;
  premium: boolean;
  basic: boolean;
}

export default function Profile({ usuario, premium, basic }: ProfileProps) {
  const { logoutUsuario } = useContext(AuthContext);

  const [nome, setNome] = useState(usuario && usuario?.nome)
  const [endereco, setEndereco] = useState(usuario?.endereco ? usuario?.endereco : '')

  async function processarLogout() {
    await logoutUsuario();
  }

  async function processarUpdateUsuario() {

    if (nome === '') {
      return;
    }

    try {
      const apiClient = configurarClienteAPI();
      await apiClient.put('/usuarios', {
        nome: nome,
        endereco: endereco,
      })

      alert("Dados alterados com sucesso!");

    } catch (err) {
      console.log(err);
    }

  }

  return (
    <>
      <Head>
        <title>Minha Conta - Veterinário PRO</title>
      </Head>
      <Sidebar>
        <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">

          <Flex w="100%" direction="row" alignItems="center" justifyContent="flex-start">
            <Heading fontSize="3xl" mt={4} mb={4} mr={4} color="#fff">Minha Conta</Heading>
          </Flex>

          <Flex pt={8} pb={8} background="veterinario.400" maxW="700px" w="100%" direction="column" alignItems="center" justifyContent="center" >
            <Flex direction="column" w="85%">
              <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                Nome da Clínica:
              </Text>
              <Input
                w="100%"
                background="veterinario.900"
                color={"#FFF"}
                placeholder="Nome da sua clínica"
                size="lg"
                type="text"
                mb={3}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                Endereço:
              </Text>
              <Input
                w="100%"
                background="veterinario.900"
                color={"#FFF"}
                placeholder="Endereço da clínica"
                size="lg"
                type="text"
                mb={3}
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />

              <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                Plano atual:
              </Text>

              <Flex
                direction="row"
                w="100%"
                mb={3}
                p={1}
                borderWidth={1}
                rounded={6}
                background="veterinario.900"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text p={2} fontSize="lg" color={premium ? "#FBA931" : basic ? "#0f0bf7" : "#4dffb4"}>
                  Plano {premium ? "Premium" : basic ? "Basic" : "Grátis"}
                </Text>

                <Link href="/planos">
                  <Box
                    cursor="pointer"
                    p={1} pl={2} pr={2}
                    background="#00cd52"
                    rounded={4}
                    color="white"
                  >
                    Mudar plano
                  </Box>
                </Link>

              </Flex>

              <Button
                w="100%"
                mt={3}
                mb={4}
                bg="button.cta"
                size="lg"
                _hover={{ bg: '#63f88d' }}
                onClick={processarUpdateUsuario}
              >
                Salvar
              </Button>

              <Button
                w="100%"
                mb={6}
                bg="transparent"
                borderWidth={2}
                borderColor="red.500"
                color="red.500"
                size="lg"
                _hover={{ bg: 'transparent' }}
                onClick={processarLogout}
              >
                Sair da conta
              </Button>

            </Flex>
          </Flex>

        </Flex>
      </Sidebar>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

  try {
    const apiClient = configurarClienteAPI(ctx)
    // Obtendo informações da assinatura
    const response = await apiClient.get('/servico/check');
    const assinatura = response.data?.assinaturas;

    const resposta = await apiClient.get('/me')

    const usuario = {
      id: resposta.data.id,
      nome: resposta.data.nome,
      email: resposta.data.email,
      endereco: resposta.data?.endereco
    }

    // Definindo planos
    let premium = false;
    let basic = false;

    // Lógica para verificar os planos
    if (assinatura?.status === 'active') {
      if (assinatura?.precoId === 'price_1QLXqSCvip3ZmFCDzUwEJkMA') {
        premium = true;
      } else if (assinatura?.precoId === 'price_1QS3QUCvip3ZmFCDJhr1m4RF') {
        basic = true;
      }
    }

    return {
      props: {
        usuario,
        premium,
        basic,
      }
    }


  } catch (err) {
    console.log(err);

    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      }
    }
  }

})


