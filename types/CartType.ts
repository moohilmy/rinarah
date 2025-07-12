type CartType = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  }
};

export {type CartType}