<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <section>
        <div class="flex">
          <div class="max-w-xs">
            <label for="wallet" class="block text-sm font-medium text-gray-700"
            >Тикер</label
            >
            <div class="mt-1 relative rounded-md shadow-md">
              <input
                v-model="newTickerName"
                @keypress.enter="addTicker"
                type="text"
                name="wallet"
                id="wallet"
                class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                placeholder="Например DOGE"
              />
            </div>
            <div v-if="suggestions.length > 0" class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
              <span
                v-for="suggestion in suggestions"
                @click="addSuggestionTicker(suggestion)"
                :key="suggestion"
                class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
              >
                {{ suggestion }}
              </span>
            </div>
            <div v-if="tickerExistsErr" class="text-sm text-red-600">Такой тикер уже добавлен</div>
          </div>
        </div>
        <button
          @click="addTicker"
          type="button"
          class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <!-- Heroicon name: solid/mail -->
          <svg
            class="-ml-0.5 mr-2 h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#ffffff"
          >
            <path
              d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            ></path>
          </svg>
          Добавить
        </button>
      </section>

      <template v-if="tickers.length > 0">
        <hr class="w-full border-t border-gray-600 my-4" />
        <div>
          <div>
            <button
              v-if="page > 1"
              @click="prevPage"
              class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Назад
            </button>
            <button
              v-if="hasNextPage"
              @click="nextPage"
              class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              type="button">Вперёд
            </button>
          </div>
          <p class="mb-2">
            Страница: {{ page }}
          </p>
          <div>
            Фильтр: <input v-model="filter">
          </div>
        </div>

        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="(ticker, index) in paginatedTickers"
            @click="selectTicker(ticker)"
            :key="index"
            :class="{ 'border-4': selectedTicker === ticker }"
            class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ ticker.name }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ ticker.price }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="deleteTicker(ticker)"
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Удалить
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />

        <!-- Graph -->
        <section v-if="selectedTicker" class="relative">
          <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
            {{ selectedTicker.name }} - USD
          </h3>
          <div class="flex items-end border-gray-600 border-b border-l h-64">
            <div
              v-for="(bar, index) in builtGraphBars"
              :key="index"
              :style="{ height: bar.height + '%' }"
              class="bg-purple-800 border w-10"
            ></div>
          </div>
          <button
            @click="deselectTicker"
            type="button"
            class="absolute top-0 right-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              x="0"
              y="0"
              viewBox="0 0 511.76 511.76"
              style="enable-background:new 0 0 512 512"
              xml:space="preserve"
            >
              <g>
                <path
                  d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                  fill="#718096"
                  data-original="#000000"
                ></path>
              </g>
            </svg>
          </button>
        </section>
      </template>
    </div>
  </div>
</template>

<script>
const TICKERS_PER_PAGE = 6;

import { loadTickerPrice } from '@/api';
import { stringsAreEqual } from '@/lib/functions';

