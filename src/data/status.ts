export const currentLearning =
    'Applied thermodynamics — modeling heat loss in closed systems for the FuelDrop v4 energy calculator.';

export const parseTelemetry = (telemetryStr: string) => {
    const match = telemetryStr.match(/STATUS:\s*([A-Z0-9_.-]+)/i);
    const status = match ? match[1].toUpperCase() : 'OPERATIONAL';

    let colorClass = 'bg-emerald-500 animate-pulse-emerald';
    let textClass = 'text-emerald-500 dark:text-emerald-400';
    let badgeText = status.replace(/_/g, ' ');

    const emeraldKeywords = ['RUNNING', 'OPERATIONAL', 'ACTIVE', 'LIVE'];
    const amberKeywords = ['V4_IN_DEV', 'IN_DEV', 'PROTOTYPE', 'RESEARCH_ACTIVE', 'PENDING'];
    const cyanKeywords = ['SHIPPED', 'COMPLETED', 'STABLE', 'VERIFIED', 'V4_0_0_SHIPPED'];
    const redKeywords = ['HALTED', 'OFFLINE', 'ERROR'];

    if (emeraldKeywords.some((kw) => status.includes(kw))) {
        colorClass = 'bg-emerald-500 animate-pulse-emerald';
        textClass = 'text-emerald-500 dark:text-emerald-400';
    } else if (amberKeywords.some((kw) => status.includes(kw))) {
        colorClass = 'bg-amber-500 animate-pulse-amber';
        textClass = 'text-amber-500 dark:text-amber-400';
    } else if (cyanKeywords.some((kw) => status.includes(kw))) {
        colorClass = 'bg-cyan-500 animate-pulse-cyan';
        textClass = 'text-cyan-500 dark:text-cyan-400';
    } else if (redKeywords.some((kw) => status.includes(kw))) {
        colorClass = 'bg-red-500 animate-pulse-red';
        textClass = 'text-red-500 dark:text-red-400';
    }

    return {
        colorClass,
        textClass,
        badgeText: `[ ${badgeText} ]`,
        status,
    };
};

export const getPainLevelLabel = (level: number): string => {
    const labels: Record<number, string> = {
        1: 'Low impact — minor scrape',
        2: 'Moderate — worth noting',
        3: 'Significant — changed the design',
        4: 'Heavy — weeks of rework',
        5: 'Brutal — nearly killed the project',
    };
    return labels[level] ?? `Impact level ${level} out of 5`;
};