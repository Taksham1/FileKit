// pdf.js 5.x uses Map/WeakMap.getOrInsertComputed, which older browsers lack.
for (const C of [Map, WeakMap]) {
  if (!C.prototype.getOrInsertComputed) {
    C.prototype.getOrInsertComputed = function (key, compute) {
      if (!this.has(key)) this.set(key, compute(key));
      return this.get(key);
    };
  }
  if (!C.prototype.getOrInsert) {
    C.prototype.getOrInsert = function (key, value) {
      if (!this.has(key)) this.set(key, value);
      return this.get(key);
    };
  }
}
