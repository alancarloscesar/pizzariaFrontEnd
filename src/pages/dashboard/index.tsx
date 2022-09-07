import { canSSRAuth } from '../../utils/canSSRAuth'
import Home from 'next/head'
import Header from '../components/Header'

export default function Dashboard() {
    return (
        <>
        <Header/>
            <Home>
                <title>Dashboard</title>
            </Home>
            <div>
                <h1>Bem vindo(a) ao sistema</h1>
            </div>
        </>
    )
}

//config de rotas privadas
export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})