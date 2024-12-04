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

import { FaUserMd } from 'react-icons/fa'
import { canSSRAuth } from '../../utils/canSSRAuth'
import { configurarClienteAPI } from '../../services/api'

interface VeterinariosItem {
  id: string;
  nome: string;
  crmv: number | string;
  status: boolean;
  usuario_id: string;
}

interface veterinariosProps {
  veterinarios: VeterinariosItem[];
}

export default function Veterinarios({ veterinarios }: veterinariosProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)")

  const [veterinarioList, setVeterinarioList] = useState<VeterinariosItem[]>(veterinarios || [])
  const [disableVeterinario, setDisableVeterinario] = useState("enabled")

  async function handleDisable(e: ChangeEvent<HTMLInputElement>) {
    const apiClient = configurarClienteAPI();

    if (e.target.value === 'disabled') {

      setDisableVeterinario("enabled")

      const response = await apiClient.get('/veterinarios', {
        params: {
          status: true
        }
      })

      setVeterinarioList(response.data);


    } else {

      setDisableVeterinario("disabled")
      const response = await apiClient.get('/veterinarios', {
        params: {
          status: false
        }
      })

      setVeterinarioList(response.data);


    }

  }

  return (
    <>
      <Head>
        <title>Veterinarios disponiveis - Minha clinica</title>
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
              Veterinários disponiveis
            </Heading>

            <Link href="/veterinarios/new">
              <Button bg="#63a375" _hover={{ background: '#63a375' }}>
                Cadastrar novo
              </Button>
            </Link>

            <Stack ml="auto" align="center" direction="row">
            <Text fontWeight="bold" color="#fff">
                {disableVeterinario === 'disabled' ? 'DESATIVADOS' : 'ATIVOS'}
              </Text>
              <Switch
                colorScheme="green"
                size="lg"
                value={disableVeterinario}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleDisable(e)}
                isChecked={disableVeterinario === 'disabled' ? false : true}
              />
            </Stack>

          </Flex>

          {veterinarioList.map(veterinario => (
          <Link key={veterinario.id} href={`/veterinarios/${veterinario.id}`} style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}> 
          <Flex
            cursor="pointer"
            w="45%"
            p={4}
            bg="veterinario.400"
            direction={isMobile ? "column" : "row"}
            align={isMobile ? "flex-start" : "center"}
            rounded="4"
            mb={2}
            justifyContent="space-between"
          >

            <Flex mb={isMobile ? 2 : 0} direction="row" alignItems="center" justifyContent="center" >
              <FaUserMd size={28} color="#000"/>
              <Text  fontWeight="bold" ml={4} noOfLines={2} color="#000">
                <Text mr={2} as="span" color="#000" fontWeight="bold">
                  Dr.
                </Text>
              {veterinario.nome} 
              </Text>
            </Flex>

            <Text fontWeight="bold" color="#000">
             {veterinario.crmv}
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
    const response = await apiClient.get('/veterinarios',
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
        veterinarios: response.data
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
