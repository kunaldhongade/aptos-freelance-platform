import Placeholder1 from "@/assets/placeholders/bear-1.png";
import Placeholder2 from "@/assets/placeholders/bear-2.png";
import Placeholder3 from "@/assets/placeholders/bear-3.png";

export const config: Config = {
  // Removing one or all of these socials will remove them from the page
  socials: {
    twitter: "https://twitter.com/projectfreelance",
    discord: "https://discord.com/projectfreelance",
    homepage: "https://projectfreelance.com",
  },

  defaultCollection: {
    name: "Freelancer's Showcase",
    description: "A collection of digital job profiles and completed works by top freelancers on our platform.",
    image: Placeholder1,
  },

  ourStory: {
    title: "Our Story",
    subTitle: "A Decentralized Freelancing Platform on Aptos",
    description:
      "Our freelancing platform allows freelancers to connect with clients, apply for jobs, and receive payments securely using the Aptos blockchain. We are reshaping the future of freelancing by ensuring transparency and security.",
    discordLink: "https://discord.com/projectfreelance",
    images: [Placeholder1, Placeholder2, Placeholder3],
  },

  ourTeam: {
    title: "Our Team",
    members: [
      {
        name: "Alex",
        role: "Lead Blockchain Developer",
        img: Placeholder1,
        socials: {
          twitter: "https://twitter.com/",
        },
      },
      {
        name: "Jordan",
        role: "Head of Marketing",
        img: Placeholder2,
      },
      {
        name: "Taylor",
        role: "Community Manager",
        img: Placeholder3,
        socials: {
          twitter: "https://twitter.com/",
        },
      },
    ],
  },

  faqs: {
    title: "F.A.Q.",

    questions: [
      {
        title: "What is this platform about?",
        description:
          "Our platform connects freelancers with clients looking to hire talent for various jobs. Freelancers can browse available jobs, apply for those that match their skills, and get paid in Aptos tokens (APT) or other custom tokens.",
      },
      {
        title: "How do I create an account?",
        description:
          "There's no need to create a traditional account. Just connect your Aptos wallet using Petra or any supported wallet, and you're ready to start using the platform.",
      },
      {
        title: "How do payments work on this platform?",
        description:
          "All payments are made in Aptos tokens (APT) or custom tokens. Payments are handled through smart contracts, ensuring that freelancers get paid securely upon job completion.",
      },
      {
        title: "How do I register as a freelancer?",
        description:
          "Once your Aptos wallet is connected, go to the “Register as Freelancer” section and click on the registration button. This will add you to the platform's Freelancer Registry.",
      },
      {
        title: "How do I get paid?",
        description:
          "Once you complete a job, the client will mark it as completed and initiate the payment process. The smart contract will transfer the agreed-upon amount directly to your wallet.",
      },
    ],
  },

  nftBanner: [Placeholder1, Placeholder2, Placeholder3],
};

export interface Config {
  socials?: {
    twitter?: string;
    discord?: string;
    homepage?: string;
  };

  defaultCollection?: {
    name: string;
    description: string;
    image: string;
  };

  ourTeam?: {
    title: string;
    members: Array<ConfigTeamMember>;
  };

  ourStory?: {
    title: string;
    subTitle: string;
    description: string;
    discordLink: string;
    images?: Array<string>;
  };

  faqs?: {
    title: string;
    questions: Array<{
      title: string;
      description: string;
    }>;
  };

  nftBanner?: Array<string>;
}

export interface ConfigTeamMember {
  name: string;
  role: string;
  img: string;
  socials?: {
    twitter?: string;
    discord?: string;
  };
}
