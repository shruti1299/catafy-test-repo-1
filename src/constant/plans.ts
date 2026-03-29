export interface PricingTier {
    title: string;
    price: string;
    features: string[];
    buttonText: string;
    buttonLink: string;
    id: number;
}

export const PLANS = [
    {
        id: 1,
        title: 'Starter Plan',
        price: 499,
        features: ['3 Catalog Folders', '500 Products', 'Community Support'],
        buttonText: 'Start Now',
        buttonLink: '/auth/register',
        rz_plan_id: ''
    },
    {
        id: 2,
        title: 'Growth Plan',
        price: 1199,
        features: ['15 Catalog Folders', '1000 Products', 'Priority Support'],
        buttonText: 'Comming Soon',
        buttonLink: '#',
        rz_plan_id: 'plan_S5PmOvjkZXYaNw',
        interval:"monthly"
    },
    {
        id: 3,
        title: 'Sale Plan',
        price: 2199,
        features: ['Unlimited Catalog Folders', '5000 Products', 'Dedicated Support'],
        buttonText: 'Comming Soon',
        buttonLink: '#',
        rz_plan_id: 'plan_S5PnYkLP1k8R7T',
        interval:"monthly"
    },
];