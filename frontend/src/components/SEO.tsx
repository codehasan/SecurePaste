export type Props = {
  description: string;
  title: string;
  keywords: string[];
};

export const SEO = ({ description, title, keywords }: Props) => {
  const logoUrl = `https://securepaste.vercel.app/opengraph-image.png`;

  const openGraphSeo = [
    {
      property: `keywords`,
      content: keywords.join(', '),
    },
    {
      property: `og:title`,
      content: title,
    },
    {
      property: `og:image`,
      itemprop: 'image',
      content: logoUrl,
    },
    {
      property: `og:description`,
      content: description,
    },
    {
      property: `og:type`,
      content: `website`,
    },
    {
      property: `og:locale`,
      content: `en`,
    },
  ];

  const twitterSeo = [
    {
      name: `twitter:card`,
      content: `summary`,
    },
    {
      name: `twitter:image`,
      content: logoUrl,
    },
    {
      name: `twitter:image:alt`,
      content: `Logo`,
    },
    {
      name: `twitter:title`,
      content: title,
    },
    {
      name: `twitter:description`,
      content: description,
    },
  ];

  return (
    <>
      {openGraphSeo.map(({ property, content }, i) => {
        return <meta key={i} property={property} content={content} />;
      })}
      {twitterSeo.map(({ name, content }, i) => {
        return <meta key={i} name={name} content={content} />;
      })}
    </>
  );
};
