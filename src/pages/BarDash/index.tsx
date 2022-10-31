import { useState } from 'react'
import { canSSRAuth } from '../../utils/canSSRAuth'
import Head from 'next/head';
import styles from './styles.module.scss';

import Header from '../components/Header'
import { FiRefreshCcw } from 'react-icons/fi'

import { setupAPIClient } from '../../services/api'

import ModalOrder  from '../components/ModalOrderBar'

import Modal from 'react-modal';

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

export type OrderItemProps = {
    id: string;
    amount: number;
    order_id: string;
    product_id: string;
    price: string;
    product: {
        id: string;
        name: string;
        description: string;
        price: string;
        banner: string;
        tamanho: string;
    }
    order: {
        id: string;
        garcom: string;
        table: string | number;
        status: boolean;
        name: string | null;
    }
}

export default function BarDash({ orders }: HomeProps) {

    const [orderList, setOrderList] = useState(orders || [])

    const [modalItem, setModalItem] = useState<OrderItemProps[]>()
    const [modalVisible, setModalVisible] = useState(false);


    function handleCloseModal() {
        setModalVisible(false);
    }

    async function handleOpenModalView(id: string) {

        const apiClient = setupAPIClient();

        const response = await apiClient.get('/order/detail', {
            params: {
                order_id: id,
                pertencente: "bar"
            }
        })

        setModalItem(response.data);
        setModalVisible(true);

    }

    async function handleFinishItem(id: string) {//função para finalizar o pedido
        const apiClient = setupAPIClient();
        await apiClient.put('/order/finish', {//rota para mudar o pedido para true
            order_id: id
        })
        const response = await apiClient.get('/order')//pega rota das mesas 
        setOrderList(response.data)//passa no state para atualizar a lista de mesas
        setModalVisible(false)//fecha modal
    }

    async function handleRefreshOrder() {
        const apiClient = setupAPIClient();
        const response = await apiClient.get('/order');

        setOrderList(response.data)
    }


    Modal.setAppElement('#__next');

    return (
        <>
            <Head>
                <title>Smart Menu</title>
            </Head>
            <div>
                <Header />

                <main className={styles.container}>


                    <div className={styles.containerHeader}>
                        <h1>Últimos pedidos - BAR</h1>
                        <button onClick={handleRefreshOrder}>
                            <FiRefreshCcw size={25} color="#3fffa3" />
                        </button>
                    </div>

                    <article className={styles.listOreders}>

                        {orderList.length === 0 && (
                            <span className={styles.orderItem} style={{ padding: 22, color: '#9e9a9a' }}>
                                Nenhum pedido encontrado...   :(
                            </span>
                        )}

                        {orderList.map(item => (
                            <section key={item.id} className={styles.orderItem}>
                                <button onClick={() => handleOpenModalView(item.id)}>
                                    <div className={styles.tag}></div>
                                    <span>Mesa {item.table}</span>
                                </button>
                            </section>

                        ))}

                    </article>



                </main>

                {modalVisible && (
                    <ModalOrder
                        isOpen={modalVisible}
                        onRequestClose={handleCloseModal}
                        order={modalItem}
                        handleFinishOrder={handleFinishItem}//chamando função de finalizar
                    />
                )}

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