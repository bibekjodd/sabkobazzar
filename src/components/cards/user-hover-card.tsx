import { cn } from '@/lib/utils';
import { BadgeCheckIcon, MailIcon, PhoneIcon } from 'lucide-react';
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import Avatar from '../utils/avatar';

export default function UserHoverCard({
  user,
  children
}: {
  user: User;
  children: React.ReactNode;
}) {
  return (
    <HoverCard openDelay={400}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-fit">
        <div className="flex items-start space-x-4">
          <Avatar src={user.image} size="lg" />
          <div>
            <div className="flex items-center space-x-2">
              <p className="text-base font-semibold">{user.name}</p>
              {user.isVerified && (
                <BadgeCheckIcon className="size-4 fill-sky-500 text-indigo-100" />
              )}
            </div>

            <div className="mt-1 flex items-center space-x-2">
              <MailIcon className="size-3.5" />
              <span className="text-sm">{user.email}</span>
            </div>

            <div className="mt-1 flex items-center space-x-2">
              <PhoneIcon className="size-3.5" />
              <span className={cn('text-sm', { italic: !user.phone })}>
                {user.phone || 'Not specified'}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
