import { createContext, ReactNode, useState } from 'react';
import Router from 'next/router'

import {api} from '../services/apiClient'
import {destroyCookie, setCookie, parseCookies} from 'nookies'

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
}

type UserProps = {
  id: string;
  name: string;
  email: string;
}

type SignInProps = {
  email: string;
  password: string;
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut(){
  try {
    destroyCookie(undefined, '@nextauth.token')
    Router.push('/')//redireciona para pagina principal
  } catch (error) {
    console.log("Erro ao deslogar ", error)
  }
}

export function AuthProvider({ children }: AuthProviderProps){
  const [user, setUser] = useState<UserProps>()
  const isAuthenticated = !!user;//convertendo o user para boolean

  async function signIn({email, password}: SignInProps){
    try {
      const response = await api.post('/session',{//acessando rota de login do backend
        email,
        password
      })
      
      const {id, name, token} = response.data;//desconstruindo do response.data
      setCookie(undefined, '@nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, //expira em 30 dias
        path: '/'//em todas as rotas
      })
      setUser({//state
        id, 
        name, 
        email
      })
      //passando token para todas as rotas e requisições
      api.defaults.headers['Authorization'] = `Bearer ${token}`

      //redireciona para a pagina de dashboard
      Router.push('/dashboard')
    } catch (error) {
      console.log("Erro ao fazer login: ", error)
    }
  }

  return(
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}