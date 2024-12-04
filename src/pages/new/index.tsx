import { useState, ChangeEvent } from 'react'
import Head from "next/head"
import { Sidebar } from "../../components/sidebar"

import {
  Flex,
  Heading,
  Text,
  Button,
  IconButton,
  useMediaQuery,
  Input,
  Spinner,
  Select
} from '@chakra-ui/react'

import { FaSearch, FaPaw, FaTimes } from 'react-icons/fa';

import { canSSRAuth } from "../../utils/canSSRAuth";
import { configurarClienteAPI } from "../../services/api";

import { useRouter } from "next/router";

interface VeterinarioPros {
  id: string;
  nome: string;
  crmv: number | string;
  status: boolean;
  usuario_id: string;
}


interface ServicoPros {
  id: string;
  nome: string;
  preco: string | number;
  status: boolean;
  usuario_id: string;
}


interface Responsavel {
  id: string;
  nome: string;
  telefone: string; // ou outro tipo dependendo do seu modelo
  endereco: string
  usuario_id: string;
}

interface Pet {
  id: string;
  nome: string;
  tipo: string;
  raca: string | null;
  idade: number | null;
  peso: number | null;
  usuario_id: string;
  responsaveis: Responsavel[];

}
interface NewServicoPros {
  veterinarios: VeterinarioPros[]
  servicos: ServicoPros[]

}



