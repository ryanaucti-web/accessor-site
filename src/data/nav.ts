/** Single source of truth for the IA. The nav mega menus, the use-case and
 *  partner hubs, and the footer all read from here so a slug only ever changes
 *  in one place. */

export interface NavItem {
  name: string;
  desc: string;
  href: string;
}

export interface NavCategory {
  key: string;
  label: string;
  items: NavItem[];
}

export const useCaseCategories: NavCategory[] = [
  {
    key: 'situation',
    label: 'By situation',
    items: [
      {
        name: 'Preparing for an audit',
        desc: 'An audit or VPAT is due and you need defensible evidence.',
        href: '/use-cases/preparing-for-an-audit',
      },
      {
        name: 'Many products, one standard',
        desc: 'Portfolios held to the same bar from one workspace.',
        href: '/use-cases/many-products-one-standard',
      },
      {
        name: 'Continuous delivery',
        desc: 'Shipping weekly and verifying accessibility each release.',
        href: '/use-cases/continuous-delivery',
      },
      {
        name: 'Distributed teams',
        desc: 'Autonomous squads with shared visibility, no bottleneck.',
        href: '/use-cases/distributed-teams',
      },
    ],
  },
  {
    key: 'industry',
    label: 'By industry',
    items: [
      {
        name: 'Accounting firms',
        desc: 'Thousands of client deliverables, almost none of them tagged.',
        href: '/use-cases/accounting-firms',
      },
      {
        name: 'Healthcare',
        desc: 'Patient portals and forms, where the fallback is a phone queue.',
        href: '/use-cases/healthcare',
      },
      {
        name: 'Retail',
        desc: 'The most-sued sector, and the one that can price a barrier.',
        href: '/use-cases/retail',
      },
      {
        name: 'Manufacturing',
        desc: 'Dealer portals, documentation and training systems.',
        href: '/use-cases/manufacturing',
      },
      {
        name: 'Higher education',
        desc: 'Forty departments publishing, one institutional duty.',
        href: '/use-cases/higher-education',
      },
      {
        name: 'Government',
        desc: 'Statutory services where there is no competitor to switch to.',
        href: '/use-cases/government',
      },
      {
        name: 'Financial services',
        desc: 'Where a barrier means someone cannot reach their own money.',
        href: '/use-cases/financial-services',
      },
    ],
  },
  {
    key: 'role',
    label: 'By role',
    items: [
      {
        name: 'Accessibility leads',
        desc: 'The one person accountable, with no authority over the teams who ship.',
        href: '/roles/accessibility-leads',
      },
      {
        name: 'Engineering leads',
        desc: 'Findings that arrive as tickets with the component and the fix attached.',
        href: '/roles/engineering-leads',
      },
      {
        name: 'Product managers',
        desc: 'Barriers priced so they compete for sprint capacity on equal terms.',
        href: '/roles/product-managers',
      },
      {
        name: 'Design leads',
        desc: 'Contrast, focus, and target size caught before a component ships.',
        href: '/roles/design-leads',
      },
      {
        name: 'Compliance and legal',
        desc: 'Live evidence, so conformance is shown rather than reconstructed.',
        href: '/roles/compliance-and-legal',
      },
      {
        name: 'Content teams',
        desc: 'Alt text, links, and structure in language an editor can act on.',
        href: '/roles/content-teams',
      },
    ],
  },
];

export const partnerCategories: NavCategory[] = [
  {
    key: 'become',
    label: 'Partner with limena',
    items: [
      {
        name: 'Service providers',
        desc: 'Agencies delivering client work who need accessibility as a repeatable service.',
        href: '/partners/service-providers',
      },
      {
        name: 'Accessibility consultancies',
        desc: 'Specialists whose hours should go to judgment, not sweeping for contrast errors.',
        href: '/partners/consultancies',
      },
      {
        name: 'Incubators and accelerators',
        desc: 'Programmes whose portfolio should build accessibility in from day one.',
        href: '/partners/incubators',
      },
    ],
  },
  {
    key: 'find',
    label: 'Find a partner',
    items: [
      {
        name: 'Find a partner',
        desc: 'Need delivery capacity or conformance sign-off? We will introduce you.',
        href: '/partners#find-a-partner',
      },
      {
        name: 'What partners can help with',
        desc: 'Remediation, manual testing, VPAT review, and standing up a programme.',
        href: '/partners#find-a-partner',
      },
    ],
  },
];

/** Flat lookup for breadcrumbs and cross-links. */
export const allUseCases: NavItem[] = useCaseCategories.flatMap((c) => c.items);
