import { type Region } from '@/lib/currency';

export interface Testimonial {
  name: string;
  location: string;
  amount: string;
  case: string;
  quote: string;
  rating: number;
  image?: string;
}

export const TESTIMONIALS_BY_REGION: Record<Region, Testimonial[]> = {
  EU: [
    {
      name: 'Sophie Martin',
      location: 'Paris, France',
      amount: '480 €',
      case: 'flight',
      quote: "Vol Paris-Madrid annulé. LitigeFlow a récupéré mon indemnisation CE 261/2004 en 3 semaines. Service impeccable.",
      rating: 5,
    },
    {
      name: 'Marc Dubois',
      location: 'Lyon, France',
      amount: '1 200 €',
      case: 'merchant',
      quote: "Litige avec un vendeur Allemand sur un produit jamais livré. La mise en demeure via LitigeFlow a tout réglé en 10 jours.",
      rating: 5,
    },
    {
      name: 'Ana García',
      location: 'Madrid, Spain',
      amount: '850 €',
      case: 'scam',
      quote: "Victime d'une arnaque bancaire. LitigeFlow m'a aidé à déposer plainte et récupérer l'argent via ma banque.",
      rating: 4,
    },
    {
      name: 'Klaus Weber',
      location: 'Berlin, Germany',
      amount: '2 100 €',
      case: 'merchant',
      quote: "Online-Shop hat nicht geliefert. LitigeFlow hat den Fall professionell gelöst. Sehr empfehlenswert.",
      rating: 5,
    },
  ],
  US: [
    {
      name: 'Jessica Williams',
      location: 'New York, NY',
      amount: '$520',
      case: 'flight',
      quote: "Flight from JFK to LAX delayed 6 hours. LitigeFlow helped me file with DOT and get compensation from the airline.",
      rating: 5,
    },
    {
      name: 'Michael Chen',
      location: 'San Francisco, CA',
      amount: '$1,350',
      case: 'merchant',
      quote: "Bought furniture online that never arrived. LitigeFlow guided me through the chargeback process with my bank. Got full refund in 2 weeks.",
      rating: 5,
    },
    {
      name: 'Sarah Johnson',
      location: 'Chicago, IL',
      amount: '$2,800',
      case: 'scam',
      quote: "Fell victim to an online scam. LitigeFlow helped me report to FTC and work with my credit card company. No win, no fee was amazing.",
      rating: 4,
    },
    {
      name: 'David Martinez',
      location: 'Miami, FL',
      amount: '$950',
      case: 'cashback',
      quote: "Cashback site refused to pay out. LitigeFlow escalated to BBB and I got my money within a month.",
      rating: 5,
    },
  ],
  CA: [
    {
      name: 'Emma Tremblay',
      location: 'Montreal, QC',
      amount: 'CA$680',
      case: 'flight',
      quote: "Vol Air Canada annulé. LitigeFlow a navigué le processus RPPA et j'ai reçu mon indemnisation complète.",
      rating: 5,
    },
    {
      name: 'James O\'Brien',
      location: 'Toronto, ON',
      amount: 'CA$1,450',
      case: 'merchant',
      quote: "Package from Shopify store never delivered. LitigeFlow worked with my bank and Competition Bureau. Full refund in 3 weeks.",
      rating: 5,
    },
    {
      name: 'Sophie Leblanc',
      location: 'Quebec City, QC',
      amount: 'CA$920',
      case: 'scam',
      quote: "Victime de fraude en ligne. LitigeFlow m'a aidé avec le Centre antifraude du Canada. Excellent service.",
      rating: 4,
    },
    {
      name: 'Ryan Singh',
      location: 'Vancouver, BC',
      amount: 'CA$2,100',
      case: 'merchant',
      quote: "Cross-border dispute with US seller. LitigeFlow handled everything with CTA. Couldn't have done it without them.",
      rating: 5,
    },
  ],
  UK: [
    {
      name: 'Emily Thompson',
      location: 'London, UK',
      amount: '£420',
      case: 'flight',
      quote: "British Airways flight delayed 5 hours. LitigeFlow used UK261 to get me compensation. Brilliant service.",
      rating: 5,
    },
    {
      name: 'Oliver Davies',
      location: 'Manchester, UK',
      amount: '£1,180',
      case: 'merchant',
      quote: "Online retailer sent wrong item and refused refund. LitigeFlow escalated to Citizens Advice. Got full refund plus shipping.",
      rating: 5,
    },
    {
      name: 'Charlotte Wilson',
      location: 'Birmingham, UK',
      amount: '£850',
      case: 'scam',
      quote: "Phishing scam nearly cost me everything. LitigeFlow helped report to Action Fraud and reversed the charges. Lifesavers.",
      rating: 5,
    },
    {
      name: 'Harry Brown',
      location: 'Edinburgh, UK',
      amount: '£2,350',
      case: 'merchant',
      quote: "EU purchase gone wrong post-Brexit. LitigeFlow navigated the legal maze and recovered my money through CAA.",
      rating: 4,
    },
  ],
};

