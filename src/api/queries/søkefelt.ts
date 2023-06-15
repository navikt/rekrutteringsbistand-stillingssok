import { Fane } from '../../søkefaner/Søkefaner';

const søkefelt = (tekst: string, fane: Fane) => {
    if (!tekst) return [];

    let feltManSkalSøkeI;

    if (fane === Fane.Arbeidsgiver) {
        feltManSkalSøkeI = ['stilling.employer.name', 'stilling.employer.orgnr'];
    } else if (fane === Fane.Annonsetittel) {
        feltManSkalSøkeI = ['stilling.title'];
    } else if (fane === Fane.Annonsetekst) {
        feltManSkalSøkeI = ['stilling.adtext_no'];
    } else {
        feltManSkalSøkeI = [
            'stilling.adtext_no',
            'stilling.title',
            'stilling.annonsenr',
            'stilling.employer.name',
            'stilling.employer.orgnr',
            'stilling.properties.jobtitle',
            'stilling.properties.arbeidsplassenoccupation',
            'stilling.properties.keywords',
        ];
    }

    return [
        {
            multi_match: {
                type: 'cross_fields',
                query: tekst,
                fields: feltManSkalSøkeI,
                operator: 'or',
            },
        },
    ];
};

export default søkefelt;
