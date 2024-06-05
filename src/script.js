document.addEventListener("DOMContentLoaded", function () {
  const formListar = document.getElementById("form-listar");
  const formCadastrar = document.getElementById("form-cadastrar");
  const formAtualizar = document.getElementById("form-atualizar");
  const formExcluir = document.getElementById("form-excluir");
  const resultadoDiv = document.getElementById("resultado");

  // Função para listar pets
  const listarPets = () => {
    fetch("http://44.201.237.55:8080/pet/listar")
      .then((response) => response.json())
      .then((data) => exibirListaPets(data))
      .catch((error) => console.error("Erro ao listar os pets:", error));
  };

  // Função para exibir a lista de pets
  const exibirListaPets = (data) => {
    resultadoDiv.innerHTML = "";

    if (data.pet && data.pet.length > 0) {
      const lista = document.createElement("ul");

      data.pet.forEach((pet) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Nome: ${pet.nome}, Raça: ${pet.raca}, Histórico: ${pet.historicoDoPet}, Sexo: ${pet.sexo}`;
        lista.appendChild(listItem);
      });

      resultadoDiv.appendChild(lista);
    } else {
      const mensagemParagrafo = document.createElement("p");
      mensagemParagrafo.textContent = "Nenhum pet encontrado.";
      resultadoDiv.appendChild(mensagemParagrafo);
    }
  };

  // Listar pets ao carregar a página
  listarPets();

  // Cadastrar um novo pet
  formCadastrar.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const novoPet = {
      nome: formData.get("nome"),
      raca: formData.get("raca"),
      historicoDoPet: formData.get("historico"),
      sexo: formData.get("sexo"),
    };

    // Validar a raça para conter apenas letras antes de enviar a solicitação
    if (!/^[a-zA-Z]+$/.test(novoPet.raca)) {
      alert("A raça só deve conter letras.");
      return;
    }

    fetch("http://44.201.237.55:8080/pet/cadastrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoPet),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao cadastrar o pet: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        alert(
          `Pet cadastrado com sucesso:\nNome: ${data.nome}, Histórico: ${data.historicoDoPet}, Sexo: ${data.sexo}`
        );
        listarPets();
        formCadastrar.reset();
      })
      .catch((error) => {
        console.error("Erro ao cadastrar o pet:", error.message);
        alert("Erro ao cadastrar o pet: " + error.message);
      });
  });

  // Atualizar um pet
  formAtualizar.addEventListener("submit", function (event) {
    event.preventDefault();

    const petId = document.getElementById("id-atualizar").value;
    const novoNome = document.getElementById("novo-nome").value;
    const novaRaca = document.getElementById("nova-raca").value;

    fetch(`http://44.201.237.55:8080/pet/atualizar/${petId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: novoNome, raca: novaRaca }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Pet atualizado com sucesso!");
        listarPets();
        formAtualizar.reset();
      })
      .catch((error) => alert("Erro ao atualizar o pet: " + error.message));
  });

  // Excluir um pet
  formExcluir.addEventListener("submit", function (event) {
    event.preventDefault();

    const petId = document.getElementById("id-excluir").value;

    fetch(`http://44.201.237.55:8080/pet/delete/${petId}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((data) => {
        alert("Pet excluído com sucesso!");
        listarPets();
        formExcluir.reset();
      })
      .catch((error) => alert("Erro ao excluir o pet: " + error.message));
  });

  // Evento para limpar a lista quando o botão for clicado
  document.getElementById("limparLista").addEventListener("click", () => {
    resultadoDiv.innerHTML = "";
  });
});
