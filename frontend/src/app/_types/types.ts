// Globes
export type TradeRoute = {
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    volume: number;
    commodity: string;
};

export type CountryData = {
    id: string;
    name: string;
    data?: any;
  };
  
export type GlobeProps = {
    tradeData?: TradeRoute[];
    countryData?: CountryData[];
};