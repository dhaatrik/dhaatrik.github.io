export interface TechIcon {
    name: string;
    src: string;
    deployment?: string;
}

export type TechGroupsType = Record<string, TechIcon[]>;

export const techGroups: TechGroupsType = {
    Frontend: [
        {
            name: 'React',
            src: 'https://img.shields.io/badge/React-black?style=flat&logo=react&logoColor=white',
            deployment: 'VERCEL_EDGE',
        },
        {
            name: 'TypeScript',
            src: 'https://img.shields.io/badge/TypeScript-black?style=flat&logo=typescript&logoColor=white',
            deployment: 'SYSTEM_TYPES',
        },
        {
            name: 'TailwindCSS',
            src: 'https://img.shields.io/badge/Tailwind_CSS-black?style=flat&logo=tailwind-css&logoColor=white',
            deployment: 'UI_THEMING',
        },
        {
            name: 'Astro',
            src: 'https://img.shields.io/badge/Astro-black?style=flat&logo=astro&logoColor=white',
            deployment: 'SSG_PIPELINE',
        },
        {
            name: 'Next JS',
            src: 'https://img.shields.io/badge/Next.js-black?style=flat&logo=nextdotjs&logoColor=white',
            deployment: 'SSR_ROUTER',
        },
    ],
    Backend: [
        {
            name: 'Rust',
            src: 'https://img.shields.io/badge/Rust-black?style=flat&logo=rust&logoColor=white',
            deployment: 'WASM_CORE',
        },
        {
            name: 'NodeJS',
            src: 'https://img.shields.io/badge/Node.js-black?style=flat&logo=nodedotjs&logoColor=white',
            deployment: 'I/O_RUNTIME',
        },
        {
            name: 'Express.js',
            src: 'https://img.shields.io/badge/Express-black?style=flat&logo=express&logoColor=white',
            deployment: 'REST_APIS',
        },
        {
            name: 'Python',
            src: 'https://img.shields.io/badge/Python-black?style=flat&logo=python&logoColor=white',
            deployment: 'DATA_PIPELINE',
        },
        {
            name: 'FastAPI',
            src: 'https://img.shields.io/badge/FastAPI-black?style=flat&logo=fastapi&logoColor=white',
            deployment: 'API_GATEWAY',
        },
        {
            name: 'Django',
            src: 'https://img.shields.io/badge/Django-black?style=flat&logo=django&logoColor=white',
            deployment: 'ADMIN_PORTAL',
        },
    ],
    Cloud_Db: [
        {
            name: 'AWS',
            src: 'https://img.shields.io/badge/AWS-black?style=flat&logo=amazonwebservices&logoColor=white',
            deployment: 'INFRASTRUCTURE',
        },
        {
            name: 'Google Cloud',
            src: 'https://img.shields.io/badge/Google_Cloud-black?style=flat&logo=googlecloud&logoColor=white',
            deployment: 'COMPUTE_ENGINE',
        },
        {
            name: 'Supabase',
            src: 'https://img.shields.io/badge/Supabase-black?style=flat&logo=supabase&logoColor=white',
            deployment: 'AUTH_POSTGRES',
        },
        {
            name: 'Postgres',
            src: 'https://img.shields.io/badge/Postgres-black?style=flat&logo=postgresql&logoColor=white',
            deployment: 'DATA_STORE',
        },
        {
            name: 'MongoDB',
            src: 'https://img.shields.io/badge/MongoDB-black?style=flat&logo=mongodb&logoColor=white',
            deployment: 'DOC_STORE',
        },
    ],
    AI_Math: [
        {
            name: 'TensorFlow',
            src: 'https://img.shields.io/badge/TensorFlow-black?style=flat&logo=tensorflow&logoColor=white',
            deployment: 'NEURAL_NETS',
        },
        {
            name: 'PyTorch',
            src: 'https://img.shields.io/badge/PyTorch-black?style=flat&logo=pytorch&logoColor=white',
            deployment: 'MODEL_TRAINING',
        },
        {
            name: 'Pandas',
            src: 'https://img.shields.io/badge/Pandas-black?style=flat&logo=pandas&logoColor=white',
            deployment: 'DATA_ANALYSIS',
        },
        {
            name: 'Scikit-Learn',
            src: 'https://img.shields.io/badge/Scikit_Learn-black?style=flat&logo=scikitlearn&logoColor=white',
            deployment: 'CLASSIC_ML',
        },
    ],
    Model_Orchestration: [
        {
            name: 'Gemma 4 / Llama 3',
            src: 'https://img.shields.io/badge/Llama_/_Gemma-black?style=flat&logo=meta&logoColor=white',
            deployment: 'OPEN_WEIGHTS',
        },
        {
            name: 'Ollama',
            src: 'https://img.shields.io/badge/Ollama-black?style=flat&logo=ollama&logoColor=white',
            deployment: 'LOCAL_INFERENCE',
        },
        {
            name: 'Multi-Agent Networks',
            src: 'https://img.shields.io/badge/Multi_Agent-black?style=flat&logo=openai&logoColor=white',
            deployment: 'API_ORCHESTRATION',
        },
    ],
};
