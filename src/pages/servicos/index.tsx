import { useState, ChangeEvent } from 'react'

import Head from 'next/head';
import { Sidebar } from '../../components/sidebar'
import {
  Flex,
  Text,
  Heading,
  Button,
  Stack,
  Switch,
  useMediaQuery
} from '@chakra-ui/react'

import Link from 'next/link';

import { IoMdPricetag } from 'react-icons/io'
import { canSSRAuth } from '../../utils/canSSRAuth'
import { configurarClienteAPI } from '../../services/api'

interface ServicosItem {
  id: string;
  nome: string;
  preco: number | string;
  status: boolean;
  usuario_id: string;
}

interface servicosProps {
  servicos: ServicosItem[];
}

export default function Servicos({ servicos }: servicosProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)")

  const [servicoList, setServicoList] = useState<ServicosItem[]>(servicos || [])
  const [disableConsulta, setDisableServico] = useState("enabled")

  async function handleDisable(e: ChangeEvent<HTMLInputElement>){
    const apiClient = configurarClienteAPI();
    
    if(e.target.value === 'disabled'){

      setDisableServico("enabled")
      
      const response = await apiClient.get('/servicos', {
        params:{
          status: true
        }
      })

      setServicoList(response.data);


    }else{

      setDisableServico("disabled")
      const response = await apiClient.get('/servicos', {
        params:{
          status: false
        }
      })

      setServicoList(response.data);


    }

  }

  return(
    <>
      <Head>
        <title>Tipos de Serviços - Minha clinica</title>
      </Head>
      <Sidebar>
        <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
          <Flex
            direction={isMobile ? 'column' : 'row'}
            w="100%"
            alignItems={isMobile ? 'flex-start' : 'center'}
            justifyContent="flex-start"
            mb={0}
          >
            <Heading
              fontSize={isMobile ? '28px' : "3xl"} 
              mt={4} 
              mb={4}
              mr={4}
              color="#fff"
            >
              Tipos de Serviços
            </Heading>

            <Link href="/servicos/new">
              <Button bg="#63a375" _hover={{ background: '#63a375' }}>
                Cadastrar novo
              </Button>
            </Link>

            <Stack ml="auto" align="center" direction="row">
            <Text fontWeight="bold" color="#fff">
                {disableConsulta === 'disabled' ? 'DESATIVADOS' : 'ATIVOS'}
              </Text>
            <Switch
              colorScheme="green"
              size="lg"
              value={disableConsulta}
              onChange={ (e: ChangeEvent<HTMLInputElement>) => handleDisable(e) }
              isChecked={disableConsulta === 'disabled' ? false : true}
            />
          </Stack>

          </Flex>

          {servicoList.map(servico => (
          <Link key={servico.id} href={`/servicos/${servico.id}`} style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}> 
          <Flex
            cursor="pointer"
            w="50%"
            p={4}
            bg="veterinario.400"
            direction={isMobile ? "column" : "row"}
            align={isMobile ? "flex-start" : "center"}
            rounded="4"
            mb={2}
            justifyContent="space-between"
          >

            <Flex mb={isMobile ? 2 : 0} direction="row" alignItems="center" justifyContent="center" >
              <IoMdPricetag size={28} color="#fba931"/>
              <Text fontWeight="bold" ml={4} noOfLines={2} color="#000">
              {servico.nome} 
              </Text>
            </Flex>

            <Text fontWeight="bold" color="#000">
            Preço: R$ {servico.preco}
            </Text>

          </Flex>
         </Link>
         ))}
         
        </Flex>
      </Sidebar>
    </>
    
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

  try{

    const apiClient = configurarClienteAPI(ctx);
    const response = await apiClient.get('/servicos',
    {
      params:{
        status: true,
      }
    })


    if(response.data === null){
      return{
        redirect:{
          destination: '/dashboard',
          permanent: false,
        }
      }
    }


    return{
      props: {
        servicos: response.data
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
