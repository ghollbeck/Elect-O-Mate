import os
import json

# Daten als Liste von Dictionaries
data = [
    {
      "value": "atde",
      "label": "Österreich",
      "countryCode": "AT"
  },
  {
      "value": "aten",
      "label": "Austria",
      "countryCode": "AT"
  },
  {
      "value": "benl",
      "label": "Belgien",
      "countryCode": "BE"
  },
  {
      "value": "benl",
      "label": "Belgium",
      "countryCode": "BE"
  },
  {
      "value": "bgbg",
      "label": "България",
      "countryCode": "BG"
  },
  {
      "value": "bgen",
      "label": "Bulgaria",
      "countryCode": "BG"
  },
  {
      "value": "dede",
      "label": "Deutschland",
      "countryCode": "DE"
  },
  {
      "value": "deen",
      "label": "Germany",
      "countryCode": "DE"
  },
  {
      "value": "dkda",
      "label": "Dänemark",
      "countryCode": "DK"
  },
  {
      "value": "dken",
      "label": "Denmark",
      "countryCode": "DK"
  },
  {
      "value": "eeet",
      "label": "Estonia",
      "countryCode": "EE"
  },
  {
      "value": "eeen",
      "label": "Estonia",
      "countryCode": "EE"
  },
  {
      "value": "eses",
      "label": "España",
      "countryCode": "ES"
  },
  {
      "value": "esen",
      "label": "Spain",
      "countryCode": "ES"
  },
  {
      "value": "fifi",
      "label": "Suomi",
      "countryCode": "FI"
  },
  {
      "value": "fien",
      "label": "Finland",
      "countryCode": "FI"
  },
  {
      "value": "frfr",
      "label": "France",
      "countryCode": "FR"
  },
  {
      "value": "fren",
      "label": "France",
      "countryCode": "FR"
  },
  {
      "value": "elel",
      "label": "Ελλάδα",
      "countryCode": "GR"
  },
  {
      "value": "elen",
      "label": "Greece",
      "countryCode": "GR"
  },
  {
      "value": "hrhr",
      "label": "Hrvatska",
      "countryCode": "HR"
  },
  {
      "value": "hren",
      "label": "Croatia",
      "countryCode": "HR"
  },
  {
      "value": "huhu",
      "label": "Magyarország",
      "countryCode": "HU"
  },
  {
      "value": "huen",
      "label": "Hungary",
      "countryCode": "HU"
  },
  {
      "value": "ieen",
      "label": "Ireland",
      "countryCode": "IE"
  },
  {
      "value": "ieen",
      "label": "Ireland",
      "countryCode": "IE"
  },
  {
      "value": "itit",
      "label": "Italia",
      "countryCode": "IT"
  },
  {
      "value": "iten",
      "label": "Italy",
      "countryCode": "IT"
  },
  {
      "value": "ltlt",
      "label": "Lietuva",
      "countryCode": "LT"
  },
  {
      "value": "lten",
      "label": "Lithuania",
      "countryCode": "LT"
  },
  {
      "value": "lufr",
      "label": "Luxembourg",
      "countryCode": "LU"
  },
  {
      "value": "luen",
      "label": "Luxembourg",
      "countryCode": "LU"
  },
  {
      "value": "lvlv",
      "label": "Latvija",
      "countryCode": "LV"
  },
  {
      "value": "lven",
      "label": "Latvia",
      "countryCode": "LV"
  },
  {
      "value": "mten",
      "label": "Malta",
      "countryCode": "MT"
  },
  {
      "value": "mten",
      "label": "Malta",
      "countryCode": "MT"
  },
  {
      "value": "nlnl",
      "label": "Nederland",
      "countryCode": "NL"
  },
  {
      "value": "nlen",
      "label": "Netherlands",
      "countryCode": "NL"
  },
  {
      "value": "plpl",
      "label": "Polska",
      "countryCode": "PL"
  },
  {
      "value": "plen",
      "label": "Poland",
      "countryCode": "PL"
  },
  {
      "value": "ptpt",
      "label": "Portugal",
      "countryCode": "PT"
  },
  {
      "value": "pten",
      "label": "Portugal",
      "countryCode": "PT"
  },
  {
      "value": "roro",
      "label": "România",
      "countryCode": "RO"
  },
  {
      "value": "roen",
      "label": "Romania",
      "countryCode": "RO"
  },
  {
      "value": "sesv",
      "label": "Sverige",
      "countryCode": "SE"
  },
  {
      "value": "seen",
      "label": "Sweden",
      "countryCode": "SE"
  },
  {
      "value": "sisl",
      "label": "Slovenija",
      "countryCode": "SI"
  },
  {
      "value": "sien",
      "label": "Slovenia",
      "countryCode": "SI"
  },
  {
      "value": "sken",
      "label": "Slovensko",
      "countryCode": "SK"
  },
  {
      "value": "sken",
      "label": "Slovakia",
      "countryCode": "SK"
  }
]

# Erstelle Ordner und schreibe JSON-Dateien
for entry in data:
    value = entry["value"]
    folder_name = f"./{value}"
    os.makedirs(folder_name, exist_ok=True)  # Erstelle den Ordner, falls er nicht existiert
    filename = os.path.join(folder_name, "translation.json")
    with open(filename, "w") as file:
        json.dump(entry, file, indent=4)

print("Ordner und JSON-Dateien erfolgreich erstellt.")