export default function New({ servicos, veterinarios }: NewServicoPros) {

  const [isMobile] = useMediaQuery('(max-width: 500px)');

  const [veterinarioSelecionado, setVeterinarioSelecionado] = useState<VeterinarioPros | null>(veterinarios.length > 0 ? veterinarios[0] : null);
  const [servicoSelecionado, setServicoSelecionado] = useState<ServicoPros | null>(servicos.length > 0 ? servicos[0] : null);
  const [searchPhone, setSearchPhone] = useState('');
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [visiblePets, setVisiblePets] = useState<Pet[]>([]);

  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState('')
  const [raca, setRaca] = useState('')
  const [idade, setIdade] = useState('')
  const [peso, setPeso] = useState('')
  const [petId, setPetId] = useState<string | null>(null);
  const [responsavelId, setResponsavelId] = useState<string | null>(null);
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");


  const handleSearch = async () => {
    if (!searchPhone) {
      alert('Por favor, insira o telefone do responsável para buscar.');
      return;
    }

    setLoading(true);

    try {
      const apiClient = configurarClienteAPI();
      const response = await apiClient.get(`/pets/search?telefone=${searchPhone}`);
      setPets(response.data);
      setVisiblePets(response.data);
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
      alert('Não foi possível buscar os pets. Verifique o número e tente novamente.');
    } finally {
      setLoading(false);
    }

  }

  const handleSelectPet = (pet: Pet) => {
    // Preenchendo as informações do pet nos inputs
    setNome(pet.nome);
    setTipo(pet.tipo);
    setRaca(pet.raca || '');  // Se não houver raça, define um valor vazio
    setIdade(pet.idade ? pet.idade.toString() : '');  // Converte idade para string, se existir
    setPeso(pet.peso ? pet.peso.toString() : '');  // Converte peso para string, se existir

    // Preenchendo as informações do responsável
    const responsavel = pet.responsaveis[0]; // Pegando o primeiro responsável (caso haja mais de um, isso pode ser ajustado)
    setNomeResponsavel(responsavel.nome);
    setTelefone(responsavel.telefone);
    setEndereco(responsavel.endereco);

    // Armazenando os IDs
    setPetId(pet.id);  // Armazena o id do pet
    setResponsavelId(responsavel.id);  // Armazena o id do responsável
  };


  const router = useRouter();

  function handleChangeSelectVeterinario(idVeterinario: string) {
    const veterinarioItem = veterinarios.find((itemVeterinario) => itemVeterinario.id === idVeterinario);
    setVeterinarioSelecionado(veterinarioItem);
  }

  function handleChangeSelect(id: string) {
    const servicoItem = servicos.find((item) => item.id === id);
    setServicoSelecionado(servicoItem);
  }

  async function processarRegistro() {
    try {
      const apiClient = configurarClienteAPI();
      await apiClient.post('/consulta', {
        servico_id: servicoSelecionado.id,
        veterinario_id: veterinarioSelecionado.id,
        pet_id: petId,
        responsavel_id: responsavelId,
      })

      router.push("/dashboard");

    } catch (err) {
      console.log(err);
      alert("Erro ao registrar!");

    }

  }

  return (
    <>
      <Head>
        <title>veterinárioPro - Novo agendamento</title>
      </Head>
      <Sidebar>
        <Flex direction="column" align="flex-start" justify="flex-start" >
          <Flex direction="row" w="100%" align="center" justify="flex-start">
            <Heading fontSize="3xl" color={"white"} mt={4} mb={4} mr={4}>
              Nova consulta
            </Heading>
          </Flex>

          <Flex
            maxW="900px"
            pt={8}
            pb={8}
            width="100%"
            direction="column"
            align="center"
            justify="center"
            bg="veterinario.400"
          >
            {/* Área de busca */}
            <Flex
              direction={isMobile ? 'column' : 'row'}
              w="90%"
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
              />
            </Flex>

            <Flex
              w="90%"
              direction="row"
              justify="space-between"
              align="flex-start"
              mb={4}
            >

              {/* Coluna: Informações do Pet */}
              <Flex direction="column" w="50%">
                <Heading mb={2} fontSize={isMobile ? "22px" : "2xl"} color="white">Informações do Pet</Heading>
                <Input
                  placeholder="Nome do Pet"
                  size="lg"
                  type="text"
                  w="90%"
                  color={"#FFF"}
                  bg="veterinario.900"
                  mb={3}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />

                <Input
                  placeholder="Espécie ex: cão, felino, ave..."
                  size="lg"
                  type="text"
                  w="90%"
                  color={"#FFF"}
                  bg="veterinario.900"
                  mb={3}
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                />

                <Input
                  placeholder="Raça ex: Golden Retrieve, Chihuahua, Chow Chow"
                  size="lg"
                  type="text"
                  w="90%"
                  color={"#FFF"}
                  bg="veterinario.900"
                  mb={3}
                  value={raca}
                  onChange={(e) => setRaca(e.target.value)}
                />

                <Input
                  placeholder="Idade em Anos"
                  size="lg"
                  type="number"
                  w="90%"
                  color={"#FFF"}
                  bg="veterinario.900"
                  mb={3}
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                />

                <Input
                  placeholder="Peso (em kg, opcional)"
                  size="lg"
                  type="number"
                  w="90%"
                  color={"#FFF"}
                  bg="veterinario.900"
                  mb={3}
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                />

              </Flex>

              <Flex direction="column" w="50%">
                <Heading mb={2} fontSize={isMobile ? "22px" : "2xl"} color="white">Responsável</Heading>

                <Input
                  placeholder="Nome do responsável"
                  size="lg"
                  type="text"
                  w="95%"
                  color={"#FFF"}
                  bg="veterinario.900"
                  mb={3}
                  value={nomeResponsavel}
                  onChange={(e) => setNomeResponsavel(e.target.value)}
                />

                <Input
                  placeholder="telefone"
                  size="lg"
                  type="text"
                  w="95%"
                  color={"#FFF"}
                  bg="veterinario.900"
                  mb={3}
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />

                <Input
                  placeholder="endereco"
                  size="lg"
                  type="text"
                  w="95%"
                  color={"#FFF"}
                  bg="veterinario.900"
                  mb={3}
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />

                  <Select bg="veterinario.900" mb={3} size="lg" w="95%" onChange={(e) => handleChangeSelectVeterinario(e.target.value)}>
                    {veterinarios?.map((itemVeterinario) => (
                      <option key={itemVeterinario.id} value={itemVeterinario.id}>{itemVeterinario?.nome}</option>
                    ))}
                  </Select>

                  <Select bg="veterinario.900" mb={3} size="lg" w="95%" onChange={(e) => handleChangeSelect(e.target.value)}>
                    {servicos?.map((item) => (
                      <option key={item.id} value={item.id}>{item?.nome}</option>
                    ))}
                  </Select>

              </Flex>
            </Flex>

            <Button
              w="85%"
              size="lg"
              color="gray.900"
              bg="button.cta"
              _hover={{ bg: '#FFb13e' }}
              onClick={processarRegistro}
            >
              Cadastrar
            </Button>
          </Flex>

          {/* Resultados */}
          <Flex direction="column" w="68%" mt={4}>
            {loading ? (
              <Spinner size="xl" color="#63a375" alignSelf="center" />
            ) : pets.length > 0 ? (
              pets.map((pet) => (
                <Flex
                  cursor="pointer"
                  w="80%"
                  key={pet.id}
                  bg="veterinario.400"
                  p={4}
                  borderRadius="md"
                  mb={4}
                  justify="space-between"
                  align="center"
                  onClick={() => handleSelectPet(pet)}

                >
                  <Flex direction="column" mr={4}>
                    <Text color="#fff" fontWeight="bold">
                      {pet.nome} ({pet.tipo})
                    </Text>
                    <Text color="#fff" fontWeight="bold">Raça: {pet.raca || 'Raça não especificada'}</Text>
                    <Text color="#fff">{pet.idade ? `${pet.idade} anos` : 'Idade não informada'}</Text>
                  </Flex>

                  {/* Informações do responsável */}

                  <Flex direction="column" align="flex-end">
                    {pet.responsaveis.map((responsavel) => (
                      <Flex key={responsavel.id} direction="column" align="flex-end">
                        <Text color="#fff" fontWeight="bold">
                          Responsável: {responsavel.nome}
                        </Text>
                        <Text color="#fff">
                          Telefone: {responsavel.telefone}
                        </Text>
                        <Text color="#fff">
                          Endereço: {responsavel.endereco}
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                </Flex>

              ))
            ) : (
              <Text color="#fff" align="center" mt={4}>
                Nenhum pet encontrado para o telefone informado.
              </Text>
            )}

          </Flex>
        </Flex>
      </Sidebar>


    </>
  )

}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = configurarClienteAPI(ctx);
    const response = await apiClient.get("/servicos", {
      params: {
        status: true,
      },
    });

    const responseVeterinario = await apiClient.get("/veterinarios", {
      params: {
        status: true,
      },
    });



    if (response.data === null && responseVeterinario.data === null) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    return {
      props: {
        servicos: response.data,
        veterinarios: responseVeterinario.data,
      },
    };



  } catch (err) {
    console.log(err)
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    }

  }
})