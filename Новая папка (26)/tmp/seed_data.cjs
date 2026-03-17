const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lsiazowkjhzegwxurwin.supabase.co';
const supabaseAnonKey = 'sb_publishable_rSqpVhiPUC9BqtNsmksUEw_buD7t36F';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const products = [
    {
        title: 'Samsung Galaxy S23 Ultra',
        price: '1,100$',
        location: 'Toshkent',
        category_id: 1, // Telefonlar
        image_url: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=600',
        description: 'Aloqa uchun: +998 90 123 45 67. Yangi, karobka ochilmagan. 1 yil kafolat.',
        seller_name: 'Alijon',
        seller_joined: '2022'
    },
    {
        title: 'Chevrolet Gentra 2023',
        price: '14,800$',
        location: 'Namangan',
        category_id: 2, // Transport
        image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600',
        description: 'Aloqa uchun: +998 91 222 33 44. Salondan chiqqan, rangi oq, lyuk bor.',
        seller_name: 'Avto Center',
        seller_joined: '2020'
    },
    {
        title: '3-xonali kvartira, Chilonzor',
        price: '75,000$',
        location: 'Toshkent',
        category_id: 3, // Ko\'chmas mulk
        image_url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600',
        description: 'Aloqa uchun: +998 93 444 55 66. Evro remont, hamma jihozlari bilan. Makler emasman.',
        seller_name: 'Sardor',
        seller_joined: '2018'
    },
    {
        title: 'Yumshoq divan (Mebel)',
        price: '4,500,000 so\'m',
        location: 'Farg\'ona',
        category_id: 4, // Uy jihozlari
        image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
        description: 'Aloqa uchun: +998 94 555 66 77. Turkiya mahsuloti, matosi sifatli. Yetkazib berish bepul.',
        seller_name: 'Mebel_Lux',
        seller_joined: '2023'
    },
    {
        title: 'Oshxona stoli va 6 ta stul',
        price: '2,800,000 so\'m',
        location: 'Andijon',
        category_id: 4, // Uy jihozlari
        image_url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600',
        description: 'Aloqa uchun: +998 95 666 77 88. Yog\'ochdan yasalgan, holati yangi.',
        seller_name: 'SifatMebel',
        seller_joined: '2021'
    },
    {
        title: 'MacBook Air M2 2023',
        price: '1,350$',
        location: 'Buxoro',
        category_id: 5, // Elektronika
        image_url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600',
        description: 'Aloqa uchun: +998 97 777 88 99. Sikli 15 ta, xuddi yangidek. Space Gray.',
        seller_name: 'TechStore',
        seller_joined: '2019'
    },
    {
        title: 'Tog\' velosipedi TRINX',
        price: '350$',
        location: 'Toshkent',
        category_id: 6, // Velosipedlar
        image_url: 'https://images.unsplash.com/photo-1576435728678-be95f39e8ab1?w=600',
        description: 'Aloqa uchun: +998 99 888 99 00. Alyuminiy rama, 24 ta tezlik. Shinalari yangi.',
        seller_name: 'VeloMaster',
        seller_joined: '2022'
    },
    {
        title: 'Grafik Dizayner kerak',
        price: 'Kelishilgan',
        location: 'Masofaviy',
        category_id: 7, // Ish o\'rinlari
        image_url: 'https://images.unsplash.com/photo-1572044162444-ad60f128bde2?w=600',
        description: 'Aloqa uchun: +998 90 123 45 67. Kompaniyaya tajribali dizayner kerak. Ish vaqti erkin.',
        seller_name: 'Creative Agency',
        seller_joined: '2020'
    }
];

async function seed() {
    const { data, error } = await supabase.from('products').insert(products);
    if (error) {
        console.error('Error seeding data:', error);
    } else {
        console.log('Seeded successfully:', data);
    }
}

seed();
