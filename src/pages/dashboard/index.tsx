import { useState } from 'react'
import { canSSRAuth } from '../../utils/canSSRAuth'
import Head from 'next/head';
import styles from './styles.module.scss';

import Header from '../components/Header';
import { FiRefreshCcw } from 'react-icons/fi'

import { setupAPIClient } from '../../services/api'
import Modal from 'react-modal'
import { ModalOrder } from '../components/ModalOrder'

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

export type OrderItemProps = {//tipamos igual a response da requisição do insomnia
    id: string;
    amount: number;
    order_id: string;
    product_id: string;
    product: {
        id: string;
        name: string;
        description: string;
        price: string;
        banner: string;
    }
    order: {
        id: string;
        table: string | number;
        status: boolean;
        name: string | number;
    }

}

export default function Dashboard({ orders }: HomeProps) {

    const [orderList, setOrderList] = useState(orders || [])

    const [modalItem, setModalItem] = useState<OrderItemProps>();//tipagem ao state
    const [modalVisible, setModalVisible] = useState(false)//iniciando o modal como false

    function handleCloseModal() {
        setModalVisible(false)
    }

    async function handleOpenModal(id: string) {
        const apiClient = setupAPIClient();
        const response = await apiClient.get('/order/detail', {
            params: {//o query do insomnia
                order_id: id// order_id e passa o id 
            }
        })

        setModalItem(response.data)//passando o response da requisição para o state
        setModalVisible(true)//abrindo o modal na condição la embaixo
    }

    Modal.setAppElement('#__next')//MOdal atribuido ao next

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
                            <button className={styles.btnMesa} onClick={() => { handleOpenModal(item.id) }}>
                                <span>Mesa {item.table}</span>
                            </button>
                        </section>
                    )
                })}

            </div>

            {modalVisible && (//se o modalVIsible for true, ou seja se tiver algo
                <ModalOrder
                    isOpen={modalVisible}
                    onRequestClose={handleCloseModal}
                    order={modalItem}
                />

            )}

        </>
    )
}

//config de rotas privadas
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