import { canSSRAuth } from '../../utils/canSSRAuth'
import Head from 'next/head';
import styles from './styles.module.scss';
import Link from 'next/link';

import Header from '../components/Header'

import { setupAPIClient } from '../../services/api'


export default function Dashboard() {


    return (
        <>
            <Head>
                <title>Smart Menu</title>
            </Head>
            <div>
                <Header />

                <main className={styles.container}>

                    <div className={styles.containerCard}>
                        <section className={styles.card}>
                            <Link href='/CozinhaDash'>
                                <a>
                                    <header>
                                        <img src="/cozinha.png" alt='img cozinha'/>
                                    </header>
                                    <main>
                                        <hr />
                                    </main>
                                    <footer>
                                        <p>COZINHA</p>
                                    </footer>
                                </a>
                            </Link>
                        </section>

                        <section className={styles.card}>
                            <Link href='/BarDash'>
                                <a>
                                    <header>
                                        <img src="/bar.png" alt='img bar'/>
                                    </header>
                                    <main>
                                        <hr />
                                    </main>
                                    <footer>
                                        <p>BAR</p>
                                    </footer>
                                </a>
                            </Link>
                        </section>
                    </div>

                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/order');
    //console.log(response.data);


    return {
        props: {
            orders: response.data
        }
    }
})