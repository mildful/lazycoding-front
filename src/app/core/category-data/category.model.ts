export interface Category {
  readonly 'id': number;
  readonly 'count': number;
  readonly 'description': string;
  readonly 'custom_image': string;
  readonly 'link': string;
  readonly 'name': string;
  readonly 'slug': string;
  readonly 'taxonomy': string;
  readonly 'parent': number;
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
