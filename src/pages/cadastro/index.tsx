import { useState, useContext } from 'react';
import Head from 'next/head'
import Image from 'next/image';
import logoImg from '../../../public/images/veterinario.png'
import { Flex, Text, Center, Input, InputGroup,InputRightElement, Button } from '@chakra-ui/react'

import { FaEye, FaEyeSlash } from 'react-icons/fa';

import Link from 'next/link'

import { AuthContext } from '../../context/AuthContext'
import { canSSRGuest } from '../../utils/canSSRGuest'

export default function Cadastro() {
  const { signUp } = useContext(AuthContext);

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [senhaConfirmacao, setSenhaConfirmacao] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showSenhaConfirmacao, setShowSenhaConfirmacao] = useState(false);

  const toggleShowSenha = () => setShowSenha(!showSenha);
  const toggleShowSenhaConfirmacao = () => setShowSenhaConfirmacao(!showSenhaConfirmacao);

  async function processarCadasro() {
    if (nome === '' || email === '' || senha === '' || senhaConfirmacao === '') {
      return;
    }

    if (senha !== senhaConfirmacao) {
      alert("As senhas não coincidem.");
      return;
    }

    await signUp({
      nome,
      email,
      senha
    })
  }

  return (
    <>
      <Head>
        <title>Crie sua conta no veterinárioPRO</title>
      </Head>
      <Flex background="veterinario.900" height="100vh" alignItems="center" justifyContent="center">

        <Flex width={640} direction="column" p={14} rounded={8}>
          <Center p={4}>
            <Image
              src={logoImg}
              quality={100}
              width={240}
              objectFit="fill"
              alt="Logo veterinário"
            />
          </Center>

          <Input
            background="veterinario.400"
            color="#000"
            variant="filled"
            size="lg"
            placeholder="Nome da Clinica"
            type="text"
            mb={3}
            value={nome}
            onChange={ (e) => setNome(e.target.value) }
          />

          <Input
            background="veterinario.400"
            color="#000"
            variant="filled"
            size="lg"
            placeholder="email@email.com"
            type="email"
            mb={3}
            value={email}
            onChange={ (e) => setEmail(e.target.value) }
          />

          <InputGroup size="lg" mb={3}>
            <Input
              background="veterinario.400"
              color="#000"
              variant="filled"
              placeholder="Digite sua senha"
              type={showSenha ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <InputRightElement width="3rem">
              <Button 
              h="1.75rem" 
              size="sm" 
              onClick={toggleShowSenha}
              background="transparent"
              _hover={{ background: "transparent" }}
              _active={{ background: "transparent" }}
              >
                {showSenha ? <FaEyeSlash color='#000'/> : <FaEye color='#000'/>}
              </Button>
            </InputRightElement>
          </InputGroup>

          <InputGroup size="lg" mb={6}>
            <Input
              background="veterinario.400"
              color="white"
              variant="filled"
              placeholder="Confirme sua senha"
              type={showSenhaConfirmacao ? "text" : "password"}
              value={senhaConfirmacao}
              onChange={(e) => setSenhaConfirmacao(e.target.value)}
            />
            <InputRightElement width="3rem">
              <Button 
              h="1.75rem" 
              size="sm" 
              onClick={toggleShowSenhaConfirmacao}
              background="transparent"
              _hover={{ background: "transparent" }}
              _active={{ background: "transparent" }}
              >
                {showSenhaConfirmacao ? <FaEyeSlash color='#000'/> : <FaEye color='#000'/>}
              </Button>
            </InputRightElement>
          </InputGroup>

          <Button
            background="button.cta"
            mb={6}
            color="gray.900"
            size="lg"
            _hover={{ bg: "#63f88d" }}
            onClick={processarCadasro}
            >
            Cadastrar
          </Button>


          <Center mt={2}>
            <Link href="/login">
              <Text cursor="pointer">Já possui uma conta?<strong>Faça o login</strong></Text>
            </Link>
          </Center>


        </Flex>

      </Flex>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return{
    props: {}
  }
})

