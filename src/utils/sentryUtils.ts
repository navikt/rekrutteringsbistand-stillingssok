import { Breadcrumb, Event } from '@sentry/types';

export const fjernPersonopplysninger = (event: Event): Event => {
    const url = event.request?.url ? maskerPersonopplysninger(event.request.url) : '';

    return {
        ...event,
        request: {
            ...event.request,
            url,
            headers: {
                Referer: maskerPersonopplysninger(event.request?.headers?.Referer) || '',
            },
        },
        breadcrumbs: (event.breadcrumbs || []).map((breadcrumb: Breadcrumb) => ({
            ...breadcrumb,
            message: maskerPersonopplysninger(breadcrumb.message),
            data: {
                ...breadcrumb.data,
                url: maskerPersonopplysninger(breadcrumb.data?.url),
                from: maskerPersonopplysninger(breadcrumb.data?.from),
                to: maskerPersonopplysninger(breadcrumb.data?.to),
            },
        })),
    };
};

const maskeringsregler = [
    {
        regex: /[A-Z]{2}[0-9]{6}/g,
        erstatning: '<kandidatnr>',
    },
    {
        regex: /PAM0[a-z0-9]{8}/g,
        erstatning: '<kandidatnr>',
    },
    {
        regex: /[0-9]{11}/g,
        erstatning: '<fnr>',
    },
];

export const maskerPersonopplysninger = (tekst?: string) => {
    if (!tekst) return undefined;

    let maskert = tekst;
    maskeringsregler.forEach(({ regex, erstatning }) => {
        maskert = maskert.replace(regex, erstatning);
    });

    return maskert;
};

export const getMiljø = (): string => {
    const pathname = window.location.hostname;
    if (pathname.includes('nais.adeo.no')) {
        return 'prod-fss';
    } else if (pathname.includes('nais.preprod.local') || pathname.includes('dev.adeo.no')) {
        return 'dev-fss';
    } else {
        return 'local';
    }
};
