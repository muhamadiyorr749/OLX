export const CATEGORIES = [
    { id: 1, name: 'Telefonlar', icon: '📱', color: '#ffce32' },
    { id: 2, name: 'Transport', icon: '🚗', color: '#23e5db' },
    { id: 3, name: 'Ko\'chmas mulk', icon: '🏠', color: '#3a77ff' },
    { id: 4, name: 'Uy jihozlari', icon: '🛋️', color: '#ff5636' },
    { id: 5, name: 'Elektronika', icon: '💻', color: '#CED1D3' },
    { id: 6, name: 'Velosipedlar', icon: '🏍️', color: '#002f34' },
    { id: 7, name: 'Ish o\'rinlari', icon: '💼', color: '#3a9b6d' },
    { id: 8, name: 'Xizmatlar', icon: '🛠️', color: '#ffce32' },
];

export const PRODUCTS_DATA = [
    { id: 1, title: 'iPhone 13 Pro Max - 256GB', price: '$950', location: 'Toshkent', date: 'Bugun', category: 'Telefonlar', image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=600&q=80', description: 'Holati ideal, batareya 95%. Karobka va kabeli bor.', seller: 'John Doe', sellerJoined: '2021' },
    { id: 2, title: '2020 Honda Civic Turbo', price: '$22,500', location: 'Samarqand', date: 'Kecha', category: 'Transport', image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80', description: 'Yurgani kam, bir qo\'l haydalgan. Servisda qarab turilgan.', seller: 'Car Traders', sellerJoined: '2019' },
    { id: 3, title: 'Hashamatli kvartira ijaraga', price: '$2,200/oyiga', location: 'Buxoro', date: '2 kun oldin', category: 'Ko\'chmas mulk', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80', description: '2 xona, ko\'l manzarasi bilan. Sport zal va basseyn bor.', seller: 'Real Estate Pros', sellerJoined: '2020' },
    { id: 4, title: 'Gaming PC RTX 3080', price: '$1,800', location: 'Navoiy', date: 'Bugun', category: 'Elektronika', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80', description: 'Kuchli o\'yin kompyuteri. 4k o\'yinlarni bemalol o\'ynaydi.', seller: 'GamerGuy', sellerJoined: '2023' },
    { id: 5, title: 'Sony A7III Camera', price: '$1,400', location: 'Andijon', date: '3 kun oldin', category: 'Elektronika', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80', description: 'Faqat body. Probeg < 10k. Yangidek.', seller: 'PhotoStudio', sellerJoined: '2022' },
    { id: 6, title: 'Tog\' velosipedi', price: '$450', location: 'Jizzax', date: 'Hozirgina', category: 'Velosipedlar', image: 'https://images.unsplash.com/photo-1576435728678-be95f39e8ab1?auto=format&fit=crop&w=600&q=80', description: 'Trek Marlin 7. Holati yaxshi, yaqinda sozlangan.', seller: 'OutdoorLife', sellerJoined: '2021' },

    // Expanded Data
    { id: 7, title: 'Samsung Galaxy S22 Ultra', price: '$800', location: 'Xorazm', date: 'Bugun', category: 'Telefonlar', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80', description: 'Kichik qirilgan joyi bor. Ekrani butun.', seller: 'Techie', sellerJoined: '2022' },
    { id: 8, title: 'Macbook Pro M1', price: '$1,200', location: 'Namangan', date: 'Bugun', category: 'Elektronika', image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80', description: '16GB RAM, 512GB SSD. Rangi Space Grey.', seller: 'MacFan', sellerJoined: '2020' },
    { id: 9, title: 'Zamonaviy divan to\'plami', price: '$600', location: 'Farg\'ona', date: 'Kecha', category: 'Uy jihozlari', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80', description: '3 kishilik va 2 kishilik. Kulrang mato. juda qulay.', seller: 'HomeDecor', sellerJoined: '2021' },
    { id: 10, title: 'Yog\'och ovqat stoli', price: '$350', location: 'Qashqadaryo', date: '2 kun oldin', category: 'Uy jihozlari', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80', description: 'Eman daraxtidan stol, 6 ta stuli bilan.', seller: 'FamilyMove', sellerJoined: '2023' },
    { id: 11, title: 'Rolex Submariner', price: '$12,500', location: 'Toshkent', date: 'Hozirgina', category: 'Moda', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=600&q=80', description: 'Hujjatlari bilan. 2018 model.', seller: 'WatchCollector', sellerJoined: '2015' },
    { id: 12, title: 'Nike Air Jordan 1', price: '$250', location: 'Toshkent', date: 'Kecha', category: 'Moda', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80', description: 'O\'lchami 42. Yangi karobkada.', seller: 'SneakerHead', sellerJoined: '2022' },
    { id: 13, title: 'Santexnik xizmati', price: 'Kelishilgan', location: 'Surxondaryo', date: 'Bugun', category: 'Xizmatlar', image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?auto=format&fit=crop&w=600&q=80', description: 'Tajribali santexnik barcha turdagi ishlar uchun.', seller: 'QuickFix', sellerJoined: '2019' },
    { id: 14, title: 'Harley Davidson Iron 883', price: '$8,500', location: 'Samarqand', date: '3 kun oldin', category: 'Velosipedlar', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80', description: 'Matviy qora. Exhaust yangilangan.', seller: 'RiderOne', sellerJoined: '2020' },
    { id: 15, title: 'Dasturchi (Software Engineer)', price: 'Kelishilgan', location: 'Masofaviy', date: 'Bugun', category: 'Ish o\'rinlari', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', description: 'Senior React Dasturchi qidirilmoqda.', seller: 'TechCorp', sellerJoined: '2010' },
];
