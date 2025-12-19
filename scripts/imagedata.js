// Gallery Data with high-contrast placeholders

//Categories available:
// - landscapes
// - street
// - human nature
// - architecture

// ratio:
// '3x4' or '4x3'
// Dictates how images appears on masonry

const imageData = [
    {
        id: 1,
        src: 'images/photos/photo-1.jpg',
        hiRes: {
            useHiRes: true,
            hiResSrc: 'images/photos/hires/photo-1.webp',
        },
        category: ['landscapes'],
        alt: 'Lyttleton Harbour',
        ratio: '4x3'
    },
    {
        id: 2,
        src: 'images/photos/photo-2.jpg',
        hiRes: {
            useHiRes: true,
            hiResSrc: 'images/photos/hires/photo-2.webp',
        },
        category: ['landscapes'],
        alt: 'Christchurch Hills',
        ratio: '4x3'
    },
    {
        id: 3,
        src: 'images/photos/photo-3.jpg',
        hiRes: {
            useHiRes: true,
            hiResSrc: 'images/photos/hires/photo-3.webp',
        },
        category: ['landscapes', 'human nature'],
        alt: 'Christchurch Gondola',
        ratio: '4x3'
    },
    {
        id: 4,
        src: 'images/photos/photo-4.jpg',
        hiRes: {
            useHiRes: false,
            hiResSrc: 'images/photos/hires/photo-4.jpg',
        },
        category: ['landscapes'],
        alt: 'Views of New Brighton',
        ratio: '4x3'
    },
    {
        id: 5,
        src: 'images/photos/photo-5.jpg',
        hiRes: {
            useHiRes: false,
            hiResSrc: 'images/photos/hires/photo-5.jpg',
        },
        category: ['landscapes'],
        alt: 'Christchurch',
        ratio: '4x3'
    },
    {
        id: 6,
        src: 'images/photos/photo-6.jpg',
        hiRes: {
            useHiRes: false,
            hiResSrc: 'images/photos/hires/photo-6.jpg',
        },
        category: ['landscapes'],
        alt: 'Christchurch Hills Path',
        ratio: '4x3'
    },
    {
        id: 7,
        src: 'images/photos/photo-7.jpg',
        hiRes: {
            useHiRes: false,
            hiResSrc: 'images/photos/hires/photo-7.jpg',
        },
        category: ['human nature'],
        alt: 'Land Sea and Boardwalk',
        ratio: '3x4'
    },
    {
        id: 8,
        src: 'images/photos/photo-8.jpg',
        hiRes: {
            useHiRes: false,
            hiResSrc: 'images/photos/hires/photo-8.jpg',
        },
        category: ['street', 'architecture'],
        alt: 'St Kilda Pier Building',
        ratio: '3x4'
    },
    {
        id: 9,
        src: 'images/photos/photo-9.jpg',
        hiRes: {
            useHiRes: false,
            hiResSrc: 'images/photos/hires/photo-9.jpg',
        },
        category: ['human nature'],
        alt: 'St Kilda Pier Steps',
        ratio: '3x4'
    },
    // {
    //     id: 10,
    //     src: 'images/photos/photo-10.jpg',
    //     hiRes: {
    //          useHiRes: false,
    //          hiResSrc: 'images/photos/hires/photo-10.jpg',
    //     },
    //     category: ['human nature'],
    //     alt: 'Melbourne Skyline',
    //     ratio: '3x4'
    // },
    {
        id: 11,
        src: 'images/photos/photo-11.jpg',
        hiRes: {
            useHiRes: true,
            hiResSrc: 'images/photos/hires/photo-11.webp',
        },
        category: ['street'],
        alt: 'Luna Park',
        ratio: '3x4'
    },
    {
        id: 12,
        src: 'images/photos/photo-12.jpg',
        hiRes: {
            useHiRes: true,
            hiResSrc: 'images/photos/hires/photo-12.webp',
        },
        category: ['architecture'],
        alt: 'Australian War Memorial',
        ratio: '3x4'
    },
    {
        id: 13,
        src: 'images/photos/photo-13.jpg',
        hiRes: {
            useHiRes: false,
            hiResSrc: 'images/photos/hires/photo-13.jpg',
        },
        category: ['landscapes'],
        alt: 'Engelberg',
        ratio: '3x4'
    },
    {
        id: 14,
        src: 'images/photos/photo-14b.jpg',
        hiRes: {
            useHiRes: true,
            hiResSrc: 'images/photos/hires/photo-14.webp',
        },
        category: ['architecture', 'street'],
        alt: 'Asakusa Street',
        ratio: '3x4', positionOverride: 'bottom'
    },
    {
        id: 15,
        src: 'images/photos/photo-15.jpg',
        hiRes: {
            useHiRes: false,
            hiResSrc: 'images/photos/hires/photo-15.jpg',
        },
        category: ['human nature'],
        alt: 'Kyoto Pond',
        ratio: '4x3',
    },
    {
        id: 16,
        src: 'images/photos/photo-16.jpg',
        hiRes: {
            useHiRes: false,
            hiResSrc: 'images/photos/hires/photo-16.jpg',
        },
        category: ['human nature'],
        alt: 'Hakone Shrine',
        ratio: '3x4',
    },
    {
        id: 17,
        src: 'images/photos/photo-17.jpg',
        hiRes: {
            useHiRes: true,
            hiResSrc: 'images/photos/hires/photo-17.webp',
        },
        category: ['street'],
        alt: 'Asakusa Road',
        ratio: '3x4',
    },
    {
        id: 18,
        src: 'images/photos/photo-18.jpg',
        hiRes: {
            useHiRes: false,
            hiResSrc: 'images/photos/hires/photo-18.jpg',
        },
        category: ['landscapes'],
        alt: 'Bondi to Bronte',
        ratio: '3x4',
    },
    {
        id: 19,
        src: 'images/photos/photo-19.jpg',
        hiRes: {
            useHiRes: true,
            hiResSrc: 'images/photos/hires/photo-19.webp',
        },
        category: ['street'],
        alt: 'Kyoto House',
        ratio: '3x4',
    },
    {
        id: 20,
        src: 'images/photos/photo-20.jpg',
        hiRes: {
            useHiRes: false,
            hiResSrc: 'images/photos/hires/photo-20.jpg',
        },
        category: ['landscapes', 'human nature'],
        alt: 'Kyoto Shrine',
        ratio: '4x3',
    },
    {
        id: 21,
        src: 'images/photos/photo-21.jpg',
        hiRes: {
            useHiRes: true,
            hiResSrc: 'images/photos/hires/photo-21.webp',
        },
        category: ['landscapes'],
        alt: 'Twelve Apostles',
        ratio: '4x3',
    },
    {
        id: 22,
        src: 'images/photos/photo-22.jpg',
        hiRes: {
            useHiRes: false,
            hiResSrc: 'images/photos/hires/photo-22.jpg',
        },
        category: ['landscapes', 'human nature'],
        alt: 'Great Ocean Road',
        ratio: '4x3',
    },
    {
        id: 23,
        src: 'images/photos/photo-23.jpg',
        hiRes: {
            useHiRes: false,
            hiResSrc: 'images/photos/hires/photo-23.jpg',
        },
        category: ['landscapes'],
        alt: 'Apollo Bay',
        ratio: '4x3',
    },
    {
        id: 24,
        src: 'images/photos/photo-24.jpg',
        hiRes: {
            useHiRes: true,
            hiResSrc: 'images/photos/hires/photo-24.webp',
        },
        category: ['street'],
        alt: 'Akihabara Street',
        ratio: '3x4',
    },
    {
        id: 25,
        src: 'images/photos/photo-25.jpg',
        hiRes: {
            useHiRes: true,
            hiResSrc: 'images/photos/hires/photo-25.webp',
        },
        category: ['street'],
        alt: 'Kyoto Teahouse',
        ratio: '3x4'
    }
];