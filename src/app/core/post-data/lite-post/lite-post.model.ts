export interface LitePost {
  readonly 'id': number;
  readonly 'date': string;
  readonly 'slug': string;
  readonly 'custom_cover': string;
  readonly 'title': {
    'rendered': string;
  };
  readonly 'author': number;
  readonly 'categories': number[];
  readonly 'tags': number[];
}
