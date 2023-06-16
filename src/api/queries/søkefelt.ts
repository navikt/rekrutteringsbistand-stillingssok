import { Delsøk } from '../../søkefaner/SøkeChips';

const søkefelt = (søketermer: Set<string>, delsøk: Set<Delsøk>) => {
    if (søketermer.size === 0) return [];

    let feltManSkalSøkeI: string[] = [];

    if (delsøk.has(Delsøk.Arbeidsgiver)) {
        feltManSkalSøkeI.push('stilling.employer.name', 'stilling.employer.orgnr');
    }
    if (delsøk.has(Delsøk.Annonsetittel)) {
        feltManSkalSøkeI.push('stilling.title');
    }
    if (delsøk.has(Delsøk.Annonsetekst)) {
        feltManSkalSøkeI.push('stilling.adtext_no');
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
