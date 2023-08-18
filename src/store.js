import { defineStore } from 'pinia';

export const useSortableStore = defineStore({
  id: 'sortable',
  state: () => ({
    sortedItems: [],
  }),
  actions: {
    setSortedItems(sortedItems) {
      this.sortedItems = sortedItems;
    },
    restoreSortedItems() {
      const storedItems = localStorage.getItem('sortedItems');
      this.sortedItems = storedItems ? JSON.parse(storedItems) : [];
    },
    saveSortedItems() {
        localStorage.setItem('sortedItems', JSON.stringify(this.sortedItems));
    },
  },
});