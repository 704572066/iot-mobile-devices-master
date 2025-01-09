export const myStorage = {
  get(key) {
    return uni.getStorageSync(key)
  },
  set(key, val) {
    uni.setStorageSync(key, val)
  }
}
