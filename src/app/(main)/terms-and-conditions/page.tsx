import { Asterisk } from 'lucide-react';

export default function page() {
  return (
    <div className="cont mb-20 pt-20 text-gray-200 lg:mb-32">
      <div>
        <h1 className="mt-2 flex items-center space-x-1 text-2xl">
          <Asterisk className="inline size-8 text-violet-800/80" />
          <span className="text-gray-100">Terms and Conditions</span>
        </h1>
        <p className="mt-2 text-gray-300/80">Effective Date: November 5, 2024</p>
      </div>

      <section className="mt-7 space-y-10">
        <div>
          <h3 className="mb-1 mt-5 text-xl font-medium">Introduction</h3>
          <p className="text-gray-300/80">
            Welcome to SabkoBazzar! By accessing or using our platform, you agree to comply with
            these Terms and Conditions. Please read them carefully. If you do not agree to these
            terms, you may not use the platform.
          </p>
        </div>

        <div>
          <h3 className="mb-1 mt-5 text-xl font-medium">Account Registration</h3>
          <p className="text-gray-300/80">
            To buy, sell, or participate in auctions, you must create an account and provide
            accurate information. You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your account.
          </p>
        </div>

        <div>
          <h3 className="mb-1 mt-5 text-xl font-medium">Buying and Selling</h3>
          <ul className="ml-4 list-disc text-gray-300/80">
            <li>
              <span className="font-medium">Buying Products:</span> When purchasing a product or
              winning an auction, you agree to complete the transaction promptly.
            </li>
            <li>
              <span className="font-medium">Selling Products: </span>
              Sellers are responsible for listing accurate descriptions and abiding by all
              applicable laws and regulations.
            </li>
            <li>
              <span className="font-medium">Auction Rules:</span> Bids placed in an auction are
              binding. The highest bid at the end of the auction period will be considered the
              winning bid, and the winner is obligated to complete the purchase.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-1 mt-5 text-xl font-medium">Payments and Fees</h3>
          <p className="text-gray-300/80">
            SabkoBazzar uses Stripe for secure payment processing. By completing a transaction, you
            agree to Stripe's terms of service. Any fees associated with selling or payment
            processing will be disclosed before confirming your listing or purchase.
          </p>
        </div>

        <div>
          <h3 className="mb-1 mt-5 text-xl font-medium">User Conduct</h3>
          <p className="text-gray-300/80">Users are expected to:</p>
          <ul className="ml-4 list-disc text-gray-300/80">
            <li>Avoid fraudulent or deceptive practices.</li>
            <li>
              Respect intellectual property rights and refrain from posting inappropriate content.
            </li>
            <li>Adhere to local, state, and international laws.</li>
          </ul>
          <p className="mt-1 text-sm italic text-gray-300/60">
            Violations may result in account suspension or termination.
          </p>
        </div>

        <div>
          <h3 className="mb-1 mt-5 text-xl font-medium">Intellectual Property</h3>
          <p className="text-gray-300/80">
            All content on SabkoBazzar, including logos, text, and graphics, is owned by or licensed
            to us. You may not copy, distribute, or exploit our content without written permission.
          </p>
        </div>

        <div>
          <h3 className="mb-1 mt-5 text-xl font-medium">Limitation of Liability</h3>
          <p className="text-gray-300/80">
            SabkoBazzar is not liable for any damages arising from your use of the platform,
            including but not limited to direct, indirect, or consequential losses. We do not
            guarantee the accuracy, quality, or legality of listings posted by sellers.
          </p>
        </div>

        <div>
          <h3 className="mb-1 mt-5 text-xl font-medium">Dispute Resolution</h3>
          <p className="text-gray-300/80">
            Any disputes arising from these terms or your use of the platform will be resolved
            through binding arbitration, in accordance with [your country/state] laws.
          </p>
        </div>

        <div>
          <h3 className="mb-1 mt-5 text-xl font-medium">Changes to Terms</h3>
          <p className="text-gray-300/80">
            We may update these Terms and Conditions occasionally. We will notify you of major
            changes through email or by posting a notice on the platform.
          </p>
        </div>

        <div>
          <h3 className="mb-1 mt-5 text-xl font-medium">Contact Us</h3>
          <p className="text-gray-300/80">
            For questions or concerns, please contact us at{' '}
            <a href="mailto: support@sabkobazzar.com" className="text-purple-600 hover:underline">
              sabkobazzar@gmail.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
