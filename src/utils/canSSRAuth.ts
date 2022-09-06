import {
    GetServerSideProps, GetServerSidePropsContext,
    GetServerSidePropsResult
} from 'next'
import { parseCookies, destroyCookie } from 'nookies'
import { AuthTokenError } from '../services/errors/AuthTokenError'

//função para visitantes ou seja para quem ainda não tem um token
export function canSSRAuth<P>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);

        const token = cookies['@nextauth.token']

        //se tentar acessar a pagina de dashboard ou outra privada
        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            }
        }
        try {
            return await fn(ctx)
        } catch (error) {
            if (error instanceof AuthTokenError) {
                //se o erro for de token ainda assim cai no catch, logo destruimos o token e direciona para /
                return {
                    redirect: {
                        destination: '/',
                        permanent: false
                    }
                }
            }
        }
    }
}
