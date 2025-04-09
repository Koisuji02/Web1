# Indovina Chi?
Progetta e implementa un'applicazione web per giocare a una versione per un giocatore del famoso gioco da tavolo "Indovina Chi?".

Nel gioco, il giocatore deve indovinare l'identità di un "elemento" specifico tra un ampio set di elementi, facendo una serie di ipotesi successive. Il gameplay definisce un catalogo di elementi, e gli elementi sono caratterizzati da un insieme di proprietà, che possono assumere valori diversi. Ogni elemento nel catalogo ha una combinazione *unica* di valori per le sue proprietà. Tutte le proprietà devono essere definite (cioè, avere un valore) per tutti gli elementi. Il giocatore può anche aggiungere elementi personalizzati scegliendo le loro caratteristiche.

Un catalogo di elementi può coprire qualsiasi dominio, come persone famose, personaggi dei cartoni animati, dinosauri, costellazioni, pokémon, giocatori sportivi, professori, animali, fiori, ecc. Sei libero di usare la tua fantasia, e l'applicazione dovrebbe implementare **solo uno** di questi domini a tua scelta. L'insieme delle proprietà e dei loro valori deve essere personalizzato in base al tipo di elementi. Il numero di proprietà e valori dovrebbe essere definito tenendo conto delle caratteristiche del catalogo.

*Ad esempio, se gli elementi selezionati fossero animali selvatici, le proprietà potrebbero essere "alimentazione" (con valori: carnivoro, erbivoro, ...), "zampe" (con valori 0, 2 o 4), "volante" (valori sì o no), "colore" (con una vasta gamma di valori), ecc.*

Il gameplay consiste in una serie di partite di varie difficoltà (facile = 12 elementi visualizzati, medio = 24 elementi, difficile = 36 elementi). All'inizio di ogni partita, viene visualizzato l'elenco completo degli elementi possibili (mostrando un'immagine per ogni elemento in una griglia grafica bidimensionale, le immagini possono essere caricate come preferisci), e un "elemento segreto" viene scelto casualmente dal server. Si applicano le seguenti due condizioni:

1. Per evitare imbrogli, l'identità dell'elemento segreto non deve **mai** essere trasferita al client.
2. L'insieme di valori associati alle proprietà di ciascun elemento non deve essere visualizzato nella griglia, poiché il giocatore dovrebbe essere in grado di capirli dall'immagine dell'elemento.

Ogni partita consiste in una serie di ipotesi. In ogni ipotesi, il giocatore selezionerà una proprietà da un elenco e selezionerà uno dei possibili valori di quella proprietà tra le opzioni disponibili. Dopo aver confermato questa selezione, l'applicazione dirà al giocatore se l'ipotesi era corretta o meno (cioè, se il valore della proprietà dell'elemento segreto corrisponde all'ipotesi del giocatore). L'applicazione quindi "disabiliterà" tutti gli elementi sullo schermo che sono incompatibili con l'ipotesi.

*Ad esempio, se il giocatore ipotizza "volante=sì", e l'elemento segreto è un animale volante, l'applicazione confermerà l'ipotesi e disabiliterà tutti gli elementi non volanti. Se l'elemento segreto non è un animale volante, l'applicazione comunicherà che l'ipotesi è sbagliata e disabiliterà tutti gli animali volanti.*

Nota: per qualsiasi possibile sequenza di ipotesi, l'elemento segreto sarà sempre nel set di elementi ancora abilitati.

Per terminare la partita, il giocatore seleziona uno degli elementi ancora abilitati (può essere fatto solo una volta, in qualsiasi momento durante la partita, e terminerà la partita; sarà l'unica opzione se rimane solo un elemento). Se corrisponde all'elemento segreto, il giocatore vince, altrimenti perde.

Alla fine della partita, viene assegnato un punteggio:

- 0 punti se il giocatore perde;
- un punteggio intero non negativo se il giocatore vince, calcolato come (n\_items - n\_guesses \* k), dove n\_items è il numero iniziale di elementi sulla plancia e k dipende dalla difficoltà (facile: k=1, medio: k=2, difficile: k=3). Se la differenza è negativa, viene assegnato un punteggio di 0.

In altre parole, ogni "ipotesi sbagliata" ti fa perdere punti dal totale iniziale (cioè n\_items che dipende dalla difficoltà). La selezione finale non conta come ipotesi e termina la partita.

Dalla pagina principale dell'applicazione, qualsiasi utente anonimo può selezionare un livello di difficoltà, iniziare il gioco, giocare la partita completa e ricevere un punteggio (che non sarà memorizzato né ricordato).

Dalla pagina principale dell'applicazione, gli utenti registrati possono selezionare un livello di difficoltà, iniziare il gioco, giocare la partita completa e il risultato della loro partita viene ricordato e aggiunto alla cronologia personale dell'utente.

Un utente registrato può accedere a una pagina con la cronologia delle sue partite giocate, con un elenco di **solo partite completate**, mostrando per ciascuna di esse: data, difficoltà, elemento segreto, punteggio. Anche il punteggio totale dell'utente (la somma di tutti i punteggi ottenuti da quell'utente registrato) deve essere visualizzato nella stessa pagina.

L'organizzazione di queste specifiche in diverse schermate (e possibilmente su diverse rotte) è lasciata allo studente.

## Nota importante
- Come menzionato prima, l'identità dell'elemento segreto non deve **mai** essere inviata al browser (eccetto alla fine del gioco), quindi le API devono essere progettate tenendo conto di questo requisito.
