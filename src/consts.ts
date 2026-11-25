import pkg from '../package.json' with { type: 'json' };

export const SITE_TITLE = 'Dhaatrik Chowdhury | Engineering Diary & Mission Logs';
export const SITE_DESCRIPTION =
    'Honest engineering transmissions from Dhaatrik — what I built, what broke, and what I learned along the way.';
export const SITE_VERSION = `v${pkg.version}`;

export const SOCIAL_LINKS = {
    github: 'https://github.com/dhaatrik',
    linkedin: 'https://linkedin.com/in/dhaatrik',
    twitter: 'https://x.com/dhaatrik',
    medium: 'https://medium.com/@dhaatrik',
};

export const PERSON_ID = 'https://dhaatrik.github.io/#person';

export const PERSON_REF = {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Dhaatrik Chowdhury',
    url: 'https://dhaatrik.github.io/personnel/',
};

export const PERSON_SCHEMA = {
    ...PERSON_REF,
    jobTitle: 'Entrepreneur & AI Engineer',
    sameAs: Object.values(SOCIAL_LINKS),
};
