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
  Input
} from '@chakra-ui/react';
import { Sidebar } from '../../../components/sidebar';
import { FiChevronLeft } from 'react-icons/fi';
import Link from 'next/link';
import { canSSRAuth } from '../../../utils/canSSRAuth';
import { configurarClienteAPI } from '../../../services/api';
import Router from 'next/router';

interface ResponsavelProps {
  id: string;
  nome: string;
  telefone: string | number;
  endereco: string;
  cadastro: boolean;
  usuario_id: string;
}

interface PetProps {
  id: string;
  nome: string;
  tipo: string;
  raca: string | null;
  idade: number | null;
  peso: number | null;
  cadastro: boolean;
  responsavel: ResponsavelProps;
  usuario_id: string;
}

interface AssinaturaProps {
  id: string;
  status: string;
}

interface EditarPetProps {
  pet: PetProps;
  responsavel: ResponsavelProps;
  assinatura: AssinaturaProps | null;
}

export default function EditarPet({ pet, responsavel, assinatura }: EditarPetProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");

  // Dados do Pet
  const [nomePet, setNomePet] = useState(pet?.nome || '');
  const [tipo, setTipo] = useState(pet?.tipo || '');
  const [raca, setRaca] = useState(pet?.raca || '');
  const [idade, setIdade] = useState(pet?.idade?.toString() || '');
  const [peso, setPeso] = useState(pet?.peso?.toString() || '');

  // Dados do Responsável
  const [nomeResponsavel, setNomeResponsavel] = useState(responsavel.nome || '');
  const [telefone, setTelefone] = useState(responsavel.telefone || '');
  const [endereco, setEndereco] = useState(responsavel.endereco || '');

  const [status, setStatus] = useState({
    pet: pet?.cadastro,
    responsavel: responsavel?.cadastro
  });
  
  const [disableCadastro, setDisableCadastro] = useState({
    pet: pet?.cadastro ? "disabled" : "enabled",
    responsavel: responsavel?.cadastro ? "disabled" : "enabled"
  });
  
  function handleChangeStatus(e: ChangeEvent<HTMLInputElement>, type: 'pet' | 'responsavel') {
    const newStatus = e.target.checked ? true : false; // Atualiza o status baseado no switch
    const newDisable = e.target.checked ? "disabled" : "enabled"; // Atualiza o estado de disabled/enabled

    // Atualizando o estado de status
    setStatus(prevStatus => ({
      ...prevStatus,
      [type]: newStatus
    }));

    // Atualizando o estado de disable
    setDisableCadastro(prevDisable => ({
      ...prevDisable,
      [type]: newDisable
    }));
  }

  async function handleUpdate() {
    if (!nomePet || !tipo || !nomeResponsavel || !telefone || !endereco) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const apiClient = configurarClienteAPI();

      // Atualizando os dados do responsável
      await apiClient.put('/responsavel', {
        responsavel_id: responsavel.id,
        nome: nomeResponsavel,
        telefone: telefone,
        endereco: endereco,
        cadastro: status.responsavel,
      });

      // Atualizando os dados do pet
      await apiClient.put('/pet', {
        usuario_id: pet.usuario_id,
        pet_id: pet.id,
        nome: nomePet,
        tipo: tipo,
        raca: raca,
        idade: Number(idade),
        peso: Number(peso),
        responsavel_id: responsavel.id,
        cadastro: status.pet,
      });

      alert('Cadastro do pet e responsável atualizado com sucesso!');
      Router.push('/pet');
    } catch (err) {
      console.error("Erro ao atualizar:", err.response || err.message);
      alert('Erro ao atualizar o cadastro do pet ou responsável.');
    }
  }

  return (
    <>
      <Head>
        <title>Editar Cadastro do Pet - veterinárioPRO</title>
      </Head>
      <Sidebar>
        <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
          {/* Cabeçalho */}
          <Flex
            direction={isMobile ? "column" : "row"}
            w="100%"
            alignItems={isMobile ? "flex-start" : "center"}
            justifyContent="flex-start"
            mb={isMobile ? 4 : 0}
          >
            <Link href="/pet">
              <Button
                bg="#63a375"
                _hover={{ background: '#63a375' }}
                mr={3}
                p={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FiChevronLeft size={24} color="#000" />
                Voltar
              </Button>
            </Link>
            <Heading fontSize={isMobile ? "22px" : "3xl"} color="white">
              Editar Cadastro do Pet
            </Heading>
          </Flex>

          {/* Formulário */}
          <Flex mt={4} maxW="1000px" pt={8} pb={8} w="100%" bg="veterinario.400" direction="column" align="center" justify="center">
            <Flex w="90%" direction="row" justify="space-between" align="flex-start" mb={4}>
              {/* Informações do Pet */}
              <Flex direction="column" w="60%">
                <Heading mb={4} fontSize={isMobile ? "22px" : "3xl"} color="white">Informações do Pet</Heading>
                <Input
                  placeholder="Nome do Pet"
                  size="lg"
                  type="text"
                  w="90%"
                  color="#FFF"
                  bg="veterinario.900"
                  mb={3}
                  value={nomePet}
                  onChange={(e) => setNomePet(e.target.value)}
                />
                <Input
                  placeholder="Espécie (Ex.: Cão, Gato)"
                  size="lg"
                  type="text"
                  w="90%"
                  color="#FFF"
                  bg="veterinario.900"
                  mb={3}
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                />
                <Input
                  placeholder="Raça"
                  size="lg"
                  type="text"
                  w="90%"
                  color="#FFF"
                  bg="veterinario.900"
                  mb={3}
                  value={raca}
                  onChange={(e) => setRaca(e.target.value)}
                />
                <Input
                  placeholder="Idade (Anos)"
                  size="lg"
                  type="number"
                  w="90%"
                  color="#FFF"
                  bg="veterinario.900"
                  mb={3}
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                />
                <Input
                  placeholder="Peso (Kg)"
                  size="lg"
                  type="number"
                  w="90%"
                  color="#FFF"
                  bg="veterinario.900"
                  mb={3}
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                />
              </Flex>

              {/* Informações do Responsável */}
              <Flex direction="column" w="40%">
                <Heading mb={4} fontSize={isMobile ? "22px" : "3xl"} color="white">Responsável</Heading>
                <Input
                  placeholder="Nome do Responsável"
                  size="lg"
                  type="text"
                  w="95%"
                  color="#FFF"
                  bg="veterinario.900"
                  mb={3}
                  value={nomeResponsavel}
                  onChange={(e) => setNomeResponsavel(e.target.value)}
                />
                <Input
                  placeholder="Telefone"
                  size="lg"
                  type="text"
                  w="95%"
                  color="#FFF"
                  bg="veterinario.900"
                  mb={3}
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
                <Input
                  placeholder="Endereço"
                  size="lg"
                  type="text"
                  w="95%"
                  color="#FFF"
                  bg="veterinario.900"
                  mb={3}
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
              </Flex>
            </Flex>

            <Stack mb={2} align="center" direction="row">
              <Text fontSize={20} fontWeight="bold" color="white">
                {disableCadastro.pet === 'disabled' ? 'Cadastro ativo' : 'Cadastro desativado'}
              </Text>
              <Switch
                size="lg"
                colorScheme="red"
                isChecked={disableCadastro.pet === 'disabled'}  // Verifique se o status é 'disabled'
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeStatus(e, 'pet')}  // Passa o tipo correto
              />
            </Stack>

            <Button
              mt={2}
              w="50%"
              bg="button.cta"
              color="gray.900"
              _hover={{ bg: "#FFb13e" }}
              disabled={assinatura?.status !== 'active'}
              onClick={handleUpdate}
            >
              Salvar
            </Button>

            {assinatura?.status !== 'active' && (
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
      </Sidebar>
    </>
  );
}

// SSR para carregar o pet e responsável
export const getServerSideProps = canSSRAuth(async (ctx) => {
  const { id, idResponsavel } = ctx.params;

  try {
    const apiClient = configurarClienteAPI(ctx);

    const check = await apiClient.get('/servico/check');

    const response = await apiClient.get('/pet/detail', { params: { pet_id: id } });
    const responsavelResponse = await apiClient.get('/responsavel/detail', {
      params: { responsavel_id: idResponsavel },
    });

    return{
      props:{
        pet: response.data,
        responsavel: responsavelResponse.data,   
        assinatura: check.data?.assinaturas
      }
    }
  } catch (err) {
    console.error(err);

    return {
      redirect: {
        destination: '/pet',
        permanent: false
      }
    };
  }
});
