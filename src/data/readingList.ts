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
        hint: 'Explores how thoughts form character, circumstances, and destiny. A foundational guide on self-direction.',
    },
    {
        title: 'How to Win Friends and Influence People',
        author: 'Dale Carnegie',
        link: 'https://www.amazon.in/How-Win-Friends-Influence-People/dp/0671027034?s=bazaar',
        hint: 'Practical advice on building meaningful personal connections and navigating human relationships.',
    },
    {
        title: 'Marketing Management',
        author: 'Philip Kotler',
        link: 'https://www.amazon.in/Marketing-Management-17th-Philip-Kotler/dp/9367138199/ref=sr_1_1_sspa?crid=3LXWM7OV5BGZC&dib=eyJ2IjoiMSJ9.sLFz-n94M3czJDqJ9PP_32HJu72s7iE60M-ItoJp6vdG_i_luKRHC5qjtvFvbwdbhaDQcAcqREZdFZ0Ed0tq4MvMlFxqTsTgReZYC_jjnP86oxfOhad4BxPUlGEJKdmeDfCW7VZbG3SKTxzuPh-YvA4b-NlscmOi4It-IP8RT0okW55U_hkkSUZ4gnB6BNKsQFpR4PmxOjdhLWS8dOlLIbyIG8aAQeS7EB0glkLcZRw.TSj1dE0pcTX9PnG4fTof_JbQM04mjr9Rv2TPs-ne3zg&dib_tag=se&keywords=marketing+management+by+philip+kotler&qid=1778389155&sprefix=Marketing%2Caps%2C567&sr=8-1-spons&aref=WM64g7r717&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1',
        hint: 'The definitive textbook on modern marketing concepts, strategies, and customer value.',
    },
    {
        title: 'Zero to One',
        author: 'Peter Thiel',
        link: 'https://www.amazon.in/Zero-One-Notes-Startups-Future/dp/0804139296',
        hint: 'A handbook on how to build a startup that creates new value, going from 0 to 1.',
    },
    {
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt & David Thomas',
        link: 'https://www.amazon.in/Pragmatic-Programmer-journey-mastery-20th/dp/0135957052',
        hint: 'Essential advice on coding, software craftsmanship, and career development for developers.',
    },
    {
        title: 'Deep Work',
        author: 'Cal Newport',
        link: 'https://www.amazon.in/Deep-Work-Rules-Focused-Success/dp/0349411905',
        hint: 'Rules and insights on focusing without distraction to produce high-value results in a noisy world.',
    },
    {
        title: 'Atomic Habits',
        author: 'James Clear',
        link: 'https://www.amazon.in/Atomic-Habits-James-Clear/dp/1847941834',
        hint: 'An easy framework to build good habits and break bad ones through tiny, consistent changes.',
    },
    {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        link: 'https://www.amazon.in/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882',
        hint: 'A guide on structural code cleanliness, refactoring patterns, and professional craftsmanship.',
    },
    {
        title: 'The Lean Startup',
        author: 'Eric Ries',
        link: 'https://www.amazon.in/The-Lean-Startup-Eric-Ries/dp/0307887898',
        hint: 'How constant innovation, rapid experimentation, and customer feedback build resilient startups.',
    },
    {
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        link: 'https://www.amazon.in/Alchemist-Paulo-Coelho/dp/8172234988',
        hint: 'A beautiful philosophical fable about pursuing your personal legend and listening to your heart.',
    },
];
