import { MovieEntity } from './../movies.service';
export const demoMovies: MovieEntity[] = [
  {
    id: '2',
    name: 'The Godfather',
    description:
      'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    image:
      'https://m.media-amazon.com/images/M/MV5BZTRmNjQ1ZjgtY2I3Yi00ZWE2LWIzYjYtYzU1M2VjOTM2ZjMyXkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_SY1000_CR0,0,675,1000_AL_.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    genres: 'drama',
    actors: ['Marlon Brando', 'Al Pacino', 'James Carney'],
    directors: ['Francis Ford Coppola'],
    writers: ['Mario Puzo'],
    productionCompanies: ['Warner Bros.'],
    rating: 9.2,
  },
  {
    id: '3',
    name: 'The Godfather: Part II',
    description:
      'In the continuing saga of the Corleone crime family, a young Vito Corleone grows up in Sicily and in 1910s New York; and he then joins the Mafia in the early 1900s.',
    image:
      'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_CR0,0,704,1000_AL_.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    genres: 'drama',
    actors: ['Al Pacino', 'Robert De Niro', 'James Carano'],
    directors: ['Francis Ford Coppola'],
    writers: ['Mario Puzo'],
    productionCompanies: ['Warner Bros.'],
    rating: 9.0,
  },
  {
    id: '4',
    name: 'The Dark Knight',
    description:
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, the caped crusader must come to terms with one of the greatest psychological tests of his ability to fight injustice.',
    image:
      'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SY1000_CR0,0,675,1000_AL_.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    genres: 'action',
    actors: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    directors: ['Christopher Nolan'],
    writers: ['Jonathan Nolan', ' Christopher Nolan'],
    productionCompanies: ['Warner Bros.'],
    rating: 9.0,
  },
];
