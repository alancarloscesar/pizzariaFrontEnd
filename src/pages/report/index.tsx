import React, { useState, useContext, useEffect } from "react";
import styles from './styles.module.scss'
import style from './styleCard.module.scss'
import { format, add } from 'date-fns'
import { toast } from "react-toastify";

import Header from "../components/Header";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import pt from 'date-fns/locale/pt-BR';
registerLocale('pt', pt)

import { setupAPIClient } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";

import { PDFDownloadLink, View } from '@react-pdf/renderer'
import { Page, Text, Image, Document, StyleSheet } from "@react-pdf/renderer";




//ReactPDF.render(<MyDocument />, `${__dirname}/example.pdf`);

interface contaProps {
    id: string;
    valor_comissao: string | number;
    created_at: string;
    garcom: string;
}


export default function Report() {
    const [dataInicial, setDataInicial] = useState(new Date());
    const [dataFinal, setDataFinal] = useState(new Date());
    const [userList, setUserList] = useState([]);
    const [userSelected, setUserSelected] = useState(0)
    const [comissao, setComissao] = useState<contaProps[]>([])
    const [dataReport, setDataReport] = useState<contaProps[]>([])
    const [valorTotalComissao, setValorTotal] = useState('')

    setDefaultLocale('pt');
    const api = setupAPIClient();

    useEffect(() => {

        loadUser();

    }, [])

    async function loadUser() {
        const response = await api.get('/user/name');
        setUserList(response.data)
    }

    async function handleComissao() {

        const dataInicialFormat = (format(dataInicial, 'yyyy-MM-dd'))//formatação para fazer a req

        const dayPlus = add(dataFinal, { days: 1 })
        const dayPlusFormat = (format(dayPlus, 'yyyy-MM-dd'))

        const response = await api.post('/report', {
            dataInicial: dataInicialFormat,
            dataFinal: dayPlusFormat,
            garcom: userSelected
        })
        const somaItems = response.data.reduce((a, b) => a + Number(b.valor_comissao), 0);
        setComissao(somaItems)
        setValorTotal(somaItems)

        setDataReport(response.data)

        // console.log("+++++++++++ " + comissao)


        // console.log(response.data)

        // console.log("Data inicial: " + dataInicialFormat)
        // console.log("Data final + 1 dia: " + dayPlusFormat)
        // console.log("Garçom: " + userSelected)



    }
    //selecionando categoria
    function handleChangeGarcom(event) {
        setUserSelected(event.target.value)
    }

    const stylesPdf = StyleSheet.create({
        body: {
            paddingTop: 35,
            paddingBottom: 65,
            paddingHorizontal: 35,
        },
        areaTitulo: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        title: {
            fontSize: 24,
            textAlign: "center",
        },
        line: {
            border: 1,
            borderColor: 'grey',
            marginVertical: 10
        },
        areaDados: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            color: 'grey',
            marginVertical: 10
        },
        text: {
            margin: 5,
            fontSize: 11,
            textAlign: "justify",
            fontFamily: "Times-Roman",
        },
        image: {
            width: 130,
            height: 120
        },
        header: {
            fontSize: 25,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: "center",
            color: "grey",
        },
        pageNumber: {
            position: "absolute",
            fontSize: 12,
            bottom: 30,
            left: 0,
            right: 0,
            textAlign: "center",
            color: "grey",
        },
    });

    //COMPONENTE DO PDF
    const PDFFiles = () => {
        return (
            <Document>
                <Page style={stylesPdf.body}>
                    <View style={stylesPdf.areaTitulo}>
                        <Text style={stylesPdf.header} fixed>Relatório de Comissões</Text>
                        <Image style={stylesPdf.image} src="/logopdf.png" />
                    </View>
                    <View style={stylesPdf.line} />

                    <View style={stylesPdf.areaDados}>
                        <Text>Garçom: {userSelected}</Text>
                        <Text>Data Inicial: {format(dataInicial, 'dd/MM/yyyy')}</Text>
                        <Text>Data Final: {format(dataFinal, 'dd/MM/yyyy')}</Text>
                    </View>

                    <View>
                        {
                            dataReport.map((item) => (
                                <View key={item.id}>
                                    <View style={stylesPdf.line} />
                                    <Text>Data do atendimento: {format(new Date(item.created_at), 'dd/MM/yyyy kk:mm:ss')}</Text>
                                    <Text>Valor Comissão: {item.valor_comissao}</Text>
                                    <Text>Garçom: {item.garcom}</Text>
                                </View>
                            ))
                        }
                    </View>

                    <View style={stylesPdf.line} />
                    <Text style={{ textAlign: 'right' }}>Valor Total: {valorTotalComissao} R$</Text>

                    <Text
                        style={stylesPdf.pageNumber}
                        render={({ pageNumber, totalPages }) =>
                            `${pageNumber} / ${totalPages}`
                        }
                    />
                </Page>
            </Document>
        );
    };


    return (
        <>
            <Header />

            <main className={styles.container}>

                <section className={styles.areaPicker}>

                    <article>
                        <h3>Data Inicial:</h3>
                        <DatePicker
                            selected={dataInicial}
                            onChange={(date: Date) => setDataInicial(date)}
                            dateFormat="dd/MM/yyyy"
                            className={styles.datePicker}
                        />
                    </article>

                    <article>
                        <h3>Data Final:</h3>
                        <DatePicker
                            selected={dataFinal}
                            onChange={(date: Date) => setDataFinal(date)}
                            dateFormat="dd/MM/yyyy"
                            className={styles.datePicker}
                        //para pegar certinho a data final tem que ser um 1 a mais que o desejado 
                        // ea inicial normal no dia exato
                        />
                    </article>


                    <article>
                        <h3>Garçom:</h3>
                        <select value={userSelected} onChange={handleChangeGarcom} onClick={loadUser}
                        >
                            {
                                userList.map((item) => (
                                    <option onClick={loadUser} key={item.id}>{item.name}</option>
                                ))
                            }
                        </select>

                    </article>

                    <button
                        className={styles.btnGerar}
                        onClick={handleComissao}>
                        Gerar comissão
                    </button>

                </section>

                <section className={styles.areaCard}>
                    <div className={style.card}>
                        <header>
                            <img src="/user.png" alt="minha img" width={100} height={100} />
                        </header>

                        <main>
                            <h3 className={style.name}>{userSelected}</h3>
                            <section className={style.areaDate}>
                                <h3>{format(dataInicial, 'dd/MM/yyyy')}</h3>
                                <h3>à</h3>
                                <h3>{format(dataFinal, 'dd/MM/yyyy')}</h3>
                            </section>
                            <hr />
                            <div className={style.areaPrice}>
                                <p className={style.price}>{comissao.toString()}</p>
                                <span className={style.rs}>R$</span>
                            </div>
                        </main>

                        <footer>
                            <PDFDownloadLink document={<PDFFiles />} fileName="Comissões">
                                {({ loading }) => loading ? (
                                    'Carregando...'
                                ) : (
                                    <button className={style.btnIm}>Imprimir</button>
                                )}
                            </PDFDownloadLink>
                            {/* <button>Imprimir</button> */}

                        </footer>

                    </div>
                </section>

            </main>


        </>
    )
}

