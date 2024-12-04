import Head from 'next/head'
import { Flex, Text} from '@chakra-ui/react'

export default function Home(){
  return(
    <>
      <Head>
        <title>veterinário PRO - Seu sistema completo</title>
      </Head>
      <Flex background="veterinario.900" height="100vh" alignItems="center" justifyContent="center">
        <Text fontSize={30}>Página Home</Text>
      </Flex>
    </>
  )
}