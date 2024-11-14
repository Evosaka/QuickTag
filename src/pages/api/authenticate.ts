// pages/api/authenticate.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido!" });
  }

  try {
    const { username, password } = req.body;

    // Validação básica
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Usuário e Senha devem ser informados!" });
    }

    const externalApiUrl = `${process.env.API_URL}/users/externallogin`;

    // Fazer a requisição para a API externa
    const response = await fetch(externalApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData); // Repassa a resposta da API externa
    }

    const data = await response.json();
    return res.status(200).json({
      token: data.token,
      apiUrl: process.env.API_URL,
      user: data.user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}
