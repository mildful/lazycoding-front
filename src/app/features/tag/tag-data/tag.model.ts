export interface Tag {
  readonly 'id': number | string;
  readonly 'count': number;
  readonly 'description': string;
  readonly 'link': string;
  readonly 'name': string;
  readonly 'slug': string;
  readonly 'taxonomy': string;
  readonly 'meta': any[];
  readonly '_links': {
    'self': [
      {
        'href': string;
      }
      ],
    'collection': [
      {
        'href': string;
      }
      ],
    'about': [
      {
        'href': string;
      }
      ],
    'wp:post_type': [
      {
        'href': string;
      }
      ],
    'curies': {
      'name': string;
      'href': string;
      'tempalted': boolean;
    }[]
  };
}
