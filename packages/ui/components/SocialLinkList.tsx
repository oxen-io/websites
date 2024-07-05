import { DiscordIcon } from '../icons/socials/DiscordIcon';
import { FacebookIcon } from '../icons/socials/FacebookIcon';
import { GithubIcon } from '../icons/socials/GithubIcon';
import { InstagramIcon } from '../icons/socials/InstagramIcon';
import { LinkedInIcon } from '../icons/socials/LinkedInIcon';
import { RSSIcon } from '../icons/socials/RSSIcon';
import { RedditIcon } from '../icons/socials/RedditIcon';
import { SessionIcon } from '../icons/socials/SessionIcon';
import { TelegramIcon } from '../icons/socials/TelegramIcon';
import { VimeoIcon } from '../icons/socials/VimeoIcon';
import { WhatsappIcon } from '../icons/socials/WhatsappIcon';
import { XIcon } from '../icons/socials/XIcon';
import { YoutubeIcon } from '../icons/socials/YoutubeIcon';
import { cn } from '../lib/utils';

export enum Social {
  Discord = 'discord',
  Facebook = 'facebook',
  Github = 'github',
  Instagram = 'instagram',
  LinkedIn = 'linkedin',
  Reddit = 'reddit',
  RSS = 'rss',
  Session = 'session',
  Telegram = 'telegram',
  Vimeo = 'vimeo',
  Whatsapp = 'whatsapp',
  X = 'x',
  Youtube = 'youtube',
}

function getSocialIcon(social: Social) {
  switch (social) {
    case Social.Discord:
      return <DiscordIcon />;
    case Social.Facebook:
      return <FacebookIcon />;
    case Social.Github:
      return <GithubIcon />;
    case Social.Instagram:
      return <InstagramIcon />;
    case Social.LinkedIn:
      return <LinkedInIcon />;
    case Social.Reddit:
      return <RedditIcon />;
    case Social.RSS:
      return <RSSIcon />;
    case Social.Session:
      return <SessionIcon />;
    case Social.Telegram:
      return <TelegramIcon />;
    case Social.Vimeo:
      return <VimeoIcon />;
    case Social.Whatsapp:
      return <WhatsappIcon />;
    case Social.X:
      return <XIcon />;
    case Social.Youtube:
      return <YoutubeIcon />;
    default:
  }
}

export type SocialLink = {
  name: Social;
  link: string;
};

export type SocialLinkListProps = {
  socialLinks: Array<SocialLink>;
  className?: string;
};

export default function SocialLinkList(props: SocialLinkListProps) {
  const { socialLinks, className } = props;

  return (
    <ul className={className}>
      {socialLinks?.map((item, index) => {
        const { link, name } = item;

        return (
          <li key={`${index}-${name}-${link}`}>
            <a
              className={cn(
                'border-session-green fill-session-white flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-200 *:h-4 *:w-4',
                'hover:bg-session-green hover:fill-session-black'
              )}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {getSocialIcon(name)}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