export const CASE_EXAMPLES_BY_REGION: Record<Region, Array<{
  title: string;
  company: string;
  amount: string;
  duration: string;
  method: string;
  description: string;
}>> = {
  EU: [
    {
      title: 'Annulation vol Ryanair',
      company: 'Ryanair',
      amount: '400 €',
      duration: '3 semaines',
      method: 'Règlement CE 261/2004',
      description: 'Vol annulé moins de 14 jours avant départ sans proposition alternative acceptable.',
    },
    {
      title: 'Amazon produit défectueux',
      company: 'Amazon.de',
      amount: '1 200 €',
      duration: '10 jours',
      method: 'Garantie légale + SignalConso',
      description: 'Ordinateur portable défectueux, vendeur refuse SAV. Mise en demeure efficace.',
    },
    {
      title: 'Arnaque Leboncoin',
      company: 'Particulier',
      amount: '850 €',
      duration: '6 semaines',
      method: 'Plainte + Chargeback bancaire',
      description: 'Faux vendeur, argent viré. Plainte Pharos + contestation bancaire réussie.',
    },
  ],
  US: [
    {
      title: 'Delta Flight Cancellation',
      company: 'Delta Airlines',
      amount: '$450',
      duration: '4 weeks',
      method: 'DOT Complaint + Airline Policy',
      description: 'Flight canceled without alternative. DOT complaint triggered compensation under airline policy.',
    },
    {
      title: 'Amazon Defective Product',
      company: 'Amazon.com',
      amount: '$1,350',
      duration: '2 weeks',
      method: 'Credit Card Chargeback',
      description: 'Laptop arrived damaged, seller unresponsive. Chargeback filed with Visa, full refund obtained.',
    },
    {
      title: 'eBay Scam',
      company: 'eBay Seller',
      amount: '$2,100',
      duration: '5 weeks',
      method: 'FTC Report + PayPal Dispute',
      description: 'Never received high-value item. FTC report + PayPal buyer protection secured refund.',
    },
  ],
  CA: [
    {
      title: 'Annulation Air Canada',
      company: 'Air Canada',
      amount: 'CA$680',
      duration: '5 semaines',
      method: 'RPPA (Règlement passagers aériens)',
      description: 'Vol annulé dans le contrôle de la compagnie. Réclamation RPPA via OTC acceptée.',
    },
    {
      title: 'Shopify Store Scam',
      company: 'Online Store',
      amount: 'CA$1,450',
      duration: '3 weeks',
      method: 'Credit Card Chargeback',
      description: 'Paid for goods never shipped. Merchant unresponsive. Bank chargeback successful.',
    },
    {
      title: 'Fraude téléphonique',
      company: 'Fraudeur',
      amount: 'CA$920',
      duration: '8 semaines',
      method: 'Centre antifraude + Police',
      description: 'Victime de fraude par téléphone. Rapport au Centre antifraude, banque a remboursé.',
    },
  ],
  UK: [
    {
      title: 'EasyJet Flight Delay',
      company: 'EasyJet',
      amount: '£350',
      duration: '3 weeks',
      method: 'UK261 Compensation',
      description: '4-hour delay on flight to Spain. UK261 claim via CAA resulted in compensation.',
    },
    {
      title: 'Faulty Laptop from Currys',
      company: 'Currys PC World',
      amount: '£980',
      duration: '2 weeks',
      method: 'Consumer Rights Act 2015',
      description: 'Laptop developed fault after 3 months. Store refused refund. Citizens Advice escalation worked.',
    },
    {
      title: 'Online Marketplace Fraud',
      company: 'Facebook Marketplace',
      amount: '£1,250',
      duration: '6 weeks',
      method: 'Action Fraud + Bank Chargeback',
      description: 'Paid via bank transfer for item never delivered. Action Fraud report + bank investigation secured refund.',
    },
  ],
};

export function getTestimonialsForRegion(region: Region): Testimonial[] {
  return TESTIMONIALS_BY_REGION[region] || TESTIMONIALS_BY_REGION.EU;
}

export function getCaseExamplesForRegion(region: Region) {
  return CASE_EXAMPLES_BY_REGION[region] || CASE_EXAMPLES_BY_REGION.EU;
}
