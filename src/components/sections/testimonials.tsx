import { dummyUserImage } from '@/lib/constants';
import { Asterisk } from 'lucide-react';
import Avatar from '../utils/avatar';

export default function Testimonials() {
  return (
    <section className="my-16 md:my-32">
      <div id="testimonials" className="cont">
        <div className="flex items-center justify-center">
          <Asterisk className="size-8 text-violet-800/80" />
          <span className="bg-gradient-to-b from-violet-400 to-purple-900 bg-clip-text text-base font-medium text-transparent">
            Testimonials
          </span>
        </div>
        <h3 className="mt-3 flex flex-col items-center text-center text-3xl font-medium xs:text-4xl sm:text-5xl">
          <span>Our Stellar Reviews</span>
          <span className="mt-2">speak for themselves</span>
        </h3>

        <div className="mt-10 flex flex-wrap justify-center">
          {reviews.map((review) => (
            <div className="h-full w-full pb-10 md:w-1/2 md:px-5 xl:w-1/3" key={review.user.name}>
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-3xl p-6">
      <div className="absolute inset-0 -z-10 rounded-3xl border-2 border-violet-500/25 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="absolute inset-0 -z-10 rounded-3xl border-2 border-violet-500/5 [mask-image:linear-gradient(to_top,black,transparent)]" />

      <div className="absolute right-0 top-0 -z-10 size-24 rounded-full bg-white/20 blur-3xl filter" />
      <div className="absolute left-0 top-0 -z-10 size-24 rounded-full bg-indigo-500/50 blur-3xl filter" />
      <div className="absolute bottom-0 right-0 -z-10 size-24 rounded-full bg-purple-700/25 blur-3xl filter" />

      <p className="text-gray-400">{review.text}</p>

      <div className="mt-auto flex items-center space-x-3 pt-7">
        <Avatar src={review.user.image || dummyUserImage} variant="lg" />
        <div className="flex flex-col">
          <span className="text-sm text-gray-200">{review.user.name}</span>
          <span className="text-xs text-gray-500">{review.user.attribute}</span>
        </div>
      </div>
    </div>
  );
}

type Review = { user: { name: string; image: string; attribute: string }; text: string };
const reviews: Review[] = [
  {
    user: {
      name: 'Nabaraj Pandit',
      image:
        'https://cdn.prod.website-files.com/657ad20cc169eb09732a41b7/657ad20cc169eb09732a42b8_1644761063099%201-12-min.png',
      attribute: 'Makeup stylist'
    },
    text: 'SabkoBazzar made online shopping so easy! I found exactly what I needed at a great price, and the auction feature is super fun!'
  },
  {
    user: {
      name: 'Vikram Pandey',
      image:
        'https://cdn.prod.website-files.com/657ad20cc169eb09732a41b7/657ad20cc169eb09732a42ae_1644761063099%201-min.png',
      attribute: 'Entrepreneur'
    },
    text: "I've tried other e-commerce sites, but SabkoBazzar's auction system is a game-changer. It’s so exciting to win a bid and get the best deals!"
  },
  {
    user: {
      name: 'Manish Paneru',
      image:
        'https://cdn.prod.website-files.com/657ad20cc169eb09732a41b7/66d909b20996182ebc189fa4_Senja%20profile%20pic.webp',
      attribute: 'Accountant'
    },
    text: 'Great experience from start to finish. Bought a few items directly, and even won a laptop in an auction at a great price!'
  },
  {
    user: {
      name: 'Kushal Thapa',
      image:
        'https://cdn.prod.website-files.com/657ad20cc169eb09732a41b7/657ad20cc169eb09732a42b9_1644761063099%201-11-min.png',
      attribute: 'Social worker'
    },
    text: 'As a seller, SabkoBazzar has helped me reach more buyers and the auction feature ensures that I always get a fair price.'
  },
  {
    user: {
      name: 'Anjan Devkota',
      image:
        'https://cdn.prod.website-files.com/657ad20cc169eb09732a41b7/657ad20cc169eb09732a42b2_1644761063099%201-4-min.png',
      attribute: 'Model'
    },
    text: 'The auction process is seamless, and I love being able to track everything in real-time. SabkoBazzar makes it exciting to shop!'
  }
];
