<template>
  <div>
    <h1>Simple List Example</h1>
    <div class="two-column-container">
      <ul id="items" class="column">
        <li v-for="(item, index) in items" :key="index" class="sortable-item">
          {{ item }}
        </li>
      </ul>
    </div>
    <!-- 선택 버튼 -->
    <button @click="toggleDropdown">변경</button>
    <div v-if="showDropdown">
      <!-- <input type="checkbox" value="all" v-model="selectAll" id="all"/>
        <label for="all">전체</label> -->
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
import { useSortableStore } from './store'; // Pinia 스토어 가져오기

export default {
  data() {
    return {
      allItems: ['item 1', 'item 2', 'item 3', 'item 4'],
      selectedItems: [],
      showDropdown: false,
    };
  },
  mounted() {
    const store = useSortableStore(); // 스토어 인스턴스 생성
    store.restoreSortedItems();
    
    const sortableList = new Sortable(this.$el.querySelector('#items'), {
      animation: 150, // 드래그 애니메이션 속도 (ms)
      onEnd: (evt) => {
        const newItems = evt.from.children;
        // 아이템의 텍스트를 배열로 저장
        const sortedItems = Array.from(newItems).map((el) => el.textContent);
        store.setSortedItems(sortedItems);
        store.saveSortedItems();
        this.updateSortableList(sortedItems);
      },
    });
  },
  methods: {
    // 저장 버튼 클릭 시
    saveSorting() {
      const store = useSortableStore(); // Pinia 스토어 인스턴스 생성
      const sortableList = this.$el.querySelector('#items');
      const newItems = sortableList.children;
      const sortedItems = Array.from(newItems).map((el) => el.textContent);
      store.setSortedItems(sortedItems);
      store.saveSortedItems();
      console.log('저장:', sortedItems);
      // 저장 후 showDropdown 값을 false로 설정
      this.showDropdown = false;
    },
    // 선택 버튼 클릭 시
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    // 아이템 추가
    addSelectedItems() {
      if (this.selectedItems.length > 0) {
        const store = useSortableStore();
        this.selectedItems.forEach(item => {
          if (!store.sortedItems.includes(item)) {
            store.sortedItems.push(item);
          }
        });
        this.updateSortableList(store.sortedItems);
      }
    },
    // 아이템 삭제
    removeSelectedItems() {
      const store = useSortableStore();
      this.selectedItems.forEach(item => {
        const index = store.sortedItems.indexOf(item);
        if (index !== -1) {
          store.sortedItems.splice(index, 1);
        }
      });
      this.updateSortableList(store.sortedItems);
    },
    // list 업데이트
    updateSortableList(items) {
      const sortableList = this.$el.querySelector('#items');
      sortableList.innerHTML = '';        // 기존의 아이템들을 제거

      items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        sortableList.appendChild(li);     // 새로운 아이템을 추가
      });
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