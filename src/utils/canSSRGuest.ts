import {GetServerSideProps, GetServerSidePropsContext,
     GetServerSidePropsResult} from 'next'
import {parseCookies} from 'nookies'

//função para visitantes ou seja para quem ainda não tem um token
export function canSSRGuest<P>(fn: GetServerSideProps<P>){
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>>=>{
        const cookies = parseCookies(ctx);

        //se tentar acessar qualquer page já tendo um login salvo
        if(cookies['@nextauth.token']){
            return{
                redirect: {
                    destination: '/dashboard',
                    permanent: false
                }
            }
        }
        return await fn(ctx)
    }
}
