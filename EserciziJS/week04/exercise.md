# Esercizio 5: Server API per Domande e Risposte

_Obiettivo: Creare un server API per un'applicazione di Domande e Risposte._

Progetta e implementa un server API HTTP in Express per un'applicazione di esempio di Domande e Risposte, chiamata "HeapOverrun". Partendo dal progetto template `qa-server` disponibile nella cartella della Settimana 04:

- Definisci un set di API HTTP per ciascuna delle operazioni necessarie su Domande e Risposte, nel documento `README.md`.
    - Le operazioni possono includere elencare, creare, aggiungere, modificare, ...
    - Per ogni API, definisci il metodo HTTP, l'URL (con parametri), il corpo della richiesta (se presente), il corpo della risposta (se presente), i codici di stato in caso di successo o errore (con il relativo corpo di errore).
- Rivedi il database SQLite sviluppato la scorsa settimana (Settimana 03), nell'Esercizio 4, e il codice correlato. Se manca ancora qualche query SQL nel codice, completala.
- Implementa un server HTTP utilizzando Express, contenente le rotte HTTP per le API definite, ed eseguendo le query SQL appropriate sul database.
    - Ricorda di effettuare la validazione lato server dei valori di input e di garantire l'integrità del database.

Nota: la fase di **Progettazione** delle API non ha una soluzione unica, ci sono molte opzioni da esplorare, con i loro pro e contro. Ne discuteremo alcune in classe.
