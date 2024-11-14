import { useRouter } from "next/router";
import Login from "./login";

interface Version {
  version: "v1" | "v2";
}
export default function Home() {
  const router = useRouter();

  // Obter o parâmetro 'version' da query string
  let version = router.query.version;

  // Garantir que 'version' seja uma string
  if (Array.isArray(version)) {
    version = version[0];
  }

  return <Login version={version === "v1" ? "v1" : "v2"} />;
}
