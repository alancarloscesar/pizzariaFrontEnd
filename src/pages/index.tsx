import Head from 'next/head'
import Image from 'next/image';
import styles from './home.module.scss';
import { toast } from 'react-toastify'
import {canSSRGuest} from '../utils/canSSRGuest'

import logoImg from '../../public/logo.png';

import Input  from './components/ui/Input'
import Button  from './components/ui/Button'

import { useContext, FormEvent, useState } from 'react';//usar o context o form event para não atualizar a page
import { AuthContext } from '../contexts/AuthContext';//meu context

import Link from 'next/link';


export default function Home() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn } = useContext(AuthContext)

  async function handleLogin(event: FormEvent) {
    event.preventDefault();//para não atualizar a page

    if (email == '' || password == '') {
      toast.warning('Preencha todos os campos!!!')
      return;
    }

    setLoading(true)//loading girando

    let data = {
      email,
      password
    }
    await signIn(data)

    setLoading(false)//loading parando
   
  }

  return (
    <>
      <Head>
        <title>SujeitoPizza - Faça seu login</title>
      </Head>
      <div className={styles.container}>
        <Image src={logoImg} alt="Logo Smart Menu" />

        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input
              placeholder="Digite seu email..."
              type="text"

              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Sua senha..."
              type="password"

              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              loading={loading}
            >
              Acessar
            </Button>

            <Link href='/signup'>
              <a className={styles.text}>Não tem uma conta? <strong style={{color: '#ff3f4b'}}>Crie uma agora mesmo!</strong></a>
            </Link>

          </form>
        </div>
      </div>
    </>
  )
}


//config de rotas privadas
export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})