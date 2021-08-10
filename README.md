# rekrutteringsbistand-stillingssok

Frontend for nytt stillingssøk i Rekrutteringsbistand.

Fylkes og kommuner er hentet fra [Kartverkets åpne API](https://ws.geonorge.no/kommuneinfo/v1/). I stillingsdatabasen er kommunene [hentet fra Bring](https://github.com/navikt/pam-geography#norwegian-postal-codes-county--codes-cities). For kommuner med samiske navn, er det noe mismatch mellom disse datasettene. Samiske kommunenavn er derfor hardkodet i `FylkerOgKommuner`-komponenten.

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

## For Nav-ansatte

* Dette Git-repositoriet eies av [Team inkludering i Produktområde arbeidsgiver](https://navno.sharepoint.com/sites/intranett-prosjekter-og-utvikling/SitePages/Produktomr%C3%A5de-arbeidsgiver.aspx).
* Slack-kanaler:
    * [#inkludering-utvikling](https://nav-it.slack.com/archives/CQZU35J6A)
    * [#arbeidsgiver-utvikling](https://nav-it.slack.com/archives/CD4MES6BB)
    * [#arbeidsgiver-general](https://nav-it.slack.com/archives/CCM649PDH)

## For folk utenfor Nav

* Opprett gjerne en issue i Github for alle typer spørsmål
* IT-utviklerne i Github-teamet https://github.com/orgs/navikt/teams/arbeidsgiver
* IT-avdelingen i [Arbeids- og velferdsdirektoratet](https://www.nav.no/no/NAV+og+samfunn/Kontakt+NAV/Relatert+informasjon/arbeids-og-velferdsdirektoratet-kontorinformasjon)
