let x = [
  {
    id: '1',
    email: 'max@gmail.com',
    password: 'max',
    firstName: 'Max',
    lastName: 'Smith',
  },
  {
    id: '2',
    email: 'daisy@gmail.com',
    password: 'daisy',
    firstName: 'Daisy',
    lastName: 'Smith',
  },
  {
    id: '3',
    email: 'tanvir@gmail.com',
    password: '5461651',
    firstName: 'Tanvir',
    lastName: 'Smith',
  },
];

function findByEmail(email) {
  return x.find((user) => user.email === email);
}

let res = findByEmail('max@gmail.com')
console.log(res)