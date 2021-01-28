import formatterMedStoreOgSmåBokstaver from './formaterMedStoreOgSmåBokstaver';

describe('formaterMedStoreOgSmåBokstaver skal formatere arbeidsgiver riktig', () => {
    test('Arbeidsgiver med mellomrom', () => {
        const arbeidsgiver = 'NORSECRAFT TEC AS';
        const formatertArbeidsgiver = formatterMedStoreOgSmåBokstaver(arbeidsgiver);

        const forventetFormatering = 'Norsecraft Tec AS';
        expect(formatertArbeidsgiver).toEqual(forventetFormatering);
    });

    test('Arbeidsgiver med bindestrek', () => {
        const arbeidsgiver = 'PLA-MEK AS';
        const formatertArbeidsgiver = formatterMedStoreOgSmåBokstaver(arbeidsgiver);

        const forventetFormatering = 'Pla-Mek AS';
        expect(formatertArbeidsgiver).toEqual(forventetFormatering);
    });

    test('Arbeidsgiver med parentes', () => {
        const arbeidsgiver = 'KIWI (OSLO)';
        const formatertArbeidsgiver = formatterMedStoreOgSmåBokstaver(arbeidsgiver);

        const forventetFormatering = 'Kiwi (Oslo)';
        expect(formatertArbeidsgiver).toEqual(forventetFormatering);
    });

    test('Arbeidsgiver med skråstrek', () => {
        const arbeidsgiver = 'KIWI/OSLO';
        const formatertArbeidsgiver = formatterMedStoreOgSmåBokstaver(arbeidsgiver);

        const forventetFormatering = 'Kiwi/Oslo';
        expect(formatertArbeidsgiver).toEqual(forventetFormatering);
    });
});
