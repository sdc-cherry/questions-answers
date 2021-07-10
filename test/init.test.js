const cloneArray = require('./init');

test('properly clones array using toBe', () => {
  const array = [1,2,3];
  expect(cloneArray(array)).toEqual(array);
  expect(cloneArray(array)).toStrictEqual(array);
  expect(cloneArray(array)).not.toBe(array);
})