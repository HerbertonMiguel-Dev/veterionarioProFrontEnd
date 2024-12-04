import { useState, useContext } from 'react'
import Head from 'next/head'
import Image from 'next/image';
import logoImg from '../../../public/images/veterinario.png'
import { Flex, Text, Center, Input,InputGroup,InputRightElement, Button } from '@chakra-ui/react'

import { FaEye, FaEyeSlash } from 'react-icons/fa';

import Link from 'next/link'

import { AuthContext } from '../../context/AuthContext'

import { canSSRGuest } from '../../utils/canSSRGuest'


export default function Login(){
  const { signIn } = useContext(AuthContext)
  
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false);

  const toggleShowSenha = () => setShowSenha(!showSenha);


  async function processarLogin(){
    if(email === '' || senha === ''){
      return;
    }

    await signIn({
      email,
      senha,
    })
  }

  return(
    <>
      <Head>
        <title>veterinário - Faça login para acessar</title>
      </Head>
      <Flex background="veterinario.900" height="100vh" alignItems="center" justifyContent="center">
        
        <Flex width={640} direction="column" p={14} rounded={8}>
          <Center p={4}>
            <Image
              src={logoImg}
              quality={100}
              width={360}
              objectFit="fill"
              alt="Logo barberpro"
            />
          </Center>

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
            size="lg"
            placeholder="Digite sua senha"
            type={showSenha ? "text" : "password"}
            mb={6}
            value={senha}
            onChange={ (e) => setSenha(e.target.value) }
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

          <Button
            background="button.cta"
            mb={6}
            color="gray.900"
            size="lg"
            _hover={{ bg: "#63f88d" }}
            onClick={processarLogin}
          >
            Acessar
          </Button>


          <Center mt={2}>
            <Link href="/cadastro">
              <Text cursor="pointer">Ainda não possui conta? <strong> Cadastre-se</strong></Text>
            </Link>
          </Center>

          <Center mt={2}>
            <Link href="/ForgotPassword">
              <Text cursor="pointer">Esqueceu sua senha?</Text>
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