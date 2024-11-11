import { cn } from '@/lib/utils';
import { Asterisk } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { FadeDown, FadeUp } from '../utils/animations';

export default function Faqs() {
  return (
    <section id="faqs" className="my-32 w-full scroll-m-20">
      <div className="cont">
        <FadeDown>
          <div className="flex items-center justify-center">
            <Asterisk className="size-8 text-violet-800/80" />
            <span className="bg-gradient-to-b from-violet-400 to-purple-900 bg-clip-text text-base font-medium text-transparent">
              FAQs
            </span>
          </div>
          <h3 className="mt-3 text-center text-3xl font-medium xs:text-4xl sm:text-5xl">
            Frequently Asked Questions
          </h3>
        </FadeDown>

        <FadeUp className="mt-10">
          <Accordion type="multiple" className="relative overflow-hidden rounded-3xl px-6">
            <div className="absolute inset-0 -z-10 rounded-3xl border-2 border-violet-500/15 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
            <div className="absolute inset-0 -z-10 rounded-3xl border-2 border-violet-500/10 [mask-image:linear-gradient(to_top,black,transparent)]" />

            <div className="absolute left-0 top-0 -z-10 size-20 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="absolute right-0 top-0 -z-10 size-20 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-700/5" />

            {faqsList.map((faq, i) => (
              <AccordionItem
                value={faq.id}
                key={faq.id}
                className={cn('border-indigo-200/10 py-3', {
                  'border-b-0': i === faqsList.length - 1
                })}
              >
                <AccordionTrigger className="text-lg text-gray-400">{faq.title}</AccordionTrigger>
                <AccordionContent className="text-base text-gray-500">
                  {faq.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeUp>
      </div>
    </section>
  );
}

const faqsList = [
  {
    id: '1',
    title: 'How do I participate in an auction?',
    content:
      'Simply create an account, browse the auction listings, and place your bid on items you’re interested in. Track the auction in real-time, and if you’re the highest bidder when it ends, you win! Participating in an auction is straightforward and engaging. You can monitor the bids as they progress and ensure you stay competitive in real-time.'
  },
  {
    id: '2',
    title: 'Is it safe to make payments on SabkoBazzar?',
    content:
      'Yes, we use Stripe for secure payments, ensuring all transactions are encrypted and protected, giving you a safe shopping experience. You can shop confidently knowing your financial details are securely processed, and your data is safeguarded at every step of your purchase.'
  },
  {
    id: '3',
    title: 'Can I sell my own products on SabkoBazzar?',
    content:
      'Absolutely! Register as a seller, list your items for direct sale or auction, and reach a broad audience. Our platform is open to both buyers and sellers. Becoming a seller on SabkoBazzar is simple, and it provides access to an extensive user base ready to buy unique items through auctions or direct purchases.'
  },
  {
    id: '4',
    title: 'What happens if I win an auction but change my mind?',
    content:
      'Winning bids are considered final, and buyers are expected to complete their purchase. Please ensure you’re committed to buying before placing a bid. Our policy is designed to create a fair marketplace for everyone. Bidding should be intentional to maintain trust and reliability within our community.'
  },
  {
    id: '5',
    title: 'How is my bid amount determined in an auction?',
    content:
      "Bids increase by a set minimum amount. When you bid, the system automatically updates to the next highest bid, and you'll be notified if someone outbids you. This ensures that all participants can compete fairly, and you can strategically monitor your bid as the auction progresses."
  }
];
