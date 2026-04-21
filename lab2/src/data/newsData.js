const imageSeeds = [
  'technology',
  'city',
  'science',
  'design',
  'mobile',
  'startup',
  'coding',
  'future',
];

export const generateMockNews = (count = 10, startIndex = 1) =>
  Array.from({ length: count }, (_, index) => {
    const itemNumber = startIndex + index;
    const imageSeed = imageSeeds[index % imageSeeds.length];

    return {
      id: String(itemNumber),
      title: `News ${itemNumber}`,
      description: `This is a mock description for news item ${itemNumber}. It is used to demonstrate list rendering and detail content in the app.`,
      image: `https://picsum.photos/seed/${imageSeed}-${itemNumber}/600/400`,
    };
  });

export const initialNews = generateMockNews(10);
