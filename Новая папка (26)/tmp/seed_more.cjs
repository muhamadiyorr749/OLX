const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lsiazowkjhzegwxurwin.supabase.co';
const supabaseAnonKey = 'sb_publishable_rSqpVhiPUC9BqtNsmksUEw_buD7t36F';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const additionalProducts = [
    // Category 8: Xizmatlar
    {
        title: 'Ingliz tili repetitori (IELTS 8.5)',
        price: '100,000 so\'m/dars',
        location: 'Toshkent',
        category_id: 8,
        image_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600',
        description: 'Aloqa uchun: +998 90 111 22 33. Individual darslar, barcha materiallar beriladi.',
        seller_name: 'Malika',
        seller_joined: '2021'
    },
    {
        title: 'Santexnik xizmati (24/7)',
        price: 'Kelishilgan',
        location: 'Namangan',
        category_id: 8,
        image_url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600',
        description: 'Aloqa uchun: +998 90 333 44 55. Har qanday murakkablikdagi santexnika ishlari.',
        seller_name: 'Usta Maqsud',
        seller_joined: '2019'
    },
    {
        title: 'Kompyuter ta\'mirlash',
        price: '50,000 so\'m',
        location: 'Samarqand',
        category_id: 8,
        image_url: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?w=600',
        description: 'Aloqa uchun: +998 93 555 66 77. Windows o\'rnatish, tozalash, qismlarni almashtirish.',
        seller_name: 'Tech Fix',
        seller_joined: '2022'
    },
    {
        title: 'Uy tozalash xizmati',
        price: '150,000 so\'m',
        location: 'Toshkent',
        category_id: 8,
        image_url: 'https://images.unsplash.com/photo-1581578731548-c64695ce6958?w=600',
        description: 'Aloqa uchun: +998 94 777 88 99. General tozalash, sifatli va tez.',
        seller_name: 'Toza Uy',
        seller_joined: '2023'
    },

    // Category 9: Boshqa
    {
        title: 'Antikvar soat (1950)',
        price: '500$',
        location: 'Xiva',
        category_id: 9,
        image_url: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ad5?w=600',
        description: 'Aloqa uchun: +998 62 123 45 67. Zo\'r holatda, kolleksionerlar uchun.',
        seller_name: 'Antique_UZ',
        seller_joined: '2015'
    },
    {
        title: 'Gitara (Acoustic)',
        price: '800,000 so\'m',
        location: 'Qo\'qon',
        category_id: 9,
        image_url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600',
        description: 'Aloqa uchun: +998 99 111 22 33. Yangidek, g\'ilof bilan birga.',
        seller_name: 'Musiqa Olami',
        seller_joined: '2020'
    },
    {
        title: 'Shaxmat (Yog\'ochdan)',
        price: '200,000 so\'m',
        location: 'Buxoro',
        category_id: 9,
        image_url: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600',
        description: 'Aloqa uchun: +998 97 444 55 66. Qo\'lda yasalgan, sifatli yog\'och.',
        seller_name: 'Handmade UZ',
        seller_joined: '2018'
    },
    {
        title: 'Baliq akvariumi (50L)',
        price: '400,000 so\'m',
        location: 'Toshkent',
        category_id: 9,
        image_url: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600',
        description: 'Aloqa uchun: +998 91 666 77 88. Hamma filtrlari va chiroqlari bilan.',
        seller_name: 'Zootovarlar',
        seller_joined: '2022'
    }
];

async function seed() {
    const { data, error } = await supabase.from('products').insert(additionalProducts);
    if (error) {
        console.error('Error seeding data:', error);
    } else {
        console.log('Additional products seeded successfully.');
    }
}

seed();
