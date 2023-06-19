import { Søkefelt } from '../../søkefelter/Søkefelter';

const søkefelt = (søketermer: Set<string>, felter: Set<Søkefelt>) => {
    if (søketermer.size === 0) return [];

    let feltManSkalSøkeI: string[] = [];

    if (felter.has(Søkefelt.Arbeidsgiver)) {
        feltManSkalSøkeI.push('stilling.employer.name', 'stilling.employer.orgnr');
    }

    if (felter.has(Søkefelt.Annonsetittel)) {
        feltManSkalSøkeI.push('stilling.title');
    }

    if (felter.has(Søkefelt.Annonsetekst)) {
        feltManSkalSøkeI.push('stilling.adtext_no');
    }

    if (felter.has(Søkefelt.Annonsenummer)) {
        feltManSkalSøkeI.push('stilling.annonsenr');
    }

    if (feltManSkalSøkeI.length == 0) {
        feltManSkalSøkeI.push(
            'stilling.adtext_no^0.5',
            'stilling.title',
            'stilling.annonsenr',
            'stilling.employer.name',
            'stilling.employer.orgnr',
            'stilling.properties.jobtitle',
            'stilling.properties.arbeidsplassenoccupation',
            'stilling.properties.keywords'
        );
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
