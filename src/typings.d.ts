type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  image: string | null;
  phone: number | null;
  lastOnline: string;
};

type Product = {
  id: string;
  title: string;
  image: string | null;
  category: 'electronics' | 'realestate' | 'art' | 'others';
  description: string | null;
  ownerId: string;
  price: number;
  addedAt: string;
  owner: User;
};
