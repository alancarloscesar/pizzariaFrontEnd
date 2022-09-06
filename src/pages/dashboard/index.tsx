import {canSSRAuth} from '../../utils/canSSRAuth'

export default function Dashboard(){
    return(
        <div>
            <h1>Bem vindo ao Dashboard</h1>
        </div>
    )
}

//config de rotas privadas
export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
      props: {}
    }
  })