export interface TechIcon {
    name: string;
    src: string;
}

export type TechGroupsType = Record<string, TechIcon[]>;

export const techGroups: TechGroupsType = {
    Frontend: [
        {
            name: 'React',
            src: 'https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB',
        },
        {
            name: 'TypeScript',
            src: 'https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white',
        },
        {
            name: 'TailwindCSS',
            src: 'https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white',
        },
        {
            name: 'Astro',
            src: 'https://img.shields.io/badge/astro-%232C2052.svg?style=for-the-badge&logo=astro&logoColor=white',
        },
        {
            name: 'Next JS',
            src: 'https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white',
        },
    ],
    Backend: [
        {
            name: 'NodeJS',
            src: 'https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white',
        },
        {
            name: 'Express.js',
            src: 'https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB',
        },
        {
            name: 'Python',
            src: 'https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54',
        },
        {
            name: 'FastAPI',
            src: 'https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white',
        },
        {
            name: 'Django',
            src: 'https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white',
        },
    ],
    Cloud_Db: [
        {
            name: 'AWS',
            src: 'https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white',
        },
        {
            name: 'Google Cloud',
            src: 'https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white',
        },
        {
            name: 'Supabase',
            src: 'https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white',
        },
        {
            name: 'Postgres',
            src: 'https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white',
        },
        {
            name: 'MongoDB',
            src: 'https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white',
        },
    ],
    AI_Math: [
        {
            name: 'TensorFlow',
            src: 'https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white',
        },
        {
            name: 'PyTorch',
            src: 'https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white',
        },
        {
            name: 'Pandas',
            src: 'https://img.shields.io/badge/pandas-%23150458.svg?style=for-the-badge&logo=pandas&logoColor=white',
        },
        {
            name: 'Scikit-Learn',
            src: 'https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white',
        },
    ],
};
