const dateInput = document.getElementById("dateInput");
const loadButton = document.getElementById("loadButton");
const status = document.getElementById("status");
const mediaContainer = document.getElementById("mediaContainer");
const title = document.getElementById("title");
const dateLabel = document.getElementById("dateLabel");
const explanation = document.getElementById("explanation");

const today = new Date().toISOString().split("T")[0];
dateInput.max = today;
dateInput.value = today;

function setStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle("error", isError);
}

function renderMedia(data) {
  mediaContainer.innerHTML = "";

  if (data.media_type === "image") {
    const image = document.createElement("img");
    image.src = data.hdurl || data.url;
    image.alt = data.title;
    image.loading = "eager";
    image.addEventListener("error", () => {
      setStatus("A imagem do APOD não pôde ser carregada. Tente novamente mais tarde.", true);
    });
    mediaContainer.appendChild(image);
    return;
  }

  if (data.media_type === "video") {
    const video = document.createElement("iframe");
    video.src = data.url;
    video.title = `${data.title} video`;
    video.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    video.referrerPolicy = "strict-origin-when-cross-origin";
    video.allowFullscreen = true;
    mediaContainer.appendChild(video);
    return;
  }

  const fallback = document.createElement("div");
  fallback.className = "fallback";
  fallback.textContent = "Conteúdo astronômico indisponível para esta data.";
  mediaContainer.appendChild(fallback);
}

function renderApod(data) {
  title.textContent = data.title || "Astronomy Picture of the Day";
  dateLabel.textContent = data.date || "";
  explanation.textContent = data.explanation || "Sem descrição disponível.";
  renderMedia(data);
}

async function getApod(date) {
  setStatus("Carregando a imagem astronômica do dia...");
  loadButton.disabled = true;

  try {
    const response = await fetch(`/api/apod?date=${encodeURIComponent(date)}`, {
      cache: "no-store",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Não foi possível carregar o APOD.");
    }

    renderApod(data);
    setStatus("Imagem carregada com sucesso.");
  } catch (error) {
    title.textContent = "Erro ao carregar";
    dateLabel.textContent = "";
    explanation.textContent = error.message || "Ocorreu um erro ao buscar os dados da NASA.";
    mediaContainer.innerHTML = "";
    setStatus(error.message || "Não foi possível carregar o APOD. Tente novamente.", true);
  } finally {
    loadButton.disabled = false;
  }
}

loadButton.addEventListener("click", () => {
  const selectedDate = dateInput.value;

  if (!selectedDate) {
    setStatus("Selecione uma data antes de continuar.", true);
    return;
  }

  getApod(selectedDate);
});

getApod(today);
