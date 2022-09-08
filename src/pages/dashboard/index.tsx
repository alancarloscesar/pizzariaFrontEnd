import { useState } from 'react'
import { canSSRAuth } from '../../utils/canSSRAuth'
import Head from 'next/head';
import styles from './styles.module.scss';

import Header from '../components/Header';
import { FiRefreshCcw } from 'react-icons/fi'

import { setupAPIClient } from '../../services/api'

type OrderProps = {
    id: string;
    table: string | number;
    status: boolean;
    draft: boolean;
    name: string | null;
}

interface HomeProps {
    orders: OrderProps[];
}

export default function Dashboard({ orders }: HomeProps) {

    const [orderList, setOrderList] = useState(orders || [])

    return (
        <>
            <Header />
            <Head>
                <title>Dashboard</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.containerHeader}>
                    <h1>Últimos pedidos</h1>
                    <button style={{ background: 'transparent' }}>
                        <FiRefreshCcw color='#3fffa3' size={30} />
                    </button>
                </div>

                {orderList.map((item) => {//trazendo todas as categorias com as regra informadas la no backend
                    return (
                        <section key={item.id} className={styles.cardMesa}>
                            <div className={styles.tag}></div>
                            <button className={styles.btnMesa}>
                                <span>Mesa {item.table}</span>
                            </button>
                        </section>
                    )
                })}

            </div>
        </>
    )
}

//config de rotas privadas
export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/order');
    console.log(response.data);


    return {
        props: {
            orders: response.data
        }
    }
})