import styles from './styles.module.scss'
import stylesMobile from './stylesMobile.module.scss'
import Link from 'next/link'
import { FiLogOut } from 'react-icons/fi'
import { AuthContext } from '../../../contexts/AuthContext'
import { useContext } from 'react'
import { FiMenu } from 'react-icons/fi'
import { useState } from 'react'
import MenuMobile from '../MenuMobile'

export default function Header() {

    const [menuMobile, setMenuMobile] = useState(false)
    const { signOut } = useContext(AuthContext)

    return (
        <>
            {
                menuMobile && (
                    <MenuMobile />
                )
            }
            <div className={styles.container} style={menuMobile ? {display: 'none'} : {}}>
                {/* <div className={styles.container} style={menuMobile ? {backgroundColor:"#ff0"} : {backgroundColor:"#ff0000"}}> */}
                {/* isso aqui funciona acima */}

                <Link href='/dashboard' className={styles.linkImg} style={menuMobile ? { display: 'none' } : {}}>
                    <img src="/logo.png" alt="minha img" width={120} height={100} />
                </Link>

                <a style={{ cursor: "pointer" }} className={styles.menu} onClick={() => setMenuMobile(!menuMobile)}>
                    <FiMenu size={40} color="#fff" />
                </a>


                <nav className={menuMobile ? stylesMobile.navHeader : styles.navHeader}>


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

                    <button onClick={signOut}>
                        <FiLogOut color='#ffffff' size={24} />
                    </button>
                </nav>

            </div>
        </>
    )
}