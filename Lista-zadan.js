window.onload = function() {
  //pobranie elementów html za pomocą ID i przypisanie do zmiennych
  var titleInput = document.getElementById("titleInput");
  var descriptionInput = document.getElementById("descriptionInput");
  var addButton = document.getElementById("addButton");
  var searchPhraseInput = document.getElementById("searchPhraseInput");
  var searchPhraseButton = document.getElementById("searchPhraseButton");
  var selectAddID = document.getElementById("selectAddID");
  var selectSearchID = document.getElementById("selectSearchID");
  var indexClickedEditButton;
  var tbodyID = document.getElementById("tbodyID");
  var arr = [];

  // showData(); <<< --- tu będzie wywołanie stanu początkowego, jeśli wykorzystam localStorage

  //dodanie do buttona add zdarzenia KLIK i funkcji, która pobierze dane z inputów i "włoży" je do tablicy
  addButton.addEventListener("click", clickedAddButton);
  // dodanie do buttona search zdarzenia klik i funkcji, która przeszukuje tablice
  searchPhraseButton.addEventListener("click", searchItem);
  //funkcja, która pobiera dane z inputów, przypisyuje wartości do tymczasowej zmiennej
  function clickedAddButton() {
    var newRequest = {
      title: titleInput.value,
      description: descriptionInput.value,
      status: selectAddID.value,
      id:
        "_" +
        Math.random()
          .toString(36)
          .substr(2, 9)
    };
    //tu będzie "wkładanie" nowego requesta do tabeli
    arr.push(newRequest);
    showData(arr);
    document.getElementById("titleInput").value = "";
    document.getElementById("descriptionInput").value = "";
  }
  // funkcja showData będzie tworzyć w pętli 1) wiersze, 2) komórki, 3) buttony: edycja, usuwanie, 4) dodanie input type="radio" do wiersza statusy
  function showData(arr) {
    //czyszczenie tablicy po każdym przejściu pętli
    tbodyID.innerHTML = "";
    //tworzymy pętle, która będzie "przechodzić" i tworzyć to, co opisałam powyżej
    for (var i = 0; i < arr.length; i++) {
      //tworzymy wiersz
      var nextRow = document.createElement("tr");
      //tworzymy zmienne dla stworzenia komórek dla buttonów edit i remove
      var createTdToEditButton = document.createElement("td");
      var createTdToRemoveButton = document.createElement("td");
      //tworzymy zmienne, do których przypisujemy stworzenie buttonów
      var createEditButton = document.createElement("button");
      var createRemoveButton = document.createElement("button");
      //wykorzystujemy funkcje >creatTd< do stworzenia nowej komórki, która pobiera wartość z tablicy i dodaje ją do
      creatTd(arr[i].title, nextRow);
      creatTd(arr[i].description, nextRow);
      creatTd(arr[i].status, nextRow);
      createTdToEditButton.appendChild(createEditButton);
      createTdToRemoveButton.appendChild(createRemoveButton);
      //zagnieżdżanie w wierszach
      nextRow.appendChild(createTdToEditButton);
      nextRow.appendChild(createTdToRemoveButton);
      //dodawanie nazwy buttonów
      createEditButton.innerText = "Edytuj";
      createEditButton.setAttribute(
        "data-index-clicked-edit-button",
        arr[i].id
      );
      createEditButton.addEventListener("click", clickedEdit);
      createRemoveButton.innerText = "Usuń";
      createRemoveButton.setAttribute(
        "data-index-clicked-remove-button",
        arr[i].id
      );
      createRemoveButton.addEventListener("click", deleteTask);
      //dodawanie klas do buttonów (bootstrap)
      createEditButton.className = "btn btn-outline-info";
      createRemoveButton.className = "btn btn-outline-danger";
      //ustawianie atrybutów dla buttonów i inputa
      //tu będzie dodawanie nazwy inputu
      //zagnieżdżenie wierszy w tbody
      tbodyID.appendChild(nextRow);
    }
  }
  // funckja, która tworzy nowy komórkę
  function creatTd(value, row) {
    var cell = document.createElement("td");
    cell.innerText = value;
    row.appendChild(cell);
    return cell;
  }

  // tworzymy funkcję dla buttona EDIT: na te funkcję będą się składać 4 mniejsze funkcje:
  // 1) potrzebujemy informacji, który button został kliknięty
  // 2) potrzebujemy indeksu miejsca, w których będa edytowane dane
  // 3) wyświetlamy dane z klikniętego edita w polach edycji, czyli inputach
  // 4) użytkownik edytuje dane, klika DODAJ - trzeba usunąć addEvent i dodac nowego addEvent a poza pętlą znów dodać, addEvent z showData

  function clickedEdit(e) {
    //dzięki nadaniu buttonowi własnego atrybutu z losowym ID możemy teraz go przywołać za pomoca funkcji event.target,
    //to informuje nas, który rekordd kliknął użytkownik
    indexClickedEditButton = e.target.getAttribute(
      "data-index-clicked-edit-button"
    );

    var editedValueInputs = arr.find(function(el) {
      return el.id == indexClickedEditButton;
    });
    //do nowej zmiennej przypisujemy za pomocą funkcji tablicę z pobranego indeksu

    fillInputEdited(editedValueInputs);
    addButton.removeEventListener("click", clickedAddButton);
    addButton.addEventListener("click", clickedEditConfirm);
  }

  function fillInputEdited(task) {
    titleInput.value = task.title;
    descriptionInput.value = task.description;
    selectAddID.value = task.status;
  }

  function clickedEditConfirm() {
    //dane które zostały zmieione przypisujemy do do zmiennej
    var editedTask = {
      title: titleInput.value,
      description: descriptionInput.value,
      status: selectAddID.value,
      id: indexClickedEditButton
    };
    //przypisujemy obiekt do miejsca w tablicy, które zostało klikniętę (miejsce pobrano w funkcji clickedEdit)
    var idexUpdate = arr.findIndex(el => {
      return el.id == indexClickedEditButton;
    });
    arr[idexUpdate] = editedTask;
    showData(arr);
    titleInput.value = "";
    descriptionInput.value = "";
    addButton.removeEventListener("click", clickedEditConfirm);
    addButton.addEventListener("click", clickedAddButton);
  }

  // funkcja, która usuwa rekordy

  function deleteTask(e) {
    var clickedRow = e.target.getAttribute("data-index-clicked-remove-button");
    var rowToRemove = arr.findIndex(el => {
      return el.id === clickedRow;
    });
    arr.splice(rowToRemove, 1);
    showData(arr);
  }

  //funkcja, która wyszukuje szukaną frazę. dzięki funkcji toUpperCase() wyrażenia szukane i będące w tablicy są konwertowane na wersaliki, tak żeby na wyszukanie nie miały wpływu małe i wielkie litery
  function searchItem() {
    //ustawiamy tymczasowa tablice do przechowywania wyszukiwania
    var temp = [];
    for (var i = 0; i < arr.length; i++) {
      if (
        arr[i].title
          .toUpperCase()
          .indexOf(searchPhraseInput.value.toUpperCase()) > -1 ||
        arr[i].description
          .toUpperCase()
          .indexOf(searchPhraseInput.value.toUpperCase()) > -1 ||
        arr[i].status.toUpperCase() == searchPhraseInput.value.toUpperCase()
      ) {
        //jeśli sie zgadza to włóż wynik do tablicy
        temp.push(arr[i]);
      }
    }
    showData(temp);
  }

  //dodanie klas do buttonów i selecta w html, które nie są tworzene w pętli
  addButton.className = "btn btn-outline-warning btn-sm";
  searchPhraseButton.className = "btn btn-outline-warning btn-sm";
  selectAddID.className = "form-control form-control-sm col-md-1";
  selectSearchID.className = "form-control form-control-sm col-md-1";
};
