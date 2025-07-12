type ProductDetails = {
    title: string;
    image: string;
    price: string | number;
    deal?: boolean;
    priceAfterDeal?: string | number;
    link: string
}
const ProductsList : ProductDetails[] = [
    {
        title: 'egyption loofeh',
        image: '/image.png',
        price: 12,
        link: 'https://www.amazon.com/Natural-Egyptian-Shower-Loofah-Sponge/dp/B097LKWW2J?ref_=ast_sto_dp',
        deal: true,
        priceAfterDeal: 10,

    },
    {
        title: 'egyption loofeh',
        image: '/image.png',
        price: 12,
        link: 'https://www.amazon.com/Natural-Egyptian-Shower-Loofah-Sponge/dp/B097LKWW2J?ref_=ast_sto_dp',
        deal: true,
        priceAfterDeal: 10,

    },
    {
        title: 'egyption loofeh',
        image: '/image.png',
        price: 12,
        link: 'https://www.amazon.com/Natural-Egyptian-Shower-Loofah-Sponge/dp/B097LKWW2J?ref_=ast_sto_dp',
        deal: true,
        priceAfterDeal: 10,

    },
    {
        title: 'egyption loofeh',
        image: '/image.png',
        price: 12,
        link: 'https://www.amazon.com/Natural-Egyptian-Shower-Loofah-Sponge/dp/B097LKWW2J?ref_=ast_sto_dp',
        deal: true,
        priceAfterDeal: 10,

    },
    {
        title: 'egyption loofeh',
        image: '/image.png',
        price: 12,
        link: 'https://www.amazon.com/Natural-Egyptian-Shower-Loofah-Sponge/dp/B097LKWW2J?ref_=ast_sto_dp',
        deal: true,
        priceAfterDeal: 10,

    },
]

export {ProductsList, type ProductDetails}