import Header from "../components/Header";
import styles from './styles.module.scss'
import { useState, FormEvent } from 'react'
import { toast } from 'react-toastify'
import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";

import Modal from 'react-modal';

import { ModalSizeCategory } from "../components/ModalSizeCategory";

export default function Category() {

    const [nameCat, setName] = useState('')
    const [categoryName, setCategoryName] = useState()
    const [visebleModal, setVisibleModal] = useState(false)
    const [catId, setCatId] = useState('')

    async function handleAddCategory(event: FormEvent) {
        event.preventDefault();

        if (nameCat === '') {
            toast.warning("Preencha o campo categoria")
            return
        }

        const apiClient = setupAPIClient();

        try {
            const response = await apiClient.post('/category', {
                name: nameCat
            })

            toast.success("Categoria cadastrarda com sucesso!")
            setVisibleModal(true)
            setName("")
            setCategoryName(response.data.name)
            setCatId(response.data.id)


        } catch (error) {
            const err = error.response.data.error
            toast.error(`${err}`)
        }


    }

    function handleCloseModal() {
        setVisibleModal(false)
    }

    Modal.setAppElement('#__next');

    return (
        <>
            <Header />

            <main className={styles.container}>
                <h1>Cadastrar Categoria</h1>
                <form onSubmit={handleAddCategory}>
                    <input
                        placeholder="Digite aqui o nome da categoria..."
                        value={nameCat}
                        onChange={(e) => { setName(e.target.value.toUpperCase()) }}
                    />
                    <button type='submit'>
                        Cadastrar
                    </button>
                </form>
            </main>

            {visebleModal && (
                <ModalSizeCategory
                    isOpen={visebleModal}
                    onRequestClose={handleCloseModal}
                    getCaregoryName={categoryName}
                    getCategoryId={catId}
                />
            )}

        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})