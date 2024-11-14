import "@styles/globals.css";
import type { AppProps } from "next/app";
import type { NextPageContext } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { verifyToken } from "@lib/security/token";
import { parse as parseCookie } from "cookie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApolloProvider } from "@apollo/client";
import client from "@lib/graphql/client";
import { AppProvider } from "@lib/context/appContext";

export default function App({
  Component,
  pageProps,
  fabtoken,
}: AppProps & { fabtoken?: string }) {
  const router = useRouter();

  useEffect(() => {
    import("preline");
  }, []);

  useEffect(() => {
    // Verificar se estamos na página de login para evitar loop de redirecionamento
    if (router.pathname !== "/login") {
      const token = fabtoken || Cookies.get("fabtoken");
      if (!token || !verifyToken(token)) {
        router.push("/login");
      }
    }
  }, [router, fabtoken]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ApolloProvider client={client()}>
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
      </ApolloProvider>
    </>
  );
}

// Acessar cookies no lado do servidor
App.getInitialProps = async (appContext: { ctx: NextPageContext }) => {
  const req = appContext.ctx.req;
  let fabtoken = null;

  if (req && req.headers.cookie) {
    const cookies = parseCookie(req.headers.cookie);
    fabtoken = cookies.fabtoken;
  }

  return { fabtoken };
};
