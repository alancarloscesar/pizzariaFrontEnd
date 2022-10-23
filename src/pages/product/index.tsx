import Header from "../components/Header"
import Head from "next/head"
import { canSSRAuth } from "../../utils/canSSRAuth"
import { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import styles from './styles.module.scss'
import { FiUpload } from 'react-icons/fi'
import { setupAPIClient } from "../../services/api"
import { toast } from "react-toastify"
import ReactSwitch, { ReactSwitchProps } from 'react-switch'

type ItemProps = {
    id: string;
    name: string;
}
type SizeProps = {
    id: string;
    name: string;
}
interface CategoryProps {
    categoryList: ItemProps[]
    sizeList: SizeProps[]
}

export default function Product({ categoryList, sizeList }: CategoryProps) {
    const apiClient = setupAPIClient();

    const [name, setName] = useState('')
    const [preco, setPreco] = useState('')
    //    const [descricao, setDescricao] = useState('')
    const [qtd, setQtd] = useState('')

    const [radioCozBar, setradioCozBar] = useState('')


    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setImageAvatar] = useState(null)

    const [categories, setCategories] = useState(categoryList || [])
    const [categorySelected, setCategorySelected] = useState(0)

    const [sizes, setSizes] = useState(sizeList || [])
    const [sizeResponse, setSizeResponse] = useState(0)

    const [checked, setChecked] = useState(false)

    useEffect(() => {
        loadSizeCategory()
    }, [])

    //selecionando categoria
    function handleChangeCategory(event) {
        setCategorySelected(event.target.value)
    }

    //selecionando categoria
    function handleSize(event) {
        setSizeResponse(event.target.value)
    }

    //upload
    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) {//se não fizer file
            return;
        }

        const image = e.target.files[0];

        if (!image) {
            return;
        }

        if (image.type === 'image/jpeg' || image.type === 'image/png') {
            setImageAvatar(image)
            setAvatarUrl(URL.createObjectURL(e.target.files[0]))
        }
    }

    async function handleRegister(event: FormEvent) {
        event.preventDefault();

        try {
            if (name === '' || preco === '') {
                toast.warning("Preencha todos os campos!!!")
                return;
            }

            if (radioCozBar === '') {
                toast.warning("selecione 'COZINHA' ou 'BAR'")
                return;
            }

            if (checked && qtd === '') {
                toast.warning("O campo quantidade é obrigatório quando o estoque estiver marcardo!!")
                return;
            }


            const data = new FormData();//para trabalhar quando usa multipart no insomnia

            data.append('name', name.toUpperCase())
            data.append('price', preco)
            // data.append('description', descricao)
            data.append('file', imageAvatar)
            data.append('category_id', categories[categorySelected].id)
            data.append('tamanho', sizes[sizeResponse].name.toUpperCase())//sempre maiuscula
            data.append('estoque', checked ? "true" : "false")
            data.append('quantidade', qtd)
            data.append('pertencente', radioCozBar)

            await apiClient.post('/product', data);

            //console.log(categories[categorySelected].name)
            // setgetCategoryId(categorySelected[0])


            toast.success("Produto cadastrado com sucesso!")
        } catch (error) {
            toast.error(`${error.response.data.error}`)
        }

    }

    async function loadSizeCategory() {

        const response = await apiClient.get('/category/size', {
            params: {
                category_id: categories[categorySelected].id
            }
        })
        //console.log(response.data)
        setSizes(response.data)
    }

    const handleChange = nextChecked => {
        setChecked(nextChecked);
    };

    function teste() {
        if (radioCozBar === '') {
            console.log('nada selecionado')
        } else {

            console.log(radioCozBar)
        }
    }
    function onChangeValue(event) {
        // if (radioCozBar === '') {
        //     toast.warning("selecione 'COZINHA' ou 'BAR'")
        // } else {
        setradioCozBar(event.target.value);
        // }
    }

    return (
        <>
            <Head>
                <title>Cadastro de produtos</title>
            </Head>
            <Header />
            <main className={styles.container}>
                <section className={styles.sectionData}>
                    <h1>Novo Produto</h1>

                    <form className={styles.formData} onSubmit={handleRegister}>

                        <label className={styles.labelAvatar}>

                            <span>
                                <FiUpload color="#fff" size={30} />
                            </span>

                            <input type='file' accept="image/jpeg, image/jpg"
                                onChange={handleFile}
                            />

                            {avatarUrl && (
                                <img src={avatarUrl} alt="Foto do produto"
                                    className={styles.preview}
                                    width={250}
                                    height={250}
                                />
                            )}
                        </label>

                        <select value={categorySelected} onChange={handleChangeCategory} onClick={loadSizeCategory}>
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
                            className={styles.inputsData}
                            placeholder="Digite o nome do produto..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            className={styles.inputsData}
                            placeholder="Preço do produto..."
                            value={preco}
                            onChange={(e) => setPreco(e.target.value)}
                            type="number"
                        />

                        <div className={styles.Areaswitch}>
                            <select value={sizeResponse} onChange={handleSize}>
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

                            <div className={styles.switch}>
                                <h3>Estoque ?</h3>
                                <ReactSwitch
                                    onChange={handleChange}
                                    checked={checked}
                                    className="react-switch"
                                    onColor='#3fffa3'
                                />
                            </div>
                        </div>


                        {checked && (
                            <input
                                className={styles.inputsData}
                                placeholder="Qtd..."
                                value={qtd}
                                onChange={(e) => setQtd(e.target.value)}
                                type="number"
                            />
                        )}
                        {/* <textarea
                            placeholder="Descrição do produto..."
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        /> */}

                        <div className={styles.areaRadioBtn}>
                            <div>
                                <input type="radio" id="huey" name="drone" value="cozinha" onChange={onChangeValue} />
                                <label>Cozinha</label>
                            </div>

                            <div>
                                <input type="radio" id="dewey" name="drone" value="bar" onChange={onChangeValue} />
                                <label>Bar</label>
                            </div>
                        </div>

                        {/* <button onClick={teste}>Teste</button> */}
                        <button type="submit">
                            Cadastrar
                        </button>

                    </form>
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