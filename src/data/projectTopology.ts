export interface TopologyNode {
    layer: string;
    title: string;
    detail: string;
    badge: string;
}

export interface ProjectTopology {
    systemType: string;
    boundaryBadge: string;
    nodes: [TopologyNode, TopologyNode, TopologyNode];
}

export const PROJECT_TOPOLOGIES: Record<string, ProjectTopology> = {
    vellor: {
        systemType: 'PWA_OFFLINE_RUNTIME',
        boundaryBadge: 'ZERO_SERVER_ISOLATION',
        nodes: [
            {
                layer: 'CLIENT SURFACE',
                title: 'React 19 PWA',
                detail: 'Offline-first tutor workspace',
                badge: 'INPUT // UI',
            },
            {
                layer: 'CRYPTO ENCLAVE',
                title: 'WebCrypto AES-GCM',
                detail: 'In-memory payload cipher',
                badge: 'CORE // CIPHER',
            },
            {
                layer: 'LOCAL BOUNDARY',
                title: 'Encrypted LocalStore',
                detail: 'Isolated browser storage',
                badge: 'DATA // AT_REST',
            },
        ],
    },
    'deltav-lab': {
        systemType: 'PHYSICS_SIMULATION_CORE',
        boundaryBadge: 'WORKER_THREAD_ISOLATION',
        nodes: [
            {
                layer: 'CANVAS 2D / HUD',
                title: 'Main Thread UI',
                detail: '60Hz orbital render loop',
                badge: 'SURFACE // RENDER',
            },
            {
                layer: 'NUMERICAL ENGINE',
                title: 'Web Worker RK4',
                detail: '50Hz trajectory integrator',
                badge: 'CORE // THREAD',
            },
            {
                layer: 'FLIGHT TELEMETRY',
                title: 'Shared State Buffer',
                detail: 'In-memory mission vector',
                badge: 'OUTPUT // TELEMETRY',
            },
        ],
    },
    'bill-express': {
        systemType: 'FULLSTACK_POS_ARCHITECTURE',
        boundaryBadge: 'LOCAL_NETWORK_HOSTED',
        nodes: [
            {
                layer: 'POS SURFACE',
                title: 'React 19 + Recharts',
                detail: 'B2B/B2C billing & inventory',
                badge: 'CLIENT // RETAIL',
            },
            {
                layer: 'LOCAL API SERVICE',
                title: 'Node Express Server',
                detail: 'GST calculation & rate limits',
                badge: 'BACKEND // REST',
            },
            {
                layer: 'DATA STORAGE',
                title: 'SQLite Database',
                detail: 'HSN inventory & ledger records',
                badge: 'DATABASE // LOCAL',
            },
        ],
    },
    'the-infinite-intelligence': {
        systemType: 'MULTI_AGENT_COUNCIL',
        boundaryBadge: 'BYOK_CLIENT_ENCLAVE',
        nodes: [
            {
                layer: 'COUNCIL COCKPIT',
                title: 'React 19 + HITL',
                detail: 'Human-in-the-loop steering',
                badge: 'OPERATOR // UI',
            },
            {
                layer: 'AGENT ORCHESTRATION',
                title: 'Council Coordinator',
                detail: 'Round-robin & branch dispatch',
                badge: 'ENGINE // ROUTER',
            },
            {
                layer: 'INFERENCE GATEWAY',
                title: 'Google Gen AI SDK',
                detail: 'Gemini 2.5 & Gemma models',
                badge: 'LLM // INFERENCE',
            },
        ],
    },
    readaloud_chromeextension: {
        systemType: 'MV3_EXTENSION_SANDBOX',
        boundaryBadge: 'CLIENT_EXTENSION_RUNTIME',
        nodes: [
            {
                layer: 'CONTENT SCRIPT',
                title: 'DOM Article Parser',
                detail: 'CSS Highlight API & text tree',
                badge: 'BROWSER // DOM',
            },
            {
                layer: 'BACKGROUND WORKER',
                title: 'MV3 Service Worker',
                detail: 'Audio state & playback queue',
                badge: 'CORE // SERVICE',
            },
            {
                layer: 'SPEECH SYNTHESIS',
                title: 'Native chrome.tts',
                detail: 'OS voice engine pipeline',
                badge: 'HARDWARE // TTS',
            },
        ],
    },
    'expense-vs-investment-tracker': {
        systemType: 'DUAL_LEDGER_CALCULATOR',
        boundaryBadge: 'CLIENT_SIDE_FINANCE',
        nodes: [
            {
                layer: 'FINANCE DASHBOARD',
                title: 'React 19 + Recharts',
                detail: 'Expense vs investment analytics',
                badge: 'UI // DASHBOARD',
            },
            {
                layer: 'CALCULATION CORE',
                title: 'Zustand State Store',
                detail: 'Dual-ledger balance math',
                badge: 'STATE // LEDGER',
            },
            {
                layer: 'DATA BACKUP',
                title: 'LocalStorage JSON',
                detail: 'Zero telemetry client vault',
                badge: 'VAULT // OFFLINE',
            },
        ],
    },
    'free-markdown-to-pdf-converter': {
        systemType: 'BROWSER_PRINT_PIPELINE',
        boundaryBadge: 'ZERO_SERVER_PRINT',
        nodes: [
            {
                layer: 'SPLIT EDITOR',
                title: 'Markdown Input Pane',
                detail: 'Real-time text & frontmatter',
                badge: 'INPUT // EDITOR',
            },
            {
                layer: 'PARSER ENGINE',
                title: 'React-Markdown + GFM',
                detail: 'Prism syntax & HTML tree',
                badge: 'RENDER // AST',
            },
            {
                layer: 'EXPORT PIPELINE',
                title: 'Native Browser Print',
                detail: '@media print PDF rasterizer',
                badge: 'OUTPUT // PDF',
            },
        ],
    },
    'seamless-qr-dining': {
        systemType: 'MULTI_SURFACE_ORDER_BUS',
        boundaryBadge: 'CLIENT_CONTEXT_SYNC',
        nodes: [
            {
                layer: 'DINER SURFACE',
                title: 'Customer QR Menu',
                detail: 'Table join & dish selection',
                badge: 'SURFACE // PATRON',
            },
            {
                layer: 'ORDER BUS',
                title: 'React Context State',
                detail: 'Cross-surface event pipeline',
                badge: 'BUS // STATE',
            },
            {
                layer: 'KITCHEN SURFACE',
                title: 'KDS Kanban Display',
                detail: 'Live order tickets & prep queue',
                badge: 'SURFACE // KITCHEN',
            },
        ],
    },
    fueldrop: {
        systemType: 'GEOSPATIAL_DISPATCH_SIM',
        boundaryBadge: 'CLIENT_TELEMETRY_DEMO',
        nodes: [
            {
                layer: 'CUSTOMER APP',
                title: 'Ordering Interface',
                detail: 'Fuel selection & scheduled drops',
                badge: 'SURFACE // CLIENT',
            },
            {
                layer: 'DISPATCH SIM',
                title: 'Route & Distance Core',
                detail: 'Simulated vehicle routing',
                badge: 'CORE // ROUTING',
            },
            {
                layer: 'CAPTAIN COCKPIT',
                title: 'Leaflet Map Telemetry',
                detail: 'Simulated driver coordinates',
                badge: 'GEO // MAPPING',
            },
        ],
    },
    glassbox: {
        systemType: 'SENTIMENT_ANALYSIS_GRID',
        boundaryBadge: 'LLM_SIGNAL_ENCLAVE',
        nodes: [
            {
                layer: 'FEEDBACK TERMINAL',
                title: 'Neural Kanban Grid',
                detail: 'Employee pulse & signal intake',
                badge: 'INTAKE // GRID',
            },
            {
                layer: 'ANALYSIS ENGINE',
                title: 'Google Gemini API',
                detail: 'Tone & sentiment scoring',
                badge: 'AI // SENTIMENT',
            },
            {
                layer: 'ANALYTICS HUB',
                title: 'Recharts Metrics',
                detail: 'MoM trajectory dashboards',
                badge: 'METRICS // VISUAL',
            },
        ],
    },
    'instant-app-opener': {
        systemType: 'PROTOCOL_RESOLVER_PWA',
        boundaryBadge: 'CLIENT_HANDOFF_ENGINE',
        nodes: [
            {
                layer: 'URL INTAKE',
                title: 'Social Link Parser',
                detail: 'Regex URI schema validator',
                badge: 'INPUT // URL',
            },
            {
                layer: 'PROTOCOL RESOLVER',
                title: 'App Intent Engine',
                detail: 'Deep link target synthesis',
                badge: 'CORE // INTENT',
            },
            {
                layer: 'HANDOFF SURFACE',
                title: 'Web Share & QR Code',
                detail: 'Native OS protocol bridge',
                badge: 'HANDOFF // BRIDGE',
            },
        ],
    },
    'vireo-wellness': {
        systemType: 'OFFLINE_WELLNESS_PROTOTYPE',
        boundaryBadge: 'MOCK_TELEMETRY_DEMO',
        nodes: [
            {
                layer: 'WELLNESS UI',
                title: 'Daily Health Surface',
                detail: 'Meal log & glucose tracker',
                badge: 'SURFACE // LOG',
            },
            {
                layer: 'SIMULATION CORE',
                title: 'Biometric State Bus',
                detail: 'Mock device data generator',
                badge: 'SIM // BIOMETRICS',
            },
            {
                layer: 'LOCAL CACHE',
                title: 'In-Memory Store',
                detail: 'Ephemeral profile vault',
                badge: 'DATA // EPHEMERAL',
            },
        ],
    },
};

const DEFAULT_TOPOLOGY: ProjectTopology = {
    systemType: 'ENGINEERING_SYSTEM',
    boundaryBadge: 'CLIENT_SANDBOX',
    nodes: [
        {
            layer: 'CLIENT SURFACE',
            title: 'Modern Web Runtime',
            detail: 'User interface & interaction layer',
            badge: 'INPUT // UI',
        },
        {
            layer: 'LOGIC ENGINE',
            title: 'Application Core',
            detail: 'State management & workflow logic',
            badge: 'CORE // LOGIC',
        },
        {
            layer: 'DATA BOUNDARY',
            title: 'Local Persistence',
            detail: 'Isolated storage & memory buffer',
            badge: 'DATA // VAULT',
        },
    ],
};

export function getProjectTopology(slug: string): ProjectTopology {
    return PROJECT_TOPOLOGIES[slug] ?? DEFAULT_TOPOLOGY;
}
