export type CompanyShare = {
    Id: number;
    soldByAddress: string;
    name: string;
    orgNumber: number;
    price: number;
    numberOfShares: number;
    lastPriceBought: number;
  }
export type CompanySharesForSale = {
    shares: CompanyShare[];
}



  