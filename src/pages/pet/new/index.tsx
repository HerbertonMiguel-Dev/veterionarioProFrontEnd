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

interface NewResponsavelProps{
  id: string;
  nomeResponsavel: string;
  telefone: string | number;
  usuario_id: string;
  assinatura: boolean;
  count: number;
}


export default function NewPet({id, assinatura, count}: NewResponsavelProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");

  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState('')
  const [raca, setRaca] = useState('')
  const [idade, setIdade] = useState('')
  const [peso, setPeso] = useState('')
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");

  async function processarCadastro() {

    if (nome === '' || tipo === '' || nomeResponsavel === '' || telefone === '' || endereco === '') {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Cadastro do responsável
    try {
      const apiClient = configurarClienteAPI();
      const responsavelResponse = await apiClient.post('/responsavel', {
        nome: nomeResponsavel,
        telefone,
        endereco,
         
      });

      const responsavel_id = responsavelResponse.data.id;

      // Cadastrar o pet com o responsavel_id
      await apiClient.post('/pet', {
        nome: nome,
        tipo: tipo,
        raca: raca,
        idade: Number(idade),
        peso: Number(peso),
        responsavel_id,
        
      });

      alert('Pet cadastrado com sucesso!');
      Router.push('/pet'); // Redirecionar após sucesso

    } catch (err) {
      console.log(err)
      alert("Erro ao cadastrar o pet ou responsável.")
    }

  }


  return (
    <>
      <Head>
        <title>veterinárioPRO - Cadastrar novo Pet</title>
      </Head>
      <Sidebar>
        <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
          <Flex direction="row" w="100%" align="center" justify="center">

            <Flex
              direction={isMobile ? "column" : "row"}
              w="100%"
              align={isMobile ? "flex-start" : "center"}
              mb={isMobile ? 4 : 0}
            >

              <Link href="/pet">
                <Button
                  bg="#63a375" _hover={{ background: '#63a375' }}
                  p={4}
                  display="flex"
                  alignItems="center"
                  justifyItems="center"
                  textAlign="center"
                  mr={isMobile ? 0 : 4}
                  mb={isMobile ? 4 : 0}
                >
                  <FiChevronLeft size={24} color="#000000" />
                  Voltar
                </Button>
              </Link>

              <Heading
                color="#fff"
                fontSize={isMobile ? "28px" : "3xl"}
              >
                Novo Pet
              </Heading>
            </Flex>
          </Flex>

          <Flex
            mt={8}
            maxW="1000px"
            bg="veterinario.400"
            w="100%"
            align="center"
            justify="center"
            pt={8}
            pb={8}
            direction="column"
          >
            <Flex
              maxW="1200px"
              pt={4}
              pb={4}
              width="100%"
              direction="column"
              align="center"
              justify="center"
              bg="veterinario.400"
            >

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
                <Heading mb={4} fontSize={isMobile ? "22px" : "3xl"} color="white">Cadastrar novo Pet</Heading>
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
                  placeholder="Espécie ex: cão, felino,ave Silveste, réptil"
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



              {/* Coluna: Informações do Responsável */}
              <Flex direction="column" w="50%">
                <Heading mb={4} fontSize={isMobile ? "22px" : "3xl"} color="white">Responsável</Heading>

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
              </Flex>

            </Flex>

            <Button
              w="50%"
              size="lg"
              color="gray.900"
              mb={6}
              bg="button.cta"
              _hover={{ bg: "#FFb13e" }}
              disabled={!assinatura && count >= 5}
              onClick={processarCadastro}
            >
              Cadastrar
            </Button>

            {!assinatura && count >= 5 && (
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
  try {
    const apiClient = configurarClienteAPI(ctx);

    const response = await apiClient.get('/servico/check')
    const count = await apiClient.get('/pet/count')
    const countResponsavel = await apiClient.get('/responsavel/count')

    return {
      props: {
        assinatura: response.data?.assinaturas?.status === 'active' ? true : false,
        count: count.data,
        countResponsavel: countResponsavel.data
      }
    }

  } catch (err) {
    console.log(err);

    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      }
    }
  }

})