import Head from 'next/head'
import Image from 'next/image';
import styles from '../../../styles/home.module.scss';//pegando mesmo arquivo de scss do home

import logoImg from '../../../public/logo.png';

import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

import Link from 'next/link';


export default function SignUp() {
  return (
    <>
    <Head>
      <title>SujeitoPizza - Faça seu Cadastro</title> 
    </Head>
    <div className={styles.container}>
      <Image src={logoImg} alt="Logo Smart Menu" />

      <div className={styles.login}>
        <form>
          
          <Input
            placeholder="Digite seu nome..."
            type="text"
          />
          
          <Input
            placeholder="Digite seu email..."
            type="text"
          />

          <Input
            placeholder="Sua senha..."
            type="password"
          />
          
          <Button
            type="submit"
            loading={false}
          >
            Cadastrar
          </Button>

          <Link href='/'>
              <a>Já tem uma conta? faça seu login!</a>
          </Link>

        </form>
      </div>
    </div>
    </>
  )
}
