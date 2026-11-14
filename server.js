const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const port = Number(process.env.PORT || 8000);
const apiUrl = "https://api.nasa.gov/planetary/apod";
const staticFiles = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ["/script.js", ["script.js", "text/javascript; charset=utf-8"]],
]);

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(data));
}

function isValidDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsedDate.getTime())
    && parsedDate.toISOString().slice(0, 10) === date;
}

async function handleApod(requestUrl, response) {
  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey) {
    sendJson(response, 503, {
      error: "A chave da NASA não está configurada no servidor. Defina NASA_API_KEY e reinicie a aplicação.",
    });
    return;
  }

  const date = requestUrl.searchParams.get("date");
  if (!date || !isValidDate(date)) {
    sendJson(response, 400, { error: "Informe uma data válida no formato AAAA-MM-DD." });
    return;
  }

  if (date > new Date().toISOString().slice(0, 10)) {
    sendJson(response, 400, { error: "Não é possível consultar uma data futura." });
    return;
  }

  try {
    const nasaUrl = new URL(apiUrl);
    nasaUrl.searchParams.set("api_key", apiKey);
    nasaUrl.searchParams.set("date", date);

    const nasaResponse = await fetch(nasaUrl, { cache: "no-store" });
    if (!nasaResponse.ok) {
      const message = nasaResponse.status === 429
        ? "O limite de consultas da NASA foi atingido. Tente novamente mais tarde."
        : `A API da NASA respondeu com erro (HTTP ${nasaResponse.status}). Verifique a chave e tente novamente.`;
      sendJson(response, 502, { error: message });
      return;
    }

    const data = await nasaResponse.json();
    if (data.code || data.msg) {
      sendJson(response, 502, {
        error: "A API da NASA não conseguiu buscar o APOD. Verifique a chave e tente novamente.",
      });
      return;
    }

    const isNasaLogo = data.title === "NASA Science"
      && typeof data.url === "string"
      && data.url.includes("/nasa-logo@2x.png");
    if (isNasaLogo) {
      sendJson(response, 502, {
        error: "A NASA retornou uma imagem padrão em vez do APOD. Verifique a chave da API e tente novamente.",
      });
      return;
    }

    sendJson(response, 200, data);
  } catch (error) {
    console.error(`NASA API request failed (${error.name}).`);
    sendJson(response, 502, {
      error: "Não foi possível conectar à API da NASA. Verifique sua conexão e tente novamente.",
    });
  }
}

function serveStaticFile(requestUrl, request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  const file = staticFiles.get(requestUrl.pathname);
  if (!file) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  const [fileName, contentType] = file;
  fs.readFile(path.join(__dirname, fileName), (error, content) => {
    if (error) {
      response.writeHead(500);
      response.end("Unable to read application file");
      return;
    }

    response.writeHead(200, {
      "Cache-Control": "no-cache",
      "Content-Type": contentType,
    });
    response.end(request.method === "HEAD" ? undefined : content);
  });
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  if (requestUrl.pathname === "/api/apod") {
    if (request.method !== "GET") {
      response.writeHead(405, { Allow: "GET" });
      response.end();
      return;
    }

    handleApod(requestUrl, response);
    return;
  }

  serveStaticFile(requestUrl, request, response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`diarioCosmos disponível em http://127.0.0.1:${port}`);
});
