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
      title: `Новина ${itemNumber}`,
      description: `Це тестовий опис для новини ${itemNumber}. Якийсь текст.`,
      image: `https://picsum.photos/seed/${imageSeed}-${itemNumber}/600/400`,
    };
  });

export const initialNews = generateMockNews(10);
