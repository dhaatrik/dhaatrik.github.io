import { test, describe } from 'node:test';
import assert from 'node:assert';
import { resolvePrevNext } from '../../src/utils/seriesNavigation.ts';

function post(id, { pubDate, series, seriesOrder } = {}) {
    return {
        id,
        data: {
            pubDate: new Date(pubDate),
            ...(series !== undefined && { series }),
            ...(seriesOrder !== undefined && { seriesOrder }),
        },
    };
}

const deltavPosts = [
    post('deltav-lab-why-and-what', { pubDate: '2026-06-28', series: 'DeltaV Lab', seriesOrder: 1 }),
    post('deltav-lab-science', { pubDate: '2026-06-29', series: 'DeltaV Lab', seriesOrder: 2 }),
    post('deltav-lab-not-professional-grade', {
        pubDate: '2026-06-30',
        series: 'DeltaV Lab',
        seriesOrder: 3,
    }),
    post('deltav-lab-mission-log', { pubDate: '2026-06-17', series: 'DeltaV Lab', seriesOrder: 4 }),
    post('deltav-lab-flight-computer', {
        pubDate: '2026-06-27',
        series: 'DeltaV Lab',
        seriesOrder: 5,
    }),
    post('deltav-lab-scrollytelling-demo', {
        pubDate: '2026-05-29',
        series: 'DeltaV Lab',
        seriesOrder: 6,
    }),
];

const pedagogy = post('my-ways-of-teaching', { pubDate: '2026-04-01' });
const allPosts = [...deltavPosts, pedagogy];

describe('resolvePrevNext', () => {
    test('series post uses seriesOrder neighbors', () => {
        const science = deltavPosts[1];
        const { prevPost, nextPost, isSeriesNav } = resolvePrevNext(science, allPosts);

        assert.equal(isSeriesNav, true);
        assert.equal(prevPost?.id, 'deltav-lab-why-and-what');
        assert.equal(nextPost?.id, 'deltav-lab-not-professional-grade');
    });

    test('non-series post uses global pubDate chronology', () => {
        const chronPosts = [
            post('older', { pubDate: '2026-01-01' }),
            pedagogy,
            post('newer', { pubDate: '2026-12-01' }),
        ];
        const { prevPost, nextPost, isSeriesNav } = resolvePrevNext(pedagogy, chronPosts);

        assert.equal(isSeriesNav, false);
        assert.equal(prevPost?.id, 'older');
        assert.equal(nextPost?.id, 'newer');
    });

    test('first and last series posts have null edge neighbors', () => {
        const first = resolvePrevNext(deltavPosts[0], allPosts);
        assert.equal(first.prevPost, null);
        assert.equal(first.nextPost?.id, 'deltav-lab-science');

        const last = resolvePrevNext(deltavPosts[5], allPosts);
        assert.equal(last.prevPost?.id, 'deltav-lab-flight-computer');
        assert.equal(last.nextPost, null);
    });
});