import { useState, ChangeEvent } from 'react';
import Head from 'next/head';
import {
  Flex,
  Text,
  Heading,
  Button,
  Stack,
  Switch,
  useMediaQuery,
  Center,
} from '@chakra-ui/react';
import Link from 'next/link';

import { FaPaw, } from 'react-icons/fa';

import  IconCombo  from '../../components/icon'

import { canSSRAuth } from '../../utils/canSSRAuth';
import { Sidebar } from '../../components/sidebar';
import { configurarClienteAPI } from '../../services/api';

interface ResponsavelItem {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
}

interface PetItem {
  id: string;
  nome: string;
  tipo: string;
  raca: string | null;
  idade: number | null;
  peso: number | null;
  responsaveis: ResponsavelItem[];
}

interface PetPros {
  pets: PetItem[];
  responsaveis: ResponsavelItem
}

export default function Pets({ pets, responsaveis }: PetPros) {
  const [isMobile] = useMediaQuery('(max-width: 500px)');
  const [petList, setPetList] = useState<PetItem[]>(pets || []);
  const [responsaveisList, setResponsaveisList] = useState<ResponsavelItem[]>(responsaveis ? [responsaveis] : []);
  const [disablePet, setDisablePet] = useState('enabled');

  async function handleDisable(e: ChangeEvent<HTMLInputElement>) {
    const apiClient = configurarClienteAPI();

    if (e.target.value === 'disabled') {
      setDisablePet('enabled');
      const response = await apiClient.get('/pets', { params: { cadastro: true } });
      setPetList(response.data);
    } else {
      setDisablePet('disabled');
      const response = await apiClient.get('/pets', { params: { cadastro: false } });
      setPetList(response.data);
    }
  }

  return (
    <>
      <Head>
        <title>Meus Pets - Minha Clínica</title>
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
              fontSize={isMobile ? '28px' : '3xl'}
              mt={4}
              mb={4}
              mr={4}
              color="#fff"
            >
              Meus Pets
            </Heading>
            <Link href="/pet/new">
              <Button bg="#63a375" _hover={{ background: '#63a375' }}>
                Cadastrar novo
              </Button>
            </Link>
            <Stack ml="auto" align="center" direction="row">
              <Text fontWeight="bold" color="#fff">
                {disablePet === 'disabled' ? 'DESATIVADOS' : 'ATIVOS'}
              </Text>
              <Switch
                colorScheme="green"
                size="lg"
                value={disablePet}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleDisable(e)}
                isChecked={disablePet === 'disabled' ? false : true}
              />
            </Stack>
          </Flex>
          {petList.map((pet) =>
            pet.responsaveis.map((responsavel) => (
              <Link
                key={`${pet.id}-${responsavel.id}`}
                href={`/pet/${pet.id}/${responsavel.id}`}
                style={{ width: '100%' }}
              >

                <Flex
                  cursor="pointer"
                  w="70%"
                  p={4}
                  bg="veterinario.400"
                  direction={isMobile ? 'column' : 'row'}
                  align={isMobile ? 'flex-start' : 'center'}
                  rounded="4"
                  mb={2}
                  justifyContent="flex-start"
                  
                >
                    <Flex mr={5}>
                      <FaPaw  size={20} color="#000" />
                    </Flex>
                  <Flex direction="column" mr={4}>
                    <Flex mr={40} direction="row" mb={isMobile ? 2 : 0} align="center" justify="center">
                      <Flex direction="column" w="100%">
                        <Text color="#fff" fontWeight="semibold">
                          <Text mr={2} as="span" color="#000" fontWeight="bold">
                            Nome:
                          </Text>
                          {pet.nome}
                        </Text>
                      </Flex>
                    </Flex>
                    <Text color="#fff" fontWeight="semibold">
                      <Text mr={2} as="span" color="#000" fontWeight="bold">
                        Espécie:
                      </Text>
                      {pet.tipo}
                    </Text>
                    <Text color="#fff" fontWeight="semibold">
                      <Text mr={2} as="span" color="#000" fontWeight="bold">
                        Raça:
                      </Text>
                      {pet.raca || 'Não especificada'}
                    </Text>
                    <Text color="#fff" fontWeight="semibold">
                      <Text mr={2} as="span" color="#000" fontWeight="bold">
                        Idade:
                      </Text>
                      {pet.idade
                        ? `${pet.idade} ${pet.idade > 1 ? 'anos' : 'ano'}`
                        : 'Idade não informada'}
                    </Text>
                    <Text color="#fff" fontWeight="semibold">
                      <Text mr={2} as="span" color="#000" fontWeight="bold">
                        Peso:
                      </Text>
                      {pet.peso ? `${pet.peso} Kg` : 'Idade não informada'}
                    </Text>

                  </Flex>
                    <Flex >
                      <IconCombo size={`${30}px`} />
                    </Flex>
                  <Flex direction="column" align="flex-start" >
                    <Text color="#fff" fontWeight="semibold">
                      <Text mr={2} as="span" color="#000" fontWeight="bold">
                        Responsável:
                      </Text>
                      {responsavel.nome}
                    </Text>
                    <Text color="#fff" fontWeight="semibold">
                      <Text mr={2} as="span" color="#000" fontWeight="bold">
                        Telefone:
                      </Text>
                      {responsavel.telefone}
                    </Text>
                    <Text color="#fff" fontWeight="semibold">
                      <Text mr={2} as="span" color="#000" fontWeight="bold">
                        Endereço:
                      </Text>
                      {responsavel.endereco}
                    </Text>
                  </Flex>

                </Flex>
              </Link>
            ))
          )}

        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = configurarClienteAPI(ctx);
    const response = await apiClient.get('/pets', { params: { cadastro: true } });

    if (!response.data) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      };
    }

    return {
      props: {
        pets: response.data,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }
});
