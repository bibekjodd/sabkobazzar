export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
export const loginLink = `${backendUrl}/api/auth/login/google?redirect=${typeof location === 'undefined' ? { origin: '' } : location.origin}`;
export const dummyUserImage = 'https://avatars.githubusercontent.com/u/110604197?v=4';
export const dummyProductImage =
  'https://cdn.sanity.io/images/tlr8oxjg/production/7b7f05720074a848850e0705779306c27da5a6cf-1065x597.png?w=3840&q=100&fit=clip&auto=format';

export const productsCategories: { title: string; value: string }[] = [
  { title: 'All', value: 'all' },
  { title: 'Art', value: 'art' },
  { title: 'Electronics', value: 'electronics' },
  { title: 'Real Estate', value: 'realestate' },
  { title: 'Others', value: 'others' }
] as const;

export const productConditions = [
  { title: 'New', value: 'new' },
  { title: 'First Class', value: 'first-class' },
  { title: 'Repariable', value: 'repairable' }
] as const;

const facebookImage = 'https://i.postimg.cc/8CHsQjWC/facebook.png';
const xImage = 'https://i.postimg.cc/BZ78tdfP/x.png';
const instagramImage = 'https://i.postimg.cc/g0drTvx5/instagram.png';

export const socialLinks = [
  { title: 'Facebook', image: facebookImage },
  { title: 'Instagram', image: instagramImage },
  { title: 'X', image: xImage }
];
