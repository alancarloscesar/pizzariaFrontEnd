import Modal from 'react-modal';
import styles from './styles.module.scss';
import React, { useEffect, FormEvent, useState } from 'react'
import { toast } from 'react-toastify'
import { setupAPIClient } from '../../../services/api';

import { FiX } from 'react-icons/fi'

interface ModalSizeProps {
    isOpen: boolean;
    onRequestClose: () => void;
    getCaregoryName: string;
    getCategoryId: string;
    //category: Order
    // order: OrderItemProps[];

    // handleFinishOrder: (id: string) => void;//para finalizar o pedido
}

export type ModalProps = {
    id: string,
    name: string
}

export function ModalSizeCategory({ isOpen, onRequestClose, getCaregoryName, getCategoryId/*, order, handleFinishOrder */ }: ModalSizeProps) {

    const [nameSize, setNameSize] = useState('')

    const apiClient = setupAPIClient();

    const customStyles = {
        content: {
            top: '50%',
            bottom: 'auto',
            left: '50%',
            right: 'auto',
            padding: '30px',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#1d1d2e'
        }
    };

    async function handleAddSizeCategory(event: FormEvent) {
        event.preventDefault();

        if (nameSize === '') {
            toast.warning("Preencha um tamanho para a categoria!!")
            return;
        }

        try {
            await apiClient.post('/size', {
                name: nameSize,
                category_id: getCategoryId//passando o id da categoria
            })
            setNameSize('')
            toast.success("Tamanho cadastrado!")
        } catch (error) {
            console.log("Erro ao cadastrar categoria: " + error)
        }

    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
        >

            <button
                type="button"
                onClick={onRequestClose}
                className="react-modal-close"
                style={{ background: 'transparent', border: 0 }}
            >
                <FiX size={45} color="#f34748" />
            </button>

            <div className={styles.container}>

                <h2>Cadastro de Tamanho da categoria:</h2>
                <span className={styles.table}>
                    Categoria: <strong>{getCaregoryName}</strong>
                </span>

                <form className={styles.areaForm} onSubmit={handleAddSizeCategory}>

                    <input
                        placeholder='Ex. Copo, JARRA, P, M, G, GG, U'
                        className={styles.input}
                        value={nameSize}
                        onChange={(e) => setNameSize(e.target.value.toUpperCase())}
                    />

                    <button className={styles.finishedOrder} >
                        Cadastrar Tamanho
                    </button>
                </form>

            </div>

        </Modal>
    )
}