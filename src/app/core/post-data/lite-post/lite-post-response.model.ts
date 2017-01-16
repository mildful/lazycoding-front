import { LitePost } from './lite-post.model';

export interface LitePostResponse {
  posts: LitePost[];
  complete: boolean;
}
