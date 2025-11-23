// Crypto King Content Data
const cryptoKingContent = {
    videos: [
        {
            id: 'vid2',
            type: 'video',
            title: 'Crypto Bull Run: Is $3T Inevitable?',
            author: 'Crypto King',
            avatar: 'C',
            views: '45K views',
            duration: '22:18',
            timestamp: '5 days ago',
            thumbnail: '#',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - replace with actual video
            description: 'In this deep dive, we analyze whether the crypto market cap hitting $3 trillion is inevitable. We look at institutional adoption, regulatory clarity, and on-chain metrics that suggest a major bull run is coming.',
            relatedIndices: [
                {
                    id: 3,
                    name: 'Crypto Volatility',
                    finfluencer: 'Crypto King',
                    avatar: 'C'
                }
            ],
            comments: [
                { user: 'HODLer', text: 'To the moon! 🚀', timestamp: '4 days ago' },
                { user: 'Skeptic', text: 'Be careful of the volatility.', timestamp: '5 days ago' },
                { user: 'CryptoNewbie', text: 'Thanks for explaining the fundamentals so clearly!', timestamp: '3 days ago' },
                { user: 'BTCMaxi', text: 'Bitcoin dominance will lead the way.', timestamp: '2 days ago' },
                { user: 'AltcoinHunter', text: 'What about altcoin season?', timestamp: '1 day ago' }
            ]
        }
    ],
    blogs: [
        {
            id: 'blog2',
            type: 'blog',
            title: 'DeFi Yield Farming: Risk vs Reward',
            author: 'Crypto King',
            avatar: 'C',
            views: '8.7K reads',
            readTime: '12 min read',
            timestamp: '4 days ago',
            thumbnail: '#',
            description: 'A comprehensive guide to understanding yield farming in DeFi, covering impermanent loss, smart contract risks, and how to maximize returns while minimizing exposure.',
            relatedIndices: [
                {
                    id: 3,
                    name: 'Crypto Volatility',
                    finfluencer: 'Crypto King',
                    avatar: 'C'
                }
            ],
            comments: [
                { user: 'YieldFarmer', text: 'The impermanent loss section was super helpful!', timestamp: '3 days ago' },
                { user: 'DeFiSkeptic', text: 'Still too risky for me but appreciate the balanced view.', timestamp: '2 days ago' },
                { user: 'SmartContractDev', text: 'You should mention the smart contract audit aspect more.', timestamp: '1 day ago' },
                { user: 'Crypto King', text: '@SmartContractDev Great point! I\'ll add that in a follow-up post.', timestamp: '1 day ago' }
            ]
        }
    ]
};

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = cryptoKingContent;
}
