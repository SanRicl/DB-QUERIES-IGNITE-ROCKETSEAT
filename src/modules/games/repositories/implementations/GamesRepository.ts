import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;
  private userRepository: Repository<User>;

  constructor() {
    this.repository = getRepository(Game);
    this.userRepository = getRepository(User);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const game = this.repository
      .createQueryBuilder("games")
      .where("LOWER(title) ILIKE LOWER(:param)", { param: `%${param}%` })
      .getMany();
    return game;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT count(id) FROM games");
  }
  async findUsersByGameId(id: string): Promise<User[]> {
    const users = this.userRepository
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.games", "games")
      .where("games.id = :id", { id: id })
      .getMany();

    return users;
  }
}
