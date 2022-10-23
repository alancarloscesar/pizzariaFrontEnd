
import styles from './styles.module.scss'
import stylesMobile from './stylesMobile.module.scss'
import Link from 'next/link'
import { FiLogOut } from 'react-icons/fi'
import { AuthContext } from '../../../contexts/AuthContext'
import { useContext } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import Header from '../Header'
import { setupAPIClient } from '../../../services/api'


export default function MenuMobile() {
    //document.documentElement.style.overflow = 'hidden';//oculta o scrol da page
    window.scrollTo(0, 0);//pagina indo para o topo
    const [menuDesktop, setMenuDesktop] = useState(false)
    const { signOut } = useContext(AuthContext)
    const [typeUser, setTypeUser] = useState('')

    const api = setupAPIClient();

    useEffect(() => {
        async function loadUser() {
            const response = await api.get('/me')
            setTypeUser(response.data.type)
        }
        loadUser()
    }, [])

    return (
        <>

            {
                menuDesktop && (
                    <Header />
                )
            }

            <div className={styles.container} style={menuDesktop ? { display: 'none' } : {}}>

                <div className={styles.menuArea}>
                    <Link href='/dashboard' className={styles.linkImg} >
                        <img src="/logo.png" alt="minha img" width={85} height={80} />
                    </Link>

                    <a style={{ cursor: "pointer" }} className={styles.menu} onClick={() => setMenuDesktop(!menuDesktop)}>
                        <FiX size={40} color="#fff" />
                    </a>
                </div>

                <nav className={styles.navHeader}>

                    <Link href='/dashboard'>
                        <a>Dashboard</a>
                    </Link>

                    <Link href='/category'>
                        <a>Categoria</a>
                    </Link>

                    <Link href='/sizes'>
                        <a>Tamanho</a>
                    </Link>

                    <Link href='/product'>
                        <a>Cardápio</a>
                    </Link>

                    <Link href='/entrada'>
                        <a>Entrada</a>
                    </Link>

                    <Link href='/report'>
                        <a>Comissões</a>
                    </Link>

                    {
                        typeUser === 'master' && (
                            <Link href='/invoicing'>
                                <a>Faturamento</a>
                            </Link>
                        )
                    }

                    <button onClick={signOut}>
                        <p>Sair</p>
                        <FiLogOut color='#ffffff' size={24} />
                    </button>
                </nav>

            </div>
        </>
    )
}