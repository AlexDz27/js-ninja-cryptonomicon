import { API_KEY } from '../config';

export async function loadTickerPrice(name) {
  const response = await fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=${name}&tsyms=USD&api_key=${API_KEY}`
  );

  /**
   * @type {Object}
   * @property {number} USD Price of a coin in USD
   */
  const data = await response.json();

  return data.USD;
}