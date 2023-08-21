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
      if (storedItems !== null) {
        try {
          this.sortedItems = JSON.parse(storedItems);
        } catch (error) {
          console.error('Error parsing storedItems JSON:', error);
          this.sortedItems = [];
        }
      }
    },
    saveSortedItems() {
      localStorage.setItem('sortedItems', JSON.stringify(this.sortedItems));
    },
  },
});