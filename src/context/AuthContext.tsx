import { createContext, ReactNode, useState, useEffect } from 'react'
import { destroyCookie, setCookie, parseCookies } from 'nookies'
import Router from 'next/router'


import { api } from '../services/apiClient'

interface AuthContextData {
  usuario: UsuarioProps;
  estaAutenticado: boolean;
  signIn: (credenciais: SignInProps) => Promise<void>;
  signUp: (credenciais: SignUpProps) => Promise<void>;
  logoutUsuario: () => Promise<void>;
}

interface UsuarioProps {
  id: string;
  nome: string;
  email: string;
  endereco: string | null;
  assinaturas?: AssinaturaProps | null;
}

interface AssinaturaProps {
  id: string;
  status: string;
}

type AuthProviderProps = {
  children: ReactNode;
} 

interface SignInProps {
  email: string;
  senha: string;
}

interface SignUpProps{
  nome: string;
  email: string;
  senha: string;
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut(){
  console.log("ERORR LOGOUT");
  try{
    destroyCookie(null, '@veterinario.token', { path: '/' })
    Router.push('/login');

  }catch(err){
    console.log("Error ao sair")
  }
}

export function AuthProvider({ children }: AuthProviderProps){
  const [usuario, setUsuario] = useState<UsuarioProps>()
  const estaAutenticado = !!usuario;

  useEffect(() => {
    const { '@veterinario.token': token } = parseCookies();

    if(token){
      api.get('/me').then(resposta => {
        const { id, nome, endereco, email, assinaturas } = resposta.data;
        setUsuario({
          id,
          nome,
          email,
          endereco,
          assinaturas
        })

      })
      .catch(()=> {
        signOut()
      })

    }

  }, [])

  async function signIn({ email, senha }: SignInProps){
    try{
      const resposta = await api.post("/sessao", {
        email,
        senha,
      })

      const { id, nome, token, assinaturas, endereco} = resposta.data;

      setCookie(undefined, '@veterinario.token', token, {
        maxAge: 60 * 60 * 24 * 30, // Expirar em 1 mês
        path: '/'
      })

      setUsuario({
        id,
        nome,
        email,
        endereco,
        assinaturas
      })

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      
      Router.push('/dashboard')


    }catch(err){
      console.log("ERRO AO ENTRAR", err)
    }
  }

  async function signUp({ nome, email, senha}: SignUpProps){
    try{
      const resposta = await api.post('/usuarios', {
        nome,
        email,
        senha
      })

      Router.push('/login')

    }catch(err){
      console.log(err);
    }
  }

  async function logoutUsuario(){
    try{
      destroyCookie(null, '@veterinario.token', { path: '/' })
      Router.push('/login')
      setUsuario(null);
    }catch(err){
      console.log("ERRO AO SAIR", err)
    }
  }

  return(
    <AuthContext.Provider value={{ usuario, estaAutenticado, signIn, signUp, logoutUsuario }}>
      {children}
    </AuthContext.Provider>
  )
}