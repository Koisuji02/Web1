### 01UDFOV/01TXYOV Applicazioni Web I [2024/2025]
# Lab 2: Database e metodi
Questo laboratorio si basa direttamente sul modello di oggetti creato nel Lab 1, applicando concetti di archiviazione persistente al tuo scenario specifico di esame. Integrerai la tua applicazione JavaScript con un database locale. Nella prima parte, progetterai la struttura del database, poi implementerai funzioni per recuperare dati dal database e, nell'ultima parte, apporterai modifiche ai dati memorizzati nel database.

1. Progetta e crea il tuo database

Partendo dagli oggetti identificati durante il Lab 1:

1. Insieme al tuo gruppo, mappa gli oggetti precedentemente identificati in tabelle del database.
1. Descrivi le principali tabelle e attributi nel tuo file README.
1. Crea il tuo database SQLite[^1] e caricalo nel tuo repository.

2. Recupera dati dal database

Modifica l'applicazione sviluppata nel laboratorio precedente per implementare le seguenti capacità di recupero dati:

1. Recupera tutti gli elementi da una delle tue tabelle e restituisci una Promise che si risolve in un array di oggetti. Se utile, puoi pensare di ripetere questo passaggio per altre tabelle.
1. Recupera tutti gli elementi che rispettano una condizione specifica da una delle tue tabelle e restituisci una Promise che si risolve in un array di oggetti. Se utile, puoi pensare di ripetere questo passaggio per altre tabelle o condizioni. Possibili esempi di condizioni (che possono o meno essere rilevanti per l'argomento selezionato) sono:
   - Condizione sulle date.
   - Oggetti con attributi specifici.
   - Ricerca di sottostringhe specifiche in alcuni attributi.

Dopo aver implementato questi metodi, testa e verifica la loro funzionalità chiamando ciascun metodo e visualizzando i risultati.

3. Modifica i dati memorizzati

Prima di procedere con questo esercizio, fai una copia del file del database locale, poiché i seguenti metodi modificheranno permanentemente il suo contenuto.

Implementa i seguenti metodi di modifica dei dati:

1. Memorizza un nuovo elemento nel tuo database. Al termine, visualizza un messaggio di conferma/fallimento.
2. Elimina un elemento dal tuo database utilizzando il suo ID. Al termine, visualizza un messaggio di conferma/fallimento.
3. Aggiorna un elemento specifico o una proprietà specifica di più elementi nel tuo database. Al termine, visualizza un messaggio di conferma/fallimento.

**Note:**

1. Queste operazioni sul database devono essere implementate come metodi asincroni utilizzando Promises o async/await.
1. Come trattato nelle lezioni, puoi connetterti a un database SQLite utilizzando il modulo **sqlite3** (<https://www.npmjs.com/package/sqlite3>).
1. Per visualizzare il contenuto del database, puoi utilizzare uno dei due seguenti strumenti:
   - Estensione *SQLite Viewer* di Visual Studio Code, <https://marketplace.visualstudio.com/items?itemName=qwtel.sqlite-viewer>
   - *DB Browser for SQLite*, <https://sqlitebrowser.org/dl/>

[^1]: Puoi crearlo con DB Browser for SQLite, <https://sqlitebrowser.org/dl/>.