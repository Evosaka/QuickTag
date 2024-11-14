import LoginScreen from "@screens/LoginScreen";
import Spin from "@components/Spin";

import { useAppContext } from "@lib/context/appContext";

interface LoginProps {
  version: "v1" | "v2";
}

export default function Login({ version }: LoginProps) {
  const { spinMsg } = useAppContext();
  const backgroundImageStyle = {
    backgroundImage: `url("../assets/background-image.svg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center`}
      style={backgroundImageStyle}
    >
      <LoginScreen />
      {spinMsg && (
        <div className="fixed inset-0 z-[100]">
          <Spin msg={spinMsg} />
        </div>
      )}
    </main>
  );
  /*return version === "v1" ? (
    <main
      className={`flex min-h-screen flex-col items-center justify-center`}
      style={backgroundImageStyle}
    >
      <LogInComponent />
    </main>
  ) : (
    <div className="w-full mx-auto h-screen">
      <div className="flex justify-between items-center">
        <div className="w-7/12 h-screen flex flex-col justify-center">
          <div className="flex justify-center items-center my-5">
            <Logo />
          </div>

          <div className="mt-5">
            <div className="grid gap-y-4 justify-center">
              <div>
                <Input label="Email" placeholder="you@site.com" type="email" />
              </div>

              <div>
                <Input label="Senha" placeholder="•	•	•	•	•	•	•	•" type="password" />
              </div>

              <div className="mt-5 mb-2 justify-between">
                <Button
                  color="white"
                  backgroundColor={colors.secondary}
                  className="w-full"
                >
                  Acessar
                </Button>

                <div className="underline text-center text-xs mt-4 text-gray-600">
                  <Link href="">esqueci a senha</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-5/12 h-screen p-2 items-center">
          <div className="relative h-11/12">
            <img src="/login-image.svg" alt="" />
          </div>
        </div>
      </div>
    </div>
  ); */
}
