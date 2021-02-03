import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import Forstørrelsesglass from './Forstørrelsesglass';
import './Introduksjon.less';

const Introduksjon: FunctionComponent = () => {
    return (
        <article className="introduksjon">
            <div aria-hidden="true" className="introduksjon__ikon">
                <Forstørrelsesglass />
            </div>
            <div className="introduksjon__tekst">
                <Undertittel className="blokk-xxs">Prøv det nye stillingssøket</Undertittel>
                <Normaltekst className="blokk-xs">
                    Vi har laget et nytt søk som gir flere muligheter for treff. Du kan nå søke
                    etter ord i selve annonsen, i tillegg til å søke på arbeidsgiver, annonsenummer
                    og tittel på stillingen. I den første versjonen får du færre muligheter til å
                    filtrere søkeresultatet, og du kan bare søke på publiserte stillinger (ikke
                    utløpte).
                </Normaltekst>
                <Normaltekst>
                    Vil du prøve søket og gi oss en tilbakemelding? Bruk knappen for tilbakemelding
                    nederst.
                </Normaltekst>
            </div>
        </article>
    );
};

export default Introduksjon;
