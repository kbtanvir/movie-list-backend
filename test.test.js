let x = new Map();

x.set('id', 'one');

// let remove = x.delete('id');

x.delete('id');
x.set('id', 'one');

let check = x.get('id') === 'one';

console.table({ check });
