import { useState, FormEvent, useContext } from 'react'
import Head from 'next/head'
import Image from 'next/image';
import styles from '../../../styles/home.module.scss';//pegando mesmo arquivo de scss do home
import { AuthContext } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'

import logoImg from '../../../public/logo.png';

import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

import Link from 'next/link';


export default function SignUp() {

  const { signUp } = useContext(AuthContext)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();

    if (name === '' || email === '' || password === '') {
      toast.warning("Preencha todos os campos!!!")
      return;
    }
    setLoading(true)

    let data = {
      name,
      email,
      password
    }

    await signUp(data)

    setLoading(false)
  }

  return (


    <>
      <Head>
        <title>SujeitoPizza - Faça seu Cadastro</title>
      </Head>
      <div className={styles.container}>
        <Image src={logoImg} alt="Logo Smart Menu" />

        <div className={styles.login}>
          <form onSubmit={handleSignUp}>

            <Input
              placeholder="Digite seu nome..."
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Digite seu email..."
              type="email"
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
              Cadastrar
            </Button>

            <Link href='/'>
              <a>Já tem uma conta? <strong style={{color: '#ff3f4b'}}>Faça seu login!</strong></a>
            </Link>

          </form>
        </div>
      </div>
    </>
  )
}

