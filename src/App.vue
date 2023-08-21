<template>
  <div>
    <h1>Simple Grid Example</h1>
    <div id="items" class="grid-container">
      <div
        v-for="(item, index) in items"
        :key="item"
        class="sortable-item"
        :style="{ gridColumn: (index % 2) + 1 }"
      >
        {{ item }}
      </div>
    </div>
    <!-- 선택 버튼 -->
    <button @click="toggleDropdown">변경</button>
    <div v-if="showDropdown">
        <template v-for="item in allItems" :key="item">
          <input
            type="checkbox"
            :id="item"
            :value="item"
            v-model="selectedItems"
          />
        <label :for="item"> {{ item }}</label>
        </template>
    </div>
    <button v-if="showDropdown" @click="addSelectedItems">추가</button>
    <button v-if="showDropdown" @click="removeSelectedItems">삭제</button>
    <!-- 저장 버튼 -->
    <button v-if="showDropdown" @click="saveSorting">저장</button>
  </div>
</template>

<script>
import Sortable from 'sortablejs';
import { useSortableStore } from './store';                                 // Pinia 스토어 가져오기

export default {
  data() {
    return {
      allItems: ['item 1', 'item 2', 'item 3', 'item 4'],
      selectedItems: [],
      showDropdown: false
    };
  },
  mounted() {
    const store = useSortableStore();
    store.restoreSortedItems();

    const sortableList = new Sortable(this.$el.querySelector('#items'), {
      animation: 150,
      group: 'shared',
      sort: true,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      grid: [2, 1], 
      onEnd: (evt) => {
        const newItems = evt.from.children;
        const sortedItems = Array.from(newItems).map((el) => el.textContent);
        store.setSortedItems(sortedItems);
        store.saveSortedItems();
      }
    });
  },
  methods: {
    // 저장 버튼 클릭 시
    saveSorting() {
      const store = useSortableStore(); // Pinia 스토어 인스턴스 생성
      store.setSortedItems(this.items);
      store.saveSortedItems();
      console.log('저장:', this.items);
      this.showDropdown = false;         //드롭다운 닫기
      this.selectedItems = [];           // selectedItems 비우기
    },
    // 변경 버튼 클릭 시
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    // 아이템 추가
    addSelectedItems() {
  if (this.selectedItems.length > 0) {
    const store = useSortableStore();
    this.selectedItems.forEach((item) => {
      if (!store.sortedItems.includes(item)) {
        store.sortedItems.push(item);
        console.log('추가', item);
      }
    });

    // 아이템을 추가한 후에 화면을 업데이트
    this.updateSortableList();
  }
},
    //아이템 삭제
    removeSelectedItems() {
      const store = useSortableStore();
      this.selectedItems.forEach((item) => {
        const index = store.sortedItems.indexOf(item);
        if (index !== -1) {
          store.sortedItems.splice(index, 1);
        }
        console.log('삭제', item);
      });
    },
    updateSortableList() {
      this.selectedItems = [...this.selectedItems];
    },
  },
  computed: {
    // 화면에 표시할 배열
    items() {
      const store = useSortableStore();
      return store.sortedItems.length > 0 ? store.sortedItems : this.defaultItems;
    },
    // 기본 배열
    defaultItems() {
      const store = useSortableStore();
      store.restoreSortedItems();
      return store.sortedItems.length > 0
        ? store.sortedItems
        : ['item 1', 'item 2', 'item 3', 'item 4'];
    },
  },
  beforeUnmount() {
  },
};
</script>

<style>
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  grid-gap: 10px;

}

.sortable-item {
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
  cursor: grab;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

#items li {
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
  margin: 5px;
  cursor: grab;
}

.two-column-container {
  display: flex;
}

.column {
  flex: 1;
  padding: 0 10px;
  border-right: 1px solid #ccc;
}

.column:last-child {
  border-right: none;
}
</style>