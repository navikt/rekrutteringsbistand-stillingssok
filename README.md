# rekrutteringsbistand-stillingssok

Frontend for nytt stillingssøk i Rekrutteringsbistand.

Fylkes og kommuner er hentet fra [Kartverkets åpne API](https://ws.geonorge.no/kommuneinfo/v1/). I stillingsdatabasen er kommunene [hentet fra Bring](https://github.com/navikt/pam-geography#norwegian-postal-codes-county--codes-cities). For kommuner med samiske navn, er det noe mismatch mellom disse datasettene. Samiske kommunenavn er derfor hardkodet i `FylkerOgKommuner`-komponenten.

Query til Kartverket, lagres i `src/søk/geografi/fylkerOgKommuner.json`:
```
curl -X GET "https://ws.geonorge.no/kommuneinfo/v1/fylkerkommuner?filtrer=fylkesnavn%2Cfylkesnummer%2Ckommuner.kommunenavnNorsk%2Ckommuner.kommunenummer" -H "accept: application/json"
```

## Installasjon

```
npm install
```

## Utvikling

### Mot søk i prod

```
npm start
```

For å søke mot produksjonsmiljøet må du manuelt legge til en cookie `isso-idtoken` med gyldig token. Denne kan f.eks hentes med innlogget bruker i Rekrutteringsbistand.

For at proxy mot Elastic Search skal fungere må du kjøre med [Naisdevice](https://github.com/nais/device).

### Med mock

```
npm run start:mock
```

# Henvendelser

## For Nav-ansatte

* Dette Git-repositoriet eies
  av [Team tiltak og inkludering (TOI) i Produktområde arbeidsgiver](https://teamkatalog.nais.adeo.no/team/0150fd7c-df30-43ee-944e-b152d74c64d6)
  .
* Slack-kanaler:
    * [#arbeidsgiver-toi-dev](https://nav-it.slack.com/archives/C02HTU8DBSR)
    * [#arbeidsgiver-utvikling](https://nav-it.slack.com/archives/CD4MES6BB)

## For folk utenfor Nav

* Opprett gjerne en issue i Github for alle typer spørsmål
* IT-utviklerne i Github-teamet https://github.com/orgs/navikt/teams/toi
* IT-avdelingen
  i [Arbeids- og velferdsdirektoratet](https://www.nav.no/no/NAV+og+samfunn/Kontakt+NAV/Relatert+informasjon/arbeids-og-velferdsdirektoratet-kontorinformasjon)
