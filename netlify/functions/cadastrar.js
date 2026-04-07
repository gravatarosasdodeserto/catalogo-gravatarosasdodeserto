export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { nome, qtd, senha } = await req.json()
  
  if (senha !== 'gravata2026') {
    return new Response('Senha incorreta', { status: 401 })
  }

  const res = await fetch(`https://api.github.com/repos/${Netlify.env.get("GITHUB_USER")}/${Netlify.env.get("GITHUB_REPO")}/dispatches`, {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${Netlify.env.get("GITHUB_TOKEN")}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event_type: 'atualizar-catalogo',
      client_payload: { acao: 'cadastrar', nome, qtd }
    })
  })

  if (res.status === 204) {
    return new Response(JSON.stringify({ ok: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } else {
    return new Response('Erro GitHub: ' + res.status, { status: 500 })
  }
}
