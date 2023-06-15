import { Fane } from '../../søkefaner/Søkefaner';

const søkefelt = (søketermer: Set<string>, fane: Fane) => {
    if (søketermer.size === 0) return [];

    let feltManSkalSøkeI: string[];

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

    return Array.from(søketermer).map((term) => ({
        multi_match: {
            type: 'cross_fields',
            query: term,
            fields: feltManSkalSøkeI,
            operator: 'and',
        },
    }));
};

export default søkefelt;
