import formaterMedStoreOgSmåBokstaver from './stringUtils';

describe('formaterMedStoreOgSmåBokstaver skal formatere arbeidsgiver riktig', () => {
    test('Arbeidsgiver med mellomrom', () => {
        const arbeidsgiver = 'NORSECRAFT TEC AS';
        const formatertArbeidsgiver = formaterMedStoreOgSmåBokstaver(arbeidsgiver);

        const forventetFormatering = 'Norsecraft Tec AS';
        expect(formatertArbeidsgiver).toEqual(forventetFormatering);
    });

    test('Arbeidsgiver med bindestrek', () => {
        const arbeidsgiver = 'PLA-MEK AS';
        const formatertArbeidsgiver = formaterMedStoreOgSmåBokstaver(arbeidsgiver);

        const forventetFormatering = 'Pla-Mek AS';
        expect(formatertArbeidsgiver).toEqual(forventetFormatering);
    });

    test('Arbeidsgiver med parentes', () => {
        const arbeidsgiver = 'KIWI (OSLO)';
        const formatertArbeidsgiver = formaterMedStoreOgSmåBokstaver(arbeidsgiver);

        const forventetFormatering = 'Kiwi (Oslo)';
        expect(formatertArbeidsgiver).toEqual(forventetFormatering);
    });

    test('Arbeidsgiver med skråstrek', () => {
        const arbeidsgiver = 'KIWI/OSLO';
        const formatertArbeidsgiver = formaterMedStoreOgSmåBokstaver(arbeidsgiver);

        const forventetFormatering = 'Kiwi/Oslo';
        expect(formatertArbeidsgiver).toEqual(forventetFormatering);
    });

    test('Skal ikke formatere hvis undefined', () => {
        const arbeidsgiver = undefined;
        const formatertArbeidsgiver = formaterMedStoreOgSmåBokstaver(arbeidsgiver);

        const forventetFormatering = undefined;
        expect(formatertArbeidsgiver).toEqual(forventetFormatering);
    });
});
