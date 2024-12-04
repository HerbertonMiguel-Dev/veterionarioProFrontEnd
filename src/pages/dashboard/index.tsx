import { useState } from 'react'
import Head from 'next/head';

import {
  Flex,
  Text,
  Heading,
  Button,
  Link as ChakraLink,
  useMediaQuery,
  useDisclosure
} from '@chakra-ui/react';

import Link from 'next/link'
import { FaPaw, FaUserMd } from 'react-icons/fa';

import IconCombo from '../../components/icon'

import { canSSRAuth } from '../../utils/canSSRAuth'
import { Sidebar } from '../../components/sidebar'
import { configurarClienteAPI } from '../../services/api'
import { ModalInfo } from '../../components/modal'

export interface ConsultaItem {
  id: string;
  servico: {
    id: string;
    nome: string;
    preco: string | number;
    usuario_id: string
  },
  veterinario: {
    id: string;
    nome: string;
    crmv: number | string;
    usuario_id: string
  },
  responsavel: {
    id: string;
    nome: string;
    telefone: string | number;
    endereco: string;
    usuario_id: string
  },
  pet: {
    id: string;
    nome: string;
    tipo: string;
    raca: string | null;
    idade: number | null;
    peso: number | null;
    usuario_id: string;
  }

}

interface DashboardProps {
  consulta: ConsultaItem[]
}

export default function Dashboard({ consulta }: DashboardProps) {

  const [lista, setLista] = useState(consulta)
  const [service, setService] = useState<ConsultaItem>()
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isMobile] = useMediaQuery("(max-width: 500px)")

  function handleOpenModal(item: ConsultaItem ){
    setService(item);
    onOpen();
  }

  async function handleFinish(id: string){
    try{
      const apiClient = configurarClienteAPI();
      await apiClient.delete('/consulta/delete', {
        params:{
          agendamento_id: id
        }
      })


      const filterItem = lista.filter(item => {
        return (item?.id !== id)
      })

      setLista(filterItem)
      onClose();

    }catch(err){
      console.log(err);
      onClose();
      alert("Erro ao finalizar este serviço")
    }
  }


  return (
    <>
      <Head>
        <title>veterinário - Minha Clinica</title>
      </Head>
      <Sidebar>
        <Flex direction="column" align="flex-start" justify="flex-start">
          <Flex w="100%" direction="row" align="center" justify="flex-start">
            <Heading color="#fff" fontSize="3xl" mt={4} mb={4} mr={4}>
              Agenda
            </Heading>

            <Link href="/new">
              <Button bg="#63a375" _hover={{ background: '#63a375' }}>Registrar</Button>
            </Link>
          </Flex>



          {lista.map(item => (
            <ChakraLink
              onClick={ () => handleOpenModal(item) }
              key={item?.id}
              w="100%"
              m={0}
              p={0}
              mt={1}
              bg="transparent"
              style={{ textDecoration: 'none' }}
            >
              <Flex
                w="75%"
                direction={isMobile ? "column" : "row"}
                p={4}
                rounded={4}
                mb={4}
                bg="veterinario.400"
                justify="space-between"
                align={isMobile ? "flex-start" : "center"}
              >
                <Flex direction="row" mb={isMobile ? 2 : 0} align="center" justify="center">
                  <FaPaw size={28} color="#000" />
                  <Flex direction="column" w="100%">
                    <Text fontWeight="bold" ml={4} noOfLines={1}>Nome: {item?.pet?.nome}</Text>
                    <Text fontWeight="bold" ml={4} noOfLines={1}>Espécie: {item?.pet?.tipo}</Text>
                    <Text fontWeight="bold" ml={4} noOfLines={1}>Raça: {item?.pet?.raca}</Text>
                    <Text fontWeight="bold" ml={4} noOfLines={1}>Idade: {item?.pet?.idade}</Text>
                    <Text fontWeight="bold" ml={4} noOfLines={1}>Peso: {item?.pet?.peso}Kg</Text>
                  </Flex>
                </Flex>

                <Flex direction="row" mb={isMobile ? 2 : 0} align="center" justify="center">
                  <Flex justify="center">
                    <IconCombo size={`${30}px`} color="#000" />
                  </Flex>

                  <Flex direction="column" w="100%">
                    <Text fontWeight="bold" ml={4} noOfLines={1}>Responsavel: {item?.responsavel?.nome}</Text>
                    <Text fontWeight="bold" ml={4} noOfLines={1}>Telefone: {item?.responsavel?.telefone}</Text>
                    <Text fontWeight="bold" ml={4} noOfLines={1}>Endereço: {item?.responsavel?.endereco}</Text>
                  </Flex>
                </Flex>

                <Flex direction="row" mb={isMobile ? 2 : 0} align="center" justify="center">
                  <FaUserMd size={28} color="#000" />
                  <Flex ml={5} direction="column" w="100%">
                    <Text fontWeight="bold" mr={4} mb={isMobile ? 2 : 0}>Veterinário:{item?.veterinario?.nome}</Text>
                    <Text fontWeight="bold" mb={isMobile ? 2 : 0}>CRMV: {item?.veterinario?.crmv}</Text>
                  </Flex>
                </Flex>

                <Flex direction="row" mb={isMobile ? 2 : 0} align="center" justify="center">
                  <Flex direction="column" w="100%">
                    <Text fontWeight="bold" mr={4} mb={isMobile ? 2 : 0}>Serviço: {item?.servico?.nome}</Text>
                    <Text fontWeight="bold" mb={isMobile ? 2 : 0}>Preco R$: {item?.servico?.preco}</Text>
                  </Flex>
                </Flex>
              </Flex>
            </ChakraLink>


          ))}
        </Flex>
      </Sidebar>

      <ModalInfo
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        data={service}
        finishService={ () => handleFinish(service?.id) }
      />
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

  try {
    const apiClient = configurarClienteAPI(ctx);
    const response = await apiClient.get("/consultas")

    return {
      props: {
        consulta: response.data,
      }
    }
  } catch (err) {
    console.log(err);
    return {
      props: {
        consulta: []
      }
    }
  }

})