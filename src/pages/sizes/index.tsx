import { useState, FormEvent, useEffect, useCallback } from 'react'
import Header from "../components/Header"
import styles from './styles.module.scss'
import { setupAPIClient } from '../../services/api';
import { toast } from 'react-toastify';



export default function Size() {

    const setupApi = setupAPIClient();

    const [name, setName] = useState('');
    const [categories, setCategories] = useState([])
    const [categorySelected, setCategorySelected] = useState(0)


    async function loadCategory() {
        const response = await setupApi.get('/category')

        setCategories(response.data)

    }

    async function handleAddSize(event: FormEvent) {
        event.preventDefault();
        if (name === '') {
            toast.warning("Preencha o campo nome!")
            return;
        }
        const response = await setupApi.post('/size', {
            name: name,
            category_id: categories[categorySelected]?.id
        })
        setName('')
        toast.success("cadastrado com sucesso!")

    }

    //selecionando categoria
    function handleChangeCategory(event) {
        setCategorySelected(event.target.value)
    }

    return (
        <>
            <Header />

            <main className={styles.container}>
                <h1>Cadastrar Tamanho</h1>
                <form onSubmit={handleAddSize}>

                    <select value={categorySelected} onChange={handleChangeCategory} onClick={loadCategory}>
                        {
                            categories.map((item, index) => {
                                return (
                                    <option key={item.id} value={index}>
                                        {item.name}
                                    </option>
                                )
                            })
                        }
                    </select>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value.toUpperCase())}
                        placeholder="Novo Tamanho..."
                    />
                    <button type='submit'>
                        Cadastrar
                    </button>
                </form>
            </main>
        </>
    )
}