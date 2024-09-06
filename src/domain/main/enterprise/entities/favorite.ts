import { Entity } from '../../../../core/entities/entity';
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';

export interface FavoriteProps {
  title: string;
  stars: number;
}

export class Favorite extends Entity<FavoriteProps> {
  get title() {
    return this.props.title;
  }

  get stars() {
    return this.props.stars;
  }

  static create(props: FavoriteProps, id?: UniqueEntityId) {
    const favorite = new Favorite(props, id);

    return favorite;
  }
}
