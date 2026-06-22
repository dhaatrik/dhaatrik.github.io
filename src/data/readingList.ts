export interface Book {
    title: string;
    author: string;
    link: string;
    hint?: string;
}

export const recommendedBooks: Book[] = [
    {
        title: 'As a Man Thinketh',
        author: 'James Allen',
        link: 'https://www.amazon.in/As-Man-Thinketh-James-Allen/dp/9386538172',
        hint: "The one I kept re-reading at 2am when I couldn't figure out why I was spinning my wheels — turned out I was thinking about the wrong things entirely.",
    },
    {
        title: 'How to Win Friends and Influence People',
        author: 'Dale Carnegie',
        link: 'https://www.amazon.in/How-Win-Friends-Influence-People/dp/0671027034?s=bazaar',
        hint: "Made me realise I'd been winning arguments and losing people — the follow-up question I now ask in every conversation is straight from this book.",
    },
    {
        title: 'Marketing Management',
        author: 'Philip Kotler',
        link: 'https://www.amazon.in/Marketing-Management-17th-Philip-Kotler/dp/9367138199/',
        hint: 'I used to think marketing was just ads; this book made me understand that product design, pricing, and distribution are all marketing decisions I was already making — just badly.',
    },
    {
        title: 'Zero to One',
        author: 'Peter Thiel',
        link: 'https://www.amazon.in/Zero-One-Notes-Startups-Future/dp/0804139296',
        hint: 'The chapter on secrets hit me harder than most: every project I actually care about started with something I believed that the people around me thought was wrong.',
    },
    {
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt & David Thomas',
        link: 'https://www.amazon.in/Pragmatic-Programmer-journey-mastery-20th/dp/0135957052',
        hint: "The 'broken windows' metaphor is now permanently burned into how I review code — I still catch myself thinking about it every time I push a 'quick fix'.",
    },
    {
        title: 'Deep Work',
        author: 'Cal Newport',
        link: 'https://www.amazon.in/Deep-Work-Rules-Focused-Success/dp/0349411905',
        hint: 'Gave me the vocabulary to explain why my best engineering sessions happen between 11pm and 2am — and then made me build a schedule to stop needing to do that.',
    },
    {
        title: 'Atomic Habits',
        author: 'James Clear',
        link: 'https://www.amazon.in/Atomic-Habits-James-Clear/dp/1847941834',
        hint: 'The one that made me stop heroically working at midnight and start building 20-minute morning reading blocks instead — identity-based habits actually stuck.',
    },
    {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        link: 'https://www.amazon.in/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882',
        hint: 'I disagree with about a third of the specific advice now, but reading it in my first year rewired how I think about naming things — worth it for that alone.',
    },
    {
        title: 'The Lean Startup',
        author: 'Eric Ries',
        link: 'https://www.amazon.in/The-Lean-Startup-Eric-Ries/dp/0307887898',
        hint: "Saved me from spending three months building a feature nobody asked for by introducing me to the pivot question: 'what's the fastest way to prove this wrong?'",
    },
    {
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        link: 'https://www.amazon.in/Alchemist-Paulo-Coelho/dp/8172234988',
        hint: "I re-read it every time I'm about to abandon a project mid-way — the Personal Legend concept is cheesy until you realise you've been abandoning yours repeatedly.",
    },
    {
        title: 'The Design of Everyday Things',
        author: 'Don Norman',
        link: 'https://www.amazon.in/Design-Everyday-Things-Revised-Expanded/dp/0465050654',
        hint: "Permanently broke my ability to blame users — now when something in my UI confuses people, I can't pretend it's their fault because Norman already told me whose fault it actually is.",
    },
    {
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        link: 'https://www.amazon.in/Thinking-Fast-Slow-Daniel-Kahneman/dp/0374533555',
        hint: "Hit hardest during FuelDrop's pricing architecture — I caught myself using System 1 thinking to make System 2 decisions and had to scrap two weeks of work.",
    },
];
