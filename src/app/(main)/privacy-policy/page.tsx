export default function page() {
  return (
    <div className="cont mb-20 pt-20 lg:mb-32">
      <div>
        <h1 className="mt-2 flex items-center space-x-1 text-2xl font-medium">Privacy Policy</h1>
        <p className="mt-2 text-muted-foreground">Effective Date: November 5, 2024</p>
      </div>

      <section className="mt-7 space-y-10">
        <div>
          <h3 className="mb-1 mt-5 text-xl font-medium">Introduction</h3>
          <p className="text-muted-foreground">
            SabkoBazzar respects your privacy and is committed to protecting your personal
            information. This Privacy Policy explains what data we collect, how we use it, and your
            rights regarding your information. By using our platform, you agree to the collection
            and use of your data as outlined in this policy.
          </p>
        </div>

        <div>
          <h3 className="mb-1 text-xl font-medium">Information We Collect</h3>
          <p className="text-muted-foreground">
            We may collect and store the following information:
          </p>
          <ul className="ml-4 list-disc text-muted-foreground">
            <li>
              Personal Information: Such as name, email address, billing and shipping addresses, and
              payment details for identification and transaction purposes.
            </li>
            <li>
              Usage Data: Data on how you interact with our platform, including IP address, browser
              type, pages visited, and other browsing data.
            </li>
            <li>
              Cookies and Tracking Data: We use cookies to improve user experience and analyze our
              platform's performance.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-1 text-xl font-medium">How We Use Your Information</h3>
          <p className="text-muted-foreground">Your data is used to:</p>
          <ul className="ml-4 list-disc text-muted-foreground">
            <li>Process and complete orders and auctions.</li>
            <li>Provide customer support and communicate important updates.</li>
            <li>Personalize user experience and suggest relevant products.</li>
            <li>Improve and maintain our platform based on user feedback.</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-1 text-xl font-medium">Sharing Your Information</h3>
          <p className="text-muted-foreground">
            SabkoBazzar does not sell or rent your data to third parties. However, we may share data
            with:
          </p>
          <ul className="ml-4 list-disc text-muted-foreground">
            <li>
              <span className="font-medium">Payment Processors (Stripe):</span> To handle secure
              payment processing.
            </li>
            <li>
              <span className="font-medium">Service Providers:</span> Who assist in platform
              maintenance, analytics, and communication services.
            </li>
            <li>
              <span className="font-medium">Legal Compliance:</span> If required by law or in
              response to legal processes.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-1 text-xl font-medium">Security of Your Information</h3>
          <p className="text-muted-foreground">
            We prioritize the security of your data and implement industry-standard security
            measures to prevent unauthorized access. Payment data processed via Stripe complies with
            PCI-DSS standards to ensure transaction security.
          </p>
        </div>

        <div>
          <h3 className="mb-1 text-xl font-medium">Your Rights and Choices</h3>
          <p className="text-muted-foreground">
            You may request access to, correction of, or deletion of your personal data by
            contacting our support team. You can also opt out of certain data collection (e.g.,
            cookies) by adjusting your browser settings.
          </p>
        </div>

        <div>
          <h3 className="mb-1 text-xl font-medium">Changes to This Policy</h3>
          <p className="text-muted-foreground">
            We may update this Privacy Policy periodically. We will notify you of significant
            changes through email or via updates on our platform.
          </p>
        </div>

        <div>
          <h3 className="mb-1 text-xl font-medium">Contact Us</h3>
          <p className="text-muted-foreground">
            If you have any questions or concerns about our Privacy Policy, please contact us at{' '}
            <a href="mailto: support@sabkobazzar.com" className="text-brand hover:underline">
              sabkobazzar@gmail.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
