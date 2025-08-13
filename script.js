const map = L.map('map').setView([-14.235, -51.9253], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const loadingEl = document.getElementById("loading");

function showLoading() {
  loadingEl.style.display = "block";
}

function hideLoading() {
  loadingEl.style.display = "none";
}

// Função para buscar CEP
async function buscarCEP(cep) {
  try {
    showLoading();
    const cepResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const cepData = await cepResponse.json();

    if (cepData.erro) {
      alert("CEP não encontrado.");
      hideLoading();
      return;
    }

    const endereco = `${cepData.logradouro}, ${cepData.localidade}, ${cepData.uf}`;
    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${endereco}`);
    const geoData = await geoResponse.json();

    if (geoData.length > 0) {
      const { lat, lon } = geoData[0];
      map.setView([lat, lon], 15);
      L.marker([lat, lon]).addTo(map).bindPopup(`Local encontrado: ${endereco}`).openPopup();
    } else {
      alert("Não foi possível localizar o endereço no mapa.");
    }
  } catch (error) {
    console.error("Erro na busca:", error);
    alert("Ocorreu um erro ao buscar o CEP.");
  } finally {
    hideLoading();
  }
}

document.getElementById("checkCep").addEventListener("click", () => {
  const cep = document.getElementById("cep").value.replace(/\D/g, "");
  if (cep.length === 8) {
    buscarCEP(cep);
  } else {
    alert("Digite um CEP válido com 8 números.");
  }
});

// Exemplo de função para "Ver Todos os Pontos"
document.getElementById("showAll").addEventListener("click", async () => {
  try {
    showLoading();
    // Aqui ficaria seu carregamento de pontos/GeoJSON otimizado
    // Simulação:
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert("Todos os pontos foram carregados.");
  } finally {
    hideLoading();
  }
});
