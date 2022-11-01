import Header from "../components/Header"
import Head from "next/head"
import { canSSRAuth } from "../../utils/canSSRAuth"
import { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import styles from './styles.module.scss'
import { FiUpload } from 'react-icons/fi'
import { setupAPIClient } from "../../services/api"
import { toast } from "react-toastify"
import ReactSwitch, { ReactSwitchProps } from 'react-switch'
import Product from "../product"

type ItemProps = {
    id: string;
    name: string;
}
type SizeProps = {
    id: string;
    name: string;
}

type ProductProps = {
    id: string;
    name: string;
    estoque: string;
    quantidade: number;
    price: string;
    tamanho: string;
}

interface CategoryProps {
    categoryList: ItemProps[]
    sizeList: SizeProps[]
    productList: ProductProps[]
}

export default function Entrada({ categoryList, sizeList, productList }: CategoryProps) {
    const apiClient = setupAPIClient();

    const [name, setName] = useState('')
    const [tamanho, setTamanho] = useState('')
    const [descricao, setDescricao] = useState('')

    const [qtd, setQtd] = useState('')
    const [price, setPrice] = useState('')

    const [categories, setCategories] = useState(categoryList || [])
    const [categorySelected, setCategorySelected] = useState(0)

    const [sizes, setSizes] = useState(sizeList || [])
    const [sizeResponse, setSizeResponse] = useState(0)

    const [product, setProduct] = useState(productList || [])
    const [produtctSelected, setProdutctSelected] = useState(0)

    const [inputDisable, setInputDisable] = useState(false)
    const [checkedPrice, setCheckedPrice] = useState(false)

    
    // async function verificaEstoque() {
    //     const response = await apiClient.getasdf
    // }


    async function loadSizeCategory() {
        const response = await apiClient.get('/category/size', {
            params: {
                category_id: categories[categorySelected]?.id
            }
        })
        setSizes(response.data)
    }

    async function loadProducts() {
        const response = await apiClient.get('/product/category', {
            params: {
                category_id: categories[categorySelected]?.id,
                tamanho: sizes[sizeResponse]?.name
            }
        })
        setProduct(response.data)
    }

    async function loadFunctions() {
        loadProducts()
        loadSizeCategory()
    }

    async function handleUpdate() {
        if (product[produtctSelected]?.estoque === 'true') {
            if (checkedPrice) {
                if (qtd === '' && price === '') {
                    toast.warning('Qtd e Preço são obrigatorios para este produto!')
                    return;
                } else {
                    await apiClient.put('/product/estock', {

                        name: product[produtctSelected]?.name,
                        tamanho: sizes[sizeResponse]?.name,
                        quantidade: Number(product[produtctSelected]?.quantidade) + Number(qtd),
                        price: price
                    })
                    toast.success('Atualizado com sucesso!!')
                    setPrice('')
                    setQtd('')
                    window.location.reload();//atualiza a page - f5
                }
            } else {
                if (qtd === '') {
                    toast.warning('Qtd é obrigatório para este produto!')
                    return;
                } else {

                    await apiClient.put('/product/estock', {

                        name: product[produtctSelected]?.name,
                        tamanho: sizes[sizeResponse]?.name,
                        quantidade: Number(product[produtctSelected]?.quantidade) + Number(qtd),
                        price: price
                    })
                    toast.success('Atualizado com sucesso!!')
                    setPrice('')
                    window.location.reload();
                }
            }


        } else {
            if (price === '') {
                toast.warning('Preço obrigatorio para este produto!')
                return;
            } else {
                await apiClient.put('/product/update', {

                    name: product[produtctSelected]?.name,
                    tamanho: sizes[sizeResponse]?.name,
                    price: price
                })
            }

            toast.success('Atualizado com sucesso!!')


        }
    }

    function handleDisableInput() {
        if (product[produtctSelected]?.estoque === 'true') {
            setInputDisable(true)
        } else {
            setInputDisable(false)
        }
    }

    //selecionando categoria
    function handleChangeCategory(event) {
        setCategorySelected(event.target.value)
    }

    //selecionando categoria
    function handleSize(event) {
        setSizeResponse(event.target.value)
    }

    //selecionando Produtos
    function handleProduct(event) {
        setProdutctSelected(event.target.value)
    }

    return (
        <>
            <Head>
                <title>Atualiza preço e quantidade</title>
            </Head>
            <Header />
            <main className={styles.container}>
                <section className={styles.sectionData}>
                    <h1>Atualizar Preço e Qtd</h1>

                    <section className={styles.formData}>

                        <select value={categorySelected} onChange={handleChangeCategory} onClick={loadFunctions}>
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

                        <select value={sizeResponse} onChange={handleSize} onClick={loadFunctions}>
                            {
                                sizes.map((item, index) => {
                                    return (
                                        <option key={item.id} value={index}>
                                            {item.name}
                                        </option>
                                    )
                                })
                            }
                        </select>

                        <select value={produtctSelected} onChange={handleProduct} onClick={handleDisableInput}>
                            {
                                product.map((item, index) => {
                                    return (
                                        <option key={item.id} value={index}>
                                            {item.name}
                                        </option>
                                    )
                                })
                            }
                        </select>

                        <div className={styles.areaPrice}>

                            <input
                                className={styles.inputsData}
                                placeholder="Novo preço..."
                                value={checkedPrice ? price : product[produtctSelected]?.price}
                                onChange={(e) => setPrice(e.target.value)}
                                type="number"
                                disabled={!checkedPrice ? true : false}
                                style={{ cursor: `${!checkedPrice ? 'not-allowed' : ''}` }}
                            />

                            <label>
                                <input
                                    type="checkbox"
                                    checked={checkedPrice}
                                    onChange={() => setCheckedPrice(!checkedPrice)}
                                    style={{ marginRight: '3%' }}
                                />
                                Atualizar preço
                            </label>
                        </div>

                        {inputDisable && (
                            <input
                                className={styles.inputsData}
                                placeholder="Qtd..."
                                value={qtd}
                                onChange={(e) => setQtd(e.target.value)}
                                type="number"
                            />
                        )}

                        <button onClick={handleUpdate}>Atualizar</button>
                    </section>
                </section>
            </main>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient('/category')
    return {
        props: {
            categoryList: response.data
        }
    }
})