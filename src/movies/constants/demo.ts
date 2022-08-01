import { MovieEntity } from './../movies.service';

export const demoMovies: MovieEntity[] = [...Array(20)].map((_, i) => ({
  id: `${i}`,
  name: (() => {
    const names = [
      'The Shawshank Redemption',
      'The Godfather',
      'The Godfather: Part II',
      'The Dark Knight',
      '12 Angry Monkeys',
      "Schindler's List",
      'Pulp Fiction',
      'The Lord of the Rings: The Return of the King',
      'The Lord of the Rings: The Fellowship of the Ring',
      'The Lord of the Rings',
      'Fight Club',
      'Star Wars: Episode V - The Empire Strikes Back',
      'Star Wars: Episode IV - A New Hope',
      'Star Wars: Episode III - Revenge of the Sith',
      'Star Wars: Episode II - Attack of the Clones',
      'Star Wars: Episode I - The Phantom Menace',
      'Forrest Gump',
      'Inception',
      'The Lord of the Rings: The Two Towers',
      'The Lord of the Rings: The Return of the King',
    ];
    return names[i];
  })(),
  description: `Description of movie ${i}.`,

  image: (() => {
    return `https://picsum.photos/id/${i}/300/400`;
  })(),

  createdAt: (() => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  })(),
  updatedAt: (() => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  })(),
  genres: (() => {
    const genres = ['action', 'comedy', 'drama', 'thriller'];
    return genres.slice(0, Math.floor(Math.random() * 3) + 1);
  })(),
  actors: (() => {
    const list = [
      'Ralph Fiennes',
      'Sylvester Stallone',
      'Michael Caine',
      'Martin Balsam',
      'John Cusack',
      'Tom Hanks',
      'Julianne Moore',
      'Samuel L. Jackson',
      'Brad Pitt',
      'Al Pacino',
      'Tom Hanks',
      'Tim Robbins',
      'Morgan Freeman',
      'Bob Gunton',
      'William Shatner',
      'Harold Ramis',
      'Ralph Fiennes',
      'Sylvester Stallone',
      'Michael Caine',
      'Martin Balsam',
      'John Cusack',
      'Tom Hanks',
      'Julianne Moore',
      'Samuel L. Jackson',
      'Brad Pitt',
      'Al Pacino',
      'Tom Hanks',
      'Tim Robbins',
    ];
    return list.slice(0, Math.floor(Math.random() * 10) + 1);
  })(),
  directors: (() => {
    const list = [
      'Frank Darabont',
      'Francis Ford Coppola',
      'Tim Burton',
      'Steven Spielberg',
      'Martin Scorsese',
    ];
    return list.slice(0, Math.floor(Math.random() * 5) + 1);
  })(),
  productionCompanies: (() => {
    const companies = ['Warner Bros', 'Paramount', 'Universal'];
    return companies.sort(() => Math.random() - 0.5);
  })(),
  rating: (() => {
    return Math.floor(Math.random() * 10);
  })(),
}));
