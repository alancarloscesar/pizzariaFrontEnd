import React, { useState, useContext, useEffect } from "react";
import styles from './styles.module.scss'
import { format, add } from 'date-fns'
import { toast } from "react-toastify";
import { FiPrinter } from 'react-icons/fi'

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
    valor_conta: string | number;
    conta_comissao: string | number;
    created_at: string;
    garcom: string;
}


export default function Report() {
    const [dataInicial, setDataInicial] = useState(new Date());
    const [dataFinal, setDataFinal] = useState(new Date());
    const [checkedLucroComissoes, setcheckedLucroComissoes] = useState(false)
    const [checkedLiquido, setcheckedLiquido] = useState(true)
    const [checkAlls, setcheckAlls] = useState(false)

    const [userList, setUserList] = useState([]);
    const [userSelected, setUserSelected] = useState(0)
    const [comissao, setComissao] = useState<contaProps[]>([])
    const [dataReport, setDataReport] = useState<contaProps[]>([])
    const [valorTotalComissao, setValorTotal] = useState('')

    setDefaultLocale('pt');//traduzindo datas do picker
    const api = setupAPIClient();



    async function handleComissao() {

        const dataInicialFormat = (format(dataInicial, 'yyyy-MM-dd'))//formatação para fazer a req

        const dayPlus = add(dataFinal, { days: 1 })//adicionando um dia à data final
        const dayPlusFormat = (format(dayPlus, 'yyyy-MM-dd'))//por algum motivo a api so funciona com um dia apos

        const response = await api.post('/invoicing', {
            dataInicial: dataInicialFormat,
            dataFinal: dayPlusFormat
        })
        //const somaCo = response.data.reduce((a, b) => a + Number(b.valor_comissao), 0);
        // setComissao(somaItems)
        // setValorTotal(somaItems)

        setDataReport(response.data)


        if (checkedLiquido && checkedLucroComissoes) {
            toast.warning("Marque somente umas das opções!")
            return;
        } else {
            if (checkedLucroComissoes) {//marcado lucro + comissoes
                const somaConta = response.data.reduce((a, b) => a + Number(b.conta_comissao), 0);
                setValorTotal(Number(somaConta).toFixed(2))
            }
            if (checkedLiquido) {
                const somaContaLiquido = response.data.reduce((a, b) => a + Number(b.valor_conta), 0);
                setValorTotal(Number(somaContaLiquido).toFixed(2))

            }
        }




        // console.log(response.data)

        // console.log("Data inicial: " + dataInicialFormat)
        // console.log("Data final + 1 dia: " + dayPlusFormat)
        // console.log("Garçom: " + userSelected)



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
            marginVertical: 10,
            fontSize: 14
        },
        // text: {
        //     margin: 5,
        //     fontSize: 11,
        //     textAlign: "justify",
        //     fontFamily: "Times-Roman",
        // },
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
        itemsList: {
            fontSize: 11,
            flexDirection: 'row',
            //justifyContent: 'space-between',
            //alignItems: 'center'
        }
    });


    //COMPONENTE DO PDF
    const PDFFiles = () => {

        return (
            <Document>
                <Page style={stylesPdf.body}>
                    <View style={stylesPdf.areaTitulo}>
                        <Text style={stylesPdf.header} fixed>Relatório de Faturamento</Text>
                        <Image style={stylesPdf.image} src="/logopdf.png" />
                    </View>
                    <View style={stylesPdf.line} />

                    <View style={stylesPdf.areaDados}>
                        <Text>Data Inicial: {format(dataInicial, 'dd/MM/yyyy')}</Text>
                        <Text>Data Final: {format(dataFinal, 'dd/MM/yyyy')}</Text>
                        <Text style={{ textDecoration: "underline", color: "#212121" }}>
                            {checkedLiquido ? "Lucro Líquido" : "Lucro + Comissões"}
                        </Text>
                    </View>

                    <View>
                        {
                            dataReport.map((item) => (
                                <View key={item.id} style={stylesPdf.itemsList}>
                                    <View style={stylesPdf.line} />
                                    <View>
                                        <Text>Data do atendimento: {format(new Date(item.created_at), 'dd/MM/yyyy kk:mm:ss')}</Text>
                                        <Text>Valor Conta: {item.valor_conta}</Text>
                                    </View>
                                    <View style={{ marginLeft: 50 }}>
                                        <Text>Conta + Comissão: {item.conta_comissao}</Text>
                                        <Text>Valor Comissão: {item.valor_comissao}</Text>
                                    </View>
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

                {
                    Number(valorTotalComissao) !== 0 && (

                        <div className={styles.areaImprimir}>
                            <PDFDownloadLink document={<PDFFiles />} fileName="Faturamento">
                                {({ loading }) => loading ? (
                                    'Carregando...'
                                ) : (
                                    <button>
                                        Imprimir

                                        <FiPrinter size={24} color="#fff" />
                                    </button>
                                )}
                            </PDFDownloadLink>
                        </div>
                    )
                }

                <section className={styles.areaDados}>


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
                    </section>

                    <section className={styles.areaBtn}>

                        <div className={styles.areaFiltros}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={checkedLiquido}
                                    onChange={() => setcheckedLiquido(!checkedLiquido)}
                                    style={{ marginRight: '3%' }}
                                />
                                Lucro Líquido
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={checkedLucroComissoes}
                                    onChange={() => setcheckedLucroComissoes(!checkedLucroComissoes)}
                                    style={{ marginRight: '3%' }}
                                />
                                Lucro + Comissões
                            </label>
                        </div>


                        <button
                            className={styles.btnGerar}
                            onClick={handleComissao}>
                            Gerar faturamento
                        </button>

                    </section>
                </section>

                <section className={styles.areaTotal}>
                    <div />
                    <h1>{valorTotalComissao ? valorTotalComissao : '0.0'} <strong>R$</strong></h1>
                </section>

            </main>


        </>
    )
}

