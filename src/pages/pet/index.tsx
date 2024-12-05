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
  Input,
  IconButton,
  Center,
} from '@chakra-ui/react';
import Link from 'next/link';

import { FaPaw, FaSearch } from 'react-icons/fa';

import IconCombo from '../../components/icon';

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
  responsaveis: ResponsavelItem;
}

export default function Pets({ pets, responsaveis }: PetPros) {
  const [isMobile] = useMediaQuery('(max-width: 500px)');
  const [petList, setPetList] = useState<PetItem[]>(pets || []);
  const [responsaveisList, setResponsaveisList] = useState<ResponsavelItem[]>(responsaveis ? [responsaveis] : []);
  const [disablePet, setDisablePet] = useState('enabled');
  const [searchPhone, setSearchPhone] = useState('');
  const [filteredPets, setFilteredPets] = useState<PetItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  const [showList, setShowList] = useState(true);

  const toggleListVisibility = (e: ChangeEvent<HTMLInputElement>) => {
    setShowList(e.target.checked);
  };


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

  const handleSearch = async () => {
    if (!searchPhone) {
      alert('Por favor, insira o telefone do responsável para buscar.');
      return;
    }

    setLoading(true);

    try {
      const apiClient = configurarClienteAPI();
      const response = await apiClient.get(`/pets/search?telefone=${searchPhone}`);
      setFilteredPets(response.data);
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
      alert('Não foi possível buscar os pets. Verifique o número e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Meus Pets - Minha Clínica</title>
      </Head>
      <Sidebar>
        <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
          {/* Cabeçalho */}
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
            <Stack ml="auto" align="center" direction="column" spacing={4}>
              {/* Primeiro Switch */}
              <Flex align="center">
                <Text fontWeight="bold" color="#fff" mr={4}>
                  {disablePet === 'disabled' ? 'DESATIVADOS' : 'ATIVOS'}
                </Text>
                <Switch
                  colorScheme="green"
                  size="lg"
                  value={disablePet}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleDisable(e)}
                  isChecked={disablePet === 'disabled' ? false : true}
                />
              </Flex>

              {/* Segundo Switch */}
              <Flex align="center">
                <Text fontWeight="bold" color="#fff" mr={4}>
                  {showList ? 'Ocultar Pets' : 'Mostrar Pets'}
                </Text>
                <Switch
                  colorScheme="green"
                  size="lg"
                  isChecked={showList}
                  onChange={toggleListVisibility}
                />
              </Flex>
            </Stack>

          </Flex>

          {/* Área de busca */}
          <Flex
            direction={isMobile ? 'column' : 'row'}
            w="40%"
            align="center"
            bg="veterinario.400"
            p={2}
            borderRadius="md"
            mb={2}
          >
            <Input
              placeholder="Telefone do responsável"
              size="lg"
              type="text"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              bg="veterinario.900"
              color="#fff"
              mr={isMobile ? 0 : 4}
              mb={isMobile ? 4 : 0}
            />
            <IconButton
              aria-label="Buscar"
              icon={<FaSearch />}
              size="lg"
              bg="button.cta"
              _hover={{ bg: '#FFb13e' }}
              onClick={handleSearch}
              isLoading={loading}
            />
          </Flex>

          {/* Lista de pets */}
          {(showList || filteredPets) && (
            <>
              {(filteredPets || petList).map((pet) =>
                pet.responsaveis.map((responsavel) => (
                  <Link
                    key={`${pet.id}-${responsavel.id}`}
                    href={`/pet/${pet.id}/${responsavel.id}`}
                    style={{ width: '100%' }}
                  >
                    <Flex
                      cursor="pointer"
                      w="50%"
                      p={4}
                      bg="veterinario.400"
                      direction={isMobile ? 'column' : 'row'}
                      align={isMobile ? 'flex-start' : 'center'}
                      rounded="4"
                      mb={2}
                      justifyContent="flex-start"
                    >
                      <Flex mr={5}>
                        <FaPaw size={20} color="#000" />
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
                      <Flex>
                        <IconCombo size={`${30}px`} />
                      </Flex>
                      <Flex direction="column" align="flex-start">
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
              </>
          )}
            </Flex >
      </Sidebar >
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
``