export default {
  data() {
    return {
      newTickerName: '',
      tickerExistsErr: false,

      tickers: [],

      selectedTicker: null,

      graphBars: [],

      filter: new URLSearchParams(document.location.search.substring(1)).get('filter') || '',

      page: new URLSearchParams(document.location.search.substring(1)).get('page') || 1,

      allCoinsNames: []
    };
  },

  methods: {
    addTicker() {
      if (this.tickers.find(ticker => stringsAreEqual(ticker.name, this.newTickerName))) {
        this.tickerExistsErr = true;
        return;
      }

      const newTicker = {
        name: this.newTickerName.toUpperCase(),
        price: 0
      };

      this.tickers.push(newTicker);
      this.newTickerName = '';
      this.filter = '';

      this.subscribeForPriceUpdates(newTicker.name);
    },

    addSuggestionTicker(tickerName) {
      this.newTickerName = tickerName.toUpperCase();
      this.addTicker();
    },

    selectTicker(ticker) {
      this.selectedTicker = ticker;
    },
    deselectTicker() {
      this.selectedTicker = null;
    },

    deleteTicker(ticker) {
      if (this.selectedTicker === ticker) {
        this.selectedTicker = null;
      }

      this.tickers = this.tickers.filter(t => t !== ticker);
    },

    subscribeForPriceUpdates(tickerName) {
      setInterval(async () => {
        const currentTicker = this.tickers.find(ticker => ticker.name === tickerName);
        currentTicker.price = await loadTickerPrice(tickerName);

        // TODO: probably there's a better way to do that further
        if (this.selectedTicker?.name === currentTicker.name) {
          const newGraphBar = {
            price: currentTicker.price,
            height: 0
          };

          this.graphBars.push(newGraphBar);
        }
      }, 3000);
    },

    nextPage() {
      this.page++;
    },
    prevPage() {
      this.page--;
    }
  },

  computed: {
    paginatedTickers() {
      // Filter by page count (pagination)
      return this.filteredTickers.slice(this.pagination.start, this.pagination.end);
    },
    hasNextPage() {
      return this.filteredTickers.length > this.pagination.end;
    },
    filteredTickers() {
      const regexp = new RegExp(this.filter, 'i');

      return this.tickers.filter(t => t.name.match(regexp));
    },

    builtGraphBars() {
      if (this.graphBars.length === 0) return [];

      const graphBarsCopy = [...this.graphBars];
      const minPrice = graphBarsCopy.sort((barA, barB) => barA.price - barB.price)[0].price;
      const maxPrice = graphBarsCopy.sort((barA, barB) => barB.price - barA.price)[0].price;

      return this.graphBars.map((bar) => {
        if (bar.price === maxPrice) {
          bar.height = 100;
        } else if (bar.price === minPrice) {
          bar.height = 5;
        } else {
          bar.height = Math.trunc((bar.price - minPrice) / (maxPrice - minPrice) * 100);
        }

        return bar;
      });
    },

    suggestions() {
      if (this.newTickerName === '') return [];

      const MAX_SUGGESTIONS_COUNT = 4;
      const suggestions = [];

      for (const coin of this.allCoinsNames) {
        if (suggestions.length === MAX_SUGGESTIONS_COUNT) break;

        const pattern = this.newTickerName;
        const regexp = new RegExp(pattern, 'i');
        if (coin.match(regexp)) {
          suggestions.push(coin);
        }
      }

      return suggestions;
    },

    pagination() {
      return {
        start: TICKERS_PER_PAGE * (this.page - 1),
        end: TICKERS_PER_PAGE * this.page
      };
    },

    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page
      }
    }
  },

  watch: {
    tickers: {
      handler() {
        localStorage.setItem('tickers', JSON.stringify(this.tickers));
      },
      deep: true
    },

    newTickerName(newValue, oldValue) {
      if (stringsAreEqual(newValue, oldValue)) return;

      if (this.tickerExistsErr) this.tickerExistsErr = false;
    },

    paginatedTickers() {
      // Go back to previous page if we delete all tickers
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page--;
      }
    },

    pageStateOptions(updatedOptions) {
      const {filter, page} = updatedOptions;

      const url = new URL(window.location);
      url.searchParams.set('filter', filter);
      url.searchParams.set('page', page);

      window.history.pushState(null, '', url.toString());
    },

    filter() {
      this.page = 1;
    },

    selectedTicker() {
      this.graphBars = [];
    },
  },

  async created() {
    // Load tickers from localStorage
    const storageTickers = JSON.parse(localStorage.getItem('tickers'));
    if (storageTickers) {
      this.tickers = storageTickers;

      this.tickers.forEach(ticker => this.subscribeForPriceUpdates(ticker.name));
    }

    // Load all coins names for suggestions when inputting ticker name
    const allCoinsResp = await fetch('https://min-api.cryptocompare.com/data/all/coinlist?summary=true');
    const allCoins = await allCoinsResp.json();

    const allCoinsNames = Object.keys(allCoins.Data).sort();

    this.allCoinsNames = allCoinsNames;
  }
};
</script>