import { useState, ChangeEvent } from 'react'
import Head from 'next/head';
import { Sidebar } from '../../../components/sidebar'

import {
  Flex,
  Text,
  Heading,
  Button,
  useMediaQuery,
  Input
} from '@chakra-ui/react'

import Link from 'next/link'
import { FiChevronLeft } from 'react-icons/fi'
import Router from 'next/router';

import { canSSRAuth } from '../../../utils/canSSRAuth'
import { configurarClienteAPI } from '../../../services/api'

interface NewVeterinarioProps {
  assinatura: boolean;
  count: number;
}

export default function NewVeterinario({ assinatura, count }: NewVeterinarioProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");

  const [nome, setNome] = useState('')
  const [crmv, setCrmv] = useState('')

  async function processarCadastro(){
    
    if(nome === '' || crmv === ''){
      return;
    }


    try{

      const apiClient = configurarClienteAPI();
      await apiClient.post('/veterinario', {
        nome: nome,
        crmv: crmv,
      })

      Router.push("/veterinarios")

    }catch(err){
      console.log(err);
      alert("Erro ao cadastrar esse veterinario.")
    }

  }

  return (
    <>
      <Head>
        <title>veterinárioPRO - Cadastrar novo veterinário</title>
      </Head>

      <Sidebar>
        <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">

          <Flex
            direction={isMobile ? "column" : "row"}
            w="100%"
            align={isMobile ? "flex-start" : "center"}
            mb={isMobile ? 4 : 0}
          >
            <Link href="/veterinarios">
              <Button
                bg="#63a375" _hover={{ background: '#63a375' }}
                p={4}
                display="flex"
                alignItems="center"
                justifyItems="center"
                textAlign="center"
                mr={4}
                mb={4}
              >
                <FiChevronLeft size={24} color="#000000" />
                Voltar
              </Button>
            </Link>
            {/* <Heading
              color="#fff"
              mt={4}
              mb={4}
              mr={4}
              fontSize={isMobile ? "28px" : "3xl"}
            >
              Cadastrar novo veterinário
            </Heading> */}
          </Flex>

          <Flex
            maxW="700px"
            bg="veterinario.400"
            w="100%"
            align="center"
            justify="center"
            pt={8}
            pb={8}
            direction="column"
          >
            <Heading mb={4} fontSize={isMobile ? "22px" : "3xl"} color="white">Cadastrar novo veterinário</Heading>

            <Input
              placeholder="Nome do veterinário"
              size="lg"
              type="text"
              w="85%"
              color={"#FFF"}
              bg="veterinario.900"
              mb={3}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <Input
              placeholder="ex: CRMV-RN/1234"
              size="lg"
              type="text"
              w="85%"
              color={"#FFF"}
              bg="veterinario.900"
              mb={4}
              value={crmv}
              onChange={(e) => setCrmv(e.target.value)}
            />

            <Button
              w="85%"
              size="lg"
              color="gray.900"
              mb={6}
              bg="button.cta"
              _hover={{ bg: "#FFb13e" }}
              disabled={!assinatura && count >= 2}
              onClick={processarCadastro}
            >
              Cadastrar
            </Button>

            {!assinatura && count >= 2 && (
              <Flex direction="row" align="center" justifyContent="center">
                <Text>
                  Você atingiou seu limite de corte.
                </Text>
                <Link href="/planos">
                  <Text fontWeight="bold" color="#ffffff" cursor="pointer" ml={1}>
                    Seja premium
                  </Text>
                </Link>
              </Flex>
            )}


          </Flex>

        </Flex>
      </Sidebar>

    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try{
    const apiClient = configurarClienteAPI(ctx);

    const response = await apiClient.get('/servico/check')
    const count = await apiClient.get('/veterinario/count')

    return {
      props: {
        assinatura: response.data?.assinaturas?.status === 'active' ? true : false,
        count: count.data
      }
    }

  }catch(err){
    console.log(err);

    return{
      redirect:{
        destination: '/dashboard',
        permanent:false,
      }
    }
  }

})