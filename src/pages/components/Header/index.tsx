import styles from './styles.module.scss'
import Link from 'next/link'
import { FiLogOut } from 'react-icons/fi'
import { AuthContext } from '../../../contexts/AuthContext'
import { useContext } from 'react'

export default function Header() {

    const { signOut } = useContext(AuthContext)

    return (
        <div className={styles.container}>
            <Link href='/dashboard' className={styles.linkImg}>
                <img src="/logo.png" alt="minha img" width={120} height={100} />
            </Link>

            <nav className={styles.navHeader}>
                <Link href='/category'>
                    <a>Categoria</a>
                </Link>

                <Link href='/product'>
                    <a>Cardápio</a>
                </Link>

                <button onClick={signOut}>
                    <FiLogOut color='#ffffff' size={24} />
                </button>
            </nav>

        </div>
    )
}