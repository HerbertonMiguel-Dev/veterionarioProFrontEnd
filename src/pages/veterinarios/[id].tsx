import { useState, ChangeEvent } from 'react'
import Head from 'next/head';
import {
  Flex,
  Text,
  Heading,
  Button,
  useMediaQuery,
  Input,
  Stack,
  Switch
} from '@chakra-ui/react'

import { Sidebar } from '../../components/sidebar'
import { FiChevronLeft } from 'react-icons/fi'
import Link from 'next/link'

import { canSSRAuth } from '../../utils/canSSRAuth'
import { configurarClienteAPI } from '../../services/api'

interface VeterinarioProps{
  id: string;
  nome: string;
  crmv: string ;
  status: boolean;
  usuario_id: string;
}

interface AssinaturaProps{
  id: string;
  status: string;
}

interface EditarVeterinarioProps{
    veterinario: VeterinarioProps;
    assinatura: AssinaturaProps | null;
}

export default function EditarVeterinario({ assinatura, veterinario }: EditarVeterinarioProps){
  const [isMobile] = useMediaQuery("(max-width: 500px)")

  const [nome, setNome] = useState(veterinario?.nome)
  const [crmv, setCrmv] = useState(veterinario?.crmv)
  const [status, setStatus] = useState(veterinario?.status)

  const [disableVeterinario, setDisableVeterinario] = useState(veterinario?.status ? "disabled" : "enabled" )

  function handleChangeStatus(e: ChangeEvent<HTMLInputElement>){
    if(e.target.value === 'disabled'){
      setDisableVeterinario("enabled")
      setStatus(false);
    }else{
      setDisableVeterinario("disabled");
      setStatus(true);
    }  
  }

  async function handleUpdate(){
    if(nome === '' || crmv === ''){
      return;
    }

    try{

      const apiClient = configurarClienteAPI();
      await apiClient.put('/veterinario', {
        nome: nome,
        crmv: crmv,
        status: status,
        veterinario_id: veterinario?.id
      })

      alert("veterinario atualizado com sucesso!")


    }catch(err){
      console.log(err);
    }

  }

  return(
    <>
      <Head>
        <title>Editar tipo de veterinario - veterinárioPRO</title>
      </Head>
      <Sidebar>
        <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">

          <Flex 
            direction={isMobile ? "column" : "row"}
            w="100%"
            alignItems={isMobile ? "flex-start" : "center" }
            justifyContent="flex-start"
            mb={isMobile ? 4 : 0}
          >
            <Link href="/veterinarios">
              <Button bg="#63a375" _hover={{ background: '#63a375' }} mr={3} p={4} display="flex" alignItems="center" justifyContent="center">
                <FiChevronLeft size={24} color="#000"/>
                Voltar
              </Button>
            </Link>

            <Heading fontSize={isMobile ? "22px" : "3xl"} color="white">
              Editar veterinario
            </Heading>
          </Flex>

          <Flex mt={4} maxW="700px" pt={8} pb={8} w="100%" bg="veterinario.400" direction="column" align="center" justify="center">
            <Heading fontSize={isMobile ? "22px" : "3xl"} mb={4} color="white">Editar veterinario</Heading>

            <Flex w="85%" direction="column">
              <Input
                placeholder="Nome do veterinario"
                bg="veterinario.900"
                color={"#FFF"}
                mb={3}
                size="lg"
                type="text"
                w="100%"
                value={nome}
                onChange={ (e) => setNome(e.target.value)}
              />

              <Input
                placeholder="ex: CRMV-RN/12345"
                bg="veterinario.900"
                color={"#FFF"}
                mb={3}
                size="lg"
                type="text"
                w="100%"
                value={crmv}
                onChange={ (e) => setCrmv(e.target.value)}
              />

              <Stack mb={6} align="center" direction="row">
              <Text fontSize={20} fontWeight="bold" color="white">
              {disableVeterinario === 'disabled' ? 'Veterinário ativo' : 'Veterinário desativado'}
              </Text>
                {/* <Text fontWeight="bold" color="white">Veterinário ativo</Text> */}
                <Switch
                  size="lg"
                  colorScheme="red"
                  value={disableVeterinario}
                  isChecked={disableVeterinario === 'disabled' ? false : true}
                  onChange={ (e: ChangeEvent<HTMLInputElement>) => handleChangeStatus(e) }
                />
              </Stack>

              <Button
                mb={6}
                w="100%"
                bg="button.cta"
                color="gray.900"
                _hover={{ bg: "#FFb13e" }}
                disabled={assinatura?.status !== 'active'}
                onClick={handleUpdate}
              >
                Salvar
              </Button>

              { assinatura?.status !== 'active' && (
                <Flex direction="row" align="center" justify="center">
                  <Link href="/planos">
                    <Text cursor="pointer" fontWeight="bold" mr={1} color="#31fb6a">
                      Seja premium
                    </Text>
                  </Link>
                  <Text>
                    e tenha todos acessos liberados.
                  </Text>
                </Flex>
              )}

            </Flex>

          </Flex>


        </Flex>
      </Sidebar>
    </>
  )
}


export const getServerSideProps = canSSRAuth(async (ctx) => {
  const { id } = ctx.params;

  try{
    const apiClient = configurarClienteAPI(ctx);

    const check = await apiClient.get('/servico/check');

    const response = await apiClient.get('/veterinario/detail', {
      params:{
        veterinario_id: id,
      }
    })

    
    return{
      props:{
        veterinario: response.data,
        assinatura: check.data?.assinaturas
      }
    }


  }catch(err){
    console.log(err);

    return{
      redirect:{
        destination: '/veterinarios',
        permanent: false,
      }
    }
  }

})