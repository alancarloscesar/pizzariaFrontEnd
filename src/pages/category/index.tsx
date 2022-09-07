import Header from "../components/Header";
import styles from './styles.module.scss'
import { useState, FormEvent } from 'react'
import { toast } from 'react-toastify'
import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";

export default function Category() {

    const [name, setName] = useState('')

    async function handleAddCategory(event: FormEvent) {
        event.preventDefault();

        if (name === '') {
            toast.warning("Preencha o campo categoria")
            return
        }

        const apiClient = setupAPIClient();

        try {
            await apiClient.post('/category', {
                name: name
            })

            toast.success("Categoria cadastrarda com sucesso!")
            setName("")
        } catch (error) {
            const err = error.response.data.error
            toast.error(`${err}`)
        }


    }

    return (
        <>
            <Header />

            <main className={styles.container}>
                <h1>Cadastrar Categoria</h1>
                <form onSubmit={handleAddCategory}>
                    <input
                        placeholder="Digite aqui o nome da categoria..."
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                    />
                    <button type='submit'>
                        Cadastrar
                    </button>
                </form>
            </main>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})