import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import './Introduksjon.less';

const Introduksjon: FunctionComponent = () => {
    return (
        <article className="introduksjon">
            <span className="introduksjon__ikon">IKON</span>
            <div className="introduksjon__tekst">
                <Undertittel className="blokk-xxs">Nytt stillingssøk</Undertittel>
                <Normaltekst className="blokk-xs">
                    Første versjon av søket har få filtreringsmuligheter, men selve søket rommer
                    flere søkeord. I tillegg til å søke på arbeidsgiver, annonsenummer og tittel,
                    kan du nå søke etter ord i selve annonseteksten. Du kan kun søke i aktive
                    stillinger.
                </Normaltekst>
                <Normaltekst>
                    Prøv det, og gi oss tilbakemelding ved å bruke tilbakemeldingsknappen nederst i
                    hjørnet.
                </Normaltekst>
            </div>
        </article>
    );
};

export default Introduksjon;
