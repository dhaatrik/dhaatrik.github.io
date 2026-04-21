export const getCollection = async (collection) => {
    if (collection === 'blog') {
        return [
            {
                id: 'my-first-post',
                data: {
                    title: 'First Post',
                    description: 'This is my first post',
                    pubDate: new Date('2024-01-01'),
                },
            },
        ];
    }
    if (collection === 'projects') {
        return [
            {
                data: {
                    title: 'My Project',
                    description: 'This is a test project',
                },
            },
        ];
    }
    return [];
};
