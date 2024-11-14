import React, { useState, FormEvent } from "react";
import Logo from "@components/logo";
import Link from "next/link";
import Button from "@components/button";
import Input from "@components/Input";
import { colors } from "@utils/theme";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import showNotification from "@utils/notifications";
import { useAppContext } from "@lib/context/appContext";

export default function LoginScreen() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { setSpinMsg } = useAppContext();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSpinMsg("Efetuando o Login...");

    try {
      const response = await fetch("/api/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showNotification(errorData.error || "Falha na autenticação", "error");
        throw new Error(errorData.error || "Falha na autenticação");
      }

      const data = await response.json();
      Cookies.set("fabtoken", data.token, { expires: 7 });
      Cookies.set("apiurl", data.apiUrl, { expires: 7 });
      Cookies.set("username", username, { expires: 7 });
      Cookies.set("user", JSON.stringify(data.user), { expires: 7 });
      router.push("/dashboard");
      setSpinMsg("");
    } catch (err) {
      setSpinMsg("");
      const errorMessage =
        err instanceof Error ? err.message : "Ocorreu um erro desconhecido";
      setError(errorMessage);
    }
  };

  return (
    <div className="w-full mx-auto h-screen">
      <div className="flex justify-between items-center">
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <div className="flex justify-center items-center my-5">
            <Logo />
          </div>

          <div className="mt-5">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4 justify-center">
                <div>
                  <Input
                    label="Usuário"
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    label="Senha"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="mt-5 mb-2 justify-between">
                  <Button
                    color="white"
                    backgroundColor={colors.secondary}
                    className="w-full"
                    onClick={handleSubmit}
                  >
                    Acessar
                  </Button>

                  <div className="underline text-center text-xs mt-4 text-gray-600">
                    <Link href="">Esqueci a senha</Link>
                  </div>
                </div>
                {/* Mensagem de erro */}
                {error && <div className="text-red-500">{error}</div>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
