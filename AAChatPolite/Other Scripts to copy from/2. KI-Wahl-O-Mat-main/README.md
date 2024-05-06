# Bayernwahl Projekt

## Übersicht

Das `Bayernwahl` Projekt hilft dir bei der Entscheidungsfindung für die Bayernwahlen. Es verwendet PDFs von politischen Parteien und Skripte, um relevante Informationen für deine Fragen abzurufen und zu verarbeiten.

## Dateien im Repository

- **`.env`**: Beinhaltet umgebungsspezifische Variablen.

- **`.env.example`**: Eine Vorlage, um die Umgebungsvariablen entsprechend einzurichten.

- **`.gitignore`**: Listet Dateien und Ordner, die von Git ignoriert werden sollen.

- **`bot.py`**: Das Hauptskript, welches einen interaktiven Terminal-Chatbot erstellt.

- **`code.ipynb`**: Ein Jupyter Notebook mit verschiedenen Code-Ausschnitten und deren Ergebnissen.

- **Partei PDFs**:

  - `csu.pdf`
  - `freiewähler.pdf`
  - `grüne.pdf`

  Dies sind Ressourcen von verschiedenen politischen Parteien.

- **`vectorstore.pkl`**: Eine Pickle-Datei, die Vektordaten für effiziente Abfragen speichert.

- **`README.md`**: Diese Dokumentationsdatei.

## Benutzungsanleitung

1. Stelle sicher, dass alle benötigten Pakete installiert sind.
2. Richte die `.env` Datei ein, indem du `.env.example` als Vorlage nimmst.
3. Starte `bot.py`, um mit dem Chatbot zu interagieren.

## Hinweis

Bitte beachte, dass die von OpenAI generierten Informationen möglicherweise ungenau sind, insbesondere in Bezug auf spezifische Details der Parteien.
