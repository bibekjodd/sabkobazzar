import { backendUrl, socialLinks } from '@/lib/constants';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { Mail, MapPin, MessageCircleDashedIcon, Phone } from 'lucide-react';
import { openPostFeedbackDialog } from '../dialogs/post-feedback-dialog';
import { logo } from '../utils/logo';

export default function Footer() {
  return (
    <div className="relative z-10 overflow-hidden py-10 font-normal text-muted-foreground filter backdrop-blur-3xl">
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-violet-950/20" />
      <footer className="cont grid md:grid-cols-2 2xl:grid-cols-4">
        <div className="mb-10 2xl:mb-0">
          <h3 className="text-3xl">{logo}</h3>
          <p className="mt-2">Leading auction marketplace in Nepal</p>
        </div>

        <div className="mb-10 flex flex-col space-y-2 2xl:mb-0">
          <h3 className="pb-1 text-xl">Contact</h3>
          <a href="tel:+9779820256741" className="flex items-center space-x-2 hover:underline">
            <Phone className="size-4" />
            <p>+977 9820256741</p>
          </a>
          <a
            href="mailto:sabkobazzar@gmail.com"
            className="flex items-center space-x-2 hover:underline"
          >
            <Mail className="size-4" />
            <p>sabkobazzar@gmail.com</p>
          </a>
          <div className="flex items-center space-x-2">
            <MapPin className="size-4" />
            <p>Bharatpur-9, Chitwan</p>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-xl">Company</h3>
          <div className="mt-3 flex flex-col space-y-2">
            <ProgressLink href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </ProgressLink>
            <ProgressLink href="/terms-and-conditions" className="hover:underline">
              Terms & Conditions
            </ProgressLink>
            <a
              href={`${backendUrl}/reference`}
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Api Reference
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xl">Social Links</h3>
          <div className="mb-10 mt-3 flex items-center space-x-6">
            {socialLinks.map((link) => (
              <img
                loading="lazy"
                decoding="async"
                key={link.title}
                className="size-6"
                src={link.image}
                alt={`${link.title} logo`}
              />
            ))}
          </div>

          <div>
            <button
              onClick={openPostFeedbackDialog}
              className="relative z-10 flex items-center space-x-2 rounded-md border border-brand/70 px-4 py-2 text-sm"
            >
              <span>Send Feedback</span>
              <MessageCircleDashedIcon className="size-4" />
              <div className="absolute left-0 -z-10 h-full w-1/3 bg-brand-darker/60 mix-blend-multiply blur-3xl filter" />
              <div className="absolute right-0 -z-10 h-full w-1/3 bg-brand-darker/60 mix-blend-multiply blur-3xl filter" />
            </button>
          </div>
        </div>
      </footer>

      <div className="cont mx-auto mt-16 flex justify-between px-4 text-center text-sm">
        <span>
          <span className="mr-1 font-light">&copy;</span>
          {new Date().getFullYear()} Sabkobazzar
        </span>

        <div className="flex items-center space-x-2">
          <span>Based in</span>
          <img
            src="https://i.ibb.co/F7Pqzy9/pngwing-com-min.png"
            loading="lazy"
            decoding="async"
            alt="flag"
            className="size-3.5 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
