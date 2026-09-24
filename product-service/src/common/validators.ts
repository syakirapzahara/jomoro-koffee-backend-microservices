export function hasAtLeastThreeWords(name: string): boolean {
  if (!name) {
    return false;
  }
  const words = name.trim().split(' ');
  let wordCount = 0;
  for (const word of words) {
    if (word.length > 0) {
      wordCount++;
    }
  }
  return wordCount >= 3;
}

export function isValidDescription(description: string): boolean {
  return description !== undefined && description.length >= 20;
}

export function isValidPrice(price: number): boolean {
  return Number.isInteger(price) && price >= 1;
}

export function isValidStock(stock: number): boolean {
  return Number.isInteger(stock) && stock >= 0 && stock <= 999;
}

export function isValidCategoryId(categoryId: number): boolean {
  return Number.isInteger(categoryId) && categoryId > 0;
}
