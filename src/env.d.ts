/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly DEV: boolean;
    readonly PUBLIC_GIT_SHA?: string;
}

declare module '@fontsource/nunito';
