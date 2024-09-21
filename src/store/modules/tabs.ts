import { defineStore } from 'pinia';
import { useRoute, useRouter } from 'vue-router';

type Tab = {
  name: string;
  link: string;
};

export const TAB_PERSISTENCE_KEYS = {
  TABS: 'tiny-pro::tabs',
  CURRENT: 'tiny-pro::tabs:current',
};

const initTabs = () => {
  const tabs = JSON.parse(
    localStorage.getItem(TAB_PERSISTENCE_KEYS.TABS) ?? '[]',
  ) as Tab[];
  const routes = useRouter()
    .getRoutes()
    .map((route) => route.path);
  return tabs.filter((tab) => routes.includes(tab.link));
};
const initCurrent = () => {
  const current = JSON.parse(
    localStorage.getItem(TAB_PERSISTENCE_KEYS.CURRENT) ?? '{}',
  ) as Tab;
  return current;
};

export const useTabStore = defineStore('tabs', {
  state() {
    return {
      data: initTabs(),
      current: initCurrent(),
    };
  },
  actions: {
    add(item: Tab) {
      if (!item.name) {
        return { ...item };
      }
      if (!this.has(item.name)) {
        this.data.push(item);
      }
      this.current = item;
      localStorage.setItem(
        TAB_PERSISTENCE_KEYS.TABS,
        JSON.stringify(this.data),
      );
      return { ...item };
    },
    set(name: string) {
      this.current = this.getByName(name)[0] ?? null;
      localStorage.setItem(
        TAB_PERSISTENCE_KEYS.CURRENT,
        JSON.stringify(this.current),
      );
      return this.current;
    },
    has(name: string) {
      return this.data.some((tab) => tab.name === name);
    },
    getByName(name: string) {
      return this.data.filter((tab) => tab.name === name);
    },
    getByLink(link: string) {
      return this.data.filter((tab) => tab.link === link);
    },
    delByLink(link: string, endsWith = false) {
      let curName = '';
      if (this.data.length === 1) {
        return '';
      }
      const idx = this.data.findIndex((tab) =>
        endsWith ? tab.link.endsWith(link) : tab.link === link,
      );
      if (idx === -1) {
        return '';
      }
      const hasNext = idx < this.data.length - 1;
      if (hasNext) {
        curName = this.data[idx + 1].name;
      } else {
        const hasPrev = idx > 0;
        if (hasPrev) {
          curName = this.data[idx - 1].name;
        }
      }
      this.data.splice(idx, 1);
      localStorage.setItem(
        TAB_PERSISTENCE_KEYS.TABS,
        JSON.stringify(this.data),
      );
      return curName;
    },
  },
});
