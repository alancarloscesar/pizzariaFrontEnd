import { createContext, ReactNode, useState, useEffect } from 'react';
import { toast } from 'react-toastify'

import { api } from '../services/apiClient';

import { destroyCookie, setCookie, parseCookies } from 'nookies'
import Router from 'next/router';


type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
  id: string;
  name: string;
  email: string;
  type: string;
}

type SignInProps = {
  email: string;
  password: string;
}

type SignUpProps = {
  name: string;
  email: string;
  password: string;
}


type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)


export function signOut() {
  try {
    destroyCookie(undefined, '@nextauth.token')

    toast.info("Até logo...")
    Router.push('/')
  } catch {
    toast.error("Erro ao deslogar")
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>()
  const isAuthenticated = !!user;

  useEffect(() => {
    const { '@nextauth.token': token } = parseCookies();

    if (token) {
      api.get('/me').then(response => {//se der certo a requisição /me
        const { id, name, email, type } = response.data;

        setUser({
          id,
          name,
          email,
          type
        })
      })
        .catch(() => {
          //se não der certo a requisição /me desloga e destroi o cookie
          signOut();//função que ja faz tudo isso
        })
    }
  }, [])

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post('/session', {
        email,
        password
      })
      // console.log(response.data);

      const { id, name, token, type } = response.data;

      setCookie(undefined, '@nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // Expirar em 1 mes
        path: "/" // Quais caminhos terao acesso ao cookie
      })

      setUser({
        id,
        name,
        email,
        type
      })

      //Passar para proximas requisiçoes o nosso token
      api.defaults.headers['Authorization'] = `Bearer ${token}`

      toast.success(`Bem Vindo(a) ${response.data.name}`)
      //Redirecionar o user para /dashboard
      Router.push('/dashboard')


    } catch (err) {
      toast.error("ERRO AO ACESSAR ", err)
    }
  }

  async function signUp({ name, email, password }: SignUpProps) {
    try {
      const response = await api.post('/users', {
        name,
        email,
        password
      })

      toast.success("Usuário criado com sucesso!")
      Router.push('/')
    } catch (error) {
      toast.error("Erro ao cadastrar usuário: ", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  )
}