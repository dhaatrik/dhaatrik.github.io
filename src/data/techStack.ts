export interface TechIcon {
    name: string;
    src: string;
}

export type TechGroupsType = Record<string, TechIcon[]>;

export const techGroups: TechGroupsType = {
    Frontend: [
        {
            name: 'React',
            src: 'https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB',
        },
        {
            name: 'TypeScript',
            src: 'https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white',
        },
        {
            name: 'TailwindCSS',
            src: 'https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white',
        },
        {
            name: 'Astro',
            src: 'https://img.shields.io/badge/astro-%232C2052.svg?style=flat&logo=astro&logoColor=white',
        },
        {
            name: 'Next JS',
            src: 'https://img.shields.io/badge/Next-black?style=flat&logo=next.js&logoColor=white',
        },
    ],
    Backend: [
        {
            name: 'Rust',
            src: 'https://img.shields.io/badge/rust-%23000000.svg?style=flat&logo=rust&logoColor=white',
        },
        {
            name: 'NodeJS',
            src: 'https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white',
        },
        {
            name: 'Express.js',
            src: 'https://img.shields.io/badge/express.js-%23404d59.svg?style=flat&logo=express&logoColor=%2361DAFB',
        },
        {
            name: 'Python',
            src: 'https://img.shields.io/badge/python-3670A0?style=flat&logo=python&logoColor=ffdd54',
        },
        {
            name: 'FastAPI',
            src: 'https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi&logoColor=white',
        },
        {
            name: 'Django',
            src: 'https://img.shields.io/badge/django-%23092E20.svg?style=flat&logo=django&logoColor=white',
        },
    ],
    Cloud_Db: [
        {
            name: 'AWS',
            src: 'https://img.shields.io/badge/AWS-%23FF9900.svg?style=flat&logo=amazon-aws&logoColor=white',
        },
        {
            name: 'Google Cloud',
            src: 'https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=flat&logo=google-cloud&logoColor=white',
        },
        {
            name: 'Supabase',
            src: 'https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white',
        },
        {
            name: 'Postgres',
            src: 'https://img.shields.io/badge/postgres-%23316192.svg?style=flat&logo=postgresql&logoColor=white',
        },
        {
            name: 'MongoDB',
            src: 'https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat&logo=mongodb&logoColor=white',
        },
    ],
    AI_Math: [
        {
            name: 'TensorFlow',
            src: 'https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=flat&logo=TensorFlow&logoColor=white',
        },
        {
            name: 'PyTorch',
            src: 'https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=flat&logo=PyTorch&logoColor=white',
        },
        {
            name: 'Pandas',
            src: 'https://img.shields.io/badge/pandas-%23150458.svg?style=flat&logo=pandas&logoColor=white',
        },
        {
            name: 'Scikit-Learn',
            src: 'https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=flat&logo=scikit-learn&logoColor=white',
        },
    ],
};
