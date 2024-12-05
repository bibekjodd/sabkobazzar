import { backendUrl, socialLinks } from '@/lib/constants';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { Mail, MapPin, Phone } from 'lucide-react';
import { logo } from '../utils/logo';

export default function Footer() {
  return (
    <div className="relative z-10 overflow-hidden py-10 font-normal text-indigo-200/90 filter backdrop-blur-3xl">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-violet-950/5" />
      <footer className="cont grid md:grid-cols-2 2xl:grid-cols-4">
        <div className="mb-10 2xl:mb-0">
          <h3 className="text-3xl">{logo}</h3>
          <p className="mt-2">Leading auction marketplace in Nepal</p>
        </div>

        <div className="mb-10 flex flex-col space-y-2 2xl:mb-0">
          <h3 className="pb-1 text-xl">Contact</h3>
          <a href="tel:+9779820256741" className="flex items-center space-x-2">
            <Phone className="size-4" />
            <p>+977 9820256741</p>
          </a>
          <a href="mailto:sabkobazzar@gmail.com" className="flex items-center space-x-2">
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
            <ProgressLink href="/privacy-policy" className="hover:text-indigo-100 hover:underline">
              Privacy Policy
            </ProgressLink>
            <ProgressLink
              href="/terms-and-conditions"
              className="hover:text-indigo-100 hover:underline"
            >
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
            alt="flag"
            className="size-3.5 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
