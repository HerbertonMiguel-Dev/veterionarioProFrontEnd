import Head from 'next/head';
import {
  Button,
  Flex,
  Heading,
  Text,
  useMediaQuery
} from '@chakra-ui/react'

import { Sidebar } from '../../components/sidebar'
import { canSSRAuth } from '../../utils/canSSRAuth'
import { configurarClienteAPI } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'

interface PlanosProps{
  premium: boolean;
  basic: boolean;
}

export default function Planos({ premium, basic }: PlanosProps){
  const [isMobile] = useMediaQuery('(max-width: 500px)')

  const processarAssinaturaPremiun = async () =>{
    if (premium){
       return;
    }

    try{
      const apiClient = configurarClienteAPI()
      const resposta = await apiClient.post('/assinatura/premiun')

       const { sessionId } = resposta.data;

       const stripe = await getStripeJs()
       await stripe.redirectToCheckout({sessionId: sessionId})

    }catch(err){
      console.log(err)
    }
  }

  const processarAssinaturaBasic = async () =>{
    if (basic){
       return;
    }

    try{
      const apiClient = configurarClienteAPI()
      const resposta = await apiClient.post('/assinatura/basic')

       const { sessionId } = resposta.data;

       const stripe = await getStripeJs()
       await stripe.redirectToCheckout({sessionId: sessionId})

    }catch(err){
      console.log(err)
    }
  }

  async function handleCreatePortalPremiun(){
    
    try{

      if(!premium){
        return;
      }

      const apiClient = configurarClienteAPI();
      const response = await apiClient.post("/create-portal")

      const { sessionId } = response.data;

      window.location.href = sessionId;

    }catch(err){
      console.log(err.message);
    }

  }

  async function handleCreatePortalBasic(){
    
    try{

      if(!basic){
        return;
      }

      const apiClient = configurarClienteAPI();
      const response = await apiClient.post("/create-portal")

      const { sessionId } = response.data;

      window.location.href = sessionId;

    }catch(err){
      console.log(err.message);
    }

  }

  return(
    <>
      <Head>
        <title>Veterinário Pro - Sua assinatura Premium</title>
      </Head>
      <Sidebar>
        <Flex w="100%" direction="column" align="flex-start" justify="flex-start">
          <Heading color="white" fontSize="3xl" mt={4} mb={4} mr={4}>
            Planos
          </Heading>
        </Flex>

        <Flex pb={8} maxW="1075px" w="100%" direction="column" align="flex-start" justify="flex-start">

          <Flex gap={4} w="100%" flexDirection={isMobile ? "column" : "row"}>
              <Flex rounded={4} p={2} flex={1} bg="veterinario.400" flexDirection="column">
                <Heading
                textAlign="center"
                fontSize="2xl"
                mt={2} mb={4}
                color="#ffb13e"
                >
                  Plano Grátis
                </Heading>

                <Text fontWeight="medium" ml={4} mb={2}>Registrar ate 30 consultas</Text>
                <Text fontWeight="medium" ml={4} mb={2}>Criar apenas 3 tipos de serviços.</Text>
                <Text fontWeight="medium" ml={4} mb={2}>Criar apenas 1 Veterinarios</Text>
                <Text fontWeight="medium" ml={4} mb={2}>Criar até 10 cadastros de Pet</Text>
                <Text fontWeight="medium" ml={4} mb={2}>Editar dados do perfil.</Text>
              </Flex> 

              <Flex rounded={4} p={2} flex={1} bg="veterinario.400" flexDirection="column">
                <Heading
                textAlign="center"
                fontSize="2xl"
                mt={2} mb={4}
                color="#0f0bf7"
                >
                  Plano Basic
                </Heading>

                <Text fontWeight="medium" ml={4} mb={2}>Registrar 60 consultas</Text>
                <Text fontWeight="medium" ml={4} mb={2}>Criar apenas 5 tipos de serviços.</Text>
                <Text fontWeight="medium" ml={4} mb={2}>Criar apenas 1 Veterinarios</Text>
                <Text fontWeight="medium" ml={4} mb={2}>Criar até 20 cadastros de Pet</Text>
                <Text fontWeight="medium" ml={4} mb={2}>Editar dados do perfil.</Text>
                <Flex flexDirection="column" justify={'flex-end'} h="100%">
                  <Text color="#0f0bf7" fontWeight="bold" fontSize="2xl" ml={4} mb={2}>R$ 99,90</Text>
                </Flex>
                

                
                <Flex flexDirection="column" justify={'flex-end'} h="100%">

                  <Button
                    bg={basic ? "transparent" : "button.cta"}
                    _hover={{ bg: "#ffb13e" }}
                    m={2}
                    color="white"
                    onClick={processarAssinaturaBasic}
                    disabled={basic}
                  >
                    {basic  ? (
                      "VOCÊ JÁ É BASIC"
                    ) : (
                      "VIRAR BASIC"
                    )}
                  </Button>
                  
                  {basic && (
                    <Button
                      m={2}
                      bg="white"
                      color="veterinario.900"
                      fontWeight="bold"
                      onClick={handleCreatePortalBasic}
                    >
                      ALTERAR ASSINATURA
                    </Button>
                  )}

                </Flex>
                
              
              </Flex>
              
               

              <Flex rounded={4} p={2} flex={1} bg="veterinario.400" flexDirection="column">
                <Heading
                textAlign="center"
                fontSize="2xl"
                mt={2} mb={4}
                color="#ffb13e"
                >
                  Premium
                </Heading>

                <Text fontWeight="medium" ml={4} mb={2}>Registrar consultas ilimitados.</Text>
                <Text fontWeight="medium" ml={4} mb={2}>Criar tipos de serviços ilimitados.</Text>
                <Text fontWeight="medium" ml={4} mb={2}>Criar cadastrados de Veterinarios ilimitados</Text>
                <Text fontWeight="medium" ml={4} mb={2}>Criar cadastros de Pet ilimitados.</Text>
                <Text fontWeight="medium" ml={4} mb={2}>Editar dados do perfil.</Text>
                <Text fontWeight="medium" ml={4} mb={2}>Receber todas atualizações.</Text>
                <Text fontWeight="medium" ml={4} mb={2}>Suporte ao usuario</Text>
                <Text color="#ffb13e" fontWeight="bold" fontSize="2xl" ml={4} mb={2}>R$ 149,49</Text>

                <Button
                  bg={premium ? "transparent" : "button.cta"}
                  _hover={{ bg: "#ffb13e" }}
                  m={2}
                  color="white"
                  onClick={processarAssinaturaPremiun}
                  disabled={premium}
                >
                  {premium ? (
                    "VOCÊ JÁ É PREMIUM"
                  ) : (
                    "VIRAR PREMIUM"
                  )}
                </Button>

                {premium && (
                  <Button
                    m={2}
                    bg="white"
                    color="veterinario.900"
                    fontWeight="bold"
                    onClick={handleCreatePortalPremiun}
                  >
                    ALTERAR ASSINATURA
                  </Button>
                )}

              </Flex> 


          </Flex>

        </Flex>
      </Sidebar>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

  try{

    const apiClient = configurarClienteAPI(ctx);
    const response = await apiClient.get("/me")

    return {
      props: {
        premium: response.data?.assinaturas?.status === 'active' ? true : false,
        basic: response.data?.assinaturas?.status === 'active' ? true : false
      }
    }

  }catch(err){
    console.log(err);

    return{
      redirect:{
        destination: '/dashboard',
        permanent: false,
      }
    }
  }

})