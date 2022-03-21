class kkCache {
  constructor(isLocal = true) {
    this.storage = isLocal ? localStorage : sessionStorage;
  }
  setItem(key, value) {
    if (value) {
      this.storage.setItem(key, JSON.stringify(value));
    }
  }
  getItem(key) {
    let value = this.storage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
  }
  removeItem(key) {
    this.storage.removeItem(key);
  }
  clear() {
    this.storage.clear();
  }
  key(index) {
    return this.storage.key(index);
  }
  length() {
    return this.storage.length();
  }
}
const localStorage = new kkCache();
const sessionStorage = new kkCache(false);
export { loaclStorage, sessionStorage };
