# ComboStats


By using typescript, react and create-next-app, this non-profit webapp will estimate the probability of success when drawing elements from any pool of elements. When finished, this app will let you

1. Create a pool of elements with attached characteristics
2. Select what elements that have to be drawn for success to be registered
3. If success i drawn, but if certain other elements are also drawn, failure can be registered instead.
4. Effects can be applied when certain elements are drawn, for example to draw another random element from the pool.
5. Estimate the probaility of success (while not drawing any failures) by drawing any number of samples where any number of elements can be drawn per sample.

By using the calculating power of the computer, 10 000 or more samples can be drawn in a short period of time. This makes the estimate extremely accurate. The default result will be provided as an estimate, however the option to provide the result as a confidence interval will also be available over time.

The probability of most scenarios can be calculated exact by using probability theory and combinatorics. However, in some trading card games, like Yu-Gi-Oh! and Magic The Gathering, a lot of variables makes this expression extremely big and very difficult to calculate by hand. In addition effects may be applied by certain cards that change the outcome for that sample. Therefore actually drawing hands and registering successes can be a better way to test how consistent a deck is.

This webapp will be created with generelization in mind. Thus statistical terminology will be used. This might make it difficult for a lot of people to appeal to. Therefore I will make a TCG mode that will change this terminology and maybe optimize the functionality for TCGs.

A [draft/rough prototype](https://www.figma.com/proto/bxJtxBuVM68r6Ir7Ga0gej/Combo-Stats?node-id=45%3A12766&scaling=min-zoom) for the design and the pages of the app has been made in Figma. The design may change from this draft.



This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
