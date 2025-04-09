### 01UDFOV/01TXYOV Applicazioni Web I [2024/2025] 
# Lab 3: API con Express 
In questo laboratorio, svilupperai un semplice back-end per l'argomento d'esame scelto utilizzando il framework Express. Il back-end consisterà in un set di API per supportare le operazioni CRUD (Create, Read, Update, Delete) per i tuoi elementi. I dati continueranno a essere memorizzati nel database SQLite creato nel Lab 2. 

1. Progettazione delle API 

Progetta un set di API per supportare la tua applicazione basandoti sugli oggetti identificati e sul database creato nei laboratori precedenti. I dati passati o ricevuti dalle API devono essere in formato JSON. Le API devono consentire a un'applicazione web di: 

1. **Recuperare** l'elenco di tutti gli elementi della collezione principale. 
1. **Recuperare** un elenco di elementi con caratteristiche specifiche. 
1. **Recuperare** un elemento specifico, cioè dato il suo "id". 
1. **Creare** un nuovo elemento fornendo tutte le sue informazioni, eccetto l'"id" che sarà assegnato automaticamente dal back-end. 
1. **Aggiornare** un elemento esistente, fornendo le sue informazioni, cioè tutte le proprietà eccetto l'"id". 
1. **Aggiornare** attributi specifici di un elemento specifico. 
1. **Eliminare** un elemento esistente. 

Elenca le API progettate, insieme a una breve descrizione dei parametri e delle entità scambiate, nel file README del repository del tuo gruppo. Assicurati di identificare quali sono le collezioni e gli elementi che stai rappresentando, come visto in classe. Potresti voler seguire questa struttura per documentare ogni API: 

[Metodo HTTP] [URL, eventualmente con parametro/i] 

[Breve descrizione di cosa fa questa API] [Esempio di richiesta, con corpo (se presente)] [Esempio di risposta, con corpo (se presente)] [Risposta/e di errore (se presenti)] 

2. Implementazione delle API 

Implementa le API HTTP progettate con Express. Gli elementi sono memorizzati in modo persistente nel database SQLite creato nel Lab 2 e puoi partire dai metodi implementati in quel laboratorio. Potresti voler creare una copia di backup del database prima di modificarlo. I nuovi elementi potrebbero dover essere assegnati a un utente specifico; in tal caso, assegna il loro utente a un utente già esistente (ad esempio, l'utente con id=1). 

Ricorda di aggiungere le validazioni appropriate alle API implementate. Ad esempio, dovresti verificare che gli ID siano valori interi o che qualsiasi formato di data sia valido. 

3. Test delle API 

Testa le API realizzate con l'estensione REST Client per Visual Studio Code[^1]. A tal fine, dovrai scrivere un file API.http secondo la seguente sintassi: 

[Metodo HTTP] [URL, eventualmente con parametro/i] HTTP/1.1 content-type: application/json (se necessario) 

[Esempio di richiesta, con corpo (se presente), in formato JSON] ###

[^1]: L'estensione REST Client per Visual Studio Code è disponibile al seguente link: <https://marketplace.visualstudio.com/items?itemName=humao.rest-client>