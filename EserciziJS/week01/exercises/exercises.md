# Esercizio 1: Migliori Punteggi
_Obiettivo: gestione di base degli array in JavaScript_

Sviluppa un piccolo programma JavaScript per gestire i punteggi assegnati al tuo utente in un sito di domande e risposte (ad esempio, StackOverflow). I punteggi sono numeri interi e possono essere negativi. Dovresti:

- Definire un array con tutti i punteggi ricevuti in ordine cronologico. Per il momento:
  - Inserisci i punteggi direttamente nel codice sorgente.
  - Ignora la domanda, la risposta e la data che hanno generato il punteggio.
- Duplica l'array, ma:
  - Elimina tutti i punteggi negativi (chiama `NN` il numero di punteggi negativi eliminati).
  - Elimina i due punteggi più bassi.
  - Aggiungi `NN+2` nuovi punteggi, alla fine dell'array, con un valore pari alla media (arrotondata) dei punteggi esistenti.
- Stampa entrambi gli array, confrontando i punteggi prima e dopo il "miglioramento", e mostrando le medie in entrambi i casi.

# Esercizio 2: La Mia Lista di Utenti
_Obiettivo: gestione di base delle stringhe in JavaScript_

Sviluppa un piccolo programma JS per gestire la lista degli utenti in un sito di domande e risposte.

- Definisci i nomi degli utenti come una lista separata da virgole.
  - Ad esempio: "Luigi De Russis, Luca Scibetta, Fulvio Corno, Francesca Russo"
- Analizza la stringa e crea un array contenente un nome per ogni posizione dell'array.
  - Attenzione: non devono esserci spazi extra.
- Crea un secondo array calcolando gli acronimi delle persone come le lettere iniziali del nome. Gli acronimi devono essere in maiuscolo.
  - Ad esempio, Luigi De Russis -> LDR.
- Stampa la lista risultante di acronimi e i nomi completi.
  - Extra: in ordine alfabetico di acronimo.